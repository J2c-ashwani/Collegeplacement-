import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireApiAuth } from '@/lib/auth-utils'
import { successResponse, validationError, handleApiError } from '@/lib/errors'
import { evaluateJobMatch } from '@/services/matching.service'
import { z } from 'zod'

const createJobSchema = z.object({
  employerId: z.string(),
  title: z.string().min(2),
  department: z.string().min(2),
  type: z.enum(['FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'CONTRACT']).default('FULL_TIME'),
  location: z.string().min(2),
  workMode: z.enum(['REMOTE', 'HYBRID', 'ONSITE']).default('HYBRID'),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  ctc: z.number().optional(),
  degree: z.array(z.string()).default(['B.Tech', 'BE']),
  branch: z.array(z.string()).default(['Any']),
  graduationYear: z.number().int().default(2026),
  minCgpa: z.number().optional(),
  backlogsAllowed: z.boolean().default(false),
  skills: z.array(z.string()).default([]),
  minEmployabilityScore: z.number().optional(),
  minCommunicationScore: z.number().optional(),
  minTechnicalScore: z.number().optional(),
  requiredBadges: z.array(z.string()).default([]),
  openings: z.number().int().positive().default(1),
  description: z.string().min(10),
})

export async function GET(req: NextRequest) {
  try {
    const session = await requireApiAuth()
    const { searchParams } = new URL(req.url)
    const employerId = searchParams.get('employerId')
    const location = searchParams.get('location')

    const where: any = {
      status: 'ACTIVE',
    }

    if (employerId) where.employerId = employerId
    if (location) where.location = { contains: location, mode: 'insensitive' }

    const jobs = await prisma.job.findMany({
      where,
      include: {
        employer: {
          select: {
            id: true,
            name: true,
            industry: true,
            logo: true,
            city: true,
            state: true,
          },
        },
        _count: {
          select: { applications: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // If user is a student, compute real-time match scores against each job!
    let enrichedJobs: any[] = jobs
    if (session.user.role === 'STUDENT') {
      const student = await prisma.student.findFirst({
        where: { userId: session.user.id },
        include: {
          profile: true,
          assessments: {
            where: { status: 'COMPLETED' },
            include: { result: true },
            take: 1,
            orderBy: { createdAt: 'desc' },
          },
          badges: {
            include: { badge: true },
          },
        },
      })

      if (student && student.profile && student.assessments[0]?.result) {
        const result = student.assessments[0].result
        const studentProfile = {
          id: student.id,
          course: student.profile.course || 'General',
          branch: student.profile.branch || 'General',
          graduationYear: student.profile.graduationYear || 2026,
          cgpa: student.profile.cgpa || 7.0,
          backlogs: student.profile.backlogs,
          skills: student.profile.skills,
          scores: {
            overall: result.overallScore,
            technicalReadiness: result.technicalReadiness,
            communication: result.communication,
            workEthics: result.workEthics,
            learningAgility: result.learningAgility,
            teamOrientation: result.teamOrientation,
            problemSolving: result.problemSolving,
            professionalBehaviour: result.professionalBehaviour,
            interviewReadiness: result.interviewReadiness,
          },
          badges: student.badges.map((b) => b.badge.name),
          preferredLocations: student.profile.preferredLocations,
        }

        enrichedJobs = jobs.map((job) => {
          const match = evaluateJobMatch(studentProfile, {
            id: job.id,
            title: job.title,
            degree: job.degree,
            branch: job.branch,
            graduationYear: job.graduationYear,
            minCgpa: job.minCgpa,
            backlogsAllowed: job.backlogsAllowed,
            skills: job.skills,
            minEmployabilityScore: job.minEmployabilityScore,
            minCommunicationScore: job.minCommunicationScore,
            minTechnicalScore: job.minTechnicalScore,
            requiredBadges: job.requiredBadges,
            location: job.location || 'Any',
          })

          return {
            ...job,
            matchScore: match.score,
            isEligible: match.isEligible,
            matchReasons: match.reasons,
            failedCriteria: match.failedCriteria,
          }
        })
      }
    }

    return successResponse(enrichedJobs)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireApiAuth(['EMPLOYER', 'SUPER_ADMIN', 'OPERATIONS'])
    const body = await req.json()
    const parsed = createJobSchema.safeParse(body)

    if (!parsed.success) {
      return validationError('Invalid job details', parsed.error.format() as any)
    }

    const job = await prisma.job.create({
      data: {
        ...parsed.data,
        status: session.user.role === 'SUPER_ADMIN' ? 'ACTIVE' : 'PENDING_APPROVAL',
        approvedAt: session.user.role === 'SUPER_ADMIN' ? new Date() : null,
        approvedBy: session.user.role === 'SUPER_ADMIN' ? session.user.id : null,
      },
    })

    return successResponse(job, undefined, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
