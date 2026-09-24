'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Mail,
  Building2,
  Briefcase,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Clock,
  FileText,
} from 'lucide-react';
import { COMPANY_IDENTITY } from '@/config/company-identity';

export default function ContactPage() {
  const [roleType, setRoleType] = useState<'INSTITUTION' | 'EMPLOYER' | 'STUDENT'>('INSTITUTION');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ticketId, setTicketId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          organization,
          roleType,
          subject,
          message,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit inquiry.');
      }
      setTicketId(data.ticketId);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to submit inquiry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Top Institutional Header */}
        <div className="space-y-4 border-b border-slate-200 pb-8">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-blue-900">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 font-semibold">
              Institutional &amp; Corporate Partnerships Desk
            </span>
            <span className="text-slate-500">
              • Jurisdiction: {COMPANY_IDENTITY.jurisdiction}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Institutional Partnerships, Campus Drives &amp; Governance Desk
          </h1>
          <p className="text-base text-slate-600 max-w-3xl leading-relaxed">
            Connect directly with our dedicated onboarding desks for college MoU evaluations, corporate fresher hiring drives, student programme SLA support, or DPDP Act privacy inquiries.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Role-Scoped Routing Desks */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Official Operations &amp; Governance Routing Channels
            </h2>

            <div className="ledger-grid grid-cols-1">
              <div className="ledger-cell space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-800">
                  <Building2 className="h-4 w-4" />
                  Colleges &amp; TPO Partnerships
                </div>
                <div className="text-sm font-bold text-slate-900">
                  {COMPANY_IDENTITY.desks.institutionalPartnerships.label}
                </div>
                <a
                  href={`mailto:${COMPANY_IDENTITY.desks.institutionalPartnerships.email}`}
                  className="font-mono text-xs font-semibold text-blue-700 hover:underline block"
                >
                  {COMPANY_IDENTITY.desks.institutionalPartnerships.email}
                </a>
                <p className="text-[11px] text-slate-500 flex items-center gap-1 pt-1">
                  <Clock className="h-3 w-3 text-slate-400" />
                  {COMPANY_IDENTITY.desks.institutionalPartnerships.sla}
                </p>
              </div>

              <div className="ledger-cell space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
                  <Briefcase className="h-4 w-4" />
                  Corporate Talent Acquisition
                </div>
                <div className="text-sm font-bold text-slate-900">
                  {COMPANY_IDENTITY.desks.employerAlliances.label}
                </div>
                <a
                  href={`mailto:${COMPANY_IDENTITY.desks.employerAlliances.email}`}
                  className="font-mono text-xs font-semibold text-blue-700 hover:underline block"
                >
                  {COMPANY_IDENTITY.desks.employerAlliances.email}
                </a>
                <p className="text-[11px] text-slate-500 flex items-center gap-1 pt-1">
                  <Clock className="h-3 w-3 text-slate-400" />
                  {COMPANY_IDENTITY.desks.employerAlliances.sla}
                </p>
              </div>

              <div className="ledger-cell space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
                  <GraduationCap className="h-4 w-4" />
                  Student Programme &amp; Billing SLA Desk
                </div>
                <div className="text-sm font-bold text-slate-900">
                  {COMPANY_IDENTITY.desks.billingAndRefunds.label}
                </div>
                <div className="space-y-0.5">
                  <a
                    href={`mailto:${COMPANY_IDENTITY.desks.studentSupport.email}`}
                    className="font-mono text-xs font-semibold text-blue-700 hover:underline block"
                  >
                    {COMPANY_IDENTITY.desks.studentSupport.email}
                  </a>
                  <a
                    href={`mailto:${COMPANY_IDENTITY.desks.billingAndRefunds.email}`}
                    className="font-mono text-xs font-semibold text-blue-700 hover:underline block"
                  >
                    {COMPANY_IDENTITY.desks.billingAndRefunds.email}
                  </a>
                </div>
                <p className="text-[11px] text-slate-500 flex items-center gap-1 pt-1">
                  <Clock className="h-3 w-3 text-slate-400" />
                  {COMPANY_IDENTITY.desks.billingAndRefunds.sla}
                </p>
              </div>

              <div className="ledger-cell space-y-1.5 bg-slate-50/70">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
                  <ShieldCheck className="h-4 w-4 text-blue-700" />
                  DPDP Act Privacy &amp; Grievance Officer
                </div>
                <div className="text-xs font-semibold text-slate-900">
                  {COMPANY_IDENTITY.desks.privacyAndGrievance.officerTitle}
                </div>
                <a
                  href={`mailto:${COMPANY_IDENTITY.desks.privacyAndGrievance.email}`}
                  className="font-mono text-xs font-semibold text-blue-700 hover:underline block"
                >
                  {COMPANY_IDENTITY.desks.privacyAndGrievance.email}
                </a>
                <p className="text-[11px] text-slate-500">
                  {COMPANY_IDENTITY.desks.privacyAndGrievance.sla}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-[4px] border border-slate-200 bg-white text-xs text-slate-600 space-y-2">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-blue-700" />
                Operator &amp; Pilot Transparency Note
              </div>
              <p className="leading-relaxed">{COMPANY_IDENTITY.operatingModelDisclosure}</p>
            </div>
          </div>

          {/* Right Column: Live Database-Backed Inquiry Dispatch Form */}
          <div className="lg:col-span-7">
            <div className="instrument-frame bg-white p-6 sm:p-8">
              {ticketId ? (
                <div className="py-8 space-y-6 text-center">
                  <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div className="space-y-2">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200">
                      Inquiry Reference: {ticketId}
                    </span>
                    <h2 className="text-2xl font-bold text-slate-900">
                      Inquiry Logged with Institutional Partnerships Desk
                    </h2>
                    <p className="text-sm text-slate-600 max-w-md mx-auto">
                      Your message has been routed to our specialist operations desk with reference{' '}
                      <strong className="font-mono text-slate-900">{ticketId}</strong>. Our team will respond within 1 business day.
                    </p>
                  </div>
                  <div className="flex justify-center gap-3 pt-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setTicketId(null);
                        setMessage('');
                      }}
                    >
                      Submit Another Inquiry
                    </Button>
                    <Button asChild className="bg-[#1E40AF] hover:bg-blue-900 text-white">
                      <Link href="/">Return to Homepage</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-bold text-slate-900">
                      Request an Institutional Demo, MoU Draft, or Hiring Pipeline Setup
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Select your stakeholder category below to route your request directly to the designated desk.
                    </p>
                  </div>

                  {/* Role Selector Tabs */}
                  <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-[4px]">
                    {(
                      [
                        { id: 'INSTITUTION', label: 'College / TPO' },
                        { id: 'EMPLOYER', label: 'Corporate HR' },
                        { id: 'STUDENT', label: 'Student / Candidate' },
                      ] as const
                    ).map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setRoleType(tab.id)}
                        className={`py-2 px-3 rounded-[3px] text-xs font-semibold transition-all ${
                          roleType === tab.id
                            ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/80'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {error && (
                    <div className="p-3 rounded bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="firstName" className="text-xs font-semibold text-slate-700">
                        First Name *
                      </Label>
                      <Input
                        id="firstName"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="e.g., Dr. Rajesh"
                        className="h-10 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="lastName" className="text-xs font-semibold text-slate-700">
                        Last Name *
                      </Label>
                      <Input
                        id="lastName"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="e.g., Kulkarni"
                        className="h-10 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
                        Official Work / Institutional Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tpo@institution.edu.in"
                        className="h-10 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="organization" className="text-xs font-semibold text-slate-700">
                        {roleType === 'INSTITUTION'
                          ? 'Institution / University Name *'
                          : roleType === 'EMPLOYER'
                          ? 'Company Name *'
                          : 'College Name & Roll Number'}
                      </Label>
                      <Input
                        id="organization"
                        required={roleType !== 'STUDENT'}
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        placeholder={
                          roleType === 'INSTITUTION'
                            ? 'e.g., National Institute of Technology'
                            : roleType === 'EMPLOYER'
                            ? 'e.g., TechCorp India Pvt Ltd'
                            : 'e.g., Apex Institute (APX123)'
                        }
                        className="h-10 text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="subject" className="text-xs font-semibold text-slate-700">
                      Inquiry Subject
                    </Label>
                    <Input
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder={
                        roleType === 'INSTITUTION'
                          ? 'Request Institutional Placement OS Demo & MoU Draft'
                          : roleType === 'EMPLOYER'
                          ? 'Fresher Hiring Drive / 9-Dimension Shortlist Access'
                          : 'Assessment / 3-Interview Assurance Support'
                      }
                      className="h-10 text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="message" className="text-xs font-semibold text-slate-700">
                      Requirements / Cohort Size / Hiring Volume *
                    </Label>
                    <textarea
                      id="message"
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Share your graduating cohort size, target branches, or upcoming fresher hiring timeline..."
                      className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700"
                    />
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <p className="text-[11px] text-slate-500">
                      Protected under our{' '}
                      <Link href="/privacy" className="underline hover:text-slate-800">
                        DPDP Act Data Governance Policy
                      </Link>
                      .
                    </p>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-[#1E40AF] hover:bg-blue-900 text-white font-semibold px-6 h-11"
                    >
                      {loading ? 'Logging Inquiry...' : 'Dispatch to Operations Desk'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
