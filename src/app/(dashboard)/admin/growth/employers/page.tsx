import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { EmployerGrowthCrm } from './employer-growth-crm'

export default async function AdminGrowthEmployersPage() {
  const session = await auth()
  if (!session?.user?.id || (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'OPERATIONS')) {
    redirect('/login')
  }

  const [prospects, sequences] = await Promise.all([
    prisma.employerProspect.findMany({
      orderBy: { employerFitScore: 'desc' },
      take: 100,
    }),
    prisma.outreachSequence.findMany({
      where: { targetType: 'EMPLOYER', isActive: true },
      include: {
        _count: { select: { steps: true } },
      },
    }),
  ])

  const initialProspects = prospects.map((p) => ({
    id: p.id,
    companyName: p.companyName,
    normalizedDomain: p.normalizedDomain,
    website: p.website,
    careersUrl: p.careersUrl,
    industry: p.industry,
    city: p.city,
    state: p.state,
    region: p.region,
    hiringVolume: p.hiringVolume,
    openRoles: p.openRoles,
    experienceRange: p.experienceRange,
    employerFitScore: p.employerFitScore,
    fitBreakdown: p.fitBreakdown,
    assuranceCoveragePotential: p.assuranceCoveragePotential,
    matchedStudentCount: p.matchedStudentCount,
    matchedSkills: p.matchedSkills,
    matchingRoles: p.matchingRoles,
    recruiterName: p.recruiterName,
    recruiterEmail: p.recruiterEmail,
    recruiterTitle: p.recruiterTitle,
    recruiterPhone: p.recruiterPhone,
    provenanceData: p.provenanceData,
    freshnessStatus: p.freshnessStatus,
    complianceStatus: p.complianceStatus,
    status: p.status,
    dnc: p.dnc,
    lastVerifiedAt: p.lastVerifiedAt.toISOString(),
    createdAt: p.createdAt.toISOString(),
  }))

  const sequenceOptions = sequences.map((s) => ({
    id: s.id,
    name: s.name,
    targetType: s.targetType,
    stepsCount: s._count.steps,
  }))

  return <EmployerGrowthCrm initialProspects={initialProspects} sequences={sequenceOptions} />
}
