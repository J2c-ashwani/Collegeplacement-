/**
 * PlacementConnect — Canonical Company Identity, Operator Disclosure & Governance Registry
 * Single source of truth for institutional identity, legal governance dates, and official routing desks.
 * Strictly prohibits fabricated addresses, placeholder phone numbers, or unobtained certifications.
 */

export const COMPANY_IDENTITY = {
  brandName: 'PlacementConnect',
  legalUnitName: 'PlacementConnect Institutional Systems (India Operations Desk)',
  tagline: 'Institutional Campus Placement & Verified Fresher Hiring Infrastructure',
  operatingModelDisclosure:
    'PlacementConnect is an India-focused multi-tenant institutional SaaS and verified campus hiring infrastructure platform currently onboarding founding engineering, management, and degree institutions under structured MoU partnerships.',
  pilotTransparencyNote:
    'Public interactive previews and sandbox workspaces (e.g., Apex Institute of Technology, TechCorp Solutions) use illustrative institutional cohort datasets to demonstrate 4-denominator placement accounting, 9-dimension employability evaluation, and 3N interview quota governance.',
  governanceEffectiveDate: '1 August 2026',
  lastReviewedDate: '15 September 2026',
  jurisdiction: 'New Delhi / National Capital Region (NCR), India',
  desks: {
    institutionalPartnerships: {
      label: 'Institutional Partnerships & MoU Desk (TPO / Principal / Dean)',
      email: 'institutions@placementconnect.com',
      sla: '1 Business Day Response SLA • Direct MoU & Cohort Onboarding',
    },
    employerAlliances: {
      label: 'Corporate Talent Acquisition & Campus Drives Desk',
      email: 'employers@placementconnect.com',
      sla: '1 Business Day Response SLA • Verified Shortlist & Drive Setup',
    },
    studentSupport: {
      label: 'Student Programme, Assessment & Assurance Desk',
      email: 'support@placementconnect.com',
      sla: '24-Hour Ticket Resolution • Assessment & 3N Quota Support',
    },
    billingAndRefunds: {
      label: 'Commercial Billing, GST Invoicing & Assurance Refund Desk',
      email: 'billing@placementconnect.com',
      sla: '2 Business Days • GST Invoicing & 100% Base Fee Refund SLA Processing',
    },
    privacyAndGrievance: {
      label: 'Data Protection & DPDP Act Grievance Officer Desk',
      officerTitle: 'Designated Institutional Grievance & Privacy Officer',
      email: 'grievance@placementconnect.com',
      generalContactEmail: 'contact@placementconnect.com',
      sla: 'Acknowledge within 24 hours; statutory resolution within 7 business days',
    },
  },
  sampleCredentials: {
    validStudentId: 'STU-2026-000001',
    validBadgeId: 'PC-9D-2026-8841',
    validStudentName: 'Aarav Sharma',
    validInstitutionName: 'Apex Institute of Technology (Sample Sandbox Cohort)',
    validCampusCode: 'APX123',
  },
} as const;
