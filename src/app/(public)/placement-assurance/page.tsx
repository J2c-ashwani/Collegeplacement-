import Link from 'next/link';
import {
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  GOVERNANCE_MOAT_MECHANICS,
} from '@/config/commercial-policy';
import { SAFE_TERMINOLOGY } from '@/config/brand-system';

export default function PlacementAssurancePage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-14">
        <div className="space-y-4 border-b border-slate-200 pb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-[#1E40AF]">
            3-Interview Assurance &amp; Confirmed Employer Capacity
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            How PlacementConnect Guarantees 3 Verified Interviews Without Making False Job Promises
          </h1>
          <p className="text-base text-slate-600 leading-relaxed max-w-3xl">
            Unlike training agencies that promise unrealistic &ldquo;100% guaranteed jobs,&rdquo; PlacementConnect provides a transparent, contractually backed{' '}
            <strong className="font-semibold text-slate-900">
              {GOVERNANCE_MOAT_MECHANICS.interviewQuotaLabel}
            </strong>{' '}
            supported by{' '}
            <strong className="font-semibold text-slate-900">
              {GOVERNANCE_MOAT_MECHANICS.liquidityGuardrailLabel}
            </strong>
            .
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-md border border-slate-200/90 p-6 space-y-2.5">
            <div className="font-mono text-xs font-bold text-[#1E40AF]">
              01 / Standardized Readiness
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Complete the {SAFE_TERMINOLOGY.assessmentShortName}
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Enrolled students complete the 36-item timed evaluation across 9 core competencies to establish their verified shortlist profile.
            </p>
          </div>

          <div className="bg-white rounded-md border border-slate-200/90 p-6 space-y-2.5">
            <div className="font-mono text-xs font-bold text-[#1E40AF]">
              02 / Confirmed Interview Supply
            </div>
            <h2 className="text-base font-bold text-slate-900">
              {GOVERNANCE_MOAT_MECHANICS.liquidityGuardrailLabel}
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              {GOVERNANCE_MOAT_MECHANICS.liquidityGuardrailExplanation}
            </p>
          </div>

          <div className="bg-white rounded-md border border-slate-200/90 p-6 space-y-2.5">
            <div className="font-mono text-xs font-bold text-emerald-800">
              03 / 100% Base Fee Refund
            </div>
            <h2 className="text-base font-bold text-slate-900">
              12-Month Contractual Refund Guarantee
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              If 3 verified corporate interviews are not facilitated within 12 months for an eligible candidate, 100% of the base fee (₹1,000 or ₹2,500) is refunded.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-md border border-slate-200/90 p-7 sm:p-8 space-y-4">
          <h3 className="text-lg font-bold text-slate-900">
            Programme Eligibility &amp; Merit Boundaries
          </h3>
          <ul className="space-y-2.5 text-xs text-slate-600">
            {GOVERNANCE_MOAT_MECHANICS.assuranceBoundaryDisclosures.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <Button asChild className="bg-[#1E40AF] hover:bg-blue-900 text-white">
              <Link href="/for-students">
                Enter College Code to Enroll
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
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
