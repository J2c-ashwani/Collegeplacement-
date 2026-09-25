import Link from 'next/link';
import {
  Building2,
  Briefcase,
  GraduationCap,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Compass,
  Users,
  Network,
  Scale,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { COMPANY_IDENTITY } from '@/config/company-identity';

const THREE_PARTICIPANTS = [
  {
    role: '1. Partner Institutions',
    subtitle: 'Colleges, Universities & TPOs',
    icon: Building2,
    accentColor: 'text-[#1E40AF]',
    badgeBg: 'bg-blue-50 text-[#1E40AF] border-blue-200',
    contributes:
      'Verified graduating student rosters, official academic records (CGPA, branch, active backlog status), and campus drive governance.',
    receives:
      'A dedicated placement workspace to manage student readiness, coordinate employer interviews, and generate structured four-stage cohort reports.',
  },
  {
    role: '2. Graduating Students',
    subtitle: 'Final-Year Campus Cohorts',
    icon: GraduationCap,
    accentColor: 'text-slate-900',
    badgeBg: 'bg-slate-100 text-slate-800 border-slate-300',
    contributes:
      'Completion of the standardized 9-Area Job-Readiness Assessment and verified institutional enrollment credentials.',
    receives:
      'A shareable digital readiness scorecard (with a unique verification ID) and 3 tracked corporate interview opportunities within 12 months of assessment completion.',
  },
  {
    role: '3. Corporate Employers',
    subtitle: 'Talent Acquisition & Hiring Teams',
    icon: Briefcase,
    accentColor: 'text-emerald-800',
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    contributes:
      'Defined fresher role criteria, degree and skill thresholds, and structured first-round corporate interview slots.',
    receives:
      'Institution-verified, pre-assessed candidate shortlists and coordinated single-college or multi-campus interview workflows.',
  },
] as const;

const OPERATING_PRINCIPLES = [
  {
    num: '01',
    title: 'Verification Before Matching',
    description:
      'Every student profile in our network is anchored to a participating college’s verified Campus Code and official batch roster before it is ever presented to an employer.',
  },
  {
    num: '02',
    title: 'Readiness Before Interview',
    description:
      'Students complete our 9-Area Job-Readiness Assessment first so hiring teams can evaluate demonstrated analytical, technical, and workplace readiness alongside academic grades.',
  },
  {
    num: '03',
    title: 'Capacity Before Cohort Expansion',
    description:
      'We do not expand student intake without sufficient confirmed employer interview capacity in our hiring pipeline (maintaining at least a 1.20× capacity reserve) so we can honor every 3-interview commitment.',
  },
  {
    num: '04',
    title: 'Evidence Before Outcome Claims',
    description:
      'We never publish ambiguous or inflated single-number placement claims. Cohort progress is reported across four explicit stages, and every student scorecard can be verified online via its Credential ID.',
  },
] as const;

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 text-slate-900">
      <div className="max-w-5xl mx-auto space-y-14">
        {/* 1. Hero: Who We Are */}
        <section className="space-y-4 border-b border-slate-200 pb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-[#1E40AF]">
            About PlacementConnect • {COMPANY_IDENTITY.jurisdiction}
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            Building a More Verifiable Campus Placement System
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
            PlacementConnect connects colleges, graduating students, and corporate employers through structured placement operations, readiness assessment, and verified hiring workflows. We are building the operating infrastructure colleges use to manage graduating cohorts, give students clearer pathways to corporate interviews, and help hiring teams evaluate fresher talent on verified readiness rather than resumes alone.
          </p>
        </section>

        {/* 2. Why We Built PlacementConnect & Our Mission */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Why We Built PlacementConnect */}
          <div className="bg-white rounded-md border border-slate-200/90 p-7 sm:p-8 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1E40AF]">
                <Compass className="h-4 w-4" />
                Why We Exist
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Why We Built PlacementConnect
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Across hundreds of engineering, management, and degree institutions in India, campus placement still depends heavily on spreadsheets, scattered WhatsApp groups, unverified PDF resumes, and inconsistent outcome records.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-600 pt-1">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-[#1E40AF] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-900">Colleges &amp; TPOs</strong> spend months manually reconciling student eligibility lists, drive attendance, and placement denominators.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-[#1E40AF] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-900">Graduating students</strong> outside a handful of tier-1 campuses struggle to access structured corporate interviews even when they have strong fundamentals.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-[#1E40AF] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-900">Corporate hiring teams</strong> receive thousands of nearly identical fresher resumes with no trustworthy baseline of analytical, technical, or workplace readiness.
                  </span>
                </li>
              </ul>
            </div>
            <p className="text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded p-3.5">
              We founded PlacementConnect to give all three sides of campus hiring a single, shared system built on verified institutional data and structured readiness evaluation.
            </p>
          </div>

          {/* Our Mission */}
          <div className="bg-white rounded-md border border-slate-200/90 p-7 sm:p-8 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800">
                <ShieldCheck className="h-4 w-4 text-emerald-700" />
                Our Mission
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                What PlacementConnect Is Working Toward
              </h2>
              <p className="text-sm text-slate-800 font-medium leading-relaxed bg-blue-50/50 border border-blue-200/80 rounded p-4">
                Make graduate hiring in India more structured, verifiable, and accessible—by giving colleges better placement infrastructure, students clearer pathways to interviews, and employers better evidence of candidate readiness.
              </p>
              <div className="space-y-3 pt-1 text-xs text-slate-600 leading-relaxed">
                <div>
                  <strong className="text-slate-900 block">For Higher Education Institutions:</strong>
                  Replace ad-hoc spreadsheets with a structured placement workspace and clear, four-stage cohort reporting designed to support internal governance and NAAC/NIRF documentation workflows.
                </div>
                <div>
                  <strong className="text-slate-900 block">For Graduating Cohorts:</strong>
                  Provide a credible 9-area employability evaluation, a verifiable readiness scorecard, and a tracked commitment of 3 corporate interview opportunities.
                </div>
                <div>
                  <strong className="text-slate-900 block">For Graduate Hiring Teams:</strong>
                  Deliver pre-assessed, institution-verified shortlists so recruiters spend time interviewing qualified candidates rather than filtering raw resumes.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. One Network. Three Participants. */}
        <section className="bg-white rounded-md border border-slate-200/90 p-7 sm:p-8 space-y-6">
          <div className="space-y-1.5 border-b border-slate-200 pb-5">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1E40AF]">
              <Network className="h-4 w-4" />
              How the Ecosystem Works Together
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              One Network. Three Participants.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              PlacementConnect is not an open job board where anyone can upload an unverified resume. The platform works because each participant contributes a specific layer of verification that makes the ecosystem valuable for the other two:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {THREE_PARTICIPANTS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.role}
                  className="p-5 rounded-md border border-slate-200 bg-slate-50/70 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded border ${item.badgeBg}`}
                      >
                        {item.role}
                      </span>
                      <Icon className={`h-4 w-4 ${item.accentColor}`} />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{item.subtitle}</h3>
                    <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
                      <div>
                        <span className="font-semibold text-slate-900 block">
                          What they bring:
                        </span>
                        {item.contributes}
                      </div>
                      <div className="pt-1 border-t border-slate-200/80">
                        <span className="font-semibold text-[#1E40AF] block">
                          What they receive:
                        </span>
                        {item.receives}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. Principles We Operate By */}
        <section className="space-y-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1E40AF]">
              <Scale className="h-4 w-4" />
              Operating Philosophy
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Principles We Operate By
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              Every product decision, college partnership, and student commitment at PlacementConnect is governed by four operational rules:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {OPERATING_PRINCIPLES.map((principle) => (
              <div
                key={principle.num}
                className="bg-white rounded-md border border-slate-200/90 p-6 space-y-2.5"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-[#1E40AF] border border-blue-200">
                    Principle {principle.num}
                  </span>
                  <h3 className="text-base font-bold text-slate-900">{principle.title}</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {principle.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Who Is Building It & Where We Are Today */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Who Is Building PlacementConnect */}
          <div className="bg-white rounded-md border border-slate-200/90 p-7 sm:p-8 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1E40AF]">
                <Users className="h-4 w-4" />
                Company &amp; Leadership
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Who Is Building PlacementConnect
              </h2>
              <div className="p-4 rounded-md bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">
                    {COMPANY_IDENTITY.founderName}
                  </span>
                  <span className="text-[11px] font-semibold text-[#1E40AF] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                    {COMPANY_IDENTITY.founderRole}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Leading institutional partnerships, product architecture, and assessment governance at {COMPANY_IDENTITY.legalUnitName} ({COMPANY_IDENTITY.jurisdiction}).
                </p>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                PlacementConnect is built by an India-based product and institutional operations team working directly with Training &amp; Placement Officers, college Principals, and corporate Talent Acquisition teams. Rather than operating as an anonymous job portal, every institutional MoU, student cohort onboarding, and employer hiring drive is directly managed and supported by our operations desk in New Delhi / NCR.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 text-xs text-slate-600">
              <strong className="text-slate-900">Direct Accountability:</strong> Institutions and employers sign formal partnership agreements with{' '}
              <span className="font-semibold text-slate-900">{COMPANY_IDENTITY.legalUnitName}</span>{' '}
              with named relationship support and SLA-backed operational channels.
            </div>
          </div>

          {/* Where We Are Today */}
          <div className="bg-white rounded-md border border-slate-200/90 p-7 sm:p-8 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800">
                <Building2 className="h-4 w-4 text-emerald-700" />
                Our Current Stage
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Where We Are Today
              </h2>
              <p className="text-sm font-medium text-slate-800 leading-relaxed">
                {COMPANY_IDENTITY.currentStageDisclosure}
              </p>
              <ul className="space-y-2.5 text-xs text-slate-600 pt-1 leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-900">Live Institutional &amp; Assessment Platform:</strong>{' '}
                    Our TPO cohort workspace, 9-area student assessment engine, and public credential verification registry (<Link href="/verify" className="text-[#1E40AF] underline font-medium">/verify</Link>) are live and operational.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-900">Founding Partner Onboarding:</strong>{' '}
                    We are onboarding partner colleges (under our 1-Year Annual and 5-Year Multi-Cohort MoU options) alongside corporate fresher hiring teams across software, analytics, business, and operations roles.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-900">Transparent Public Previews:</strong>{' '}
                    {COMPANY_IDENTITY.pilotTransparencyNote}
                  </span>
                </li>
              </ul>
            </div>
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs font-semibold text-[#1E40AF]">
              <Link href={`/verify/${COMPANY_IDENTITY.sampleCredentials.validStudentId}`} className="hover:underline">
                Inspect Sample Candidate Scorecard →
              </Link>
              <Link href="/security" className="hover:underline">
                Security &amp; Data Isolation →
              </Link>
            </div>
          </div>
        </section>

        {/* 6. Trust, Accountability & Operational Desks */}
        <section className="bg-white rounded-md border border-slate-200/90 p-7 sm:p-8 space-y-5">
          <div className="space-y-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Trust, Governance &amp; Direct Contact Channels
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {COMPANY_IDENTITY.legalUnitName}
            </h2>
            <p className="text-xs text-slate-600">
              Operating Jurisdiction: {COMPANY_IDENTITY.jurisdiction} • Institutional Data Isolation &amp; DPDP Act Compliance
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-slate-100 text-xs">
            <div className="p-3.5 rounded bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-500 block text-[11px] font-medium">
                Institutional Partnerships (TPO / Principal)
              </span>
              <a
                href={`mailto:${COMPANY_IDENTITY.desks.institutionalPartnerships.email}`}
                className="font-mono font-bold text-[#1E40AF] hover:underline block"
              >
                {COMPANY_IDENTITY.desks.institutionalPartnerships.email}
              </a>
              <span className="text-[11px] text-slate-500 block">1 Business Day Response</span>
            </div>

            <div className="p-3.5 rounded bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-500 block text-[11px] font-medium">
                Corporate Employers &amp; Hiring Desk
              </span>
              <a
                href={`mailto:${COMPANY_IDENTITY.desks.employerAlliances.email}`}
                className="font-mono font-bold text-[#1E40AF] hover:underline block"
              >
                {COMPANY_IDENTITY.desks.employerAlliances.email}
              </a>
              <span className="text-[11px] text-slate-500 block">1 Business Day Response</span>
            </div>

            <div className="p-3.5 rounded bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-500 block text-[11px] font-medium">
                Student Assessment &amp; Assurance Support
              </span>
              <a
                href={`mailto:${COMPANY_IDENTITY.desks.studentSupport.email}`}
                className="font-mono font-bold text-[#1E40AF] hover:underline block"
              >
                {COMPANY_IDENTITY.desks.studentSupport.email}
              </a>
              <span className="text-[11px] text-slate-500 block">24-Hour Ticket Resolution</span>
            </div>

            <div className="p-3.5 rounded bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-500 block text-[11px] font-medium">
                Privacy &amp; Grievance Officer
              </span>
              <a
                href={`mailto:${COMPANY_IDENTITY.desks.privacyAndGrievance.email}`}
                className="font-mono font-bold text-[#1E40AF] hover:underline block"
              >
                {COMPANY_IDENTITY.desks.privacyAndGrievance.email}
              </a>
              <span className="text-[11px] text-slate-500 block">24h Acknowledge / 7-Day SLA</span>
            </div>
          </div>
        </section>

        {/* 7. Prominent Bottom Business CTA: Want to Work with PlacementConnect? */}
        <section className="rounded-lg border-2 border-[#1E40AF] bg-white p-7 sm:p-9 space-y-6">
          <div className="space-y-2 max-w-3xl">
            <div className="text-xs font-bold uppercase tracking-wider text-[#1E40AF]">
              Partner With PlacementConnect
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Want to Work with PlacementConnect?
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Whether you lead campus placements at a college, recruit entry-level graduates for your team, or are preparing for your final-year placement season, choose your path below:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-md bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4">
              <div className="space-y-1">
                <div className="text-xs font-bold uppercase text-[#1E40AF]">For Institutions</div>
                <div className="text-base font-bold text-slate-900">Colleges, Universities &amp; TPOs</div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Onboard your graduating batch with our TPO placement workspace and 4-stage cohort reporting.
                </p>
              </div>
              <Button asChild className="w-full bg-[#1E40AF] hover:bg-blue-900 text-white font-semibold">
                <Link href="/contact">
                  Request Institutional Partnership
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="p-5 rounded-md bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4">
              <div className="space-y-1">
                <div className="text-xs font-bold uppercase text-emerald-800">For Employers</div>
                <div className="text-base font-bold text-slate-900">Corporate HR &amp; Hiring Teams</div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Share your fresher role requirements and receive pre-assessed, institution-verified candidate shortlists.
                </p>
              </div>
              <Button asChild className="w-full bg-[#1E40AF] hover:bg-blue-900 text-white font-semibold">
                <Link href="/contact">
                  Discuss Hiring Requirements
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="p-5 rounded-md bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4">
              <div className="space-y-1">
                <div className="text-xs font-bold uppercase text-slate-700">For Students</div>
                <div className="text-base font-bold text-slate-900">Final-Year Graduating Students</div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Complete the 9-Area Job-Readiness Assessment and access 3 tracked corporate interview opportunities.
                </p>
              </div>
              <Button asChild variant="outline" className="w-full border-slate-300 font-semibold bg-white">
                <Link href="/for-students">
                  Explore Student Programme
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
