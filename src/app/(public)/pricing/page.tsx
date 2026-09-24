import Link from 'next/link';
import {
  Building2,
  Briefcase,
  GraduationCap,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  INSTITUTION_COMMERCIAL_PLAN,
  STUDENT_PROGRAMME_PLANS,
  EMPLOYER_COMMERCIAL_POLICY,
  GST_POLICY,
} from '@/config/commercial-policy';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header: Simple Commercial Decision */}
        <div className="space-y-4 border-b border-slate-200 pb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-[#1E40AF]">
            Commercial Pricing Schedule (INR + 18% GST)
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Simple, Transparent Pricing for Colleges, Employers, and Students
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            {GST_POLICY.legalNote}
          </p>
        </div>

        {/* 3-Column Commercial Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Column 1: Institutions */}
          <div className="bg-white rounded-md border border-slate-200/90 p-7 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#1E40AF]">
                  For Colleges &amp; Universities
                </span>
                <Building2 className="h-5 w-5 text-[#1E40AF]" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                {INSTITUTION_COMMERCIAL_PLAN.name}
              </h2>
              <div>
                <div className="text-3xl font-mono font-bold text-slate-900">
                  {INSTITUTION_COMMERCIAL_PLAN.formattedBase}
                  <span className="text-sm font-normal text-slate-500"> / year</span>
                </div>
                <div className="text-xs font-mono text-slate-500 mt-1">
                  + {INSTITUTION_COMMERCIAL_PLAN.formattedGst} ={' '}
                  <strong className="text-slate-800">
                    {INSTITUTION_COMMERCIAL_PLAN.formattedTotal}
                  </strong>
                </div>
              </div>
              <div className="p-3.5 rounded-md bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 font-medium leading-relaxed">
                {INSTITUTION_COMMERCIAL_PLAN.pilotWaiverNote}
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600">
                {INSTITUTION_COMMERCIAL_PLAN.deliverables.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-[#1E40AF] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button asChild className="w-full h-11 bg-[#1E40AF] hover:bg-blue-900 text-white font-semibold">
              <Link href="/contact">
                Request Institutional MoU
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Column 2: Corporate Employers */}
          <div className="bg-white rounded-md border border-emerald-300 p-7 sm:p-8 flex flex-col justify-between space-y-6 shadow-2xs">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-800">
                  For Corporate Employers
                </span>
                <Briefcase className="h-5 w-5 text-emerald-700" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                {EMPLOYER_COMMERCIAL_POLICY.name}
              </h2>
              <div>
                <div className="text-3xl font-mono font-bold text-emerald-700">₹0</div>
                <div className="text-xs text-slate-600 mt-1">
                  Platform Subscription Fee •{' '}
                  <strong className="font-mono text-slate-800">₹10,000 + 18% GST</strong> per verified join
                </div>
              </div>
              <div className="p-3.5 rounded-md bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 font-medium leading-relaxed">
                Includes our {EMPLOYER_COMMERCIAL_POLICY.replacementGuaranteeHeadline}.
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600">
                {EMPLOYER_COMMERCIAL_POLICY.deliverables.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button asChild className="w-full h-11 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold">
              <Link href="/register">
                Create Corporate Recruiter Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Column 3: Graduating Students */}
          <div className="bg-white rounded-md border border-slate-200/90 p-7 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">
                  For Graduating Students
                </span>
                <GraduationCap className="h-5 w-5 text-slate-800" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Graduate Assessment &amp; Interview Tracks
              </h2>
              <div className="space-y-2.5">
                {STUDENT_PROGRAMME_PLANS.map((p) => (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-md border border-slate-200 bg-slate-50/70 space-y-1"
                  >
                    <div className="text-xs font-bold text-slate-900">{p.name}</div>
                    <div className="font-mono text-lg font-bold text-[#1E40AF]">
                      {p.formattedBase}{' '}
                      <span className="text-xs font-normal text-slate-500">
                        ({p.formattedTotal} incl. 18% GST)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600">
                {STUDENT_PROGRAMME_PLANS[0].deliverables.slice(0, 4).map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-blue-700 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button asChild variant="outline" className="w-full h-11 border-slate-300 font-semibold bg-white">
              <Link href="/for-students">
                Enter College Code to Enroll
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
