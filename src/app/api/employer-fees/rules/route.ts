import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireApiAuth } from '@/lib/auth-utils'
import { successResponse, validationError, handleApiError } from '@/lib/errors'
import { createAuditLog, AuditActions } from '@/services/audit.service'
import { z } from 'zod'

const createFeeRuleSchema = z.object({
  employerId: z.string().optional(),
  feeType: z.enum(['SUCCESS_FEE', 'CAMPAIGN_FEE', 'SUBSCRIPTION']).default('SUCCESS_FEE'),
  feeAmount: z.number().positive().optional(),
  feePercentage: z.number().min(0).max(100).optional(),
  feeCurrency: z.string().default('INR'),
  trigger: z.enum(['CANDIDATE_JOINED', 'OFFER_ACCEPTED', 'CAMPAIGN_START']).default('CANDIDATE_JOINED'),
  isActive: z.boolean().default(true),
})

// GET /api/employer-fees/rules - List fee rules
export async function GET(req: NextRequest) {
  try {
    const session = await requireApiAuth(['SUPER_ADMIN', 'OPERATIONS'])
    const { searchParams } = new URL(req.url)
    const employerId = searchParams.get('employerId')

    const where: any = {}
    if (employerId) where.employerId = employerId

    const rules = await prisma.employerFeeRule.findMany({
      where,
      include: {
        employer: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return successResponse(rules)
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/employer-fees/rules - Create or update fee rule
export async function POST(req: NextRequest) {
  try {
    const session = await requireApiAuth(['SUPER_ADMIN', 'OPERATIONS'])
    const body = await req.json()
    const parsed = createFeeRuleSchema.safeParse(body)

    if (!parsed.success) {
      return validationError('Invalid fee rule details', parsed.error.format() as any)
    }

    const data = parsed.data

    if (!data.feeAmount && !data.feePercentage) {
      return validationError('Either feeAmount or feePercentage must be specified')
    }

    const rule = await prisma.employerFeeRule.create({
      data: {
        employerId: data.employerId,
        feeType: data.feeType,
        feeAmount: data.feeAmount,
        feePercentage: data.feePercentage,
        feeCurrency: data.feeCurrency,
        trigger: data.trigger,
        isActive: data.isActive,
      },
    })

    await createAuditLog({
      userId: session.user.id,
      userRole: session.user.role,
      action: AuditActions.SETTING_CHANGED,
      entity: 'EmployerFeeRule',
      entityId: rule.id,
      newValue: { ...data },
    })

    return successResponse(rule, undefined, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
