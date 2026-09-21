export interface DriveCapacityConfig {
  durationHours: number
  slotMinutes: number
  interviewerCount: number
  breakMinutesTotal?: number
}

export interface DriveCapacityResult {
  totalDriveMinutes: number
  effectiveInterviewMinutes: number
  slotsPerInterviewer: number
  totalAvailableSlots: number
}

export type DriveSlotStatus = 'OPEN' | 'CLAIMED' | 'CONFIRMED' | 'ATTENDED' | 'NO_SHOW' | 'EMPLOYER_CANCELLED'

export interface DriveSlot {
  id: string
  driveId: string
  interviewerIndex: number
  startTime: string
  endTime: string
  status: DriveSlotStatus
  claimedByStudentId?: string
  studentProgrammeId?: string
}

export interface DriveAssuranceOutcome {
  slotId: string
  outcome: 'ATTENDED' | 'NO_SHOW' | 'EMPLOYER_CANCELLED'
  countsTowardAssurance: boolean
  remainingQuotaImpact: -1 | 0
  explanation: string
}

/**
 * Calculates interview slot capacity based on configurable parameters.
 * Does not assume hardcoded throughput; adapts to interviewers and duration.
 */
export function calculateDriveCapacity(config: DriveCapacityConfig): DriveCapacityResult {
  const totalDriveMinutes = config.durationHours * 60
  const breakMinutes = config.breakMinutesTotal ?? 0
  const effectiveInterviewMinutes = Math.max(totalDriveMinutes - breakMinutes, 0)
  const slotsPerInterviewer = Math.floor(effectiveInterviewMinutes / config.slotMinutes)
  const totalAvailableSlots = slotsPerInterviewer * Math.max(config.interviewerCount, 1)

  return {
    totalDriveMinutes,
    effectiveInterviewMinutes,
    slotsPerInterviewer,
    totalAvailableSlots,
  }
}

/**
 * Evaluates how a Mega-Drive interview outcome impacts the student's 3-interview assurance quota.
 * Reuses the platform's core assurance rules:
 * - EMPLOYER_CANCELLED: DOES NOT count against quota (returns opportunity to student).
 * - NO_SHOW: DOES count against quota (student forfeited opportunity).
 * - ATTENDED: DOES count against quota (opportunity fulfilled).
 */
export function evaluateDriveAssuranceOutcome(
  slotId: string,
  outcome: 'ATTENDED' | 'NO_SHOW' | 'EMPLOYER_CANCELLED'
): DriveAssuranceOutcome {
  if (outcome === 'EMPLOYER_CANCELLED') {
    return {
      slotId,
      outcome,
      countsTowardAssurance: false,
      remainingQuotaImpact: 0,
      explanation: 'Employer cancelled the session before completion. This opportunity is returned to the candidate quota.',
    }
  }

  if (outcome === 'NO_SHOW') {
    return {
      slotId,
      outcome,
      countsTowardAssurance: true,
      remainingQuotaImpact: -1,
      explanation: 'Candidate failed to attend scheduled slot without valid excusal. Consumes 1 of 3 assurance opportunities.',
    }
  }

  return {
    slotId,
    outcome: 'ATTENDED',
    countsTowardAssurance: true,
    remainingQuotaImpact: -1,
    explanation: 'Interview completed. Consumes 1 of 3 assurance opportunities.',
  }
}

/**
 * Computes drive slot summary for reporting and liquidity balance.
 */
export function summarizeDriveSlots(slots: DriveSlot[]) {
  const total = slots.length
  let open = 0
  let claimed = 0
  let attended = 0
  let noShow = 0
  let employerCancelled = 0

  for (const s of slots) {
    if (s.status === 'OPEN') open++
    else if (s.status === 'CLAIMED' || s.status === 'CONFIRMED') claimed++
    else if (s.status === 'ATTENDED') attended++
    else if (s.status === 'NO_SHOW') noShow++
    else if (s.status === 'EMPLOYER_CANCELLED') employerCancelled++
  }

  const assuranceOpportunitiesDelivered = attended + noShow

  return {
    total,
    open,
    claimed,
    attended,
    noShow,
    employerCancelled,
    assuranceOpportunitiesDelivered,
  }
}
