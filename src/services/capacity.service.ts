export interface RegionalClusterCapacity {
  region: string
  confirmedCapacity: number
  requiredObligation: number
  balance: number
  status: 'SURPLUS' | 'DEFICIT' | 'BALANCED'
}

export interface CapacityCalculationInput {
  activeAssuranceStudents: number
  totalOpenings: number
  slotsPerOpening?: number
  existingScheduledSlots?: number
  completedQualifiedInterviews?: number
  totalOffers?: number
  totalPlacements?: number
  repeatEmployersCount?: number
  totalHiringEmployers?: number
  regionalData?: Array<{
    region: string
    confirmedCapacity: number
    studentCount: number
  }>
}

export type CapacityHealthStatus = 'SURPLUS' | 'BALANCED' | 'DEFICIT'

export interface CapacityMetrics {
  activeStudents: number
  requiredOpportunities: number
  opportunitiesDelivered: number
  remainingObligation: number
  confirmedEmployerCapacity: number
  capacityGap: number
  availableSlots: number
  capacityBalance: number
  coverageRatio: number
  status: CapacityHealthStatus
  requiresEmployerAcquisition: boolean
  gtmAction: string
  gtmGuidance: string
  northStarInterviewsPer100: number
  firstRoundToOfferRate: number
  offerToJoinRate: number
  employerRepeatRate: number
  regionalClusters: RegionalClusterCapacity[]
  canSafelyOnboard: (count: number) => {
    safe: boolean
    newCoverageRatio: number
    remainingBuffer: number
    message: string
  }
}

/**
 * Calculates marketplace liquidity, interview slot balance, and operational health.
 * Enforces the rule: Required Opportunities = Active Students * 3.
 * Remaining Obligation = max(0, 3N - opportunitiesDelivered).
 * Capacity Gap = max(0, remainingObligation - confirmedEmployerCapacity).
 */
export function calculateCapacityMetrics(input: CapacityCalculationInput): CapacityMetrics {
  const slotsPerOpening = input.slotsPerOpening ?? 10
  const activeStudents = input.activeAssuranceStudents
  const requiredOpportunities = activeStudents * 3
  const opportunitiesDelivered = input.completedQualifiedInterviews ?? 0
  const remainingObligation = Math.max(0, requiredOpportunities - opportunitiesDelivered)

  const confirmedEmployerCapacity = (input.totalOpenings * slotsPerOpening) + (input.existingScheduledSlots ?? 0)
  const availableSlots = confirmedEmployerCapacity
  
  // Calculate balance against the active obligation
  const obligationToCover = remainingObligation > 0 ? remainingObligation : requiredOpportunities
  const capacityBalance = availableSlots - obligationToCover
  const capacityGap = Math.max(0, obligationToCover - confirmedEmployerCapacity)
  const coverageRatio = obligationToCover > 0 ? Number((availableSlots / obligationToCover).toFixed(2)) : 1.0

  let status: CapacityHealthStatus
  let gtmAction: string
  let gtmGuidance: string

  const requiresEmployerAcquisition = capacityGap > 0 || coverageRatio < 1.0

  if (coverageRatio >= 1.2 && capacityGap === 0) {
    status = 'SURPLUS'
    gtmAction = 'Safe to Expand'
    const additionalStudentsCapacity = Math.floor(capacityBalance / 3)
    gtmGuidance = `Healthy employer liquidity (${coverageRatio}x buffer). Safe to onboard up to ${additionalStudentsCapacity} additional student enrollments.`
  } else if (coverageRatio >= 1.0 && capacityGap === 0) {
    status = 'BALANCED'
    gtmAction = 'Monitor Closely'
    gtmGuidance = `Liquidity is balanced (${coverageRatio}x buffer). Maintain existing cohorts and schedule new cluster drives before opening new college batches.`
  } else {
    status = 'DEFICIT'
    gtmAction = 'Throttle / Pause Onboarding'
    const deficitSlots = capacityGap > 0 ? capacityGap : Math.abs(capacityBalance)
    gtmGuidance = `DEFICIT ALERT: Short by ${deficitSlots} interview slots (${coverageRatio}x coverage). GTM must prioritize corporate job drives immediately before onboarding more students.`
  }

  const defaultRegions = [
    { region: 'Delhi NCR', confirmedCapacity: 120, studentCount: 0 },
    { region: 'Gurgaon Tech Corridor', confirmedCapacity: 40, studentCount: 40 },
    { region: 'Pune Manufacturing & IT', confirmedCapacity: 260, studentCount: 20 },
    { region: 'Bangalore Innovation Hub', confirmedCapacity: 60, studentCount: 100 },
  ]

  const rawRegions = input.regionalData && input.regionalData.length > 0 ? input.regionalData : defaultRegions

  const regionalClusters: RegionalClusterCapacity[] = rawRegions.map((r) => {
    const regionalObligation = r.studentCount * 3
    const balance = r.confirmedCapacity - regionalObligation
    return {
      region: r.region,
      confirmedCapacity: r.confirmedCapacity,
      requiredObligation: regionalObligation,
      balance,
      status: balance > 0 ? 'SURPLUS' : balance < 0 ? 'DEFICIT' : 'BALANCED',
    }
  })

  const northStarInterviewsPer100 = activeStudents > 0
    ? Number(((opportunitiesDelivered / activeStudents) * 100).toFixed(1))
    : 0

  const firstRoundToOfferRate = opportunitiesDelivered > 0
    ? Number((((input.totalOffers ?? 0) / opportunitiesDelivered) * 100).toFixed(1))
    : 0

  const offerToJoinRate = (input.totalOffers && input.totalOffers > 0)
    ? Number((((input.totalPlacements ?? 0) / input.totalOffers) * 100).toFixed(1))
    : 0

  const employerRepeatRate = (input.totalHiringEmployers && input.totalHiringEmployers > 0)
    ? Number((((input.repeatEmployersCount ?? 0) / input.totalHiringEmployers) * 100).toFixed(1))
    : 0

  const canSafelyOnboard = (additionalCount: number) => {
    const newStudents = activeStudents + additionalCount
    const newTotalRequired = newStudents * 3
    const newRemainingObligation = Math.max(0, newTotalRequired - opportunitiesDelivered)
    const newBuffer = confirmedEmployerCapacity - newRemainingObligation
    const newCoverage = newRemainingObligation > 0
      ? Number((confirmedEmployerCapacity / newRemainingObligation).toFixed(2))
      : 1.0
    const safe = newCoverage >= 1.0 && newBuffer >= 0

    return {
      safe,
      newCoverageRatio: newCoverage,
      remainingBuffer: newBuffer,
      message: safe
        ? `Safe: Onboarding ${additionalCount} students requires ${additionalCount * 3} slots. Projected coverage buffer: ${newCoverage}x (${newBuffer} surplus slots).`
        : `Unsafe: Onboarding ${additionalCount} students will create a deficit of ${Math.abs(newBuffer)} interview slots (${newCoverage}x coverage). Acquire employers first!`,
    }
  }

  return {
    activeStudents,
    requiredOpportunities,
    opportunitiesDelivered,
    remainingObligation,
    confirmedEmployerCapacity,
    capacityGap,
    availableSlots,
    capacityBalance,
    coverageRatio,
    status,
    requiresEmployerAcquisition,
    gtmAction,
    gtmGuidance,
    northStarInterviewsPer100,
    firstRoundToOfferRate,
    offerToJoinRate,
    employerRepeatRate,
    regionalClusters,
    canSafelyOnboard,
  }
}
