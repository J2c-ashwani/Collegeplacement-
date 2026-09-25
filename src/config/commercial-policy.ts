/**
 * PlacementConnect — Canonical Commercial Policy, Pricing & SLA Specification (v4.1)
 * Single source of truth across /pricing, /for-colleges, /for-employers, /for-students,
 * /placement-assurance, /faqs, /refund-policy, /employer/overview, and prisma/seed.ts.
 * Enforces Quiet Enterprise Confidence: zero raw markdown backticks, human-first buyer language,
 * and discoverable technical depth.
 */

export const GST_POLICY = {
  ratePercent: 18,
  rateDecimal: 0.18,
  legalNote:
    'All commercial fees are quoted in Indian Rupees (INR) with base fee and statutory 18% GST clearly itemized. GST-compliant tax invoices (HSN/SAC 998314 / 998519) are issued for all institutional and corporate transactions.',
} as const;

export const INSTITUTION_COMMERCIAL_PLAN = {
  id: 'INSTITUTION_CORE_ANNUAL',
  name: 'Institutional Placement Operating System',
  audience: 'Colleges, Universities & Autonomous Institutes (TPO / Principal)',
  baseFeeInr: 15000,
  gstAmountInr: 2700,
  totalPayableInr: 17700,
  fiveYearStandardRateInr: 75000,
  fiveYearBaseInr: 60000,
  fiveYearGstInr: 10800,
  fiveYearTotalInr: 70800,
  upgradeDuringYearOneRemainingBaseInr: 45000,
  upgradeDuringYearOneRemainingGstInr: 8100,
  upgradeDuringYearOneRemainingTotalInr: 53100,
  fiveYearEffectiveAnnualInr: 12000,
  billingCycle: 'per year / campus',
  formattedBase: '₹15,000',
  formattedGst: '₹2,700 (18% GST)',
  formattedTotal: '₹17,700 / year (incl. GST)',
  formattedFiveYearBase: '₹60,000',
  formattedFiveYearGst: '₹10,800 (18% GST)',
  formattedFiveYearTotal: '₹70,800 / 5 years (incl. GST)',
  pilotWaiverNote:
    '1-Year Annual License (₹15,000/yr) qualifies for a full Year-1 fee waiver when 100+ final-year students enroll. The 5-Year Agreement (₹60,000 instead of ₹75,000) already includes 1 full year (₹15,000) waived upfront. Colleges on a 1-Year plan with 100+ enrolled students can pay ₹45,000 (+ GST) during Year 1 to extend for 4 additional years (1 current + 4 extended = 5 years), or pay ₹60,000 (+ GST) after Year 1 for a fresh 5-year term.',
  deliverables: [
    'Four-level cohort placement reporting (Total Graduating Batch, Registered for Placement, Enrolled in Programme, and Assessed & Eligible)',
    'Structured CSV and PDF placement summaries designed to support institutional placement documentation and internal NAAC/NIRF reporting workflows',
    'Dedicated campus onboarding portal and QR code (e.g., APX123) with automated roll-number verification',
    'Digital MoU registry, campus drive scheduling calendar, and live employer interview capacity tracking',
    'Department-level TPO access controls and complete operational activity logs',
  ],
} as const;

export const INSTITUTION_COMMERCIAL_PLANS = [
  {
    id: 'INSTITUTION_CORE_ANNUAL',
    slug: 'placement',
    name: '1-Year Annual License',
    badge: 'Recommended for New Institutions',
    durationYears: 1,
    baseFeeInr: 15000,
    gstAmountInr: 2700,
    totalPayableInr: 17700,
    formattedBase: '₹15,000',
    formattedGst: '+ ₹2,700 GST',
    formattedTotal: '₹17,700 incl. GST',
    effectiveAnnualText: '₹15,000 / year + GST (Year-1 fee waived with 100+ students)',
    summary:
      'Recommended initial partnership for colleges: complete TPO workspace, student readiness evaluation, employer drive coordination, and 4-stage cohort reporting for 1 academic year (up to 1,500 students).',
  },
  {
    id: 'INSTITUTION_MULTI_COHORT_5YR',
    slug: 'placement-5yr',
    name: '5-Year Multi-Cohort Agreement',
    badge: '1 Year Free Built-In (₹75k → ₹60k)',
    durationYears: 5,
    baseFeeInr: 60000,
    gstAmountInr: 10800,
    totalPayableInr: 70800,
    formattedBase: '₹60,000',
    formattedGst: '+ ₹10,800 GST',
    formattedTotal: '₹70,800 incl. GST',
    effectiveAnnualText: '5 Years for the Price of 4 (₹15,000 already waived off ₹75,000)',
    summary:
      'Optional 5-year agreement (₹15,000 × 5 yrs = ₹75,000, offered at ₹60,000 with 1 year already waived). Or start with 1 Year and pay ₹45,000 remaining during Year 1 (after 100+ students) to extend for 4 more years (1 + 4 = 5 yrs).',
  },
] as const;

export const STUDENT_PROGRAMME_PLANS = [
  {
    id: 'ASSURANCE_CORE_1000',
    code: 'EMPLOYABILITY_ASSURANCE_CORE',
    name: 'Standard Track',
    badge: 'Standard Track',
    baseFeeInr: 1000,
    gstAmountInr: 180,
    totalPayableInr: 1180,
    formattedBase: '₹1,000',
    formattedGst: '+ ₹180 (18% GST)',
    formattedTotal: '₹1,180 total',
    interviewQuota: 3,
    validityMonths: 12,
    refundBackstopText:
      '100% Base Fee Refund (₹1,000) if 3 verified corporate interview opportunities matching your eligibility are not facilitated within 12 months of assessment completion.',
    deliverables: [
      '3 verified corporate interview opportunities facilitated within 12 months of assessment completion for eligible students',
      'Complete 9-Area Job-Readiness Assessment (36-item timed evaluation across analytical, technical, and workplace skills)',
      'Verified student profile and shareable digital scorecard with a unique verification ID for recruiters',
      'Student-controlled profile visibility (Public Credential, Employer-Authorized, or Private)',
      '100% Base Fee Refund Guarantee (₹1,000 refunded if 3 verified corporate interviews are not facilitated within 12 months of assessment completion)',
    ],
  },
  {
    id: 'ASSURANCE_PRO_2500',
    code: 'CAREER_ACCELERATION_PRO',
    name: 'Extended Readiness Track',
    badge: 'Extended Readiness Track',
    baseFeeInr: 2500,
    gstAmountInr: 450,
    totalPayableInr: 2950,
    formattedBase: '₹2,500',
    formattedGst: '+ ₹450 (18% GST)',
    formattedTotal: '₹2,950 total',
    interviewQuota: 3,
    validityMonths: 12,
    refundBackstopText:
      '100% Base Fee Refund (₹2,500) if 3 verified corporate interview opportunities matching your eligibility are not facilitated within 12 months of assessment completion.',
    deliverables: [
      'Everything in the Standard Track (₹1,180): 3 verified corporate interview opportunities within 12 months of assessment completion + 9-area assessment + verified profile',
      'Guided preparation modules across communication, analytical problem-solving, and role execution mapped to your baseline score',
      'Second full assessment attempt after preparation so you can improve your percentile (your higher score is kept for recruiters)',
      'Priority shortlist presentation for multi-campus pooled corporate hiring drives (your profile is included in the first batch of verified shortlists shared with hiring teams when you meet role cutoffs)',
      '100% Base Fee Refund Guarantee (₹2,500 refunded if 3 verified corporate interviews are not facilitated within 12 months of assessment completion)',
    ],
  },
] as const;

export const EMPLOYER_COMMERCIAL_POLICY = {
  id: 'EMPLOYER_VERIFIED_HIRING',
  name: 'Built for High-Efficiency Graduate Hiring Teams',
  audience: 'Corporate HR, Talent Acquisition Heads & University Relations Teams',
  platformAccessFeeInr: 0,
  formattedPlatformFee: 'Custom Hiring Partnership',
  perVerifiedJoinFeeInr: 10000,
  perVerifiedJoinGstInr: 1800,
  perVerifiedJoinTotalInr: 11800,
  formattedPerJoinFee: 'Commercial terms are discussed during employer onboarding',
  probationReplacementDays: 60,
  replacementGuaranteeHeadline: 'Designed for Efficient Graduate Hiring',
  replacementGuaranteeDetail:
    'Hiring partnerships are structured based on your graduate role requirements, target degree streams, and interview coordination scope. Commercial terms are discussed directly during employer onboarding.',
  deliverables: [
    'Institution-verified candidate pools (academic eligibility and enrollment information verified through each participating institution)',
    'Pre-assessed candidate shortlists ranked by your role-specific thresholds across 9 core competency areas (0–100 scale)',
    'Institution-verified academic records (CGPA, active backlog status, graduation batch, and enrollment ID)',
    'Coordinate campus and multi-campus pooled interviews in one workspace without managing scattered spreadsheets and email threads',
    'Verifiable candidate scorecards with unique verification IDs and structured panel evaluation rubrics',
    'Multi-campus hiring support from shortlist presentation through final offer and joining coordination',
  ],
} as const;

export const GOVERNANCE_MOAT_MECHANICS = {
  liquidityGuardrailMultiplier: 1.2,
  liquidityGuardrailLabel: 'We Secure More Interview Capacity Than the Number of Students We Commit To',
  liquidityGuardrailExplanation:
    'Before expanding a student cohort, PlacementConnect maintains additional confirmed employer interview capacity (at least a 1.20× capacity reserve) in our active hiring pipeline so every eligible student can be scheduled across 3 corporate interviews.',
  interviewQuotaMultiplier: 3,
  interviewQuotaLabel: '3 Corporate Interview Assurance',
  interviewQuotaExplanation:
    'Every eligible student is tracked from enrollment through 3 completed corporate interviews (0/3 to 3/3), receiving priority shortlist placement until their interview commitment is fulfilled.',
  assuranceBoundaryDisclosures: [
    'PlacementConnect provides a 3 Corporate Interview Assurance (3 verified corporate interview opportunities within 12 months of assessment completion for eligible students, subject to programme eligibility and attendance terms)—not a guaranteed job offer. Final selection decisions always rest on candidate merit and employer evaluation.',
    'Definition of a Verified Corporate Interview Opportunity: A confirmed first-round corporate interview slot with a registered employer for a fresher role matching your degree stream and academic eligibility criteria.',
    'Definition of Priority Pooled Drive Consideration (Extended Track): When you meet an employer’s academic and 9-area cutoff for a multi-campus pooled hiring drive, your profile is placed in the first-wave shortlist batch presented to the hiring team.',
    'Eligibility requires completing the 9-Area Employability Assessment, maintaining verified college enrollment, and attending scheduled interviews without unexcused absences.',
    'If PlacementConnect does not facilitate 3 verified corporate interview opportunities within 12 months of assessment completion for an eligible student, 100% of the base programme fee (₹1,000 or ₹2,500) is refunded; statutory 18% GST remitted to tax authorities is non-refundable under Indian tax law.',
  ],
} as const;
