'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  CheckCircle2,
  ShieldCheck,
  Filter,
  SlidersHorizontal,
  UserCheck,
  Calendar,
  FileText,
  ArrowRight,
  Lock,
  Calculator,
  Video,
  Bell,
  XCircle,
  Clock,
  Info,
  CheckSquare,
} from 'lucide-react';
import {
  buildCandidate9DimensionBreakdown,
  EMPLOYABILITY_SCORE_METHODOLOGY_VERSION,
} from '@/config/employability-dimensions';

export interface ShortlistedCandidateItem {
  id: string;
  rollNo: string;
  name: string;
  college: string;
  branch: string;
  cgpa: number;
  backlogs: number;
  overallScore: number;
  percentile: number;
  tech: number;
  logic: number;
  comm: number;
  ethics: number;
  domain: number;
  agility: number;
  team: number;
  prof: number;
  poise: number;
  shortlistStage: string;
  assuranceState: string;
  consentVersion: string;
  consentDate: string;
}

const INITIAL_CANDIDATES: ShortlistedCandidateItem[] = [
  {
    id: 'stu-apex-2026-01',
    rollNo: 'APX2026CS042',
    name: 'Aarav Sharma',
    college: 'Apex Institute of Technology (APX123)',
    branch: 'B.Tech CSE',
    cgpa: 8.64,
    backlogs: 0,
    overallScore: 84.0,
    percentile: 91,
    tech: 82,
    logic: 80,
    comm: 85,
    ethics: 90,
    domain: 84,
    agility: 88,
    team: 84,
    prof: 86,
    poise: 82,
    shortlistStage: 'SHORTLISTED — ROUND 2',
    assuranceState: '1 Completed • 1 Scheduled • 1 Matching',
    consentVersion: 'DPDP-2026.09-v2',
    consentDate: '12 Sep 2026',
  },
  {
    id: 'stu-apex-2026-02',
    rollNo: 'APX2026CS018',
    name: 'Ananya Nair',
    college: 'Apex Institute of Technology (APX123)',
    branch: 'B.Tech CSE',
    cgpa: 9.12,
    backlogs: 0,
    overallScore: 91.0,
    percentile: 97,
    tech: 92,
    logic: 90,
    comm: 89,
    ethics: 94,
    domain: 91,
    agility: 90,
    team: 91,
    prof: 92,
    poise: 90,
    shortlistStage: 'FINAL ROUND COMPLETED',
    assuranceState: '2 Completed • Offer Extended',
    consentVersion: 'DPDP-2026.09-v2',
    consentDate: '11 Sep 2026',
  },
  {
    id: 'stu-apex-2026-03',
    rollNo: 'APX2026IT009',
    name: 'Rohan Deshmukh',
    college: 'Apex Institute of Technology (APX123)',
    branch: 'B.Tech ISE',
    cgpa: 8.45,
    backlogs: 0,
    overallScore: 87.0,
    percentile: 94,
    tech: 88,
    logic: 86,
    comm: 84,
    ethics: 91,
    domain: 87,
    agility: 86,
    team: 85,
    prof: 88,
    poise: 86,
    shortlistStage: 'SHORTLISTED — ROUND 2',
    assuranceState: '1 Completed • 1 Scheduled • 1 Matching',
    consentVersion: 'DPDP-2026.09-v2',
    consentDate: '12 Sep 2026',
  },
  {
    id: 'stu-apex-2026-04',
    rollNo: 'APX2026CS054',
    name: 'Karthik Reddy',
    college: 'Apex Institute of Technology (APX123)',
    branch: 'B.Tech CSE',
    cgpa: 8.28,
    backlogs: 0,
    overallScore: 82.5,
    percentile: 88,
    tech: 84,
    logic: 82,
    comm: 80,
    ethics: 88,
    domain: 82,
    agility: 83,
    team: 81,
    prof: 84,
    poise: 80,
    shortlistStage: 'SHORTLISTED — ROUND 1',
    assuranceState: '1 Completed • 1 Scheduled • 1 Matching',
    consentVersion: 'DPDP-2026.09-v2',
    consentDate: '13 Sep 2026',
  },
  {
    id: 'stu-apex-2026-05',
    rollNo: 'APX2026EC031',
    name: 'Sneha Kulkarni',
    college: 'Apex Institute of Technology (APX123)',
    branch: 'B.Tech ECE',
    cgpa: 8.51,
    backlogs: 0,
    overallScore: 81.0,
    percentile: 86,
    tech: 79,
    logic: 81,
    comm: 84,
    ethics: 89,
    domain: 80,
    agility: 82,
    team: 83,
    prof: 85,
    poise: 81,
    shortlistStage: 'SHORTLISTED — ROUND 1',
    assuranceState: '1 Completed • 0 Scheduled • 2 Matching',
    consentVersion: 'DPDP-2026.09-v2',
    consentDate: '12 Sep 2026',
  },
];

export function RecruiterCandidateWorkspace() {
  const [sortBy, setSortBy] = useState<'overallScore' | 'percentile' | 'tech' | 'cgpa'>('overallScore');
  const [selectedIds, setSelectedIds] = useState<string[]>([
    'APX2026CS042',
    'APX2026CS018',
    'APX2026IT009',
    'APX2026CS054',
    'APX2026EC031',
  ]);
  const [bulkModalOpen, setBulkModalOpen] = useState<boolean>(true);
  const [notifyCandidates, setNotifyCandidates] = useState<boolean>(true);
  const [bulkAuditBanner, setBulkAuditBanner] = useState<string | null>(
    'AUD-EMP-20260925-8841 • Last Bulk Action: 5 candidates verified for SHORTLISTED — ROUND 2 (Notifications enabled)'
  );
  const [interviewStatus, setInterviewStatus] = useState<
    'AWAITING_CONFIRMATION' | 'CONFIRMED' | 'RESCHEDULE_PROPOSED' | 'CANCELLED'
  >('CONFIRMED');
  const [interviewAuditMsg, setInterviewAuditMsg] = useState<string>(
    'CONFIRMED • Candidate, Recruiter & Panel notified • Calendar invite (.ics) dispatched'
  );
  const [consentModalOpen, setConsentModalOpen] = useState<boolean>(false);

  const aaravBreakdown = buildCandidate9DimensionBreakdown();

  const sortedCandidates = [...INITIAL_CANDIDATES].sort((a, b) => b[sortBy] - a[sortBy]);

  const toggleCandidate = (rollNo: string) => {
    setSelectedIds((prev) =>
      prev.includes(rollNo) ? prev.filter((id) => id !== rollNo) : [...prev, rollNo]
    );
  };

  const handleBulkShortlistConfirm = async () => {
    try {
      const res = await fetch('/api/employer/candidates/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'BULK_SHORTLIST_ROUND_2',
          candidateIds: selectedIds,
          notifyCandidates,
        }),
      });
      const data = await res.json();
      if (data?.auditEventId) {
        setBulkAuditBanner(
          `${data.auditEventId} • ${selectedIds.length} candidates moved to SHORTLISTED — ROUND 2 • Candidate Notification: ${
            notifyCandidates ? 'YES (Dispatched)' : 'NO (Suppressed)'
          }`
        );
      }
    } catch {
      setBulkAuditBanner(
        `AUD-EMP-LOCAL • ${selectedIds.length} candidates moved to SHORTLISTED — ROUND 2`
      );
    }
  };

  const handleInterviewAction = async (
    action: 'CONFIRM_INTERVIEW' | 'CHANGE_SLOT' | 'CANCEL_INTERVIEW' | 'SEND_REMINDER'
  ) => {
    try {
      const res = await fetch('/api/employer/candidates/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          candidateId: 'APX2026CS042',
          interviewSlot: '30 Sep 2026 • 14:30–15:30 IST (60 minutes)',
        }),
      });
      const data = await res.json();
      if (action === 'CONFIRM_INTERVIEW') {
        setInterviewStatus('CONFIRMED');
        setInterviewAuditMsg(
          `${data?.auditEventId || 'AUD-INT-9921'} • Interview CONFIRMED • Candidate, Recruiter & Panel notified • Calendar event created`
        );
      } else if (action === 'CHANGE_SLOT') {
        setInterviewStatus('RESCHEDULE_PROPOSED');
        setInterviewAuditMsg(
          `${data?.auditEventId || 'AUD-INT-9922'} • Slot change proposed for 01 Oct 2026, 15:00 IST • Awaiting candidate confirmation`
        );
      } else if (action === 'CANCEL_INTERVIEW') {
        setInterviewStatus('CANCELLED');
        setInterviewAuditMsg(
          `${data?.auditEventId || 'AUD-INT-9923'} • Slot cancelled by Recruiter • Assurance quota credit automatically returned to student`
        );
      } else if (action === 'SEND_REMINDER') {
        setInterviewAuditMsg(
          `${data?.auditEventId || 'AUD-INT-9924'} • Automated SMS + Email + Calendar reminder dispatched to Aarav Sharma & Panel`
        );
      }
    } catch {
      if (action === 'CONFIRM_INTERVIEW') setInterviewStatus('CONFIRMED');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* 1. Enterprise Header with Exact Pool Mathematics & Verified Data Terminology */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider font-bold px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200">
                Corporate Recruitment &amp; Shortlisting Console
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-mono text-slate-600 font-semibold">
                Mandate: Associate Software Engineer — Full-Stack (₹6.5–8.5 LPA)
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Candidate Matching Pool, Comparison &amp; Interview Scheduling
            </h1>
            <p className="text-xs text-slate-600 max-w-3xl">
              Filter role-eligible graduating cohorts, compare{' '}
              <strong className="text-slate-900">
                verified candidate profile &amp; assessment data
              </strong>{' '}
              across the canonical 9-Dimension Employability Framework (Methodology{' '}
              <code className="font-mono text-indigo-700 font-bold">
                {EMPLOYABILITY_SCORE_METHODOLOGY_VERSION}
              </code>
              ), execute safeguarded bulk shortlisting, and manage confirmed panel interviews.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <div className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-right">
              <span className="text-[10px] font-mono uppercase text-slate-500 block">
                Role-Matched Pool
              </span>
              <span className="text-sm font-bold text-slate-900">42 Candidates</span>
            </div>
            <div className="px-3 py-2 rounded-lg bg-indigo-50 border border-indigo-200 text-right">
              <span className="text-[10px] font-mono uppercase text-indigo-700 block">
                Currently Shortlisted
              </span>
              <span className="text-sm font-bold text-indigo-900">
                10 Shortlisted (23.8% of Pool)
              </span>
            </div>
            <Link href="/employer/interviews">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold h-10">
                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                Open Interview &amp; Evaluation Desk
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. 5-Stage Recruiter Workflow Bar (Exact Pool Math: 42 Matched -> 10 Shortlisted = 23.8%) */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <div className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">
            Step 1 • Active Mandate
          </span>
          <div className="text-xs font-bold text-slate-900 mt-1">
            Associate Software Engineer
          </div>
          <div className="text-[11px] text-slate-600 mt-0.5">
            18 Openings • ₹6.5–8.5 LPA • Bengaluru
          </div>
        </div>

        <div className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">
            Step 2 • Score Cutoff Filter
          </span>
          <div className="text-xs font-bold text-slate-900 mt-1">
            Minimum Score ≥ 77 / 100
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
            10 candidates currently qualify
          </div>
        </div>

        <div className="p-3.5 rounded-lg bg-indigo-50/70 border-2 border-indigo-600 shadow-2xs">
          <span className="text-[10px] font-mono uppercase font-bold text-indigo-800 block">
            Step 3 • Shortlist Ratio
          </span>
          <div className="text-xs font-bold text-indigo-950 mt-1">
            42 Matched → 10 Shortlisted
          </div>
          <div className="text-[11px] text-indigo-800 font-semibold mt-0.5">
            23.8% of matched pool selected
          </div>
        </div>

        <div className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">
            Step 4 • Candidate Dossier
          </span>
          <div className="text-xs font-bold text-slate-900 mt-1">
            Aarav Sharma (84.0 / 100)
          </div>
          <div className="text-[11px] text-slate-600 mt-0.5">
            9/9 Dimensions + Weighted Formula {EMPLOYABILITY_SCORE_METHODOLOGY_VERSION}
          </div>
        </div>

        <div className="p-3.5 rounded-lg bg-emerald-50/70 border border-emerald-300 shadow-2xs">
          <span className="text-[10px] font-mono uppercase font-bold text-emerald-800 block">
            Step 5 • Interview Scheduling
          </span>
          <div className="text-xs font-bold text-emerald-950 mt-1">
            Round #2 Confirmed (60m)
          </div>
          <div className="text-[11px] text-emerald-800 font-semibold mt-0.5">
            30 Sep 2026 • 14:30–15:30 IST
          </div>
        </div>
      </div>

      {/* 3. Recruiter Data-Access & Privacy Boundary + Auditable Consent Governance Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <Card className="lg:col-span-7 border-slate-200 bg-white shadow-xs">
          <CardHeader className="pb-2.5 pt-4 px-5 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-indigo-700" />
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Recruiter Data-Access Scope &amp; Tenant Privacy Boundary
                </CardTitle>
              </div>
              <Badge className="bg-slate-100 text-slate-800 border-slate-300 text-[10px] font-mono">
                Least-Privilege Hiring Access
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-200 space-y-1.5">
              <div className="font-bold text-emerald-950 text-[11px] uppercase tracking-wider">
                ✓ Accessible for Hiring Purpose
              </div>
              <ul className="space-y-1 text-[11px] text-emerald-900 font-medium">
                <li>✓ Verified Academic Profile (CGPA, Branch, Active Backlogs)</li>
                <li>✓ 9-Dimension Employability Assessment &amp; Weighted Score</li>
                <li>✓ Verified Interview History &amp; Assurance Progress</li>
                <li>✓ Relevant Technical Assessments &amp; Verified Resume</li>
                <li>✓ Explicit DPDP Consent Status &amp; Policy Version</li>
              </ul>
            </div>
            <div className="p-3 rounded-lg bg-rose-50/40 border border-rose-200 space-y-1.5">
              <div className="font-bold text-rose-950 text-[11px] uppercase tracking-wider">
                ✕ Restricted &amp; Tenant-Isolated
              </div>
              <ul className="space-y-1 text-[11px] text-rose-900 font-medium">
                <li>✕ Internal Platform Analytics &amp; Commercial Telemetry</li>
                <li>✕ Unnecessary Personal / Family / Financial Information</li>
                <li>✕ Internal College TPO Coaching &amp; Remediation Notes</li>
                <li>✕ Other Corporate Employers&apos; Evaluation Rubrics &amp; Offers</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-5 border-slate-200 bg-white shadow-xs">
          <CardHeader className="pb-2.5 pt-4 px-5 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-700" />
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Auditable Candidate Consent &amp; Verification
                </CardTitle>
              </div>
              <Badge className="bg-emerald-50 text-emerald-800 border-emerald-300 text-[10px] font-mono">
                Policy: DPDP-2026.09-v2
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-2.5 text-xs">
            <div className="grid grid-cols-1 gap-1.5 text-[11px] text-slate-700 font-medium">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span>✓ Placement participation consent</span>
                <span className="font-mono text-[10px] text-emerald-700 font-bold">GRANTED</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span>✓ Employer-sharing consent (NexaTech Enterprise)</span>
                <span className="font-mono text-[10px] text-emerald-700 font-bold">GRANTED</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span>✓ 9-Dimension Assessment data-sharing consent</span>
                <span className="font-mono text-[10px] text-emerald-700 font-bold">GRANTED</span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-1">
              <div className="text-[11px] text-slate-600 font-mono">
                Consent recorded: <strong className="text-slate-900">12 Sep 2026 (09:30 IST)</strong>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConsentModalOpen(!consentModalOpen)}
                className="h-7 text-[11px] font-semibold border-indigo-200 text-indigo-700 hover:bg-indigo-50"
              >
                {consentModalOpen ? 'Hide Consent Record' : 'View Consent Record'}
              </Button>
            </div>
            {consentModalOpen && (
              <div className="p-2.5 rounded bg-slate-900 text-slate-100 font-mono text-[10px] space-y-1">
                <div>CONSENT_ID: CNS-DPDP-88412-APX2026CS042</div>
                <div>POLICY_VERSION: DPDP-2026.09-v2 • SHA256: 9f4a81c2e7b3094d...</div>
                <div>PURPOSE: Corporate Shortlisting, 9-Area Scorecard &amp; Interview Scheduling</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 4. Enterprise Sorting, 10-Facet Filter Bar & Safeguarded Bulk Shortlist Controls */}
      <Card className="border-slate-200 bg-white shadow-xs">
        <CardHeader className="pb-3 pt-4 px-5 border-b border-slate-200 bg-slate-50/70">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-indigo-700" />
                <CardTitle className="text-sm font-bold text-slate-900">
                  Shortlisted Candidate Comparison Matrix (42 Role-Matched Candidates • Showing 1–5 of 10 Qualified ≥ 77/100)
                </CardTitle>
              </div>
              <CardDescription className="text-xs text-slate-600 mt-0.5">
                Minimum Employability Score: <strong>≥ 77 / 100</strong> (10 candidates currently qualify • 23.8% of 42 role-matched pool)
              </CardDescription>
            </div>

            {/* Sort & Bulk Action Trigger */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-md px-2.5 py-1 text-xs">
                <span className="text-slate-500 font-medium">Sort:</span>
                <select
                  aria-label="Sort candidates by metric"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="font-bold text-slate-900 bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="overallScore">Employability Score ↓</option>
                  <option value="percentile">Cohort Percentile ↓</option>
                  <option value="tech">Technical Readiness ↓</option>
                  <option value="cgpa">Academic CGPA ↓</option>
                </select>
              </div>

              <Button
                size="sm"
                onClick={() => setBulkModalOpen(true)}
                className="bg-indigo-900 hover:bg-indigo-950 text-white text-xs font-bold h-8"
              >
                <CheckSquare className="h-3.5 w-3.5 mr-1.5" />
                Shortlist {selectedIds.length} Selected Candidates
              </Button>
            </div>
          </div>

          {/* 10-Facet Enterprise Filter Bar */}
          <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-slate-200/80 mt-3">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Active Filters (10):
            </span>
            <Badge variant="outline" className="bg-white text-slate-800 border-slate-300 text-[10px] font-mono">
              1. Score: ≥ 77 / 100 (10 Qualify)
            </Badge>
            <Badge variant="outline" className="bg-white text-slate-800 border-slate-300 text-[10px] font-mono">
              2. Branch: CSE / ISE / ECE
            </Badge>
            <Badge variant="outline" className="bg-white text-slate-800 border-slate-300 text-[10px] font-mono">
              3. CGPA: ≥ 7.50 (0 Backlogs)
            </Badge>
            <Badge variant="outline" className="bg-white text-slate-800 border-slate-300 text-[10px] font-mono">
              4. Experience: 2026 Graduating Fresher
            </Badge>
            <Badge variant="outline" className="bg-white text-slate-800 border-slate-300 text-[10px] font-mono">
              5. Skills: TypeScript · React · Node · SQL
            </Badge>
            <Badge variant="outline" className="bg-white text-slate-800 border-slate-300 text-[10px] font-mono">
              6. Location: Bengaluru (Hybrid)
            </Badge>
            <Badge variant="outline" className="bg-white text-slate-800 border-slate-300 text-[10px] font-mono">
              7. Salary: ₹6.5–8.5 LPA Accepted
            </Badge>
            <Badge variant="outline" className="bg-white text-slate-800 border-slate-300 text-[10px] font-mono">
              8. Assurance Status: Active 3-Interview Track
            </Badge>
            <Badge variant="outline" className="bg-white text-slate-800 border-slate-300 text-[10px] font-mono">
              9. Interview Status: Round 1 &amp; 2 Eligible
            </Badge>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-300 text-[10px] font-mono">
              10. Consent Status: DPDP-2026.09-v2 Verified ✓
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-100/80 hover:bg-slate-100/80">
                <TableHead className="w-10 text-center font-mono text-[10px] font-bold text-slate-700">
                  SELECT
                </TableHead>
                <TableHead className="font-mono text-[10px] font-bold text-slate-700">
                  CANDIDATE &amp; ROLL NO.
                </TableHead>
                <TableHead className="font-mono text-[10px] font-bold text-slate-700">
                  WEIGHTED SCORE &amp; PERCENTILE
                </TableHead>
                <TableHead className="font-mono text-[10px] font-bold text-slate-700">
                  CORE SCORES (TECH · LOGIC · COMM · ETHICS)
                </TableHead>
                <TableHead className="font-mono text-[10px] font-bold text-slate-700">
                  ACADEMIC &amp; CONSENT
                </TableHead>
                <TableHead className="font-mono text-[10px] font-bold text-slate-700">
                  SHORTLIST &amp; ASSURANCE PROGRESS
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedCandidates.map((cand) => {
                const isSelected = selectedIds.includes(cand.rollNo);
                const isPrimaryInspected = cand.rollNo === 'APX2026CS042';

                return (
                  <TableRow
                    key={cand.rollNo}
                    className={
                      isPrimaryInspected
                        ? 'bg-indigo-50/50 hover:bg-indigo-50/80 border-l-4 border-l-indigo-600'
                        : 'hover:bg-slate-50'
                    }
                  >
                    <TableCell className="text-center">
                      <input
                        type="checkbox"
                        aria-label={`Select ${cand.name}`}
                        checked={isSelected}
                        onChange={() => toggleCandidate(cand.rollNo)}
                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                        {cand.name}
                        {isPrimaryInspected && (
                          <Badge className="bg-indigo-600 text-white text-[9px] px-1.5 py-0">
                            ACTIVE DOSSIER ↓
                          </Badge>
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500">
                        {cand.rollNo} • {cand.branch}
                      </div>
                      <div className="text-[10px] text-slate-500">{cand.college}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-extrabold text-indigo-950 font-mono">
                        {cand.overallScore.toFixed(1)} / 100
                      </div>
                      <div className="text-[11px] text-emerald-700 font-semibold">
                        {cand.percentile}th Cohort Percentile
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-mono text-[11px] font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded border border-slate-200 inline-block">
                        Tech {cand.tech} · Logic {cand.logic} · Comm {cand.comm} · Ethics {cand.ethics}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-1">
                        Domain {cand.domain} · Agility {cand.agility} · Team {cand.team} · Prof {cand.prof} · Poise {cand.poise}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs font-bold text-slate-900">
                        CGPA: {cand.cgpa.toFixed(2)} ({cand.backlogs} Backlogs)
                      </div>
                      <div className="text-[10px] font-mono text-emerald-700 font-semibold mt-0.5">
                        ✓ Consent: {cand.consentVersion} ({cand.consentDate})
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-indigo-100 text-indigo-900 border-indigo-300 text-[10px] font-bold">
                        {cand.shortlistStage}
                      </Badge>
                      <div className="text-[10px] font-mono text-slate-600 mt-1">
                        Assurance: <strong>{cand.assuranceState}</strong>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Bulk Action Safeguard Confirmation Bar (Always visible for review + interactive) */}
          {bulkModalOpen && (
            <div className="p-4 bg-slate-900 text-white border-t border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge className="bg-amber-400 text-slate-950 font-bold text-[10px] uppercase">
                    Bulk Action Safeguard &amp; Confirmation
                  </Badge>
                  <span className="text-xs font-mono text-slate-300">
                    Selected Candidates: <strong>{selectedIds.length}</strong> ({selectedIds.join(', ')})
                  </span>
                </div>
                <p className="text-xs text-slate-200">
                  <strong>Confirm bulk action:</strong> {selectedIds.length} candidates will be moved to{' '}
                  <span className="font-mono font-bold text-emerald-400">SHORTLISTED — ROUND 2</span>. Every bulk operation records an immutable audit log event.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 shrink-0">
                <div className="flex items-center gap-2 text-xs bg-slate-800 px-3 py-1.5 rounded border border-slate-700">
                  <span className="text-slate-300 font-medium">Candidates will be notified:</span>
                  <label className="inline-flex items-center gap-1 cursor-pointer font-bold text-emerald-400">
                    <input
                      type="radio"
                      name="notifyCandidates"
                      checked={notifyCandidates}
                      onChange={() => setNotifyCandidates(true)}
                    />
                    Yes
                  </label>
                  <label className="inline-flex items-center gap-1 cursor-pointer font-bold text-slate-300 ml-2">
                    <input
                      type="radio"
                      name="notifyCandidates"
                      checked={!notifyCandidates}
                      onChange={() => setNotifyCandidates(false)}
                    />
                    No
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setBulkModalOpen(false)}
                    className="h-8 text-xs border-slate-600 text-slate-200 bg-transparent hover:bg-slate-800"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleBulkShortlistConfirm}
                    className="h-8 text-xs bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold"
                  >
                    Confirm Bulk Shortlist ({selectedIds.length})
                  </Button>
                </div>
              </div>
            </div>
          )}

          {bulkAuditBanner && (
            <div className="px-5 py-2 bg-emerald-950 text-emerald-200 text-[11px] font-mono flex items-center justify-between">
              <span>✓ AUDIT LOGGED: {bulkAuditBanner}</span>
              <span>Showing 1–5 of 10 Shortlisted (42 Total Role-Matched Pool)</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 5. Expanded 360° Candidate Dossier: Aarav Sharma (APX2026CS042) — 9/9 Dimensions + Weighted Formula + Assurance + Scheduling */}
      <Card className="border-2 border-indigo-900 bg-white shadow-sm overflow-hidden">
        <div className="bg-indigo-950 text-white px-6 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-emerald-400 text-slate-950 font-bold text-[10px] uppercase">
                Verified Candidate Dossier • Step 4 &amp; Step 5
              </Badge>
              <span className="text-xs font-mono text-indigo-200">
                Roll No: APX2026CS042 • Apex Institute of Technology (APX123)
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">
              Aarav Sharma — B.Tech Computer Science &amp; Engineering (2026 Cohort)
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-3.5 py-2 rounded-lg bg-indigo-900/90 border border-indigo-700 text-right">
              <span className="text-[10px] font-mono uppercase text-indigo-300 block">
                Weighted Employability Score
              </span>
              <span className="text-lg font-extrabold text-white font-mono">
                84.0 / 100 <span className="text-xs text-emerald-300">(91st Percentile)</span>
              </span>
            </div>
            <div className="px-3.5 py-2 rounded-lg bg-emerald-900/80 border border-emerald-600 text-right">
              <span className="text-[10px] font-mono uppercase text-emerald-200 block">
                3-Interview Assurance Progress
              </span>
              <span className="text-sm font-bold text-white font-mono">
                1 / 3 Completed (1 Verified • 1 Scheduled • 1 Matching)
              </span>
            </div>
          </div>
        </div>

        <CardContent className="p-6 space-y-6">
          {/* Row A: Canonical 9-Dimension Employability Diagnostic Grid (All 9 Dimensions Explicitly Displayed) + How Score is Calculated */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 Cols: All 9 Canonical Dimensions in a 3x3 Grid */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    9-Dimension Employability Diagnostic Breakdown (All 9 Canonical Dimensions)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Unified schema across Database → API → Student Scorecard → TPO Roster → Recruiter Dossier
                  </p>
                </div>
                <Badge className="bg-indigo-50 text-indigo-800 border-indigo-200 font-mono text-[10px]">
                  9 / 9 Dimensions Verified
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {aaravBreakdown.dimensions.map((dim) => (
                  <div
                    key={dim.key}
                    className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-indigo-700">
                          #{dim.index} • Weight {dim.weightPercent}%
                        </span>
                        <span className="text-xs font-extrabold font-mono text-slate-900">
                          {dim.score} / 100
                        </span>
                      </div>
                      <div className="text-xs font-bold text-slate-900 mt-1">
                        {dim.label}
                      </div>
                      <p className="text-[10px] text-slate-600 mt-0.5 leading-snug">
                        {dim.description}
                      </p>
                    </div>
                    <div className="mt-2 pt-1.5 border-t border-slate-200/80 flex items-center justify-between text-[10px] font-mono text-emerald-800 font-semibold">
                      <span>{dim.score} × {dim.weightPercent}%</span>
                      <span>= {dim.weightedPoints.toFixed(2)} pts</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 5 Cols: "How This Score Is Calculated" Explainability & Audit Panel */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="flex items-center gap-1.5">
                  <Calculator className="h-4 w-4 text-indigo-700" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    How This Score Is Calculated
                  </h3>
                </div>
                <Badge className="bg-slate-900 text-white font-mono text-[10px]">
                  Score Methodology → Version {EMPLOYABILITY_SCORE_METHODOLOGY_VERSION}
                </Badge>
              </div>

              <div className="rounded-lg border border-slate-300 bg-slate-950 text-slate-100 p-4 font-mono text-xs space-y-2">
                <div className="flex items-center justify-between text-[11px] text-indigo-300 border-b border-slate-800 pb-1.5 font-bold">
                  <span>DIMENSION (CANONICAL 1–9)</span>
                  <span>SCORE × WEIGHT = PTS</span>
                </div>
                {aaravBreakdown.dimensions.map((dim) => (
                  <div
                    key={dim.key}
                    className="flex items-center justify-between text-[11px] py-0.5 border-b border-slate-900"
                  >
                    <span className="text-slate-300">
                      {dim.index}. {dim.label}
                    </span>
                    <span className="text-emerald-400 font-bold">
                      {dim.score} × {String(dim.weightPercent).padStart(2, ' ')}% = {dim.weightedPoints.toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className="pt-2 border-t border-slate-700 flex items-center justify-between text-sm font-extrabold text-white">
                  <span>Weighted Employability Score (100%)</span>
                  <span className="text-emerald-400">
                    {aaravBreakdown.weightedCompositeScore.toFixed(1)} / 100
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 pt-1">
                  Ranking Proof: Aarav Sharma (84.0) ranks in the 91st National Graduating Cohort Percentile and qualifies above the ≥ 77.0 mandate cutoff.
                </div>
              </div>
            </div>
          </div>

          {/* Row B: Explicit "Counts Toward Assurance" Rule Definition & Prominent Progress + Complete Interview Scheduling Object */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2 border-t border-slate-200">
            {/* Left 5 Cols: Explicit 3-Interview Assurance Progress & Rule Definition */}
            <div className="lg:col-span-5 rounded-xl border border-indigo-200 bg-indigo-50/40 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-950">
                  Candidate 3-Interview Assurance Progress
                </span>
                <Badge className="bg-indigo-900 text-white font-mono text-[10px]">
                  1 / 3 Completed
                </Badge>
              </div>

              <div className="p-3 rounded-lg bg-white border border-indigo-200 text-xs text-slate-700 space-y-1">
                <div className="font-bold text-indigo-950 flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5 text-indigo-700 shrink-0" />
                  What &ldquo;Counts Toward Assurance&rdquo; Means:
                </div>
                <p className="text-[11px] leading-relaxed">
                  <strong>Rule Definition:</strong> This interview counts toward the candidate&apos;s{' '}
                  <strong>3-interview independent assurance requirement</strong> once the candidate attends and completes the scheduled corporate evaluation round. Employer-initiated cancellations do not deduct from the student&apos;s 3-opportunity quota.
                </p>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="p-2.5 rounded bg-emerald-50 border border-emerald-300 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-emerald-950 block">✓ 1 Verified (Opportunity #1)</span>
                    <span className="text-[10px] text-emerald-800">
                      NexaTech Round 1 Panel • Attended 19 Sep 2026
                    </span>
                  </div>
                  <Badge className="bg-emerald-700 text-white text-[10px]">COMPLETED</Badge>
                </div>

                <div className="p-2.5 rounded bg-indigo-100/80 border border-indigo-300 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-indigo-950 block">◉ 1 Scheduled (Opportunity #2)</span>
                    <span className="text-[10px] text-indigo-800">
                      FinCore Digital Systems • Confirmed 28 Sep 2026
                    </span>
                  </div>
                  <Badge className="bg-indigo-700 text-white text-[10px]">SCHEDULED</Badge>
                </div>

                <div className="p-2.5 rounded bg-white border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 block">○ 1 Matching (Opportunity #3)</span>
                    <span className="text-[10px] text-slate-600">
                      CloudScale Systems India • 92% Score Fit Reserved
                    </span>
                  </div>
                  <Badge variant="outline" className="text-[10px] border-slate-300 text-slate-700">
                    MATCHING
                  </Badge>
                </div>
              </div>
            </div>

            {/* Right 7 Cols: Complete Enterprise Interview Scheduling Object & Interactive Controls */}
            <div className="lg:col-span-7 rounded-xl border-2 border-emerald-600 bg-white p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-emerald-700" />
                    <h3 className="text-sm font-bold text-slate-900">
                      Enterprise Interview Scheduling Object — Round #2
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Counts Toward Assurance • Multi-party calendar synchronization &amp; attendance ledger
                  </p>
                </div>

                <Badge
                  className={
                    interviewStatus === 'CONFIRMED'
                      ? 'bg-emerald-700 text-white font-mono text-xs px-3 py-1'
                      : interviewStatus === 'CANCELLED'
                      ? 'bg-rose-700 text-white font-mono text-xs px-3 py-1'
                      : 'bg-amber-500 text-slate-950 font-mono text-xs px-3 py-1'
                  }
                >
                  {interviewStatus === 'CONFIRMED'
                    ? '✓ CONFIRMED'
                    : interviewStatus === 'RESCHEDULE_PROPOSED'
                    ? 'RESCHEDULE PROPOSED'
                    : interviewStatus === 'CANCELLED'
                    ? 'CANCELLED'
                    : 'AWAITING CONFIRMATION'}
                </Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500 block">Round &amp; Type</span>
                  <span className="font-bold text-slate-900">Round 2 • System Design</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500 block">Interview Panel</span>
                  <span className="font-bold text-slate-900">
                    Hiring Manager + Senior Engineer
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500 block">Candidate</span>
                  <span className="font-bold text-slate-900">Aarav Sharma (APX2026CS042)</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500 block">Date &amp; Time</span>
                  <span className="font-bold text-emerald-900">
                    30 Sep 2026 • 14:30–15:30 IST
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500 block">Duration</span>
                  <span className="font-bold text-slate-900">60 minutes</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500 block">Meeting Room</span>
                  <span className="font-bold text-indigo-700 font-mono">
                    Google Meet (meet.google.com/nxa-r2)
                  </span>
                </div>
              </div>

              {/* Interactive Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Button
                  size="sm"
                  onClick={() => handleInterviewAction('CONFIRM_INTERVIEW')}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold h-8"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                  Confirm Interview
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleInterviewAction('CHANGE_SLOT')}
                  className="border-slate-300 text-slate-800 text-xs font-semibold h-8"
                >
                  <Clock className="h-3.5 w-3.5 mr-1.5" />
                  Change Slot
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleInterviewAction('SEND_REMINDER')}
                  className="border-indigo-300 text-indigo-800 text-xs font-semibold h-8"
                >
                  <Bell className="h-3.5 w-3.5 mr-1.5" />
                  Send Reminder
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleInterviewAction('CANCEL_INTERVIEW')}
                  className="border-rose-300 text-rose-700 text-xs font-semibold h-8"
                >
                  <XCircle className="h-3.5 w-3.5 mr-1.5" />
                  Cancel
                </Button>
              </div>

              {/* Post-Confirmation Notification & Calendar Dispatch Proof */}
              <div className="p-3 rounded-lg bg-emerald-950 text-emerald-100 font-mono text-[11px] space-y-1.5">
                <div className="font-bold text-emerald-300">
                  ✓ {interviewAuditMsg}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[10px] text-emerald-200">
                  <span>✓ Candidate notified</span>
                  <span>✓ Recruiter notified</span>
                  <span>✓ Panel notified</span>
                  <span>✓ Calendar event created</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
