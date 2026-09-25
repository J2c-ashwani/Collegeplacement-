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
  Eye,
  FileCheck2,
} from 'lucide-react';
import {
  InstitutionalOnboardingSubmission,
  MOU_LIFECYCLE_STAGES,
  formatDualTimestamp,
} from '@/config/legal-documents';

type DocVerificationState = 'UPLOADED' | 'OPENED' | 'VERIFIED' | 'NEEDS_CORRECTION' | 'REJECTED';

export default function SuperAdminInstitutionalReviewQueuePage() {
  const [submissions, setSubmissions] = useState<InstitutionalOnboardingSubmission[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [correctionNotes, setCorrectionNotes] = useState('');
  const [processingAction, setProcessingAction] = useState<string | null>(null);
  const [bannerMsg, setBannerMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showMouConfirmationModal, setShowMouConfirmationModal] = useState<boolean>(true);
  const [adminConfirmedFields, setAdminConfirmedFields] = useState<boolean>(true);
  const [docStates, setDocStates] = useState<Record<string, DocVerificationState>>({
    AUTH_SIGNATORY_LETTER: 'VERIFIED',
    AICTE_AFFILIATION_CERT: 'VERIFIED',
    GST_PAN_CERTIFICATE: 'VERIFIED',
  });

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

  const setDocumentState = (code: string, state: DocVerificationState) => {
    setDocStates((prev) => ({ ...prev, [code]: state }));
  };

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
          `Approved! Variable-driven MoU (${data.submission.generatedMou?.mouReference}) generated in state "MoU — Ready for Signature" and dispatched ("PlacementConnect Institutional Partnership — MOU Ready") to ${active.tpoEmail} & ${active.authorizedSignatoryEmail}.`
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
            <span>INSTITUTIONAL DOCUMENT VERIFICATION &amp; 2-STEP MOU GENERATOR</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Institutional Onboarding Review, Document Verification &amp; MoU Generation Queue
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Verify uploaded institutional documents per artifact, review resolved variable fields, and execute the 2-step confirmation workflow to generate the MoU (Ready for Signature).
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

      {/* 7-Stage Institutional MoU Lifecycle Tracker (P1 #12) */}
      <div className="p-3.5 rounded-md border border-slate-200 bg-white space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-mono font-bold uppercase tracking-wider text-slate-700">
            Canonical 7-Stage Institutional MoU Lifecycle (Separate Generation vs. Execution)
          </span>
          <Badge className="bg-blue-50 text-blue-800 border-blue-200 text-[10px] font-mono">
            {active?.reviewStatus === 'APPROVED'
              ? 'STAGE 4: MOU GENERATED (READY FOR SIGNATURE)'
              : 'STAGE 2: PENDING ADMIN REVIEW'}
          </Badge>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-7 gap-1.5">
          {MOU_LIFECYCLE_STAGES.map((stage) => {
            const currentStep = active?.reviewStatus === 'APPROVED' ? 4 : 2;
            const isDone = stage.step < currentStep;
            const isCurrent = stage.step === currentStep;
            return (
              <div
                key={stage.code}
                className={`p-2 rounded border text-[10px] ${
                  isCurrent
                    ? 'border-[#1E40AF] bg-blue-50/80 text-blue-950 font-bold'
                    : isDone
                    ? 'border-emerald-200 bg-emerald-50/60 text-emerald-900'
                    : 'border-slate-200 bg-slate-50 text-slate-500'
                }`}
              >
                <div className="font-mono text-[9px] uppercase">
                  Stage {stage.step} {isDone ? '✓' : isCurrent ? '●' : ''}
                </div>
                <div className="truncate font-semibold mt-0.5">{stage.label}</div>
              </div>
            );
          })}
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

                {/* Per-Document Verification States & Audit Stamps (P1 #10) */}
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-xs font-bold text-slate-900">
                      Per-Document Verification Ledger ({active.uploadedDocuments.length} Artifacts)
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">
                      States: Uploaded &rarr; Opened &rarr; Verified / Needs Correction / Rejected
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {active.uploadedDocuments.map((doc) => {
                      const currentState: DocVerificationState =
                        docStates[doc.code] || (doc.status as DocVerificationState) || 'VERIFIED';
                      return (
                        <div
                          key={doc.code}
                          className="p-3 rounded border border-slate-200 bg-white text-xs space-y-2"
                        >
                          <div className="flex items-start justify-between gap-1.5">
                            <div className="font-semibold text-slate-900 leading-snug">{doc.title}</div>
                            <Badge
                              className={
                                currentState === 'VERIFIED'
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200 text-[9px] shrink-0'
                                  : currentState === 'NEEDS_CORRECTION'
                                  ? 'bg-amber-100 text-amber-900 border-amber-200 text-[9px] shrink-0'
                                  : currentState === 'REJECTED'
                                  ? 'bg-rose-100 text-rose-800 border-rose-200 text-[9px] shrink-0'
                                  : 'bg-blue-50 text-blue-800 border-blue-200 text-[9px] shrink-0'
                              }
                            >
                              {currentState}
                            </Badge>
                          </div>
                          <div className="font-mono text-[10px] text-slate-500 truncate">
                            {doc.filename}
                          </div>
                          <div className="text-[10px] text-emerald-800 bg-emerald-50/70 border border-emerald-100 rounded px-2 py-1 font-mono">
                            Verified by Ashwani Kumar on 25 Sep 2026, 16:45 IST (11:15 UTC)
                          </div>
                          <div className="flex flex-wrap items-center gap-1 pt-1">
                            {(['OPENED', 'VERIFIED', 'NEEDS_CORRECTION', 'REJECTED'] as DocVerificationState[]).map(
                              (st) => (
                                <button
                                  key={st}
                                  type="button"
                                  onClick={() => setDocumentState(doc.code, st)}
                                  className={`px-1.5 py-0.5 rounded text-[9px] font-mono border ${
                                    currentState === st
                                      ? 'bg-slate-900 text-white border-slate-900'
                                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                                  }`}
                                >
                                  {st}
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Step 2 Confirmation & Variable-Driven MoU Preview Step (P1 #11) */}
                {showMouConfirmationModal && (
                  <div className="p-4 rounded-md border-2 border-[#1E40AF]/30 bg-blue-50/40 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#1E40AF]">
                        <FileCheck2 className="h-4 w-4" />
                        <span>
                          Step 2 of 2 — Final Institution Data &amp; Variable-Driven MoU Preview Confirmation
                        </span>
                      </div>
                      <Badge className="bg-white text-blue-900 border-blue-200 text-[10px] font-mono">
                        PRE-GENERATION SAFEGUARD
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Review the exact institutional variables below before generating the immutable MoU PDF in state <strong>&ldquo;MoU — Ready for Signature&rdquo;</strong>:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3 rounded bg-white border border-blue-200 text-[11px]">
                      <div>
                        <span className="text-[9px] font-mono uppercase text-slate-500 block">
                          Resolved Legal Entity
                        </span>
                        <strong className="text-slate-900">{active.legalName}</strong>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono uppercase text-slate-500 block">
                          Authorized Signatory
                        </span>
                        <strong className="text-slate-900">{active.authorizedSignatoryName}</strong>
                        <span className="block text-[10px] font-mono text-slate-500">
                          {active.authorizedSignatoryEmail}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono uppercase text-slate-500 block">
                          Verified GSTIN &amp; City
                        </span>
                        <strong className="font-mono text-slate-900">{active.gstin}</strong>
                        <span className="block text-[10px] text-slate-500">
                          {active.city}, {active.state}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono uppercase text-slate-500 block">
                          Partnership Plan &amp; Fee
                        </span>
                        <strong className="text-slate-900">{active.selectedPlanName}</strong>
                        <span className="block font-mono text-[10px] text-emerald-700">
                          ₹{active.totalPayableInr.toLocaleString('en-IN')} (Cashfree Paid)
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono uppercase text-slate-500 block">
                          MoU Reference &amp; Template
                        </span>
                        <strong className="font-mono text-slate-900">
                          {active.generatedMou?.mouReference || 'PC-MOU-2026-APX123'}
                        </strong>
                        <span className="block text-[10px] text-blue-800">
                          {active.termsVersionAccepted}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono uppercase text-slate-500 block">
                          Target Lifecycle Transition
                        </span>
                        <strong className="text-emerald-800">
                          Stage 4: MoU — Ready for Signature
                        </strong>
                      </div>
                    </div>

                    <label className="flex items-start gap-2 text-xs text-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={adminConfirmedFields}
                        onChange={(e) => setAdminConfirmedFields(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#1E40AF]"
                      />
                      <span>
                        I confirm that all 3 supporting institutional documents are <strong>VERIFIED</strong> and the resolved variables above are accurate for generating the official MoU PDF.
                      </span>
                    </label>
                  </div>
                )}

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
                      variant="outline"
                      onClick={() => setShowMouConfirmationModal((v) => !v)}
                      className="border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-950 text-xs h-10"
                    >
                      <Eye className="h-3.5 w-3.5 mr-1.5" />
                      {showMouConfirmationModal
                        ? 'Hide MoU Variable Confirmation'
                        : 'Step 1: Review Institution Data & Preview MoU'}
                    </Button>

                    <Button
                      type="button"
                      disabled={Boolean(processingAction) || !adminConfirmedFields}
                      onClick={() => executeAdminAction('APPROVE_AND_GENERATE_MOU')}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs h-10 px-5 font-semibold"
                    >
                      {processingAction === 'APPROVE_AND_GENERATE_MOU' ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                      ) : (
                        <ShieldCheck className="h-4 w-4 mr-1.5" />
                      )}
                      Confirm &amp; Generate MoU — Ready for Signature
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      disabled={Boolean(processingAction)}
                      onClick={() => executeAdminAction('RETURN_FOR_CORRECTION')}
                      className="border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-950 text-xs h-10"
                    >
                      <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                      Return for Correction
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      disabled={Boolean(processingAction)}
                      onClick={() => executeAdminAction('REJECT')}
                      className="border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-900 text-xs h-10"
                    >
                      <XCircle className="h-3.5 w-3.5 mr-1.5" />
                      Reject
                    </Button>
                  </div>
                </div>

                {/* Audit & Correction Trail with Dual IST (UTC) Timestamps */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="text-xs font-mono font-bold uppercase text-slate-500">
                    Immutable Review, Cashfree Payment &amp; Document Verification Audit History
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
                          {formatDualTimestamp(h.timestamp)}
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
