import { FreshnessStatus, ReplyIntent } from '@prisma/client'

export interface EmployerFitInput {
  hiringVolume: number
  openRoles: string[]
  experienceMinYears?: number
  experienceMaxYears?: number
  matchedStudentCount: number
  region: string
  targetRegion?: string
  averageSalaryLpa?: number
  slotsPerOpening?: number
  reliabilityRating?: number // 1 to 5
  historicalPlacementConversion?: number // 0 to 1
}

export interface CollegeIcpInput {
  estimatedCohort: number
  courses: string[]
  historicalPlacementRate?: number // e.g. 0.40 means 40% placed, gap is 60%
  region: string
  targetRegion?: string
  hasTpoContact: boolean
  tpoEmailVerified?: boolean
  mouCount?: number
  hasLabsOrInfrastructure?: boolean
  accreditation?: string // NAAC A+, NBA, etc.
  studentAffordabilityIndex?: number // 1 to 10
  responsivenessScore?: number // 1 to 10
}

export interface AssuranceCoveragePotential {
  openFresherRoles: number
  eligibleCandidatePool: number
  skillMatchCount: number
  regionalProximityCount: number
  deliverableSlotsThisMonth: number
  coverageYieldPercentage: number
}

export interface SafeActionEvaluation {
  isSafe: boolean
  reasons: string[]
}

/**
 * Normalizes any website URL or email into its canonical root domain.
 * Example: 'https://careers.techcorp.co.in/jobs?ref=1' -> 'techcorp.co.in'
 */
export function normalizeDomain(input: string): string {
  if (!input) return ''
  try {
    let raw = input.trim().toLowerCase()
    // Handle emails
    if (raw.includes('@')) {
      raw = raw.split('@')[1]
    }
    // Remove protocol and www
    raw = raw.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '')
    // Remove port, paths, query params
    raw = raw.split('/')[0].split('?')[0].split(':')[0].trim()

    // Extract canonical root domain
    const parts = raw.split('.')
    if (parts.length > 2) {
      // Common two-level ccTLDs (.edu.in, .ac.in, .co.in, .co.uk, .gov.in, .org.in, .net.in)
      const secondLevelTlds = ['co', 'edu', 'ac', 'gov', 'org', 'net', 'res', 'gen']
      const penultimate = parts[parts.length - 2]
      const tld = parts[parts.length - 1]

      if (secondLevelTlds.includes(penultimate) && tld.length === 2) {
        if (parts.length > 3) {
          return parts.slice(-3).join('.')
        }
        return raw
      }

      // Standard TLD (.com, .io, .org, .ai, .net, etc.)
      return parts.slice(-2).join('.')
    }

    return raw
  } catch {
    return input.trim().toLowerCase()
  }
}

/**
 * Calculates freshness status based on date retrieved.
 */
export function classifyFreshness(retrievedAt: Date): FreshnessStatus {
  const diffDays = (Date.now() - retrievedAt.getTime()) / (1000 * 60 * 60 * 24)
  if (diffDays < 7) return FreshnessStatus.FRESH
  if (diffDays <= 30) return FreshnessStatus.RECENT
  if (diffDays <= 90) return FreshnessStatus.STALE
  return FreshnessStatus.EXPIRED
}

/**
 * 10-Component Deterministic Employer Fit Score (100% Total)
 */
export function evaluateEmployerFit(input: EmployerFitInput): {
  score: number
  breakdown: Record<string, number>
} {
  // 1. Hiring Demand (15%): volume of fresher hiring
  const demandScore = Math.min(100, (input.hiringVolume / 50) * 100) * 0.15

  // 2. Fresher Eligibility (15%): 0-2 years experience
  const expMin = input.experienceMinYears ?? 0
  const expScore = (expMin <= 1 ? 100 : expMin <= 2 ? 60 : 20) * 0.15

  // 3. Role Relevance (10%): Tech/Analytics/Sales/Ops for campus freshers
  const relevantKeywords = ['software', 'developer', 'engineer', 'sales', 'business development', 'associate', 'analyst', 'qa', 'support']
  const matchedKeywordCount = input.openRoles.filter(role => 
    relevantKeywords.some(kw => role.toLowerCase().includes(kw))
  ).length
  const roleScore = Math.min(100, (matchedKeywordCount / Math.max(1, input.openRoles.length)) * 100) * 0.10

  // 4. Candidate Match Pool (15%): real student profiles in database
  const candidateScore = Math.min(100, (input.matchedStudentCount / 50) * 100) * 0.15

  // 5. Geography Match (10%): cluster alignment
  const geoMatch = (!input.targetRegion || input.region.toLowerCase() === input.targetRegion.toLowerCase()) ? 100 : 50
  const geoScore = geoMatch * 0.10

  // 6. Salary Fit (10%): 3.5L to 12L LPA fresher benchmark
  const salary = input.averageSalaryLpa ?? 5.5
  const salaryScore = (salary >= 3.5 && salary <= 12 ? 100 : salary > 12 ? 80 : 50) * 0.10

  // 7. Hiring Volume Consistency (10%)
  const volumeScore = Math.min(100, (input.hiringVolume / 30) * 100) * 0.10

  // 8. Interview Capacity (5%): slots able to schedule
  const slots = (input.openRoles.length * (input.slotsPerOpening ?? 10))
  const capacityScore = Math.min(100, (slots / 50) * 100) * 0.05

  // 9. Historical Conversion (5%)
  const convScore = (input.historicalPlacementConversion ?? 0.70) * 100 * 0.05

  // 10. Employer Reliability (5%)
  const relScore = ((input.reliabilityRating ?? 4.5) / 5) * 100 * 0.05

  const total = Number((
    demandScore + expScore + roleScore + candidateScore + geoScore + 
    salaryScore + volumeScore + capacityScore + convScore + relScore
  ).toFixed(1))

  return {
    score: Math.min(100, Math.max(0, total)),
    breakdown: {
      hiringDemand: Number(demandScore.toFixed(1)),
      fresherEligibility: Number(expScore.toFixed(1)),
      roleRelevance: Number(roleScore.toFixed(1)),
      candidateMatch: Number(candidateScore.toFixed(1)),
      geographyMatch: Number(geoScore.toFixed(1)),
      salaryFit: Number(salaryScore.toFixed(1)),
      hiringVolume: Number(volumeScore.toFixed(1)),
      interviewCapacity: Number(capacityScore.toFixed(1)),
      historicalConversion: Number(convScore.toFixed(1)),
      employerReliability: Number(relScore.toFixed(1)),
    }
  }
}

/**
 * Calculates Assurance Coverage Potential for an employer prospect.
 */
export function calculateAssuranceCoveragePotential(params: {
  openFresherRoles: number
  eligibleCandidatePool: number
  skillMatchCount: number
  regionalProximityCount: number
  slotsPerRole?: number
}): AssuranceCoveragePotential {
  const slotsPerRole = params.slotsPerRole ?? 10
  const theoreticalSlots = params.openFresherRoles * slotsPerRole
  const deliverableSlotsThisMonth = Math.min(
    theoreticalSlots, 
    Math.max(params.skillMatchCount, params.regionalProximityCount)
  )
  const coverageYieldPercentage = params.eligibleCandidatePool > 0
    ? Number(((deliverableSlotsThisMonth / params.eligibleCandidatePool) * 100).toFixed(1))
    : 0

  return {
    openFresherRoles: params.openFresherRoles,
    eligibleCandidatePool: params.eligibleCandidatePool,
    skillMatchCount: params.skillMatchCount,
    regionalProximityCount: params.regionalProximityCount,
    deliverableSlotsThisMonth,
    coverageYieldPercentage,
  }
}

/**
 * 11-Component Deterministic College ICP Score (100% Total)
 * 1. Graduating Student Volume: 15%
 * 2. Course Diversity & Relevancy: 15%
 * 3. Placement Gap Index: 10%
 * 4. Regional Employer Accessibility: 10%
 * 5. TPO Accessibility & Responsiveness: 10%
 * 6. Student Affordability & Regional Fit: 10%
 * 7. Industry Collaboration & MOU History: 10%
 * 8. Campus Infrastructure & Lab Signals: 5%
 * 9. Historical Student Conversion Potential: 5%
 * 10. Accreditation & Profile Signals: 5%
 * 11. Likelihood of Partnership: 5%
 * TOTAL: 15+15+10+10+10+10+10+5+5+5+5 = 100%
 */
export function evaluateCollegeICP(input: CollegeIcpInput): {
  score: number
  breakdown: Record<string, number>
} {
  // 1. Graduating Student Volume (15%): 300+ students optimal
  const volScore = Math.min(100, (input.estimatedCohort / 500) * 100) * 0.15

  // 2. Course Diversity & Relevancy (15%): B.Tech, BCA, MCA, MBA
  const highDemandCourses = ['b.tech', 'btech', 'bca', 'mca', 'mba', 'b.sc cs', 'bba']
  const matchedCourses = input.courses.filter(c => 
    highDemandCourses.some(hdc => c.toLowerCase().includes(hdc))
  ).length
  const courseScore = Math.min(100, (matchedCourses / Math.max(1, highDemandCourses.length)) * 100) * 0.15

  // 3. Placement Gap Index (10%): Low historical placement = high commercial need
  const historicalRate = input.historicalPlacementRate ?? 0.45
  const gapIndex = Math.max(0, 1 - historicalRate) // e.g. 0.55 gap
  const gapScore = (gapIndex * 100) * 0.10

  // 4. Regional Employer Accessibility (10%)
  const geoMatch = (!input.targetRegion || input.region.toLowerCase() === input.targetRegion.toLowerCase()) ? 100 : 60
  const geoScore = geoMatch * 0.10

  // 5. TPO Accessibility & Responsiveness (10%)
  const tpoScore = (input.hasTpoContact ? (input.tpoEmailVerified ? 100 : 80) : 30) * 0.10

  // 6. Student Affordability & Regional Fit (10%)
  const affScore = ((input.studentAffordabilityIndex ?? 7.5) / 10) * 100 * 0.10

  // 7. Industry Collaboration & MOU History (10%)
  const mouScore = Math.min(100, ((input.mouCount ?? 4) / 10) * 100) * 0.10

  // 8. Campus Infrastructure & Lab Signals (5%)
  const infraScore = (input.hasLabsOrInfrastructure ? 100 : 70) * 0.05

  // 9. Historical Student Conversion Potential (5%)
  const convScore = 85 * 0.05

  // 10. Accreditation & Profile Signals (5%): NAAC as modest signal only
  const accUpper = (input.accreditation || '').toUpperCase()
  const accPoints = accUpper.includes('A++') || accUpper.includes('A+') ? 100 :
                    accUpper.includes('A') ? 85 :
                    accUpper.includes('B') ? 70 : 60
  const accScore = accPoints * 0.05

  // 11. Likelihood of Partnership (5%)
  const likeScore = ((input.responsivenessScore ?? 8) / 10) * 100 * 0.05

  const total = Number((
    volScore + courseScore + gapScore + geoScore + tpoScore + 
    affScore + mouScore + infraScore + convScore + accScore + likeScore
  ).toFixed(1))

  return {
    score: Math.min(100, Math.max(0, total)),
    breakdown: {
      studentVolume: Number(volScore.toFixed(1)),
      courseRelevancy: Number(courseScore.toFixed(1)),
      placementGap: Number(gapScore.toFixed(1)),
      employerAccessibility: Number(geoScore.toFixed(1)),
      tpoAccessibility: Number(tpoScore.toFixed(1)),
      studentAffordability: Number(affScore.toFixed(1)),
      industryMous: Number(mouScore.toFixed(1)),
      campusInfrastructure: Number(infraScore.toFixed(1)),
      conversionPotential: Number(convScore.toFixed(1)),
      accreditationSignal: Number(accScore.toFixed(1)),
      partnershipLikelihood: Number(likeScore.toFixed(1)),
    }
  }
}

/**
 * AI Action Score Engine
 * Action Score = (Impact × Urgency × Confidence) ÷ Effort
 */
export function calculateActionScore(params: {
  impact: number // 1 - 100
  urgency: number // 1 - 100
  confidence: number // 1 - 100
  effort: number // 1 - 100
}): number {
  const effortSafe = Math.max(10, params.effort)
  const raw = (params.impact * params.urgency * (params.confidence / 100)) / effortSafe
  return Number(raw.toFixed(1))
}

/**
 * 7-Point Policy Engine for "Approve All Safe Actions"
 */
export function evaluateSafeActionPolicy(item: {
  freshnessStatus: FreshnessStatus | string
  provenancePresent: boolean
  complianceStatus: string
  dnc: boolean
  noDuplicateContact?: boolean
  duplicateDetected?: boolean
  noActiveSequenceConflict?: boolean
  activeSequenceConflict?: boolean
  channel: string
}): SafeActionEvaluation & { violations: string[] } {
  const reasons: string[] = []

  if (item.dnc) {
    reasons.push('PROSPECT_IN_DNC_REGISTRY')
  }
  if (item.freshnessStatus === 'STALE' || item.freshnessStatus === 'EXPIRED') {
    reasons.push('PROSPECT_DATA_STALE_OR_EXPIRED')
  }
  if (!item.provenancePresent) {
    reasons.push('MISSING_DATA_PROVENANCE')
  }
  if (item.complianceStatus !== 'VERIFIED') {
    reasons.push(`NON_COMPLIANT_STATUS_${item.complianceStatus}`)
  }
  const hasDuplicate = item.duplicateDetected || (item.noDuplicateContact === false)
  if (hasDuplicate) {
    reasons.push('DUPLICATE_CONTACT_DETECTED')
  }
  const hasSequenceConflict = item.activeSequenceConflict || (item.noActiveSequenceConflict === false)
  if (hasSequenceConflict) {
    reasons.push('ACTIVE_SEQUENCE_CONFLICT')
  }
  if (item.channel !== 'EMAIL' && item.channel !== 'LINKEDIN_ASSISTED') {
    reasons.push(`UNAPPROVED_CHANNEL_${item.channel}`)
  }

  return {
    isSafe: reasons.length === 0,
    reasons: reasons.length === 0 ? ['Complies with all 7 safety policy criteria'] : reasons,
    violations: reasons,
  }
}

/**
 * Generates structured AI Observability & Mathematical Justification ("Why?")
 */
export function generateActionWhyExplanation(params: {
  category?: string
  region?: string
  capacityGap?: number
  coverageRatio?: number
  unmetRoles?: string[]
  addressableCapacity?: number
  confidence?: number
  // Alternative action entity signature
  title?: string
  targetRegion?: string
  targetDomain?: string
  metricDeficit?: number
  impactScore?: number
  urgencyScore?: number
  confidenceScore?: number
  effortScore?: number
}) {
  const region = params.region || params.targetRegion || 'All Regions'
  const deficit = params.capacityGap ?? params.metricDeficit ?? 0
  const impact = params.impactScore ?? 80
  const urgency = params.urgencyScore ?? 80
  const confidence = params.confidence ?? ((params.confidenceScore ?? 0.85) * 100)
  const effort = params.effortScore ?? 1.5
  const addressable = params.addressableCapacity ?? Math.round(deficit * 0.75)

  return {
    coverageRatio: `${Number(((params.coverageRatio ?? 0.65) * 100).toFixed(1))}%`,
    regionalGapSlots: deficit,
    targetRegion: region,
    primaryDriver: `Regional capacity deficit in ${region} (${deficit} slots)`,
    deficitContext: `Deficit of ${deficit} placement opportunities in ${region}`,
    topUnmetRoles: params.unmetRoles || (params.targetDomain ? [params.targetDomain] : ['Core Engineering', 'Inside Sales']),
    estimatedAddressableCapacity: addressable,
    confidenceScore: `${confidence}%`,
    formulaBreakdown: `(${impact} Impact × ${urgency} Urgency × ${(confidence / 100).toFixed(2)} Confidence) ÷ ${effort} Effort = ${((impact * urgency * (confidence / 100)) / Math.max(1, effort)).toFixed(1)}`,
    expectedMarketplaceImpact: `Delivers up to ${addressable} verified interview slots toward 3N assurance fulfillment.`,
    impactExplanation: params.category === 'ACQUIRE_EMPLOYERS'
      ? `Acquiring employers in ${region} delivers up to ${addressable} interview slots, directly covering ${Math.min(100, Math.round((addressable / Math.max(1, deficit)) * 100))}% of the regional capacity deficit.`
      : `Acquiring partner institutions with B.Tech/BCA cohorts in ${region} satisfies active recruiter fresher demand.`,
  }
}

/**
 * AI Inbound Reply Classifier
 */
export function classifyInboundReply(text: string): {
  intent: ReplyIntent
  confidence: number
  suggestedAction: string
  requiresHumanReview: boolean
  dncTriggered: boolean
} {
  const lower = text.toLowerCase()

  // 1. DNC / Unsubscribe
  if (
    lower.includes('unsubscribe') || 
    lower.includes('remove me') || 
    lower.includes('do not contact') || 
    lower.includes('stop emailing') || 
    lower.includes('spam')
  ) {
    return {
      intent: ReplyIntent.UNSUBSCRIBE_DNC,
      confidence: 0.99,
      suggestedAction: 'SUPPRESS_DNC_HALT_SEQUENCE',
      requiresHumanReview: false,
      dncTriggered: true,
    }
  }

  // 2. Budget / Pricing Objection or Inquiry
  if (
    lower.includes('budget') ||
    lower.includes('pricing') ||
    lower.includes('fee') ||
    lower.includes('cost') ||
    lower.includes('commission') ||
    lower.includes('commercials') ||
    lower.includes('charge')
  ) {
    return {
      intent: ReplyIntent.OBJECTION_BUDGET,
      confidence: 0.93,
      suggestedAction: 'SEND_COMMERCIAL_TERMS',
      requiresHumanReview: true,
      dncTriggered: false,
    }
  }

  // 3. Positive Meeting
  if (
    lower.includes('call') || 
    lower.includes('meeting') || 
    lower.includes('schedule') || 
    lower.includes('demo') || 
    lower.includes('time to speak') || 
    lower.includes('available at') ||
    lower.includes('lets discuss') ||
    lower.includes("let's connect")
  ) {
    return {
      intent: ReplyIntent.POSITIVE_MEETING,
      confidence: 0.94,
      suggestedAction: 'SCHEDULE_MEETING',
      requiresHumanReview: true,
      dncTriggered: false,
    }
  }

  // 4. Positive Proposal
  if (
    lower.includes('send proposal') || 
    lower.includes('share details') || 
    lower.includes('more information') || 
    lower.includes('send details') || 
    lower.includes('brochure') ||
    lower.includes('mou draft')
  ) {
    return {
      intent: ReplyIntent.POSITIVE_PROPOSAL,
      confidence: 0.92,
      suggestedAction: 'SEND_PROPOSAL',
      requiresHumanReview: true,
      dncTriggered: false,
    }
  }

  // 5. Objection: Existing Partner
  if (
    lower.includes('already have') || 
    lower.includes('existing partner') || 
    lower.includes('exclusive vendor') || 
    lower.includes('current vendor')
  ) {
    return {
      intent: ReplyIntent.OBJECTION_EXISTING_PARTNER,
      confidence: 0.88,
      suggestedAction: 'DIFFERENTIATE_ASSURANCE_NETWORK',
      requiresHumanReview: true,
      dncTriggered: false,
    }
  }

  // 6. Objection: Timing
  if (
    lower.includes('next quarter') ||
    lower.includes('next year') ||
    lower.includes('not right now') ||
    lower.includes('reach out in') ||
    lower.includes('next cycle') ||
    lower.includes('later')
  ) {
    return {
      intent: ReplyIntent.OBJECTION_TIMING,
      confidence: 0.90,
      suggestedAction: 'SNOOZE_OUTREACH',
      requiresHumanReview: true,
      dncTriggered: false,
    }
  }

  // 7. Out of office
  if (
    lower.includes('out of office') || 
    lower.includes('on leave') || 
    lower.includes('auto-reply') || 
    lower.includes('away from my desk')
  ) {
    return {
      intent: ReplyIntent.OUT_OF_OFFICE,
      confidence: 0.98,
      suggestedAction: 'POSTPONE_FOLLOW_UP',
      requiresHumanReview: false,
      dncTriggered: false,
    }
  }

  // 8. Not interested
  if (
    lower.includes('not interested') || 
    lower.includes('no thank you') || 
    lower.includes('pass on this')
  ) {
    return {
      intent: ReplyIntent.NOT_INTERESTED,
      confidence: 0.91,
      suggestedAction: 'CLOSE_PROSPECT_ARCHIVE',
      requiresHumanReview: true,
      dncTriggered: false,
    }
  }

  return {
    intent: ReplyIntent.NEEDS_CLARIFICATION,
    confidence: 0.70,
    suggestedAction: 'MANUAL_OPERATOR_REVIEW',
    requiresHumanReview: true,
    dncTriggered: false,
  }
}
