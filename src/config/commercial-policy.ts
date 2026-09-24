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
      '100% Base Fee Refund (₹1,000) if fewer than 3 verified employer interview opportunities matching your eligibility are facilitated within 12 months of assessment completion.',
    deliverables: [
      'Complete 9-Dimension Employability Evaluation (36-item timed assessment across analytical, technical, and workplace readiness skills)',
      'Verifiable digital scorecard and LinkedIn credential with a unique verification ID',
      'Minimum of 3 verified corporate interview opportunities facilitated within 12 months',
      'Student-controlled profile visibility (Public Credential, Employer-Authorized, or Private)',
      '100% Base Fee Refund Guarantee (₹1,000 refunded if 3 verified interviews are not scheduled within 12 months)',
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
      '100% Base Fee Refund (₹2,500) if fewer than 3 verified employer interview opportunities matching your eligibility are facilitated within 12 months of assessment completion.',
    deliverables: [
      'Everything in the ₹1,000 Graduate Assessment & 3-Interview Assurance Track',
      'Two assessment attempts (initial diagnostic baseline plus a second post-preparation evaluation to improve your percentile)',
      'Structured communication, analytical, and domain preparation modules mapped to your evaluation report',
      'Priority shortlist routing for multi-campus pooled hiring drives',
      '100% Base Fee Refund Guarantee (₹2,500 refunded if 3 verified interviews are not scheduled within 12 months)',
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
    'PlacementConnect provides a 3-Interview Placement Assurance (up to 3 qualified corporate interview opportunities, subject to programme eligibility and terms)—not a guaranteed job offer. Final selection decisions always rest on candidate merit and employer evaluation.',
    'Eligibility requires completing the 9-Dimension Employability Assessment, maintaining verified college enrollment, and attending scheduled interviews without unexcused absences.',
    'If PlacementConnect does not facilitate 3 verified interviews within 12 months for an eligible student, 100% of the base programme fee (₹1,000 or ₹2,500) is refunded; statutory 18% GST remitted to tax authorities is non-refundable under Indian tax law.',
  ],
} as const;
