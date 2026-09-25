'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Download,
  ArrowRight,
  Loader2,
  CreditCard,
  MailCheck,
  CheckCircle2,
} from 'lucide-react';
import { INSTITUTION_PARTNERSHIP_PLANS } from '@/config/commercial-policy';
import {
  INSTITUTION_MOU_VERSION,
  INSTITUTIONAL_MOU_CLAUSES_SUMMARY,
  InstitutionalOnboardingSubmission,
} from '@/config/legal-documents';

export default function InstitutionOnboardingMouWorkflowPage() {
  const [submission, setSubmission] = useState<InstitutionalOnboardingSubmission | null>(null);
  const [selectedPlanSlug, setSelectedPlanSlug] = useState<string>('placement');
  const [termsAccepted, setTermsAccepted] = useState(true);

  const [legalName, setLegalName] = useState('Apex Institute of Technology');
  const [universityAffiliation, setUniversityAffiliation] = useState(
    'Dr. A.P.J. Abdul Kalam Technical University (AKTU)'
  );
  const [campusAddress, setCampusAddress] = useState('Knowledge Park III, Institutional Area');
  const [city, setCity] = useState('Greater Noida');
  const [stateName, setStateName] = useState('Uttar Pradesh');
  const [gstin, setGstin] = useState('09AABCA8841K1Z5');
  const [tpoName, setTpoName] = useState('Dr. R. K. Verma');
  const [tpoDesignation, setTpoDesignation] = useState('Head — Training & Placement Office');
  const [tpoEmail, setTpoEmail] = useState('tpo@apex.edu.in');
  const [tpoPhone, setTpoPhone] = useState('+91 98112 44500');
  const [principalName, setPrincipalName] = useState('Prof. (Dr.) S. N. Deshmukh');
  const [principalEmail, setPrincipalEmail] = useState('principal@apex.edu.in');
  const [authorizedSignatoryName, setAuthorizedSignatoryName] = useState(
    'Prof. (Dr.) S. N. Deshmukh'
  );
  const [authorizedSignatoryDesignation, setAuthorizedSignatoryDesignation] = useState(
    'Principal & Authorized Institutional Signatory'
  );
  const [authorizedSignatoryEmail, setAuthorizedSignatoryEmail] = useState(
    'principal@apex.edu.in'
  );
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/institutions/onboarding')
      .then((r) => r.json())
      .then((data) => {
        if (data?.submission) {
          const s: InstitutionalOnboardingSubmission = data.submission;
          setSubmission(s);
          setSelectedPlanSlug(s.selectedPlanSlug);
          setLegalName(s.legalName);
          setUniversityAffiliation(s.universityAffiliation);
          setCampusAddress(s.campusAddress);
          setCity(s.city);
          setStateName(s.state);
          setGstin(s.gstin);
          setTpoName(s.tpoName);
          setTpoDesignation(s.tpoDesignation);
          setTpoEmail(s.tpoEmail);
          setTpoPhone(s.tpoPhone);
          setPrincipalName(s.principalName);
          setPrincipalEmail(s.principalEmail);
          setAuthorizedSignatoryName(s.authorizedSignatoryName);
          setAuthorizedSignatoryDesignation(s.authorizedSignatoryDesignation);
          setAuthorizedSignatoryEmail(s.authorizedSignatoryEmail);
        }
      })
      .catch(() => {});
  }, []);

  const selectedPlan =
    INSTITUTION_PARTNERSHIP_PLANS.find((p) => p.slug === selectedPlanSlug) ||
    INSTITUTION_PARTNERSHIP_PLANS[0];

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/institutions/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SUBMIT_APPLICATION',
          selectedPlanSlug,
          termsAccepted,
          legalName,
          universityAffiliation,
          campusAddress,
          city,
          state: stateName,
          gstin,
          tpoName,
          tpoDesignation,
          tpoEmail,
          tpoPhone,
          principalName,
          principalEmail,
          authorizedSignatoryName,
          authorizedSignatoryDesignation,
          authorizedSignatoryEmail,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Submission failed');
      }
      setSubmission(data.submission);
      setStatusMessage(
        `Institutional Payment Confirmed via Cashfree (${data.submission.cashfreePaymentId}). Application status is now "PENDING INSTITUTIONAL REVIEW" — final MoU PDF will be generated automatically upon Super Admin approval.`
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error submitting onboarding form');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-blue-800">
            <span>INSTITUTIONAL PARTNERSHIP, CASHFREE CHECKOUT &amp; MOU WORKFLOW</span>
            <span>&bull;</span>
            <span>{INSTITUTION_MOU_VERSION}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            College Partnership Plan, Cashfree Payment &amp; Institutional MoU Onboarding
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Select your partnership plan, accept the institutional terms, complete payment via Cashfree Checkout, and submit your institutional signatory records for Super Admin approval and automatic MoU generation.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/institution/mous/preview">
            <Button size="sm" className="bg-[#1E40AF] hover:bg-blue-900 text-white text-xs h-8">
              <FileText className="h-3.5 w-3.5 mr-1.5" />
              Preview / Download Executed MoU PDF
            </Button>
          </Link>
          <Link href="/institution/mous">
            <Button size="sm" variant="outline" className="text-xs h-8">
              MoU Registry
            </Button>
          </Link>
        </div>
      </div>

      {/* Institutional Payment Confirmed / Application Review Banner */}
      {submission && (
        <div
          className={`p-4 rounded-md border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            submission.reviewStatus === 'APPROVED'
              ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
              : submission.reviewStatus === 'RETURNED_FOR_CORRECTION'
              ? 'bg-rose-50 border-rose-300 text-rose-950'
              : 'bg-blue-50/80 border-blue-300 text-slate-900'
          }`}
        >
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-emerald-700 text-white text-[10px]">
                INSTITUTIONAL PAYMENT CONFIRMED (CASHFREE: {submission.cashfreePaymentId})
              </Badge>
              <Badge
                className={
                  submission.reviewStatus === 'APPROVED'
                    ? 'bg-emerald-700 text-white text-[10px]'
                    : submission.reviewStatus === 'RETURNED_FOR_CORRECTION'
                    ? 'bg-rose-700 text-white text-[10px]'
                    : 'bg-amber-700 text-white text-[10px]'
                }
              >
                APPLICATION STATUS: {submission.reviewStatus}
              </Badge>
              {submission.generatedMou && (
                <Badge variant="outline" className="font-mono text-[10px] border-emerald-400 bg-white text-emerald-900">
                  MOU REF: {submission.generatedMou.mouReference}
                </Badge>
              )}
            </div>
            <p className="text-xs leading-relaxed">
              {submission.reviewStatus === 'APPROVED' && submission.generatedMou
                ? `Super Admin Approved — Institutional MoU (${submission.generatedMou.mouReference}) automatically generated (${submission.generatedMou.startDate} to ${submission.generatedMou.endDate}) and emailed ("PlacementConnect Institutional Partnership — MOU Ready") to ${submission.tpoEmail}.`
                : submission.reviewStatus === 'RETURNED_FOR_CORRECTION'
                ? `Action Required — Returned by Super Admin for Correction: "${submission.correctionNotes}"`
                : `Institutional Payment Confirmed for ${submission.selectedPlanName} (₹${submission.totalPayableInr.toLocaleString('en-IN')}). Note: Your MoU is NOT yet approved — it will be generated automatically after Super Admin reviews your institutional information and supporting documents.`}
            </p>
          </div>
          {submission.generatedMou && (
            <Link href="/institution/mous/preview" className="shrink-0">
              <Button size="sm" className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs">
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Download Final MoU PDF
              </Button>
            </Link>
          )}
        </div>
      )}

      {statusMessage && (
        <div className="p-3.5 rounded-md bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 font-medium flex items-center gap-2">
          <MailCheck className="h-4 w-4 text-emerald-700 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}
      {error && (
        <div className="p-3.5 rounded-md bg-rose-50 border border-rose-200 text-xs text-rose-900 font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmitApplication} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          {/* A. College Plan Selection */}
          <Card className="border-slate-200 shadow-2xs bg-white">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-base font-bold text-slate-900">
                Section A — Select Institutional Partnership Plan
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Official institutional partnership fee schedule and 100-student fee waiver eligibility.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {INSTITUTION_PARTNERSHIP_PLANS.map((plan) => {
                const isSelected = selectedPlanSlug === plan.slug;
                return (
                  <button
                    key={plan.slug}
                    type="button"
                    onClick={() => setSelectedPlanSlug(plan.slug)}
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
                        {plan.formattedBase}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        + 18% GST ({plan.formattedTotal} total)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{plan.waiverSummary}</p>
                  </button>
                );
              })}
            </CardContent>
          </Card>

          {/* B. Canonical Institutional Onboarding Information Form */}
          <Card className="border-slate-200 shadow-2xs bg-white">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-base font-bold text-slate-900">
                Section B — Institutional Leadership, TPO &amp; Signatory Record
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                These verified fields populate your executed Institutional MoU PDF automatically once Super Admin approves your application.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">
                    Legal Institution Name *
                  </Label>
                  <Input
                    value={legalName}
                    onChange={(e) => setLegalName(e.target.value)}
                    className="h-9 text-xs"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">
                    University Affiliation *
                  </Label>
                  <Input
                    value={universityAffiliation}
                    onChange={(e) => setUniversityAffiliation(e.target.value)}
                    className="h-9 text-xs"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">
                    Campus Address *
                  </Label>
                  <Input
                    value={campusAddress}
                    onChange={(e) => setCampusAddress(e.target.value)}
                    className="h-9 text-xs"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-slate-700">City *</Label>
                    <Input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="h-9 text-xs"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-slate-700">GSTIN</Label>
                    <Input
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value)}
                      className="h-9 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">
                    TPO Full Name *
                  </Label>
                  <Input
                    value={tpoName}
                    onChange={(e) => setTpoName(e.target.value)}
                    className="h-9 text-xs"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">
                    TPO Official Email *
                  </Label>
                  <Input
                    value={tpoEmail}
                    onChange={(e) => setTpoEmail(e.target.value)}
                    className="h-9 text-xs"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">
                    TPO Official Phone *
                  </Label>
                  <Input
                    value={tpoPhone}
                    onChange={(e) => setTpoPhone(e.target.value)}
                    className="h-9 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">
                    Principal Name *
                  </Label>
                  <Input
                    value={principalName}
                    onChange={(e) => setPrincipalName(e.target.value)}
                    className="h-9 text-xs"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">
                    Authorized Signatory *
                  </Label>
                  <Input
                    value={authorizedSignatoryName}
                    onChange={(e) => setAuthorizedSignatoryName(e.target.value)}
                    className="h-9 text-xs"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">
                    Signatory Official Email *
                  </Label>
                  <Input
                    value={authorizedSignatoryEmail}
                    onChange={(e) => setAuthorizedSignatoryEmail(e.target.value)}
                    className="h-9 text-xs"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right 4 Columns: Cashfree Payment Context, Supporting Document Vault & Submission */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-slate-200 shadow-2xs bg-white">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold text-slate-900">
                  Section C — Cashfree Payment Summary
                </CardTitle>
                <Badge variant="outline" className="font-mono text-[10px] border-blue-200 bg-blue-50 text-blue-800">
                  GATEWAY: CASHFREE
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600">Institutional Plan</span>
                <span className="font-bold text-slate-900">{selectedPlan.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Selected Plan Period</span>
                <span className="font-mono text-slate-800">{selectedPlan.durationYears} Year(s)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Base Fee</span>
                <span className="font-mono font-semibold text-slate-900">{selectedPlan.formattedBase}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Statutory GST (18%)</span>
                <span className="font-mono font-semibold text-slate-900">{selectedPlan.formattedGst}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Cashfree Order Ref</span>
                <span className="font-mono text-[11px] text-slate-700">
                  {submission?.cashfreeOrderId || 'cf_ord_inst_2026_apx123'}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-bold text-slate-900">
                <span>Total Payable via Cashfree</span>
                <span className="font-mono text-[#1E40AF]">{selectedPlan.formattedTotal}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-2xs bg-white">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-base font-bold text-slate-900">
                Section D — Supporting Documents &amp; Terms Acceptance
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3.5">
              {(submission?.uploadedDocuments || [
                {
                  code: 'AUTH_SIGNATORY_LETTER',
                  title: 'Institutional Signatory Authorization Letter',
                  filename: 'Apex_Signatory_Authorization_2026.pdf',
                  status: 'VERIFIED',
                },
                {
                  code: 'AICTE_AFFILIATION_CERT',
                  title: 'AICTE / University Affiliation Certificate',
                  filename: 'Apex_AICTE_Extension_Of_Approval_2026.pdf',
                  status: 'VERIFIED',
                },
                {
                  code: 'GST_PAN_CERTIFICATE',
                  title: 'Institutional GSTIN & PAN Registration',
                  filename: 'Apex_GST_Registration_09AABCA8841K1Z5.pdf',
                  status: 'VERIFIED',
                },
              ]).map((doc) => (
                <div
                  key={doc.code}
                  className="p-2.5 rounded border border-slate-200 bg-slate-50 flex items-center justify-between gap-2 text-xs"
                >
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900 truncate">{doc.title}</div>
                    <div className="font-mono text-[10px] text-slate-500 truncate">{doc.filename}</div>
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] shrink-0">
                    {doc.status}
                  </Badge>
                </div>
              ))}

              <label className="flex items-start gap-2.5 text-xs cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#1E40AF]"
                />
                <span className="text-slate-700 leading-relaxed">
                  I accept the PlacementConnect Institutional Partnership &amp; MoU Terms (<strong>{INSTITUTION_MOU_VERSION}</strong>) on behalf of {legalName}.
                </span>
              </label>

              <Button
                type="submit"
                disabled={!termsAccepted || submitting}
                className="w-full h-11 bg-[#1E40AF] hover:bg-blue-900 text-white font-semibold text-xs"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing Cashfree Checkout &amp; Submitting Application...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Proceed to Secure Payment ({selectedPlan.formattedTotal})
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
