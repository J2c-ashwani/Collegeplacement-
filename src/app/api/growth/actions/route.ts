import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireApiAuth } from '@/lib/auth-utils'
import { successResponse, handleApiError, forbiddenError, validationError } from '@/lib/errors'
import { createAuditLog } from '@/services/audit.service'
import { z } from 'zod'

const actionMutationSchema = z.object({
  actionId: z.string().optional(),
  intent: z.enum(['APPROVE', 'DISMISS']).optional(),
  bulkApproveSafe: z.boolean().optional(),
})

export async function GET(_req: NextRequest) {
  try {
    const session = await requireApiAuth()
    if (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'OPERATIONS') {
      return forbiddenError('Access restricted to Platform Operations')
    }

    const actions = await prisma.growthAction.findMany({
      orderBy: { actionScore: 'desc' },
      take: 20,
    })

    return successResponse(actions)
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
    const parsed = actionMutationSchema.parse(body)

    if (parsed.bulkApproveSafe) {
      // Strictly execute only actions passing the Safe Action Policy
      const safePendingActions = await prisma.growthAction.findMany({
        where: {
          status: 'PENDING',
          isSafeAction: true,
        },
      })

      const updated = await prisma.growthAction.updateMany({
        where: {
          status: 'PENDING',
          isSafeAction: true,
        },
        data: {
          status: 'APPROVED',
        },
      })

      await createAuditLog({
        userId: session.user.id,
        userRole: session.user.role,
        action: 'GROWTH_ACTIONS_BULK_APPROVED',
        entity: 'GrowthAction',
        newValue: {
          approvedCount: updated.count,
          actionIds: safePendingActions.map((a) => a.id),
        },
      })

      return successResponse({
        message: `Successfully approved ${updated.count} safe growth actions`,
        count: updated.count,
      })
    }

    if (!parsed.actionId || !parsed.intent) {
      return validationError('Action ID and intent are required')
    }

    const action = await prisma.growthAction.findUnique({
      where: { id: parsed.actionId },
    })

    if (!action) {
      return validationError('Growth action not found')
    }

    const updated = await prisma.growthAction.update({
      where: { id: parsed.actionId },
      data: {
        status: parsed.intent === 'APPROVE' ? 'APPROVED' : 'DISMISSED',
      },
    })

    await createAuditLog({
      userId: session.user.id,
      userRole: session.user.role,
      action: parsed.intent === 'APPROVE' ? 'GROWTH_ACTION_APPROVED' : 'GROWTH_ACTION_DISMISSED',
      entity: 'GrowthAction',
      entityId: action.id,
      newValue: { status: updated.status, title: action.title },
    })

    return successResponse(updated)
  } catch (error) {
    return handleApiError(error)
  }
}
