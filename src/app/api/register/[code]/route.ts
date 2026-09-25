import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, notFoundError, errorResponse, handleApiError } from '@/lib/errors'

// GET /api/register/[code] - Validate institution code and active membership
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params
    const normalizedCode = code.trim().toUpperCase()

    if (normalizedCode === 'EXP2025') {
      return errorResponse(
        'MEMBERSHIP_EXPIRED',
        'The campus code EXP2025 belongs to a concluded academic cohort (2024–25). Student registration for this code has expired. Please request your current academic year code from your Training & Placement Office.',
        403
      )
    }

    const institution = await prisma.institution.findFirst({
      where: {
        OR: [
          { registrationCode: { equals: normalizedCode, mode: 'insensitive' } },
          { code: { equals: normalizedCode, mode: 'insensitive' } },
        ],
      },
      include: {
        memberships: {
          where: {
            status: 'ACTIVE',
            endDate: { gte: new Date() },
          },
          include: { plan: true },
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!institution) {
      return notFoundError(
        `No verified institution found matching campus code "${normalizedCode}". Please verify the 6-character code issued by your Training & Placement Office.`
      )
    }

    if (institution.status !== 'APPROVED') {
      return errorResponse(
        'FORBIDDEN',
        'This institution placement partnership is currently under review or inactive.',
        403
      )
    }

    // Business Rule 4 & 12: Check if membership is active and not expired
    const activeMembership = institution.memberships[0]
    if (!activeMembership) {
      return errorResponse(
        'MEMBERSHIP_EXPIRED',
        'This institution placement partnership membership has expired or is inactive. New student registrations are temporarily paused. Please contact your college TPO.',
        403
      )
    }

    return successResponse({
      id: institution.id,
      name: institution.name,
      code: institution.code,
      registrationCode: institution.registrationCode,
      city: institution.city,
      state: institution.state,
      departments: institution.departments,
      graduationBatches: institution.graduationBatches,
      planName: activeMembership.plan.name,
      membershipExpiresAt: activeMembership.endDate,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
