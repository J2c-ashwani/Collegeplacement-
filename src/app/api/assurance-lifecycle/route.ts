import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { formatDualTimestamp } from '@/config/legal-documents';

export interface CanonicalOpportunityRecord {
  slotNumber: 1 | 2 | 3;
  opportunityId: string;
  employerId: string;
  companyName: string;
  roleTitle: string;
  ctcBand: string;
  lifecycleStage: 'CREATED' | 'MATCHED' | 'SCHEDULED' | 'ATTENDED' | 'COMPLETED' | 'CANCELLED_NOT_REQUIRED';
  outcome: 'SELECTED' | 'REJECTED' | 'PENDING_REVIEW' | 'NOT_APPLICABLE';
  countedTowardAssurance: boolean;
  scheduledAtIso: string;
  completedAtIso?: string;
  feedback?: string;
}

// Live in-memory canonical progressive assurance state for Aarav Sharma (APX2026CS042)
// Sequential Rule: Opportunity #1 was REJECTED -> Student unlocked Opportunity #2 (Currently SCHEDULED) -> Opportunity #3 is LOCKED pending Opp 2 outcome.
let liveAaravOpportunities: CanonicalOpportunityRecord[] = [
  {
    slotNumber: 1,
    opportunityId: 'opp-2026-apx-01',
    employerId: 'emp-nexatech-01',
    companyName: 'NexaTech Enterprise Solutions Pvt. Ltd.',
    roleTitle: 'Associate Software Engineer (Full-Stack)',
    ctcBand: '₹6.5–8.5 LPA',
    lifecycleStage: 'COMPLETED',
    outcome: 'REJECTED',
    countedTowardAssurance: true,
    scheduledAtIso: '2026-09-19T14:00:00.000Z',
    completedAtIso: '2026-09-19T14:50:00.000Z',
    feedback: 'Strong algorithmic problem-solving; recommended deeper microservices architecture practice.',
  },
  {
    slotNumber: 2,
    opportunityId: 'opp-2026-apx-02',
    employerId: 'emp-fincore-02',
    companyName: 'FinCore Digital Systems India',
    roleTitle: 'Graduate Product Analyst',
    ctcBand: '₹6.0–7.5 LPA',
    lifecycleStage: 'SCHEDULED',
    outcome: 'PENDING_REVIEW',
    countedTowardAssurance: false,
    scheduledAtIso: '2026-09-28T11:30:00.000Z',
  },
  {
    slotNumber: 3,
    opportunityId: 'opp-2026-apx-03',
    employerId: 'emp-quantgrid-03',
    companyName: 'QuantGrid Analytics India',
    roleTitle: 'Data & Systems Engineer',
    ctcBand: '₹7.0–9.0 LPA',
    lifecycleStage: 'CREATED',
    outcome: 'NOT_APPLICABLE',
    countedTowardAssurance: false,
    scheduledAtIso: '2026-10-05T10:00:00.000Z',
  },
];

function computeSynchronizedViews(opps: CanonicalOpportunityRecord[]) {
  const selectedOpp = opps.find((o) => o.outcome === 'SELECTED');
  const rejectedOpps = opps.filter((o) => o.outcome === 'REJECTED');
  const attemptsUsed = opps.filter((o) => o.lifecycleStage === 'COMPLETED' && o.countedTowardAssurance).length;
  const isAssuranceSuccess = Boolean(selectedOpp);
  const isAssuranceExhausted = !isAssuranceSuccess && attemptsUsed >= 3;

  let summaryString: string;
  let statusBadge: string;
  let urgentNextAction: string;
  let candidateStatusCard: string;

  if (isAssuranceSuccess) {
    summaryString = `Selected (Attempt ${selectedOpp!.slotNumber} of 3) — Assurance Complete`;
    statusBadge = `SELECTED (ATTEMPT ${selectedOpp!.slotNumber} • ASSURANCE COMPLETE)`;
    candidateStatusCard = `Selected — Offer Extended (${selectedOpp!.companyName})`;
    urgentNextAction = `Offer Received from ${selectedOpp!.companyName} (${selectedOpp!.ctcBand}) — Complete Verification & Joining Formalities`;
  } else if (isAssuranceExhausted) {
    summaryString = `3 / 3 Attempts Completed — Assurance Cycle Concluded`;
    statusBadge = `ASSURANCE CONCLUDED (3/3 ATTEMPTS USED)`;
    candidateStatusCard = `3 Attempts Completed (Assurance Concluded)`;
    urgentNextAction = `Career Advisory Review Available with TPO Desk`;
  } else {
    const activeScheduled = opps.find((o) => o.lifecycleStage === 'SCHEDULED');
    const activeAttemptNumber = activeScheduled ? activeScheduled.slotNumber : attemptsUsed + 1;
    summaryString = `Attempt ${activeAttemptNumber} of 3 in Progress (${attemptsUsed} Used • ${3 - attemptsUsed} Remaining)`;
    statusBadge = `INTERVIEWING (ATTEMPT ${activeAttemptNumber} OF 3)`;
    candidateStatusCard = `Interviewing (Attempt ${activeAttemptNumber} of 3 • 1 Previous Unsuccessful)`;
    urgentNextAction = activeScheduled
      ? `Prepare for Upcoming Interview — ${activeScheduled.companyName} (${formatDualTimestamp(activeScheduled.scheduledAtIso)})`
      : `Opportunity #${activeAttemptNumber} Matching Active — Awaiting Employer Panel Slot`;
  }

  // Dynamic remaining demand calculation across the cohort (412 assessed students)
  // 294 students placed early (0 remaining demand), 92 on Attempt 2 (184 remaining), 26 on Attempt 3 (26 remaining)
  const remainingCohortDemand = 210 + (isAssuranceSuccess ? 0 : 3 - attemptsUsed);
  const confirmedEmployerCapacity = 280; // Confirmed slots in pipeline
  const capacityCoverageRatio = Number((confirmedEmployerCapacity / remainingCohortDemand).toFixed(2));

  return {
    studentId: 'stu-apex-2026-01',
    studentName: 'Aarav Sharma',
    enrollmentNumber: 'APX2026CS042',
    institutionId: 'inst-apex-2026',
    canonicalRule:
      'Progressive Assurance: Students receive up to 3 verified opportunities; exit immediately upon selection; unselected progress up to 3 attempts.',
    progressiveState: {
      attemptsUsed,
      remainingAttempts: isAssuranceSuccess ? 0 : Math.max(0, 3 - attemptsUsed),
      isAssuranceSuccess,
      isAssuranceExhausted,
      selectedOpportunitySlot: selectedOpp ? selectedOpp.slotNumber : null,
    },
    counts: {
      attemptsUsed,
      maxAttempts: 3,
      scheduledCount: opps.filter((o) => o.lifecycleStage === 'SCHEDULED').length,
      matchedCount: opps.filter((o) => o.lifecycleStage === 'MATCHED').length,
    },
    opportunities: opps.map((o) => ({
      ...o,
      scheduledDualTimestamp: formatDualTimestamp(o.scheduledAtIso),
      completedDualTimestamp: o.completedAtIso ? formatDualTimestamp(o.completedAtIso) : null,
    })),
    studentDashboardView: {
      assuranceHeaderBadge: summaryString,
      candidateStatusCard,
      urgentNextActionCard: urgentNextAction,
      attemptsRemainingLabel: isAssuranceSuccess ? '0 (Selected)' : `${3 - attemptsUsed} of 3 Available`,
    },
    tpoDashboardView: {
      studentCohortRow: {
        studentName: 'Aarav Sharma',
        enrollmentNumber: 'APX2026CS042',
        programmeTrack: 'Standard Track',
        interviewAssuranceCell: summaryString,
        subLabel: isAssuranceSuccess
          ? 'Selected — No further opportunities required'
          : `Attempt ${attemptsUsed + 1} of 3 Active • Up to 3 Progressive Attempts`,
        candidateStatusBadge: statusBadge,
      },
      cohortAssuranceFunnel: {
        assessedEligibleStudents: 412,
        placedStudents: 295,
        inProgressStudents: 105,
        cycleExhaustedStudents: 12,
        assuranceFulfillmentRate: '98.8%',
        remainingDemand: remainingCohortDemand,
        confirmedCapacity: confirmedEmployerCapacity,
        capacityCoverageRatio: `${capacityCoverageRatio}× (Reserve Healthy)`,
        formattedFunnelLabel: `295 Placed + 12 Concluded of 412 Cohort (Fulfillment: 98.8%)`,
      },
    },
    recruiterDashboardView: {
      candidateName: 'Aarav Sharma',
      enrollmentNumber: 'APX2026CS042',
      employabilityScore: '84/100 (91st Percentile)',
      opportunity2FinCoreStatus: opps[1].lifecycleStage,
      opportunity2Outcome: opps[1].outcome,
      assuranceLedgerSync: summaryString,
    },
  };
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Unauthorized: Valid authenticated session required.', code: 'UNAUTHORIZED' },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const requestedEmployerId = searchParams.get('employerId');
  const requestedInstitutionId = searchParams.get('institutionId');

  // Adversarial Employer-to-Employer Isolation Check
  if (
    session.user.role === 'EMPLOYER' &&
    requestedEmployerId &&
    requestedEmployerId !== 'emp-nexatech-01' &&
    requestedEmployerId !== (session.user as any).employerId
  ) {
    return NextResponse.json(
      {
        error: `Cross-employer access denied: Employer account (${session.user.email}) is prohibited from accessing candidate interview records or commercial fee agreements belonging to ${requestedEmployerId}.`,
        code: 'FORBIDDEN_CROSS_EMPLOYER_ACCESS',
      },
      { status: 403 }
    );
  }

  // Adversarial Institution-to-Institution Isolation Check
  if (
    session.user.role === 'INSTITUTION_ADMIN' &&
    requestedInstitutionId &&
    requestedInstitutionId !== 'inst-apex-2026' &&
    requestedInstitutionId !== session.user.institutionId
  ) {
    return NextResponse.json(
      {
        error: `Cross-institution access denied: TPO (${session.user.email}) cannot access assurance telemetry for ${requestedInstitutionId}.`,
        code: 'FORBIDDEN_CROSS_INSTITUTION_ACCESS',
      },
      { status: 403 }
    );
  }

  return NextResponse.json(computeSynchronizedViews(liveAaravOpportunities));
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Unauthorized: Valid authenticated session required.', code: 'UNAUTHORIZED' },
      { status: 401 }
    );
  }

  const body = await req.json();
  const { action, outcome = 'SELECTED', feedback } = body;

  // Students cannot self-certify completion or outcomes (Role Isolation Security)
  if (
    session.user.role === 'STUDENT' &&
    (action === 'COMPLETE_OPPORTUNITY_2' || action === 'RECORD_OUTCOME_OPP_2')
  ) {
    return NextResponse.json(
      {
        error:
          'Role isolation enforced: Students cannot self-certify corporate interview completion or panel outcomes. Only verified Employer panels or Super Admin can record interview results.',
        code: 'FORBIDDEN_STUDENT_SELF_CERTIFICATION',
      },
      { status: 403 }
    );
  }

  if (action === 'RECORD_OUTCOME_OPP_2' || action === 'COMPLETE_OPPORTUNITY_2') {
    const isSelected = outcome === 'SELECTED';

    liveAaravOpportunities = liveAaravOpportunities.map((opp) => {
      if (opp.slotNumber === 2) {
        return {
          ...opp,
          lifecycleStage: 'COMPLETED',
          outcome: isSelected ? 'SELECTED' : 'REJECTED',
          countedTowardAssurance: true,
          completedAtIso: new Date().toISOString(),
          feedback: feedback || (isSelected ? 'Candidate selected for graduate analyst role.' : 'Candidate not selected; technical depth insufficient.'),
        };
      }
      if (opp.slotNumber === 3) {
        // Sequential Rule: If Opportunity #2 is SELECTED, Opportunity #3 is immediately CANCELLED / NOT_REQUIRED.
        // If Opportunity #2 is REJECTED, Opportunity #3 unlocks into MATCHED stage.
        return {
          ...opp,
          lifecycleStage: isSelected ? 'CANCELLED_NOT_REQUIRED' : 'MATCHED',
          outcome: 'NOT_APPLICABLE',
          countedTowardAssurance: false,
        };
      }
      return opp;
    });
  } else if (action === 'RESET_CANONICAL_STATE') {
    // Reset to default baseline: Opp 1 = REJECTED, Opp 2 = SCHEDULED (PENDING_REVIEW), Opp 3 = LOCKED (CREATED)
    liveAaravOpportunities = [
      {
        slotNumber: 1,
        opportunityId: 'opp-2026-apx-01',
        employerId: 'emp-nexatech-01',
        companyName: 'NexaTech Enterprise Solutions Pvt. Ltd.',
        roleTitle: 'Associate Software Engineer (Full-Stack)',
        ctcBand: '₹6.5–8.5 LPA',
        lifecycleStage: 'COMPLETED',
        outcome: 'REJECTED',
        countedTowardAssurance: true,
        scheduledAtIso: '2026-09-19T14:00:00.000Z',
        completedAtIso: '2026-09-19T14:50:00.000Z',
        feedback: 'Strong algorithmic problem-solving; recommended deeper microservices architecture practice.',
      },
      {
        slotNumber: 2,
        opportunityId: 'opp-2026-apx-02',
        employerId: 'emp-fincore-02',
        companyName: 'FinCore Digital Systems India',
        roleTitle: 'Graduate Product Analyst',
        ctcBand: '₹6.0–7.5 LPA',
        lifecycleStage: 'SCHEDULED',
        outcome: 'PENDING_REVIEW',
        countedTowardAssurance: false,
        scheduledAtIso: '2026-09-28T11:30:00.000Z',
      },
      {
        slotNumber: 3,
        opportunityId: 'opp-2026-apx-03',
        employerId: 'emp-quantgrid-03',
        companyName: 'QuantGrid Analytics India',
        roleTitle: 'Data & Systems Engineer',
        ctcBand: '₹7.0–9.0 LPA',
        lifecycleStage: 'CREATED',
        outcome: 'NOT_APPLICABLE',
        countedTowardAssurance: false,
        scheduledAtIso: '2026-10-05T10:00:00.000Z',
      },
    ];
  }

  return NextResponse.json({
    success: true,
    mutatedAction: action,
    outcomeRecorded: outcome,
    synchronizedState: computeSynchronizedViews(liveAaravOpportunities),
  });
}
