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
      <section className="py-12 bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl md:text-4xl font-bold mb-2">50+</p>
              <p className="text-indigo-200">Partner Institutions</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold mb-2">1000+</p>
              <p className="text-indigo-200">Students Placed</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold mb-2">100+</p>
              <p className="text-indigo-200">Employer Partners</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold mb-2">₹4.5 LPA</p>
              <p className="text-indigo-200">Average CTC</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">A Unified Placement Ecosystem</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">Bridging the gap between academic institutions, students, and corporate recruiters through a streamlined process.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="bg-slate-50 rounded-xl p-8 border border-slate-100 shadow-sm">
            <Building className="w-12 h-12 text-indigo-600 mb-6" />
            <h3 className="text-xl font-bold text-slate-900 mb-4">For Institutions</h3>
            <p className="text-slate-600 mb-6">
              Empower your college with an external placement wing. We handle the industry connections, candidate verification, and placement drives, improving your placement records.
            </p>
            <Link href="/for-colleges" className="text-indigo-600 font-medium hover:text-indigo-800 flex items-center">
              Learn more <span className="ml-2">→</span>
            </Link>
          </div>
          
          <div className="bg-slate-50 rounded-xl p-8 border border-slate-100 shadow-sm">
            <GraduationCap className="w-12 h-12 text-indigo-600 mb-6" />
            <h3 className="text-xl font-bold text-slate-900 mb-4">For Students</h3>
            <p className="text-slate-600 mb-6">
              Join our Placement Assurance Programme. Get assessed, trained, and connected with top employers looking for verified fresher talent ready for the corporate world.
            </p>
            <Link href="/for-students" className="text-indigo-600 font-medium hover:text-indigo-800 flex items-center">
              Learn more <span className="ml-2">→</span>
            </Link>
          </div>
          
          <div className="bg-slate-50 rounded-xl p-8 border border-slate-100 shadow-sm">
            <Briefcase className="w-12 h-12 text-indigo-600 mb-6" />
            <h3 className="text-xl font-bold text-slate-900 mb-4">For Employers</h3>
            <p className="text-slate-600 mb-6">
              Stop sifting through thousands of unverified resumes. Hire from a pool of pre-assessed, verified, and job-ready graduates from partner institutions.
            </p>
            <Link href="/for-employers" className="text-indigo-600 font-medium hover:text-indigo-800 flex items-center">
              Learn more <span className="ml-2">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Colleges Choose Us</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Transforming institutional placement outcomes with enterprise-grade solutions.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Verified Employer Network", desc: "Access to hundreds of verified recruiters actively hiring freshers." },
              { title: "Streamlined Dashboard", desc: "Track every student's placement journey in real-time." },
              { title: "Automated Workflows", desc: "Say goodbye to spreadsheets. We automate the entire placement drive process." },
              { title: "Skill Assessments", desc: "Standardized testing to ensure students meet industry benchmarks." },
              { title: "Detailed Analytics", desc: "Generate instant reports for NBA/NAAC accreditations." },
              { title: "Placement Assurance", desc: "Structured programs to maximize student placement success rates." }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <CheckCircle2 className="w-8 h-8 text-indigo-500 mb-4" />
                <h4 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h4>
                <p className="text-slate-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 bg-indigo-900 rounded-3xl p-10 md:p-16 text-center text-white shadow-xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to transform your institution&apos;s placement outcomes?</h2>
          <p className="text-indigo-200 text-lg mb-10 max-w-2xl mx-auto">
            Join the growing network of colleges upgrading their placement infrastructure with PlacementConnect.
          </p>
          <Link href="/for-colleges" className="inline-block bg-white text-indigo-900 px-8 py-4 rounded-md font-bold text-lg hover:bg-indigo-50 transition shadow-lg">
            Become a Partner Institution
          </Link>
        </div>
      </section>
    </div>
  );
}
