import Link from 'next/link';
import {
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  UserCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  GOVERNANCE_MOAT_MECHANICS,
} from '@/config/commercial-policy';

export default function PlacementAssurancePage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 text-slate-900">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* 1. Hero: How the 3-Interview Assurance Works */}
        <div className="space-y-4 border-b border-slate-200 pb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-[#1E40AF]">
            3-Interview Assurance &amp; Confirmed Employer Capacity
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            How the 3-Interview Assurance Works
          </h1>
          <p className="text-base sm:text-lg text-slate-800 font-medium leading-relaxed max-w-3xl">
            A contractually defined commitment to{' '}
            <strong className="font-bold text-[#1E40AF]">
              3 Verified Corporate Interview Opportunities within 12 months of assessment completion
            </strong>{' '}
            for eligible students—not a guaranteed job offer.
          </p>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
            PlacementConnect makes a defined interview commitment rather than promising employment outcomes. Every student enrollment is supported by confirmed employer interview capacity in our hiring pipeline and a 100% base-fee refund guarantee, while final selection decisions always rest on candidate merit and employer evaluation.
          </p>
        </div>

        {/* 2. Three-Step Mechanism */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-md border border-slate-200/90 p-6 space-y-2.5">
            <div className="font-mono text-xs font-bold text-[#1E40AF]">
              01 / Readiness
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Complete the 9-Area Job-Readiness Assessment
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Enrolled students complete the 36-item timed evaluation across 9 core competency areas to establish their verified readiness profile and shareable digital scorecard.
            </p>
          </div>

          <div className="bg-white rounded-md border border-slate-200/90 p-6 space-y-2.5">
            <div className="font-mono text-xs font-bold text-[#1E40AF]">
              02 / Employer Capacity
            </div>
            <h2 className="text-base font-bold text-slate-900">
              {GOVERNANCE_MOAT_MECHANICS.liquidityGuardrailLabel}
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              We expand student intake only when sufficient confirmed employer interview capacity is available in our active hiring pipeline (maintaining at least a 1.20× capacity reserve).
            </p>
          </div>

          <div className="bg-white rounded-md border-2 border-emerald-600/80 p-6 space-y-2.5">
            <div className="font-mono text-xs font-bold text-emerald-800">
              03 / Assurance
            </div>
            <h2 className="text-base font-bold text-slate-900">
              100% Base Fee Refund Protection
            </h2>
            <p className="text-xs font-semibold text-emerald-900 bg-emerald-50 border border-emerald-200 rounded px-2.5 py-1.5">
              ₹1,000 or ₹2,500 base fee refunded; statutory 18% GST excluded.
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              If 3 verified corporate interview opportunities are not facilitated within 12 months of assessment completion for an eligible student, 100% of the base programme fee is refunded.
            </p>
          </div>
        </div>

        {/* 3. Canonical Definition + Short Eligibility Summary Side-by-Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* What Counts as a Verified Interview */}
          <div className="bg-white rounded-md border border-slate-200/90 p-6 sm:p-7 space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1E40AF]">
              <Briefcase className="h-4 w-4" />
              Canonical Definition
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              What Counts as a Verified Corporate Interview Opportunity?
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-blue-50/60 border border-blue-200 rounded p-4 font-medium">
              A confirmed first-round corporate interview slot with a registered employer for a fresher role that matches the student&apos;s degree stream and academic eligibility criteria.
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every scheduled and completed interview updates the student&apos;s tracked counter from <strong>0/3 through 3/3</strong> in both the student dashboard and the college TPO workspace.
            </p>
          </div>

          {/* Who Is Eligible (Short Summary) */}
          <div className="bg-white rounded-md border border-slate-200/90 p-6 sm:p-7 space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800">
              <UserCheck className="h-4 w-4 text-emerald-700" />
              Who Qualifies?
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Who Is Eligible for the 3-Interview Assurance?
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              The 3-Interview Assurance and 100% base-fee refund protection apply to every enrolled student who meets three straightforward requirements:
            </p>
            <ul className="space-y-2 text-xs text-slate-700 pt-1">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#1E40AF] shrink-0 mt-0.5" />
                <span>
                  <strong>1. Assessment Completion:</strong> Complete the 9-Area Job-Readiness Assessment (the 12-month assurance window begins upon assessment completion).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#1E40AF] shrink-0 mt-0.5" />
                <span>
                  <strong>2. Verified College Enrollment:</strong> Maintain active, TPO-verified enrollment and accurate academic records (CGPA, branch, backlog status).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#1E40AF] shrink-0 mt-0.5" />
                <span>
                  <strong>3. Interview Attendance:</strong> Attend scheduled corporate interviews matching your eligibility without unexcused no-shows.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* 4. Complete Programme Terms & Merit Boundaries */}
        <div className="bg-white rounded-md border border-slate-200/90 p-7 sm:p-8 space-y-5">
          <div className="space-y-1 border-b border-slate-200 pb-4">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <ShieldCheck className="h-4 w-4 text-[#1E40AF]" />
              Contractual Assurance Terms
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Programme Eligibility, Track Scope &amp; Refund Governance
            </h2>
          </div>

          <ul className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
            {GOVERNANCE_MOAT_MECHANICS.assuranceBoundaryDisclosures.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild className="bg-[#1E40AF] hover:bg-blue-900 text-white font-semibold">
                <Link href="/for-students">
                  Explore Student Programme (₹1,180 / ₹2,950)
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-slate-300 font-semibold bg-white">
                <Link href="/for-colleges">For Colleges &amp; TPOs</Link>
              </Button>
            </div>
            <Link
              href="/refund-policy"
              className="text-xs font-semibold text-[#1E40AF] hover:underline"
            >
              Read Full Refund &amp; Assurance Policy &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
