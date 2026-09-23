import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Refunds & Cancellations Policy - PlacementConnect',
  description: 'Official Refund and Cancellation Policy for PlacementConnect institutional and student programmes in INR.',
};

export default function RefundPolicyPage() {
  return (
    <div className="bg-white py-16 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Refunds &amp; Cancellations Policy</h1>
        <p className="text-sm text-slate-500 mb-8">
          Effective Date: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })} • All transactions processed in Indian Rupees (INR / ₹)
        </p>

        <div className="prose prose-slate max-w-none space-y-8 text-slate-700">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">1. Overview</h2>
            <p>
              PlacementConnect provides structured university placement infrastructure, employability diagnostics, and the 3N Placement Assurance Programme for graduating students, higher education institutions, and corporate employers across India. All pricing and transactions on the platform are denominated and settled exclusively in <strong>Indian Rupees (INR / ₹)</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">2. Student Programmes — Placement Assurance (₹1,000 + GST) &amp; Placement Plus (₹2,500 + GST)</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>7-Day Cooling-Off Cancellation:</strong> Students enrolled in either the <strong>Placement Assurance Programme (₹1,000 + 18% GST)</strong> or the <strong>Placement Plus Programme (₹2,500 + 18% GST)</strong> may request a full 100% cancellation and refund within <strong>7 calendar days</strong> of payment, provided they have not yet initiated the 9-Dimension Employability Diagnostic Assessment, mentor mock interviews, or booked an interview slot.
              </li>
              <li>
                <strong>Placement Assurance Quota Guarantee Refund:</strong> Eligible students who clear the diagnostic benchmark are guaranteed a minimum of <strong>3 qualified corporate interview opportunities</strong> (Placement Assurance — ₹1,000) or <strong>5 qualified corporate interview opportunities</strong> (Placement Plus — ₹2,500) within their 12-month programme validity. If PlacementConnect fails to deliver the guaranteed interview opportunities within the validity window (excluding student no-shows or student-initiated withdrawals), the student is eligible for a <strong>100% refund of the base programme fee</strong>.
              </li>
              <li>
                <strong>Non-Refundable Scenarios:</strong> Fees are non-refundable once the student has attempted the diagnostic assessment and received at least 1 qualified interview allocation, or in cases of documented academic/interview malpractice.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">3. Institutional Membership Plans (₹15,000/Year &amp; ₹60,000/5-Year Premium)</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Pre-Activation Cancellation:</strong> Partner colleges and universities subscribing to either the <strong>1-Year Annual Membership (₹15,000 + 18% GST)</strong> or the <strong>5-Year Premium NAAC Cycle Membership (₹60,000 + 18% GST)</strong> may cancel within <strong>7 business days</strong> of payment for a full 100% refund, provided the institutional batch roster and unique student registration gateway (`/register/[code]`) have not yet been activated.
              </li>
              <li>
                <strong>Multi-Year Pro-Rata Protection (5-Year Premium Plan):</strong> For institutions on the 5-Year Premium Plan (₹60,000), if an institution wishes to discontinue after completing at least 1 academic year with 30 days&apos; written notice prior to the next academic session, unused complete future years are eligible for a pro-rata refund calculated after accounting for the standard annual rate (₹15,000/year) for completed years.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">4. Corporate Employers (Free Access — ₹0)</h2>
            <p>
              Verified corporate employers and recruitment partners access PlacementConnect to post fresher openings, evaluate pre-assessed candidates, and conduct campus hiring drives at <strong>₹0 cost</strong> (no job posting fees or recruitment commissions).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">5. Refund Processing Timeline &amp; Mode</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Initiation:</strong> To request a refund or cancellation, email <a href="mailto:sukashwanikumar@gmail.com" className="text-indigo-600 font-medium underline">sukashwanikumar@gmail.com</a> or <a href="mailto:contact@placementconnect.com" className="text-indigo-600 font-medium underline">contact@placementconnect.com</a> with your Order ID / Razorpay Payment ID (`pay_...`) and registered email address.
              </li>
              <li>
                <strong>Processing SLA:</strong> Approved refunds are initiated within <strong>48 hours</strong> of verification and are credited back to the <strong>original payment method</strong> (UPI, NetBanking, Credit/Debit Card, or Corporate Bank Account via Razorpay) within <strong>5 to 7 business days</strong>.
              </li>
            </ul>
          </section>

          <div className="mt-10 p-6 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900">Need help with an order or billing query?</h3>
              <p className="text-sm text-slate-600">Our billing compliance desk responds within 24 business hours.</p>
            </div>
            <Link href="/contact" className="bg-indigo-600 text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-indigo-700 transition shrink-0">
              Contact Billing Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
