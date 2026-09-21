import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Target, Award, Briefcase, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'For Students - PlacementConnect',
  description: 'Your pathway to career readiness and top placements.',
};

export default function ForStudentsPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="py-20 bg-indigo-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
            Your Pathway to Career Readiness
          </h1>
          <p className="text-xl text-indigo-200 mb-10 max-w-2xl mx-auto">
            Stand out to top employers with verified skills, structured assessments, and our exclusive Placement Assurance Programme.
          </p>
          <Link href="/register" className="bg-white text-indigo-900 px-8 py-3 rounded-md font-bold text-lg hover:bg-slate-100 transition shadow-lg">
            Register Through Your College
          </Link>
        </div>
      </section>

      {/* Program Details */}
      <section className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">The Placement Assurance Programme</h2>
            <p className="text-slate-600 mb-6 text-lg">
              We don&apos;t just promise jobs; we build careers. Our Placement Assurance Programme is a rigorous, structured pathway designed to transform you into a highly desirable candidate for modern enterprises.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <p className="text-blue-800 text-sm">
                <strong>Note:</strong> &apos;Placement Assurance&apos; refers to our commitment to providing guaranteed interview opportunities with verified employers upon successful completion of assessments, subject to terms and conditions. It is not an unconditional job guarantee.
              </p>
            </div>
            <Link href="/placement-assurance" className="text-indigo-600 font-medium hover:text-indigo-800 flex items-center">
              Read full program details <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="space-y-6">
            <div className="flex bg-slate-50 p-6 rounded-lg border border-slate-100">
              <Target className="w-10 h-10 text-indigo-600 mr-4 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-slate-900 text-lg">Comprehensive Assessment</h4>
                <p className="text-slate-600 text-sm">Aptitude, technical, and communication tests standard across industry.</p>
              </div>
            </div>
            <div className="flex bg-slate-50 p-6 rounded-lg border border-slate-100">
              <Award className="w-10 h-10 text-indigo-600 mr-4 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-slate-900 text-lg">Verified Scores & Badges</h4>
                <p className="text-slate-600 text-sm">Earn digital credentials that employers explicitly look for during hiring.</p>
              </div>
            </div>
            <div className="flex bg-slate-50 p-6 rounded-lg border border-slate-100">
              <Briefcase className="w-10 h-10 text-indigo-600 mr-4 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-slate-900 text-lg">Interview Opportunities</h4>
                <p className="text-slate-600 text-sm">Direct access to interview pipelines based on your assessment percentiles.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">The Journey</h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6 text-center">
            {['Register via College', 'Pay Assessment Fee', 'Take Assessment', 'Build Profile', 'Attend Interviews', 'Get Placed'].map((step, i) => (
              <div key={i} className="relative">
                <div className="w-16 h-16 bg-white border-2 border-indigo-600 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4 z-10 relative">
                  {i + 1}
                </div>
                <p className="font-medium text-slate-800 text-sm">{step}</p>
                {i < 5 && <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-indigo-200 -z-10"></div>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
