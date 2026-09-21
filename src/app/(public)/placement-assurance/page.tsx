import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { ShieldCheck, ArrowRight, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Placement Assurance Programme - PlacementConnect',
  description: 'Details about the Placement Assurance Programme terms, eligibility, and process.',
};

export default function PlacementAssurancePage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="py-20 bg-indigo-50 border-b border-indigo-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <ShieldCheck className="w-16 h-16 text-indigo-600 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
            Placement Assurance Programme
          </h1>
          <p className="text-xl text-slate-600 mb-0">
            A structured pathway connecting skilled students with hiring employers.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="prose prose-lg prose-indigo mx-auto text-slate-700">
          
          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">1. What is the Programme?</h2>
          <p className="mb-6">
            The PlacementConnect Placement Assurance Programme is a career-readiness track designed to bridge the gap between academic learning and industry expectations. Through comprehensive assessments and verified profiling, we connect eligible students directly with our network of hiring partners.
          </p>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
            <p className="text-yellow-800 text-sm font-medium">
              <strong>Disclaimer:</strong> This programme assures structured interview opportunities with verified employers. It does not constitute an unconditional guarantee of employment. Final selection is at the sole discretion of the hiring company based on candidate performance.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">2. Eligibility Criteria</h2>
          <ul className="list-disc pl-6 mb-8 space-y-2">
            <li>Must be a final year student or recent graduate (up to 1 year) from a partner institution.</li>
            <li>Must maintain a minimum academic aggregate as prescribed by the hiring companies (typically 60% or equivalent CGPA).</li>
            <li>Must have no active backlogs at the time of appearing for the final assessments.</li>
            <li>Must complete the PlacementConnect Core Assessment with a minimum score of 70th percentile.</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">3. The Process</h2>
          <div className="space-y-4 mb-8">
            <div className="flex border border-slate-200 p-4 rounded-lg">
              <div className="font-bold text-indigo-600 mr-4">Phase 1</div>
              <div><strong>Registration & Profiling:</strong> Create an exhaustive digital profile verified by your institution.</div>
            </div>
            <div className="flex border border-slate-200 p-4 rounded-lg">
              <div className="font-bold text-indigo-600 mr-4">Phase 2</div>
              <div><strong>Core Assessment:</strong> Undergo rigorous aptitude, technical, and communication evaluations.</div>
            </div>
            <div className="flex border border-slate-200 p-4 rounded-lg">
              <div className="font-bold text-indigo-600 mr-4">Phase 3</div>
              <div><strong>Interview Pipelines:</strong> Eligible profiles are matched and routed to hiring partners for interviews.</div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">4. What Students Receive</h2>
          <ul className="list-disc pl-6 mb-8 space-y-2">
            <li>A verified digital portfolio shareable with any employer.</li>
            <li>Detailed performance report identifying strengths and areas for improvement.</li>
            <li>Minimum of 3 assured interview opportunities for candidates clearing the assessment threshold.</li>
            <li>Access to company-specific preparation modules and mock interviews.</li>
          </ul>

        </div>

        <div className="mt-16 text-center border-t border-slate-200 pt-10">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Ready to accelerate your career?</h3>
          <Link href="/for-students" className="inline-flex items-center justify-center bg-indigo-600 text-white px-8 py-3 rounded-md font-medium text-lg hover:bg-indigo-700 transition">
            Join the Programme <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
