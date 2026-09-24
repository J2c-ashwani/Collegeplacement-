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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  STUDENT_PROGRAMME_PLANS,
  GOVERNANCE_MOAT_MECHANICS,
} from '@/config/commercial-policy';
import { SAFE_TERMINOLOGY } from '@/config/brand-system';
import { COMPANY_IDENTITY } from '@/config/company-identity';

export default function ForStudentsPage() {
  const router = useRouter();
  const [collegeCode, setCollegeCode] = useState('APX123');

  const handleLookupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = collegeCode.trim().toUpperCase() || 'APX123';
    router.push(`/register/${encodeURIComponent(cleaned)}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Hero + Dominant Visual Idea: Campus Code Onboarding -> Assessment -> 3 Interviews */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center border-b border-slate-200 pb-14">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-[#1E40AF]">
              For Final-Year Graduating Students (Engineering, Management &amp; Degree Cohorts)
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
              Assessment, Digitally Verifiable Credential, and 3-Interview Placement Assurance
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Stand out beyond standard resumes. Complete the{' '}
              <strong className="font-semibold text-slate-900">
                {SAFE_TERMINOLOGY.assessmentFrameworkName}
              </strong>
              , share a verifiable credential badge on your LinkedIn profile, and access at least 3 verified corporate interviews—backed by a 100% base fee refund guarantee.
            </p>
          </div>

          {/* Focal Interactive Campus Code Lookup Card */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-lg border border-slate-300 shadow-xs p-6 sm:p-7 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#1E40AF]">
                  <QrCode className="h-4 w-4" />
                  Official Campus Onboarding
                </div>
                <span className="text-[11px] font-medium px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Batch 2026 Active
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900">
                Enter Your College Onboarding Code
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Enter the 6-character code provided by your Training &amp; Placement Office (or test with our sample campus code <span className="font-mono font-bold text-slate-900">APX123</span>):
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
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Sample Credential: <span className="font-mono">{COMPANY_IDENTITY.sampleCredentials.validStudentId}</span></span>
                <Link
                  href={`/verify/${COMPANY_IDENTITY.sampleCredentials.validStudentId}`}
                  className="font-semibold text-[#1E40AF] hover:underline inline-flex items-center gap-1"
                >
                  View Sample Scorecard
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Two Student Programme Tracks */}
        <section className="space-y-6">
          <div className="space-y-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#1E40AF]">
              Student Programme Options
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Choose Your Graduate Evaluation &amp; Interview Assurance Track
            </h2>
            <p className="text-sm text-slate-600">
              Both tracks include the 9-Dimension Employability Evaluation, a verifiable LinkedIn credential, and the 12-month 3-Interview Assurance commitment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {STUDENT_PROGRAMME_PLANS.map((plan) => (
              <div
                key={plan.id}
                className="bg-white rounded-md border border-slate-200/90 p-7 sm:p-8 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-50 text-[#1E40AF] border border-blue-200">
                      {plan.badge}
                    </span>
                    <span className="text-xs text-slate-500">
                      Up to <strong className="font-mono text-slate-900">{plan.interviewQuota}</strong> Qualified Interviews (Subject to Eligibility)
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-mono font-bold text-slate-900">
                      {plan.formattedBase}
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      {plan.formattedGst} = <strong className="text-slate-800">{plan.formattedTotal}</strong>
                    </span>
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-600 pt-2">
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
                      Register with Campus Code (Sample: APX123)
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Clear Eligibility & Merit Disclosure */}
        <div className="bg-white rounded-md border border-slate-200/90 p-7 sm:p-8 space-y-3">
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
