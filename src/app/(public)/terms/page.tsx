import Link from 'next/link';
import { Scale, ArrowRight } from 'lucide-react';
import { COMPANY_IDENTITY } from '@/config/company-identity';
import {
  INSTITUTION_COMMERCIAL_PLAN,
  EMPLOYER_COMMERCIAL_POLICY,
  GOVERNANCE_MOAT_MECHANICS,
} from '@/config/commercial-policy';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="space-y-3 border-b border-slate-200 pb-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-[#1E40AF] border border-blue-200">
              Platform Terms of Service
            </span>
            <span className="font-mono text-xs text-slate-500">
              Effective Date: {COMPANY_IDENTITY.governanceEffectiveDate}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Master Terms of Service &amp; Platform Governance
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Governing institutional software licensing, corporate graduate hiring drives, and student employability &amp; 3-interview assurance tracks on{' '}
            <strong className="font-semibold text-slate-900">{COMPANY_IDENTITY.brandName}</strong>.
          </p>
        </div>

        <div className="bg-white rounded-md border border-slate-200/90 p-6 sm:p-10 space-y-8 text-sm text-slate-700 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Scale className="h-5 w-5 text-blue-700" />
              1. Scope of the Institutional Network
            </h2>
            <p>
              {COMPANY_IDENTITY.operatingModelDisclosure} Platform workspaces are provisioned across three stakeholder categories: (a) Partner Higher Education Institutions (Training &amp; Placement Officers and Institutional Administrators), (b) Verified Corporate Employers, and (c) Roster-Verified Graduating Students.
            </p>
          </section>

          <section className="space-y-3 border-t border-slate-200 pt-6">
            <h2 className="text-lg font-bold text-slate-900">
              2. Student 3-Interview Assurance &amp; Merit Selection Boundaries
            </h2>
            <ul className="list-disc pl-5 space-y-1.5">
              {GOVERNANCE_MOAT_MECHANICS.assuranceBoundaryDisclosures.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="space-y-3 border-t border-slate-200 pt-6">
            <h2 className="text-lg font-bold text-slate-900">
              3. Institutional Licensing &amp; Four-Level Reporting Accuracy
            </h2>
            <p>
              Partner colleges subscribe at {INSTITUTION_COMMERCIAL_PLAN.formattedTotal} ({INSTITUTION_COMMERCIAL_PLAN.pilotWaiverNote}). Participating institutions agree to maintain accurate graduating batch rosters so that four-level placement reporting remains verifiable for accreditation reviews.
            </p>
          </section>

          <section className="space-y-3 border-t border-slate-200 pt-6">
            <h2 className="text-lg font-bold text-slate-900">
              4. Corporate Employer Hiring Agreements
            </h2>
            <p>
              {EMPLOYER_COMMERCIAL_POLICY.replacementGuaranteeDetail} Participating employers agree to record structured interview dispositions within 5 business days of each scheduled campus or pooled interview slot, with specific commercial terms governed by the executed Employer Hiring Agreement.
            </p>
          </section>

          <section className="space-y-3 border-t border-slate-200 pt-6">
            <h2 className="text-lg font-bold text-slate-900">
              5. Assessment Integrity
            </h2>
            <p>
              The 9-Dimension Employability Assessment is a timed individual evaluation. Impersonation, automated script usage, or unauthorized distribution of evaluation items results in credential withdrawal and forfeiture of interview assurance eligibility.
            </p>
          </section>

          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
            <span>Governing Law &amp; Jurisdiction: {COMPANY_IDENTITY.jurisdiction}</span>
            <Link
              href="/refund-policy"
              className="inline-flex items-center gap-1.5 font-semibold text-blue-700 hover:underline"
            >
              View Refund &amp; Assurance Policy
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
