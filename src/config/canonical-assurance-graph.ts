/**
 * Single Canonical System-of-Record Graph for PlacementAssuranceOpportunity,
 * Interview Schedules, Shortlist Funnel, and Percentile Population Metadata.
 *
 * Every screen across Student -> TPO -> Recruiter -> Super Admin derives from
 * this single graph so cross-screen state divergence is structurally impossible.
 */

export const CANONICAL_PERCENTILE_METADATA = {
  percentileValue: 91,
  shortLabel: '91st Percentile (2026 Assessment Dataset)',
  fullPopulationLabel:
    '91st percentile among 2026 graduating candidates in the PlacementConnect assessment dataset (N = 14,820 evaluated candidates)',
  datasetPopulationSize: 14820,
  methodologyVersion: 'v3.2',
} as const;

export const CANONICAL_RECRUITER_FUNNEL = {
  mandateId: 'job-nexa-01',
  mandateTitle: 'Associate Software Engineer (Full-Stack)',
  employerName: 'NexaTech Enterprise Solutions Pvt. Ltd.',
  ctcBand: '₹6.5–8.5 LPA',
  openings: 18,
  location: 'Bengaluru (Hybrid)',
  minEmployabilityCutoff: 77,
  matchedCount: 42,
  qualifiedCount: 10,
  qualifiedPercentOfPool: 23.8,
  shortlistedCount: 10,
  round2SelectedCount: 5,
  funnelSummaryText: '42 Matched → 10 Qualified (≥77) → 10 Shortlisted → 5 Selected for Round 2',
} as const;

export interface CanonicalInterviewRound {
  id: string;
  roundNumber: number;
  roundName: string;
  roundType: string;
  scheduledDateDisplay: string;
  scheduledTimeDisplay: string;
  scheduledFullDisplay: string;
  scheduledIso: string;
  durationMinutes: number;
  panelDisplay: string;
  meetingPlatform: string;
  meetingUrl: string;
  status: 'COMPLETED' | 'CONFIRMED' | 'SCHEDULED' | 'AWAITING_CONFIRMATION';
  attendanceStatus: 'ATTENDED_ON_TIME' | 'CONFIRMED_UPCOMING' | 'SCHEDULED_UPCOMING';
  evaluationScoreDisplay: string;
  countsTowardAssurance: boolean;
  transitionTimestampIso: string;
  transitionAuditId: string;
}

export interface CanonicalAssuranceOpportunity {
  id: string;
  opportunityNumber: 1 | 2 | 3;
  employerId: string;
  employerName: string;
  jobId: string;
  jobTitle: string;
  ctcDisplay: string;
  location: string;
  assuranceStage: 'COMPLETED' | 'SCHEDULED' | 'MATCHING';
  assuranceBadgeText: string;
  assuranceProgressSummary: string;
  countsTowardAssuranceRule: string;
  interviews: CanonicalInterviewRound[];
}

export const CANONICAL_AARAV_OPPORTUNITIES: CanonicalAssuranceOpportunity[] = [
  {
    id: 'opp-apex-01',
    opportunityNumber: 1,
    employerId: 'emp-nexatech-2026',
    employerName: 'NexaTech Enterprise Solutions Pvt. Ltd.',
    jobId: 'job-nexa-01',
    jobTitle: 'Associate Software Engineer (Full-Stack)',
    ctcDisplay: '₹6.5–8.5 LPA',
    location: 'Bengaluru (Hybrid)',
    assuranceStage: 'COMPLETED',
    assuranceBadgeText: '✓ 1 Verified (Opportunity #1)',
    assuranceProgressSummary:
      'Round 1 Completed (19 Sep 2026) • Round 2 Confirmed (30 Sep 2026, 14:30–15:30 IST)',
    countsTowardAssuranceRule:
      'Counted as Opportunity #1 of 3 after punctual attendance and completion of Round 1 on 19 Sep 2026 (Audit ID: AUD-2026-99794).',
    interviews: [
      {
        id: 'int-nexa-r1',
        roundNumber: 1,
        roundName: 'Round 1 — Technical & Algorithmic Assessment Panel',
        roundType: 'Technical & Data Structures',
        scheduledDateDisplay: '19 Sep 2026',
        scheduledTimeDisplay: '14:00–15:00 IST',
        scheduledFullDisplay: '19 Sep 2026 • 14:00–15:00 IST (60m)',
        scheduledIso: '2026-09-19T14:00:00+05:30',
        durationMinutes: 60,
        panelDisplay: 'Vikramaditya Rao (VP Engineering)',
        meetingPlatform: 'Google Meet',
        meetingUrl: 'meet.google.com/nxa-r1-arh',
        status: 'COMPLETED',
        attendanceStatus: 'ATTENDED_ON_TIME',
        evaluationScoreDisplay: '86.3 / 100 (Advanced to Round 2 System Design)',
        countsTowardAssurance: true,
        transitionTimestampIso: '2026-09-19T15:08:12+05:30',
        transitionAuditId: 'AUD-2026-99794',
      },
      {
        id: 'int-nexa-r2',
        roundNumber: 2,
        roundName: 'Round 2 — System Design & Hiring Manager Panel',
        roundType: 'System Design & Architecture',
        scheduledDateDisplay: '30 Sep 2026',
        scheduledTimeDisplay: '14:30–15:30 IST',
        scheduledFullDisplay: '30 Sep 2026 • 14:30–15:30 IST (60m)',
        scheduledIso: '2026-09-30T14:30:00+05:30',
        durationMinutes: 60,
        panelDisplay: 'Hiring Manager (Vikramaditya Rao) + Senior Engineer (Meera Krishnan)',
        meetingPlatform: 'Google Meet',
        meetingUrl: 'meet.google.com/nxa-r2-arh',
        status: 'CONFIRMED',
        attendanceStatus: 'CONFIRMED_UPCOMING',
        evaluationScoreDisplay: 'Confirmed Slot — 30 Sep 2026, 14:30–15:30 IST',
        countsTowardAssurance: true,
        transitionTimestampIso: '2026-09-25T16:15:00+05:30',
        transitionAuditId: 'AUD-INT-2026-99841',
      },
    ],
  },
  {
    id: 'opp-apex-02',
    opportunityNumber: 2,
    employerId: 'emp-fincore-2026',
    employerName: 'FinCore Digital Systems India',
    jobId: 'job-fincore-02',
    jobTitle: 'Graduate Product & Systems Analyst',
    ctcDisplay: '₹6.0–7.5 LPA',
    location: 'Hyderabad / Bengaluru',
    assuranceStage: 'SCHEDULED',
    assuranceBadgeText: '◉ 1 Scheduled (Opportunity #2)',
    assuranceProgressSummary:
      'Round 1 Confirmed: 03 Oct 2026 • 11:30–12:30 IST (Independent Employer #2)',
    countsTowardAssuranceRule:
      'Will count as Opportunity #2 of 3 upon verified attendance and completion on 03 Oct 2026.',
    interviews: [
      {
        id: 'int-fincore-r1',
        roundNumber: 1,
        roundName: 'Round 1 — Analytical & Product Systems Case Round',
        roundType: 'Product & Analytical Systems',
        scheduledDateDisplay: '03 Oct 2026',
        scheduledTimeDisplay: '11:30–12:30 IST',
        scheduledFullDisplay: '03 Oct 2026 • 11:30–12:30 IST (60m)',
        scheduledIso: '2026-10-03T11:30:00+05:30',
        durationMinutes: 60,
        panelDisplay: 'Siddharth Verma (Director of Product Engineering)',
        meetingPlatform: 'Microsoft Teams',
        meetingUrl: 'teams.microsoft.com/l/meetup-join/fincore-r1',
        status: 'SCHEDULED',
        attendanceStatus: 'SCHEDULED_UPCOMING',
        evaluationScoreDisplay: 'Scheduled — 03 Oct 2026, 11:30–12:30 IST',
        countsTowardAssurance: true,
        transitionTimestampIso: '2026-09-22T15:00:00+05:30',
        transitionAuditId: 'AUD-INT-2026-99610',
      },
    ],
  },
  {
    id: 'opp-apex-03',
    opportunityNumber: 3,
    employerId: 'emp-cloudscale-2026',
    employerName: 'CloudScale Systems India Pvt. Ltd.',
    jobId: 'job-cloudscale-03',
    jobTitle: 'Software Development Engineer — Cloud Infrastructure',
    ctcDisplay: '₹7.5–9.5 LPA',
    location: 'Bengaluru / Pune',
    assuranceStage: 'MATCHING',
    assuranceBadgeText: '○ 1 Matching (Opportunity #3)',
    assuranceProgressSummary:
      'CloudScale Systems India • 92% Score Fit Reserved (Independent Employer #3)',
    countsTowardAssuranceRule:
      'Reserved as Opportunity #3 of 3 in the 12-month assurance window.',
    interviews: [],
  },
];
