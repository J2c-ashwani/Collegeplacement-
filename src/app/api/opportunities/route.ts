import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireApiAuth } from '@/lib/auth-utils'
import { successResponse, validationError, handleApiError, notFoundError } from '@/lib/errors'
import { createAuditLog, AuditActions } from '@/services/audit.service'
import { z } from 'zod'

const assignOpportunitySchema = z.object({
  studentId: z.string(),
  jobId: z.string(),
  applicationId: z.string().optional(),
  roundName: z.string().default('Round 1: Technical & Problem Solving Assessment'),
  mode: z.enum(['IN_PERSON', 'PHONE', 'VIDEO', 'ONLINE_TEST']).default('VIDEO'),
  scheduledAt: z.string().datetime().optional(),
  meetingLink: z.string().optional(),
})

export async function GET(req: NextRequest) {
  try {
    const session = await requireApiAuth()
    const { searchParams } = new URL(req.url)
    const studentId = searchParams.get('studentId')
    const employerId = searchParams.get('employerId')

    const where: any = {}
    if (studentId) where.studentId = studentId
    if (employerId) where.employerId = employerId

    // If student, isolate to own opportunities
    if (session.user.role === 'STUDENT') {
      const stu = await prisma.student.findFirst({ where: { userId: session.user.id } })
      if (stu) where.studentId = stu.id
    }

    const opportunities = await prisma.assuranceOpportunity.findMany({
      where,
      include: {
        job: true,
        employer: {
          select: { id: true, name: true, logo: true, industry: true },
        },
        interviews: {
          orderBy: { roundNumber: 'asc' },
        },
        student: {
          include: { user: true, profile: true },
        },
        offer: true,
      },
      orderBy: { assignedDate: 'desc' },
    })

    return successResponse(opportunities)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireApiAuth(['SUPER_ADMIN', 'OPERATIONS', 'COUNSELLOR', 'EMPLOYER'])
    const body = await req.json()
    const parsed = assignOpportunitySchema.safeParse(body)

    if (!parsed.success) {
      return validationError('Invalid opportunity assignment', parsed.error.format() as any)
    }

    const { studentId, jobId, applicationId, roundName, mode, scheduledAt, meetingLink } = parsed.data

    // 1. Fetch Student & Active Programme
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        programmes: {
          where: { status: 'ACTIVE' },
          take: 1,
        },
        opportunities: true,
      },
    })

    if (!student) return notFoundError('Student not found')
    const programme = student.programmes[0]

    if (!programme) {
      return validationError('Student does not have an active Placement Assurance programme enrolment')
    }

    if (programme.opportunitiesRemaining <= 0) {
      return validationError('Student has already consumed all qualified interview assurance opportunities')
    }

    // 2. Fetch Job & Employer
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { employer: true },
    })

    if (!job) return notFoundError('Job not found')

    const opportunityNumber = student.opportunities.length + 1

    // 3. Create AssuranceOpportunity record
    const opportunity = await prisma.assuranceOpportunity.create({
      data: {
        studentProgrammeId: programme.id,
        studentId: student.id,
        employerId: job.employerId,
        jobId: job.id,
        applicationId,
        opportunityNumber,
        status: 'INTERVIEW_SCHEDULED',
        countsTowardAssurance: true,
        assignedBy: session.user.id,
      },
    })

    // 4. Create Round 1 Interview
    const interview = await prisma.interview.create({
      data: {
        opportunityId: opportunity.id,
        applicationId,
        studentId: student.id,
        jobId: job.id,
        employerId: job.employerId,
        roundNumber: 1,
        roundName,
        mode,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : new Date(Date.now() + 2 * 86400000),
        meetingLink: meetingLink || 'https://meet.google.com/placement-assurance-drive',
        status: 'SCHEDULED',
      },
    })

    await createAuditLog({
      userId: session.user.id,
      userRole: session.user.role,
      action: AuditActions.OPPORTUNITY_ASSIGNED,
      entity: 'AssuranceOpportunity',
      entityId: opportunity.id,
      newValue: {
        opportunityNumber,
        studentId: student.id,
        jobId: job.id,
        employerName: job.employer.name,
      },
    })

    return successResponse(
      {
        opportunityId: opportunity.id,
        interviewId: interview.id,
        opportunityNumber,
        message: `Assurance Opportunity #${opportunityNumber} assigned successfully`,
      },
      undefined,
      201
    )
  } catch (error) {
    return handleApiError(error)
  }
}
