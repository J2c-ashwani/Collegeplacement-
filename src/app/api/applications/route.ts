import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireApiAuth, resolveStudent, resolveEmployerId } from '@/lib/auth-utils'
import { successResponse, validationError, handleApiError, notFoundError } from '@/lib/errors'
import { evaluateJobMatch, StudentMatchProfile } from '@/services/matching.service'
import { createAuditLog } from '@/services/audit.service'
import { z } from 'zod'

const createApplicationSchema = z.object({
  jobId: z.string().min(1, 'Job ID is required'),
  coverLetter: z.string().optional(),
})

export async function GET(req: NextRequest) {
  try {
    const session = await requireApiAuth()
    const { searchParams } = new URL(req.url)
    const jobId = searchParams.get('jobId')
    const studentIdParam = searchParams.get('studentId')

    const where: any = {}

    if (session.user.role === 'STUDENT') {
      const student = await prisma.student.findFirst({ where: { userId: session.user.id } })
      if (!student) return successResponse([])
      where.studentId = student.id
    } else if (session.user.role === 'EMPLOYER') {
      const employerId = await resolveEmployerId(session)
      if (!employerId) return successResponse([])
      where.job = { employerId }
    } else if (studentIdParam) {
      where.studentId = studentIdParam
    }

    if (jobId) {
      where.jobId = jobId
    }

    const applications = await prisma.application.findMany({
      where,
      include: {
        job: {
          include: {
            employer: {
              select: {
                id: true,
                name: true,
                logo: true,
                city: true,
                state: true,
              },
            },
          },
        },
        student: {
          include: {
            user: { select: { name: true, email: true } },
            profile: true,
            institution: { select: { name: true } },
          },
        },
        opportunity: true,
        offer: true,
      },
      orderBy: { appliedAt: 'desc' },
    })

    return successResponse(applications)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireApiAuth(['STUDENT'])
    const body = await req.json()
    const parsed = createApplicationSchema.safeParse(body)

    if (!parsed.success) {
      return validationError('Invalid application parameters', parsed.error.format() as any)
    }

    const { jobId, coverLetter } = parsed.data

    const student = await prisma.student.findFirst({
      where: { userId: session.user.id },
      include: {
        profile: true,
        assessments: {
          include: { result: true },
          take: 1,
          orderBy: { startedAt: 'desc' },
        },
        badges: {
          include: { badge: true },
        },
      },
    })

    if (!student) {
      return notFoundError('Student record not found. Please register via your college link.')
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { employer: true },
    })

    if (!job) {
      return notFoundError('Job opening not found')
    }

    if (job.status !== 'ACTIVE') {
      return validationError('This job opening is no longer accepting applications')
    }

    // Check duplicate active application
    const existing = await prisma.application.findFirst({
      where: {
        studentId: student.id,
        jobId: job.id,
        status: { not: 'WITHDRAWN' },
      },
    })

    if (existing) {
      return validationError('You have already applied to this job vacancy')
    }

    // Evaluate match score
    const assessmentResult = student.assessments?.[0]?.result
    const studentMatchProfile: StudentMatchProfile = {
      id: student.id,
      course: student.profile?.course || 'General',
      branch: student.profile?.branch || 'General',
      graduationYear: student.profile?.graduationYear || 2026,
      cgpa: student.profile?.cgpa || 7.0,
      backlogs: student.profile?.backlogs || 0,
      skills: student.profile?.skills || [],
      scores: {
        overall: assessmentResult?.overallScore || 70,
        technicalReadiness: assessmentResult?.technicalReadiness || 70,
        communication: assessmentResult?.communication || 70,
        workEthics: assessmentResult?.workEthics || 70,
        learningAgility: assessmentResult?.learningAgility || 70,
        teamOrientation: assessmentResult?.teamOrientation || 70,
        problemSolving: assessmentResult?.problemSolving || 70,
        professionalBehaviour: assessmentResult?.professionalBehaviour || 70,
        interviewReadiness: assessmentResult?.interviewReadiness || 70,
      },
      badges: student.badges.map((b) => b.badge.name),
      preferredLocations: student.profile?.preferredLocations || [],
    }

    const matchEvaluation = evaluateJobMatch(
      studentMatchProfile,
      {
        ...job,
        location: job.location || '',
      }
    )

    // Create Application record
    const application = await prisma.application.create({
      data: {
        studentId: student.id,
        jobId: job.id,
        status: 'APPLIED',
        matchScore: matchEvaluation.score,
        matchReasons: matchEvaluation.reasons as any,
        coverLetter: coverLetter || null,
      },
      include: {
        job: {
          include: { employer: true },
        },
      },
    })

    await createAuditLog({
      userId: session.user.id,
      userRole: session.user.role,
      action: 'APPLICATION_SUBMITTED',
      entity: 'Application',
      entityId: application.id,
      newValue: {
        jobId: job.id,
        jobTitle: job.title,
        employerName: job.employer.name,
        matchScore: matchEvaluation.score,
      },
    })

    return successResponse(application, undefined, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
