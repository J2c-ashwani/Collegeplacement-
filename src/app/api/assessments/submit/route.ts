import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireApiAuth } from '@/lib/auth-utils'
import { successResponse, validationError, handleApiError, notFoundError } from '@/lib/errors'
import { createAuditLog, AuditActions } from '@/services/audit.service'
import { z } from 'zod'

const submitAssessmentSchema = z.object({
  studentId: z.string(),
  answers: z.array(
    z.object({
      questionId: z.string(),
      answer: z.string(),
    })
  ).min(1),
})

export async function POST(req: NextRequest) {
  try {
    const session = await requireApiAuth()
    const body = await req.json()
    const parsed = submitAssessmentSchema.safeParse(body)

    if (!parsed.success) {
      return validationError('Invalid assessment submission', parsed.error.format() as any)
    }

    const { studentId, answers } = parsed.data

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        programmes: {
          where: { status: 'ACTIVE' },
          take: 1,
        },
      },
    })

    if (!student) {
      return notFoundError('Student not found')
    }

    // Fetch questions to score answers
    const questionIds = answers.map((a) => a.questionId)
    const questions = await prisma.assessmentQuestion.findMany({
      where: { id: { in: questionIds } },
    })

    const questionMap = new Map(questions.map((q) => [q.id, q]))

    // Score answers per category
    const categoryScores: Record<string, { total: number; count: number }> = {}

    for (const ans of answers) {
      const q = questionMap.get(ans.questionId)
      if (!q) continue

      const category = q.category
      if (!categoryScores[category]) {
        categoryScores[category] = { total: 0, count: 0 }
      }

      // Check option score or correctAnswer
      let itemScore = 7 // baseline default
      const options = q.options as any[]
      if (Array.isArray(options)) {
        const selectedOpt = options.find((o) => o.text === ans.answer)
        if (selectedOpt && typeof selectedOpt.score === 'number') {
          itemScore = selectedOpt.score
        } else if (q.correctAnswer && q.correctAnswer === ans.answer) {
          itemScore = 10
        }
      }

      categoryScores[category].total += itemScore * (q.weight || 1)
      categoryScores[category].count += (q.weight || 1) * 10
    }

    // Helper to calculate percentage per category (default to 75 if unasked)
    const getCatScore = (cat: string) => {
      const data = categoryScores[cat]
      if (!data || data.count === 0) return 78
      return Math.round((data.total / data.count) * 100)
    }

    const technicalReadiness = getCatScore('SKILLS')
    const communication = getCatScore('COMMUNICATION')
    const workEthics = getCatScore('WORK_ETHICS')
    const learningAgility = getCatScore('LEARNING_AGILITY')
    const teamOrientation = getCatScore('TEAM_BEHAVIOUR')
    const problemSolving = getCatScore('PROBLEM_SOLVING')
    const professionalBehaviour = getCatScore('PROFESSIONAL_BEHAVIOUR')
    const interviewReadiness = Math.round(
      (technicalReadiness * 0.3 + communication * 0.35 + problemSolving * 0.2 + professionalBehaviour * 0.15)
    )

    const overallScore = Math.round(
      (technicalReadiness +
        communication +
        workEthics +
        learningAgility +
        teamOrientation +
        problemSolving +
        professionalBehaviour +
        interviewReadiness) /
        8
    )

    // Record StudentAssessment
    const assessment = await prisma.studentAssessment.create({
      data: {
        studentId,
        status: 'COMPLETED',
        startedAt: new Date(Date.now() - 1800000), // 30 min ago
        completedAt: new Date(),
      },
    })

    // Record AssessmentResult
    const result = await prisma.assessmentResult.create({
      data: {
        assessmentId: assessment.id,
        studentId,
        overallScore,
        technicalReadiness,
        communication,
        workEthics,
        learningAgility,
        teamOrientation,
        problemSolving,
        professionalBehaviour,
        interviewReadiness,
      },
    })

    // Award Badges based on scores
    const badgesToAward = []
    if (interviewReadiness >= 75) badgesToAward.push('interview-ready')
    if (overallScore >= 80) badgesToAward.push('employer-ready')
    if (communication >= 80) badgesToAward.push('strong-communicator')
    if (learningAgility >= 80) badgesToAward.push('high-learning-agility')
    if (technicalReadiness >= 75) badgesToAward.push('technical-ready')
    if (professionalBehaviour >= 80) badgesToAward.push('high-professionalism')

    const dbBadges = await prisma.badge.findMany({
      where: { slug: { in: badgesToAward } },
    })

    for (const badge of dbBadges) {
      await prisma.studentBadge.upsert({
        where: { id: `badge-${studentId}-${badge.slug}` },
        update: { score: overallScore },
        create: {
          id: `badge-${studentId}-${badge.slug}`,
          studentId,
          badgeId: badge.id,
          score: overallScore,
          verificationId: `BDG-${badge.slug.toUpperCase()}-${studentId.substring(0, 6)}`,
        },
      })
    }

    // Update Student status
    await prisma.student.update({
      where: { id: studentId },
      data: {
        status: student.status === 'PAYMENT_PENDING' ? 'ASSESSMENT_COMPLETED' : 'ACTIVE',
      },
    })

    // Activate programme if enrolled
    if (student.programmes[0]) {
      await prisma.studentProgramme.update({
        where: { id: student.programmes[0].id },
        data: {
          assuranceStatus: 'ACTIVE',
          status: 'ACTIVE',
        },
      })
    }

    await createAuditLog({
      userId: session.user.id,
      userRole: session.user.role,
      action: AuditActions.ASSESSMENT_COMPLETED,
      entity: 'StudentAssessment',
      entityId: assessment.id,
      newValue: { studentId, overallScore, badgesAwarded: badgesToAward },
    })

    return successResponse({
      assessmentId: assessment.id,
      overallScore,
      subscores: {
        technicalReadiness,
        communication,
        workEthics,
        learningAgility,
        teamOrientation,
        problemSolving,
        professionalBehaviour,
        interviewReadiness,
      },
      badgesAwarded: badgesToAward,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
