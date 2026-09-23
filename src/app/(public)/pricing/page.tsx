import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Check } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Products, Services & Pricing (INR) - PlacementConnect',
  description:
    'Transparent INR pricing for PlacementConnect institutional memberships (₹15,000/year or ₹60,000 for 5-year Premium) and student programmes (₹1,000 Placement Assurance & ₹2,500 Placement Plus).',
};

export default function PricingPage() {
  return (
    <div className="bg-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            Official Catalogue • Pricing in INR (₹)
          </span>
          <h1 className="text-4xl font-extrabold text-slate-900 mt-4 mb-4">
            Products, Services &amp; Transparent INR Pricing
          </h1>
          <p className="text-lg text-slate-600">
            All institutional memberships and student programmes on PlacementConnect are billed in Indian Rupees (INR / ₹) with GST invoicing. Corporate hiring is <strong>100% free (₹0)</strong> for verified employers.
          </p>
        </div>

        {/* 1. Institutional Plans Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">
            1. For Colleges &amp; Universities (Institutional Memberships)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Tier 1: 1-Year Institutional Plan */}
            <div className="border border-slate-200 rounded-xl p-8 flex flex-col justify-between shadow-xs bg-white">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                  Annual Institutional Plan
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mt-2">
                  1-Year Campus Placement Membership
                </h3>
                <p className="text-sm text-slate-500 mt-2">
                  Complete TPO command center, campus hiring drive coordination, and verified corporate recruiter access for 1 academic year.
                </p>
                <div className="my-6 pb-6 border-b border-slate-100">
                  <span className="text-4xl font-extrabold text-slate-900">₹15,000</span>
                  <span className="text-sm text-slate-500"> / year + 18% GST (₹17,700 total)</span>
                  <p className="text-xs text-slate-500 mt-1">12-Month Institutional License</p>
                </div>
                <ul className="space-y-3 text-sm text-slate-700">
                  <li className="flex items-start gap-2"><Check className="h-4 w-4 text-indigo-600 mt-0.5 shrink-0" /> <span>Dedicated TPO Placement Command Center</span></li>
                  <li className="flex items-start gap-2"><Check className="h-4 w-4 text-indigo-600 mt-0.5 shrink-0" /> <span>Custom Institutional Registration Link &amp; QR Studio</span></li>
                  <li className="flex items-start gap-2"><Check className="h-4 w-4 text-indigo-600 mt-0.5 shrink-0" /> <span>Access to Verified Corporate Employer Drives</span></li>
                  <li className="flex items-start gap-2"><Check className="h-4 w-4 text-indigo-600 mt-0.5 shrink-0" /> <span>4-Denominator Placement Analytics &amp; Annual NAAC Report</span></li>
                </ul>
              </div>
              <div className="mt-8">
                <Link href="/register" className="block w-full text-center bg-slate-900 text-white py-3 rounded-md font-medium hover:bg-slate-800 transition">
                  Activate 1-Year Membership (₹15,000)
                </Link>
              </div>
            </div>

            {/* Tier 2: 5-Year Premium Institutional Plan */}
            <div className="border-2 border-indigo-600 rounded-xl p-8 flex flex-col justify-between shadow-md bg-white relative">
              <span className="absolute -top-3 right-6 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                Best Value • Save ₹15,000 (1 Year Free)
              </span>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                  5-Year NAAC Cycle Plan
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mt-2">
                  5-Year Premium Institutional Membership
                </h3>
                <p className="text-sm text-slate-500 mt-2">
                  Designed for full 5-year NAAC/NBA accreditation cycles with multi-batch historical tracking, priority corporate drives, and long-term MoU certification.
                </p>
                <div className="my-6 pb-6 border-b border-slate-100">
                  <span className="text-4xl font-extrabold text-slate-900">₹60,000</span>
                  <span className="text-sm text-slate-500"> / 5 years + 18% GST (₹70,800 total)</span>
                  <p className="text-xs text-emerald-700 font-semibold mt-1">
                    Effective cost: ₹12,000/year • Covers 5 Graduating Batches (60 Months)
                  </p>
                </div>
                <ul className="space-y-3 text-sm text-slate-700">
                  <li className="flex items-start gap-2"><Check className="h-4 w-4 text-indigo-600 mt-0.5 shrink-0" /> <span><strong>Everything in 1-Year Plan</strong> for 5 Continuous Academic Years</span></li>
                  <li className="flex items-start gap-2"><Check className="h-4 w-4 text-indigo-600 mt-0.5 shrink-0" /> <span><strong>5-Year Multi-Cohort NAAC Criterion 5.2.1 &amp; NIRF Evidence Vault</strong></span></li>
                  <li className="flex items-start gap-2"><Check className="h-4 w-4 text-indigo-600 mt-0.5 shrink-0" /> <span>Official 5-Year Industry-Academia MoU &amp; Certificate</span></li>
                  <li className="flex items-start gap-2"><Check className="h-4 w-4 text-indigo-600 mt-0.5 shrink-0" /> <span>Priority Allocation for Mega-Drives &amp; Dedicated Account Manager</span></li>
                </ul>
              </div>
              <div className="mt-8">
                <Link href="/register" className="block w-full text-center bg-indigo-600 text-white py-3 rounded-md font-medium hover:bg-indigo-700 transition">
                  Activate 5-Year Premium Plan (₹60,000)
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Student Programme Tiers (₹1,000 & ₹2,500) */}
        <div className="mb-16 pt-12 border-t border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">
            2. For Graduating Students (Career Readiness &amp; Placement Tracks)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Student Tier 1: Placement Assurance (₹1,000) */}
            <div className="border border-slate-200 rounded-xl p-8 flex flex-col justify-between shadow-xs bg-white">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                  Standard Student Track
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mt-2">
                  Placement Assurance Programme
                </h3>
                <p className="text-sm text-slate-500 mt-2">
                  Core career-readiness &amp; placement track with proctored assessment, 9-dimension verified scorecard, skill badges, and assured interview opportunities.
                </p>
                <div className="my-6 pb-6 border-b border-slate-100">
                  <span className="text-4xl font-extrabold text-slate-900">₹1,000</span>
                  <span className="text-sm text-slate-500"> / student + 18% GST (₹1,180 total)</span>
                  <p className="text-xs text-slate-500 mt-1">12-Month Programme Validity</p>
                </div>
                <ul className="space-y-3 text-sm text-slate-700">
                  <li className="flex items-start gap-2"><Check className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" /> <span>Proctored Core Assessment (Aptitude, Technical &amp; Communication)</span></li>
                  <li className="flex items-start gap-2"><Check className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" /> <span>9-Dimension Verified Readiness Scorecard &amp; QR Certificate</span></li>
                  <li className="flex items-start gap-2"><Check className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" /> <span>Minimum <strong>3 Assured Interview Opportunities</strong> with Partner Employers</span></li>
                  <li className="flex items-start gap-2"><Check className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" /> <span>Automated Digital Skill Badges &amp; Document Vault</span></li>
                </ul>
              </div>
              <div className="mt-8">
                <Link href="/register" className="block w-full text-center bg-slate-900 text-white py-3 rounded-md font-medium hover:bg-slate-800 transition">
                  Enroll in Placement Assurance (₹1,000)
                </Link>
              </div>
            </div>

            {/* Student Tier 2: Placement Plus (₹2,500) */}
            <div className="border-2 border-indigo-600 rounded-xl p-8 flex flex-col justify-between shadow-md bg-white relative">
              <span className="absolute -top-3 right-6 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                Most Popular • Priority Track
              </span>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                  Accelerated Student Track
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mt-2">
                  Placement Plus Programme
                </h3>
                <p className="text-sm text-slate-500 mt-2">
                  Accelerated premium student membership with 1-on-1 industry mentor mock interviews, priority employer shortlisting, and dedicated counsellor support.
                </p>
                <div className="my-6 pb-6 border-b border-slate-100">
                  <span className="text-4xl font-extrabold text-slate-900">₹2,500</span>
                  <span className="text-sm text-slate-500"> / student + 18% GST (₹2,950 total)</span>
                  <p className="text-xs text-emerald-700 font-semibold mt-1">
                    12-Month Priority Validity + 2 Assessment Retake Attempts
                  </p>
                </div>
                <ul className="space-y-3 text-sm text-slate-700">
                  <li className="flex items-start gap-2"><Check className="h-4 w-4 text-indigo-600 mt-0.5 shrink-0" /> <span><strong>Everything in Placement Assurance (₹1,000 tier)</strong></span></li>
                  <li className="flex items-start gap-2"><Check className="h-4 w-4 text-indigo-600 mt-0.5 shrink-0" /> <span><strong>2x 1-on-1 Mock Technical &amp; HR Interviews</strong> with Industry Mentors</span></li>
                  <li className="flex items-start gap-2"><Check className="h-4 w-4 text-indigo-600 mt-0.5 shrink-0" /> <span>Priority Profile Highlighting &amp; Shortlisting on Corporate Vacancies</span></li>
                  <li className="flex items-start gap-2"><Check className="h-4 w-4 text-indigo-600 mt-0.5 shrink-0" /> <span>Minimum <strong>5 Assured Interview Opportunities</strong> &amp; Dedicated Career Counsellor</span></li>
                </ul>
              </div>
              <div className="mt-8">
                <Link href="/register" className="block w-full text-center bg-indigo-600 text-white py-3 rounded-md font-medium hover:bg-indigo-700 transition">
                  Enroll in Placement Plus (₹2,500)
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Corporate Employers Section (100% FREE) */}
        <div className="max-w-5xl mx-auto pt-12 border-t border-slate-200">
          <div className="border border-emerald-200 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xs bg-emerald-50/30">
            <div className="max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                3. For Corporate Recruiters &amp; Hiring Partners
              </span>
              <h3 className="text-2xl font-bold text-slate-900 mt-2">
                Corporate Fresher Hiring Portal — ₹0 (100% Free Forever)
              </h3>
              <p className="text-sm text-slate-600 mt-2">
                Verified companies receive 100% free access to post fresher vacancies, screen pre-assessed candidates across 9 dimensions, and coordinate multi-college mega drives with zero job posting fees and zero recruitment commissions.
              </p>
            </div>
            <div className="shrink-0 text-center md:text-right">
              <div className="mb-3">
                <span className="text-4xl font-extrabold text-emerald-700">₹0</span>
                <span className="text-sm text-slate-600 block">Zero Commission • Free Forever</span>
              </div>
              <Link href="/register" className="inline-block bg-emerald-700 text-white px-6 py-3 rounded-md font-medium hover:bg-emerald-800 transition">
                Start Hiring for Free (₹0)
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center text-sm text-slate-500">
          Review our <Link href="/refund-policy" className="text-indigo-600 underline font-medium">Refunds &amp; Cancellations Policy</Link> and <Link href="/terms" className="text-indigo-600 underline font-medium">Terms &amp; Conditions</Link>.
        </div>
      </div>
    </div>
  );
}
