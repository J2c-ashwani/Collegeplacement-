import {
  INSTITUTION_PARTNERSHIP_PLANS,
  STUDENT_PROGRAMME_PLANS,
} from './commercial-policy';
import { COMPANY_IDENTITY } from './company-identity';

export const STUDENT_TERMS_VERSION = 'PC-STU-TC-2026.09-v4.1';
export const INSTITUTION_MOU_VERSION = 'PC-INST-MOU-2026.09-v4.1';

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
  };
}

export const STUDENT_PROGRAMME_TERMS_CLAUSES = [
  {
    title: '1. Scope of the 3-Interview Assurance Programme',
    body: 'PlacementConnect guarantees to facilitate at least 3 verified corporate interview opportunities within 12 months of assessment completion for eligible students, backed by a 100% base programme fee refund if unfulfilled. Final hiring decisions and employment offers depend strictly on candidate merit and employer selection panels.',
  },
  {
    title: '2. Programme Track & Statutory Fee Structure',
    body: `Students enroll in either the ${STUDENT_PROGRAMME_PLANS[0].name} (${STUDENT_PROGRAMME_PLANS[0].formattedBase} + 18% GST = ${STUDENT_PROGRAMME_PLANS[0].formattedTotal}) or the ${STUDENT_PROGRAMME_PLANS[1].name} (${STUDENT_PROGRAMME_PLANS[1].formattedBase} + 18% GST = ${STUDENT_PROGRAMME_PLANS[1].formattedTotal}). The selected track and fee are locked upon Cashfree payment confirmation.`,
  },
  {
    title: '3. Student Eligibility & Mandatory Participation Obligations',
    body: 'To remain eligible under the 3-Interview Assurance commitment, the student must: (a) complete the 9-Dimension Employability Assessment and achieve the baseline readiness benchmark (overall score >= 50/100); (b) maintain verified academic records and a complete placement profile; (c) attend all scheduled corporate interviews punctually with zero unexcused no-shows; and (d) not reject a verified corporate offer that meets the programme benchmark criteria.',
  },
  {
    title: '4. 12-Month Assurance Window Calculation',
    body: 'The 12-month assurance window commences strictly on the timestamp when the student completes the 9-Dimension Employability Assessment and achieves verified readiness eligibility, and expires exactly 365 calendar days thereafter.',
  },
  {
    title: '5. Refund Policy & Statutory GST Treatment',
    body: 'If an eligible student who has fulfilled all participation and attendance obligations receives fewer than 3 verified corporate interview opportunities within 12 months of assessment completion, PlacementConnect refunds 100% of the base programme fee paid (₹1,000 for Standard Track or ₹2,500 for Extended Readiness Track) via Cashfree refund mechanics. Statutory 18% GST (₹180 or ₹450) remitted to government tax authorities is non-refundable.',
  },
  {
    title: '6. Electronic Consent & Immutable Record Preservation',
    body: 'By checking the acceptance box and proceeding to Cashfree checkout, the student executes a legally binding electronic acceptance under the Information Technology Act, 2000. This exact version of the Terms & Conditions, together with the student ID, timestamp, track selection, and Cashfree payment reference, is permanently archived and emailed upon payment confirmation.',
  },
];

export const INSTITUTIONAL_MOU_CLAUSES_SUMMARY = [
  {
    title: '1. Institutional Placement OS & Campus Code Provisioning',
    body: 'PlacementConnect grants the Partner Institution an active multi-tenant Training & Placement Office (TPO) workspace, dedicated 6-character Campus Code, QR student onboarding gateway, and Four-Stage Cohort Reporting ledger.',
  },
  {
    title: '2. Annual & Multi-Cohort Commercial Terms & Year-1 Waiver Policy',
    body: `The Partner Institution selects either the ${INSTITUTION_PARTNERSHIP_PLANS[0].name} (${INSTITUTION_PARTNERSHIP_PLANS[0].formattedBase} + 18% GST = ${INSTITUTION_PARTNERSHIP_PLANS[0].formattedTotal}) or the ${INSTITUTION_PARTNERSHIP_PLANS[1].name} (${INSTITUTION_PARTNERSHIP_PLANS[1].formattedBase} + 18% GST = ${INSTITUTION_PARTNERSHIP_PLANS[1].formattedTotal}, reflecting 1 full year / ₹15,000 waived upfront off the ₹75,000 5-year rate). Where an institution starts on the 1-Year Annual License and achieves 100+ verified paid student enrollments within 90 days, its ₹15,000 Year-1 base fee is waived/credited and it may upgrade to the 5-year agreement by paying the remaining ₹45,000 + GST during Year 1.`,
  },
  {
    title: '3. Cashfree Payment Verification & MoU Approval Governance',
    body: 'Institutional payments are processed exclusively through Cashfree Checkout (supporting merchant-enabled UPI, Net Banking, Cards, and Cashfree bank rails) and reconciled via Cashfree server-side verification and webhooks. Payment confirmation unlocks the Institutional Onboarding review stage; final MoU generation occurs strictly after Super Admin approval of the institutional records and supporting documents.',
  },
  {
    title: '4. Data Protection, Roster Integrity & Accreditation Reporting',
    body: 'Student records remain isolated within the Partner Institution workspace in accordance with the Digital Personal Data Protection Act (DPDP), 2023. PlacementConnect provides structured four-stage denominator reporting (Total Graduating Cohort -> Registered -> Assessed -> Placed) to support institutional governance and NAAC/NIRF documentation.',
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

  return {
    mouReference: mouRef,
    version: INSTITUTION_MOU_VERSION,
    startDate: start,
    endDate: end,
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
        heading: '3. STUDENT 3-INTERVIEW ASSURANCE & FOUR-STAGE REPORTING',
        content: `Eligible graduating students enrolled through the Partner Institution's official campus code receive access to the 9-Dimension Employability Assessment and the 3-Interview Assurance Programme (3 verified corporate interview opportunities within 12 months of assessment completion, backed by a 100% base programme fee refund if unfulfilled). The Partner Institution receives live Four-Stage Cohort Reporting (Total Cohort -> Registered -> Assessed -> Placed) and downloadable governance evidence.`,
      },
      {
        heading: '4. ELECTRONIC EXECUTION & DIGITAL AUDIT RECORD',
        content: `Accepted electronically by ${submission.authorizedSignatoryName} (${submission.authorizedSignatoryDesignation}, ${submission.authorizedSignatoryEmail}) under Terms Version ${submission.termsVersionAccepted} on ${submission.termsAcceptedAt}, and approved by PlacementConnect Super Admin (${submission.generatedMou?.approvedBy || 'Platform Operations Desk'}) on ${submission.generatedMou?.generatedAt || new Date().toISOString()}.`,
      },
    ],
  };
}
