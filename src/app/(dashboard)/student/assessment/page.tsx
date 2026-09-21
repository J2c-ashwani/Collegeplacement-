import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { AssessmentRunner } from './assessment-runner'

export default async function AssessmentPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  // Get student and questions
  let student = await prisma.student.findFirst({
    where: { userId: session.user.id },
    include: {
      assessments: {
        include: { result: true },
        orderBy: { startedAt: 'desc' },
        take: 1,
      },
    },
  })

  if (!student && (session.user.role === 'SUPER_ADMIN' || session.user.role === 'OPERATIONS')) {
    student = await prisma.student.findFirst({
      include: {
        assessments: {
          include: { result: true },
          take: 1,
        },
      },
    })
  }

  if (!student) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 space-y-6">
        <div className="border border-indigo-100 bg-indigo-50/40 p-8 rounded-xl text-center space-y-4 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Student Profile Not Found</h2>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            Please register through your college placement link to attempt the 9-dimension diagnostic assessment.
          </p>
        </div>
      </div>
    )
  }

  const questions = await prisma.assessmentQuestion.findMany({
    where: { isActive: true },
    select: {
      id: true,
      category: true,
      questionType: true,
      question: true,
      options: true,
      difficulty: true,
      weight: true,
    },
    orderBy: { category: 'asc' },
  })

  const previousResult = student?.assessments?.[0]?.result || null

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <AssessmentRunner 
        studentId={student?.id || ''} 
        questions={questions as any}
        previousResult={previousResult}
      />
    </div>
  )
}
