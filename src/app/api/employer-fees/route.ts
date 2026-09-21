import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireApiAuth } from '@/lib/auth-utils'
import { successResponse, handleApiError } from '@/lib/errors'

// GET /api/employer-fees - List employer fees with optional filtering
export async function GET(req: NextRequest) {
  try {
    const session = await requireApiAuth(['SUPER_ADMIN', 'OPERATIONS', 'EMPLOYER'])
    const { searchParams } = new URL(req.url)
    const employerId = searchParams.get('employerId')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const where: any = {}
    if (status) where.status = status

    // If employer user, restrict to own fees
    if (session.user.role === 'EMPLOYER') {
      const employerUser = await prisma.employerUser.findFirst({
        where: { userId: session.user.id },
      })
      if (employerUser) where.employerId = employerUser.employerId
    } else if (employerId) {
      where.employerId = employerId
    }

    const [fees, total] = await Promise.all([
      prisma.employerFee.findMany({
        where,
        skip,
        take: limit,
        orderBy: { generatedAt: 'desc' },
        include: {
          employer: { select: { id: true, name: true, industry: true } },
          placement: {
            select: {
              id: true,
              placementCode: true,
              ctc: true,
              joiningDate: true,
              joinedAt: true,
            },
          },
          student: {
            select: {
              id: true,
              enrollmentNumber: true,
              user: { select: { name: true, email: true } },
            },
          },
          job: { select: { id: true, title: true } },
          invoice: true,
        },
      }),
      prisma.employerFee.count({ where }),
    ])

    return successResponse(fees, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    return handleApiError(error)
  }
}
