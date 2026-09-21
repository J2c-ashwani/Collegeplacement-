import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Users, Search, Download, Upload, CheckCircle2, ShieldCheck, ArrowUpDown, Filter } from 'lucide-react'
import { StudentDirectoryTable } from './student-directory-table'

export default async function InstitutionStudentsPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  let institutionId = session.user.institutionId
  if (!institutionId && (session.user.role === 'SUPER_ADMIN' || session.user.role === 'OPERATIONS')) {
    const firstInst = await prisma.institution.findFirst()
    institutionId = firstInst?.id || null
  }

  if (!institutionId) {
    redirect('/login')
  }

  const institution = await prisma.institution.findUnique({
    where: { id: institutionId },
    include: {
      students: {
        include: {
          user: true,
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
      },
    },
  })

  const students = institution?.students || []

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
              Cohort Management
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-semibold">{institution?.name}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Student Directory & Profiles</h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse registered candidates, assessment benchmarks, and placement readiness across all departments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-50 text-xs">
            {students.length} Registered Students
          </Badge>
        </div>
      </div>

      {/* Directory Table Client Component */}
      <StudentDirectoryTable initialStudents={students as any} />
    </div>
  )
}
