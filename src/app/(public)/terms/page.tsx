import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - PlacementConnect',
  description: 'Terms and conditions for using PlacementConnect.',
};

export default function TermsPage() {
  return (
    <div className="bg-white py-16 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-8">Terms of Service</h1>
        <div className="prose prose-slate max-w-none">
          <p className="text-sm text-slate-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="text-slate-700 mb-4">
            By accessing and using PlacementConnect (&quot;the Platform&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">2. User Accounts</h2>
          <p className="text-slate-700 mb-4">
            Users must provide accurate, current, and complete information during the registration process. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">3. For Institutions</h2>
          <p className="text-slate-700 mb-4">
            Partner institutions are responsible for verifying the academic records of their registered students. Any falsification of data may result in immediate termination of the partnership.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">4. For Students</h2>
          <p className="text-slate-700 mb-4">
            Students agree to adhere to the code of conduct during assessments and interviews. Malpractice during assessments will lead to permanent blacklisting from the platform. The Placement Assurance Programme guarantees interview opportunities, not final employment.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">5. For Employers</h2>
          <p className="text-slate-700 mb-4">
            Employers must use candidate data solely for recruitment purposes. Selling or distributing student profiles to third parties is strictly prohibited.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">6. Intellectual Property</h2>
          <p className="text-slate-700 mb-4">
            All content on the Platform, including text, graphics, logos, and software, is the property of PlacementConnect or its content suppliers and protected by copyright laws.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">7. Pricing, Services &amp; Currency (INR)</h2>
          <p className="text-slate-700 mb-4">
            All paid products and services—including the Student Placement Assurance Programme (₹1,000 + 18% GST), the Student Placement Plus Programme (₹2,500 + 18% GST), the 1-Year Institutional Placement Membership (₹15,000/year + 18% GST), and the 5-Year Premium Institutional Membership (₹60,000 for 5 years + 18% GST)—are listed and billed exclusively in Indian Rupees (INR / ₹). Access for verified corporate employers to post jobs and recruit freshers is provided free of charge (₹0).
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">8. Refunds &amp; Cancellations</h2>
          <p className="text-slate-700 mb-4">
            Cancellations requested within 7 days prior to diagnostic assessment or batch activation qualify for a 100% refund, and students whose 3 guaranteed interview opportunities are unfulfilled within their 12-month programme validity are eligible for a full base fee refund. Approved refunds are credited to the original payment method within 5–7 business days. Please refer to our dedicated <a href="/refund-policy" className="text-indigo-600 underline font-medium">Refunds &amp; Cancellations Policy</a> for full details.
          </p>
        </div>
      </div>
    </div>
  );
}
