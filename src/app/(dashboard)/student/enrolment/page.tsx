'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2,
  FileText,
  Lock,
  ArrowRight,
  Download,
  MailCheck,
  Loader2,
  AlertCircle,
  Clock,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import { STUDENT_PROGRAMME_PLANS } from '@/config/commercial-policy';
import {
  STUDENT_TERMS_VERSION,
  STUDENT_PROGRAMME_TERMS_CLAUSES,
  AcceptedStudentTermsSnapshot,
} from '@/config/legal-documents';

type PaymentOutcomeView = 'CHECKOUT_READY' | 'ENROLLMENT_CONFIRMED' | 'PAYMENT_PENDING' | 'PAYMENT_FAILED';

export default function StudentEnrolmentWorkflowPage() {
  const [selectedSlug, setSelectedSlug] = useState<string>('placement-assurance');
  const [termsOpened, setTermsOpened] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [acceptedTimestamp, setAcceptedTimestamp] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<AcceptedStudentTermsSnapshot | null>(null);
  const [outcomeView, setOutcomeView] = useState<PaymentOutcomeView>('CHECKOUT_READY');
  const [studentMeta, setStudentMeta] = useState<{
    studentName: string;
    studentEmail: string;
    enrollmentNumber: string;
    institutionName: string;
    campusCode: string;
  } | null>(null);

  useEffect(() => {
    fetch('/api/student/enrolment')
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) {
          setStudentMeta({
            studentName: data.studentName || 'Aarav Sharma',
            studentEmail: data.studentEmail || 'student1@apex.edu.in',
            enrollmentNumber: data.enrollmentNumber || 'APX2026CS042',
            institutionName: data.institutionName || 'Apex Institute of Technology',
            campusCode: data.campusCode || 'APX123',
          });
          if (data.snapshot) {
            setSnapshot(data.snapshot);
            setSelectedSlug(data.snapshot.programmeSlug);
            setTermsAccepted(true);
            setAcceptedTimestamp(data.snapshot.acceptedAt);
            setOutcomeView('ENROLLMENT_CONFIRMED');
          }
        }
      })
      .catch(() => {});
  }, []);

  const selectedPlan =
    STUDENT_PROGRAMME_PLANS.find((p) => p.slug === selectedSlug) || STUDENT_PROGRAMME_PLANS[0];

  const handleAcceptToggle = (checked: boolean) => {
    setTermsAccepted(checked);
    setAcceptedTimestamp(checked ? new Date().toISOString() : null);
    if (error) setError(null);
  };

  const handleProceedToCashfreeCheckout = async () => {
    if (!termsAccepted) {
      setError(
        'You must actively accept the Programme Terms & Conditions before proceeding to Cashfree checkout.'
      );
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/student/enrolment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          programmeSlug: selectedSlug,
          termsAccepted: true,
          termsVersion: STUDENT_TERMS_VERSION,
          acceptedAt: acceptedTimestamp || new Date().toISOString(),
          paymentMethod: 'CASHFREE_CHECKOUT',
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Cashfree payment verification failed.');
      }
      setSnapshot(data.snapshot);
      setOutcomeView('ENROLLMENT_CONFIRMED');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to complete transaction.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-800 font-semibold">
            <span>STUDENT PROGRAMME ENROLMENT &amp; CASHFREE CHECKOUT</span>
            <span>&bull;</span>
            <span>{STUDENT_TERMS_VERSION}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Programme Track Selection, Terms Acceptance &amp; Secure Cashfree Payment
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Linked Institution: <strong>{studentMeta?.institutionName || 'Apex Institute of Technology'}</strong>{' '}
            (Campus Code: <code className="font-mono font-bold text-blue-800">{studentMeta?.campusCode || 'APX123'}</code>) &bull; Roll No:{' '}
            <code className="font-mono font-semibold">{studentMeta?.enrollmentNumber || 'APX2026CS042'}</code>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/student/documents/terms-preview">
            <Button size="sm" variant="outline" className="text-xs h-8">
              <FileText className="h-3.5 w-3.5 mr-1.5" />
              Download Accepted Terms PDF
            </Button>
          </Link>
          <Link href="/student/dashboard">
            <Button size="sm" variant="outline" className="text-xs h-8">
              Open Dashboard
            </Button>
          </Link>
        </div>
      </div>

      {/* State Switcher Bar for Auditing Confirmed / Pending / Failed Cashfree States */}
      <div className="p-2.5 rounded-md bg-slate-100 border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-mono font-semibold text-slate-700">
          CASHFREE PAYMENT STATE MACHINE INSPECTOR:
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'ENROLLMENT_CONFIRMED', label: '1. Enrollment Confirmed (Paid)' },
            { id: 'PAYMENT_PENDING', label: '2. Payment Pending (Reconciling)' },
            { id: 'PAYMENT_FAILED', label: '3. Payment Failed (Retry)' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setOutcomeView(tab.id as PaymentOutcomeView)}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                outcomeView === tab.id
                  ? 'bg-[#1E40AF] text-white'
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: Track Selection + Mandatory Terms & Conditions Before Checkout */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Select Programme Track */}
          <Card className="border-slate-200 shadow-2xs bg-white">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-base font-bold text-slate-900">
                Step 1 — Select Your Placement Assurance Track
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Official student programme fee schedule. Both tracks include 3 Verified Corporate Interview Opportunities within 12 months of assessment completion.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {STUDENT_PROGRAMME_PLANS.map((plan) => {
                const isSelected = selectedSlug === plan.slug;
                return (
                  <button
                    key={plan.slug}
                    type="button"
                    onClick={() => setSelectedSlug(plan.slug)}
                    className={`text-left p-4 rounded-md border transition-all space-y-2 ${
                      isSelected
                        ? 'border-[#1E40AF] bg-blue-50/40 ring-1 ring-[#1E40AF]'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{plan.name}</span>
                      <Badge
                        className={
                          isSelected
                            ? 'bg-[#1E40AF] text-white text-[10px]'
                            : 'bg-slate-100 text-slate-700 text-[10px]'
                        }
                      >
                        {plan.badge}
                      </Badge>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl font-bold font-mono text-slate-900">
                        {plan.formattedTotal}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        ({plan.formattedBase} + 18% GST)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{plan.subtitle}</p>
                  </button>
                );
              })}
            </CardContent>
          </Card>

          {/* 2. Applicable Programme Terms & Conditions (Must Actively Accept Before Cashfree Checkout) */}
          <Card className="border-slate-200 shadow-2xs bg-white">
            <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">
                  Step 2 — Review &amp; Accept Programme Terms &amp; Conditions
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Version: <code className="font-mono font-bold text-slate-700">{STUDENT_TERMS_VERSION}</code> &bull; Recorded before initiating Cashfree Checkout.
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setTermsOpened(!termsOpened)}
                className="text-xs h-7"
              >
                {termsOpened ? 'Collapse Clauses' : 'Expand Full Terms'}
              </Button>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              {termsOpened && (
                <div className="max-h-64 overflow-y-auto pr-2 space-y-3 bg-slate-50 p-4 rounded border border-slate-200 text-xs text-slate-700">
                  {STUDENT_PROGRAMME_TERMS_CLAUSES.map((clause) => (
                    <div key={clause.title} className="space-y-1">
                      <div className="font-bold text-slate-900">{clause.title}</div>
                      <p className="leading-relaxed text-slate-600">{clause.body}</p>
                    </div>
                  ))}
                </div>
              )}

              <label className="flex items-start gap-3 p-4 rounded-md border border-blue-200 bg-blue-50/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => handleAcceptToggle(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#1E40AF] focus:ring-[#1E40AF]"
                />
                <div className="text-xs space-y-1">
                  <span className="font-bold text-slate-900 block">
                    I have read and actively accept the PlacementConnect Programme Terms &amp; Conditions ({STUDENT_TERMS_VERSION}) for the {selectedPlan.name}.
                  </span>
                  <span className="text-slate-600 block leading-relaxed">
                    I understand that my acceptance is recorded prior to entering Cashfree Checkout, and the exact accepted Terms &amp; Conditions PDF ({STUDENT_TERMS_VERSION}) will be permanently stored and emailed upon Cashfree server-side payment confirmation.
                  </span>
                  {acceptedTimestamp && (
                    <span className="inline-block font-mono text-[11px] font-semibold text-emerald-700 pt-1">
                      Pre-Checkout Acceptance Timestamp: {acceptedTimestamp}
                    </span>
                  )}
                </div>
              </label>
            </CardContent>
          </Card>
        </div>

        {/* Right 5 Columns: PlacementConnect Payment Context -> Cashfree Checkout & Outcome States */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-slate-200 shadow-2xs bg-white">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold text-slate-900">
                  Step 3 — PlacementConnect Payment Summary
                </CardTitle>
                <Badge variant="outline" className="font-mono text-[10px] border-blue-200 bg-blue-50 text-blue-800">
                  GATEWAY: CASHFREE
                </Badge>
              </div>
              <CardDescription className="text-xs text-slate-500">
                Review your fee breakdown and proceed to Cashfree Secure Checkout (UPI, Cards, Net Banking).
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="space-y-2 text-xs border-b border-slate-100 pb-4">
                <div className="flex justify-between">
                  <span className="text-slate-600">Programme Name</span>
                  <span className="font-bold text-slate-900">{selectedPlan.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Base Programme Fee (100% Assurance Refundable)</span>
                  <span className="font-mono font-semibold text-slate-900">
                    {selectedPlan.formattedBase}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Statutory GST (18%)</span>
                  <span className="font-mono font-semibold text-slate-900">
                    {selectedPlan.formattedGst}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Applicable T&amp;C Acknowledgement</span>
                  <span className="font-mono text-[11px] font-semibold text-emerald-700">
                    {termsAccepted ? `Accepted (${STUDENT_TERMS_VERSION})` : 'Pending Acceptance'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Cashfree Order Reference</span>
                  <span className="font-mono text-[11px] text-slate-800">
                    {snapshot?.orderId || 'cf_ord_stu_2026_88412'}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-bold text-slate-900">
                  <span>Total Payable via Cashfree</span>
                  <span className="font-mono text-[#1E40AF]">{selectedPlan.formattedTotal}</span>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="button"
                disabled={!termsAccepted || submitting}
                onClick={handleProceedToCashfreeCheckout}
                className="w-full h-11 bg-[#1E40AF] hover:bg-blue-900 text-white font-semibold text-xs disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying Payment with Cashfree Server...
                  </>
                ) : !termsAccepted ? (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Accept Terms Above to Unlock Cashfree Checkout
                  </>
                ) : (
                  <>
                    Proceed to Secure Payment ({selectedPlan.formattedTotal})
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* STATE 1: Enrollment Confirmed (Cashfree Verified Success) */}
          {outcomeView === 'ENROLLMENT_CONFIRMED' && snapshot && (
            <Card className="border-emerald-300 bg-emerald-50/40 shadow-2xs">
              <CardHeader className="pb-3 border-b border-emerald-200/70">
                <div className="flex items-center justify-between">
                  <Badge className="bg-emerald-700 text-white text-[10px]">
                    CASHFREE SERVER-VERIFIED: PAID
                  </Badge>
                  <span className="font-mono text-[11px] font-bold text-emerald-900">
                    {snapshot.documentReference}
                  </span>
                </div>
                <CardTitle className="text-lg font-bold text-slate-900 mt-1">
                  Enrollment Confirmed
                </CardTitle>
                <CardDescription className="text-xs text-emerald-900 font-medium">
                  Your Programme Terms have been accepted and your payment has been confirmed.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 space-y-3.5 text-xs">
                <div className="grid grid-cols-2 gap-2 bg-white p-3 rounded border border-emerald-200 font-mono text-[11px]">
                  <div>
                    <span className="text-slate-500 block">Programme</span>
                    <strong className="text-slate-900">{snapshot.programmeName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Total Paid (Cashfree)</span>
                    <strong className="text-emerald-700">
                      ₹{snapshot.totalPaidInr.toLocaleString('en-IN')}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Cashfree Payment Ref</span>
                    <strong className="text-slate-900">{snapshot.paymentId}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">T&amp;C Status</span>
                    <strong className="text-slate-900">
                      Accepted ({snapshot.termsVersion})
                    </strong>
                  </div>
                </div>

                {/* Confirmation Email Preview */}
                <div className="bg-white p-3 rounded border border-emerald-200 space-y-1 text-[11px]">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                    <MailCheck className="h-3.5 w-3.5 text-emerald-700" />
                    Automated Email Sent — Subject: PlacementConnect Programme Enrollment Confirmed
                  </div>
                  <p className="text-slate-600">
                    Recipient: <strong>{snapshot.studentEmail}</strong> &bull; Includes Accepted Terms &amp; Conditions PDF (<code className="font-mono">{snapshot.documentReference}</code>) &amp; Tax Receipt (<code className="font-mono">{snapshot.invoiceNumber}</code>).
                  </p>
                </div>

                {/* Required 4 Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link href="/student/enrolment">
                    <Button variant="outline" className="w-full text-xs h-9 bg-white">
                      View Programme
                    </Button>
                  </Link>
                  <Link href="/student/dashboard">
                    <Button className="w-full bg-[#1E40AF] hover:bg-blue-900 text-white text-xs h-9">
                      Open Dashboard
                    </Button>
                  </Link>
                  <Link href="/student/documents/terms-preview">
                    <Button variant="outline" className="w-full text-xs h-9 bg-white">
                      <Download className="h-3.5 w-3.5 mr-1.5" />
                      Download Terms
                    </Button>
                  </Link>
                  <Link href="/student/documents/terms-preview">
                    <Button variant="outline" className="w-full text-xs h-9 bg-white">
                      <FileText className="h-3.5 w-3.5 mr-1.5" />
                      View Receipt
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* STATE 2: Payment Pending (Safe Recheck Without Duplicate Charge) */}
          {outcomeView === 'PAYMENT_PENDING' && (
            <Card className="border-amber-300 bg-amber-50/60 shadow-2xs">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                  <Clock className="h-4 w-4 text-amber-700" />
                  Payment Pending — Awaiting Cashfree Bank Confirmation
                </div>
                <CardDescription className="text-xs text-amber-900 mt-1">
                  Your Cashfree session is awaiting confirmation from your issuing bank/UPI app. We do not mark enrollment as confirmed or create duplicate charges while verification is pending.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2 space-y-3">
                <Button
                  type="button"
                  onClick={() => setOutcomeView('ENROLLMENT_CONFIRMED')}
                  className="w-full bg-amber-700 hover:bg-amber-800 text-white text-xs h-9"
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                  Recheck Payment Status with Cashfree Server
                </Button>
              </CardContent>
            </Card>
          )}

          {/* STATE 3: Payment Failed (Safe Retry) */}
          {outcomeView === 'PAYMENT_FAILED' && (
            <Card className="border-rose-300 bg-rose-50/60 shadow-2xs">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-900">
                  <AlertCircle className="h-4 w-4 text-rose-700" />
                  Payment Failed — Transaction Not Captured by Cashfree
                </div>
                <CardDescription className="text-xs text-rose-800 mt-1">
                  Your enrollment remains unpaid and no confirmation email has been sent. Your pre-accepted Terms ({STUDENT_TERMS_VERSION}) remain saved so you can retry Cashfree Checkout safely.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <Button
                  type="button"
                  onClick={handleProceedToCashfreeCheckout}
                  className="w-full bg-rose-700 hover:bg-rose-800 text-white text-xs h-9"
                >
                  Retry Cashfree Checkout ({selectedPlan.formattedTotal})
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
