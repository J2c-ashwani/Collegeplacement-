import Link from 'next/link';
import { FileCheck2, Scale, Mail, ArrowRight } from 'lucide-react';
import { COMPANY_IDENTITY } from '@/config/company-identity';
import {
  INSTITUTION_COMMERCIAL_PLAN,
  STUDENT_PROGRAMME_PLANS,
  EMPLOYER_COMMERCIAL_POLICY,
  GST_POLICY,
} from '@/config/commercial-policy';

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="space-y-3 border-b border-slate-200 pb-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-[#1E40AF] border border-blue-200">
              Commercial Refund &amp; Assurance Policy
            </span>
            <span className="font-mono text-xs text-slate-500">
              Effective Date: {COMPANY_IDENTITY.governanceEffectiveDate}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Refund, Cancellation &amp; 3-Interview Assurance Policy
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            This policy governs all commercial transactions, student employability programme enrollments, institutional licenses, and corporate hiring agreements across{' '}
            <strong className="font-semibold text-slate-900">{COMPANY_IDENTITY.brandName}</strong>.
          </p>
        </div>

        <div className="bg-white rounded-md border border-slate-200/90 p-6 sm:p-10 space-y-8 text-sm text-slate-700 leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Scale className="h-5 w-5 text-blue-700" />
              1. Student Programme Tracks &amp; 100% Base Fee Refund Guarantee
            </h2>
            <p>
              Students enrolling through their college&apos;s verified campus code select between two tracks:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>{STUDENT_PROGRAMME_PLANS[0].name}:</strong>{' '}
                <span className="font-mono font-semibold text-slate-900">
                  {STUDENT_PROGRAMME_PLANS[0].formattedBase} {STUDENT_PROGRAMME_PLANS[0].formattedGst} ({STUDENT_PROGRAMME_PLANS[0].formattedTotal})
                </span>
              </li>
              <li>
                <strong>{STUDENT_PROGRAMME_PLANS[1].name}:</strong>{' '}
                <span className="font-mono font-semibold text-slate-900">
                  {STUDENT_PROGRAMME_PLANS[1].formattedBase} {STUDENT_PROGRAMME_PLANS[1].formattedGst} ({STUDENT_PROGRAMME_PLANS[1].formattedTotal})
                </span>
              </li>
            </ul>
            <div className="p-4 rounded-md bg-blue-50/70 border border-blue-200 text-xs text-blue-950 space-y-1.5">
              <p className="font-bold">12-Month 3-Interview Assurance Refund Guarantee:</p>
              <p>
                If an enrolled student completes the 9-Dimension Employability Assessment, maintains active institutional verification, attends scheduled interviews without unexcused absences, and PlacementConnect fails to facilitate at least{' '}
                <strong>3 verified employer interview opportunities</strong> within 12 months of assessment completion, the student is entitled to a{' '}
                <strong>100% refund of the Base Programme Fee (₹1,000 or ₹2,500)</strong>.
              </p>
              <p className="text-[11px] text-blue-900">
                *Statutory Tax Note: In accordance with Indian GST regulations, the 18% GST component (₹180 or ₹450) remitted to government tax authorities upon invoice issuance is non-refundable.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 border-t border-slate-200 pt-6">
            <h2 className="text-lg font-bold text-slate-900">
              2. Pre-Assessment Student Cancellation Window (7 Calendar Days)
            </h2>
            <p>
              If a student requests cancellation within <strong>7 calendar days of payment</strong> and has <strong>not yet initiated or completed</strong> the 9-Dimension Employability Assessment or issued a verifiable credential badge, the base programme fee (₹1,000 or ₹2,500) is refundable within 5–7 business days to the original payment method. Once the evaluation is initiated or a scorecard is generated, the 12-month 3-Interview Assurance Refund Guarantee governs the enrollment.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 border-t border-slate-200 pt-6">
            <h2 className="text-lg font-bold text-slate-900">
              3. Institutional Placement OS License ({INSTITUTION_COMMERCIAL_PLAN.formattedBase}/year + GST)
            </h2>
            <p>
              Colleges subscribing to the {INSTITUTION_COMMERCIAL_PLAN.name} ({INSTITUTION_COMMERCIAL_PLAN.formattedTotal}) receive a 30-day onboarding milestone commitment. Under our standard Institutional MoU, the Year-1 license fee is waived or credited back when 100 or more final-year students enroll in the Interview Assurance Programme.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 border-t border-slate-200 pt-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileCheck2 className="h-5 w-5 text-emerald-700" />
              4. Corporate Employer Hiring Agreements
            </h2>
            <p>
              Hiring partnerships with corporate employers are structured based on hiring requirements and partnership scope. Specific commercial terms, invoicing milestones, and service commitments for corporate employers are governed by the executed Employer Hiring Agreement established during employer onboarding.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3 border-t border-slate-200 pt-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-700" />
              5. Official Billing, Tax Invoice &amp; Refund Desk
            </h2>
            <div className="p-4 rounded-md bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-700">
                  {COMPANY_IDENTITY.desks.billingAndRefunds.label}
                </div>
                <a
                  href={`mailto:${COMPANY_IDENTITY.desks.billingAndRefunds.email}`}
                  className="font-mono text-sm font-bold text-blue-700 hover:underline"
                >
                  {COMPANY_IDENTITY.desks.billingAndRefunds.email}
                </a>
                <div className="text-xs text-slate-500">
                  General Support: {COMPANY_IDENTITY.desks.privacyAndGrievance.generalContactEmail} • {GST_POLICY.legalNote}
                </div>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-800 hover:text-blue-950 shrink-0"
              >
                Submit Billing Inquiry Online
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
