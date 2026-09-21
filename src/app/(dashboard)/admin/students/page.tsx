import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { AdminStudentDirectory, AdminStudentRow } from './admin-student-directory'
import { Users, GraduationCap, ShieldCheck } from 'lucide-react'

export default async function AdminStudentsPage() {
  const session = await auth()
  if (!session?.user?.id || (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'OPERATIONS')) {
    redirect('/login')
  }

  const rawStudents = await prisma.student.findMany({
    include: {
      user: true,
      institution: true,
      profile: true,
      assessments: {
        include: { result: true },
        take: 1,
        orderBy: { startedAt: 'desc' },
      },
      programmes: {
        take: 1,
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const studentRows: AdminStudentRow[] = rawStudents.map((s) => {
    const programme = s.programmes[0]
    const assessment = s.assessments[0]
    const overallScore = assessment?.result?.overallScore
      ? Math.round(assessment.result.overallScore)
      : null

    return {
      id: s.id,
      name: s.user?.name || 'Unnamed Candidate',
      email: s.user?.email || '—',
      enrollmentNumber: s.enrollmentNumber || 'UNASSIGNED',
      collegeName: s.institution?.name || 'Partner College',
      courseBranch: `${s.profile?.course || 'B.Tech'} - ${s.profile?.branch || 'CSE'}`,
      employabilityScore: overallScore,
      status: s.status,
      assuranceConsumed: programme?.opportunitiesConsumed ?? 0,
      assuranceRemaining: programme?.opportunitiesRemaining ?? 3,
      placedStatus: s.status === 'PLACED' ? 'Placed' : 'In Pipeline',
    }
  })

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
              Operations Control
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500">Cross-College Talent Directory</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Platform Student Directory</h1>
          <p className="text-xs text-slate-500 mt-1">
            Directory of all registered and paid students across partner institutions, tracking 3-Assurance quota consumption and diagnostic scores.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 text-xs">
            {studentRows.length} Total Candidates
          </Badge>
        </div>
      </div>

      <AdminStudentDirectory students={studentRows} />
    </div>
  )
}
