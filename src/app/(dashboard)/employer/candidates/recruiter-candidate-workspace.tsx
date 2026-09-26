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
  Calendar,
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
import {
  CANONICAL_AARAV_OPPORTUNITIES,
  CANONICAL_PERCENTILE_METADATA,
  CANONICAL_RECRUITER_FUNNEL,
} from '@/config/canonical-assurance-graph';

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
  keySkills: string;
  funnelState: 'SELECTED FOR ROUND 2' | 'SHORTLISTED (ROUND 1)';
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
    percentile: CANONICAL_PERCENTILE_METADATA.percentileValue,
    keySkills: 'TypeScript · React · Node.js · PostgreSQL',
    funnelState: 'SELECTED FOR ROUND 2',
    assuranceState: '1/3 Completed • R2 Confirmed (30 Sep)',
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
    keySkills: 'Distributed Systems · Go · TypeScript · AWS',
    funnelState: 'SELECTED FOR ROUND 2',
    assuranceState: '2/3 Completed • Offer Extended',
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
    keySkills: 'Next.js · Node.js · GraphQL · Docker',
    funnelState: 'SELECTED FOR ROUND 2',
    assuranceState: '1/3 Completed • R2 Scheduled',
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
    keySkills: 'Java · Spring Boot · PostgreSQL · Redis',
    funnelState: 'SELECTED FOR ROUND 2',
    assuranceState: '1/3 Completed • R2 Selected',
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
    keySkills: 'Python · React · FastAPI · SQL',
    funnelState: 'SELECTED FOR ROUND 2',
    assuranceState: '1/3 Completed • R2 Selected',
    consentVersion: 'DPDP-2026.09-v2',
    consentDate: '12 Sep 2026',
  },
];

export function RecruiterCandidateWorkspace() {
  const [sortBy, setSortBy] = useState<'overallScore' | 'percentile' | 'cgpa'>('overallScore');
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
    'AUD-EMP-20260925-8841 • Canonical Transition (2026-09-25T16:15:00+05:30): 5 of 10 Shortlisted Candidates moved to SELECTED FOR ROUND 2 (Notifications Dispatched)'
  );

  // Derive NexaTech Opportunity #1 and Round #2 directly from the Single Canonical Assurance Graph
  const nexaOpportunity = CANONICAL_AARAV_OPPORTUNITIES[0];
  const nexaRound1 = nexaOpportunity.interviews[0];
  const nexaRound2 = nexaOpportunity.interviews[1];

  const [interviewStatus, setInterviewStatus] = useState<
    'AWAITING_CONFIRMATION' | 'CONFIRMED' | 'RESCHEDULE_PROPOSED' | 'CANCELLED' | 'SCHEDULED' | 'COMPLETED'
  >(nexaRound2.status);
  const [interviewAuditMsg, setInterviewAuditMsg] = useState<string>(
    `${nexaRound2.transitionAuditId} • Transitioned at ${nexaRound2.transitionTimestampIso} • Slot ${nexaRound2.scheduledFullDisplay} CONFIRMED`
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
          `${data.auditEventId} • Transitioned at ${data.timestamp} • ${selectedIds.length} candidates moved to SELECTED FOR ROUND 2 • Candidate Notification: ${
            notifyCandidates ? 'YES (Dispatched)' : 'NO (Suppressed)'
          }`
        );
      }
    } catch {
      setBulkAuditBanner(
        `AUD-EMP-LOCAL • ${selectedIds.length} candidates moved to SELECTED FOR ROUND 2`
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
          interviewSlot: nexaRound2.scheduledFullDisplay,
        }),
      });
      const data = await res.json();
      if (action === 'CONFIRM_INTERVIEW') {
        setInterviewStatus('CONFIRMED');
        setInterviewAuditMsg(
          `${data?.auditEventId || nexaRound2.transitionAuditId} • Transitioned at ${
            data?.timestamp || nexaRound2.transitionTimestampIso
          } • ${nexaRound2.scheduledFullDisplay} CONFIRMED`
        );
      } else if (action === 'CHANGE_SLOT') {
        setInterviewStatus('RESCHEDULE_PROPOSED');
        setInterviewAuditMsg(
          `${data?.auditEventId || 'AUD-INT-9922'} • Slot change proposed • Awaiting candidate confirmation`
        );
      } else if (action === 'CANCEL_INTERVIEW') {
        setInterviewStatus('CANCELLED');
        setInterviewAuditMsg(
          `${data?.auditEventId || 'AUD-INT-9923'} • Cancelled by Recruiter • Assurance quota preserved`
        );
      } else if (action === 'SEND_REMINDER') {
        setInterviewAuditMsg(
          `${data?.auditEventId || 'AUD-INT-9924'} • Automated reminder dispatched for ${nexaRound2.scheduledFullDisplay}`
        );
      }
    } catch {
      if (action === 'CONFIRM_INTERVIEW') setInterviewStatus('CONFIRMED');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-5 pb-4 print:space-y-4 print:pb-0">
      {/* 1. Enterprise Header with Unambiguous 4-Stage Funnel: 42 Matched -> 10 Qualified -> 10 Shortlisted -> 5 Selected for Round 2 */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs break-inside-avoid">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider font-bold px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200">
                Corporate Recruitment &amp; Shortlisting Console
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-mono text-slate-600 font-semibold">
                Mandate: {CANONICAL_RECRUITER_FUNNEL.mandateTitle} ({CANONICAL_RECRUITER_FUNNEL.ctcBand})
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Candidate Matching Pool, Shortlist Funnel &amp; Interview Scheduling
            </h1>
            <p className="text-xs text-slate-600 max-w-3xl">
              Evaluate <strong className="text-slate-900">verified candidate profile &amp; assessment data</strong> across the canonical 9-Dimension Employability Framework (Methodology{' '}
              <code className="font-mono text-indigo-700 font-bold">
                {EMPLOYABILITY_SCORE_METHODOLOGY_VERSION}
              </code>
              ). Every interview schedule and status transition derives from the single canonical{' '}
              <code className="font-mono text-slate-800">PlacementAssuranceOpportunity</code> ledger.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-right">
              <span className="text-[10px] font-mono uppercase text-slate-500 block">
                1. Matched Pool
              </span>
              <span className="text-xs font-bold text-slate-900">
                {CANONICAL_RECRUITER_FUNNEL.matchedCount} Matched
              </span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-right">
              <span className="text-[10px] font-mono uppercase text-slate-500 block">
                2. Qualified (≥{CANONICAL_RECRUITER_FUNNEL.minEmployabilityCutoff})
              </span>
              <span className="text-xs font-bold text-emerald-800">
                {CANONICAL_RECRUITER_FUNNEL.qualifiedCount} Qualified ({CANONICAL_RECRUITER_FUNNEL.qualifiedPercentOfPool}%)
              </span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-right">
              <span className="text-[10px] font-mono uppercase text-indigo-700 block">
                3. Shortlisted → 4. Round 2
              </span>
              <span className="text-xs font-bold text-indigo-950">
                {CANONICAL_RECRUITER_FUNNEL.shortlistedCount} Shortlisted → {CANONICAL_RECRUITER_FUNNEL.round2SelectedCount} Round-2 Invited
              </span>
            </div>
            <Link href="/employer/interviews">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold h-9">
                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                Open Interview Console
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Unambiguous 5-Step Pipeline Bar (42 Matched -> 10 Qualified -> 10 Shortlisted -> 5 Selected for Round 2 -> Round 2 Confirmed 30 Sep) */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 break-inside-avoid">
        <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">
            Stage 1 • Role-Matched Pool
          </span>
          <div className="text-xs font-bold text-slate-900 mt-0.5">
            {CANONICAL_RECRUITER_FUNNEL.matchedCount} Matched Candidates
          </div>
          <div className="text-[11px] text-slate-600 mt-0.5">
            {CANONICAL_RECRUITER_FUNNEL.openings} Openings • {CANONICAL_RECRUITER_FUNNEL.ctcBand}
          </div>
        </div>

        <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">
            Stage 2 • Score Cutoff (≥77)
          </span>
          <div className="text-xs font-bold text-slate-900 mt-0.5">
            {CANONICAL_RECRUITER_FUNNEL.qualifiedCount} Qualified Candidates
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
            {CANONICAL_RECRUITER_FUNNEL.qualifiedPercentOfPool}% of 42 matched pool qualify
          </div>
        </div>

        <div className="p-3 rounded-lg bg-indigo-50/70 border-2 border-indigo-600 shadow-2xs">
          <span className="text-[10px] font-mono uppercase font-bold text-indigo-800 block">
            Stage 3 • Shortlist Funnel
          </span>
          <div className="text-xs font-bold text-indigo-950 mt-0.5">
            {CANONICAL_RECRUITER_FUNNEL.shortlistedCount} Shortlisted → {CANONICAL_RECRUITER_FUNNEL.round2SelectedCount} Round-2
          </div>
          <div className="text-[11px] text-indigo-800 font-semibold mt-0.5">
            10 Shortlisted (R1) • 5 Selected for Round 2
          </div>
        </div>

        <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">
            Stage 4 • Active Dossier
          </span>
          <div className="text-xs font-bold text-slate-900 mt-0.5">
            Aarav Sharma (84.0 / 100)
          </div>
          <div className="text-[11px] text-slate-600 mt-0.5">
            {CANONICAL_PERCENTILE_METADATA.shortLabel}
          </div>
        </div>

        <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-300 shadow-2xs">
          <span className="text-[10px] font-mono uppercase font-bold text-emerald-800 block">
            Stage 5 • Canonical Schedule
          </span>
          <div className="text-xs font-bold text-emerald-950 mt-0.5">
            Round #2: {nexaRound2.scheduledDateDisplay}
          </div>
          <div className="text-[11px] text-emerald-800 font-semibold mt-0.5">
            {nexaRound2.scheduledTimeDisplay} ({nexaRound2.durationMinutes}m • Confirmed)
          </div>
        </div>
      </div>

      {/* 3. Data-Access Privacy Boundary + Auditable DPDP Consent Governance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 break-inside-avoid">
        <Card className="lg:col-span-7 border-slate-200 bg-white shadow-xs">
          <CardHeader className="pb-2 pt-3.5 px-4 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="h-3.5 w-3.5 text-indigo-700" />
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Recruiter Data-Access Scope &amp; Tenant Privacy Boundary
                </CardTitle>
              </div>
              <Badge className="bg-slate-100 text-slate-800 border-slate-300 text-[10px] font-mono">
                Least-Privilege Hiring Access
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-3.5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-200 space-y-1">
              <div className="font-bold text-emerald-950 text-[11px] uppercase tracking-wider">
                ✓ Accessible for Hiring Purpose
              </div>
              <ul className="space-y-0.5 text-[11px] text-emerald-900 font-medium">
                <li>✓ Verified Academic Profile (CGPA, Branch, Active Backlogs)</li>
                <li>✓ 9-Dimension Employability Assessment &amp; Weighted Score</li>
                <li>✓ Verified Interview History &amp; Assurance Progress</li>
                <li>✓ Relevant Technical Assessments &amp; Verified Resume</li>
                <li>✓ Explicit DPDP Consent Status &amp; Policy Version</li>
              </ul>
            </div>
            <div className="p-2.5 rounded-lg bg-rose-50/40 border border-rose-200 space-y-1">
              <div className="font-bold text-rose-950 text-[11px] uppercase tracking-wider">
                ✕ Restricted &amp; Tenant-Isolated
              </div>
              <ul className="space-y-0.5 text-[11px] text-rose-900 font-medium">
                <li>✕ Internal Platform Analytics &amp; Commercial Telemetry</li>
                <li>✕ Unnecessary Personal / Family / Financial Information</li>
                <li>✕ Internal College TPO Coaching &amp; Remediation Notes</li>
                <li>✕ Other Corporate Employers&apos; Evaluation Rubrics &amp; Offers</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-5 border-slate-200 bg-white shadow-xs">
          <CardHeader className="pb-2 pt-3.5 px-4 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Auditable Candidate Consent &amp; Verification
                </CardTitle>
              </div>
              <Badge className="bg-emerald-50 text-emerald-800 border-emerald-300 text-[10px] font-mono">
                Policy: DPDP-2026.09-v2
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-3.5 space-y-2 text-xs">
            <div className="grid grid-cols-1 gap-1 text-[11px] text-slate-700 font-medium">
              <div className="flex items-center justify-between py-0.5 border-b border-slate-100">
                <span>✓ Placement participation consent</span>
                <span className="font-mono text-[10px] text-emerald-700 font-bold">GRANTED</span>
              </div>
              <div className="flex items-center justify-between py-0.5 border-b border-slate-100">
                <span>✓ Employer-sharing consent (NexaTech Enterprise)</span>
                <span className="font-mono text-[10px] text-emerald-700 font-bold">GRANTED</span>
              </div>
              <div className="flex items-center justify-between py-0.5 border-b border-slate-100">
                <span>✓ 9-Dimension Assessment data-sharing consent</span>
                <span className="font-mono text-[10px] text-emerald-700 font-bold">GRANTED</span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-0.5">
              <div className="text-[11px] text-slate-600 font-mono">
                Consent recorded: <strong className="text-slate-900">12 Sep 2026 (09:30 IST)</strong>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConsentModalOpen(!consentModalOpen)}
                className="h-6 text-[10px] font-semibold border-indigo-200 text-indigo-700 hover:bg-indigo-50 px-2"
              >
                {consentModalOpen ? 'Hide Consent Record' : 'View Consent Record'}
              </Button>
            </div>
            {consentModalOpen && (
              <div className="p-2 rounded bg-slate-900 text-slate-100 font-mono text-[10px] space-y-0.5">
                <div>CONSENT_ID: CNS-DPDP-88412-APX2026CS042</div>
                <div>POLICY_VERSION: DPDP-2026.09-v2 • SHA256: 9f4a81c2e7b3094d...</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 4. Streamlined Low-Density Candidate Comparison Table (Candidate | Score | Percentile | Branch | CGPA | Key Skills | Assurance | Consent | Action) */}
      <Card className="border-slate-200 bg-white shadow-xs break-inside-avoid">
        <CardHeader className="pb-2.5 pt-3.5 px-5 border-b border-slate-200 bg-slate-50/70">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-indigo-700" />
                <CardTitle className="text-sm font-bold text-slate-900">
                  Shortlisted Candidate Comparison ({CANONICAL_RECRUITER_FUNNEL.funnelSummaryText})
                </CardTitle>
              </div>
              <CardDescription className="text-xs text-slate-600 mt-0.5">
                Showing Top 5 Candidates Selected for Round 2 out of 10 Qualified &amp; Shortlisted (9-Dimension breakdown shown in Dossier below)
              </CardDescription>
            </div>

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
                  <option value="percentile">Dataset Percentile ↓</option>
                  <option value="cgpa">Academic CGPA ↓</option>
                </select>
              </div>

              <Button
                size="sm"
                onClick={() => setBulkModalOpen(true)}
                className="bg-indigo-900 hover:bg-indigo-950 text-white text-xs font-bold h-8"
              >
                <CheckSquare className="h-3.5 w-3.5 mr-1.5" />
                Shortlist {selectedIds.length} for Round 2
              </Button>
            </div>
          </div>

          {/* Compact Filter Summary Bar */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2.5 border-t border-slate-200/80 mt-2.5">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Active Filters:
            </span>
            <Badge variant="outline" className="bg-white text-slate-800 border-slate-300 text-[10px] font-mono">
              Score ≥ 77 / 100 (10 Qualify)
            </Badge>
            <Badge variant="outline" className="bg-white text-slate-800 border-slate-300 text-[10px] font-mono">
              Branch: CSE / ISE / ECE
            </Badge>
            <Badge variant="outline" className="bg-white text-slate-800 border-slate-300 text-[10px] font-mono">
              CGPA ≥ 7.50 (0 Backlogs)
            </Badge>
            <Badge variant="outline" className="bg-white text-slate-800 border-slate-300 text-[10px] font-mono">
              Location: Bengaluru (₹6.5–8.5 LPA)
            </Badge>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-300 text-[10px] font-mono">
              Consent: DPDP-2026.09-v2 Verified ✓
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-100/80 hover:bg-slate-100/80">
                <TableHead className="w-9 text-center font-mono text-[10px] font-bold text-slate-700">
                  ☐
                </TableHead>
                <TableHead className="font-mono text-[10px] font-bold text-slate-700">
                  CANDIDATE
                </TableHead>
                <TableHead className="font-mono text-[10px] font-bold text-slate-700">
                  SCORE
                </TableHead>
                <TableHead className="font-mono text-[10px] font-bold text-slate-700">
                  PERCENTILE (2026 DATASET)
                </TableHead>
                <TableHead className="font-mono text-[10px] font-bold text-slate-700">
                  BRANCH &amp; CGPA
                </TableHead>
                <TableHead className="font-mono text-[10px] font-bold text-slate-700">
                  KEY SKILLS
                </TableHead>
                <TableHead className="font-mono text-[10px] font-bold text-slate-700">
                  ASSURANCE &amp; FUNNEL
                </TableHead>
                <TableHead className="font-mono text-[10px] font-bold text-slate-700">
                  CONSENT
                </TableHead>
                <TableHead className="font-mono text-[10px] font-bold text-slate-700 text-right">
                  ACTION
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
                        ? 'bg-indigo-50/60 hover:bg-indigo-50/80 border-l-4 border-l-indigo-600'
                        : 'hover:bg-slate-50'
                    }
                  >
                    <TableCell className="text-center py-2.5">
                      <input
                        type="checkbox"
                        aria-label={`Select ${cand.name}`}
                        checked={isSelected}
                        onChange={() => toggleCandidate(cand.rollNo)}
                        className="h-3.5 w-3.5 rounded border-slate-300 text-indigo-600 cursor-pointer"
                      />
                    </TableCell>
                    <TableCell className="py-2.5">
                      <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                        {cand.name}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500">
                        {cand.rollNo}
                      </div>
                    </TableCell>
                    <TableCell className="py-2.5">
                      <span className="text-xs font-extrabold text-indigo-950 font-mono">
                        {cand.overallScore.toFixed(1)} / 100
                      </span>
                    </TableCell>
                    <TableCell className="py-2.5">
                      <span className="text-[11px] text-emerald-800 font-semibold font-mono">
                        {cand.percentile}th Percentile
                      </span>
                      <span className="block text-[9px] text-slate-500">
                        N = 14,820 Assessed
                      </span>
                    </TableCell>
                    <TableCell className="py-2.5">
                      <div className="text-xs font-bold text-slate-900">{cand.branch}</div>
                      <div className="text-[10px] text-slate-600 font-mono">
                        CGPA {cand.cgpa.toFixed(2)} ({cand.backlogs} Backlogs)
                      </div>
                    </TableCell>
                    <TableCell className="py-2.5">
                      <span className="text-[11px] font-mono text-slate-700">
                        {cand.keySkills}
                      </span>
                    </TableCell>
                    <TableCell className="py-2.5">
                      <Badge className="bg-indigo-100 text-indigo-900 border-indigo-300 text-[9px] font-bold">
                        {cand.funnelState}
                      </Badge>
                      <div className="text-[10px] font-mono text-slate-600 mt-0.5">
                        {cand.assuranceState}
                      </div>
                    </TableCell>
                    <TableCell className="py-2.5">
                      <span className="text-[10px] font-mono text-emerald-700 font-bold block">
                        ✓ {cand.consentVersion}
                      </span>
                      <span className="text-[9px] text-slate-500 font-mono">
                        {cand.consentDate}
                      </span>
                    </TableCell>
                    <TableCell className="py-2.5 text-right">
                      <span className="text-[10px] font-mono font-bold text-indigo-700">
                        {isPrimaryInspected ? 'Inspecting ↓' : 'View Dossier'}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Bulk Action Safeguard Confirmation Bar with Explicit "Shortlist 5 for Round 2" */}
          {bulkModalOpen && (
            <div className="px-4 py-3 bg-slate-900 text-white border-t border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Badge className="bg-amber-400 text-slate-950 font-bold text-[10px] uppercase">
                    Confirm Bulk Action
                  </Badge>
                  <span className="text-xs font-mono text-slate-300">
                    Funnel Transition: <strong>10 Shortlisted → {selectedIds.length} Selected for Round 2</strong>
                  </span>
                </div>
                <p className="text-[11px] text-slate-200">
                  {selectedIds.length} candidates ({selectedIds.join(', ')}) will be moved to{' '}
                  <span className="font-mono font-bold text-emerald-400">SELECTED FOR ROUND 2</span>.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <div className="flex items-center gap-2 text-xs bg-slate-800 px-2.5 py-1 rounded border border-slate-700">
                  <span className="text-slate-300 font-medium">Notify candidates:</span>
                  <label className="inline-flex items-center gap-1 cursor-pointer font-bold text-emerald-400">
                    <input
                      type="radio"
                      name="notifyCandidates"
                      checked={notifyCandidates}
                      onChange={() => setNotifyCandidates(true)}
                    />
                    Yes
                  </label>
                  <label className="inline-flex items-center gap-1 cursor-pointer font-bold text-slate-300 ml-1.5">
                    <input
                      type="radio"
                      name="notifyCandidates"
                      checked={!notifyCandidates}
                      onChange={() => setNotifyCandidates(false)}
                    />
                    No
                  </label>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBulkModalOpen(false)}
                  className="h-7 text-xs border-slate-600 text-slate-200 bg-transparent hover:bg-slate-800"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleBulkShortlistConfirm}
                  className="h-7 text-xs bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold"
                >
                  Shortlist {selectedIds.length} for Round 2
                </Button>
              </div>
            </div>
          )}

          {bulkAuditBanner && (
            <div className="px-5 py-1.5 bg-emerald-950 text-emerald-200 text-[10px] font-mono flex items-center justify-between">
              <span>✓ {bulkAuditBanner}</span>
              <span>Funnel: 42 Matched → 10 Qualified → 10 Shortlisted → 5 Round-2</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 5. Expanded 360° Candidate Dossier: Aarav Sharma (APX2026CS042) — Derived 100% from CANONICAL_AARAV_OPPORTUNITIES */}
      <Card className="border-2 border-indigo-900 bg-white shadow-sm overflow-hidden break-inside-avoid">
        <div className="bg-indigo-950 text-white px-5 py-3.5 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-emerald-400 text-slate-950 font-bold text-[10px] uppercase">
                Verified Candidate Dossier • Canonical Record stu-apex-2026-01
              </Badge>
              <span className="text-xs font-mono text-indigo-200">
                Roll No: APX2026CS042 • Apex Institute of Technology (APX123)
              </span>
            </div>
            <h2 className="text-lg font-bold tracking-tight">
              Aarav Sharma — B.Tech Computer Science &amp; Engineering (2026 Graduating Cohort)
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="px-3 py-1.5 rounded-lg bg-indigo-900/90 border border-indigo-700 text-right">
              <span className="text-[10px] font-mono uppercase text-indigo-300 block">
                Weighted Employability Score
              </span>
              <span className="text-base font-extrabold text-white font-mono">
                84.0 / 100{' '}
                <span className="text-[11px] text-emerald-300">
                  ({CANONICAL_PERCENTILE_METADATA.shortLabel})
                </span>
              </span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-emerald-900/80 border border-emerald-600 text-right">
              <span className="text-[10px] font-mono uppercase text-emerald-200 block">
                NexaTech Interview Stage
              </span>
              <span className="text-xs font-bold text-white font-mono">
                R1 Completed (19 Sep) → R2 Confirmed ({nexaRound2.scheduledDateDisplay} • {nexaRound2.scheduledTimeDisplay})
              </span>
            </div>
          </div>
        </div>

        <CardContent className="p-5 space-y-5">
          {/* Row A: All 9 Canonical Dimensions + How This Score Is Calculated */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-7 space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    9-Dimension Employability Diagnostic Breakdown (All 9 Canonical Dimensions)
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    Unified schema across Database → API → Student Scorecard → TPO Roster → Recruiter Dossier
                  </p>
                </div>
                <Badge className="bg-indigo-50 text-indigo-800 border-indigo-200 font-mono text-[10px]">
                  9 / 9 Dimensions Verified
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {aaravBreakdown.dimensions.map((dim) => (
                  <div
                    key={dim.key}
                    className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-indigo-700">
                          #{dim.index} • Wt {dim.weightPercent}%
                        </span>
                        <span className="text-xs font-extrabold font-mono text-slate-900">
                          {dim.score} / 100
                        </span>
                      </div>
                      <div className="text-xs font-bold text-slate-900 mt-0.5">
                        {dim.label}
                      </div>
                      <p className="text-[10px] text-slate-600 mt-0.5 leading-tight">
                        {dim.description}
                      </p>
                    </div>
                    <div className="mt-1.5 pt-1 border-t border-slate-200/80 flex items-center justify-between text-[10px] font-mono text-emerald-800 font-semibold">
                      <span>{dim.score} × {dim.weightPercent}%</span>
                      <span>= {dim.weightedPoints.toFixed(2)} pts</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                <div className="flex items-center gap-1.5">
                  <Calculator className="h-3.5 w-3.5 text-indigo-700" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    How This Score Is Calculated
                  </h3>
                </div>
                <Badge className="bg-slate-900 text-white font-mono text-[10px]">
                  Methodology → Version {EMPLOYABILITY_SCORE_METHODOLOGY_VERSION}
                </Badge>
              </div>

              <div className="rounded-lg border border-slate-300 bg-slate-950 text-slate-100 p-3.5 font-mono text-xs space-y-1.5">
                <div className="flex items-center justify-between text-[10px] text-indigo-300 border-b border-slate-800 pb-1 font-bold">
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
                <div className="pt-1.5 border-t border-slate-700 flex items-center justify-between text-xs font-extrabold text-white">
                  <span>Weighted Employability Score (100%)</span>
                  <span className="text-emerald-400">
                    {aaravBreakdown.weightedCompositeScore.toFixed(1)} / 100
                  </span>
                </div>
                <div className="text-[10px] text-slate-300 pt-1 leading-snug">
                  <strong>Defensible Population Definition:</strong> {CANONICAL_PERCENTILE_METADATA.fullPopulationLabel}.
                </div>
              </div>
            </div>
          </div>

          {/* Row B: Canonical PlacementAssuranceOpportunity Ledger + Enterprise Interview Scheduling Object (Both Derived from CANONICAL_AARAV_OPPORTUNITIES) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2 border-t border-slate-200">
            {/* Left 5 Cols: Canonical 3-Interview Assurance Ledger */}
            <div className="lg:col-span-5 rounded-xl border border-indigo-200 bg-indigo-50/40 p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-950">
                  Canonical 3-Interview Assurance Ledger
                </span>
                <Badge className="bg-indigo-900 text-white font-mono text-[10px]">
                  1 / 3 Completed
                </Badge>
              </div>

              <div className="p-2.5 rounded-lg bg-white border border-indigo-200 text-xs text-slate-700 space-y-1">
                <div className="font-bold text-indigo-950 flex items-center gap-1.5 text-[11px]">
                  <Info className="h-3.5 w-3.5 text-indigo-700 shrink-0" />
                  What &ldquo;Counts Toward Assurance&rdquo; Means:
                </div>
                <p className="text-[10px] leading-relaxed">
                  Each opportunity below derives from <code className="font-mono">PlacementAssuranceOpportunity</code>. An interview counts toward the student&apos;s <strong>3-interview independent assurance requirement</strong> upon verified attendance and completion.
                </p>
              </div>

              <div className="space-y-2 text-xs font-mono">
                {CANONICAL_AARAV_OPPORTUNITIES.map((opp) => (
                  <div
                    key={opp.id}
                    className={
                      opp.assuranceStage === 'COMPLETED'
                        ? 'p-2.5 rounded bg-emerald-50 border border-emerald-300'
                        : opp.assuranceStage === 'SCHEDULED'
                        ? 'p-2.5 rounded bg-indigo-100/80 border border-indigo-300'
                        : 'p-2.5 rounded bg-white border border-slate-200'
                    }
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-950 text-[11px]">
                        {opp.assuranceBadgeText} — {opp.employerName}
                      </span>
                      <Badge
                        className={
                          opp.assuranceStage === 'COMPLETED'
                            ? 'bg-emerald-700 text-white text-[9px]'
                            : opp.assuranceStage === 'SCHEDULED'
                            ? 'bg-indigo-700 text-white text-[9px]'
                            : 'bg-slate-200 text-slate-800 text-[9px]'
                        }
                      >
                        {opp.assuranceStage}
                      </Badge>
                    </div>
                    <div className="text-[10px] text-slate-700 mt-0.5">
                      {opp.assuranceProgressSummary}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 7 Cols: Enterprise Interview Scheduling Object (Derived from nexaOpportunity.interviews[1] = 30 Sep 2026, 14:30-15:30 IST) */}
            <div className="lg:col-span-7 rounded-xl border-2 border-emerald-600 bg-white p-4 space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
                <div>
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-emerald-700" />
                    <h3 className="text-sm font-bold text-slate-900">
                      Enterprise Interview Scheduling Object ({nexaOpportunity.id} • {nexaRound2.id})
                    </h3>
                  </div>
                  <p className="text-[10px] text-slate-600 mt-0.5 font-mono">
                    Source: PlacementAssuranceOpportunity[1].interviews[2] • R1 Completed {nexaRound1.scheduledDateDisplay} → R2 Confirmed {nexaRound2.scheduledDateDisplay}
                  </p>
                </div>

                <Badge
                  className={
                    interviewStatus === 'CONFIRMED'
                      ? 'bg-emerald-700 text-white font-mono text-xs px-3 py-0.5'
                      : interviewStatus === 'CANCELLED'
                      ? 'bg-rose-700 text-white font-mono text-xs px-3 py-0.5'
                      : 'bg-amber-500 text-slate-950 font-mono text-xs px-3 py-0.5'
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

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500 block">Round &amp; Type</span>
                  <span className="font-bold text-slate-900">
                    Round {nexaRound2.roundNumber} • {nexaRound2.roundType}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500 block">Interview Panel</span>
                  <span className="font-bold text-slate-900">{nexaRound2.panelDisplay}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500 block">Candidate</span>
                  <span className="font-bold text-slate-900">Aarav Sharma (APX2026CS042)</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500 block">Canonical Date &amp; Time</span>
                  <span className="font-bold text-emerald-900 font-mono">
                    {nexaRound2.scheduledDateDisplay} • {nexaRound2.scheduledTimeDisplay}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500 block">Duration</span>
                  <span className="font-bold text-slate-900">{nexaRound2.durationMinutes} minutes</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500 block">Meeting Room</span>
                  <span className="font-bold text-indigo-700 font-mono">
                    {nexaRound2.meetingPlatform} ({nexaRound2.meetingUrl})
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
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

              <div className="p-2.5 rounded-lg bg-emerald-950 text-emerald-100 font-mono text-[10px] space-y-1">
                <div className="font-bold text-emerald-300">✓ {interviewAuditMsg}</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-emerald-200">
                  <span>✓ Candidate notified</span>
                  <span>✓ Recruiter notified</span>
                  <span>✓ Panel notified</span>
                  <span>✓ Calendar event (.ics) created</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
