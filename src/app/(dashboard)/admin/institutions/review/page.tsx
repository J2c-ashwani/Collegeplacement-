'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  ShieldCheck,
  CheckCircle2,
  FileText,
  RotateCcw,
  XCircle,
  CreditCard,
  Loader2,
} from 'lucide-react';
import { InstitutionalOnboardingSubmission } from '@/config/legal-documents';

export default function SuperAdminInstitutionalReviewQueuePage() {
  const [submissions, setSubmissions] = useState<InstitutionalOnboardingSubmission[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [correctionNotes, setCorrectionNotes] = useState('');
  const [processingAction, setProcessingAction] = useState<string | null>(null);
  const [bannerMsg, setBannerMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadQueue = () => {
    fetch('/api/institutions/onboarding?scope=all')
      .then((r) => r.json())
      .then((data) => {
        if (data?.submissions?.length) {
          setSubmissions(data.submissions);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadQueue();
  }, []);

  const active = submissions[selectedIdx] || null;

  const executeAdminAction = async (
    action: 'APPROVE_AND_GENERATE_MOU' | 'RETURN_FOR_CORRECTION' | 'REJECT'
  ) => {
    if (!active) return;
    setProcessingAction(action);
    setBannerMsg(null);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/institutions/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          institutionId: active.institutionId,
          correctionNotes:
            correctionNotes ||
            'Please upload a stamped copy of the Authorized Signatory letter and verify GSTIN.',
          rejectionReason: correctionNotes || 'Failed institutional verification criteria.',
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Action failed');
      }

      const updated = submissions.map((item, i) =>
        i === selectedIdx ? data.submission : item
      );
      setSubmissions(updated);

      if (action === 'APPROVE_AND_GENERATE_MOU') {
        setBannerMsg(
          `Approved! Variable-driven MoU (${data.submission.generatedMou?.mouReference}) automatically generated, stored as PDF, and emailed ("PlacementConnect Institutional Partnership — MOU Ready") to ${active.tpoEmail} & ${active.authorizedSignatoryEmail}.`
        );
      } else if (action === 'RETURN_FOR_CORRECTION') {
        setBannerMsg(
          `Application returned to ${active.tpoName} (${active.tpoEmail}) for correction with preserved audit log.`
        );
      } else if (action === 'REJECT') {
        setBannerMsg(`Institutional application marked as REJECTED.`);
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Operation failed');
    } finally {
      setProcessingAction(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-800 uppercase">
            <span>SUPER ADMIN OPERATIONS CONTROL</span>
            <span>&bull;</span>
            <span>PENDING INSTITUTIONAL REVIEW &amp; MOU GENERATOR</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Institutional Onboarding Review, Cashfree Telemetry &amp; Automated MoU Queue
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Inspect Cashfree-verified payment records, institutional leadership details, and uploaded documents, and trigger automatic variable-driven MoU PDF generation.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/institution/mous/preview">
            <Button size="sm" variant="outline" className="text-xs h-8">
              <FileText className="h-3.5 w-3.5 mr-1.5" />
              Inspect Generated MoU PDF
            </Button>
          </Link>
          <Link href="/admin/institutions">
            <Button size="sm" variant="outline" className="text-xs h-8">
              All Partner Colleges
            </Button>
          </Link>
        </div>
      </div>

      {bannerMsg && (
        <div className="p-3.5 rounded-md bg-emerald-50 border border-emerald-300 text-xs text-emerald-950 font-semibold">
          {bannerMsg}
        </div>
      )}
      {errorMsg && (
        <div className="p-3.5 rounded-md bg-rose-50 border border-rose-300 text-xs text-rose-950 font-semibold">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 4 Columns: Queue List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
            Institutional Applications ({submissions.length})
          </div>
          {submissions.map((item, idx) => {
            const isSelected = idx === selectedIdx;
            return (
              <button
                key={item.institutionId + idx}
                type="button"
                onClick={() => {
                  setSelectedIdx(idx);
                  setBannerMsg(null);
                  setErrorMsg(null);
                }}
                className={`w-full text-left p-4 rounded-md border transition-all space-y-2 ${
                  isSelected
                    ? 'border-[#1E40AF] bg-blue-50/50 ring-1 ring-[#1E40AF]'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-900 truncate">
                    {item.legalName}
                  </span>
                  <Badge
                    className={
                      item.reviewStatus === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800 text-[10px]'
                        : item.reviewStatus === 'RETURNED_FOR_CORRECTION'
                        ? 'bg-rose-100 text-rose-800 text-[10px]'
                        : 'bg-amber-100 text-amber-900 text-[10px]'
                    }
                  >
                    {item.reviewStatus === 'PENDING_INSTITUTIONAL_REVIEW'
                      ? 'PENDING REVIEW'
                      : item.reviewStatus}
                  </Badge>
                </div>
                <div className="text-[11px] text-slate-600">
                  {item.city}, {item.state} &bull; <strong>{item.selectedPlanName}</strong>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-700">
                    ₹{item.totalPayableInr.toLocaleString('en-IN')} (CASHFREE)
                  </span>
                  <span className="text-emerald-700 font-bold">
                    {item.paymentVerificationStatus}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right 8 Columns: Detailed Inspection & Super Admin Action Console */}
        <div className="lg:col-span-8 space-y-6">
          {active && (
            <Card className="border-slate-200 shadow-2xs bg-white">
              <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-start justify-between">
                <div>
                  <div className="text-xs font-mono font-bold text-blue-800">
                    APPLICATION ID: {active.institutionId} &bull; TERMS: {active.termsVersionAccepted}
                  </div>
                  <CardTitle className="text-lg font-bold text-slate-900 mt-0.5">
                    {active.legalName}
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-600">
                    {active.universityAffiliation} &bull; {active.accreditation} &bull; GSTIN: {active.gstin}
                  </CardDescription>
                </div>
                <Badge
                  className={
                    active.reviewStatus === 'APPROVED'
                      ? 'bg-emerald-700 text-white text-xs'
                      : active.reviewStatus === 'RETURNED_FOR_CORRECTION'
                      ? 'bg-rose-700 text-white text-xs'
                      : 'bg-amber-600 text-white text-xs'
                  }
                >
                  {active.reviewStatus}
                </Badge>
              </CardHeader>
              <CardContent className="p-5 space-y-5">
                {/* Cashfree Payment Telemetry Bar */}
                <div className="p-4 rounded-md border bg-emerald-50/70 border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1 text-xs">
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-emerald-700" />
                      <span>
                        Cashfree Verified Payment: ₹{active.totalPayableInr.toLocaleString('en-IN')} (Base ₹{active.baseFeeInr.toLocaleString('en-IN')} + ₹{active.gstAmountInr.toLocaleString('en-IN')} GST)
                      </span>
                    </div>
                    <div className="font-mono text-[11px] text-slate-700">
                      Gateway: <strong>CASHFREE</strong> &bull; Order ID: <strong>{active.cashfreeOrderId}</strong> &bull; Payment Ref: <strong>{active.cashfreePaymentId}</strong>
                    </div>
                  </div>
                  <Badge className="bg-emerald-700 text-white text-[10px] font-mono shrink-0">
                    WEBHOOK &amp; SERVER VERIFIED: {active.paymentVerificationStatus}
                  </Badge>
                </div>

                {/* Institutional Leadership & Signatory Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-mono uppercase text-slate-500 block">
                      TPO / Placement Office
                    </span>
                    <strong className="text-slate-900 block mt-0.5">{active.tpoName}</strong>
                    <span className="text-slate-600 block text-[11px]">{active.tpoDesignation}</span>
                    <span className="font-mono text-[11px] text-blue-800 block mt-0.5">
                      {active.tpoEmail}
                    </span>
                    <span className="font-mono text-[11px] text-slate-500 block">
                      {active.tpoPhone}
                    </span>
                  </div>

                  <div className="p-3 rounded bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-mono uppercase text-slate-500 block">
                      Principal &amp; Management
                    </span>
                    <strong className="text-slate-900 block mt-0.5">{active.principalName}</strong>
                    <span className="font-mono text-[11px] text-slate-600 block">
                      {active.principalEmail}
                    </span>
                    <span className="text-slate-500 block text-[11px] mt-1">
                      Trust/Mgmt: {active.managementName}
                    </span>
                  </div>

                  <div className="p-3 rounded bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-mono uppercase text-slate-500 block">
                      Authorized MoU Signatory
                    </span>
                    <strong className="text-slate-900 block mt-0.5">
                      {active.authorizedSignatoryName}
                    </strong>
                    <span className="text-slate-600 block text-[11px]">
                      {active.authorizedSignatoryDesignation}
                    </span>
                    <span className="font-mono text-[11px] text-emerald-700 block mt-0.5">
                      Accepted {active.termsVersionAccepted}
                    </span>
                  </div>
                </div>

                {/* Uploaded Supporting Documents */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-900">
                    Uploaded Institutional Supporting Documents ({active.uploadedDocuments.length})
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {active.uploadedDocuments.map((doc) => (
                      <div
                        key={doc.code}
                        className="p-2.5 rounded border border-slate-200 bg-white text-xs space-y-1"
                      >
                        <div className="font-semibold text-slate-900 truncate">{doc.title}</div>
                        <div className="font-mono text-[10px] text-slate-500 truncate">
                          {doc.filename}
                        </div>
                        <Badge className="bg-blue-50 text-blue-800 border-blue-200 text-[10px]">
                          {doc.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Super Admin Decision Controls */}
                <div className="pt-4 border-t border-slate-200 space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 block">
                      Super Admin Review / Correction Notes (Sent to TPO if Returned for Correction or Rejected)
                    </label>
                    <Input
                      value={correctionNotes}
                      onChange={(e) => setCorrectionNotes(e.target.value)}
                      placeholder="Enter specific document or field correction instructions if returning..."
                      className="h-9 text-xs"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      type="button"
                      disabled={Boolean(processingAction)}
                      onClick={() => executeAdminAction('APPROVE_AND_GENERATE_MOU')}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs h-10 px-5 font-semibold"
                    >
                      {processingAction === 'APPROVE_AND_GENERATE_MOU' ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                      ) : (
                        <ShieldCheck className="h-4 w-4 mr-1.5" />
                      )}
                      1. Approve &amp; Auto-Generate Final MoU PDF
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      disabled={Boolean(processingAction)}
                      onClick={() => executeAdminAction('RETURN_FOR_CORRECTION')}
                      className="border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-950 text-xs h-10"
                    >
                      <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                      2. Return for Correction
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      disabled={Boolean(processingAction)}
                      onClick={() => executeAdminAction('REJECT')}
                      className="border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-900 text-xs h-10"
                    >
                      <XCircle className="h-3.5 w-3.5 mr-1.5" />
                      3. Reject
                    </Button>
                  </div>
                </div>

                {/* Audit & Correction Trail */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="text-xs font-mono font-bold uppercase text-slate-500">
                    Immutable Review, Cashfree Payment &amp; Correction Audit History
                  </div>
                  <div className="space-y-1.5">
                    {active.reviewHistory.map((h, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded bg-slate-50 border border-slate-200 text-[11px] flex flex-col sm:flex-row sm:items-center justify-between gap-1"
                      >
                        <div>
                          <strong className="text-slate-900">[{h.action}]</strong>{' '}
                          <span className="font-semibold text-blue-800">{h.actor}:</span>{' '}
                          <span className="text-slate-700">{h.note}</span>
                        </div>
                        <span className="font-mono text-[10px] text-slate-500 shrink-0">
                          {new Date(h.timestamp).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
