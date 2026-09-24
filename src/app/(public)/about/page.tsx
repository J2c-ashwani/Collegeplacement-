import Link from 'next/link';
import {
  Building2,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Scale,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { COMPANY_IDENTITY } from '@/config/company-identity';
import { SAFE_TERMINOLOGY, FOUR_DENOMINATOR_MODEL } from '@/config/brand-system';
import { GOVERNANCE_MOAT_MECHANICS } from '@/config/commercial-policy';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-14">
        {/* Header */}
        <div className="space-y-4 border-b border-slate-200 pb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-[#1E40AF]">
            About PlacementConnect • {COMPANY_IDENTITY.jurisdiction}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Rebuilding Campus Placement Around Verifiable Readiness and Clear Outcomes
          </h1>
          <p className="text-base text-slate-600 max-w-3xl leading-relaxed">
            {COMPANY_IDENTITY.operatingModelDisclosure}
          </p>
        </div>

        {/* Why PlacementConnect Exists */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-md border border-slate-200/90 p-6 space-y-2.5">
            <div className="text-xs font-semibold text-[#1E40AF]">
              For Colleges &amp; TPOs
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Eliminating Spreadsheet Chaos &amp; Ambiguous Reporting
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Training &amp; Placement Officers spend months reconciling manual attendance lists, unverified resumes, and inconsistent placement denominators during institutional accreditation audits.
            </p>
          </div>
          <div className="bg-white rounded-md border border-slate-200/90 p-6 space-y-2.5">
            <div className="text-xs font-semibold text-emerald-800">
              For Corporate Employers
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Replacing Resume Noise with Standardized Evaluation
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Corporate Talent Acquisition teams receive thousands of identical graduate resumes with no standardized measure of analytical reasoning, communication clarity, or workplace readiness.
            </p>
          </div>
          <div className="bg-white rounded-md border border-slate-200/90 p-6 space-y-2.5">
            <div className="text-xs font-semibold text-slate-700">
              For Graduating Students
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Expanding Verified Interview Access Across Campuses
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Capable graduates across regional and autonomous institutions gain a portable, verifiable evaluation scorecard backed by guaranteed corporate interview opportunities.
            </p>
          </div>
        </div>

        {/* Two Core Institutional Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-md border border-slate-200/90 p-7 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#1E40AF]">
              <BarChart3 className="h-4 w-4" />
              {SAFE_TERMINOLOGY.institutionalGovernanceName}
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Four-Level Institutional Placement Reporting
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Instead of a single ambiguous placement percentage, PlacementConnect tracks four concurrent denominators—Total Graduating Batch, Registered for Placement, Programme Enrolled, and Assessed &amp; Eligible—with complete audit lineage.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              {FOUR_DENOMINATOR_MODEL.map((d) => (
                <div key={d.id} className="p-3.5 rounded-md border border-slate-200 bg-slate-50/70">
                  <div className="text-[11px] text-slate-500">{d.code}</div>
                  <div className="text-xs font-bold text-slate-900 mt-0.5">{d.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-md border border-slate-200/90 p-7 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
              <Scale className="h-4 w-4" />
              {GOVERNANCE_MOAT_MECHANICS.liquidityGuardrailLabel}
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Confirmed Interview Capacity &amp; Student Protection
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {GOVERNANCE_MOAT_MECHANICS.liquidityGuardrailExplanation}
            </p>
            <ul className="space-y-2.5 pt-2 text-xs text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>3-Interview Progress Tracking:</strong> Every eligible student is tracked from 0/3 through 3/3 completed corporate interviews.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>100% Base Fee Refund Guarantee:</strong> Full refund of the ₹1,000 or ₹2,500 base programme fee if 3 verified interviews are not facilitated within 12 months.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Company Identity & Operations Contact */}
        <div className="bg-white rounded-md border border-slate-200/90 p-7 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <Building2 className="h-4 w-4 text-blue-700" />
            Operator Identity &amp; Sample Workspace Disclosure
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            {COMPANY_IDENTITY.legalUnitName}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {COMPANY_IDENTITY.pilotTransparencyNote}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
            <div>
              <span className="text-slate-500 block text-[11px] font-medium">
                Institutional Partnerships
              </span>
              <a
                href={`mailto:${COMPANY_IDENTITY.desks.institutionalPartnerships.email}`}
                className="font-mono font-bold text-blue-700 hover:underline"
              >
                {COMPANY_IDENTITY.desks.institutionalPartnerships.email}
              </a>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px] font-medium">
                Corporate Employers Desk
              </span>
              <a
                href={`mailto:${COMPANY_IDENTITY.desks.employerAlliances.email}`}
                className="font-mono font-bold text-blue-700 hover:underline"
              >
                {COMPANY_IDENTITY.desks.employerAlliances.email}
              </a>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px] font-medium">
                Privacy &amp; Grievance Officer
              </span>
              <a
                href={`mailto:${COMPANY_IDENTITY.desks.privacyAndGrievance.email}`}
                className="font-mono font-bold text-blue-700 hover:underline"
              >
                {COMPANY_IDENTITY.desks.privacyAndGrievance.email}
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <Button asChild className="bg-[#1E40AF] hover:bg-blue-900 text-white">
            <Link href="/contact">
              Schedule Institutional Discussion
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <div className="flex items-center gap-5 text-xs font-semibold text-slate-600">
            <Link href="/security" className="hover:text-blue-700">
              Security &amp; Data Isolation &rarr;
            </Link>
            <Link href="/verify" className="hover:text-blue-700">
              Verify a Credential &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
