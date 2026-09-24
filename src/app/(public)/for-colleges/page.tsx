import React from 'react';
import Link from 'next/link';
import {
  Building2,
  CheckCircle2,
  ArrowRight,
  FileSpreadsheet,
  QrCode,
  ShieldCheck,
  Users,
  Calendar,
  Briefcase,
  ClipboardCheck,
  FileText,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FOUR_DENOMINATOR_MODEL } from '@/config/brand-system';
import {
  INSTITUTION_COMMERCIAL_PLAN,
  STUDENT_PROGRAMME_PLANS,
  EMPLOYER_COMMERCIAL_POLICY,
  GOVERNANCE_MOAT_MECHANICS,
} from '@/config/commercial-policy';
import { ProductShowcaseInstrument } from '@/components/marketing/product-showcase';

export default function ForCollegesPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* 1. HERO: Plain-English TPO Value Proposition */}
      <section className="bg-white border-b border-slate-200/90 py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-[#1E40AF]">
            <Building2 className="h-3.5 w-3.5" />
            For Training &amp; Placement Officers (TPOs), Principals &amp; Institutional Leadership
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight max-w-4xl">
            Institutional Placement &amp; Corporate Hiring Platform
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
            Manage your college placement process, prepare students for hiring, connect eligible students with verified corporate interview opportunities, and keep placement records organized in one platform—without juggling dozens of spreadsheets and WhatsApp groups.
          </p>
          <div className="flex flex-wrap gap-3.5 pt-2">
            <Button asChild className="bg-[#1E40AF] hover:bg-blue-900 text-white font-semibold h-11 px-6">
              <Link href="/contact">
                Request Institutional Walkthrough
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-11 px-5 border-slate-300 font-semibold bg-white">
              <a href="#how-it-works">See How It Works</a>
            </Button>
            <Button asChild variant="outline" className="h-11 px-5 border-slate-300 font-semibold bg-white">
              <Link href="/register/APX123">
                <QrCode className="mr-2 h-4 w-4 text-[#1E40AF]" />
                Preview Student Campus Onboarding (APX123)
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto py-14 sm:py-16 px-4 sm:px-6 lg:px-8 space-y-16">
        {/* 2. WHAT YOUR COLLEGE GETS: Feature -> TPO Problem -> Benefit */}
        <section className="space-y-6">
          <div className="space-y-2 max-w-3xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#1E40AF]">
              What Your College Gets
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              One Placement Workspace for Your Entire TPO Team
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Whether you manage 300 or 1,500 graduating students across multiple departments, PlacementConnect gives your placement cell one organized system for daily operations and corporate drives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: QrCode,
                title: 'Verified Student Onboarding',
                problem: 'Replaces manual Google Forms & WhatsApp lists',
                benefit:
                  'Students register using your college’s official Campus Code (e.g., APX123) with roll-number and branch verification.',
              },
              {
                icon: Briefcase,
                title: 'Employer & Drive Coordination',
                problem: 'Replaces scattered company email threads',
                benefit:
                  'Keep visiting companies, eligibility cutoffs, interview slot schedules, and shortlisted candidates in one place.',
              },
              {
                icon: ClipboardCheck,
                title: 'Student Readiness Assessment',
                problem: 'Identifies skill gaps before companies visit',
                benefit:
                  'Students are evaluated across nine employability areas before they enter the verified corporate interview pool.',
              },
              {
                icon: Users,
                title: 'Interview Opportunity Tracking',
                problem: 'Eliminates uncertainty over student opportunities',
                benefit:
                  'Track every enrolled student’s corporate interview invitations and attendance from 0/3 to 3/3 completion.',
              },
              {
                icon: FileSpreadsheet,
                title: 'Management & Accreditation Reports',
                problem: 'Saves weeks of manual spreadsheet compilation',
                benefit:
                  'Download clean CSV and PDF placement reports ready for your Principal, governing body, and NAAC / NIRF documentation.',
              },
              {
                icon: FileText,
                title: 'MoU & Activity Records',
                problem: 'Prevents lost partnership paperwork',
                benefit:
                  'Maintain active corporate MoUs, validity reminders, and career workshop records in a permanent departmental archive.',
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="bg-white rounded-lg border border-slate-200/90 p-6 space-y-3 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="h-9 w-9 rounded-md bg-blue-50 border border-blue-200 text-[#1E40AF] flex items-center justify-center">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded">
                      {item.problem}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.benefit}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. WHAT YOUR STUDENTS RECEIVE: Prominent 3-Interview Assurance Block */}
        <section className="bg-white rounded-lg border border-blue-200 shadow-xs p-7 sm:p-10 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-900">
                <ShieldCheck className="h-4 w-4 text-emerald-700" />
                What Your Students Receive After Joining
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                3 Verified Corporate Interview Opportunities — Backed by 100% Base Fee Refund Protection
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Eligible final-year students who enroll in the{' '}
                <strong className="text-slate-900">3 Corporate Interview Assurance Programme</strong>{' '}
                and complete their readiness evaluation receive up to{' '}
                <strong className="text-slate-900">3 verified corporate interview opportunities</strong>{' '}
                matched to their degree and eligibility within 12 months.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-md bg-slate-50 border border-slate-200 space-y-1">
                  <div className="text-xs font-bold text-slate-900">
                    100% Base Fee Refund Protection
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    If an eligible student does not receive 3 verified corporate interview opportunities within 12 months, PlacementConnect refunds 100% of their base programme fee (₹1,000 or ₹2,500).
                  </p>
                </div>
                <div className="p-4 rounded-md bg-slate-50 border border-slate-200 space-y-1">
                  <div className="text-xs font-bold text-slate-900">
                    We Secure More Interview Capacity Than Students We Commit To
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {GOVERNANCE_MOAT_MECHANICS.liquidityGuardrailExplanation}
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-50 rounded-lg border border-slate-200 p-6 space-y-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#1E40AF]">
                Student Readiness Assessment (9 Employability Areas)
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Before entering the corporate interview pool, each student completes a structured evaluation across 9 workplace areas (Analytical Logic, Technical Foundations, Written &amp; Spoken Communication, Learning Agility, Teamwork, and Professional Reliability) and receives a digitally verifiable scorecard.
              </p>
              <div className="p-3.5 rounded bg-white border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">Sample Student Credential</span>
                  <span className="font-mono text-slate-500">ID: STU-2026-000001</span>
                </div>
                <Link
                  href="/verify/STU-2026-000001"
                  className="font-semibold text-[#1E40AF] hover:underline"
                >
                  Inspect Live Scorecard &rarr;
                </Link>
              </div>
              <div className="pt-1">
                <Link
                  href="/placement-assurance"
                  className="text-xs font-semibold text-slate-700 hover:text-[#1E40AF] underline"
                >
                  View full programme eligibility &amp; refund rules &rarr;
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 4. HOW PLACEMENTCONNECT WORKS: 4-Step Visual Journey */}
        <section id="how-it-works" className="space-y-6 scroll-mt-24">
          <div className="space-y-2 max-w-3xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#1E40AF]">
              How It Works
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              From College MoU to Student Interviews in Four Simple Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                step: 'Step 1',
                title: 'College Joins',
                detail:
                  'Sign the Institutional MoU and open your dedicated TPO workspace with your official Campus Code (e.g., APX123).',
              },
              {
                step: 'Step 2',
                title: 'Students Are Onboarded',
                detail:
                  'Final-year students join through your college’s verified onboarding link and upload their academic details.',
              },
              {
                step: 'Step 3',
                title: 'Students Are Assessed',
                detail:
                  'Students complete the 9-area Student Readiness Assessment to receive their verified employability scorecard.',
              },
              {
                step: 'Step 4',
                title: 'Corporate Interviews & Reporting',
                detail:
                  'PlacementConnect connects eligible students with confirmed corporate interview opportunities while the TPO tracks progress.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-white rounded-lg border border-slate-200/90 p-6 space-y-2.5"
              >
                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold bg-blue-50 text-[#1E40AF] border border-blue-200">
                  {item.step}
                </span>
                <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. YOUR PLACEMENT DASHBOARD: Interactive Workspace Preview */}
        <section className="space-y-4">
          <div className="space-y-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#1E40AF]">
              Your Placement Dashboard
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              See How Your TPO Workspace Organizes Cohorts, Candidates &amp; Employer Drives
            </h2>
          </div>
          <ProductShowcaseInstrument />
        </section>

        {/* 6. INSTITUTIONAL REPORTING: Mathematically Self-Explanatory 4-Stage Table */}
        <section className="bg-white rounded-lg border border-slate-200/90 p-7 sm:p-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="space-y-1.5 max-w-3xl">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#1E40AF]">
                Clear Institutional Placement Accounting
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Answer Every Principal &amp; Governing Body Question With Exact Numbers
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Every college faces the same questions during review meetings: <em>How many total students were in the graduating batch? How many actually sat for placements? How many enrolled and qualified?</em> PlacementConnect separates all four stages so your numbers are always mathematically clear.
              </p>
            </div>
            <span className="text-xs font-medium px-3 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
              Illustrative Cohort Example (384 Students Placed)
            </span>
          </div>

          {/* Mathematically Self-Explanatory Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50">
                  <th className="py-3.5 px-4">Cohort Stage</th>
                  <th className="py-3.5 px-4 text-right">Students</th>
                  <th className="py-3.5 px-4 text-right">% of Graduating Batch (600)</th>
                  <th className="py-3.5 px-4 text-right">Placement Rate at This Stage (384 Placed)</th>
                  <th className="py-3.5 px-4">What This Stage Measures</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {FOUR_DENOMINATOR_MODEL.map((stage) => (
                  <tr key={stage.id} className="hover:bg-slate-50/80">
                    <td className="py-4 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {stage.code}
                      <span className="block text-[11px] font-normal text-slate-500">
                        {stage.label}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-mono font-bold text-sm text-slate-900 tabular-nums">
                      {stage.sampleCount}
                    </td>
                    <td className="py-4 px-4 text-right font-mono font-semibold text-slate-700 tabular-nums">
                      {stage.percentOfBatch}
                      <span className="block text-[10px] text-slate-400">
                        ({stage.sampleCount} / 600)
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-mono font-bold text-sm text-[#1E40AF] tabular-nums">
                      {stage.samplePlacementRate}
                      <span className="block text-[10px] font-normal text-slate-500">
                        ({stage.formulaText})
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-600 max-w-xs leading-relaxed">
                      {stage.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 7. TRANSPARENT ECONOMICS: College, Student & Employer Side-by-Side */}
        <section className="space-y-6">
          <div className="space-y-2 max-w-3xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#1E40AF]">
              Transparent College &amp; Student Economics
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Simple Commercial Terms Across College, Student &amp; Visiting Companies
            </h2>
            <p className="text-sm text-slate-600">
              No hidden charges. Here is the complete commercial breakdown across all three stakeholders before your college signs an MoU:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1: College */}
            <div className="bg-white rounded-lg border-2 border-[#1E40AF] p-6 sm:p-7 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-50 text-[#1E40AF]">
                  1. College / TPO Workspace License
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-mono font-bold text-slate-900">
                    {INSTITUTION_COMMERCIAL_PLAN.formattedBase}
                  </span>
                  <span className="text-xs text-slate-500">/ year + 18% GST (₹17,700)</span>
                </div>
                <div className="p-3 rounded bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium leading-relaxed">
                  <strong>Year-1 Fee Waiver Available:</strong> {INSTITUTION_COMMERCIAL_PLAN.pilotWaiverNote}
                </div>
                <ul className="space-y-2 text-xs text-slate-600 pt-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#1E40AF] shrink-0 mt-0.5" />
                    <span>Dedicated Campus Code &amp; student onboarding portal</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#1E40AF] shrink-0 mt-0.5" />
                    <span>4-stage placement reporting &amp; CSV/PDF management exports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#1E40AF] shrink-0 mt-0.5" />
                    <span>Digital MoU registry &amp; campus drive calendar</span>
                  </li>
                </ul>
              </div>
              <Button asChild className="w-full bg-[#1E40AF] hover:bg-blue-900 text-white font-semibold mt-4">
                <Link href="/contact">Request College MoU &amp; Demo</Link>
              </Button>
            </div>

            {/* Column 2: Student */}
            <div className="bg-white rounded-lg border border-slate-200/90 p-6 sm:p-7 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-800">
                  2. Optional Student Assurance Programme
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-mono font-bold text-slate-900">
                    {STUDENT_PROGRAMME_PLANS[0].formattedBase} / {STUDENT_PROGRAMME_PLANS[1].formattedBase}
                  </span>
                  <span className="text-xs text-slate-500">+ 18% GST</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Students choose between the Standard Track (<strong>₹1,000 + GST = ₹1,180</strong>) or Extended Readiness Track (<strong>₹2,500 + GST = ₹2,950</strong>).
                </p>
                <ul className="space-y-2 text-xs text-slate-600 pt-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span>Complete 9-area Student Readiness Assessment &amp; verifiable scorecard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span>Up to 3 verified corporate interview opportunities within 12 months</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span>100% Base Fee Refund protection if 3 interviews are not facilitated</span>
                  </li>
                </ul>
              </div>
              <Button asChild variant="outline" className="w-full border-slate-300 font-semibold mt-4">
                <Link href="/for-students">View Student Programme Details</Link>
              </Button>
            </div>

            {/* Column 3: Visiting Employers */}
            <div className="bg-white rounded-lg border border-slate-200/90 p-6 sm:p-7 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-900">
                  3. Visiting Corporate Employers
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-mono font-bold text-emerald-800">₹0</span>
                  <span className="text-xs text-slate-500">Platform Subscription Fee</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Companies pay <strong>₹0</strong> to post roles, filter pre-assessed students from your college, and conduct campus or pooled interview drives.
                </p>
                <ul className="space-y-2 text-xs text-slate-600 pt-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span>Zero barrier for HR teams to shortlist your college’s students</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span>Employer pays {EMPLOYER_COMMERCIAL_POLICY.formattedPerJoinFee}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span>Backed by a 60-day probation replacement guarantee for employers</span>
                  </li>
                </ul>
              </div>
              <Button asChild variant="outline" className="w-full border-slate-300 font-semibold mt-4">
                <Link href="/for-employers">View Corporate Hiring Process</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* 8. SECURITY, PRIVACY & GOVERNANCE FOOTER */}
        <section className="bg-white rounded-lg border border-slate-200/90 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#1E40AF]">
              <Lock className="h-4 w-4" />
              Institutional Data Protection &amp; Student Privacy
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Your College&apos;s Student Roster Is Isolated and Protected Under the DPDP Act 2023
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your graduating batch records are never shared with competing institutions or unverified third-party brokers. Students control their own profile visibility, and your TPO team retains full export ownership at all times.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Button asChild variant="outline" className="border-slate-300 text-xs font-semibold">
              <Link href="/security">Security &amp; Data Governance</Link>
            </Button>
            <Button asChild className="bg-[#1E40AF] hover:bg-blue-900 text-white text-xs font-semibold">
              <Link href="/contact">Schedule TPO Walkthrough</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
