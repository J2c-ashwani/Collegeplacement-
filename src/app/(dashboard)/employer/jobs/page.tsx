import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Briefcase, Plus, MapPin, Sparkles, Users, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { JobPostingManager } from './job-posting-manager'

import { resolveEmployerId } from '@/lib/auth-utils'

export default async function EmployerJobsPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  const employerId = await resolveEmployerId(session)
  if (!employerId && session.user.role === 'EMPLOYER') {
    redirect('/employer/profile')
  }

  if (!employerId) {
    redirect('/login')
  }

  const employer = await prisma.employer.findUnique({
    where: { id: employerId },
    include: {
      jobs: {
        include: {
          applications: true,
          opportunities: true,
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  const jobs = employer?.jobs || []

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
              Talent Sourcing Pipeline
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-semibold">{employer?.name}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Job Openings & Diagnostic Thresholds</h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure campus vacancies with required employability scores and digital badge criteria.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-50 text-xs">
            {jobs.length} Total Postings
          </Badge>
        </div>
      </div>

      <JobPostingManager initialJobs={jobs as any} employerId={employerId} />
    </div>
  )
}
