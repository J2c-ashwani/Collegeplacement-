import Link from 'next/link';
import {
  CheckCircle2,
  ArrowRight,
  CalendarCheck2,
  FileCheck2,
  ShieldCheck,
  Users,
  SlidersHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NINE_DIMENSIONS_SPEC } from '@/config/brand-system';
import { EMPLOYER_COMMERCIAL_POLICY } from '@/config/commercial-policy';
import { COMPANY_IDENTITY } from '@/config/company-identity';

const CANDIDATE_SUPPLY_POOLS = [
  {
    pool: 'Software Engineering, QA & Technical Cohorts',
    degrees: 'B.Tech / B.E. (CS, IT, ECE, EE), MCA, BCA, B.Sc (CS / IT)',
    roles: 'Backend / Full-Stack Trainees, QA Automation, Cloud / DevOps, Technical Support',
  },
  {
    pool: 'B2B Sales, Revenue & Client Growth Cohorts',
    degrees: 'BBA, MBA / PGDM, B.Com, and Engineering Graduates opting for commercial tracks',
    roles: 'Business Development Executive (BDE), Inside Sales, Account Management, Customer Success',
  },
  {
    pool: 'Data Analytics, BI & MIS Operations Cohorts',
    degrees: 'B.Tech (All Streams), B.Sc (Stats / Math / Economics), BBA, B.Com, MBA',
    roles: 'Junior Data Analyst, BI & Reporting Associate, MIS Executive, Process & Supply Chain Analyst',
  },
  {
    pool: 'Product Operations, Finance & Management Trainee Cohorts',
    degrees: 'MBA / PGDM, B.Com (Hons), BBA, B.Tech',
    roles: 'Associate Product Operations, Financial Analyst Trainee, HR & Talent Ops, Founder’s Office Trainee',
  },
] as const;

const ROLE_THRESHOLD_EXAMPLES = [
  {
    role: 'Backend / Software Developer Trainee',
    thresholds: 'Technical ≥ 70  •  Analytical ≥ 65  •  Communication ≥ 55',
    rationale: 'Prioritizes coding/systems foundations and problem-solving speed.',
  },
  {
    role: 'B2B Sales & Client Growth Associate',
    thresholds: 'Communication ≥ 70  •  Behavioral ≥ 65  •  Reliability ≥ 65',
    rationale: 'Prioritizes articulation, objection handling, and target ownership.',
  },
  {
    role: 'Data, MIS & Operations Analyst',
    thresholds: 'Quantitative ≥ 70  •  Analytical ≥ 65  •  Role Execution ≥ 60',
    rationale: 'Prioritizes numerical accuracy, structured logic, and deadline reliability.',
  },
] as const;

export default function ForEmployersPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 text-slate-900">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Hero: Talent Quality -> Screening -> Shortlist -> Interviews -> Hiring */}
        <div className="space-y-5 border-b border-slate-200 pb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-900">
            For Corporate Talent Acquisition, HR Heads &amp; University Relations Teams
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 max-w-4xl leading-tight">
            Structured Graduate Hiring: Pre-Assessed Shortlists, Coordinated Interviews, Zero Platform Fee
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
            Replace high-volume resume screening with verified competency data. Give us your fresher role, location, and eligibility criteria—we deliver institution-verified, pre-assessed candidate shortlists across our{' '}
            <strong className="font-semibold text-slate-900">9 Competency Areas</strong>, coordinate interview panels in one workspace, and charge{' '}
            <strong className="font-semibold text-slate-900">₹0 platform fee</strong> until a selected candidate formally joins your team.
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
                Inspect Sample Candidate Scorecard (82/100)
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
                detail:
                  'Academic CGPA, active backlog status, and graduation batch verified directly against official college records.',
              },
              {
                step: '02 / Screening',
                title: '9-Competency Thresholds',
                detail:
                  'Set role-specific minimum score cutoffs across analytical, technical, communication, and execution areas.',
              },
              {
                step: '03 / Shortlist',
                title: 'Ranked Candidate Matches',
                detail:
                  'Receive ranked shortlists combining academic eligibility, role-fit competency scores, and joining readiness.',
              },
              {
                step: '04 / Interviews',
                title: 'Coordinated Drive Panels',
                detail:
                  'Coordinate campus and multi-campus pooled interviews without managing scattered spreadsheets and email threads.',
              },
              {
                step: '05 / Hiring',
                title: 'Pay Only on Joining',
                detail:
                  '₹0 upfront fee; ₹10,000 + GST applies only after onboarding, protected by a 60-day replacement guarantee.',
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

        {/* NEW SECTION: Candidate Supply Pools + Actionable Role-Specific Thresholds & Ranking Logic */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left 6 Cols: Candidate Supply & Pooled Drive Sourcing */}
          <div className="lg:col-span-6 bg-white rounded-lg border border-slate-200/90 p-7 space-y-5">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#1E40AF]">
                <Users className="h-4 w-4" />
                Candidate Supply &amp; Multi-Campus Sourcing
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                How We Fill Your Roles: Single-Campus or Multi-Campus Pooled Drives
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Whether you need 3 software trainees in Bengaluru or 15 B2B sales associates across Delhi NCR, Pune, and Mumbai, you submit one hiring requirement and PlacementConnect aggregates eligible, pre-assessed candidates across partner institutions:
              </p>
            </div>

            <div className="space-y-3">
              {CANDIDATE_SUPPLY_POOLS.map((item) => (
                <div
                  key={item.pool}
                  className="p-3.5 rounded-md bg-slate-50 border border-slate-200 space-y-1"
                >
                  <div className="text-xs font-bold text-slate-900">{item.pool}</div>
                  <div className="text-[11px] text-slate-600">
                    <strong className="text-slate-800">Eligible Streams:</strong> {item.degrees}
                  </div>
                  <div className="text-[11px] text-slate-600">
                    <strong className="text-slate-800">Common Roles Filled:</strong> {item.roles}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right 6 Cols: What 82/100 Means & How Role-Specific Thresholds Rank Shortlists */}
          <div className="lg:col-span-6 bg-white rounded-lg border border-slate-200/90 p-7 space-y-5">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-800">
                <SlidersHorizontal className="h-4 w-4" />
                Actionable Score Thresholds &amp; Ranking Logic
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                How to Interpret the 0–100 Score &amp; Set Role Thresholds
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Instead of a black-box &ldquo;AI score,&rdquo; recruiters set minimum thresholds by competency area. <strong>Candidate ranking</strong> combines: (1) institution-verified academic cutoffs, (2) your role-weighted competency scores, and (3) confirmed location/joining readiness.
              </p>
            </div>

            {/* Score Benchmark Tiers */}
            <div className="grid grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 rounded bg-emerald-50 border border-emerald-200">
                <span className="font-mono font-bold text-emerald-900 block">80 – 100</span>
                <span className="text-[11px] text-emerald-950 font-semibold">Top-Tier Readiness</span>
                <p className="text-[10px] text-emerald-800 mt-0.5">Fast-track for technical &amp; high-ownership roles</p>
              </div>
              <div className="p-3 rounded bg-blue-50 border border-blue-200">
                <span className="font-mono font-bold text-[#1E40AF] block">65 – 79</span>
                <span className="text-[11px] text-slate-900 font-semibold">Qualified Role-Fit</span>
                <p className="text-[10px] text-slate-600 mt-0.5">Meets standard graduate hiring bar across core areas</p>
              </div>
              <div className="p-3 rounded bg-slate-50 border border-slate-200">
                <span className="font-mono font-bold text-slate-700 block">Below 65</span>
                <span className="text-[11px] text-slate-800 font-semibold">Developing Tier</span>
                <p className="text-[10px] text-slate-500 mt-0.5">Routed to guided preparation &amp; re-assessment</p>
              </div>
            </div>

            {/* Concrete Role-Specific Threshold Examples */}
            <div className="space-y-2.5">
              <div className="text-xs font-bold text-slate-800">
                Example Role-Specific Shortlist Cutoffs:
              </div>
              {ROLE_THRESHOLD_EXAMPLES.map((ex) => (
                <div
                  key={ex.role}
                  className="p-3 rounded-md bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900">{ex.role}</div>
                    <div className="text-[11px] text-slate-500">{ex.rationale}</div>
                  </div>
                  <span className="font-mono text-[11px] font-semibold px-2.5 py-1 rounded bg-white border border-slate-200 text-[#1E40AF] shrink-0">
                    {ex.thresholds}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 9 Competency Areas Evaluation Grid */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div className="space-y-1">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#1E40AF]">
                Standardized Candidate Screening
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                What Every Pre-Assessed Candidate Scorecard Measures (9 Competency Areas • 0–100 Scale)
              </h2>
            </div>
            <span className="text-xs font-medium px-3 py-1 rounded bg-white border border-slate-200 text-slate-600">
              36-Item Timed Evaluation • Weights Total 100%
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
                If a hired candidate resigns or exits during probation within 60 calendar days of their official joining date, PlacementConnect provides a priority replacement candidate shortlist at zero additional fee or issues a 100% credit note toward your next hire under the Standard Hiring Agreement.
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
