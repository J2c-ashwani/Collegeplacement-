import Link from 'next/link';
import { Lock, UserCheck, Database, Mail, ArrowRight } from 'lucide-react';
import { COMPANY_IDENTITY } from '@/config/company-identity';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="space-y-3 border-b border-slate-200 pb-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-[#1E40AF] border border-blue-200">
              Privacy &amp; Data Protection Policy (DPDP Act 2023)
            </span>
            <span className="font-mono text-xs text-slate-500">
              Effective Date: {COMPANY_IDENTITY.governanceEffectiveDate}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Institutional &amp; Candidate Privacy Policy
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Aligned with the principles of India&apos;s Digital Personal Data Protection (DPDP) Act, 2023. This policy explains how{' '}
            <strong className="font-semibold text-slate-900">{COMPANY_IDENTITY.brandName}</strong> collects, isolates, processes, and protects institutional cohort rosters, 9-dimension evaluation scorecards, and candidate profiles.
          </p>
        </div>

        <div className="bg-white rounded-md border border-slate-200/90 p-6 sm:p-10 space-y-8 text-sm text-slate-700 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-700" />
              1. Information Collected &amp; Dedicated Campus Isolation
            </h2>
            <p>
              PlacementConnect operates a logically isolated multi-tenant architecture separating each college and corporate workspace:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Institutional Cohort Data (Provided by Colleges):</strong> Student name, enrollment number, institutional email, academic branch, and graduation year used strictly to verify campus eligibility and generate four-level placement reports.
              </li>
              <li>
                <strong>Candidate Evaluation &amp; Interview Records:</strong> Timed assessment responses and 0–100 competency scores across the 9-Dimension Employability Assessment Framework, along with verified interview attendance records.
              </li>
              <li>
                <strong>Corporate Recruiter Information:</strong> Recruiter contact details, company verification records, role requirements, and structured interview outcomes.
              </li>
            </ul>
          </section>

          <section className="space-y-3 border-t border-slate-200 pt-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-emerald-700" />
              2. Student-Controlled Profile Visibility
            </h2>
            <p>
              Candidate profiles are never sold to third-party data brokers or external marketing agencies. Every student controls how their evaluation profile is shared through three clear visibility settings:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
              <div className="p-4 rounded-md border border-slate-200 bg-slate-50">
                <div className="text-xs font-bold text-slate-900">1. Public Credential</div>
                <p className="text-xs text-slate-600 mt-1">
                  Allows recruiters and verifiers to confirm scorecard authenticity via the candidate&apos;s unique Credential ID.
                </p>
              </div>
              <div className="p-4 rounded-md border border-blue-200 bg-blue-50/50">
                <div className="text-xs font-bold text-blue-950">2. Employer-Authorized</div>
                <p className="text-xs text-blue-900 mt-1">
                  Shares verified academic and 9-dimension evaluation scores only with verified employers conducting active hiring drives.
                </p>
              </div>
              <div className="p-4 rounded-md border border-amber-200 bg-amber-50/50">
                <div className="text-xs font-bold text-amber-950">3. Private / Restricted</div>
                <p className="text-xs text-amber-900 mt-1">
                  Withholds institutional and personal details from public lookup while preserving home college placement reporting.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3 border-t border-slate-200 pt-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Lock className="h-5 w-5 text-blue-700" />
              3. Data Retention, Correction &amp; Erasure
            </h2>
            <p>
              Issued candidate credentials remain active for 12 months from assessment completion unless renewed or withdrawn. Students and institutional administrators may request profile updates, visibility changes, or account deletion at any time through their dashboard settings or by contacting our Grievance Officer.
            </p>
          </section>

          <section className="space-y-3 border-t border-slate-200 pt-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-700" />
              4. Designated Data Protection &amp; Grievance Officer
            </h2>
            <div className="p-4 rounded-md bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-700">
                  {COMPANY_IDENTITY.desks.privacyAndGrievance.officerTitle}
                </div>
                <a
                  href={`mailto:${COMPANY_IDENTITY.desks.privacyAndGrievance.email}`}
                  className="font-mono text-sm font-bold text-blue-700 hover:underline"
                >
                  {COMPANY_IDENTITY.desks.privacyAndGrievance.email}
                </a>
                <div className="text-xs text-slate-500">
                  {COMPANY_IDENTITY.desks.privacyAndGrievance.sla} • {COMPANY_IDENTITY.jurisdiction}
                </div>
              </div>
              <Link
                href="/security"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-800 hover:text-blue-950 shrink-0"
              >
                View Security Architecture
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
