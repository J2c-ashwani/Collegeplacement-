import React from 'react';
import Link from 'next/link';
import { Building, GraduationCap, Briefcase, CheckCircle2, TrendingUp, Users } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PlacementConnect - B2B College Placement Network',
  description: 'Connect your students with verified employers, structured placement support and career-readiness assessment.',
};

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="py-20 lg:py-32 bg-slate-50 text-center px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
            Your College&apos;s External <span className="text-indigo-600">Placement Network</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            Connect your students with verified employers, structured placement support and career-readiness assessment.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/for-colleges" className="bg-indigo-600 text-white px-8 py-3 rounded-md font-medium text-lg hover:bg-indigo-700 transition">
              Partner With Us
            </Link>
            <Link href="/for-students" className="bg-white text-slate-700 border border-slate-300 px-8 py-3 rounded-md font-medium text-lg hover:bg-slate-50 transition">
              For Students
            </Link>
            <Link href="/for-employers" className="bg-transparent text-indigo-600 border border-indigo-600 px-8 py-3 rounded-md font-medium text-lg hover:bg-indigo-50 transition">
              Hire Freshers
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-[#0F2744] text-white border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center font-mono">
            <div>
              <p className="text-3xl md:text-4xl font-bold mb-1 tracking-tight text-white tabular-nums">50+</p>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-sans font-medium">Partner Colleges</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold mb-1 tracking-tight text-emerald-400 tabular-nums">1,000+</p>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-sans font-medium">Verified Placements</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold mb-1 tracking-tight text-blue-400 tabular-nums">100+</p>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-sans font-medium">Corporate Recruiters</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold mb-1 tracking-tight text-white tabular-nums">₹4.5 LPA</p>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-sans font-medium">Median Fresher CTC</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-4">A Unified Placement Infrastructure</h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
            Bridging institutional academics, candidate readiness, and corporate recruitment through a deterministic operating system.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-md p-6 border border-slate-200 shadow-2xs">
            <Building className="w-8 h-8 text-[#1E40AF] mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">For Institutions</h3>
            <p className="text-slate-600 mb-4 text-xs sm:text-sm leading-relaxed">
              Empower your college with an external placement wing. We coordinate recruiter demand, candidate verification, and placement drives to elevate verified employment outcomes.
            </p>
            <Link href="/for-colleges" className="text-xs font-semibold text-[#1E40AF] hover:underline inline-flex items-center">
              Learn more <span className="ml-1.5">→</span>
            </Link>
          </div>
          
          <div className="bg-white rounded-md p-6 border border-slate-200 shadow-2xs">
            <GraduationCap className="w-8 h-8 text-[#1E40AF] mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">For Students</h3>
            <p className="text-slate-600 mb-4 text-xs sm:text-sm leading-relaxed">
              Join our Placement Assurance programme. Complete 9-dimension diagnostic benchmarking and connect with verified employer interviews matched to your skills.
            </p>
            <Link href="/for-students" className="text-xs font-semibold text-[#1E40AF] hover:underline inline-flex items-center">
              Learn more <span className="ml-1.5">→</span>
            </Link>
          </div>
          
          <div className="bg-white rounded-md p-6 border border-slate-200 shadow-2xs">
            <Briefcase className="w-8 h-8 text-[#1E40AF] mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">For Employers</h3>
            <p className="text-slate-600 mb-4 text-xs sm:text-sm leading-relaxed">
              Eliminate unverified resume screening. Access pre-assessed, eligibility-matched graduating talent from partner institutions with agreement-based terms.
            </p>
            <Link href="/for-employers" className="text-xs font-semibold text-[#1E40AF] hover:underline inline-flex items-center">
              Learn more <span className="ml-1.5">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 lg:py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-4">Why Partner Institutions Choose PlacementConnect</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
              Mission-critical technology infrastructure engineered for institutional governance and campus employment.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Verified Corporate Network", desc: "Access to hundreds of verified recruiters actively conducting campus interview drives." },
              { title: "Live Telemetry Dashboard", desc: "Track every student's placement journey with live database-driven telemetry." },
              { title: "Automated Workflows", desc: "Structured campus drive scheduling, interview allocation, and offer verification." },
              { title: "Diagnostic Benchmarking", desc: "Standardized 9-dimension evaluation to measure technical and situational readiness." },
              { title: "Accreditation Support", desc: "Placement Evidence & Accreditation Support for NAAC and NBA documentation workflows." },
              { title: "Placement Assurance", desc: "Structured cohorts providing access to qualified interview opportunities." }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-5 rounded-md shadow-2xs border border-slate-200">
                <CheckCircle2 className="w-6 h-6 text-[#1E40AF] mb-3" />
                <h4 className="text-sm font-bold text-slate-900 mb-1.5">{feature.title}</h4>
                <p className="text-slate-600 text-xs leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0F2744] rounded-md p-8 md:p-12 text-center text-white border border-slate-800 shadow-2xs">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">Ready to elevate your institution&apos;s placement outcomes?</h2>
            <p className="text-slate-300 text-sm max-w-2xl mx-auto mb-8">
              Join the growing network of colleges upgrading their career infrastructure with PlacementConnect.
            </p>
            <Link href="/for-colleges" className="inline-block bg-[#1E40AF] text-white px-6 py-2.5 rounded-sm font-semibold text-sm hover:bg-blue-800 transition">
              Become a Partner Institution
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
