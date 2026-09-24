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
  billingCycle: 'per year / campus',
  formattedBase: '₹15,000',
  formattedGst: '₹2,700 (18% GST)',
  formattedTotal: '₹17,700 / year (incl. GST)',
  pilotWaiverNote:
    'Eligible for a full Year-1 license fee waiver under our standard Institutional MoU when 100 or more final-year students enroll in the Interview Assurance Programme.',
  deliverables: [
    'Four-level cohort placement reporting (Total Graduating Batch, Registered for Placement, Enrolled in Programme, and Assessed & Eligible)',
    'Structured CSV and PDF placement summaries designed to support institutional placement documentation and internal NAAC, NIRF, and AICTE reporting workflows',
    'Dedicated campus onboarding portal and QR code (e.g., APX123) with automated roll-number verification',
    'Digital MoU registry, campus drive scheduling calendar, and live employer interview capacity tracking',
    'Department-level TPO access controls and complete operational activity logs',
  ],
} as const;

export const STUDENT_PROGRAMME_PLANS = [
  {
    id: 'ASSURANCE_CORE_1000',
    code: 'EMPLOYABILITY_ASSURANCE_CORE',
    name: 'Graduate Assessment & 3-Interview Assurance Track',
    badge: 'Standard Campus Cohort Track',
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
    name: 'Advanced Career Readiness & Priority Drive Track',
    badge: 'Extended Readiness + Re-Assessment',
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
      'Priority shortlist consideration for multi-campus pooled corporate hiring drives',
      '100% Base Fee Refund Guarantee (₹2,500 refunded if 3 verified corporate interviews are not facilitated within 12 months of assessment completion)',
    ],
  },
] as const;

export const EMPLOYER_COMMERCIAL_POLICY = {
  id: 'EMPLOYER_VERIFIED_HIRING',
  name: 'Corporate Graduate Hiring & Verified Shortlists',
  audience: 'Corporate HR, Talent Acquisition Heads & University Relations Teams',
  platformAccessFeeInr: 0,
  formattedPlatformFee: '₹0 Platform Subscription Fee',
  perVerifiedJoinFeeInr: 10000,
  perVerifiedJoinGstInr: 1800,
  perVerifiedJoinTotalInr: 11800,
  formattedPerJoinFee: '₹10,000 + 18% GST per verified hire upon joining (Zero upfront cost)',
  probationReplacementDays: 60,
  replacementGuaranteeHeadline: '60-Day Candidate Replacement Guarantee',
  replacementGuaranteeDetail:
    'Platform access, role posting, 9-dimension candidate screening, and multi-campus interview coordination carry ₹0 subscription cost. Under our Standard Hiring Agreement, a success fee of ₹10,000 + 18% GST applies only after a selected candidate formally joins your organization, backed by a 60-day free replacement or credit note if the hire exits during probation.',
  deliverables: [
    '₹0 annual subscription — post graduate and entry-level roles across partner institutions at no upfront cost',
    'Pre-assessed candidate shortlists filtered across 9 core employability dimensions (0–100 scale)',
    'Institution-verified academic records (CGPA, active backlog status, graduation batch, and enrollment ID)',
    'Automated interview slot scheduling and structured panel evaluation sheets for campus and pooled drives',
    'Pay-on-join commercial model (₹10,000 + GST) protected by a 60-day probation replacement guarantee',
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
    'Eligibility requires completing the 9-Area Employability Assessment, maintaining verified college enrollment, and attending scheduled interviews without unexcused absences.',
    'If PlacementConnect does not facilitate 3 verified corporate interview opportunities within 12 months of assessment completion for an eligible student, 100% of the base programme fee (₹1,000 or ₹2,500) is refunded; statutory 18% GST remitted to tax authorities is non-refundable under Indian tax law.',
  ],
} as const;
