import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CandidatePipelineTable } from './candidate-pipeline-table'

import { resolveEmployerId } from '@/lib/auth-utils'

import { PageHeader } from '@/components/layout/page-header'

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
      {/* 6-Element Page Header */}
      <PageHeader
        breadcrumb={[
          { label: 'Employer Portal', href: '/employer/overview' },
          { label: 'Candidate Pool' },
        ]}
        title="Pre-Assessed Candidate Sourcing"
        description="Browse verified students with 9-dimension diagnostic benchmarks, skill credentials, and student privacy consent."
        statusChips={[
          {
            label: 'Interview-Ready Candidates',
            value: students.length.toString(),
            variant: 'success',
          },
          {
            label: 'Privacy Governance',
            value: 'Student Consent Verified',
            variant: 'neutral',
          },
        ]}
      />

      <CandidatePipelineTable initialCandidates={students as any} activeJobs={activeJobs} />
    </div>
  )
}
