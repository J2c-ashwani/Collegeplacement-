import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CandidatePipelineTable } from './candidate-pipeline-table'

import { resolveEmployerId } from '@/lib/auth-utils'

export default async function EmployerCandidatesPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  const employerId = await resolveEmployerId(session)
  const activeJobs = employerId
    ? await prisma.job.findMany({
        where: { employerId, status: 'ACTIVE' },
        select: { id: true, title: true, department: true },
        orderBy: { createdAt: 'desc' },
      })
    : []

  // Fetch verified candidates from database (strictly respecting student privacy consent)
  const students = await prisma.student.findMany({
    where: {
      status: { in: ['ACTIVE', 'PLACED', 'PROGRAMME_COMPLETED'] },
      profile: {
        employerVisibilityConsent: true,
      },
    },
    include: {
      user: true,
      institution: true,
      profile: true,
      assessments: {
        include: { result: true },
        take: 1,
        orderBy: { startedAt: 'desc' },
      },
      badges: {
        include: { badge: true },
        take: 3,
      },
    },
    take: 25,
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
              Assessed Talent Network
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500">2026 Graduating Fresher Pipeline</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Pre-Assessed Candidate Sourcing</h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse verified students with 9-dimension diagnostic benchmarks and institutional accreditation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 text-xs">
            {students.length} Interview-Ready Candidates
          </Badge>
        </div>
      </div>

      <CandidatePipelineTable initialCandidates={students as any} activeJobs={activeJobs} />
    </div>
  )
}
