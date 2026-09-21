import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireApiAuth } from '@/lib/auth-utils'
import { successResponse, handleApiError, forbiddenError, validationError } from '@/lib/errors'
import { normalizeDomain, evaluateCollegeICP } from '@/services/growth-intelligence.service'
import { z } from 'zod'

const createCollegeProspectSchema = z.object({
  name: z.string().min(2, 'College name is required'),
  website: z.string().min(3, 'Website is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  region: z.string().min(1, 'Region is required'),
  courses: z.array(z.string()).default(['B.Tech', 'BCA']),
  estimatedCohort: z.number().default(500),
  tpoName: z.string().optional(),
  tpoEmail: z.string().email().optional(),
  tpoPhone: z.string().optional(),
  principalName: z.string().optional(),
  accreditation: z.string().optional(),
  notes: z.string().optional(),
})

export async function GET(req: NextRequest) {
  try {
    const session = await requireApiAuth()
    if (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'OPERATIONS') {
      return forbiddenError('Access restricted to Platform Operations')
    }

    const { searchParams } = new URL(req.url)
    const region = searchParams.get('region')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const minScore = searchParams.get('minScore')

    const where: any = {}
    if (region && region !== 'ALL') where.region = region
    if (status && status !== 'ALL') where.status = status
    if (minScore) where.icpScore = { gte: parseFloat(minScore) }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { tpoName: { contains: search, mode: 'insensitive' } },
      ]
    }

    const prospects = await prisma.collegeProspect.findMany({
      where,
      orderBy: { icpScore: 'desc' },
      take: 100,
    })

    return successResponse(prospects)
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
    const parsed = createCollegeProspectSchema.parse(body)

    const normalizedDomain = normalizeDomain(parsed.website)

    // Check duplicate
    const existing = await prisma.collegeProspect.findUnique({
      where: { normalizedDomain },
    })

    if (existing) {
      return validationError(`Prospect already exists under domain ${normalizedDomain}`)
    }

    // Evaluate 11-dimension ICP
    const icp = evaluateCollegeICP({
      estimatedCohort: parsed.estimatedCohort,
      courses: parsed.courses,
      region: parsed.region,
      hasTpoContact: Boolean(parsed.tpoName),
      tpoEmailVerified: Boolean(parsed.tpoEmail),
      accreditation: parsed.accreditation,
    })

    const prospect = await prisma.collegeProspect.create({
      data: {
        name: parsed.name,
        normalizedDomain,
        website: parsed.website,
        city: parsed.city,
        state: parsed.state,
        region: parsed.region,
        courses: parsed.courses,
        estimatedCohort: parsed.estimatedCohort,
        tpoName: parsed.tpoName,
        tpoEmail: parsed.tpoEmail,
        tpoPhone: parsed.tpoPhone,
        principalName: parsed.principalName,
        icpScore: icp.score,
        icpBreakdown: icp.breakdown as any,
        fitSummary: `Strong ${parsed.courses.join('/')} prospect in ${parsed.region} with graduating cohort of ${parsed.estimatedCohort}.`,
        recommendedPitch: `Extend ${parsed.name}'s placement ecosystem with PlacementConnect's pre-assessed talent network and NAAC/NIRF audit readiness center.`,
        provenanceData: {
          sourceUrl: parsed.website,
          sourceType: 'OFFICIAL_INSTITUTION_DIRECTORY',
          retrievedAt: new Date().toISOString(),
          confidence: 0.95,
        },
        freshnessStatus: 'FRESH',
        complianceStatus: 'VERIFIED',
        status: 'ICP_SCORED',
        notes: parsed.notes,
      },
    })

    return successResponse(prospect, undefined, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
