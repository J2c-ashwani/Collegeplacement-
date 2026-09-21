import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { CollegeGrowthCrm } from './college-growth-crm'

export default async function AdminGrowthCollegesPage() {
  const session = await auth()
  if (!session?.user?.id || (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'OPERATIONS')) {
    redirect('/login')
  }

  const [prospects, sequences] = await Promise.all([
    prisma.collegeProspect.findMany({
      orderBy: { icpScore: 'desc' },
      take: 100,
    }),
    prisma.outreachSequence.findMany({
      where: { targetType: 'COLLEGE', isActive: true },
      include: {
        _count: { select: { steps: true } },
      },
    }),
  ])

  const initialProspects = prospects.map((p) => ({
    id: p.id,
    name: p.name,
    normalizedDomain: p.normalizedDomain,
    website: p.website,
    city: p.city,
    state: p.state,
    region: p.region,
    courses: p.courses,
    estimatedCohort: p.estimatedCohort,
    icpScore: p.icpScore,
    icpBreakdown: p.icpBreakdown,
    fitSummary: p.fitSummary,
    recommendedPitch: p.recommendedPitch,
    tpoName: p.tpoName,
    tpoEmail: p.tpoEmail,
    tpoPhone: p.tpoPhone,
    freshnessStatus: p.freshnessStatus,
    complianceStatus: p.complianceStatus,
    status: p.status,
    dnc: p.dnc,
    lastVerifiedAt: p.lastVerifiedAt.toISOString(),
    provenanceData: p.provenanceData,
    createdAt: p.createdAt.toISOString(),
  }))

  const sequenceOptions = sequences.map((s) => ({
    id: s.id,
    name: s.name,
    targetType: s.targetType,
    stepsCount: s._count.steps,
  }))

  return <CollegeGrowthCrm initialProspects={initialProspects} sequences={sequenceOptions} />
}
