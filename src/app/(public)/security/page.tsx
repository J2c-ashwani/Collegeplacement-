import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  Database,
  KeyRound,
  FileCheck2,
  Server,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { COMPANY_IDENTITY } from '@/config/company-identity';

export default function SecurityGovernancePage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-14">
        {/* Header */}
        <div className="space-y-4 border-b border-slate-200 pb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-[#1E40AF]">
            <ShieldCheck className="h-3.5 w-3.5" />
            Security, Data Isolation &amp; Privacy Governance
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Institutional Data Security &amp; Multi-Tenant Architecture
          </h1>
          <p className="text-base text-slate-600 max-w-3xl leading-relaxed">
            Built for Training &amp; Placement Officers, University IT Reviewers, and Corporate Information Security teams. For complete clarity during institutional due diligence, this page separates{' '}
            <strong className="font-semibold text-slate-900">
              currently implemented platform controls
            </strong>
            ,{' '}
            <strong className="font-semibold text-slate-900">
              regulatory privacy alignment
            </strong>
            , and{' '}
            <strong className="font-semibold text-slate-900">
              scheduled external security audits
            </strong>
            .
          </p>
        </div>

        {/* Part 1: Implemented Controls */}
        <section className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-bold text-slate-900">
              1. Currently Implemented Platform &amp; Database Controls
            </h2>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-50 text-emerald-900 border border-emerald-200">
              Active in Production
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-md border border-slate-200/90 p-6 space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <Database className="h-4 w-4 text-blue-700" />
                Dedicated Campus Workspace Isolation
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every graduating cohort roster, placement report, and drive pipeline is logically isolated by institution and employer tenant boundaries. A college TPO can access only students affiliated with their verified campus.
              </p>
            </div>

            <div className="bg-white rounded-md border border-slate-200/90 p-6 space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <KeyRound className="h-4 w-4 text-blue-700" />
                Encrypted Credentials &amp; Automated Account Lockout
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                User passwords are salted and hashed using industry-standard bcrypt encryption. Repeated unsuccessful sign-in attempts automatically trigger a temporary account lockout to prevent brute-force access.
              </p>
            </div>

            <div className="bg-white rounded-md border border-slate-200/90 p-6 space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <Lock className="h-4 w-4 text-blue-700" />
                Role-Based Access Control (RBAC)
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Strict permission boundaries separate Institution Administrators (TPOs), Corporate Recruiters, Graduating Students, and Platform Operations across all application views and API endpoints.
              </p>
            </div>

            <div className="bg-white rounded-md border border-slate-200/90 p-6 space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <FileCheck2 className="h-4 w-4 text-blue-700" />
                Complete Operational Audit Trail
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Key institutional actions—including MoU updates, assessment completions, shortlist releases, and public credential verifications—are logged with timestamp and actor attribution.
              </p>
            </div>
          </div>
        </section>

        {/* Part 2: Regulatory & Privacy Principles Alignment */}
        <section className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-bold text-slate-900">
              2. Alignment with India&apos;s DPDP Act 2023 &amp; Student Privacy Principles
            </h2>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-50 text-[#1E40AF] border border-blue-200">
              Policy Enforced
            </span>
          </div>

          <div className="bg-white rounded-md border border-slate-200/90 p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Student-Controlled Visibility
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Students control whether their assessment profile is public, visible only to verified employers, or private. When set to private, institutional and personal details are withheld from public verification views.
                </p>
              </div>
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Strict Purpose Limitation
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Batch rosters uploaded by colleges are used solely for campus placement administration, accreditation reporting, and verified corporate hiring drives—never sold to third-party marketing lists.
                </p>
              </div>
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Designated Grievance Officer
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Students and institutions can reach our Grievance Officer directly at{' '}
                  <span className="font-mono text-slate-800">
                    {COMPANY_IDENTITY.desks.privacyAndGrievance.email}
                  </span>{' '}
                  with a 24-hour acknowledgment commitment.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Part 3: Future Certification Roadmap */}
        <section className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-bold text-slate-900">
              3. External Security Assurance &amp; Certification Roadmap
            </h2>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-amber-50 text-amber-900 border border-amber-200">
              Scheduled Milestones
            </span>
          </div>

          <div className="bg-white rounded-md border border-slate-200/90 p-6 sm:p-8 space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              PlacementConnect does not claim unobtained third-party certifications (such as SOC 2 Type II or ISO/IEC 27001) during our founding institutional rollout. Our external security audit schedule is detailed below:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-md border border-slate-200 bg-slate-50/70 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                  <span>Independent Third-Party Penetration Testing (VAPT)</span>
                  <span className="font-mono text-[#1E40AF]">Q4 2026</span>
                </div>
                <p className="text-xs text-slate-600">
                  External vulnerability assessment covering public web routes, role access boundaries, and verification APIs.
                </p>
              </div>
              <div className="p-4 rounded-md border border-slate-200 bg-slate-50/70 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                  <span>ISO/IEC 27001 Information Security Audit</span>
                  <span className="font-mono text-[#1E40AF]">H1 2027</span>
                </div>
                <p className="text-xs text-slate-600">
                  Formal Information Security Management System audit following completion of our founding institutional cohort.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="bg-white rounded-md border border-slate-200/90 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Server className="h-4 w-4 text-blue-700" />
              Institutional IT &amp; Corporate InfoSec Reviews
            </div>
            <p className="text-xs text-slate-600">
              Need architecture documentation or data-handling disclosures prior to signing a college MoU?
            </p>
          </div>
          <Button asChild className="bg-[#1E40AF] hover:bg-blue-900 text-white shrink-0">
            <Link href="/contact">
              Contact Security &amp; Governance Desk
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
