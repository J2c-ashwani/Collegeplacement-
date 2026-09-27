import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireApiAuth } from '@/lib/auth-utils'
import { successResponse, handleApiError, forbiddenError } from '@/lib/errors'
import { calculateCapacityMetrics } from '@/services/capacity.service'

export async function GET(_req: NextRequest) {
  try {
    const session = await requireApiAuth()
    if (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'OPERATIONS') {
      return forbiddenError('Access restricted to Platform Operations')
    }

    // 1. Calculate Marketplace Liquidity
    const activeStudentsCount = await prisma.studentProgramme.count({
      where: { status: 'ACTIVE' },
    })

    const activeJobs = await prisma.job.findMany({
      where: { status: 'ACTIVE' },
      select: { id: true, openings: true, location: true },
    })

    const totalOpenings = activeJobs.reduce((acc, j) => acc + j.openings, 0)
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
      activeAssuranceStudents: activeStudentsCount,
      totalOpenings: totalOpenings,
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
    ])

    const responseData = {
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
        topMarketDeficits:
          capacityMetrics.capacityGap > 0
            ? [
                { region: 'Delhi NCR', deficit: Math.round(capacityMetrics.capacityGap * 0.5), primaryDomain: 'Tech / Analytics' },
                { region: 'Gurgaon', deficit: Math.round(capacityMetrics.capacityGap * 0.3), primaryDomain: 'Product / Operations' },
                { region: 'Pune', deficit: Math.round(capacityMetrics.capacityGap * 0.2), primaryDomain: 'Core Engineering / IT' },
              ]
            : [
                { region: 'All Hubs', deficit: 0, primaryDomain: 'Pilot Intake Ready — All Corridors Balanced' },
              ],
      },
      regionalClusters: capacityMetrics.regionalClusters,
      collegeFunnel: {
        discovered: collegeDiscovered,
        qualified: collegeQualified,
        contactIdentified: collegeContactIdentified,
        outreachReady: collegeOutreachActive,
        meetings: collegeMeetings,
        proposals: 0,
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
        hiringCampaigns: 0,
      },
    }

    return successResponse(responseData)
  } catch (error) {
    return handleApiError(error)
  }
}
