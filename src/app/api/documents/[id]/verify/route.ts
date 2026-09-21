import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireApiAuth } from '@/lib/auth-utils'
import { successResponse, validationError, handleApiError, notFoundError } from '@/lib/errors'
import { createAuditLog, AuditActions } from '@/services/audit.service'
import { z } from 'zod'

const verifyDocSchema = z.object({
  verificationStatus: z.enum(['VERIFIED', 'REJECTED', 'FLAGGED']),
  verificationComment: z.string().optional(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireApiAuth(['SUPER_ADMIN', 'OPERATIONS'])
    const { id } = await params
    const body = await req.json()
    const parsed = verifyDocSchema.safeParse(body)

    if (!parsed.success) {
      return validationError('Invalid verification parameters', parsed.error.format() as any)
    }

    const { verificationStatus, verificationComment } = parsed.data

    const doc = await prisma.document.findUnique({
      where: { id },
    })

    if (!doc) return notFoundError('Document not found')

    const updated = await prisma.document.update({
      where: { id },
      data: {
        verificationStatus,
        verificationComment,
        verifiedBy: session.user.id,
        verifiedAt: new Date(),
      },
    })

    // Access Log
    await prisma.documentAccessLog.create({
      data: {
        documentId: id,
        userId: session.user.id,
        action: verificationStatus === 'VERIFIED' ? 'VERIFIED' : 'REJECTED',
        ip: req.headers.get('x-forwarded-for') || '127.0.0.1',
        userAgent: req.headers.get('user-agent') || 'system',
      },
    })

    await createAuditLog({
      userId: session.user.id,
      userRole: session.user.role,
      action: AuditActions.DOCUMENT_VERIFIED,
      entity: 'Document',
      entityId: id,
      newValue: { verificationStatus, verificationComment },
    })

    return successResponse({
      id: updated.id,
      verificationStatus: updated.verificationStatus,
      message: `Document marked as ${verificationStatus}`,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
