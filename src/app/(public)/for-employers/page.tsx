import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { CheckCircle2, Search, Calendar, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'For Employers - PlacementConnect',
  description: 'Hire verified, assessed fresher talent from top institutions.',
};

export default function ForEmployersPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="py-20 bg-slate-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
            Hire Verified, Assessed Fresher Talent
          </h1>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Stop sifting through thousands of identical resumes. Access a curated pool of job-ready graduates pre-assessed for cognitive, technical, and behavioral skills.
          </p>
          <Link href="/contact" className="bg-indigo-600 text-white px-8 py-3 rounded-md font-bold text-lg hover:bg-indigo-700 transition shadow-lg">
            Start Hiring Today
          </Link>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Hire Through PlacementConnect?</h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">We reduce your time-to-hire by over 60% by doing the heavy lifting of initial screening and assessment.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-slate-50 p-8 rounded-xl border border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">The Traditional Way</h3>
            <ul className="space-y-4 text-slate-600">
              <li className="flex items-center">❌ Post jobs, get spammed with irrelevant resumes</li>
              <li className="flex items-center">❌ Spend weeks conducting initial aptitude tests</li>
              <li className="flex items-center">❌ High drop-out rates in final interview stages</li>
              <li className="flex items-center">❌ Unverified academic credentials</li>
            </ul>
          </div>
          <div className="bg-indigo-50 p-8 rounded-xl border border-indigo-100">
            <h3 className="text-2xl font-bold text-indigo-900 mb-6">The PlacementConnect Way</h3>
            <ul className="space-y-4 text-indigo-800">
              <li className="flex items-center"><CheckCircle2 className="w-5 h-5 mr-3 text-indigo-600" /> Pre-assessed candidates with verified scores</li>
              <li className="flex items-center"><CheckCircle2 className="w-5 h-5 mr-3 text-indigo-600" /> Filter candidates by specific technical percentiles</li>
              <li className="flex items-center"><CheckCircle2 className="w-5 h-5 mr-3 text-indigo-600" /> Direct interview scheduling through dashboard</li>
              <li className="flex items-center"><CheckCircle2 className="w-5 h-5 mr-3 text-indigo-600" /> College-verified student profiles and degrees</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Seamless Hiring Experience</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <Search className="w-10 h-10 text-indigo-600 mb-4" />
              <h4 className="text-xl font-bold text-slate-900 mb-2">Smart Matching</h4>
              <p className="text-slate-600">Define your criteria once, and our algorithm matches you with students who meet your exact skill requirements.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <Users className="w-10 h-10 text-indigo-600 mb-4" />
              <h4 className="text-xl font-bold text-slate-900 mb-2">Campus Virtual Drives</h4>
              <p className="text-slate-600">Conduct multi-college hiring drives completely virtually without managing multiple TPO relationships.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <Calendar className="w-10 h-10 text-indigo-600 mb-4" />
              <h4 className="text-xl font-bold text-slate-900 mb-2">Interview Scheduling</h4>
              <p className="text-slate-600">Integrated calendar tools to schedule bulk interviews, send automated reminders, and collect panel feedback.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
