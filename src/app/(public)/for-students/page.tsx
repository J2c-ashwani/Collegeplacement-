'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  QrCode,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Briefcase,
  ClipboardCheck,
  Building2,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  STUDENT_PROGRAMME_PLANS,
  GOVERNANCE_MOAT_MECHANICS,
} from '@/config/commercial-policy';
import { COMPANY_IDENTITY } from '@/config/company-identity';

const ROLE_OPPORTUNITY_TRACKS = [
  {
    category: 'Software Engineering, QA & Technical Roles',
    roles:
      'Full-Stack / Backend Developer, QA Automation Engineer, Cloud / DevOps Trainee, Technical Support Engineer',
    streams: 'B.Tech / B.E. (CS, IT, ECE, EE), BCA, MCA, B.Sc (CS / IT)',
    indicativeBand: '₹4.0 LPA – ₹8.5 LPA',
    keyAreas: 'Technical Foundations, Analytical Logic, Role Execution',
  },
  {
    category: 'Data Analytics, Business Intelligence & Operations',
    roles:
      'Junior Data Analyst, BI & Reporting Associate, MIS & Process Analyst, Supply Chain & Operations Executive',
    streams: 'B.Tech (All Branches), B.Sc (Stats / Math / Economics), BBA, B.Com, MBA',
    indicativeBand: '₹3.8 LPA – ₹7.0 LPA',
    keyAreas: 'Quantitative Reasoning, Analytical Logic, Professional Reliability',
  },
  {
    category: 'Business Development, Inside Sales & Client Success',
    roles:
      'B2B Business Development Associate, Enterprise Inside Sales, Account Management Trainee, Customer Success Specialist',
    streams: 'BBA, MBA, B.Com, B.A., and Engineering Graduates seeking commercial tracks',
    indicativeBand: '₹3.6 LPA – ₹6.5 LPA (+ performance incentives)',
    keyAreas: 'Communication Clarity, Behavioral Maturity, Learning Agility',
  },
  {
    category: 'Product Operations, Finance & Management Trainee',
    roles:
      'Associate Product Operations, Financial Analyst Trainee, Talent & HR Operations, General Management Trainee',
    streams: 'MBA / PGDM, B.Com (Hons), BBA, B.Tech',
    indicativeBand: '₹4.0 LPA – ₹7.5 LPA',
    keyAreas: 'Role Execution, Teamwork & Collaboration, Quantitative Reasoning',
  },
] as const;

const NINE_ASSESSMENT_AREAS = [
  {
    num: '01',
    name: 'Analytical Logic',
    desc: 'Multi-step problem solving, structured reasoning, and pattern evaluation.',
  },
  {
    num: '02',
    name: 'Technical Foundations',
    desc: 'Core computing, systems literacy, and domain-specific fundamentals.',
  },
  {
    num: '03',
    name: 'Role Execution',
    desc: 'Practical workplace scenarios, prioritization, and task completion.',
  },
  {
    num: '04',
    name: 'Communication Clarity',
    desc: 'Written precision, professional email/report structuring, and comprehension.',
  },
  {
    num: '05',
    name: 'Behavioral Maturity',
    desc: 'Workplace judgment, handling feedback, and professional composure.',
  },
  {
    num: '06',
    name: 'Learning Agility',
    desc: 'Adapting quickly to unfamiliar rules, processes, and new tools.',
  },
  {
    num: '07',
    name: 'Teamwork & Collaboration',
    desc: 'Cross-functional coordination, shared ownership, and conflict resolution.',
  },
  {
    num: '08',
    name: 'Quantitative Reasoning',
    desc: 'Data interpretation, business math, percentages, and numerical accuracy.',
  },
  {
    num: '09',
    name: 'Professional Reliability',
    desc: 'Deadline discipline, attendance commitment, and workplace accountability.',
  },
] as const;

export default function ForStudentsPage() {
  const router = useRouter();
  const [collegeCode, setCollegeCode] = useState('APX123');

  const handleLookupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = collegeCode.trim().toUpperCase() || 'APX123';
    router.push(`/register/${encodeURIComponent(cleaned)}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* SECTION 1: Outcome-First Student Hero + Optional "Already Have a Code?" Box */}
      <section className="bg-white border-b border-slate-200/90 py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-[#1E40AF]">
              For Final-Year Graduating Students (Engineering, Management &amp; Degree Cohorts)
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
              Build Your Job-Ready Profile and Access 3 Corporate Interview Opportunities
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Build more than a resume. Complete our{' '}
              <strong className="font-semibold text-slate-900">9-Area Job-Readiness Assessment</strong>, show employers your verified readiness profile, and access{' '}
              <strong className="font-semibold text-slate-900">
                3 verified corporate interview opportunities within 12 months of assessment completion
              </strong>
              —backed by a <strong className="font-semibold text-slate-900">100% base fee refund guarantee</strong>.
            </p>

            {/* 3-Pillar Benefit Hierarchy: 1. Interviews -> 2. Assessment -> 3. Verified Profile */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3.5 rounded-md bg-slate-50 border border-slate-200">
                <div className="text-xs font-bold text-[#1E40AF]">1. 3 Corporate Interviews</div>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  3 verified corporate interview opportunities matched to your stream &amp; eligibility.
                </p>
              </div>
              <div className="p-3.5 rounded-md bg-slate-50 border border-slate-200">
                <div className="text-xs font-bold text-[#1E40AF]">2. 9-Area Readiness Score</div>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  Prove your analytical, technical, and communication skills beyond just CGPA.
                </p>
              </div>
              <div className="p-3.5 rounded-md bg-slate-50 border border-slate-200">
                <div className="text-xs font-bold text-[#1E40AF]">3. 100% Base Fee Protection</div>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  Full base fee refund (₹1,000 or ₹2,500) if 3 interviews are not facilitated within 12 months of assessment completion.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Button
                asChild
                className="bg-[#1E40AF] hover:bg-blue-900 text-white font-semibold h-11 px-6 shadow-xs"
              >
                <a href="#programme-tracks">
                  Compare Programme Tracks (₹1,180 vs ₹2,950)
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-11 px-5 border-slate-300 text-slate-700 font-semibold bg-white"
              >
                <a href="#opportunity-tracks">See Roles &amp; Salary Bands</a>
              </Button>
            </div>
          </div>

          {/* Right Card: Clearly framed for students who ALREADY have their code + clear path if college isn't partnered */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-lg border border-slate-300 shadow-xs p-6 sm:p-7 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#1E40AF]">
                  <QrCode className="h-4 w-4" />
                  Already Have Your College Code? Start Here
                </div>
                <span className="text-[11px] font-medium px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Batch 2026 Open
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900">
                Enter Your 6-Character Campus Code
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                If your Training &amp; Placement Office (TPO) has shared your official college onboarding code, enter it below (or preview the registration flow using sample code{' '}
                <span className="font-mono font-bold text-slate-900">APX123</span>):
              </p>
              <form onSubmit={handleLookupSubmit} className="flex gap-2.5">
                <Input
                  value={collegeCode}
                  onChange={(e) => setCollegeCode(e.target.value.toUpperCase())}
                  placeholder="e.g., APX123"
                  aria-label="Enter College Code"
                  className="h-11 font-mono text-sm font-bold uppercase tracking-wider"
                  required
                />
                <Button
                  type="submit"
                  className="h-11 px-5 bg-[#1E40AF] hover:bg-blue-900 text-white font-semibold shrink-0"
                >
                  Continue
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </form>

              {/* Path for students whose college is NOT yet partnered */}
              <div className="p-3.5 rounded-md bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <Building2 className="h-3.5 w-3.5 text-[#1E40AF]" />
                  Don&apos;t have a campus code from your college yet?
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Students join PlacementConnect through participating colleges so academic records and roll numbers are verified. Share our college overview with your TPO to bring PlacementConnect to your campus:
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-semibold">
                  <Link href="/for-colleges" className="text-[#1E40AF] hover:underline">
                    View College &amp; TPO Page &rarr;
                  </Link>
                  <span className="text-slate-300">|</span>
                  <Link href="/contact" className="text-slate-700 hover:text-[#1E40AF] hover:underline">
                    Nominate Your College TPO &rarr;
                  </Link>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>
                  Sample Verified Profile:{' '}
                  <span className="font-mono">{COMPANY_IDENTITY.sampleCredentials.validStudentId}</span>
                </span>
                <Link
                  href={`/verify/${COMPANY_IDENTITY.sampleCredentials.validStudentId}`}
                  className="font-semibold text-[#1E40AF] hover:underline inline-flex items-center gap-1"
                >
                  Preview Student Scorecard
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto py-14 sm:py-16 px-4 sm:px-6 lg:px-8 space-y-16">
        {/* SECTION 2: Opportunity Transparency — What Kind of Roles, Sectors & Salary Bands? */}
        <section id="opportunity-tracks" className="space-y-6 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2 max-w-3xl">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#1E40AF]">
                Opportunity Transparency &amp; Role Matching
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                What Kind of Corporate Roles Can You Interview For?
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Your 3 verified corporate interview opportunities are matched to your degree stream, academic cutoffs, and 9-area readiness profile across four primary entry-level hiring tracks:
              </p>
            </div>
            <div className="px-3 py-1.5 rounded bg-amber-50 border border-amber-300 text-xs font-semibold text-amber-900 shrink-0">
              Indicative Fresher Hiring Tracks &amp; CTC Bands
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {ROLE_OPPORTUNITY_TRACKS.map((track) => (
              <div
                key={track.category}
                className="bg-white rounded-lg border border-slate-200/90 p-6 space-y-3 shadow-2xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-[#1E40AF] shrink-0" />
                    <h3 className="text-base font-bold text-slate-900">{track.category}</h3>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-900 font-mono text-xs font-bold shrink-0">
                    {track.indicativeBand}
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  <strong className="text-slate-900">Typical Roles:</strong> {track.roles}
                </p>
                <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600">
                  <div>
                    <span className="font-semibold text-slate-800 block">Eligible Streams:</span>
                    {track.streams}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 block">Primary Assessment Areas:</span>
                    {track.keyAreas}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* How Matching Works in 4 Steps */}
          <div className="bg-white rounded-lg border border-slate-200/90 p-6 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-800">
              How Your 3 Corporate Interview Opportunities Are Matched &amp; Tracked
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-3.5 rounded bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-[#1E40AF] block">1. Degree &amp; Cutoff Alignment</span>
                <p className="text-slate-600 leading-relaxed">
                  Your TPO-verified branch, CGPA, and active backlog status are matched against live employer role criteria.
                </p>
              </div>
              <div className="p-3.5 rounded bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-[#1E40AF] block">2. 9-Area Strength Matching</span>
                <p className="text-slate-600 leading-relaxed">
                  Students with strong technical/analytical scores are routed to engineering/data roles; strong communicators to commercial/operations tracks.
                </p>
              </div>
              <div className="p-3.5 rounded bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-[#1E40AF] block">3. Confirmed Interview Invitations</span>
                <p className="text-slate-600 leading-relaxed">
                  You receive confirmed interview slot invitations (campus or multi-campus pooled drives) directly in your student dashboard.
                </p>
              </div>
              <div className="p-3.5 rounded bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-[#1E40AF] block">4. Tracked 0/3 to 3/3 Quota</span>
                <p className="text-slate-600 leading-relaxed">
                  Every completed interview updates your counter (0/3 &rarr; 3/3). Priority routing continues until all 3 verified interviews are facilitated.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: What Am I Tested On? (All 9 Assessment Areas in Plain Student Language) */}
        <section className="bg-white rounded-lg border border-slate-200/90 p-7 sm:p-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="space-y-1.5 max-w-3xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#1E40AF]">
                <ClipboardCheck className="h-4 w-4" />
                Inside the Evaluation
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                What Are You Actually Tested On? (All 9 Assessment Areas)
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                The 9-Dimension Employability Evaluation is a structured <strong>36-item timed assessment (60 minutes)</strong> designed to show corporate recruiters your practical job readiness across analytical, technical, and workplace skills:
              </p>
            </div>
            <Link
              href={`/verify/${COMPANY_IDENTITY.sampleCredentials.validStudentId}`}
              className="text-xs font-semibold text-[#1E40AF] hover:underline shrink-0"
            >
              View Sample 9-Area Scorecard &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {NINE_ASSESSMENT_AREAS.map((area) => (
              <div
                key={area.num}
                className="p-4 rounded-md bg-slate-50 border border-slate-200 space-y-1"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-blue-50 text-[#1E40AF] border border-blue-200">
                    Area {area.num}
                  </span>
                  <h3 className="text-xs font-bold text-slate-900">{area.name}</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pt-0.5">{area.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4: Two Student Programme Tracks + 5-Second Comparison */}
        <section id="programme-tracks" className="space-y-6 scroll-mt-24">
          <div className="space-y-2 max-w-3xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#1E40AF]">
              Student Programme Options
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Choose Your Programme Track: Standard (₹1,180) vs Extended (₹2,950)
            </h2>
            <p className="text-sm text-slate-600">
              Both tracks include the 9-Area Job-Readiness Assessment, a verified student profile, and <strong>3 Verified Corporate Interview Opportunities within 12 months of assessment completion</strong>.
            </p>
          </div>

          {/* 5-Second Student Comparison Callout */}
          <div className="bg-blue-50/70 rounded-lg border border-blue-200 p-5 sm:p-6 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1E40AF]">
              <Sparkles className="h-4 w-4" />
              5-Second Comparison: Why Pay ₹2,950 Instead of ₹1,180?
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-white rounded-md border border-slate-200 p-4 space-y-1">
                <div className="font-bold text-slate-900">
                  Standard Track — ₹1,000 + 18% GST = ₹1,180
                </div>
                <p className="text-slate-600 leading-relaxed">
                  <strong>Assess + Verified Profile + 3 Corporate Interview Opportunities.</strong> Best if you are confident taking the 9-area assessment right away with a single official attempt.
                </p>
              </div>
              <div className="bg-white rounded-md border border-blue-300 p-4 space-y-1">
                <div className="font-bold text-[#1E40AF]">
                  Extended Readiness Track — ₹2,500 + 18% GST = ₹2,950 (+₹1,770)
                </div>
                <p className="text-slate-600 leading-relaxed">
                  <strong>Everything in Standard + Preparation Modules + 2nd Assessment Attempt (Best Score Kept) + Priority Consideration for Pooled Drives.</strong> Best if you want a baseline diagnostic first, guided preparation to improve weak areas, and a second attempt so employers see your higher percentile.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {STUDENT_PROGRAMME_PLANS.map((plan, idx) => {
              const isExtended = idx === 1;
              return (
                <div
                  key={plan.id}
                  className={`bg-white rounded-lg p-7 sm:p-8 flex flex-col justify-between space-y-6 ${
                    isExtended
                      ? 'border-2 border-[#1E40AF] shadow-xs'
                      : 'border border-slate-200/90'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-50 text-[#1E40AF] border border-blue-200">
                        {plan.badge}
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-50 text-emerald-900 border border-emerald-200">
                        {plan.interviewQuota} Verified Corporate Interview Opportunities
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-mono font-bold text-slate-900">
                        {plan.formattedBase}
                      </span>
                      <span className="text-xs font-mono text-slate-500">
                        {plan.formattedGst} ={' '}
                        <strong className="text-slate-900">{plan.formattedTotal}</strong>
                      </span>
                    </div>

                    {/* One-Line Core Summary Pill */}
                    <div className="p-3 rounded bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800">
                      {isExtended
                        ? 'Summary: Everything in Standard + Guided Prep + 2 Assessment Attempts (Best Score Kept) + Priority Pooled Drive Routing'
                        : 'Summary: 1 Official Assessment Attempt + Verified Profile + 3 Corporate Interview Opportunities'}
                    </div>

                    <ul className="space-y-2.5 text-xs text-slate-600 pt-1">
                      {plan.deliverables.map((item) => (
                        <li key={item} className="flex items-start gap-2.5">
                          <CheckCircle2 className="h-4 w-4 text-[#1E40AF] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <div className="p-3.5 rounded-md bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 leading-relaxed">
                      <strong>100% Base Fee Refund Guarantee:</strong> {plan.refundBackstopText}
                    </div>
                    <Button
                      asChild
                      className="w-full h-10 bg-[#1E40AF] hover:bg-blue-900 text-white text-xs font-semibold"
                    >
                      <Link href="/register/APX123">
                        Start with Campus Code (Sample Preview: APX123)
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 5: Clear Eligibility & Merit Disclosure */}
        <div className="bg-white rounded-lg border border-slate-200/90 p-7 sm:p-8 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
            <ShieldCheck className="h-4 w-4 text-[#1E40AF]" />
            Important Programme Terms &amp; Merit Boundaries
          </div>
          <ul className="list-disc pl-5 space-y-2 text-xs text-slate-600 leading-relaxed">
            {GOVERNANCE_MOAT_MECHANICS.assuranceBoundaryDisclosures.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
