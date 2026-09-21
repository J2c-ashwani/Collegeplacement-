import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Check, BarChart, Shield, Calendar, Users, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'For Colleges - PlacementConnect',
  description: 'Partner with PlacementConnect to supercharge your college placements.',
};

export default function ForCollegesPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
            The Placement Partnership Your Institution Needs
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-10">
            Offload the complexity of finding employers. We bring verified recruiters directly to your students through our digital infrastructure.
          </p>
          <Link href="/contact" className="bg-indigo-600 text-white px-8 py-3 rounded-md font-medium text-lg hover:bg-indigo-700 transition">
            Become a Partner
          </Link>
        </div>
      </section>

      {/* Narrative */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">The Problem with Traditional Placements</h2>
            <p className="text-slate-600 mb-4 text-lg">
              Most institutions struggle to build and maintain strong corporate relations. Managing spreadsheets, verifying companies, and scheduling drives is a full-time logistical nightmare.
            </p>
            <p className="text-slate-600 text-lg">
              PlacementConnect acts as your external placement cell. We bring the companies, conduct the assessments, and manage the interviews — all visible through a transparent dashboard.
            </p>
          </div>
          <div className="bg-slate-100 p-8 rounded-xl border border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">What&apos;s Included</h3>
            <ul className="space-y-4">
              <li className="flex items-start"><Check className="text-indigo-600 mt-1 mr-3 flex-shrink-0" /> <span className="text-slate-700">Dedicated Institutional Dashboard</span></li>
              <li className="flex items-start"><Check className="text-indigo-600 mt-1 mr-3 flex-shrink-0" /> <span className="text-slate-700">Official MOU and Partnership Certificate</span></li>
              <li className="flex items-start"><Check className="text-indigo-600 mt-1 mr-3 flex-shrink-0" /> <span className="text-slate-700">Access to 100+ Employer Network</span></li>
              <li className="flex items-start"><Check className="text-indigo-600 mt-1 mr-3 flex-shrink-0" /> <span className="text-slate-700">Student Performance Analytics</span></li>
              <li className="flex items-start"><Check className="text-indigo-600 mt-1 mr-3 flex-shrink-0" /> <span className="text-slate-700">NAAC/NBA Ready Reports</span></li>
            </ul>
            <div className="mt-8 pt-6 border-t border-slate-300">
              <p className="font-semibold text-slate-900 text-lg">Plans starting from ₹9,999/year</p>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-12">How It Works</h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {['Register', 'Verify', 'Subscribe', 'Dashboard', 'Students Register', 'Placements'].map((step, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold mb-4">
                  {i + 1}
                </div>
                <p className="font-medium text-slate-900">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Features that drive results</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border border-slate-200 rounded-xl shadow-sm">
              <BarChart className="text-indigo-600 w-10 h-10 mb-4" />
              <h3 className="text-xl font-bold mb-2 text-slate-900">Advanced Analytics</h3>
              <p className="text-slate-600">Track placement rates, average CTCs, and student performance metrics in real-time.</p>
            </div>
            <div className="p-6 border border-slate-200 rounded-xl shadow-sm">
              <Shield className="text-indigo-600 w-10 h-10 mb-4" />
              <h3 className="text-xl font-bold mb-2 text-slate-900">Verified Employers</h3>
              <p className="text-slate-600">Every employer on our platform is strictly vetted to prevent fraudulent job offers.</p>
            </div>
            <div className="p-6 border border-slate-200 rounded-xl shadow-sm">
              <Calendar className="text-indigo-600 w-10 h-10 mb-4" />
              <h3 className="text-xl font-bold mb-2 text-slate-900">Automated Drives</h3>
              <p className="text-slate-600">Schedule and manage on-campus or virtual drives seamlessly through the dashboard.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
