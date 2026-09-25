import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, ArrowLeft, FileSignature, CheckCircle2 } from 'lucide-react';
import {
  INSTITUTION_MOU_VERSION,
  InstitutionalOnboardingSubmission,
  MOU_LIFECYCLE_STAGES,
  formatDualTimestamp,
  renderCanonicalMouText,
} from '@/config/legal-documents';
import { INSTITUTION_PARTNERSHIP_PLANS } from '@/config/commercial-policy';
import { COMPANY_IDENTITY } from '@/config/company-identity';

export default async function GeneratedInstitutionalMouDocumentPage({
  searchParams,
}: {
  searchParams?: Promise<{ stage?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  const resolvedParams = searchParams ? await searchParams : {};
  const isSignedExecutedView = resolvedParams?.stage === 'signed_executed';
  const currentExecutionStatus: 'DRAFT_READY_FOR_SIGNATURE' | 'SIGNED_EXECUTED' =
    isSignedExecutedView ? 'SIGNED_EXECUTED' : 'DRAFT_READY_FOR_SIGNATURE';

  let inst: any = null;
  try {
    inst =
      (session.user.institutionId
        ? await prisma.institution.findUnique({
            where: { id: session.user.institutionId },
          })
        : null) || (await prisma.institution.findFirst());
  } catch {
    inst = null;
  }

  const plan = INSTITUTION_PARTNERSHIP_PLANS[0];
  const fallbackSubmission: InstitutionalOnboardingSubmission = {
    institutionId: inst?.id || 'inst-apex-2026',
    legalName: inst?.name || 'Apex Institute of Technology',
    displayName: inst?.name || 'Apex Institute of Technology',
    institutionType: inst?.type || 'ENGINEERING',
    universityAffiliation:
      inst?.universityAffiliation || 'Dr. A.P.J. Abdul Kalam Technical University (AKTU)',
    accreditation: inst?.accreditation || 'NAAC A+ / AICTE Approved',
    registeredAddress: inst?.address || 'Knowledge Park III, Institutional Area',
    campusAddress: inst?.address || 'Knowledge Park III, Institutional Area',
    city: inst?.city || 'Greater Noida',
    state: inst?.state || 'Uttar Pradesh',
    pincode: inst?.pincode || '201306',
    website: inst?.website || 'https://apex.edu.in',
    gstin: '09AABCA8841K1Z5',
    tpoName: inst?.tpoName || 'Dr. R. K. Verma',
    tpoDesignation: 'Head — Training & Placement Office',
    tpoEmail: inst?.tpoEmail || 'tpo@apex.edu.in',
    tpoPhone: inst?.officialPhone || '+91 98112 44500',
    alternateContact: '+91 98112 44501',
    principalName: inst?.principalName || 'Prof. (Dr.) S. N. Deshmukh',
    principalEmail: 'principal@apex.edu.in',
    principalPhone: '+91 120 2324001',
    managementName: 'Shri Harshvardhan Goenka',
    managementDesignation: 'Chairman & Managing Trustee',
    authorizedSignatoryName: inst?.principalName || 'Prof. (Dr.) S. N. Deshmukh',
    authorizedSignatoryDesignation: 'Principal & Authorized Institutional Signatory',
    authorizedSignatoryEmail: 'principal@apex.edu.in',
    authorizedSignatoryPhone: '+91 120 2324001',
    departments: [
      'Computer Science & Engineering',
      'Information Technology',
      'Electronics & Communication',
    ],
    estimatedGraduatingCohort: inst?.estimatedStudentCount || 510,
    selectedPlanSlug: 'annual-1-year',
    selectedPlanName: plan.name,
    baseFeeInr: plan.basePriceInr,
    gstAmountInr: plan.gstAmountInr,
    totalPayableInr: plan.totalPriceInr,
    termsVersionAccepted: INSTITUTION_MOU_VERSION,
    termsAcceptedAt: '2026-07-10T09:30:00.000Z',
    paymentGateway: 'CASHFREE',
    cashfreeOrderId: 'cf_ord_inst_2026_apx123',
    cashfreePaymentId: 'cf_pay_inst_99801422',
    paymentMethod: 'CASHFREE_CHECKOUT',
    paymentVerificationStatus: 'PAID',
    uploadedDocuments: [],
    reviewStatus: 'APPROVED',
    reviewHistory: [],
    generatedMou: {
      mouReference: `PC-MOU-2026-${(inst?.registrationCode || 'APX123').toUpperCase()}`,
      version: INSTITUTION_MOU_VERSION,
      generatedAt: '2026-07-10T14:15:00.000Z',
      startDate: '2026-07-10',
      endDate: '2027-07-09',
      approvedBy: 'Ashwani Kumar (Super Admin)',
      executionStatus: currentExecutionStatus,
      counterSignedAt: isSignedExecutedView ? '2026-07-10T16:45:00.000Z' : undefined,
    },
  };

  const rendered = renderCanonicalMouText(fallbackSubmission);
  const activeStepNumber = isSignedExecutedView ? 7 : 4;

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link
          href="/institution/onboarding"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-[#1E40AF]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Institutional Onboarding &amp; MoU Registry
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/institution/mous/preview"
            className={`px-3 py-1 rounded text-xs font-mono border ${
              !isSignedExecutedView
                ? 'bg-amber-100 text-amber-950 border-amber-400 font-bold'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Stage 4 View: DRAFT / READY FOR SIGNATURE
          </Link>
          <Link
            href="/institution/mous/preview?stage=signed_executed"
            className={`px-3 py-1 rounded text-xs font-mono border ${
              isSignedExecutedView
                ? 'bg-emerald-100 text-emerald-950 border-emerald-400 font-bold'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Stage 6/7 View: SIGNED / EXECUTED MOU
          </Link>
        </div>
      </div>

      {/* 7-Stage Institutional MoU Lifecycle Bar (P1 #12) */}
      <div className="p-3 rounded-md border border-slate-200 bg-white space-y-2 print:hidden">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-mono font-bold uppercase tracking-wider text-slate-700">
            7-Stage Institutional MoU Lifecycle (Separating MoU Generation from Signed Execution)
          </span>
          <span className="font-mono text-[10px] text-blue-900 font-semibold">
            {isSignedExecutedView
              ? 'Current State: Stage 6/7 — Signed / Executed MoU (Active Partnership)'
              : 'Current State: Stage 4 — MoU Generated (DRAFT / READY FOR SIGNATURE — NOT YET EXECUTED)'}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-7 gap-1.5">
          {MOU_LIFECYCLE_STAGES.map((stage) => {
            const isDone = stage.step < activeStepNumber;
            const isCurrent = stage.step === activeStepNumber;
            return (
              <div
                key={stage.code}
                className={`p-1.5 rounded border text-[10px] ${
                  isCurrent
                    ? 'border-[#1E40AF] bg-blue-50 text-blue-950 font-bold'
                    : isDone
                    ? 'border-emerald-200 bg-emerald-50/60 text-emerald-950'
                    : 'border-slate-200 bg-slate-50 text-slate-500'
                }`}
              >
                <div className="font-mono text-[9px] uppercase">
                  Stage {stage.step} {isDone ? '✓' : isCurrent ? '●' : ''}
                </div>
                <div className="font-semibold truncate">{stage.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Formal Printable Institutional MoU Sheet */}
      <div className="bg-white border border-slate-300 shadow-sm rounded-md p-8 sm:p-10 space-y-6">
        {/* Unambiguous Document Execution Status Banner INSIDE the Printable MoU Sheet */}
        <div
          className={`p-3.5 rounded-md border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
            isSignedExecutedView
              ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
              : 'bg-amber-50 border-amber-400 text-amber-950'
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wide">
            {isSignedExecutedView ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0" />
            ) : (
              <FileSignature className="h-4 w-4 text-amber-800 shrink-0" />
            )}
            <span>DOCUMENT STATUS: {rendered.documentWatermarkLabel}</span>
          </div>
          <Badge
            className={
              isSignedExecutedView
                ? 'bg-emerald-800 text-white text-[10px] font-mono'
                : 'bg-amber-800 text-white text-[10px] font-mono'
            }
          >
            {isSignedExecutedView
              ? 'STAGE 6/7: BOTH PARTIES COUNTER-EXECUTED'
              : 'STAGE 4: AWAITING INSTITUTIONAL COUNTER-SIGNATURE'}
          </Badge>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b-2 border-slate-900 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#1E40AF]">
              <ShieldCheck className="h-4 w-4" />
              PlacementConnect Institutional Governance &amp; Legal Archive
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Institutional Placement Partnership Memorandum of Understanding (MoU)
            </h1>
            <p className="text-xs text-slate-600">
              Automatically Generated from Verified Institutional Onboarding Records &bull; Status: <strong>{rendered.documentWatermarkLabel}</strong>
            </p>
          </div>
          <div className="text-left sm:text-right font-mono text-xs space-y-0.5 bg-slate-50 p-3 rounded border border-slate-200">
            <div>
              <span className="text-slate-500">MoU Reference:</span>{' '}
              <strong className="text-slate-900">{rendered.mouReference}</strong>
            </div>
            <div>
              <span className="text-slate-500">Template Version:</span>{' '}
              <strong className="text-blue-800">{rendered.version}</strong>
            </div>
            <div>
              <span className="text-slate-500">Agreement Tenure:</span>{' '}
              <strong className="text-emerald-700">
                {rendered.startDate} &rarr; {rendered.endDate}
              </strong>
            </div>
          </div>
        </div>

        {/* Variable Resolution Table */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded bg-slate-50 border border-slate-200 text-xs">
          <div>
            <span className="text-slate-500 block text-[10px] font-mono uppercase">
              LEGAL INSTITUTION
            </span>
            <strong className="text-slate-900">{fallbackSubmission.legalName}</strong>
            <span className="block text-[11px] text-slate-500">
              {fallbackSubmission.city}, {fallbackSubmission.state}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] font-mono uppercase">
              TPO CONTACT RECORD
            </span>
            <strong className="text-slate-900">{fallbackSubmission.tpoName}</strong>
            <span className="block font-mono text-[11px] text-blue-800">
              {fallbackSubmission.tpoEmail}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] font-mono uppercase">
              AUTHORIZED SIGNATORY
            </span>
            <strong className="text-slate-900">
              {fallbackSubmission.authorizedSignatoryName}
            </strong>
            <span className="block text-[11px] text-slate-500">
              {fallbackSubmission.authorizedSignatoryDesignation}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] font-mono uppercase">
              PARTNERSHIP PLAN
            </span>
            <strong className="text-slate-900">{fallbackSubmission.selectedPlanName}</strong>
            <span className="block font-mono text-[11px] text-emerald-700 font-semibold">
              ₹{fallbackSubmission.totalPayableInr.toLocaleString('en-IN')} (Incl. GST)
            </span>
          </div>
        </div>

        {/* Rendered MoU Clauses */}
        <div className="space-y-4 pt-2">
          {rendered.sections.map((sec) => (
            <div key={sec.heading} className="space-y-1">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                {sec.heading}
              </h2>
              <p className="text-xs text-slate-700 leading-relaxed">{sec.content}</p>
            </div>
          ))}
        </div>

        {/* Dual Digital Execution Block with Stage 4 (Ready for Signature) vs Stage 6 (Signed/Executed) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t-2 border-slate-900 text-xs">
          <div className="p-4 rounded bg-slate-50 border border-slate-200 space-y-1">
            <div className="text-[10px] font-mono uppercase text-slate-500">
              FIRST PARTY — PLACEMENTCONNECT (STAGE 4: MOU GENERATED — READY FOR SIGNATURE)
            </div>
            <div className="font-bold text-slate-900">{COMPANY_IDENTITY.legalEntityName}</div>
            <div className="text-slate-600">
              Approved &amp; Generated by: {fallbackSubmission.generatedMou?.approvedBy}
            </div>
            <div className="font-mono text-[11px] text-emerald-700">
              Generated At: {formatDualTimestamp(fallbackSubmission.generatedMou?.generatedAt || '2026-07-10T14:15:00.000Z')}
            </div>
          </div>

          <div
            className={`p-4 rounded border space-y-1 ${
              isSignedExecutedView
                ? 'bg-emerald-50/60 border-emerald-300'
                : 'bg-amber-50/60 border-amber-300'
            }`}
          >
            <div className="text-[10px] font-mono uppercase text-slate-600">
              SECOND PARTY — PARTNER INSTITUTION ({isSignedExecutedView ? 'STAGE 6: SIGNED / EXECUTED MOU' : 'STAGE 4: PENDING COUNTER-SIGNATURE'})
            </div>
            <div className="font-bold text-slate-900">{fallbackSubmission.legalName}</div>
            <div className="text-slate-600">
              Signatory: {fallbackSubmission.authorizedSignatoryName} ({fallbackSubmission.authorizedSignatoryEmail})
            </div>
            <div
              className={`font-mono text-[11px] font-semibold ${
                isSignedExecutedView ? 'text-emerald-800' : 'text-amber-900'
              }`}
            >
              {isSignedExecutedView
                ? `Counter-Executed At: ${formatDualTimestamp(fallbackSubmission.generatedMou?.counterSignedAt || '2026-07-10T16:45:00.000Z')}`
                : 'Signature Status: DRAFT / READY FOR SIGNATURE — NOT YET EXECUTED'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
