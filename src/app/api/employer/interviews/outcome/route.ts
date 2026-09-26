import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireApiAuth } from '@/lib/auth-utils';
import { successResponse, validationError, handleApiError, notFoundError, forbiddenError } from '@/lib/errors';
import { createAuditLog, AuditActions } from '@/services/audit.service';
import { z } from 'zod';

const recordOutcomeSchema = z.object({
  opportunityId: z.string(),
  interviewId: z.string().optional(),
  outcome: z.enum(['SELECTED', 'REJECTED']),
  feedback: z.string().min(5, 'Feedback must provide at least 5 characters of guidance for the candidate or TPO desk'),
  rubricScores: z.record(z.string(), z.number()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await requireApiAuth(['EMPLOYER', 'SUPER_ADMIN', 'OPERATIONS']);
    const body = await req.json();
    const parsed = recordOutcomeSchema.safeParse(body);

    if (!parsed.success) {
      return validationError('Invalid outcome payload', parsed.error.format() as any);
    }

    const { opportunityId, interviewId, outcome, feedback, rubricScores } = parsed.data;

    // 1. Fetch opportunity and verify ownership (Multi-Tenant Isolation)
    const opportunity = await prisma.assuranceOpportunity.findUnique({
      where: { id: opportunityId },
      include: {
        student: true,
        studentProgramme: true,
        employer: true,
        job: true,
        interviews: {
          orderBy: { roundNumber: 'desc' },
          take: 1,
        },
      },
    });

    if (!opportunity) return notFoundError('Assurance opportunity not found');

    // Tenant check: Employer can only record outcomes for their own interviews
    if (session.user.role === 'EMPLOYER') {
      const employerUser = await prisma.employerUser.findFirst({
        where: { userId: session.user.id },
      });
      if (!employerUser || employerUser.employerId !== opportunity.employerId) {
        return forbiddenError('Cross-employer access denied: You cannot submit evaluation outcomes for another company.');
      }
    }

    const targetInterviewId = interviewId || opportunity.interviews[0]?.id;
    const isSelected = outcome === 'SELECTED';

    // 2. Atomic state machine execution
    const result = await prisma.$transaction(async (tx) => {
      // a. Update Opportunity
      const updatedOpp = await tx.assuranceOpportunity.update({
        where: { id: opportunityId },
        data: {
          status: isSelected ? 'SELECTED' : 'REJECTED',
          outcome: feedback,
          completedDate: new Date(),
        },
      });

      // b. Update linked Interview if present
      if (targetInterviewId) {
        await tx.interview.update({
          where: { id: targetInterviewId },
          data: {
            status: isSelected ? 'SELECTED' : 'REJECTED',
            result: outcome,
            feedback,
            completedAt: new Date(),
          },
        });
      }

      // c. State machine progression logic on StudentProgramme
      let programmeOutcomeStatus = 'ACTIVE';
      if (isSelected) {
        // Immediate Exit: Student achieved selection; assurance completed; future quota cleared
        await tx.studentProgramme.update({
          where: { id: opportunity.studentProgrammeId },
          data: {
            status: 'PLACED',
            assuranceStatus: 'TARGET_COMPLETED',
            opportunitiesRemaining: 0,
          },
        });
        programmeOutcomeStatus = 'ASSURANCE_COMPLETE_SELECTED';
      } else {
        // Candidate not selected: Check if 3 attempts have been exhausted
        const totalCompleted = await tx.assuranceOpportunity.count({
          where: {
            studentProgrammeId: opportunity.studentProgrammeId,
            status: { in: ['REJECTED', 'COMPLETED'] },
          },
        });

        if (totalCompleted >= 3 || opportunity.studentProgramme.opportunitiesRemaining <= 1) {
          await tx.studentProgramme.update({
            where: { id: opportunity.studentProgrammeId },
            data: {
              assuranceStatus: 'TARGET_COMPLETED',
              opportunitiesRemaining: 0,
            },
          });
          programmeOutcomeStatus = 'ASSURANCE_CYCLE_EXHAUSTED';
        } else {
          // Student remains eligible for Attempt N+1
          programmeOutcomeStatus = 'ELIGIBLE_FOR_NEXT_PROGRESSIVE_OPPORTUNITY';
        }
      }

      return { updatedOpp, programmeOutcomeStatus };
    });

    await createAuditLog({
      userId: session.user.id,
      userRole: session.user.role,
      action: isSelected ? AuditActions.OFFER_CREATED : ('INTERVIEW_REJECTED' as any),
      entity: 'AssuranceOpportunity',
      entityId: opportunity.id,
      newValue: {
        outcome,
        studentId: opportunity.studentId,
        employerId: opportunity.employerId,
        feedback,
        programmeOutcomeStatus: result.programmeOutcomeStatus,
      },
    });

    return successResponse({
      opportunityId: opportunity.id,
      outcome,
      programmeOutcomeStatus: result.programmeOutcomeStatus,
      message: isSelected
        ? 'Selection recorded successfully. Candidate has exited the assurance cycle.'
        : result.programmeOutcomeStatus === 'ASSURANCE_CYCLE_EXHAUSTED'
        ? 'Rejection recorded. All 3 assurance attempts have been completed.'
        : 'Rejection recorded. Candidate is now unlocked for the next progressive opportunity.',
    });
  } catch (error) {
    return handleApiError(error);
  }
}
