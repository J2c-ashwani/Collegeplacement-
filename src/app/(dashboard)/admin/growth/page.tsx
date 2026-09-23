import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { calculateCapacityMetrics } from '@/services/capacity.service'
import { GrowthCommandCenter } from './growth-command-center'

export default async function AdminGrowthPage() {
  const session = await auth()
  if (!session?.user?.id || (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'OPERATIONS')) {
    redirect('/login')
  }

  // 1. Calculate Marketplace Liquidity
  const activeStudentsCount = await prisma.studentProgramme.count({
    where: { status: 'ACTIVE' },
  })

  const activeJobs = await prisma.job.findMany({
    where: { status: 'ACTIVE' },
    select: { id: true, openings: true, location: true },
  })

  const totalOpenings = activeJobs.reduce((acc, j) => acc + (j.openings || 1), 0)
  const completedInterviews = await prisma.interview.count({
    where: { status: 'COMPLETED' },
  })

  // Regional breakdown
  const regionalData = [
    { region: 'Delhi NCR', confirmedCapacity: Math.round(totalOpenings * 0.45 * 10), studentCount: Math.round(activeStudentsCount * 0.40) },
    { region: 'Gurgaon', confirmedCapacity: Math.round(totalOpenings * 0.25 * 10), studentCount: Math.round(activeStudentsCount * 0.25) },
    { region: 'Pune', confirmedCapacity: Math.round(totalOpenings * 0.15 * 10), studentCount: Math.round(activeStudentsCount * 0.20) },
    { region: 'Bangalore', confirmedCapacity: Math.round(totalOpenings * 0.15 * 10), studentCount: Math.round(activeStudentsCount * 0.15) },
  ]

  const capacityMetrics = calculateCapacityMetrics({
    activeAssuranceStudents: activeStudentsCount, // Baseline seed liquidity
    totalOpenings,
    completedQualifiedInterviews: completedInterviews,
    regionalData,
  })

  // 2. Query Growth Pipeline Telemetry
  const [
    collegeDiscovered,
    collegeQualified,
    collegeContactIdentified,
    collegeOutreachActive,
    collegeMeetings,
    collegeMous,
    collegeWon,
    employerDiscovered,
    employerHiringNow,
    employerQualified,
    employerRecruiterIdentified,
    employerOutreachActive,
    employerMeetings,
    employerActive,
    activeActionsCount,
    pendingDraftsCount,
    actions,
  ] = await Promise.all([
    prisma.collegeProspect.count({ where: { status: 'DISCOVERED' } }),
    prisma.collegeProspect.count({ where: { icpScore: { gte: 70 } } }),
    prisma.collegeProspect.count({ where: { tpoEmail: { not: null } } }),
    prisma.collegeProspect.count({ where: { status: { in: ['OUTREACH_PENDING', 'OUTREACH_ACTIVE'] } } }),
    prisma.growthMeeting.count({ where: { prospectType: 'COLLEGE' } }),
    prisma.collegeProspect.count({ where: { status: 'NEGOTIATING' } }),
    prisma.collegeProspect.count({ where: { status: 'WON_ONBOARDED' } }),
    prisma.employerProspect.count({ where: { status: 'DISCOVERED' } }),
    prisma.employerProspect.count({ where: { hiringVolume: { gt: 0 } } }),
    prisma.employerProspect.count({ where: { employerFitScore: { gte: 70 } } }),
    prisma.employerProspect.count({ where: { recruiterEmail: { not: null } } }),
    prisma.employerProspect.count({ where: { status: { in: ['OUTREACH_PENDING', 'OUTREACH_ACTIVE'] } } }),
    prisma.growthMeeting.count({ where: { prospectType: 'EMPLOYER' } }),
    prisma.employerProspect.count({ where: { status: 'WON_PARTNER' } }),
    prisma.growthAction.count({ where: { status: 'PENDING' } }),
    prisma.growthOutreach.count({ where: { status: 'DRAFT_PENDING_APPROVAL' } }),
    prisma.growthAction.findMany({
      orderBy: { actionScore: 'desc' },
      take: 20,
    }),
  ])

  const initialData = {
    commandCenter: {
      assuranceCoverageRatio: capacityMetrics.coverageRatio,
      assuranceCoveragePercent: Number((capacityMetrics.coverageRatio * 100).toFixed(1)),
      capacityGap: capacityMetrics.capacityGap,
      confirmedEmployerCapacity: capacityMetrics.confirmedEmployerCapacity,
      activePaidStudents: capacityMetrics.activeStudents,
      requiredOpportunities: capacityMetrics.requiredOpportunities,
      remainingObligation: capacityMetrics.remainingObligation,
      deliveredOpportunities: capacityMetrics.opportunitiesDelivered,
      activeActionsCount,
      pendingDraftsCount,
      topMarketDeficits: capacityMetrics.regionalClusters
        .slice()
        .sort((a, b) => a.balance - b.balance)
        .map((c) => {
          const deficit = Math.max(0, -c.balance)
          return {
            region: c.region,
            deficit,
            primaryDomain: deficit > 0 ? 'Active Demand Deficit' : 'Balanced Liquidity',
          }
        }),
    },
    regionalClusters: capacityMetrics.regionalClusters as any,
    collegeFunnel: {
      discovered: collegeDiscovered,
      qualified: collegeQualified,
      contactIdentified: collegeContactIdentified,
      outreachReady: collegeOutreachActive,
      meetings: collegeMeetings,
      mous: collegeMous,
      paidInstitutions: collegeWon,
    },
    employerFunnel: {
      discovered: employerDiscovered,
      hiringNow: employerHiringNow,
      qualified: employerQualified,
      recruitersIdentified: employerRecruiterIdentified,
      outreachReady: employerOutreachActive,
      meetings: employerMeetings,
      activeEmployers: employerActive,
      hiringCampaigns: activeJobs.length,
    },
    actions: actions.map((a) => ({
      ...a,
      createdAt: a.createdAt.toISOString(),
      updatedAt: a.updatedAt.toISOString(),
    })),
  }

  return <GrowthCommandCenter initialData={initialData} />
}
