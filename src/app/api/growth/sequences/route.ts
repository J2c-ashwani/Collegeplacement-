import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireApiAuth } from '@/lib/auth-utils'
import { successResponse, handleApiError, forbiddenError, validationError } from '@/lib/errors'
import { executePendingSequences } from '@/services/growth-sequence-worker'
import { z } from 'zod'

const enrollSchema = z.object({
  sequenceId: z.string(),
  prospectType: z.enum(['COLLEGE', 'EMPLOYER']),
  prospectId: z.string(),
})

export async function GET(_req: NextRequest) {
  try {
    const session = await requireApiAuth()
    if (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'OPERATIONS') {
      return forbiddenError('Access restricted to Platform Operations')
    }

    const sequences = await prisma.outreachSequence.findMany({
      include: {
        steps: { orderBy: { stepNumber: 'asc' } },
        _count: { select: { enrollments: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return successResponse(sequences)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireApiAuth()
    if (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'OPERATIONS') {
      return forbiddenError('Access restricted to Platform Operations')
    }

    const body = await req.json()

    // Trigger worker execution
    if (body.triggerWorker) {
      const summary = await executePendingSequences()
      return successResponse({
        message: 'Growth sequence worker executed successfully',
        summary,
      })
    }

    // Enroll prospect in sequence
    const parsed = enrollSchema.parse(body)

    const enrollment = await prisma.sequenceEnrollment.create({
      data: {
        sequenceId: parsed.sequenceId,
        prospectType: parsed.prospectType,
        collegeProspectId: parsed.prospectType === 'COLLEGE' ? parsed.prospectId : null,
        employerProspectId: parsed.prospectType === 'EMPLOYER' ? parsed.prospectId : null,
        currentStepNumber: 1,
        status: 'ACTIVE',
        nextExecutionAt: new Date(),
      },
    })

    // Update prospect pipeline status
    if (parsed.prospectType === 'COLLEGE') {
      await prisma.collegeProspect.update({
        where: { id: parsed.prospectId },
        data: { status: 'SEQUENCE_ENROLLED', enrolledSequenceId: parsed.sequenceId },
      })
    } else {
      await prisma.employerProspect.update({
        where: { id: parsed.prospectId },
        data: { status: 'SEQUENCE_ENROLLED', enrolledSequenceId: parsed.sequenceId },
      })
    }

    return successResponse(enrollment, undefined, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
