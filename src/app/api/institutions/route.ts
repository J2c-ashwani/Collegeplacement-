import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireApiAuth } from '@/lib/auth-utils'
import { successResponse, errorResponse, validationError, handleApiError } from '@/lib/errors'
import { createAuditLog, AuditActions } from '@/services/audit.service'
import { z } from 'zod'

const createInstitutionSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  code: z.string().min(2).regex(/^[a-z0-9-]+$/, 'Code must be lowercase alphanumeric with hyphens'),
  registrationCode: z.string().min(3).regex(/^[A-Z0-9]+$/, 'Registration code must be uppercase alphanumeric (e.g. APX123)'),
  type: z.enum(['ENGINEERING', 'ARTS_SCIENCE', 'MANAGEMENT', 'POLYTECHNIC', 'UNIVERSITY', 'OTHER']),
  universityAffiliation: z.string().optional(),
  accreditation: z.string().optional(),
  address: z.string().min(3),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  principalName: z.string().min(2),
  tpoName: z.string().min(2),
  tpoEmail: z.string().email(),
  officialPhone: z.string().min(10),
  estimatedStudentCount: z.number().int().positive().default(500),
  departments: z.array(z.string()).default([]),
  graduationBatches: z.array(z.string()).default(['2026']),
  placementPercentage: z.number().min(0).max(100).optional(),
})

// GET /api/institutions - List institutions with status and active membership info
export async function GET(req: NextRequest) {
  try {
    const session = await requireApiAuth(['SUPER_ADMIN', 'OPERATIONS'])
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const where: any = {}
    if (status) where.status = status
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { registrationCode: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [institutions, total] = await Promise.all([
      prisma.institution.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          memberships: {
            where: { status: 'ACTIVE' },
            include: { plan: true },
            take: 1,
            orderBy: { createdAt: 'desc' },
          },
          _count: {
            select: {
              students: true,
              rosterStudents: true,
            },
          },
        },
      }),
      prisma.institution.count({ where }),
    ])

    return successResponse(institutions, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/institutions - Create institution
export async function POST(req: NextRequest) {
  try {
    const session = await requireApiAuth(['SUPER_ADMIN', 'OPERATIONS'])
    const body = await req.json()
    const parsed = createInstitutionSchema.safeParse(body)

    if (!parsed.success) {
      return validationError('Invalid institution details', parsed.error.format() as any)
    }

    const data = parsed.data

    // Check duplicate code or registrationCode
    const existing = await prisma.institution.findFirst({
      where: {
        OR: [
          { code: data.code },
          { registrationCode: data.registrationCode },
          { tpoEmail: data.tpoEmail },
        ],
      },
    })

    if (existing) {
      return errorResponse(
        'CONFLICT',
        'An institution with this slug code, registration code, or TPO email already exists',
        409
      )
    }

    const institution = await prisma.institution.create({
      data: {
        ...data,
        status: 'APPROVED',
        approvedAt: new Date(),
        approvedBy: session.user.id,
      },
    })

    await createAuditLog({
      userId: session.user.id,
      userRole: session.user.role,
      action: AuditActions.INSTITUTION_CREATED,
      entity: 'Institution',
      entityId: institution.id,
      newValue: { name: institution.name, code: institution.code },
    })

    return successResponse(institution, undefined, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
