import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, handleApiError } from '@/lib/errors'

// GET /api/institutions/plans - Public/auth route to get active configurable plans
export async function GET() {
  try {
    const plans = await prisma.institutionPlan.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    })
    return successResponse(plans)
  } catch (error) {
    return handleApiError(error)
  }
}
