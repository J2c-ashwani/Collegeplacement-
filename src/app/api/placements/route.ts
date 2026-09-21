import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireApiAuth } from '@/lib/auth-utils'
import { successResponse, validationError, handleApiError, notFoundError } from '@/lib/errors'
import { createAuditLog, AuditActions } from '@/services/audit.service'
import { z } from 'zod'

const confirmPlacementSchema = z.object({
  offerId: z.string(),
  ctc: z.number().positive(),
  joiningDate: z.string().datetime(),
  verificationNotes: z.string().optional(),
})

const reversePlacementSchema = z.object({
  placementId: z.string(),
  reason: z.string().min(5),
  leftDate: z.string().datetime(),
})

// GET /api/placements - List verified placements
export async function GET(req: NextRequest) {
  try {
    const session = await requireApiAuth()
    const { searchParams } = new URL(req.url)
    const institutionId = searchParams.get('institutionId')

    const where: any = {}
    if (institutionId) where.institutionId = institutionId

    // Enforce data isolation: Institution Admin can only view their own institution's placements
    if (session.user.role === 'INSTITUTION_ADMIN' && session.user.institutionId) {
      where.institutionId = session.user.institutionId
    }

    const placements = await prisma.placement.findMany({
      where,
      include: {
        student: {
          include: { user: true, profile: true },
        },
        institution: {
          select: { id: true, name: true, code: true },
        },
        employer: {
          select: { id: true, name: true, industry: true },
        },
        job: {
          select: { id: true, title: true, department: true },
        },
        offer: true,
        employerFees: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return successResponse(placements)
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/placements - Confirm placement and trigger employer fee
export async function POST(req: NextRequest) {
  try {
    const session = await requireApiAuth(['SUPER_ADMIN', 'OPERATIONS'])
    const body = await req.json()
    const parsed = confirmPlacementSchema.safeParse(body)

    if (!parsed.success) {
      return validationError('Invalid placement confirmation details', parsed.error.format() as any)
    }

    const { offerId, ctc, joiningDate, verificationNotes } = parsed.data

    const offer = await prisma.offer.findUnique({
      where: { id: offerId },
      include: {
        student: true,
        employer: true,
        job: true,
      },
    })

    if (!offer) return notFoundError('Offer record not found')

    // Generate unique placement code (e.g. PLC-2026-000182)
    const placementCount = await prisma.placement.count()
    const placementCode = `PLC-${new Date().getFullYear()}-${String(placementCount + 1).padStart(6, '0')}`

    // Find or create valid EmployerFeeRule (ensures strict FK integrity)
    let feeRule = await prisma.employerFeeRule.findFirst({
      where: {
        OR: [
          { employerId: offer.employerId, isActive: true },
          { employerId: null, isActive: true },
        ],
      },
      orderBy: { employerId: 'desc' }, // employer-specific rule takes precedence over platform default
    })

    if (!feeRule) {
      feeRule = await prisma.employerFeeRule.create({
        data: {
          employerId: offer.employerId,
          feeType: 'SUCCESS_FEE',
          feeAmount: 10000,
          trigger: 'CANDIDATE_JOINED',
          isActive: true,
        },
      })
    }

    let feeAmount = 10000
    if (feeRule.feeAmount) feeAmount = Number(feeRule.feeAmount)
    else if (feeRule.feePercentage) feeAmount = (ctc * feeRule.feePercentage) / 100

    const gstAmount = feeAmount * 0.18
    const totalAmount = feeAmount + gstAmount

    // Execute placement confirmation, status transitions, and billing atomically
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Placement
      const placement = await tx.placement.create({
        data: {
          offerId,
          studentId: offer.studentId,
          institutionId: offer.institutionId,
          employerId: offer.employerId,
          jobId: offer.jobId,
          placementCode,
          ctc,
          joiningDate: new Date(joiningDate),
          joinedAt: new Date(),
          status: 'VERIFIED',
          verifiedBy: session.user.id,
          verifiedAt: new Date(),
          verificationNotes: verificationNotes || 'Offer and joining confirmed by placement operations.',
        },
      })

      // 2. Update Offer and Student Status
      await tx.offer.update({
        where: { id: offerId },
        data: { status: 'JOINED' },
      })

      await tx.student.update({
        where: { id: offer.studentId },
        data: { status: 'PLACED' },
      })

      await tx.studentProgramme.updateMany({
        where: { studentId: offer.studentId, status: 'ACTIVE' },
        data: { status: 'PLACED', assuranceStatus: 'PLACED' },
      })

      // 3. Automated Employer Fee Trigger (Success Fee)
      const employerFee = await tx.employerFee.create({
        data: {
          employerFeeRuleId: feeRule.id,
          employerId: offer.employerId,
          placementId: placement.id,
          studentId: offer.studentId,
          jobId: offer.jobId,
          amount: feeAmount,
          gstAmount,
          totalAmount,
          status: 'GENERATED',
          paymentDueDate: new Date(Date.now() + 30 * 86400000), // 30 days
        },
      })

      return { placement, employerFee }
    })

    await createAuditLog({
      userId: session.user.id,
      userRole: session.user.role,
      action: AuditActions.PLACEMENT_CONFIRMED,
      entity: 'Placement',
      entityId: result.placement.id,
      newValue: {
        placementCode,
        ctc,
        employerFeeId: result.employerFee.id,
        totalFee: totalAmount,
      },
    })

    return successResponse(
      {
        placementCode,
        placementId: result.placement.id,
        employerFeeId: result.employerFee.id,
        totalAmount,
        message: `Placement verified with code ${placementCode}. Employer fee generated.`,
      },
      undefined,
      201
    )
  } catch (error) {
    return handleApiError(error)
  }
}

// PATCH /api/placements - Reversal logic (e.g. left during probation)
export async function PATCH(req: NextRequest) {
  try {
    const session = await requireApiAuth(['SUPER_ADMIN', 'OPERATIONS'])
    const body = await req.json()
    const parsed = reversePlacementSchema.safeParse(body)

    if (!parsed.success) {
      return validationError('Invalid reversal payload', parsed.error.format() as any)
    }

    const { placementId, reason, leftDate } = parsed.data

    const placement = await prisma.placement.update({
      where: { id: placementId },
      data: {
        status: 'LEFT_WITHIN_PROBATION',
        leftDate: new Date(leftDate),
        leftReason: reason,
      },
    })

    // Waive employer fee if not yet paid
    await prisma.employerFee.updateMany({
      where: { placementId, status: 'GENERATED' },
      data: { status: 'WAIVED', disputeReason: reason },
    })

    await createAuditLog({
      userId: session.user.id,
      userRole: session.user.role,
      action: AuditActions.PLACEMENT_REVERSED,
      entity: 'Placement',
      entityId: placement.id,
      newValue: { reason, leftDate },
    })

    return successResponse({
      message: 'Placement status updated to LEFT_WITHIN_PROBATION. Associated fee waived.',
    })
  } catch (error) {
    return handleApiError(error)
  }
}
