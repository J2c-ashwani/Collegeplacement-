import { describe, it, expect } from 'vitest'
import { evaluateJobMatch, StudentMatchProfile, JobMatchCriteria } from '@/services/matching.service'
import { calculateCapacityMetrics } from '@/services/capacity.service'
import {
  calculateDriveCapacity,
  evaluateDriveAssuranceOutcome,
  summarizeDriveSlots,
  DriveSlot,
} from '@/services/mega-drive.service'


describe('Placement Assurance & Matching Engine', () => {
  const baseStudent: StudentMatchProfile = {
    id: 'stu-1',
    course: 'B.Tech',
    branch: 'Computer Science',
    graduationYear: 2026,
    cgpa: 8.4,
    backlogs: 0,
    skills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript'],
    scores: {
      overall: 84,
      technicalReadiness: 82,
      communication: 85,
      workEthics: 82,
      learningAgility: 85,
      teamOrientation: 80,
      problemSolving: 83,
      professionalBehaviour: 85,
      interviewReadiness: 84,
    },
    badges: ['Interview Ready', 'Employer Ready', 'Technical Ready', 'Strong Communicator'],
    preferredLocations: ['Mumbai', 'Bengaluru'],
  }

  const baseJob: JobMatchCriteria = {
    id: 'job-1',
    title: 'Junior Software Engineer',
    degree: ['B.Tech', 'BE'],
    branch: ['Computer Science', 'Information Technology'],
    graduationYear: 2026,
    minCgpa: 7.0,
    backlogsAllowed: false,
    skills: ['React', 'Node.js', 'PostgreSQL'],
    minEmployabilityScore: 75,
    minTechnicalScore: 70,
    minCommunicationScore: 65,
    requiredBadges: ['Technical Ready'],
    location: 'Bengaluru',
  }

  it('matches eligible student with high score and positive rationale', () => {
    const match = evaluateJobMatch(baseStudent, baseJob)
    expect(match.isEligible).toBe(true)
    expect(match.score).toBeGreaterThanOrEqual(80)
    expect(match.failedCriteria).toHaveLength(0)
    expect(match.reasons.length).toBeGreaterThanOrEqual(5)
  })

  it('marks student ineligible if CGPA is below job requirement', () => {
    const lowCgpaStudent: StudentMatchProfile = {
      ...baseStudent,
      cgpa: 6.5,
    }
    const match = evaluateJobMatch(lowCgpaStudent, baseJob)
    expect(match.isEligible).toBe(false)
    expect(match.failedCriteria.some((f) => f.includes('CGPA'))).toBe(true)
  })

  it('marks student ineligible if assessment score is below threshold', () => {
    const lowScoreStudent: StudentMatchProfile = {
      ...baseStudent,
      scores: {
        ...baseStudent.scores,
        overall: 70, // Job requires 75
      },
    }
    const match = evaluateJobMatch(lowScoreStudent, baseJob)
    expect(match.isEligible).toBe(false)
    expect(match.failedCriteria.some((f) => f.includes('Employability score'))).toBe(true)
  })

  it('marks student ineligible if required badge is missing', () => {
    const noBadgeStudent: StudentMatchProfile = {
      ...baseStudent,
      badges: ['Strong Communicator'], // Missing 'Technical Ready'
    }
    const match = evaluateJobMatch(noBadgeStudent, baseJob)
    expect(match.isEligible).toBe(false)
    expect(match.failedCriteria.some((f) => f.includes('Missing required badge'))).toBe(true)
  })

  it('correctly handles backlogs constraint', () => {
    const backlogsStudent: StudentMatchProfile = {
      ...baseStudent,
      backlogs: 2,
    }
    const match = evaluateJobMatch(backlogsStudent, baseJob)
    expect(match.isEligible).toBe(false)
    expect(match.failedCriteria.some((f) => f.includes('active backlog'))).toBe(true)
  })
})

describe('3-Interview Assurance Opportunity Calculations', () => {
  it('calculates remaining opportunities correctly', () => {
    const assuranceTarget = 3
    let opportunitiesConsumed = 0
    let opportunitiesRemaining = assuranceTarget - opportunitiesConsumed

    expect(opportunitiesRemaining).toBe(3)

    // Opportunity 1 rejected after technical round -> counts toward assurance
    const opp1Outcome = { countsTowardAssurance: true, result: 'REJECTED' }
    if (opp1Outcome.countsTowardAssurance) {
      opportunitiesConsumed += 1
      opportunitiesRemaining = Math.max(assuranceTarget - opportunitiesConsumed, 0)
    }

    expect(opportunitiesConsumed).toBe(1)
    expect(opportunitiesRemaining).toBe(2)

    // Opportunity 2 employer cancelled before interview -> DOES NOT count toward assurance
    const opp2Outcome = { countsTowardAssurance: false, result: 'CANCELLED_BY_EMPLOYER' }
    if (opp2Outcome.countsTowardAssurance) {
      opportunitiesConsumed += 1
      opportunitiesRemaining = Math.max(assuranceTarget - opportunitiesConsumed, 0)
    }

    expect(opportunitiesConsumed).toBe(1)
    expect(opportunitiesRemaining).toBe(2)

    // Opportunity 3 student no-show -> counts toward assurance
    const opp3Outcome = { countsTowardAssurance: true, result: 'NO_SHOW' }
    if (opp3Outcome.countsTowardAssurance) {
      opportunitiesConsumed += 1
      opportunitiesRemaining = Math.max(assuranceTarget - opportunitiesConsumed, 0)
    }

    expect(opportunitiesConsumed).toBe(2)
    expect(opportunitiesRemaining).toBe(1)
  })
})

describe('Employer Success Fee & Tax Calculations', () => {
  it('calculates GST and total fee correctly for candidate joining trigger', () => {
    const feeAmount = 10000
    const gstPercent = 18
    const gstAmount = (feeAmount * gstPercent) / 100
    const totalAmount = feeAmount + gstAmount

    expect(gstAmount).toBe(1800)
    expect(totalAmount).toBe(11800)
  })

  it('calculates percentage-based fee on CTC correctly', () => {
    const candidateCtc = 600000 // 6 LPA
    const feePercentage = 2.5 // 2.5% of CTC
    const feeAmount = (candidateCtc * feePercentage) / 100
    const gstAmount = feeAmount * 0.18
    const totalAmount = feeAmount + gstAmount

    expect(feeAmount).toBe(15000)
    expect(gstAmount).toBe(2700)
    expect(totalAmount).toBe(17700)
  })
})

describe('Institution Cohort Denominator and Gap Tracking', () => {
  it('computes not-registered gap accurately against graduating cohort', () => {
    const totalExpectedStudents = 600
    const registeredCount = 283
    const notRegistered = Math.max(totalExpectedStudents - registeredCount, 0)
    const participationRate = ((registeredCount / totalExpectedStudents) * 100).toFixed(1)

    expect(notRegistered).toBe(317)
    expect(participationRate).toBe('47.2')
  })
})

describe('Marketplace Liquidity & Growth Control Tower (3N Rule)', () => {
  it('enforces 3-interview legal obligation per active assurance student', () => {
    const activeStudents = 2000
    const metrics = calculateCapacityMetrics({
      activeAssuranceStudents: activeStudents,
      totalOpenings: 700, // 700 openings * 10 slots = 7000 slots
      slotsPerOpening: 10,
    })

    expect(metrics.requiredOpportunities).toBe(6000)
    expect(metrics.availableSlots).toBe(7000)
    expect(metrics.capacityBalance).toBe(1000)
    expect(metrics.coverageRatio).toBe(1.17)
    expect(metrics.status).toBe('BALANCED')
  })

  it('detects healthy surplus when coverage buffer is >= 1.2x and advises safe onboarding capacity', () => {
    const metrics = calculateCapacityMetrics({
      activeAssuranceStudents: 100,
      totalOpenings: 40, // 400 slots vs 300 required = 1.33x
      slotsPerOpening: 10,
    })

    expect(metrics.status).toBe('SURPLUS')
    expect(metrics.coverageRatio).toBe(1.33)
    expect(metrics.capacityBalance).toBe(100)
    expect(metrics.gtmAction).toBe('Safe to Expand')
    expect(metrics.gtmGuidance).toContain('Safe to onboard up to 33 additional student enrollments')
  })

  it('triggers DEFICIT ALERT and throttles onboarding when employer capacity drops below 1.0x', () => {
    const metrics = calculateCapacityMetrics({
      activeAssuranceStudents: 500, // Requires 1500 slots
      totalOpenings: 100, // Only 1000 slots available
      slotsPerOpening: 10,
    })

    expect(metrics.status).toBe('DEFICIT')
    expect(metrics.coverageRatio).toBe(0.67)
    expect(metrics.capacityBalance).toBe(-500)
    expect(metrics.gtmAction).toBe('Throttle / Pause Onboarding')
    expect(metrics.gtmGuidance).toContain('DEFICIT ALERT: Short by 500 interview slots')
  })

  it('calculates North Star metric: Qualified Interviews Delivered per 100 Paid Students', () => {
    const metrics = calculateCapacityMetrics({
      activeAssuranceStudents: 200,
      totalOpenings: 80,
      completedQualifiedInterviews: 520, // 520 interviews across 200 students = 260 per 100
      totalOffers: 104, // 20% first round to offer
      totalPlacements: 88, // ~84.6% offer to join
      totalHiringEmployers: 25,
      repeatEmployersCount: 11, // 44% repeat
    })

    expect(metrics.northStarInterviewsPer100).toBe(260)
    expect(metrics.firstRoundToOfferRate).toBe(20)
    expect(metrics.offerToJoinRate).toBe(84.6)
    expect(metrics.employerRepeatRate).toBe(44)
  })
})

describe('Mega-Drive Configurable Capacity & Assurance Accounting', () => {
  it('calculates interview capacity based on configurable duration and panels', () => {
    // 3 panels * 4 hours (240 min) with 20 min break = 220 effective min / 20 min slot = 11 slots/panel * 3 = 33 slots
    const capacity = calculateDriveCapacity({
      durationHours: 4,
      slotMinutes: 20,
      interviewerCount: 3,
      breakMinutesTotal: 20,
    })

    expect(capacity.totalDriveMinutes).toBe(240)
    expect(capacity.effectiveInterviewMinutes).toBe(220)
    expect(capacity.slotsPerInterviewer).toBe(11)
    expect(capacity.totalAvailableSlots).toBe(33)
  })

  it('guarantees employer cancellation does NOT consume student assurance quota', () => {
    const outcome = evaluateDriveAssuranceOutcome('slot-101', 'EMPLOYER_CANCELLED')
    expect(outcome.countsTowardAssurance).toBe(false)
    expect(outcome.remainingQuotaImpact).toBe(0)
    expect(outcome.explanation).toContain('returned to the candidate quota')
  })

  it('guarantees unexcused candidate no-show DOES consume student assurance quota', () => {
    const outcome = evaluateDriveAssuranceOutcome('slot-102', 'NO_SHOW')
    expect(outcome.countsTowardAssurance).toBe(true)
    expect(outcome.remainingQuotaImpact).toBe(-1)
    expect(outcome.explanation).toContain('Consumes 1 of 3 assurance opportunities')
  })

  it('correctly summarizes drive slots and distinguishes capacity from delivered opportunities', () => {
    const slots: DriveSlot[] = [
      { id: '1', driveId: 'd1', interviewerIndex: 1, startTime: '02:00', endTime: '02:20', status: 'ATTENDED' },
      { id: '2', driveId: 'd1', interviewerIndex: 1, startTime: '02:20', endTime: '02:40', status: 'ATTENDED' },
      { id: '3', driveId: 'd1', interviewerIndex: 1, startTime: '02:40', endTime: '03:00', status: 'NO_SHOW' },
      { id: '4', driveId: 'd1', interviewerIndex: 2, startTime: '02:00', endTime: '02:20', status: 'EMPLOYER_CANCELLED' },
      { id: '5', driveId: 'd1', interviewerIndex: 2, startTime: '02:20', endTime: '02:40', status: 'CONFIRMED' },
      { id: '6', driveId: 'd1', interviewerIndex: 2, startTime: '02:40', endTime: '03:00', status: 'OPEN' },
    ]

    const summary = summarizeDriveSlots(slots)
    expect(summary.total).toBe(6)
    expect(summary.attended).toBe(2)
    expect(summary.noShow).toBe(1)
    expect(summary.employerCancelled).toBe(1)
    expect(summary.claimed).toBe(1)
    expect(summary.open).toBe(1)
    // Assurance opportunities delivered = attended (2) + noShow (1) = 3 (excludes cancellations and open slots)
    expect(summary.assuranceOpportunitiesDelivered).toBe(3)
  })
})

describe('Capacity Obligations, Gaps & Regional Breakdown', () => {
  it('calculates remaining obligation and capacity gap accurately', () => {
    // 2000 active students * 3 = 6000 required
    // 4320 delivered -> remaining obligation = 1680
    // 1140 confirmed capacity -> gap = 540 (requires employer acquisition)
    const metrics = calculateCapacityMetrics({
      activeAssuranceStudents: 2000,
      completedQualifiedInterviews: 4320,
      totalOpenings: 114, // 114 * 10 = 1140 slots
      slotsPerOpening: 10,
    })

    expect(metrics.requiredOpportunities).toBe(6000)
    expect(metrics.opportunitiesDelivered).toBe(4320)
    expect(metrics.remainingObligation).toBe(1680)
    expect(metrics.confirmedEmployerCapacity).toBe(1140)
    expect(metrics.capacityGap).toBe(540)
    expect(metrics.requiresEmployerAcquisition).toBe(true)
    expect(metrics.status).toBe('DEFICIT')

    // Onboarding 500 more students would require 1500 more opportunities -> unsafe
    const check = metrics.canSafelyOnboard(500)
    expect(check.safe).toBe(false)
    expect(check.message).toContain('Unsafe')
  })

  it('reports regional cluster capacities and deficits', () => {
    const metrics = calculateCapacityMetrics({
      activeAssuranceStudents: 100,
      totalOpenings: 50,
      regionalData: [
        { region: 'Delhi NCR', confirmedCapacity: 120, studentCount: 0 },
        { region: 'Gurgaon Tech Corridor', confirmedCapacity: 40, studentCount: 40 }, // 40 capacity - 120 req = -80
        { region: 'Pune IT', confirmedCapacity: 260, studentCount: 20 }, // 260 - 60 = +200
        { region: 'Bangalore', confirmedCapacity: 60, studentCount: 100 }, // 60 - 300 = -240
      ],
    })

    const gurgaon = metrics.regionalClusters.find((r) => r.region === 'Gurgaon Tech Corridor')
    expect(gurgaon?.balance).toBe(-80)
    expect(gurgaon?.status).toBe('DEFICIT')

    const pune = metrics.regionalClusters.find((r) => r.region === 'Pune IT')
    expect(pune?.balance).toBe(200)
    expect(pune?.status).toBe('SURPLUS')
  })
})



