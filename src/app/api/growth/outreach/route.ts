import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireApiAuth } from '@/lib/auth-utils'
import { successResponse, handleApiError, forbiddenError, validationError } from '@/lib/errors'
import { defaultEmailProvider } from '@/services/growth-providers'
import { createAuditLog } from '@/services/audit.service'
import { z } from 'zod'

const approveOutreachSchema = z.object({
  outreachId: z.string().optional(),
  action: z.enum(['APPROVE', 'REJECT']).optional(),
  bulkApproveSafe: z.boolean().optional(),
})

export async function GET(req: NextRequest) {
  try {
    const session = await requireApiAuth()
    if (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'OPERATIONS') {
      return forbiddenError('Access restricted to Platform Operations')
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') || 'DRAFT_PENDING_APPROVAL'

    const drafts = await prisma.growthOutreach.findMany({
      where: status !== 'ALL' ? { status } : undefined,
      include: {
        collegeProspect: true,
        employerProspect: true,
        step: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return successResponse(drafts)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireApiAuth()
    if (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'OPERATIONS') {
      return forbiddenError('Access restricted to Platform Operations')
    }

    const body = await req.json()
    const parsed = approveOutreachSchema.parse(body)

    // Bulk approve all safe actions
    if (parsed.bulkApproveSafe) {
      const safeDrafts = await prisma.growthOutreach.findMany({
        where: {
          status: 'DRAFT_PENDING_APPROVAL',
          isSafeAction: true,
        },
        include: {
          collegeProspect: true,
          employerProspect: true,
        },
      })

      let sentCount = 0
      for (const draft of safeDrafts) {
        const recipient = draft.collegeProspect?.tpoEmail || draft.employerProspect?.recruiterEmail
        if (!recipient) continue

        const sendRes = await defaultEmailProvider.send({
          to: recipient,
          subject: draft.subject,
          body: draft.body,
        })

        await prisma.growthOutreach.update({
          where: { id: draft.id },
          data: {
            status: 'SENT',
            approvedBy: session.user.id,
            approvedAt: new Date(),
            sentAt: new Date(),
            providerMessageId: sendRes.messageId,
          },
        })

        await prisma.outreachEvent.create({
          data: {
            outreachId: draft.id,
            eventType: 'SENT',
            payload: { providerMessageId: sendRes.messageId, recipient },
          },
        })
        sentCount++
      }

      await createAuditLog({
        userId: session.user.id,
        userRole: session.user.role,
        action: 'GROWTH_OUTREACH_BULK_APPROVED',
        entity: 'GrowthOutreach',
        newValue: { sentCount },
      })

      return successResponse({
        message: `Successfully approved and dispatched ${sentCount} safe outreach messages`,
        count: sentCount,
      })
    }

    if (!parsed.outreachId || !parsed.action) {
      return validationError('Outreach ID and action are required')
    }

    const draft = await prisma.growthOutreach.findUnique({
      where: { id: parsed.outreachId },
      include: {
        collegeProspect: true,
        employerProspect: true,
      },
    })

    if (!draft) {
      return validationError('Outreach draft not found')
    }

    if (parsed.action === 'REJECT') {
      const updated = await prisma.growthOutreach.update({
        where: { id: draft.id },
        data: { status: 'REJECTED' },
      })
      return successResponse(updated)
    }

    // Approve and send individual draft
    const recipient = draft.collegeProspect?.tpoEmail || draft.employerProspect?.recruiterEmail
    if (!recipient) {
      return validationError('Target prospect does not have a valid contact email')
    }

    const sendRes = await defaultEmailProvider.send({
      to: recipient,
      subject: draft.subject,
      body: draft.body,
    })

    const updated = await prisma.growthOutreach.update({
      where: { id: draft.id },
      data: {
        status: 'SENT',
        approvedBy: session.user.id,
        approvedAt: new Date(),
        sentAt: new Date(),
        providerMessageId: sendRes.messageId,
      },
    })

    await prisma.outreachEvent.create({
      data: {
        outreachId: draft.id,
        eventType: 'SENT',
        payload: { providerMessageId: sendRes.messageId, recipient },
      },
    })

    await createAuditLog({
      userId: session.user.id,
      userRole: session.user.role,
      action: 'GROWTH_OUTREACH_APPROVED',
      entity: 'GrowthOutreach',
      entityId: draft.id,
      newValue: { recipient, subject: draft.subject },
    })

    return successResponse(updated)
  } catch (error) {
    return handleApiError(error)
  }
}
