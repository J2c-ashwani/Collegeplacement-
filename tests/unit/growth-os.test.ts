import { describe, it, expect } from 'vitest'
import {
  normalizeDomain,
  classifyFreshness,
  evaluateEmployerFit,
  calculateAssuranceCoveragePotential,
  evaluateCollegeICP,
  calculateActionScore,
  evaluateSafeActionPolicy,
  generateActionWhyExplanation,
  classifyInboundReply,
} from '@/services/growth-intelligence.service'

describe('GrowthOS Intelligence Engine & Mathematical Models', () => {
  describe('Domain Normalization & Canonical Root Resolution', () => {
    it('normalizes complex URLs to canonical root domain', () => {
      expect(normalizeDomain('https://www.ApexInstitute.edu.in/admissions/2026')).toBe('apexinstitute.edu.in')
      expect(normalizeDomain('http://subdomain.company.com:8080/careers?ref=linkedin')).toBe('company.com')
      expect(normalizeDomain('WWW.TECHCORP.CO.IN/')).toBe('techcorp.co.in')
      expect(normalizeDomain('https://careers.google.co.uk')).toBe('google.co.uk')
    })

    it('gracefully handles naked domains and edge cases', () => {
      expect(normalizeDomain('innovatech.io')).toBe('innovatech.io')
      expect(normalizeDomain('  https://portal.delhi-tech.ac.in/ ')).toBe('delhi-tech.ac.in')
    })
  })

  describe('Data Freshness Classification', () => {
    it('classifies records strictly by elapsed age', () => {
      const now = new Date()
      const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
      const fifteenDaysAgo = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000)
      const fortyDaysAgo = new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000)
      const oneHundredDaysAgo = new Date(now.getTime() - 100 * 24 * 60 * 60 * 1000)

      expect(classifyFreshness(threeDaysAgo)).toBe('FRESH')
      expect(classifyFreshness(fifteenDaysAgo)).toBe('RECENT')
      expect(classifyFreshness(fortyDaysAgo)).toBe('STALE')
      expect(classifyFreshness(oneHundredDaysAgo)).toBe('EXPIRED')
    })
  })

  describe('10-Dimension Employer Fit Scoring', () => {
    it('calculates deterministic score based on hiring volume and role fit', () => {
      const highFit = evaluateEmployerFit({
        hiringVolume: 40,
        openRoles: ['Inside Sales Associate', 'Customer Success', 'Technical Support'],
        matchedStudentCount: 180,
        region: 'Delhi NCR',
      })

      expect(highFit.score).toBeGreaterThanOrEqual(75)
      expect(highFit.breakdown).toBeDefined()
      expect(highFit.breakdown.hiringDemand).toBeGreaterThan(0)
      expect(highFit.breakdown.roleRelevance).toBeGreaterThan(0)
      expect(highFit.breakdown.candidateMatch).toBeGreaterThan(0)
    })

    it('penalizes low hiring volume and misaligned roles', () => {
      const lowFit = evaluateEmployerFit({
        hiringVolume: 1,
        openRoles: ['Senior Staff Architect 15+ Yrs'],
        matchedStudentCount: 0,
        region: 'Remote',
      })

      expect(lowFit.score).toBeLessThan(50)
    })
  })

  describe('Assurance Coverage Potential', () => {
    it('calculates deliverable interview slots and coverage index', () => {
      const coverage = calculateAssuranceCoveragePotential({
        openFresherRoles: 3,
        eligibleCandidatePool: 150,
        skillMatchCount: 65,
        regionalProximityCount: 50,
      })

      expect(coverage.deliverableSlotsThisMonth).toBeGreaterThan(0)
      expect(coverage.coverageYieldPercentage).toBeGreaterThan(0)
      expect(coverage.eligibleCandidatePool).toBe(150)
    })
  })

  describe('11-Dimension College ICP Scoring', () => {
    it('rewards high cohort strength, engineering alignment, and verified TPO', () => {
      const collegeResult = evaluateCollegeICP({
        estimatedCohort: 800,
        courses: ['B.Tech', 'BCA', 'MCA'],
        region: 'Delhi NCR',
        hasTpoContact: true,
        tpoEmailVerified: true,
        accreditation: 'NAAC A+',
      })

      expect(collegeResult.score).toBeGreaterThanOrEqual(75)
      expect(collegeResult.breakdown.studentVolume).toBeGreaterThan(0)
      expect(collegeResult.breakdown.courseRelevancy).toBeGreaterThan(0)
      expect(collegeResult.breakdown.tpoAccessibility).toBeGreaterThan(0)
    })

    it('handles institutions with minimal or unverified contacts', () => {
      const minimalCollege = evaluateCollegeICP({
        estimatedCohort: 100,
        courses: ['General Arts'],
        region: 'Remote',
        hasTpoContact: false,
        tpoEmailVerified: false,
      })

      expect(minimalCollege.score).toBeLessThan(55)
      expect(minimalCollege.breakdown.tpoAccessibility).toBeLessThanOrEqual(5)
    })
  })

  describe('Action Prioritization: (Impact × Urgency × Confidence) / Effort', () => {
    it('correctly ranks high impact, low effort actions first', () => {
      const quickWinScore = calculateActionScore({
        impact: 90,
        urgency: 85,
        confidence: 90,
        effort: 15,
      })

      const slowComplexScore = calculateActionScore({
        impact: 70,
        urgency: 50,
        confidence: 70,
        effort: 60,
      })

      expect(quickWinScore).toBeGreaterThan(slowComplexScore)
      expect(quickWinScore).toBeGreaterThan(400)
    })
  })

  describe('7-Point Safe Action Policy Engine', () => {
    it('passes completely compliant, fresh, verified prospect drafts', () => {
      const result = evaluateSafeActionPolicy({
        freshnessStatus: 'FRESH',
        provenancePresent: true,
        complianceStatus: 'VERIFIED',
        dnc: false,
        duplicateDetected: false,
        activeSequenceConflict: false,
        channel: 'EMAIL',
      })

      expect(result.isSafe).toBe(true)
      expect(result.violations).toHaveLength(0)
    })

    it('rejects stale records (>30 days)', () => {
      const result = evaluateSafeActionPolicy({
        freshnessStatus: 'STALE',
        provenancePresent: true,
        complianceStatus: 'VERIFIED',
        dnc: false,
        duplicateDetected: false,
        activeSequenceConflict: false,
        channel: 'EMAIL',
      })

      expect(result.isSafe).toBe(false)
      expect(result.violations).toContain('PROSPECT_DATA_STALE_OR_EXPIRED')
    })

    it('strictly blocks DNC suppressed targets', () => {
      const result = evaluateSafeActionPolicy({
        freshnessStatus: 'FRESH',
        provenancePresent: true,
        complianceStatus: 'VERIFIED',
        dnc: true,
        duplicateDetected: false,
        activeSequenceConflict: false,
        channel: 'EMAIL',
      })

      expect(result.isSafe).toBe(false)
      expect(result.violations).toContain('PROSPECT_IN_DNC_REGISTRY')
    })

    it('flags unapproved channels or missing provenance', () => {
      const result = evaluateSafeActionPolicy({
        freshnessStatus: 'FRESH',
        provenancePresent: false,
        complianceStatus: 'PENDING_REVIEW',
        dnc: false,
        duplicateDetected: false,
        activeSequenceConflict: false,
        channel: 'PHONE',
      })

      expect(result.isSafe).toBe(false)
      expect(result.violations.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('AI Action Observability / Explainability ("Why?" Breakdown)', () => {
    it('produces structured explanation with math and deficit factors', () => {
      const explanation = generateActionWhyExplanation({
        title: 'Acquire 300 Interview Slots in Delhi NCR',
        category: 'ACQUIRE_EMPLOYERS',
        targetRegion: 'Delhi NCR',
        targetDomain: 'Inside Sales',
        metricDeficit: 320,
        impactScore: 92,
        urgencyScore: 88,
        confidenceScore: 0.95,
        effortScore: 1.8,
      })

      expect(explanation.formulaBreakdown).toBeDefined()
      expect(explanation.primaryDriver).toContain('Delhi NCR')
      expect(explanation.deficitContext).toContain('320')
      expect(explanation.expectedMarketplaceImpact).toBeDefined()
    })
  })

  describe('Inbound Reply Intent Classification & DNC Suppression', () => {
    it('identifies meeting interest with high confidence', () => {
      const result = classifyInboundReply('Hi team, we would love to schedule a demo call this Friday at 11 AM.')
      expect(result.intent).toBe('POSITIVE_MEETING')
      expect(result.dncTriggered).toBe(false)
      expect(result.suggestedAction).toBe('SCHEDULE_MEETING')
    })

    it('detects unsubscribe request and triggers automatic DNC suppression', () => {
      const result = classifyInboundReply('Please stop emailing me. Remove me from your mailing list immediately.')
      expect(result.intent).toBe('UNSUBSCRIBE_DNC')
      expect(result.dncTriggered).toBe(true)
      expect(result.suggestedAction).toContain('SUPPRESS_DNC')
    })

    it('detects budget/pricing inquiries', () => {
      const result = classifyInboundReply('What is the fee or pricing structure for hiring freshers through your platform?')
      expect(result.intent).toBe('OBJECTION_BUDGET')
      expect(result.dncTriggered).toBe(false)
    })
  })
})
