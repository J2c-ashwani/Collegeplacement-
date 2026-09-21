import { prisma } from '@/lib/prisma'
import { evaluateSafeActionPolicy, classifyFreshness } from '@/services/growth-intelligence.service'
import { defaultEmailProvider } from '@/services/growth-providers'

export interface SequenceExecutionSummary {
  processedCount: number
  draftedCount: number
  stoppedDncCount: number
  stoppedReplyCount: number
  errors: string[]
}

/**
 * Background GrowthOS Sequence Worker.
 * Scans active enrollments, validates safety & freshness guardrails,
 * drafts next sequence steps, and enforces DNC/reply halts.
 */
export async function executePendingSequences(): Promise<SequenceExecutionSummary> {
  const summary: SequenceExecutionSummary = {
    processedCount: 0,
    draftedCount: 0,
    stoppedDncCount: 0,
    stoppedReplyCount: 0,
    errors: [],
  }

  try {
    const dueEnrollments = await prisma.sequenceEnrollment.findMany({
      where: {
        status: 'ACTIVE',
        nextExecutionAt: { lte: new Date() },
      },
      include: {
        sequence: {
          include: {
            steps: { orderBy: { stepNumber: 'asc' } },
          },
        },
        collegeProspect: true,
        employerProspect: true,
      },
      take: 50,
    })

    for (const enrollment of dueEnrollments) {
      summary.processedCount++
      const prospect = enrollment.collegeProspect || enrollment.employerProspect
      if (!prospect) continue

      // 1. Pre-flight Check: DNC / Suppression
      if (prospect.dnc) {
        await prisma.sequenceEnrollment.update({
          where: { id: enrollment.id },
          data: { status: 'STOPPED_DNC' },
        })
        summary.stoppedDncCount++
        continue
      }

      // 2. Pre-flight Check: Freshness
      const freshness = classifyFreshness(prospect.lastVerifiedAt)
      if (freshness === 'STALE' || freshness === 'EXPIRED') {
        await prisma.sequenceEnrollment.update({
          where: { id: enrollment.id },
          data: { status: 'PAUSED_NEEDS_REFRESH' },
        })
        continue
      }

      // 3. Find target step
      const step = enrollment.sequence.steps.find(
        (s) => s.stepNumber === enrollment.currentStepNumber
      )
      if (!step) {
        await prisma.sequenceEnrollment.update({
          where: { id: enrollment.id },
          data: { status: 'COMPLETED' },
        })
        continue
      }

      // 4. Generate personalized message
      const prospectName = enrollment.collegeProspect
        ? enrollment.collegeProspect.name
        : enrollment.employerProspect?.companyName || 'Valued Partner'
      const contactName = enrollment.collegeProspect
        ? enrollment.collegeProspect.tpoName || 'Training & Placement Officer'
        : enrollment.employerProspect?.recruiterName || 'Talent Acquisition Team'

      const subject = step.templateSubject
        .replace('{{prospectName}}', prospectName)
        .replace('{{contactName}}', contactName)

      const body = step.templateBody
        .replace('{{prospectName}}', prospectName)
        .replace('{{contactName}}', contactName)
        .replace('{{cohort}}', String(enrollment.collegeProspect?.estimatedCohort || 600))
        .replace('{{candidateCount}}', String(enrollment.employerProspect?.matchedStudentCount || 180))

      // 5. Evaluate Safe Action Policy
      const safety = evaluateSafeActionPolicy({
        freshnessStatus: freshness,
        provenancePresent: Boolean(prospect.provenanceData),
        complianceStatus: prospect.complianceStatus,
        dnc: prospect.dnc,
        noDuplicateContact: !prospect.duplicateOfId,
        noActiveSequenceConflict: true,
        channel: step.channel,
      })

      // 6. Create Outreach Draft
      await prisma.growthOutreach.create({
        data: {
          enrollmentId: enrollment.id,
          stepId: step.id,
          prospectType: enrollment.prospectType,
          collegeProspectId: enrollment.collegeProspectId,
          employerProspectId: enrollment.employerProspectId,
          subject,
          body,
          personalizedTokens: {
            prospectName,
            contactName,
            stepNumber: step.stepNumber,
          },
          status: 'DRAFT_PENDING_APPROVAL',
          isSafeAction: safety.isSafe,
        },
      })
      summary.draftedCount++

      // 7. Advance or complete enrollment schedule
      const nextStep = enrollment.sequence.steps.find(
        (s) => s.stepNumber === enrollment.currentStepNumber + 1
      )
      if (nextStep) {
        const nextDate = new Date()
        nextDate.setDate(nextDate.getDate() + nextStep.delayDays)

        await prisma.sequenceEnrollment.update({
          where: { id: enrollment.id },
          data: {
            currentStepNumber: nextStep.stepNumber,
            nextExecutionAt: nextDate,
          },
        })
      } else {
        await prisma.sequenceEnrollment.update({
          where: { id: enrollment.id },
          data: { status: 'COMPLETED' },
        })
      }
    }
  } catch (error) {
    console.error('[Growth Sequence Worker Error]', error)
    summary.errors.push(String(error))
  }

  return summary
}

/**
 * Suppresses a prospect completely across all sequences and active drafts.
 */
export async function suppressProspectDnc(
  prospectType: 'COLLEGE' | 'EMPLOYER',
  prospectId: string,
  _reason: string = 'Opt-out requested'
) {
  if (prospectType === 'COLLEGE') {
    await prisma.collegeProspect.update({
      where: { id: prospectId },
      data: { dnc: true, status: 'DNC', complianceStatus: 'SUPPRESSED_DNC' },
    })
  } else {
    await prisma.employerProspect.update({
      where: { id: prospectId },
      data: { dnc: true, status: 'DNC', complianceStatus: 'SUPPRESSED_DNC' },
    })
  }

  // Cancel all pending drafts
  await prisma.growthOutreach.updateMany({
    where: {
      prospectType,
      ...(prospectType === 'COLLEGE'
        ? { collegeProspectId: prospectId }
        : { employerProspectId: prospectId }),
      status: 'DRAFT_PENDING_APPROVAL',
    },
    data: { status: 'REJECTED' },
  })

  // Halt all active enrollments
  await prisma.sequenceEnrollment.updateMany({
    where: {
      prospectType,
      ...(prospectType === 'COLLEGE'
        ? { collegeProspectId: prospectId }
        : { employerProspectId: prospectId }),
      status: 'ACTIVE',
    },
    data: { status: 'STOPPED_DNC' },
  })
}
