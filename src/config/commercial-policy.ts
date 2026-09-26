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
    'Institutional membership fees are fixed and non-refundable regardless of student enrollment counts. Institutions subscribing to the 1-Year Annual License (₹15,000 + 18% GST = ₹17,700) may upgrade at any point during Year 1 by paying the remaining ₹45,000 (+ 18% GST = ₹53,100) to extend coverage for 4 additional academic years (1 current + 4 extended = 5 continuous years). Fresh 5-Year Agreements can also be contracted directly at ₹60,000 (+ 18% GST = ₹70,800).',
  deliverables: [
    'Four-level cohort placement reporting (Total Graduating Batch, Registered for Placement, Enrolled in Programme, and Assessed & Eligible)',
    'Structured CSV and PDF placement summaries designed to support institutional placement documentation and internal accreditation reporting workflows (e.g., NAAC Criterion 5.2.1 and NIRF data tables)',
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
    badge: 'Standard Institutional Partnership',
    durationYears: 1,
    baseFeeInr: 15000,
    basePriceInr: 15000,
    gstAmountInr: 2700,
    totalPayableInr: 17700,
    totalPriceInr: 17700,
    formattedBase: '₹15,000',
    formattedGst: '+ ₹2,700 GST',
    formattedTotal: '₹17,700 incl. GST',
    effectiveAnnualText: '₹15,000 / year + GST (Upgrade to 5-Year for ₹45,000 during Year 1)',
    waiverSummary: 'Fixed, non-refundable institutional fee; upgrade available during Year 1',
    summary:
      'Institutional placement operating system for colleges: complete TPO workspace, 9-dimension student readiness evaluation, employer drive coordination, and 4-stage cohort reporting for 1 academic year (up to 1,500 students). Upgradeable to 5 years anytime during Year 1.',
  },
  {
    id: 'INSTITUTION_MULTI_COHORT_5YR',
    slug: 'placement-5yr',
    name: '5-Year Multi-Cohort Agreement',
    badge: '1 Year Built-In Credit (₹75k → ₹60k)',
    durationYears: 5,
    baseFeeInr: 60000,
    basePriceInr: 60000,
    gstAmountInr: 10800,
    totalPayableInr: 70800,
    totalPriceInr: 70800,
    formattedBase: '₹60,000',
    formattedGst: '+ ₹10,800 GST',
    formattedTotal: '₹70,800 incl. GST',
    effectiveAnnualText: '₹12,000 / academic year across 5 cohorts (Save ₹15,000 off standard ₹75,000 rate)',
    waiverSummary: '5 Years for the Price of 4 (Fixed, non-refundable institutional fee)',
    summary:
      'Long-term institutional agreement covering 5 graduating batches (60 months, unlimited roster capacity). Or start with the 1-Year License and pay the remaining ₹45,000 (+ GST) during Year 1 to extend for 4 additional years (1 + 4 = 5 years).',
  },
] as const;

export const INSTITUTION_PARTNERSHIP_PLANS = INSTITUTION_COMMERCIAL_PLANS;

export const STUDENT_PROGRAMME_PLANS = [
  {
    id: 'ASSURANCE_CORE_1000',
    slug: 'placement-assurance',
    code: 'EMPLOYABILITY_ASSURANCE_CORE',
    name: 'Standard Track',
    badge: 'Standard Track',
    subtitle: '9-Area Job-Readiness Assessment, Verified Credential & Up to 3 Progressive Corporate Interview Opportunities',
    baseFeeInr: 1000,
    basePriceInr: 1000,
    gstAmountInr: 180,
    totalPayableInr: 1180,
    totalPriceInr: 1180,
    formattedBase: '₹1,000',
    formattedGst: '+ ₹180 (18% GST)',
    formattedTotal: '₹1,180 total',
    interviewQuota: 3,
    validityMonths: 12,
    refundBackstopText:
      '100% Base Fee Refund (₹1,000) if up to 3 progressive verified corporate interview opportunities matching your eligibility are not facilitated within 12 months of assessment completion, provided the student remains eligible and unselected.',
    deliverables: [
      'Up to 3 progressive verified corporate interview opportunities facilitated within 12 months of assessment completion for eligible students (students exit cycle immediately upon selection)',
      'Complete 9-Area Job-Readiness Assessment (36-item timed evaluation across analytical, technical, and workplace skills)',
      'Verified student profile and shareable digital scorecard with a unique verification ID for recruiters',
      'Student-controlled profile visibility (Public Credential, Employer-Authorized, or Private)',
      '100% Base Fee Refund Guarantee (₹1,000 refunded if qualifying progressive opportunities are not facilitated within 12 months for an eligible unselected student)',
    ],
  },
  {
    id: 'ASSURANCE_PRO_2500',
    slug: 'placement-plus-student',
    code: 'CAREER_ACCELERATION_PRO',
    name: 'Extended Readiness Track',
    badge: 'Extended Readiness Track',
    subtitle: 'Everything in Standard Track plus Guided Preparation, Second Assessment Attempt & Priority Drives',
    baseFeeInr: 2500,
    basePriceInr: 2500,
    gstAmountInr: 450,
    totalPayableInr: 2950,
    totalPriceInr: 2950,
    formattedBase: '₹2,500',
    formattedGst: '+ ₹450 (18% GST)',
    formattedTotal: '₹2,950 total',
    interviewQuota: 3,
    validityMonths: 12,
    refundBackstopText:
      '100% Base Fee Refund (₹2,500) if up to 3 progressive verified corporate interview opportunities matching your eligibility are not facilitated within 12 months of assessment completion, provided the student remains eligible and unselected.',
    deliverables: [
      'Everything in the Standard Track (₹1,180): Up to 3 progressive verified corporate interview opportunities within 12 months + 9-area assessment + verified profile',
      'Guided preparation modules across communication, analytical problem-solving, and role execution mapped to your baseline score',
      'Second full assessment attempt after preparation so you can improve your percentile (your higher score is kept for recruiters)',
      'Priority shortlist presentation for multi-campus pooled corporate hiring drives (your profile is included in the first batch of verified shortlists shared with hiring teams when you meet role cutoffs)',
      '100% Base Fee Refund Guarantee (₹2,500 refunded if qualifying progressive opportunities are not facilitated within 12 months for an eligible unselected student)',
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
  liquidityGuardrailMultiplier: 1.2, // Internal operational capacity reserve ratio (TPO/Admin)
  liquidityGuardrailLabel: 'Additional Employer Interview Capacity Maintained for Active Cohorts',
  liquidityGuardrailExplanation:
    'We maintain additional confirmed employer interview capacity in our active corporate hiring pipeline to support the active assurance cohort, expanding student intake only when verified employer slots are committed.',
  interviewQuotaMultiplier: 3,
  interviewQuotaLabel: 'Progressive Interview Assurance (Up to 3 Attempts)',
  interviewQuotaExplanation:
    'Eligible students receive up to three progressive verified corporate interview opportunities. A candidate exits the assurance cycle immediately upon selection. Students who are not selected progress to subsequent opportunities up to a maximum of three attempts.',
  assuranceBoundaryDisclosures: [
    'Process Commitment vs. Employment: PlacementConnect provides a Progressive Interview Assurance commitment (up to 3 progressive verified corporate interview opportunities within 12 months of assessment completion for eligible students, subject to programme eligibility and attendance terms)—not a guaranteed job offer. Final selection decisions always rest solely on candidate merit and employer panel evaluation.',
    'Definition of a Verified Corporate Interview Opportunity: An employer-confirmed interview assignment in which the eligible student was provided a valid interview slot and the interview was conducted, or the student was prevented from completing it due solely to employer-side failure. Scheduled slots do not count as delivered until conducted. Employer cancellations or panel no-shows do not consume an attempt; quota is restored immediately.',
    'Definition of Progressive Assurance Cycle: Students exit immediately upon receiving a selection offer. Candidates who are not selected remain eligible for the next opportunity, up to three total interview attempts. Opportunity N+1 cannot be scheduled until Opportunity N has officially resulted in a verified unsuccessful outcome (REJECTED).',
    'Definition of Priority Pooled Drive Consideration (Extended Track): When you meet an employer’s academic and 9-area cutoff for a multi-campus pooled hiring drive, your profile is placed in the first-wave shortlist batch presented to the hiring team.',
    '12-Month Assurance Period Anchor: The 12-month assurance period commences strictly on the timestamp when the student completes the 9-Area Employability Assessment and achieves verified readiness eligibility (score >= 50/100), and expires exactly 365 calendar days thereafter.',
    'Student Attendance & Conduct Obligations: Eligibility requires completing the 9-Area Employability Assessment, maintaining verified college enrollment, and attending scheduled interviews punctually. An unexcused student no-show results in an official warning on the first occurrence and forfeiture of that attempt slot on the second occurrence.',
    'Contractual Shortfall Refund Condition: If PlacementConnect fails to facilitate up to 3 progressive verified corporate interview opportunities within 12 months of assessment completion for an eligible unselected student, 100% of the base programme fee (₹1,000 or ₹2,500) is refunded; statutory 18% GST remitted to tax authorities is non-refundable under Indian tax law.',
  ],
} as const;
