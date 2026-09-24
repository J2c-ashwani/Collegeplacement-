import Link from 'next/link';
import {
  QrCode,
  CheckCircle2,
  ArrowRight,
  Scale,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  SAFE_TERMINOLOGY,
  FOUR_DENOMINATOR_MODEL,
} from '@/config/brand-system';
import {
  INSTITUTION_COMMERCIAL_PLAN,
  GOVERNANCE_MOAT_MECHANICS,
} from '@/config/commercial-policy';

export default function ForCollegesPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Hero: Placement Operations + Evidence + Outcomes */}
        <div className="space-y-5 border-b border-slate-200 pb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-[#1E40AF]">
            For Training &amp; Placement Officers, Principals &amp; Deans
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 max-w-4xl leading-tight">
            {SAFE_TERMINOLOGY.institutionalGovernanceName}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
            Replace fragmented spreadsheets and WhatsApp placement coordination with a dedicated institutional placement platform. Track graduating batches across four transparent reporting denominators, onboard students via a verified campus QR code, and connect your cohort to confirmed corporate interview pipelines.
          </p>
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <Button asChild className="h-11 px-6 bg-[#1E40AF] hover:bg-blue-900 text-white font-semibold">
              <Link href="/contact">
                Request Institutional MoU &amp; Walkthrough
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-11 px-5 border-slate-300 font-semibold bg-white">
              <Link href="/register">Create College TPO Account</Link>
            </Button>
          </div>
        </div>

        {/* Dominant Visual Idea: Four-Level Placement Reporting */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div className="space-y-1">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#1E40AF]">
                Accreditation &amp; Governance Evidence
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Four-Level Cohort Placement Reporting
              </h2>
              <p className="text-sm text-slate-600">
                Present unambiguous placement outcomes for NAAC, NIRF, AICTE, and Governing Body reviews.
              </p>
            </div>
            <span className="text-xs font-medium px-3 py-1 rounded bg-white border border-slate-200 text-slate-600">
              Illustrative Campus Cohort (N = 600)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FOUR_DENOMINATOR_MODEL.map((d) => (
              <div
                key={d.id}
                className="bg-white rounded-md border border-slate-200/90 p-6 space-y-2.5"
              >
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-medium">{d.code}</span>
                  <span className="font-mono">{d.sampleCount} students</span>
                </div>
                <div className="text-sm font-bold text-slate-900">{d.label}</div>
                <div className="text-3xl font-mono font-bold text-[#1E40AF] tabular-nums">
                  {d.samplePlacementRate}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{d.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Operational & Commercial Clarity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-md border border-slate-200/90 p-7 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
              <Scale className="h-4 w-4" />
              {GOVERNANCE_MOAT_MECHANICS.liquidityGuardrailLabel}
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              How We Protect Your Students&apos; Interview Commitments
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {GOVERNANCE_MOAT_MECHANICS.liquidityGuardrailExplanation}
            </p>
            <div className="p-4 rounded-md bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
              <div className="font-bold text-slate-900">
                100% Base Fee Refund Protection for Enrolled Students
              </div>
              <p className="leading-relaxed">
                If any eligible student in your cohort does not receive 3 verified corporate interview opportunities within 12 months of completing their evaluation, PlacementConnect refunds 100% of their base programme fee (₹1,000 or ₹2,500).
              </p>
            </div>
          </div>

          <div className="bg-white rounded-md border border-slate-200/90 p-7 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#1E40AF]">
              <QrCode className="h-4 w-4" />
              Annual Institutional License
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              {INSTITUTION_COMMERCIAL_PLAN.formattedBase}/year + 18% GST ({INSTITUTION_COMMERCIAL_PLAN.formattedTotal})
            </h3>
            <p className="text-xs text-emerald-900 font-medium bg-emerald-50/80 border border-emerald-200 p-3.5 rounded-md">
              {INSTITUTION_COMMERCIAL_PLAN.pilotWaiverNote}
            </p>
            <ul className="space-y-2.5 text-xs text-slate-600">
              {INSTITUTION_COMMERCIAL_PLAN.deliverables.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-[#1E40AF] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
