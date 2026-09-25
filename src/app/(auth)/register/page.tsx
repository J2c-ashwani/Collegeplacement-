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
  QrCode,
} from 'lucide-react';
import { COMPANY_IDENTITY } from '@/config/company-identity';

export default function InstitutionalRegisterGatewayPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'STUDENT' | 'INSTITUTION_ADMIN' | 'EMPLOYER'>(
    'STUDENT'
  );
  const [campusCode, setCampusCode] = useState('APX123');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStudentCodeRedirect = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = campusCode.trim().toUpperCase() || 'APX123';
    router.push(`/register/${encodeURIComponent(cleaned)}`);
  };

  const handleRoleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
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
      {/* Left Brand & Onboarding Context Column (Light & Clean so Right Action Dominates) */}
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

          <div className="space-y-3 pt-2">
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

          {/* Clean Role Summaries — Pure Role Clarity Without Pricing or Internal Jargon */}
          <div className="space-y-3 pt-2">
            <div className="p-4 rounded-md bg-slate-900/90 border border-slate-800 space-y-1">
              <div className="text-xs font-semibold text-blue-300">
                1. Student — Campus Code Onboarding
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Use your college campus code (e.g., <code className="text-white font-mono">APX123</code>) to verify your institutional roster and create your student account.
              </p>
            </div>

            <div className="p-4 rounded-md bg-slate-900/90 border border-slate-800 space-y-1">
              <div className="text-xs font-semibold text-emerald-300">
                2. College / Training &amp; Placement Office
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Start your institutional onboarding and placement workspace setup.
              </p>
            </div>

            <div className="p-4 rounded-md bg-slate-900/90 border border-slate-800 space-y-1">
              <div className="text-xs font-semibold text-amber-300">
                3. Corporate Employer — Hiring Partnership
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Set up your employer workspace to submit graduate hiring requirements and access institution-verified candidate cohorts.
              </p>
            </div>
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
              <div className="instrument-frame bg-white p-6 sm:p-8 space-y-6">
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

                <form onSubmit={handleStudentCodeRedirect} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="campusCodeInput" className="text-xs font-bold text-slate-700">
                      Official 6-Character Campus Code *
                    </Label>
                    <div className="flex gap-2.5">
                      <Input
                        id="campusCodeInput"
                        value={campusCode}
                        onChange={(e) => setCampusCode(e.target.value.toUpperCase())}
                        placeholder="e.g., APX123"
                        className="h-11 font-mono text-base font-bold uppercase tracking-wider"
                        required
                      />
                      <Button
                        type="submit"
                        className="h-11 px-6 bg-[#1E40AF] hover:bg-blue-900 text-white font-semibold shrink-0"
                      >
                        Verify Campus Code &amp; Continue
                        <ArrowRight className="ml-2 h-4 w-4" />
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

                  <div className="p-3.5 rounded-[4px] bg-blue-50/80 border border-blue-200 text-xs text-blue-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-bold block">Testing or Reviewing Student Onboarding?</span>
                      <span>
                        Use sample campus code <code className="font-mono font-bold">APX123</code> ({COMPANY_IDENTITY.sampleCredentials.validInstitutionName}).
                      </span>
                    </div>
                    <Link
                      href="/register/APX123"
                      className="font-mono font-bold text-blue-800 underline shrink-0"
                    >
                      Continue with APX123 &rarr;
                    </Link>
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
                  <div className="p-3 rounded bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium">
                    {error}
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
                    {loading
                      ? 'Creating Workspace Account...'
                      : selectedTab === 'INSTITUTION_ADMIN'
                      ? 'Create College / TPO Account'
                      : 'Create Corporate Employer Account'}
                    <ArrowRight className="ml-2 h-4 w-4" />
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
