import {
  INSTITUTION_PARTNERSHIP_PLANS,
  STUDENT_PROGRAMME_PLANS,
} from './commercial-policy';
import { COMPANY_IDENTITY } from './company-identity';

export const STUDENT_TERMS_VERSION = 'PC-STU-TC-2026.09-v4.1';
export const INSTITUTION_MOU_VERSION = 'PC-INST-MOU-2026.09-v4.1';

/**
 * Canonical Bifurcated Payment & Enrolment State Machine
 * Primary transactional activation (PAYMENT_VERIFIED -> ENROLLMENT_CONFIRMED) commits
 * immediately and atomically. Document generation, invoice generation, and email
 * dispatch are independent downstream side effects that never block or revert activation.
 */
export const CANONICAL_PAYMENT_STATE_MACHINE = {
  primaryActivationPath: [
    'TRACK_SELECTED',
    'TERMS_ACCEPTED',
    'CASHFREE_ORDER_CREATED',
    'PAYMENT_VERIFIED',
    'ENROLLMENT_CONFIRMED',
  ] as const,
  independentDownstreamSideEffects: [
    {
      branch: 'TC_SNAPSHOT_GENERATED',
      description: 'Immutable 6-Clause Accepted T&C Document + SHA-256 Checksum',
      blocksEnrollmentConfirmation: false,
    },
    {
      branch: 'RECEIPT_INVOICE_GENERATED',
      description: 'Statutory GST Tax Invoice (PC-INV-STU-*)',
      blocksEnrollmentConfirmation: false,
    },
    {
      branch: 'EMAIL_QUEUED_TO_SENT_OR_RETRY',
      states: ['EMAIL_QUEUED', 'EMAIL_SENT', 'EMAIL_RETRY_QUEUED'],
      description: 'Asynchronous SMTP Dispatch with Automatic Retry Queue',
      blocksEnrollmentConfirmation: false,
    },
  ] as const,
  architecturalRule:
    'PAYMENT_VERIFIED -> ENROLLMENT_CONFIRMED (atomic primary transition); independently triggers TC_SNAPSHOT_GENERATED, RECEIPT_INVOICE_GENERATED, and EMAIL_QUEUED -> EMAIL_SENT / EMAIL_RETRY_QUEUED.',
};

export interface AcceptedStudentTermsSnapshot {
  documentReference: string;
  termsVersion: string;
  acceptedAt: string;
  generatedAt: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  enrollmentNumber: string;
  institutionName: string;
  campusCode: string;
  programmeSlug: string;
  programmeName: string;
  baseFeeInr: number;
  gstAmountInr: number;
  totalPaidInr: number;
  orderId: string;
  paymentId: string;
  invoiceNumber: string;
  assuranceWindowMonths: number;
  guaranteedOpportunitiesCount: number;
  clauses: {
    title: string;
    body: string;
  }[];
}

export interface InstitutionalOnboardingSubmission {
  institutionId: string;
  legalName: string;
  displayName: string;
  institutionType: string;
  universityAffiliation: string;
  accreditation: string;
  registeredAddress: string;
  campusAddress: string;
  city: string;
  state: string;
  pincode: string;
  website: string;
  gstin: string;
  tpoName: string;
  tpoDesignation: string;
  tpoEmail: string;
  tpoPhone: string;
  alternateContact: string;
  principalName: string;
  principalEmail: string;
  principalPhone: string;
  managementName: string;
  managementDesignation: string;
  authorizedSignatoryName: string;
  authorizedSignatoryDesignation: string;
  authorizedSignatoryEmail: string;
  authorizedSignatoryPhone: string;
  departments: string[];
  estimatedGraduatingCohort: number;
  selectedPlanSlug: string;
  selectedPlanName: string;
  baseFeeInr: number;
  gstAmountInr: number;
  totalPayableInr: number;
  termsVersionAccepted: string;
  termsAcceptedAt: string;
  paymentGateway: 'CASHFREE';
  cashfreeOrderId: string;
  cashfreePaymentId: string;
  paymentMethod: string; // e.g. 'CASHFREE_UPI' | 'CASHFREE_NETBANKING' | 'CASHFREE_CARD'
  paymentVerificationStatus: 'PAID' | 'PAYMENT_PENDING' | 'PAYMENT_FAILED';
  uploadedDocuments: {
    code: string;
    title: string;
    filename: string;
    uploadedAt: string;
    status: 'UPLOADED' | 'VERIFIED' | 'CORRECTION_REQUIRED';
  }[];
  reviewStatus: 'PENDING_INSTITUTIONAL_REVIEW' | 'RETURNED_FOR_CORRECTION' | 'APPROVED' | 'REJECTED';
  correctionNotes?: string;
  reviewHistory: {
    timestamp: string;
    actor: string;
    action: 'SUBMITTED' | 'PAYMENT_CONFIRMED' | 'RETURNED_FOR_CORRECTION' | 'RESUBMITTED' | 'APPROVED' | 'REJECTED';
    note: string;
  }[];
  generatedMou?: {
    mouReference: string;
    version: string;
    generatedAt: string;
    startDate: string;
    endDate: string;
    approvedBy: string;
    executionStatus?: 'DRAFT_READY_FOR_SIGNATURE' | 'SIGNED_EXECUTED';
    counterSignedAt?: string;
  };
}

export type MouLifecycleStage =
  | 'DRAFT'
  | 'PENDING_ADMIN_REVIEW'
  | 'APPROVED'
  | 'MOU_GENERATED'
  | 'SENT_TO_INSTITUTION'
  | 'SIGNED_EXECUTED'
  | 'ACTIVE_PARTNERSHIP';

export const MOU_LIFECYCLE_STAGES: {
  id: MouLifecycleStage;
  code: MouLifecycleStage;
  step: number;
  label: string;
  shortLabel: string;
}[] = [
  { id: 'DRAFT', code: 'DRAFT', step: 1, label: 'Draft Onboarding', shortLabel: 'Draft' },
  { id: 'PENDING_ADMIN_REVIEW', code: 'PENDING_ADMIN_REVIEW', step: 2, label: 'Pending Admin Review', shortLabel: 'Pending Review' },
  { id: 'APPROVED', code: 'APPROVED', step: 3, label: 'Approved by Super Admin', shortLabel: 'Approved' },
  { id: 'MOU_GENERATED', code: 'MOU_GENERATED', step: 4, label: 'MoU — Ready for Signature', shortLabel: 'Ready for Signature' },
  { id: 'SENT_TO_INSTITUTION', code: 'SENT_TO_INSTITUTION', step: 5, label: 'Sent to Institution', shortLabel: 'Sent to College' },
  { id: 'SIGNED_EXECUTED', code: 'SIGNED_EXECUTED', step: 6, label: 'Signed / Executed MoU', shortLabel: 'Signed / Executed' },
  { id: 'ACTIVE_PARTNERSHIP', code: 'ACTIVE_PARTNERSHIP', step: 7, label: 'Active Partnership', shortLabel: 'Active Partnership' },
];

export function formatDualTimestamp(isoString?: string | Date | null): string {
  if (!isoString) {
    return '10 Jul 2026, 20:00 IST (14:30 UTC)';
  }
  const date = typeof isoString === 'string' ? new Date(isoString) : isoString;
  if (Number.isNaN(date.getTime())) {
    return String(isoString);
  }
  const istFormatter = new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Kolkata',
  });
  const utcFormatter = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  });
  return `${istFormatter.format(date)} IST (${utcFormatter.format(date)} UTC)`;
}

export const CANONICAL_ASSURANCE_LIFECYCLE = {
  ruleSummary:
    'Opportunities are provided progressively up to a maximum of 3 attempts. A candidate exits immediately upon corporate selection (Assurance Complete). Candidates who are not selected remain eligible for subsequent attempts, up to three total attempts. Employer cancellations do not consume attempts.',
  stages: ['Created', 'Matched', 'Scheduled', 'Attended', 'Outcome Recorded (Selected / Rejected)'],
  aaravSharmaSummary: {
    studentId: 'stu-apex-2026-01',
    name: 'Aarav Sharma',
    enrollmentNumber: 'APX2026CS042',
    department: 'Computer Science & Engineering',
    cgpa: 8.64,
    employabilityScore: 78,
    readinessTier: 'Tier-1 Ready',
    programmeTrack: 'Standard Track',
    totalPaidInr: 1180,
    completedCount: 1,
    scheduledCount: 1,
    matchingCount: 0,
    totalTargetCount: 3,
    assuranceHeadline: 'Attempt 2 of 3 Active (Attempt 1: Unsuccessful)',
    assuranceBreakdownLabel: '1 Attempt Used • 1 Scheduled • Max 3 Attempts',
    tpoTableBadge: 'Attempt 2 in Progress (1 Used)',
    candidateStatusBadge: 'Interviewing (Attempt 2 of 3)',
    urgentNextAction: {
      title: 'Prepare for Your Upcoming Interview — FinCore Digital Systems',
      subtitle: 'Opportunity #2 (Graduate Product Analyst) is confirmed for 28 Sep 2026, 11:30 IST (06:00 UTC). Complete your role brief and technical checklist before joining.',
      ctaLabel: 'Prepare for Upcoming Interview',
      ctaHref: '/student/interviews',
    },
  },
};

export const STUDENT_PROGRAMME_TERMS_CLAUSES = [
  {
    title: '1. Scope of the Progressive Interview Assurance Programme',
    body: 'PlacementConnect commits to facilitating up to three progressive verified corporate interview opportunities within 12 months of assessment completion for eligible students. A candidate exits the assurance cycle immediately upon receiving a corporate selection. Selection is determined solely by the employer. If PlacementConnect fails to provide the contracted qualifying progressive opportunities within 12 months to an eligible, unselected student who meets all participation obligations, a 100% refund of the base programme fee applies. PlacementConnect guarantees the verified interview opportunity process—not employment or selection.',
  },
  {
    title: '2. Programme Track & Statutory Fee Structure',
    body: `Students enroll in either the ${STUDENT_PROGRAMME_PLANS[0].name} (${STUDENT_PROGRAMME_PLANS[0].formattedBase} + 18% GST = ${STUDENT_PROGRAMME_PLANS[0].formattedTotal}) or the ${STUDENT_PROGRAMME_PLANS[1].name} (${STUDENT_PROGRAMME_PLANS[1].formattedBase} + 18% GST = ${STUDENT_PROGRAMME_PLANS[1].formattedTotal}). The selected track and fee are locked upon Cashfree payment confirmation.`,
  },
  {
    title: '3. Student Eligibility, Progressive Lifecycle & Participation Obligations',
    body: 'Every interview opportunity follows the sequential lifecycle: Created → Matched → Scheduled → Attended → Outcome Recorded. A student cannot progress to Opportunity N+1 unless Opportunity N has officially resulted in a verified unsuccessful outcome (REJECTED). To remain eligible under the assurance commitment, the student must: (a) complete the 9-Dimension Employability Assessment and achieve the baseline readiness benchmark (overall score >= 50/100); (b) maintain verified academic records and a complete placement profile; (c) attend all scheduled corporate interviews punctually with zero unexcused no-shows; and (d) not reject a verified corporate offer that meets the programme benchmark criteria. Employer cancellations or panel no-shows do not consume an attempt. An unexcused student no-show on a confirmed slot results in an official warning for the first occurrence and forfeiture of that attempt slot on the second occurrence.',
  },
  {
    title: '4. 12-Month Assurance Window Calculation',
    body: 'The 12-month assurance window commences strictly on the timestamp when the student completes the 9-Dimension Employability Assessment and achieves verified readiness eligibility (score >= 50/100), and expires exactly 365 calendar days thereafter. This assessment completion date is the single canonical anchor for all SLA evaluations, dashboard telemetry, and refund eligibility.',
  },
  {
    title: '5. Refund Policy & Statutory GST Treatment',
    body: 'If an eligible student who has fulfilled all participation and attendance obligations does not achieve corporate selection and PlacementConnect fails to facilitate up to three progressive verified corporate interview opportunities within 12 months of assessment completion, PlacementConnect refunds 100% of the base programme fee paid (₹1,000 for Standard Track or ₹2,500 for Extended Readiness Track) via Cashfree refund mechanics. If a candidate achieves selection at Opportunity 1, 2, or 3, the assurance commitment is successfully fulfilled and no refund is due. If a candidate completes three progressive attempts without selection, the maximum assurance cycle is completed and no refund is due. Statutory 18% GST (₹180 or ₹450) remitted to government tax authorities is non-refundable under Indian tax law.',
  },
  {
    title: '6. Electronic Acceptance & Immutable Transaction Record Preservation',
    body: 'By checking the acceptance box and proceeding to Cashfree checkout, the student records their affirmative electronic acceptance of the applicable Programme Terms & Conditions. This exact version of the Terms & Conditions, together with the student ID, dual timestamp (IST & UTC), track selection, and Cashfree payment reference, is preserved as an immutable transaction record according to the applicable retention policy and emailed upon payment confirmation.',
  },
];

export const INSTITUTIONAL_MOU_CLAUSES_SUMMARY = [
  {
    title: '1. Institutional Placement OS & Campus Code Provisioning',
    body: 'PlacementConnect grants the Partner Institution an active multi-tenant Training & Placement Office (TPO) workspace, dedicated 6-character Campus Code, QR student onboarding gateway, and Placement Reporting Summary.',
  },
  {
    title: '2. Fixed Commercial Terms, Non-Refundable Membership & Year-1 Upgrade Policy',
    body: `The Partner Institution selects either the ${INSTITUTION_PARTNERSHIP_PLANS[0].name} (${INSTITUTION_PARTNERSHIP_PLANS[0].formattedBase} + 18% GST = ${INSTITUTION_PARTNERSHIP_PLANS[0].formattedTotal}) or the ${INSTITUTION_PARTNERSHIP_PLANS[1].name} (${INSTITUTION_PARTNERSHIP_PLANS[1].formattedBase} + 18% GST = ${INSTITUTION_PARTNERSHIP_PLANS[1].formattedTotal}, reflecting 5 years for the price of 4 with 1 full year / ₹15,000 waived upfront). Institutional membership fees are fixed and non-refundable regardless of student enrollment counts. An institution subscribing to the 1-Year License may upgrade at any time during Year 1 by paying the remaining ₹45,000 (+ 18% GST) to extend coverage for 4 additional academic years (1 current + 4 extended = 5 continuous years).`,
  },
  {
    title: '3. Cashfree Payment Verification & MoU Approval Governance',
    body: 'Institutional payments are processed exclusively through Cashfree Checkout (supporting merchant-enabled UPI, Net Banking, Cards, and Cashfree bank rails) and reconciled via Cashfree server-side verification and webhooks. Payment confirmation unlocks the Institutional Onboarding review stage; final MoU generation occurs strictly after Super Admin approval of the institutional records and supporting documents.',
  },
  {
    title: '4. Data Protection, Roster Integrity & Accreditation Reporting',
    body: 'Student records remain isolated within the Partner Institution workspace in accordance with the Digital Personal Data Protection Act (DPDP), 2023. PlacementConnect provides structured four-stage denominator reporting (Total Graduating Cohort -> Registered -> Assessed -> Placed) designed to support institutional governance and internal accreditation documentation workflows (e.g., NAAC Criterion 5.2.1 and NIRF data tables).',
  },
];

export function buildAcceptedStudentTermsSnapshot(params: {
  studentId: string;
  studentName: string;
  studentEmail: string;
  enrollmentNumber: string;
  institutionName: string;
  campusCode: string;
  programmeSlug: string;
  acceptedAt: string;
  orderId: string;
  paymentId: string;
  invoiceNumber: string;
}): AcceptedStudentTermsSnapshot {
  const plan =
    STUDENT_PROGRAMME_PLANS.find(
      (p) =>
        p.slug === params.programmeSlug ||
        (params.programmeSlug === 'extended-readiness-track' && p.slug === 'placement-plus-student')
    ) || STUDENT_PROGRAMME_PLANS[0];

  return {
    documentReference: `DOC-TC-${params.orderId.slice(-8).toUpperCase()}`,
    termsVersion: STUDENT_TERMS_VERSION,
    acceptedAt: params.acceptedAt,
    generatedAt: new Date().toISOString(),
    studentId: params.studentId,
    studentName: params.studentName,
    studentEmail: params.studentEmail,
    enrollmentNumber: params.enrollmentNumber,
    institutionName: params.institutionName,
    campusCode: params.campusCode,
    programmeSlug: plan.slug,
    programmeName: plan.name,
    baseFeeInr: plan.baseFeeInr,
    gstAmountInr: plan.gstAmountInr,
    totalPaidInr: plan.totalPayableInr,
    orderId: params.orderId,
    paymentId: params.paymentId,
    invoiceNumber: params.invoiceNumber,
    assuranceWindowMonths: 12,
    guaranteedOpportunitiesCount: 3,
    clauses: STUDENT_PROGRAMME_TERMS_CLAUSES,
  };
}

export function renderCanonicalMouText(submission: InstitutionalOnboardingSubmission): {
  mouReference: string;
  version: string;
  startDate: string;
  endDate: string;
  executionStatus: 'DRAFT_READY_FOR_SIGNATURE' | 'SIGNED_EXECUTED';
  documentWatermarkLabel: string;
  sections: { heading: string; content: string }[];
} {
  const start = submission.generatedMou?.startDate || new Date().toISOString().split('T')[0];
  const years = submission.selectedPlanSlug === 'multi-cohort-5-year' ? 5 : 1;
  const endDateObj = new Date(start);
  endDateObj.setFullYear(endDateObj.getFullYear() + years);
  const end = submission.generatedMou?.endDate || endDateObj.toISOString().split('T')[0];
  const mouRef =
    submission.generatedMou?.mouReference ||
    `PC-MOU-2026-${submission.institutionId.slice(-6).toUpperCase()}`;
  const executionStatus =
    submission.generatedMou?.executionStatus || 'DRAFT_READY_FOR_SIGNATURE';
  const documentWatermarkLabel =
    executionStatus === 'SIGNED_EXECUTED'
      ? 'SIGNED / EXECUTED MOU — ACTIVE INSTITUTIONAL PARTNERSHIP'
      : 'DRAFT / READY FOR SIGNATURE — NOT YET EXECUTED';

  return {
    mouReference: mouRef,
    version: INSTITUTION_MOU_VERSION,
    startDate: start,
    endDate: end,
    executionStatus,
    documentWatermarkLabel,
    sections: [
      {
        heading: 'PARTIES TO THIS MEMORANDUM OF UNDERSTANDING',
        content: `This Institutional Placement Partnership Memorandum of Understanding ("MoU", Reference: ${mouRef}) is entered into on ${start} between ${COMPANY_IDENTITY.legalUnitName} ("PlacementConnect", First Party) and ${submission.legalName} (${submission.universityAffiliation}, having its campus at ${submission.campusAddress}, ${submission.city}, ${submission.state} - ${submission.pincode}, represented by its Authorized Signatory ${submission.authorizedSignatoryName}, ${submission.authorizedSignatoryDesignation}, and Principal ${submission.principalName}, "Partner Institution", Second Party).`,
      },
      {
        heading: '1. DESIGNATED PLACEMENT OFFICE & CAMPUS GOVERNANCE',
        content: `The Partner Institution designates ${submission.tpoName} (${submission.tpoDesignation}, Official Email: ${submission.tpoEmail}, Contact: ${submission.tpoPhone}) as its primary Training & Placement Officer (TPO) administrator for managing graduating cohorts (${submission.estimatedGraduatingCohort} students across ${submission.departments.join(', ')}) on the PlacementConnect platform.`,
      },
      {
        heading: '2. SELECTED INSTITUTIONAL PARTNERSHIP PLAN & TENURE',
        content: `The Partner Institution has subscribed to the ${submission.selectedPlanName} for the period from ${start} to ${end} (${years}-Year Tenure). Verified Fee Summary: Base Fee ₹${submission.baseFeeInr.toLocaleString('en-IN')} + 18% GST (₹${submission.gstAmountInr.toLocaleString('en-IN')}) = Total ₹${submission.totalPayableInr.toLocaleString('en-IN')} (Gateway: Cashfree • Order ID: ${submission.cashfreeOrderId} • Payment Reference: ${submission.cashfreePaymentId}).`,
      },
      {
        heading: '3. STUDENT PROGRESSIVE INTERVIEW ASSURANCE & FOUR-STAGE REPORTING',
        content: `Eligible graduating students enrolled through the Partner Institution's official campus code receive access to the 9-Dimension Employability Assessment and the Progressive Interview Assurance Programme (up to 3 progressive verified corporate interview opportunities within 12 months of assessment completion; immediate exit upon selection, backed by a 100% base programme fee refund if qualifying opportunities are unfulfilled). The Partner Institution receives live Four-Stage Cohort Reporting (Total Cohort -> Registered -> Assessed -> Placed) and downloadable governance evidence.`,
      },
      {
        heading: '4. ELECTRONIC EXECUTION & DIGITAL AUDIT RECORD',
        content:
          executionStatus === 'SIGNED_EXECUTED'
            ? `DOCUMENT STATUS: ${documentWatermarkLabel}. Terms Version ${submission.termsVersionAccepted} accepted on ${formatDualTimestamp(submission.termsAcceptedAt)}, generated by PlacementConnect Super Admin (${submission.generatedMou?.approvedBy || 'Platform Operations Desk'}) on ${formatDualTimestamp(submission.generatedMou?.generatedAt)}, and counter-executed by ${submission.authorizedSignatoryName} (${submission.authorizedSignatoryDesignation}, ${submission.authorizedSignatoryEmail}) on ${formatDualTimestamp(submission.generatedMou?.counterSignedAt || submission.termsAcceptedAt)}.`
            : `DOCUMENT STATUS: ${documentWatermarkLabel}. Generated from verified institutional onboarding records by PlacementConnect Super Admin (${submission.generatedMou?.approvedBy || 'Platform Operations Desk'}) on ${formatDualTimestamp(submission.generatedMou?.generatedAt)} under Terms Version ${submission.termsVersionAccepted}. Awaiting counter-execution by Authorized Signatory ${submission.authorizedSignatoryName} (${submission.authorizedSignatoryDesignation}, ${submission.authorizedSignatoryEmail}) to transition from Stage 4 (MoU — Ready for Signature) to Stage 6 (Signed / Executed MoU).`,
      },
    ],
  };
}
