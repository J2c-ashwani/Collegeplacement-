'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Building2,
  Briefcase,
  GraduationCap,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  QrCode,
  Loader2,
  AlertTriangle,
  Clock,
  FlaskConical,
} from 'lucide-react';
import { COMPANY_IDENTITY } from '@/config/company-identity';

type CodeValidationState =
  | { status: 'IDLE' }
  | { status: 'VERIFYING' }
  | { status: 'INVALID'; code: string; message: string }
  | { status: 'EXPIRED'; code: string; message: string };

export default function InstitutionalRegisterGatewayPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'STUDENT' | 'INSTITUTION_ADMIN' | 'EMPLOYER'>(
    'STUDENT'
  );
  // Empty by default so real students never mistake the sample code for their own college code
  const [campusCode, setCampusCode] = useState('');
  const [codeValidation, setCodeValidation] = useState<CodeValidationState>({ status: 'IDLE' });

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDuplicateAccount, setIsDuplicateAccount] = useState(false);

  const verifyAndLaunchCampusCode = async (rawCode: string) => {
    const cleaned = rawCode.trim().toUpperCase();
    if (!cleaned || cleaned.length < 4) {
      setCodeValidation({
        status: 'INVALID',
        code: cleaned || '—',
        message:
          'Please enter the official 6-character campus code provided by your college Training & Placement Office.',
      });
      return;
    }

    setCodeValidation({ status: 'VERIFYING' });

    try {
      const res = await fetch(`/api/register/${encodeURIComponent(cleaned)}`);
      const data = await res.json();

      if (!res.ok) {
        const errCode = data?.error?.code || '';
        const errMsg =
          data?.error?.message ||
          `No active college placement roster matches campus code "${cleaned}".`;

        if (errCode === 'MEMBERSHIP_EXPIRED' || cleaned === 'EXP2025') {
          setCodeValidation({
            status: 'EXPIRED',
            code: cleaned,
            message: errMsg,
          });
          return;
        }

        setCodeValidation({
          status: 'INVALID',
          code: cleaned,
          message: errMsg,
        });
        return;
      }

      router.push(`/register/${encodeURIComponent(cleaned)}`);
    } catch {
      // Fallback navigation if offline
      router.push(`/register/${encodeURIComponent(cleaned)}`);
    }
  };

  const handleStudentCodeRedirect = async (e: React.FormEvent) => {
    e.preventDefault();
    await verifyAndLaunchCampusCode(campusCode);
  };

  const handleRoleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setIsDuplicateAccount(false);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          phone,
          role: selectedTab,
          organizationName,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 409 || (data.error && String(data.error).toLowerCase().includes('already'))) {
          setIsDuplicateAccount(true);
        }
        throw new Error(data.error || 'Failed to create account.');
      }
      router.push('/login?registered=true');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-slate-50">
      {/* Left Brand Column — Quiet & Minimal so Right-Side Role Selector & Continue Action Dominate */}
      <div className="lg:col-span-5 bg-[#0F172A] text-white p-8 sm:p-12 flex flex-col justify-between border-r border-slate-800">
        <div className="space-y-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-[4px] bg-[#1E40AF] flex items-center justify-center font-mono font-bold text-sm text-white border border-blue-400/30">
              PC
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-white block leading-none">
                PlacementConnect
              </span>
              <span className="text-[11px] font-medium text-blue-300 block mt-0.5">
                Verified Campus Placement &amp; Hiring Platform
              </span>
            </div>
          </Link>

          <div className="space-y-4 pt-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-900/60 text-blue-200 border border-blue-700/60">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
              Verified Onboarding for Colleges, Employers &amp; Students
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
              Create Your PlacementConnect Account
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Every PlacementConnect account is linked to the appropriate institutional, employer, or student workspace so records, eligibility, and placement activity stay connected to the right organization.
            </p>
          </div>

          {/* Quiet Governance Checklist — No Duplication of the Right-Hand Role Selector */}
          <div className="pt-4 border-t border-slate-800/80 space-y-3">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              Workspace Verification Standards
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Student profiles are verified directly against your college&apos;s official placement roster.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Dedicated, isolated workspaces for Training &amp; Placement Offices and Corporate Hiring Teams.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Explicit programme terms and cohort eligibility checks before any student enrolment.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2">
          <span>{COMPANY_IDENTITY.legalUnitName}</span>
          <div className="flex items-center gap-2 text-slate-400">
            <Link href="/privacy" className="hover:text-white hover:underline transition-colors">
              Privacy
            </Link>
            <span>&middot;</span>
            <Link href="/terms" className="hover:text-white hover:underline transition-colors">
              Terms
            </Link>
            <span>&middot;</span>
            <Link href="/security" className="hover:text-white hover:underline transition-colors">
              Security
            </Link>
          </div>
        </div>
      </div>

      {/* Right Dominant Onboarding Action Column */}
      <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-12">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-xl space-y-6">
            <div className="space-y-1.5">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Choose Your Role to Begin Verified Onboarding
              </h2>
              <p className="text-xs text-slate-600">
                Already have a PlacementConnect account?{' '}
                <Link href="/login" className="font-semibold text-[#1E40AF] hover:underline">
                  Sign in to PlacementConnect &rarr;
                </Link>
              </p>
            </div>

            {/* 3-Role Selector */}
            <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-200/80 rounded-[4px]">
              <button
                type="button"
                onClick={() => {
                  setSelectedTab('STUDENT');
                  setError(null);
                  setIsDuplicateAccount(false);
                }}
                className={`py-2.5 px-3 rounded-[3px] text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  selectedTab === 'STUDENT'
                    ? 'bg-[#1E40AF] text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                <GraduationCap className="h-3.5 w-3.5" />
                Student (Campus Code)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedTab('INSTITUTION_ADMIN');
                  setError(null);
                  setIsDuplicateAccount(false);
                }}
                className={`py-2.5 px-3 rounded-[3px] text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  selectedTab === 'INSTITUTION_ADMIN'
                    ? 'bg-[#1E40AF] text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                <Building2 className="h-3.5 w-3.5" />
                College / TPO
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedTab('EMPLOYER');
                  setError(null);
                  setIsDuplicateAccount(false);
                }}
                className={`py-2.5 px-3 rounded-[3px] text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  selectedTab === 'EMPLOYER'
                    ? 'bg-[#1E40AF] text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                <Briefcase className="h-3.5 w-3.5" />
                Corporate Employer
              </button>
            </div>

            {/* Tab 1: Student Campus Code Lookup */}
            {selectedTab === 'STUDENT' ? (
              <div className="instrument-frame bg-white p-6 sm:p-8 space-y-5">
                <div className="space-y-1.5 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-blue-800">
                    <QrCode className="h-4 w-4" />
                    Roster-Verified Student Onboarding
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Enter Your Institution&apos;s Official Campus Code
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Student registration is linked directly to your college&apos;s placement roster so your academic profile, readiness scorecard, and interview opportunities remain verified through your Training &amp; Placement Office.
                  </p>
                </div>

                {/* Inline Interactive Validation Alerts (Invalid or Expired Campus Code) */}
                {codeValidation.status === 'INVALID' && (
                  <div className="p-3.5 rounded-md bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start gap-2.5">
                    <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="font-bold block text-rose-950">
                        Invalid Campus Code ({codeValidation.code})
                      </span>
                      <p className="text-rose-800 leading-relaxed">{codeValidation.message}</p>
                    </div>
                  </div>
                )}

                {codeValidation.status === 'EXPIRED' && (
                  <div className="p-3.5 rounded-md bg-amber-50 border border-amber-300 text-xs text-amber-950 flex items-start gap-2.5">
                    <Clock className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="font-bold block text-amber-950">
                        Expired or Paused Campus Code ({codeValidation.code})
                      </span>
                      <p className="text-amber-900 leading-relaxed">{codeValidation.message}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleStudentCodeRedirect} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="campusCodeInput" className="text-xs font-bold text-slate-700">
                      Official 6-Character Campus Code *
                    </Label>
                    <div className="flex flex-col sm:flex-row gap-2.5">
                      <Input
                        id="campusCodeInput"
                        value={campusCode}
                        disabled={codeValidation.status === 'VERIFYING'}
                        onChange={(e) => {
                          setCampusCode(e.target.value.toUpperCase());
                          if (codeValidation.status !== 'IDLE') {
                            setCodeValidation({ status: 'IDLE' });
                          }
                        }}
                        placeholder="Enter 6-character college code"
                        className="h-11 font-mono text-sm sm:text-base font-bold uppercase tracking-wider placeholder:font-sans placeholder:font-normal placeholder:normal-case placeholder:tracking-normal placeholder:text-xs placeholder:text-slate-400"
                        required
                      />
                      <Button
                        type="submit"
                        disabled={codeValidation.status === 'VERIFYING'}
                        className="h-11 px-6 bg-[#1E40AF] hover:bg-blue-900 text-white font-semibold shrink-0"
                      >
                        {codeValidation.status === 'VERIFYING' ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Verifying Code...
                          </>
                        ) : (
                          <>
                            Verify Campus Code &amp; Continue
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Step-by-step student journey clarity */}
                  <div className="p-3 rounded-[4px] bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
                    <span className="font-semibold text-slate-800 block mb-1">
                      How Student Onboarding Works:
                    </span>
                    <span>
                      1. Campus Code Verification &rarr; 2. Student Account Creation &rarr; 3. Programme Track Selection &rarr; 4. Terms Acceptance &rarr; 5. Fee Payment
                    </span>
                  </div>

                  {/* Unmistakable Demo Only Safeguard Box */}
                  <div className="p-3.5 rounded-[4px] bg-amber-50/70 border border-amber-200/90 text-xs text-slate-800 space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-200/80 text-amber-950">
                        <FlaskConical className="h-3 w-3 text-amber-800" />
                        Demo Only — Sample Campus Code
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setCampusCode('APX123');
                          verifyAndLaunchCampusCode('APX123');
                        }}
                        className="font-mono text-xs font-bold text-[#1E40AF] hover:underline"
                      >
                        Preview Sample Cohort (APX123) &rarr;
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      <strong>Do not use <code className="font-mono font-bold">APX123</code> for real student registration.</strong>{' '}
                      Real graduating students must enter the official code issued by their own college&apos;s Training &amp; Placement Office. Code{' '}
                      <code className="font-mono font-bold text-slate-800">APX123</code> connects only to the{' '}
                      <em>{COMPANY_IDENTITY.sampleCredentials.validInstitutionName}</em> sandbox for product evaluation.
                    </p>
                  </div>
                </form>
              </div>
            ) : (
              /* Tab 2 & 3: College / TPO or Corporate Employer Onboarding */
              <div className="instrument-frame bg-white p-6 sm:p-8 space-y-5">
                <div className="space-y-1.5 border-b border-slate-100 pb-4">
                  <div className="text-xs font-semibold text-blue-800">
                    {selectedTab === 'INSTITUTION_ADMIN'
                      ? 'College / TPO Onboarding'
                      : 'Corporate Employer — Hiring Partnership'}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {selectedTab === 'INSTITUTION_ADMIN'
                      ? 'Set Up Your Institutional Placement Workspace'
                      : 'Set Up Your Corporate Hiring Workspace'}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {selectedTab === 'INSTITUTION_ADMIN'
                      ? 'Create your Training & Placement Office account to onboard graduating cohorts, issue your official campus code, and manage verified placement records.'
                      : 'Set up your employer workspace to submit graduate hiring requirements and access institution-verified candidate cohorts.'}
                  </p>
                </div>

                {error && (
                  <div className="p-3.5 rounded bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-2">
                    <div className="font-semibold">{error}</div>
                    {isDuplicateAccount && (
                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        <Link
                          href="/login"
                          className="inline-flex items-center px-3 py-1.5 rounded bg-[#1E40AF] text-white font-semibold text-xs hover:bg-blue-900"
                        >
                          Sign In with Existing Account &rarr;
                        </Link>
                        <Link
                          href="/forgot-password"
                          className="text-xs font-semibold text-rose-800 underline"
                        >
                          Reset Password
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                <form onSubmit={handleRoleRegister} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="regName" className="text-xs font-semibold text-slate-700">
                        {selectedTab === 'INSTITUTION_ADMIN'
                          ? 'TPO / Principal Full Name *'
                          : 'Recruiter / HR Lead Name *'}
                      </Label>
                      <Input
                        id="regName"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={
                          selectedTab === 'INSTITUTION_ADMIN'
                            ? 'Dr. Vikramaditya Rao'
                            : 'Ananya Deshmukh'
                        }
                        className="h-10 text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="regOrg" className="text-xs font-semibold text-slate-700">
                        {selectedTab === 'INSTITUTION_ADMIN'
                          ? 'College / University Name *'
                          : 'Registered Company Name *'}
                      </Label>
                      <Input
                        id="regOrg"
                        required
                        value={organizationName}
                        onChange={(e) => setOrganizationName(e.target.value)}
                        placeholder={
                          selectedTab === 'INSTITUTION_ADMIN'
                            ? 'Vidya Mandir Institute of Technology'
                            : 'CloudScale Systems India Pvt Ltd'
                        }
                        className="h-10 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="regEmail" className="text-xs font-semibold text-slate-700">
                        Official Work / Institutional Email *
                      </Label>
                      <Input
                        id="regEmail"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={
                          selectedTab === 'INSTITUTION_ADMIN'
                            ? 'tpo@college.edu.in'
                            : 'careers@company.com'
                        }
                        className="h-10 text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="regPhone" className="text-xs font-semibold text-slate-700">
                        Direct Contact Number
                      </Label>
                      <Input
                        id="regPhone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98XXXXXXXX"
                        className="h-10 text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="regPassword" className="text-xs font-semibold text-slate-700">
                      Workspace Password (Min. 8 characters) *
                    </Label>
                    <Input
                      id="regPassword"
                      type="password"
                      minLength={8}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="h-10 text-sm"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 bg-[#1E40AF] hover:bg-blue-900 text-white font-semibold"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Workspace Account...
                      </>
                    ) : selectedTab === 'INSTITUTION_ADMIN' ? (
                      <>
                        Create College / TPO Account
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Create Corporate Employer Account
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Compact Bottom Legal Links on Right Panel */}
        <div className="pt-6 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
          <Link href="/privacy" className="hover:text-slate-800 hover:underline transition-colors">
            Privacy
          </Link>
          <span className="text-slate-300">&middot;</span>
          <Link href="/terms" className="hover:text-slate-800 hover:underline transition-colors">
            Terms
          </Link>
          <span className="text-slate-300">&middot;</span>
          <Link href="/security" className="hover:text-slate-800 hover:underline transition-colors">
            Security
          </Link>
        </div>
      </div>
    </div>
  );
}
