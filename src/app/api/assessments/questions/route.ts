import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireApiAuth } from '@/lib/auth-utils'
import { successResponse, handleApiError } from '@/lib/errors'

export async function GET() {
  try {
    await requireApiAuth()

    const questions = await prisma.assessmentQuestion.findMany({
      where: { isActive: true },
      select: {
        id: true,
        category: true,
        questionType: true,
        question: true,
        options: true,
        weight: true,
        difficulty: true,
      },
      orderBy: { category: 'asc' },
    })

    return successResponse(questions)
  } catch (error) {
    return handleApiError(error)
  }
}
