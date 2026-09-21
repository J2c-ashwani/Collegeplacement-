import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions - PlacementConnect',
  description: 'Find answers to common questions about PlacementConnect for colleges, students, and employers.',
};

export default function FAQsPage() {
  const faqs = {
    "For Colleges": [
      { q: "How long does the onboarding process take?", a: "Institutional onboarding typically takes 2-3 weeks, including the signing of the MOU, setting up the dedicated dashboard, and initial student data migration." },
      { q: "Do you integrate with our existing ERP?", a: "Yes, we offer custom integrations with most major college ERP systems to seamlessly sync student academic data." }
    ],
    "For Students": [
      { q: "Is the Placement Assurance Programme free?", a: "The program requires a nominal assessment fee which covers the cost of standardized testing, verified digital profiling, and administrative processing." },
      { q: "What happens if I fail the assessment?", a: "Students who do not meet the cutoff score can opt for a re-evaluation after 45 days. We provide feedback reports to help you prepare better for the next attempt." }
    ],
    "For Employers": [
      { q: "How are the student skills verified?", a: "We conduct proctored assessments covering cognitive abilities, domain-specific technical skills, and behavioral traits. Academic records are verified directly by the partner institutions." },
      { q: "Is there a limit on the number of hires?", a: "No, employer partners can hire an unlimited number of candidates from our pre-assessed talent pool based on their subscription tier." }
    ]
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16 lg:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-slate-600">Everything you need to know about the product and billing.</p>
        </div>

        <div className="space-y-12">
          {Object.entries(faqs).map(([category, questions], idx) => (
            <div key={idx}>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">{category}</h2>
              <div className="space-y-4">
                {questions.map((faq, fIdx) => (
                  <details key={fIdx} className="group bg-white border border-slate-200 rounded-lg shadow-sm [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex cursor-pointer items-center justify-between gap-1.5 p-4 text-slate-900 font-medium">
                      {faq.q}
                      <span className="shrink-0 rounded-full bg-slate-50 p-1.5 text-slate-900 sm:p-3 group-open:-rotate-180 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </summary>
                    <div className="px-4 pb-4 text-slate-600 text-base border-t border-slate-100 pt-4">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
