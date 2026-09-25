import Link from 'next/link';
import {
  Building2,
  Briefcase,
  GraduationCap,
  CheckCircle2,
  ArrowRight,
  ReceiptText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const COLLEGE_INCLUDED_SUMMARY = [
  'Dedicated TPO placement workspace & verified Campus Code (e.g., APX123) for student onboarding',
  'Student readiness evaluation across 9 competency areas before corporate interview scheduling',
  'Employer drive coordination, interview attendance tracking (0/3 to 3/3), and MoU record keeping',
  'Designed to support institutional placement documentation and internal NAAC/NIRF reporting workflows (CSV/PDF exports)',
] as const;

const INSTITUTION_PLAN_COMPARISON = [
  {
    feature: 'Standard Institutional Fee (Before Credit)',
    annual: '₹15,000 / yr (+ ₹2,700 GST = ₹17,700)',
    fiveYear: '₹60,000 / 5 yrs (+ ₹10,800 GST = ₹70,800)',
  },
  {
    feature: 'Net Fee After ₹15,000 Year-1 Waiver / Credit (100+ Students in Yr 1)',
    annual: '₹0 institutional fee in Year 1 (₹15,000 waived)',
    fiveYear: '₹45,000 after credit (+ ₹8,100 GST = ₹53,100)',
  },
  {
    feature: 'Effective Annual Rate (excl. GST)',
    annual: '₹15,000 / academic year (₹0 in Year 1 with waiver)',
    fiveYear: '₹12,000 / yr standard • ₹9,000 / yr after Year-1 credit',
  },
  {
    feature: 'Academic Cohorts & Roster Capacity',
    annual: '1 Graduating Batch (12 Months • Up to 1,500 students)',
    fiveYear: '5 Continuous Graduating Batches (60 Months • Unlimited roster)',
  },
  {
    feature: 'Institutional Documentation & Reporting Support',
    annual: '✓ Single-batch CSV/PDF exports supporting internal NAAC/NIRF reporting workflows',
    fiveYear: '✓ 5-year longitudinal archive supporting internal NAAC/NIRF reporting workflows',
  },
  {
    feature: 'Recommended Buying Motion',
    annual: '✓ Recommended for new partner institutions (Year-1 onboarding)',
    fiveYear: 'Optional multi-cohort agreement for long-term partnerships',
  },
] as const;

const STUDENT_TRACK_COMPARISON = [
  {
    feature: 'Price (incl. 18% GST)',
    standard: '₹1,180 (₹1,000 + ₹180 GST)',
    extended: '₹2,950 (₹2,500 + ₹450 GST)',
  },
  {
    feature: '9-Area Job-Readiness Assessment',
    standard: '1 Attempt',
    extended: '2 Attempts (Includes Re-Assessment)',
  },
  {
    feature: 'Guided Preparation Modules',
    standard: '—',
    extended: '✓ Guided preparation before 2nd attempt',
  },
  {
    feature: 'Verified Profile & Shareable Credential',
    standard: '✓ Included',
    extended: '✓ Included',
  },
  {
    feature: '3 Corporate Interview Opportunities',
    standard: '✓ Within 12 months of assessment completion',
    extended: '✓ Within 12 months of assessment completion',
  },
  {
    feature: 'Priority Pooled-Drive Consideration',
    standard: '—',
    extended: '✓ Included',
  },
  {
    feature: '100% Base-Fee Refund Protection',
    standard: '✓ ₹1,000 Base Fee Protected',
    extended: '✓ ₹2,500 Base Fee Protected',
  },
] as const;

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 text-slate-900">
      <div className="max-w-6xl mx-auto space-y-14">
        {/* 1. Hero: Simple, Transparent Pricing */}
        <div className="space-y-4 border-b border-slate-200 pb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-[#1E40AF]">
            Published Institutional &amp; Student Programme Pricing
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900">
            Simple, Transparent Pricing
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
            Institutional pricing and student programme fees are published below. Corporate hiring partnerships are structured separately based on employer requirements and partnership scope.
          </p>
        </div>

        {/* 2. Published Pricing Cards: Colleges (1-Yr Default & 5-Yr Optional) & Students (Standard & Extended Readiness) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Card 1: For Colleges & Universities */}
          <div className="bg-white rounded-md border border-slate-200/90 p-7 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#1E40AF]">
                  For Colleges &amp; Universities
                </span>
                <Building2 className="h-5 w-5 text-[#1E40AF]" />
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-slate-900">
                  Institutional Partnership Plans
                </h2>
                <p className="text-xs text-slate-600">
                  Start with our <strong>1-Year Annual License</strong> (recommended for new institutions) or choose an optional 5-year multi-cohort agreement for long-term partnerships.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* 1-Year Annual Plan — Primary / Recommended for New Institutions */}
                <div className="p-4 rounded-md border-2 border-[#1E40AF] bg-blue-50/25 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <span className="text-xs font-bold text-slate-900">1-Year Annual</span>
                    <span className="text-[10px] font-bold text-[#1E40AF] bg-blue-100/90 border border-blue-300 px-2 py-0.5 rounded">
                      Recommended for New Institutions
                    </span>
                  </div>
                  <div className="font-mono text-2xl font-bold text-[#1E40AF]">
                    ₹15,000
                    <span className="text-xs font-normal text-slate-600 block">
                      + ₹2,700 GST (₹17,700 / yr)
                    </span>
                  </div>
                  <p className="text-[11px] font-semibold text-emerald-900 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded">
                    ₹0 institutional fee in Year 1 when 100+ students enroll
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Full TPO workspace, 4-stage placement reporting, and employer drive coordination for 1 academic year.
                  </p>
                </div>

                {/* 5-Year Multi-Cohort Plan — Optional Multi-Cohort Agreement */}
                <div className="p-4 rounded-md border border-slate-200 bg-slate-50/80 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <span className="text-xs font-bold text-slate-900">5-Year Multi-Cohort</span>
                    <span className="text-[10px] font-semibold text-slate-700 bg-white border border-slate-300 px-2 py-0.5 rounded">
                      Optional • Save 20%
                    </span>
                  </div>
                  <div className="font-mono text-2xl font-bold text-slate-900">
                    ₹60,000
                    <span className="text-xs font-normal text-slate-500 block">
                      before credit (+ ₹10,800 GST = ₹70,800)
                    </span>
                  </div>
                  <p className="text-[11px] font-semibold text-slate-800 bg-white border border-slate-200 px-2 py-1 rounded">
                    ₹45,000 after ₹15,000 Year-1 credit (+ ₹8,100 GST = ₹53,100)
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    For long-term institutional partnerships across 5 graduating batches (effective ₹12,000/yr before credit, or ₹9,000/yr after credit).
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-md bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 leading-relaxed">
                <strong className="font-semibold text-emerald-900">Year-1 Waiver / Credit Rule (₹15,000):</strong>{' '}
                When 100+ eligible final-year students enroll in Year 1 under our Institutional MoU, the <strong>₹15,000 Year-1 institutional fee is waived/credited</strong> — the <strong>1-Year Annual License becomes ₹0</strong>, and the <strong>5-Year Agreement reduces from ₹60,000 before credit to ₹45,000 after credit</strong> (+ ₹8,100 GST = ₹53,100).
              </div>

              <ul className="space-y-2 text-xs text-slate-600">
                {COLLEGE_INCLUDED_SUMMARY.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-[#1E40AF] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
              <Button asChild className="flex-1 h-11 bg-[#1E40AF] hover:bg-blue-900 text-white font-semibold">
                <Link href="/contact">
                  Request Institutional MoU
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-11 border-slate-300 font-semibold bg-white">
                <Link href="/for-colleges">Explore College Platform</Link>
              </Button>
            </div>
          </div>

          {/* Card 2: For Graduating Students */}
          <div className="bg-white rounded-md border border-slate-200/90 p-7 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#1E40AF]">
                  For Graduating Students
                </span>
                <GraduationCap className="h-5 w-5 text-[#1E40AF]" />
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-slate-900">
                  Student Career Readiness &amp; 3-Interview Programme
                </h2>
                <p className="text-xs text-slate-600">
                  Available to final-year students enrolling through a participating partner college code.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* Standard Track */}
                <div className="p-4 rounded-md border border-slate-200 bg-slate-50/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Standard Track</span>
                    <span className="text-[11px] font-semibold text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                      1 Assessment
                    </span>
                  </div>
                  <div className="font-mono text-2xl font-bold text-slate-900">
                    ₹1,000
                    <span className="text-xs font-normal text-slate-500 block">
                      + ₹180 GST (₹1,180 total)
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    9-Area Readiness Assessment + verified profile + 3 corporate interview opportunities + 100% base-fee refund protection.
                  </p>
                </div>

                {/* Extended Readiness Track */}
                <div className="p-4 rounded-md border-2 border-[#1E40AF] bg-blue-50/25 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <span className="text-xs font-bold text-slate-900">Extended Readiness Track</span>
                    <span className="text-[10px] font-bold text-[#1E40AF] bg-blue-100/90 border border-blue-300 px-2 py-0.5 rounded">
                      + Prep &amp; Re-Test
                    </span>
                  </div>
                  <div className="font-mono text-2xl font-bold text-[#1E40AF]">
                    ₹2,500
                    <span className="text-xs font-normal text-slate-600 block">
                      + ₹450 GST (₹2,950 total)
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Everything in Standard Track + guided preparation modules + 2nd assessment attempt + priority pooled-drive consideration.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-md bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
                <strong className="font-semibold text-slate-900">100% Base-Fee Protection:</strong>{' '}
                If 3 verified corporate interview opportunities are not facilitated within 12 months of assessment completion for an eligible student, PlacementConnect refunds 100% of the base programme fee (₹1,000 or ₹2,500).
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
              <Button asChild className="flex-1 h-11 bg-[#1E40AF] hover:bg-blue-900 text-white font-semibold">
                <Link href="/for-students">
                  View Student Programme
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-11 border-slate-300 font-semibold bg-white">
                <Link href="/placement-assurance">Assurance Terms</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* 3A. Institutional Plan Comparison Table (1-Year Default vs 5-Year Multi-Cohort) */}
        <section className="bg-white rounded-md border border-slate-200/90 p-6 sm:p-8 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#1E40AF]">
                Institutional Partnership Options
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                1-Year Annual License (Recommended Default) vs 5-Year Multi-Cohort Agreement
              </h2>
            </div>
            <span className="text-xs text-slate-500">
              Designed to support institutional placement documentation and internal NAAC/NIRF reporting workflows
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase">
                  <th className="py-3 pr-4 font-semibold">Institutional Feature</th>
                  <th className="py-3 px-4 font-semibold text-[#1E40AF]">
                    1-Year Annual — Recommended (₹15,000 + GST)
                  </th>
                  <th className="py-3 pl-4 font-semibold text-slate-900">
                    5-Year Multi-Cohort — Optional (₹60,000 before credit)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80">
                {INSTITUTION_PLAN_COMPARISON.map((row) => (
                  <tr key={row.feature}>
                    <td className="py-3.5 pr-4 font-semibold text-slate-900">{row.feature}</td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">
                      {row.annual}
                    </td>
                    <td className="py-3.5 pl-4 font-mono text-slate-700">{row.fiveYear}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 3B. Student Track Comparison Table (Standard Track vs Extended Readiness Track) */}
        <section className="bg-white rounded-md border border-slate-200/90 p-6 sm:p-8 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#1E40AF]">
                Student Track Comparison
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                Standard Track vs Extended Readiness Track
              </h2>
            </div>
            <span className="text-xs text-slate-500">
              Both tracks include 3 corporate interview opportunities &amp; base-fee refund protection
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase">
                  <th className="py-3 pr-4 font-semibold">Included Feature</th>
                  <th className="py-3 px-4 font-semibold text-slate-900">
                    Standard Track (₹1,180 incl. GST)
                  </th>
                  <th className="py-3 pl-4 font-semibold text-[#1E40AF]">
                    Extended Readiness Track (₹2,950 incl. GST)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80">
                {STUDENT_TRACK_COMPARISON.map((row) => (
                  <tr key={row.feature}>
                    <td className="py-3.5 pr-4 font-semibold text-slate-900">{row.feature}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">{row.standard}</td>
                    <td className="py-3.5 pl-4 font-mono font-semibold text-slate-900">
                      {row.extended}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. Corporate Hiring Partnerships (No Public Employer Pricing) */}
        <section className="bg-white rounded-md border border-slate-200/90 p-7 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800">
                <Briefcase className="h-4 w-4 text-emerald-700" />
                For Corporate Employers &amp; Talent Acquisition Teams
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Corporate Hiring Partnerships
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
                Access institution-verified graduate cohorts, pre-assessed candidate shortlists across 9 core competency areas, and coordinated single-campus or multi-campus hiring workflows.
              </p>
              <p className="text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded px-3.5 py-2.5 inline-block">
                Commercial terms are discussed during employer onboarding and depend on hiring requirements and partnership scope.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
              <Button asChild className="h-11 bg-[#1E40AF] hover:bg-blue-900 text-white font-semibold">
                <Link href="/contact">
                  Discuss Employer Hiring Requirements
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-11 border-slate-300 font-semibold bg-white">
                <Link href="/for-employers">Explore Employer Hiring Workflow</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* 5. Billing & Tax Information */}
        <section className="rounded-md border border-slate-200 bg-slate-100/70 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-600">
          <div className="flex items-start gap-3 max-w-3xl">
            <ReceiptText className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
            <div className="space-y-1 leading-relaxed">
              <span className="font-bold text-slate-900 block">
                Billing &amp; Statutory Tax Information
              </span>
              Prices shown for paid institutional and student programmes are exclusive of statutory 18% GST unless the GST-inclusive total is explicitly shown. GST-compliant tax invoices (HSN/SAC 998314 / 998519) are issued for applicable institutional and student transactions.
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 shrink-0 font-semibold text-[#1E40AF]">
            <Link href="/refund-policy" className="hover:underline">
              Refund &amp; Assurance Policy →
            </Link>
            <Link href="/faqs" className="hover:underline">
              Pricing FAQs →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
