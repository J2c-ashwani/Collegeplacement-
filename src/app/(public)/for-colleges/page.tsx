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
      {/* LAYER 1: What is it? (Hero with Dominant Primary CTA + Secondary CTA) */}
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
            Manage your college placement process, prepare students for hiring, connect eligible students with verified corporate interview opportunities, and keep placement records organized in one platform.
          </p>
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <Button asChild className="bg-[#1E40AF] hover:bg-blue-900 text-white font-semibold h-11 px-6 shadow-xs">
              <Link href="/contact">
                Request Institutional Walkthrough
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-11 px-5 border-slate-300 text-slate-700 font-semibold bg-white">
              <a href="#how-it-works">See How It Works</a>
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto py-14 sm:py-16 px-4 sm:px-6 lg:px-8 space-y-16">
        {/* LAYER 2: What does my college get? (Feature -> TPO Problem -> Benefit) */}
        <section className="space-y-6">
          <div className="space-y-2 max-w-3xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#1E40AF]">
              What Your College Gets
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              One Placement Workspace for Your Entire TPO Team
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Whether you coordinate 300 or 1,500 graduating students across multiple departments, PlacementConnect replaces scattered spreadsheets and WhatsApp groups with one organized placement workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: QrCode,
                title: 'Verified Student Onboarding',
                problem: 'Replaces manual Google Forms & WhatsApp lists',
                benefit:
                  'Students join through your college’s verified Campus Code (e.g., APX123) with roll-number and branch verification.',
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
                title: 'Management & Placement Reports',
                problem: 'Saves weeks of manual spreadsheet compilation',
                benefit:
                  'Get placement reports ready for management, governing bodies, and internal NAAC / NIRF documentation.',
              },
              {
                icon: FileText,
                title: 'MoU & Activity Records',
                problem: 'Prevents lost partnership paperwork',
                benefit:
                  'Keep companies, active MoUs, renewal reminders, and career workshop records organized in one departmental archive.',
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

        {/* LAYER 3: What do my students get? (Prominent Benefit + Clear Eligibility Terms) */}
        <section className="bg-white rounded-lg border border-blue-200 shadow-xs p-7 sm:p-10 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-900">
                <ShieldCheck className="h-4 w-4 text-emerald-700" />
                What Your Students Get
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                3 Verified Corporate Interview Opportunities
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                For eligible final-year students enrolled in the{' '}
                <strong className="text-slate-900">3 Corporate Interview Assurance Programme</strong>, subject to programme eligibility and attendance requirements. Note: PlacementConnect assures 3 verified corporate interview opportunities—final job selection always rests on candidate performance and employer evaluation.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-md bg-slate-50 border border-slate-200 space-y-1">
                  <div className="text-xs font-bold text-slate-900">
                    100% Base Programme Fee Refund Protection
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    If the 3 verified corporate interview opportunities are not facilitated within 12 months of readiness evaluation completion for an eligible student, PlacementConnect refunds 100% of their base programme fee (₹1,000 or ₹2,500).
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
                Student Readiness Assessment (All 9 Areas)
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Students are evaluated across all nine employability areas—<strong>1. Analytical Logic, 2. Technical Foundations, 3. Role Execution, 4. Communication Clarity, 5. Behavioral Maturity, 6. Learning Agility, 7. Teamwork &amp; Collaboration, 8. Quantitative Reasoning, and 9. Professional Reliability</strong>—before they enter the verified corporate interview pool.
              </p>
              <div className="p-3.5 rounded bg-white border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">Sample Student Scorecard (Illustrative)</span>
                  <span className="font-mono text-slate-500">ID: STU-2026-000001</span>
                </div>
                <Link
                  href="/verify/STU-2026-000001"
                  className="font-semibold text-[#1E40AF] hover:underline"
                >
                  View Evaluation Framework &rarr;
                </Link>
              </div>
              <div className="pt-1">
                <Link
                  href="/placement-assurance"
                  className="text-xs font-semibold text-slate-700 hover:text-[#1E40AF] underline"
                >
                  View full programme eligibility &amp; assurance terms &rarr;
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* LAYER 4: How does it work? (Concrete 4-Step Visual Journey) */}
        <section id="how-it-works" className="space-y-6 scroll-mt-24">
          <div className="space-y-2 max-w-3xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#1E40AF]">
              How PlacementConnect Works
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              How Your College &amp; Students Move From Onboarding to Interviews
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                step: '1. College Joins',
                subtitle: 'MoU + TPO Workspace',
                detail:
                  'Sign the Institutional MoU and open your dedicated TPO workspace with your official Campus Code (e.g., APX123).',
              },
              {
                step: '2. Students Are Onboarded',
                subtitle: 'Verified Campus Registration',
                detail:
                  'Final-year students join through your college’s verified onboarding process and link their roll numbers.',
              },
              {
                step: '3. Students Are Assessed',
                subtitle: 'Readiness Evaluation + Eligibility',
                detail:
                  'Eligible students complete the 9-area readiness evaluation to enter the verified corporate interview pool.',
              },
              {
                step: '4. Hiring Begins',
                subtitle: 'Employer Interviews + Placement Tracking',
                detail:
                  'PlacementConnect connects eligible students with confirmed corporate interview opportunities while your TPO team tracks progress.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-white rounded-lg border border-slate-200/90 p-6 space-y-2.5"
              >
                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold bg-blue-50 text-[#1E40AF] border border-blue-200">
                  {item.step}
                </span>
                <h3 className="text-base font-bold text-slate-900">{item.subtitle}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* LAYER 5: What does it cost? (Transparent Institutional & Student Programme Pricing) */}
        <section className="space-y-6">
          <div className="space-y-2 max-w-3xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#1E40AF]">
              Transparent Pricing
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Transparent Institutional &amp; Student Programme Pricing
            </h2>
            <p className="text-sm text-slate-600">
              Here is how the institutional license and student programme fees work so you can explain them directly to your Principal and management:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Column 1: College */}
            <div className="bg-white rounded-lg border-2 border-[#1E40AF] p-6 sm:p-7 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-50 text-[#1E40AF]">
                  1. College License
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-mono font-bold text-slate-900">
                    {INSTITUTION_COMMERCIAL_PLAN.formattedBase}
                  </span>
                  <span className="text-xs text-slate-500">/ year + 18% GST (₹17,700)</span>
                </div>
                <div className="p-3 rounded bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium leading-relaxed">
                  <strong>Year-1 Waiver Condition:</strong> {INSTITUTION_COMMERCIAL_PLAN.pilotWaiverNote}
                </div>
                <ul className="space-y-2 text-xs text-slate-600 pt-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#1E40AF] shrink-0 mt-0.5" />
                    <span>Dedicated TPO workspace &amp; verified Campus Code</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#1E40AF] shrink-0 mt-0.5" />
                    <span>4-stage placement reporting &amp; CSV/PDF management exports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#1E40AF] shrink-0 mt-0.5" />
                    <span>MoU registry, company drive scheduling &amp; activity tracking</span>
                  </li>
                </ul>
              </div>
              <Button asChild className="w-full bg-[#1E40AF] hover:bg-blue-900 text-white font-semibold mt-4">
                <Link href="/contact">Request Institutional Walkthrough</Link>
              </Button>
            </div>

            {/* Column 2: Student */}
            <div className="bg-white rounded-lg border border-slate-200/90 p-6 sm:p-7 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-800">
                  2. Student Programme Fee
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-mono font-bold text-slate-900">
                    {STUDENT_PROGRAMME_PLANS[0].formattedBase} / {STUDENT_PROGRAMME_PLANS[1].formattedBase}
                  </span>
                  <span className="text-xs text-slate-500">+ 18% GST</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Paid by participating students depending on programme track (<strong>₹1,000 + GST = ₹1,180</strong> for Standard or <strong>₹2,500 + GST = ₹2,950</strong> for Extended Readiness).
                </p>
                <ul className="space-y-2 text-xs text-slate-600 pt-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span>Includes 9-area Student Readiness Assessment &amp; digital credential</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span>3 verified corporate interview opportunities within 12 months for eligible students</span>
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
          </div>
        </section>

        {/* LAYER 6: Your Placement Dashboard + Institutional Reporting */}
        <section className="space-y-4">
          <div className="space-y-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#1E40AF]">
              Your Placement Dashboard
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Interactive TPO Workspace Preview (Illustrative Cohort — Sample Data)
            </h2>
          </div>
          <ProductShowcaseInstrument />
        </section>

        <section className="bg-white rounded-lg border border-slate-200/90 p-7 sm:p-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="space-y-1.5 max-w-3xl">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#1E40AF]">
                Institutional Reporting
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Four-Stage Cohort Reporting for Principals &amp; Governing Bodies
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Colleges often face confusion over whether placement percentages are calculated against the entire graduating batch or only the students who sat for placements. PlacementConnect tracks all four stages side-by-side so your reports are mathematically self-explanatory.
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1.5 rounded bg-amber-50 text-amber-900 border border-amber-200 shrink-0">
              Illustrative Cohort — Sample Data (600 Batch / 384 Placed)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50">
                  <th className="py-3.5 px-4">Cohort Stage</th>
                  <th className="py-3.5 px-4 text-right">Students (Sample)</th>
                  <th className="py-3.5 px-4 text-right">% of Graduating Batch (600)</th>
                  <th className="py-3.5 px-4 text-right">Placement Rate at Stage (384 Placed)</th>
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
          <p className="text-[11px] text-slate-500 italic">
            Note: The 600-student / 384-placed figures above are an illustrative sample cohort demonstrating how PlacementConnect calculates stage-by-stage ratios inside your college workspace.
          </p>
        </section>

        {/* LAYER 7: Security, Privacy & Governance */}
        <section className="bg-white rounded-lg border border-slate-200/90 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#1E40AF]">
              <Lock className="h-4 w-4" />
              Security, Privacy &amp; Institutional Governance
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Your College&apos;s Student Roster Is Isolated and Protected Under the DPDP Act 2023
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your graduating batch records are isolated to your institution workspace, students control their profile visibility, and your TPO team can export all records at any time.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Button asChild variant="outline" className="border-slate-300 text-xs font-semibold">
              <Link href="/security">Security &amp; Data Governance</Link>
            </Button>
            <Button asChild className="bg-[#1E40AF] hover:bg-blue-900 text-white text-xs font-semibold">
              <Link href="/contact">Request Institutional Walkthrough</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
