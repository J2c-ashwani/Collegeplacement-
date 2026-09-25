import Link from 'next/link';
import { HelpCircle, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  INSTITUTION_COMMERCIAL_PLAN,
  STUDENT_PROGRAMME_PLANS,
  EMPLOYER_COMMERCIAL_POLICY,
  GOVERNANCE_MOAT_MECHANICS,
} from '@/config/commercial-policy';
import { SAFE_TERMINOLOGY } from '@/config/brand-system';
import { COMPANY_IDENTITY } from '@/config/company-identity';

const FAQ_SECTIONS = [
  {
    category: 'For Colleges, Universities & Placement Officers (TPOs)',
    items: [
      {
        q: 'How does PlacementConnect report campus placement percentages clearly for accreditation reviews?',
        a: `Under our ${SAFE_TERMINOLOGY.institutionalGovernanceName}, every graduating cohort is tracked across four clear denominators simultaneously: (1) Total Graduating Batch, (2) Registered for Placement, (3) Enrolled in Interview Assurance, and (4) Assessed & Eligible Candidates. TPOs and Principals can export structured CSV and PDF reports showing exact numerator and denominator figures.`,
      },
      {
        q: 'What are the institutional license options for an engineering, management, or degree college?',
        a: `Colleges typically start with our recommended 1-Year Annual License (${INSTITUTION_COMMERCIAL_PLAN.formattedBase} + ₹2,700 GST = ${INSTITUTION_COMMERCIAL_PLAN.formattedTotal}) or select our optional 5-Year Multi-Cohort Agreement (${INSTITUTION_COMMERCIAL_PLAN.formattedFiveYearBase} + ₹10,800 GST = ${INSTITUTION_COMMERCIAL_PLAN.formattedFiveYearTotal} — 5 years for the price of 4, with ₹15,000 already waived off ₹75,000). ${INSTITUTION_COMMERCIAL_PLAN.pilotWaiverNote}`,
      },
      {
        q: 'How do students from our college register without unauthorized outsiders joining our batch roster?',
        a: 'Each partner institution receives a dedicated 6-character Campus Code (for example, APX123) and a custom QR onboarding portal that verifies student roll numbers and academic branches against your uploaded batch roster.',
      },
    ],
  },
  {
    category: 'For Corporate Employers & Talent Acquisition Teams',
    items: [
      {
        q: 'How does PlacementConnect help employers shortlist graduating candidates?',
        a: 'Employers define role requirements across engineering, analytics, operations, or business tracks and receive candidate shortlists from verified college rosters ranked across 9 standardized readiness dimensions, eliminating manual screening of hundreds of unverified resumes.',
      },
      {
        q: 'How can our HR team verify that a candidate’s 9-Dimension Scorecard is authentic?',
        a: `Every evaluated student receives a unique Credential ID (such as ${COMPANY_IDENTITY.sampleCredentials.validStudentId}). Recruiters can enter any ID at /verify to confirm whether the credential is Valid, Inactive/Expired, or Not Found.`,
      },
      {
        q: 'How are corporate hiring partnerships structured?',
        a: 'Hiring partnerships are structured based on employer requirements and partnership scope—supporting single-college drives, multi-campus pooled drives, or role-specific shortlists. Commercial terms are discussed during employer onboarding.',
      },
    ],
  },
  {
    category: 'For Graduating Students & 3-Interview Assurance',
    items: [
      {
        q: 'Does the programme guarantee a job offer, or does it guarantee verified corporate interviews?',
        a: `${GOVERNANCE_MOAT_MECHANICS.assuranceBoundaryDisclosures[0]} Every eligible student is protected by our ${GOVERNANCE_MOAT_MECHANICS.interviewQuotaLabel} (minimum of 3 verified corporate interview opportunities within 12 months).`,
      },
      {
        q: 'What is the difference between the Standard Track (₹1,180) and Extended Readiness Track (₹2,950)?',
        a: `The ${STUDENT_PROGRAMME_PLANS[0].name} (${STUDENT_PROGRAMME_PLANS[0].formattedBase} + ₹180 GST = ${STUDENT_PROGRAMME_PLANS[0].formattedTotal}) includes the full 9-Dimension Employability Evaluation, a verifiable digital credential, and 3 verified corporate interview opportunities within 12 months of assessment completion. The ${STUDENT_PROGRAMME_PLANS[1].name} (${STUDENT_PROGRAMME_PLANS[1].formattedBase} + ₹450 GST = ${STUDENT_PROGRAMME_PLANS[1].formattedTotal}) adds guided preparation modules, a second assessment attempt (keeping your higher score), and priority pooled-drive shortlist consideration.`,
      },
      {
        q: 'How does the 100% Base Fee Refund Guarantee work if 3 interviews are not scheduled?',
        a: `${GOVERNANCE_MOAT_MECHANICS.assuranceBoundaryDisclosures[4]}`,
      },
    ],
  },
];

export default function FAQsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="space-y-3 border-b border-slate-200 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-[#1E40AF]">
            <HelpCircle className="h-3.5 w-3.5" />
            Frequently Asked Questions
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Institutional, Employer &amp; Student Programme FAQs
          </h1>
          <p className="text-base text-slate-600">
            Clear answers on four-level placement reporting, INR pricing &amp; GST invoicing, the 9-Dimension Employability Evaluation, and our 3-Interview Assurance commitment.
          </p>
        </div>

        <div className="space-y-10">
          {FAQ_SECTIONS.map((section) => (
            <div key={section.category} className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#1E40AF]">
                {section.category}
              </h2>
              <div className="space-y-4">
                {section.items.map((item) => (
                  <div
                    key={item.q}
                    className="bg-white rounded-md border border-slate-200/90 p-6 space-y-2"
                  >
                    <h3 className="text-base font-bold text-slate-900">{item.q}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-md border border-slate-200/90 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <ShieldCheck className="h-4 w-4 text-blue-700" />
              Have a specific institutional or corporate question?
            </div>
            <p className="text-xs text-slate-600">
              Contact our Institutional Partnerships Desk ({COMPANY_IDENTITY.desks.institutionalPartnerships.email}) for 1-business-day response.
            </p>
          </div>
          <Button asChild className="bg-[#1E40AF] hover:bg-blue-900 text-white shrink-0">
            <Link href="/contact">
              Contact Operations Desk
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
