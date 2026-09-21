import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireApiAuth } from '@/lib/auth-utils'
import { getStorageService, generateStorageKey, validateFile } from '@/services/storage.service'
import { successResponse, validationError, handleApiError, notFoundError } from '@/lib/errors'
import { createAuditLog, AuditActions } from '@/services/audit.service'
import { z } from 'zod'

const uploadDocumentSchema = z.object({
  type: z.enum([
    'RESUME',
    'ACADEMIC',
    'ID_DOCUMENT',
    'OFFER_LETTER',
    'MOU_DOCUMENT',
    'INSTITUTION_DOC',
    'EMPLOYER_DOC',
    'INVOICE_DOC',
    'CERTIFICATE',
    'ACTIVITY_REPORT',
    'PROFILE_PHOTO',
    'OTHER',
  ]),
  entityType: z.string().optional(),
  entityId: z.string().optional(),
  studentId: z.string().optional(),
  institutionId: z.string().optional(),
  employerId: z.string().optional(),
  placementId: z.string().optional(),
  offerId: z.string().optional(),
  filename: z.string().min(1),
  mimeType: z.string().min(1),
  size: z.number().positive(),
  base64Content: z.string().optional(), // For direct upload
})

// GET /api/documents - List documents with role-based filtering
export async function GET(req: NextRequest) {
  try {
    const session = await requireApiAuth()
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type')
    const studentId = searchParams.get('studentId')
    const institutionId = searchParams.get('institutionId')

    const where: any = {}
    if (type) where.type = type
    if (studentId) where.studentId = studentId
    if (institutionId) where.institutionId = institutionId

    // Role-based visibility enforcement
    if (session.user.role === 'INSTITUTION_ADMIN' && session.user.institutionId) {
      where.institutionId = session.user.institutionId
    } else if (session.user.role === 'STUDENT') {
      const stu = await prisma.student.findFirst({ where: { userId: session.user.id } })
      if (stu) where.studentId = stu.id
    }

    const documents = await prisma.document.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        student: { select: { id: true, enrollmentNumber: true, user: { select: { name: true } } } },
        institution: { select: { id: true, name: true } },
        employer: { select: { id: true, name: true } },
      },
    })

    return successResponse(documents)
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/documents - Upload document record & save to private storage
export async function POST(req: NextRequest) {
  try {
    const session = await requireApiAuth()
    const body = await req.json()
    const parsed = uploadDocumentSchema.safeParse(body)

    if (!parsed.success) {
      return validationError('Invalid document upload parameters', parsed.error.format() as any)
    }

    const data = parsed.data

    // Validate size and mime type
    const fileValidation = validateFile({
      name: data.filename,
      type: data.mimeType,
      size: data.size,
    })

    if (!fileValidation.valid) {
      return validationError(fileValidation.error || 'Invalid file')
    }

    // Generate unique private storage key
    const entityType = data.entityType || data.type.toLowerCase()
    const entityId = data.entityId || data.studentId || data.institutionId || session.user.id
    const storageKey = generateStorageKey(entityType, entityId, data.filename)

    // Save content to storage if provided
    if (data.base64Content) {
      const storage = getStorageService()
      const buffer = Buffer.from(data.base64Content, 'base64')
      await storage.uploadFile(storageKey, buffer, data.mimeType)
    }

    // Create Document record
    const document = await prisma.document.create({
      data: {
        type: data.type,
        entityType,
        entityId,
        studentId: data.studentId,
        institutionId: data.institutionId || session.user.institutionId,
        employerId: data.employerId,
        placementId: data.placementId,
        filename: data.filename,
        originalFilename: data.filename,
        storageKey,
        mimeType: data.mimeType,
        size: data.size,
        uploadedBy: session.user.id,
        verificationStatus: 'PENDING',
      },
    })

    // If this is an offer letter for an offer, link it
    if (data.type === 'OFFER_LETTER' && data.offerId) {
      await prisma.offer.update({
        where: { id: data.offerId },
        data: {
          offerLetterDocumentId: document.id,
          status: 'OFFER_RECEIVED',
        },
      })
    }

    // Log Access Trail
    await prisma.documentAccessLog.create({
      data: {
        documentId: document.id,
        userId: session.user.id,
        action: 'UPLOADED',
        ip: req.headers.get('x-forwarded-for') || '127.0.0.1',
        userAgent: req.headers.get('user-agent') || 'system',
      },
    })

    await createAuditLog({
      userId: session.user.id,
      userRole: session.user.role,
      action: AuditActions.DOCUMENT_UPLOADED,
      entity: 'Document',
      entityId: document.id,
      newValue: { type: document.type, filename: document.filename },
    })

    return successResponse(
      {
        documentId: document.id,
        storageKey,
        verificationStatus: document.verificationStatus,
        message: 'Document uploaded and registered securely.',
      },
      undefined,
      201
    )
  } catch (error) {
    return handleApiError(error)
  }
}
