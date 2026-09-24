import Link from 'next/link';
import {
  CheckCircle2,
  ArrowRight,
  CalendarCheck2,
  FileCheck2,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  SAFE_TERMINOLOGY,
  NINE_DIMENSIONS_SPEC,
} from '@/config/brand-system';
import { EMPLOYER_COMMERCIAL_POLICY } from '@/config/commercial-policy';
import { COMPANY_IDENTITY } from '@/config/company-identity';

export default function ForEmployersPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Hero: Talent Quality -> Screening -> Shortlist -> Interviews -> Hiring */}
        <div className="space-y-5 border-b border-slate-200 pb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-900">
            For Corporate Talent Acquisition &amp; University Relations Teams
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 max-w-4xl leading-tight">
            Structured Graduate Hiring: Pre-Assessed Shortlists, Coordinated Interviews, Zero Platform Fee
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
            Replace high-volume resume screening with verified competency data. Access graduating cohorts evaluated under our{' '}
            <strong className="font-semibold text-slate-900">
              {SAFE_TERMINOLOGY.assessmentFrameworkName}
            </strong>
            , schedule multi-campus interview panels effortlessly, and pay only when a selected candidate formally joins your team.
          </p>
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <Button asChild className="h-11 px-6 bg-[#1E40AF] hover:bg-blue-900 text-white font-semibold">
              <Link href="/register">
                Start Hiring at ₹0 Platform Fee
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-11 px-5 border-slate-300 font-semibold bg-white">
              <Link href={`/verify/${COMPANY_IDENTITY.sampleCredentials.validStudentId}`}>
                <ShieldCheck className="mr-2 h-4 w-4 text-emerald-700" />
                Inspect Sample Candidate Scorecard
              </Link>
            </Button>
          </div>
        </div>

        {/* Dominant Visual Idea: The 5-Stage Corporate Talent Acquisition Pipeline */}
        <section className="space-y-6">
          <div className="space-y-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
              Recruiter Workflow
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              From Role Requirements to Confirmed Joins in Five Structured Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              {
                step: '01 / Talent Quality',
                title: 'Institution-Verified Cohorts',
                detail: 'Academic CGPA, backlog status, and graduation batch verified directly against college records.',
              },
              {
                step: '02 / Screening',
                title: '9-Dimension Filtering',
                detail: 'Set minimum score thresholds across analytical, technical, and communication dimensions.',
              },
              {
                step: '03 / Shortlist',
                title: 'Instant Candidate Matches',
                detail: 'Receive ranked shortlists of eligible candidates ready for immediate interview scheduling.',
              },
              {
                step: '04 / Interviews',
                title: 'Coordinated Drive Slots',
                detail: 'Automated panel slot booking and evaluation rubrics for campus and pooled drives.',
              },
              {
                step: '05 / Hiring',
                title: 'Pay Only on Joining',
                detail: '₹0 upfront fee; ₹10,000 + GST applies only after onboarding, with a 60-day replacement guarantee.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-white rounded-md border border-slate-200/90 p-5 space-y-2"
              >
                <div className="font-mono text-xs font-bold text-emerald-800">{item.step}</div>
                <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 9-Dimension Candidate Evaluation Grid */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div className="space-y-1">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#1E40AF]">
                Standardized Candidate Screening
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                What Every Pre-Assessed Candidate Scorecard Measures (0–100 Scale)
              </h2>
            </div>
            <span className="text-xs font-medium px-3 py-1 rounded bg-white border border-slate-200 text-slate-600">
              36-Item Timed Evaluation
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {NINE_DIMENSIONS_SPEC.map((dim) => (
              <div
                key={dim.id}
                className="bg-white rounded-md border border-slate-200/90 p-5 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{dim.category}</span>
                  <span className="font-mono font-bold text-[#1E40AF]">
                    Weight: {dim.weightPercent}%
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-900">{dim.name}</div>
                <p className="text-xs text-slate-600 leading-relaxed">{dim.evaluationMethod}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Commercial Terms & Replacement Protection */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-md border border-slate-200/90 p-7 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
              <FileCheck2 className="h-4 w-4" />
              Transparent Commercial Model
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              {EMPLOYER_COMMERCIAL_POLICY.formattedPlatformFee} • Pay Only on Verified Join
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {EMPLOYER_COMMERCIAL_POLICY.replacementGuaranteeDetail}
            </p>
            <div className="p-4 rounded-md bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 space-y-1">
              <div className="font-bold">{EMPLOYER_COMMERCIAL_POLICY.replacementGuaranteeHeadline}</div>
              <p className="leading-relaxed">
                If a hired candidate leaves within 60 calendar days of joining, PlacementConnect provides a priority replacement candidate at zero additional fee or issues a 100% credit note toward your next hire.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-md border border-slate-200/90 p-7 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#1E40AF]">
              <CalendarCheck2 className="h-4 w-4" />
              Included Recruiter Capabilities
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
        </div>
      </div>
    </div>
  );
}
