import Link from 'next/link';
import {
  Building2,
  Briefcase,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductShowcaseInstrument } from '@/components/marketing/product-showcase';
import {
  SAFE_TERMINOLOGY,
  FOUR_DENOMINATOR_MODEL,
} from '@/config/brand-system';
import {
  INSTITUTION_COMMERCIAL_PLAN,
  STUDENT_PROGRAMME_PLANS,
  EMPLOYER_COMMERCIAL_POLICY,
} from '@/config/commercial-policy';
import { COMPANY_IDENTITY } from '@/config/company-identity';

export default function HomePage() {
  return (
    <div className="bg-slate-50 text-slate-900">
      {/* 1. HERO: Instant 30-Second Clarity for TPOs, Employers & Students */}
      <section className="bg-white border-b border-slate-200/90 py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-[#1E40AF]">
              Institutional Placement &amp; Verified Graduate Hiring Network
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-[1.14]">
              Structured Campus Placement Infrastructure for Colleges, Employers, and Graduating Cohorts.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              PlacementConnect connects higher-education placement cells with corporate hiring teams through verifiable data—combining{' '}
              <strong className="font-semibold text-slate-900">
                accreditation-ready placement reporting
              </strong>
              , a standardized{' '}
              <strong className="font-semibold text-slate-900">
                9-dimension graduate employability evaluation
              </strong>
              , and{' '}
              <strong className="font-semibold text-slate-900">
                confirmed corporate interview opportunities
              </strong>
              .
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Button asChild className="h-11 px-6 bg-[#1E40AF] hover:bg-blue-900 text-white font-semibold">
                <Link href="/contact">
                  Request Institutional Partnership
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-11 px-5 border-slate-300 text-slate-800 font-semibold bg-white"
              >
                <Link href="/verify">
                  <ShieldCheck className="mr-2 h-4 w-4 text-emerald-700" />
                  Verify a Candidate Credential
                </Link>
              </Button>
            </div>

            {/* Clean 3-Stakeholder Entry Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-6 border-t border-slate-200">
              <Link
                href="/for-colleges"
                className="p-4 rounded-md border border-slate-200/90 bg-slate-50/70 hover:bg-white hover:border-blue-300 transition-all group"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-[#1E40AF]">
                  <span>For Colleges &amp; TPOs</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  Placement OS &amp; NAAC/NIRF reporting (<span className="font-mono font-semibold text-slate-900">₹15,000/yr</span>)
                </div>
              </Link>

              <Link
                href="/for-employers"
                className="p-4 rounded-md border border-slate-200/90 bg-slate-50/70 hover:bg-white hover:border-emerald-300 transition-all group"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-emerald-800">
                  <span>For Corporate Employers</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  Pre-assessed graduate shortlists &amp; coordinated drives
                </div>
              </Link>

              <Link
                href="/for-students"
                className="p-4 rounded-md border border-slate-200/90 bg-slate-50/70 hover:bg-white hover:border-blue-300 transition-all group"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                  <span>For Graduating Students</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  Scorecard &amp; 3-Interview Placement Assurance (<span className="font-mono font-semibold text-slate-900">Code: APX123</span>)
                </div>
              </Link>
            </div>
          </div>

          {/* Calm, Light-Surface Institutional Summary Card (No Dark Terminal Box) */}
          <div className="lg:col-span-5">
            <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-6 sm:p-7 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
                <div>
                  <div className="text-xs font-semibold text-[#1E40AF]">
                    Four-Stage Cohort Reporting
                  </div>
                  <h2 className="text-base font-bold text-slate-900 mt-0.5">
                    Clear Batch Numbers for Principals &amp; Reviews
                  </h2>
                </div>
                <span className="text-[11px] font-medium px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-700">
                  600 Batch • 384 Placed
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {FOUR_DENOMINATOR_MODEL.map((d) => (
                  <div
                    key={d.id}
                    className="p-4 rounded-md border border-slate-200/90 bg-white space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-700">{d.code}</span>
                      <span className="font-mono font-semibold text-slate-600">{d.percentOfBatch} of batch</span>
                    </div>
                    <div className="text-2xl font-mono font-bold text-slate-900 tabular-nums">
                      {d.sampleCount} <span className="text-xs font-sans font-normal text-slate-500">students</span>
                    </div>
                    <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">384 Placed:</span>
                      <span className="font-mono font-bold text-[#1E40AF]">{d.samplePlacementRate}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-md bg-white border border-slate-200/90 space-y-1">
                <div className="text-xs font-bold text-slate-900">
                  Backed by Confirmed Employer Interview Capacity
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Student interview commitments are matched against active corporate hiring demand before cohort enrollment opens, ensuring every eligible student receives at least 3 verified interviews.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS: Editorial 4-Phase Workflow */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
        <div className="space-y-2 max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#1E40AF]">
            How PlacementConnect Works
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            One Connected Workflow from Campus Roster to Confirmed Hiring
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Designed to eliminate manual spreadsheets for Training &amp; Placement Officers while giving corporate recruiters structured, trustworthy candidate data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              num: '01',
              title: 'Campus Roster & QR Onboarding',
              body: 'Colleges upload their graduating batch roster and share a dedicated campus code so only verified students from the institution can register.',
            },
            {
              num: '02',
              title: '9-Dimension Graduate Evaluation',
              body: 'Students complete a standardized 36-item timed assessment measuring analytical reasoning, role fundamentals, communication, and professional ethics.',
            },
            {
              num: '03',
              title: 'Verified Shortlists & Campus Drives',
              body: 'Employers filter pre-assessed candidates across 9 competency areas and coordinate interview panels across partner campuses.',
            },
            {
              num: '04',
              title: 'Placement Evidence & Outcome Tracking',
              body: 'Interview attendance, offers, and confirmed joins automatically update the institution’s four-level placement reports for accreditation audits.',
            },
          ].map((step) => (
            <div
              key={step.num}
              className="bg-white rounded-md border border-slate-200/90 p-6 space-y-3"
            >
              <div className="font-mono text-xs font-bold text-[#1E40AF]">
                {step.num}
              </div>
              <h3 className="text-base font-bold text-slate-900">{step.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FOCAL PRODUCT SHOWCASE: The Single Interactive Workspace Window */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
        <div className="space-y-2 max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#1E40AF]">
            Inside the Platform
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Explore the Institutional, Recruiter, and Student Workspaces
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Inspect how placement officers track batch outcomes, how recruiters filter pre-assessed shortlists, and how candidate credentials are verified.
          </p>
        </div>

        <ProductShowcaseInstrument />
      </section>

      {/* 4. THREE STAKEHOLDER PILLARS: Calm Editorial Cards */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
        <div className="space-y-2 max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#1E40AF]">
            Stakeholder Capabilities
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Built for Every Participant in Campus Placement
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colleges */}
          <div className="bg-white rounded-md border border-slate-200/90 p-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#1E40AF]">
                  For Colleges &amp; Universities
                </span>
                <Building2 className="h-5 w-5 text-[#1E40AF]" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Placement Operations &amp; Accreditation Evidence
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-600">
                {INSTITUTION_COMMERCIAL_PLAN.deliverables.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-[#1E40AF] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-4 border-t border-slate-100">
              <Link
                href="/for-colleges"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E40AF] hover:underline"
              >
                Explore College Placement OS
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Employers */}
          <div className="bg-white rounded-md border border-slate-200/90 p-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-800">
                  For Corporate Talent Acquisition
                </span>
                <Briefcase className="h-5 w-5 text-emerald-700" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Built for High-Efficiency Graduate Hiring Teams
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-600">
                {EMPLOYER_COMMERCIAL_POLICY.deliverables.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-4 border-t border-slate-100">
              <Link
                href="/for-employers"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:underline"
              >
                Explore Employer Hiring
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Students */}
          <div className="bg-white rounded-md border border-slate-200/90 p-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">
                  For Graduating Students
                </span>
                <GraduationCap className="h-5 w-5 text-slate-800" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Digitally Verifiable Scorecard &amp; 3-Interview Placement Assurance
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-600">
                {STUDENT_PROGRAMME_PLANS[0].deliverables.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-blue-700 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-4 border-t border-slate-100">
              <Link
                href="/for-students"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:underline"
              >
                Enter College Code &amp; View Programme Tracks
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PRICING & DATA GOVERNANCE SUMMARY */}
      <section className="bg-white border-y border-slate-200/90 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#1E40AF]">
              Privacy, Security &amp; Data Governance
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Dedicated Campus Data Isolation &amp; Student-Controlled Privacy
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every institution operates in a logically isolated workspace. Students control whether their evaluation profile is public, visible only to verified employers, or private—aligned with India&apos;s Digital Personal Data Protection (DPDP) Act 2023.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Button asChild variant="outline" size="sm" className="border-slate-300 text-xs font-semibold">
                <Link href="/security">
                  <Lock className="mr-1.5 h-3.5 w-3.5 text-[#1E40AF]" />
                  Security &amp; Compliance Architecture
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="border-slate-300 text-xs font-semibold">
                <Link href="/about">About PlacementConnect</Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#1E40AF]">
              Transparent Institutional &amp; Student Programme Pricing
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-md border border-slate-200 bg-slate-50/70 space-y-1.5">
                <div className="text-xs font-semibold text-blue-900">
                  Colleges &amp; TPOs
                </div>
                <div className="text-2xl font-mono font-bold text-slate-900">
                  {INSTITUTION_COMMERCIAL_PLAN.formattedBase}
                </div>
                <div className="text-xs font-mono text-slate-500">
                  + {INSTITUTION_COMMERCIAL_PLAN.formattedGst} / year
                </div>
                <p className="text-xs text-slate-600 pt-1">
                  Waived in Year 1 when 100+ students enroll in the Interview Assurance track.
                </p>
              </div>

              <div className="p-5 rounded-md border border-slate-200 bg-slate-50/70 space-y-1.5">
                <div className="text-xs font-semibold text-emerald-900">
                  Corporate Employers
                </div>
                <div className="text-lg font-bold text-slate-900">
                  Custom Hiring Scope
                </div>
                <div className="text-xs text-slate-500">
                  Single-College &amp; Multi-Campus Drives
                </div>
                <p className="text-xs text-slate-600 pt-1">
                  Hiring partnerships are structured based on employer requirements and partnership scope. Commercial terms are discussed during employer onboarding.
                </p>
              </div>

              <div className="p-5 rounded-md border border-slate-200 bg-slate-50/70 space-y-1.5">
                <div className="text-xs font-semibold text-slate-800">
                  Graduating Students
                </div>
                <div className="text-2xl font-mono font-bold text-slate-900">
                  ₹1,000 / ₹2,500
                </div>
                <div className="text-xs font-mono text-slate-500">
                  + 18% GST (₹1,180 / ₹2,950)
                </div>
                <p className="text-xs text-slate-600 pt-1">
                  Up to 3 qualified corporate interviews within 12 months (subject to eligibility) or 100% base fee refund.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CONVERSION CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-lg bg-[#0F172A] text-white p-8 sm:p-12 border border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <div className="text-xs text-blue-300 font-semibold uppercase tracking-wider">
                Institutional &amp; Corporate Onboarding
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Bring Verifiable Placement Infrastructure to Your Campus or Hiring Team
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                Schedule a walkthrough with our Institutional Partnerships Desk ({COMPANY_IDENTITY.desks.institutionalPartnerships.email}) or test our live credential verification registry.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
              <Button asChild className="h-11 bg-[#1E40AF] hover:bg-blue-800 text-white font-semibold w-full">
                <Link href="/contact">
                  Schedule Partnership Discussion
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-11 bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white text-xs w-full"
              >
                <Link href={`/verify/${COMPANY_IDENTITY.sampleCredentials.validStudentId}`}>
                  Verify Sample Credential ({COMPANY_IDENTITY.sampleCredentials.validStudentId})
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
