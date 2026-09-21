import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireApiAuth } from '@/lib/auth-utils'
import { successResponse, validationError, handleApiError, notFoundError } from '@/lib/errors'
import { createAuditLog, AuditActions } from '@/services/audit.service'
import { z } from 'zod'

const createOfferSchema = z.object({
  opportunityId: z.string(),
  ctc: z.number().positive(),
  fixedSalary: z.number().positive(),
  variableSalary: z.number().nonnegative().default(0),
  joiningDate: z.string().datetime(),
  location: z.string().min(2),
  employmentType: z.string().default('Full-Time'),
})

// POST /api/offers - Create offer for selected candidate
export async function POST(req: NextRequest) {
  try {
    const session = await requireApiAuth(['SUPER_ADMIN', 'OPERATIONS', 'EMPLOYER'])
    const body = await req.json()
    const parsed = createOfferSchema.safeParse(body)

    if (!parsed.success) {
      return validationError('Invalid offer payload', parsed.error.format() as any)
    }

    const { opportunityId, ctc, fixedSalary, variableSalary, joiningDate, location, employmentType } = parsed.data

    const opportunity = await prisma.assuranceOpportunity.findUnique({
      where: { id: opportunityId },
      include: {
        student: true,
        job: true,
        employer: true,
      },
    })

    if (!opportunity) return notFoundError('Opportunity not found')

    // Create Offer
    const offer = await prisma.offer.create({
      data: {
        applicationId: opportunity.applicationId,
        opportunityId: opportunity.id,
        studentId: opportunity.studentId,
        employerId: opportunity.employerId,
        jobId: opportunity.jobId,
        institutionId: opportunity.student.institutionId,
        offerDate: new Date(),
        ctc,
        fixedSalary,
        variableSalary,
        joiningDate: new Date(joiningDate),
        location,
        employmentType,
        status: 'OFFER_PENDING',
      },
    })

    // Update opportunity status to SELECTED
    await prisma.assuranceOpportunity.update({
      where: { id: opportunityId },
      data: {
        status: 'SELECTED',
        outcome: `Offer issued for ${opportunity.job.title} at ₹${ctc} CTC`,
        completedDate: new Date(),
      },
    })

    await createAuditLog({
      userId: session.user.id,
      userRole: session.user.role,
      action: AuditActions.OFFER_CREATED,
      entity: 'Offer',
      entityId: offer.id,
      newValue: {
        studentId: offer.studentId,
        employerId: offer.employerId,
        ctc,
      },
    })

    return successResponse(offer, undefined, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
