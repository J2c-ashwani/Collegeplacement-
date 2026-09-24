'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Lock,
  FileCheck2,
  ArrowRight,
  Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { COMPANY_IDENTITY } from '@/config/company-identity';
import { SAFE_TERMINOLOGY } from '@/config/brand-system';

export default function CredentialVerificationPortalPage() {
  const router = useRouter();
  const [credentialId, setCredentialId] = useState('');

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = credentialId.trim();
    if (!trimmed) return;
    router.push(`/verify/${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header: Credential Authenticity */}
        <div className="space-y-4 border-b border-slate-200 pb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-[#1E40AF]">
            <ShieldCheck className="h-3.5 w-3.5" />
            Official Credential &amp; Scorecard Verification
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Verify a Candidate Credential or Employability Scorecard
          </h1>
          <p className="text-base text-slate-600 max-w-3xl leading-relaxed">
            Corporate Talent Acquisition teams, background verification partners, and Training &amp; Placement Officers can confirm the authenticity, issue date, and institutional affiliation of any candidate scorecard issued under the{' '}
            <strong className="font-semibold text-slate-900">
              {SAFE_TERMINOLOGY.assessmentFrameworkName}
            </strong>
            .
          </p>
        </div>

        {/* Dominant Visual Idea: Interactive Verification Lookup */}
        <div className="bg-white rounded-lg border border-slate-300 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Enter Candidate Credential ID
              </h2>
              <p className="text-xs text-slate-500">
                Enter the identifier printed on the candidate&apos;s scorecard or LinkedIn certificate.
              </p>
            </div>
            <span className="font-mono text-xs px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
              e.g., STU-2026-000001
            </span>
          </div>

          <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input
                type="text"
                value={credentialId}
                onChange={(e) => setCredentialId(e.target.value)}
                placeholder="Enter Credential ID (e.g., STU-2026-000001)"
                aria-label="Candidate Credential ID"
                className="pl-10 h-11 font-mono text-sm bg-white border-slate-300 focus-visible:ring-blue-700"
              />
            </div>
            <Button
              type="submit"
              className="h-11 px-6 bg-[#1E40AF] hover:bg-blue-900 text-white font-semibold"
            >
              Verify Record
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          {/* Sample Records for Verification Testing */}
          <div className="pt-4 border-t border-slate-100">
            <div className="text-xs font-semibold text-slate-600 mb-3">
              Sample Credentials for Verification Testing:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <Link
                href={`/verify/${COMPANY_IDENTITY.sampleCredentials.validStudentId}`}
                className="group p-3.5 rounded-md border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 transition-colors flex flex-col justify-between gap-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    Valid Credential
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-emerald-700 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="font-mono text-xs text-emerald-950 font-semibold">
                  {COMPANY_IDENTITY.sampleCredentials.validStudentId}
                </div>
                <p className="text-[11px] text-emerald-800">
                  Active sample scorecard ({COMPANY_IDENTITY.sampleCredentials.validStudentName}).
                </p>
              </Link>

              <Link
                href="/verify/FAKE-123"
                className="group p-3.5 rounded-md border border-rose-200 bg-rose-50/50 hover:bg-rose-50 transition-colors flex flex-col justify-between gap-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-900">
                    <XCircle className="h-3.5 w-3.5 text-rose-600" />
                    Unrecognized ID
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-rose-700 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="font-mono text-xs text-rose-950 font-semibold">
                  FAKE-123
                </div>
                <p className="text-[11px] text-rose-800">
                  Demonstrates negative verification (zero candidate data exposed).
                </p>
              </Link>

              <Link
                href="/verify/REVOKED-2026-0009"
                className="group p-3.5 rounded-md border border-amber-200 bg-amber-50/50 hover:bg-amber-50 transition-colors flex flex-col justify-between gap-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                    Expired / Inactive ID
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-amber-700 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="font-mono text-xs text-amber-950 font-semibold">
                  REVOKED-2026-0009
                </div>
                <p className="text-[11px] text-amber-800">
                  Demonstrates expired or revoked credential handling.
                </p>
              </Link>
            </div>
          </div>
        </div>

        {/* 3 Verification Safeguards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-md border border-slate-200/90 p-6 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <FileCheck2 className="h-4 w-4 text-blue-700" />
              Exact Record Matching
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every query is matched strictly against issued credential identifiers. Unrecognized IDs return an explicit &ldquo;Record Not Found&rdquo; notice and never expose fallback records.
            </p>
          </div>
          <div className="bg-white rounded-md border border-slate-200/90 p-6 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Lock className="h-4 w-4 text-blue-700" />
              Candidate Privacy Controls
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Students control their profile visibility settings. Public verification confirms credential validity while respecting candidate privacy preferences.
            </p>
          </div>
          <div className="bg-white rounded-md border border-slate-200/90 p-6 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Building2 className="h-4 w-4 text-blue-700" />
              Institutional Provenance
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Each verified credential connects the candidate&apos;s 9-Dimension Employability Evaluation to their home institution&apos;s verified graduating batch roster.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
