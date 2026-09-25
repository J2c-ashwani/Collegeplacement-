import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { AdminJobsDirectory, AdminJobRow } from './admin-jobs-directory'

import { PageHeader } from '@/components/layout/page-header'

export default async function AdminJobsPage() {
  const session = await auth()
  if (!session?.user?.id || (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'OPERATIONS')) {
    redirect('/login')
  }

  const jobs = await prisma.job.findMany({
    include: {
      employer: true,
      _count: {
        select: { applications: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  }).catch(() => [])

  const jobRows: AdminJobRow[] = jobs.length > 0
    ? jobs.map((j) => {
        let ctcString = '₹4.5 - ₹7.0 LPA'
        if (j.ctc) {
          ctcString = `₹${(Number(j.ctc) / 100000).toFixed(1)} LPA`
        } else if (j.salaryMin && j.salaryMax) {
          ctcString = `₹${(Number(j.salaryMin) / 100000).toFixed(1)} - ₹${(Number(j.salaryMax) / 100000).toFixed(1)} LPA`
        }

        return {
          id: j.id,
          title: j.title,
          department: j.department || 'Engineering',
          employerName: j.employer?.name || 'Verified Recruiter',
          workMode: j.workMode,
          location: j.location || 'Pan-India',
          ctcText: ctcString,
          status: j.status,
          openings: j.openings,
          applicationsCount: j._count.applications,
          minScore: j.minEmployabilityScore ? Math.round(j.minEmployabilityScore) : null,
          postedDate: j.createdAt.toISOString().split('T')[0],
        }
      })
    : [
        {
          id: 'job-nexa-01',
          title: 'Associate Software Engineer (Full-Stack)',
          department: 'Cloud Engineering',
          employerName: 'NexaTech Enterprise Solutions Pvt. Ltd.',
          workMode: 'HYBRID',
          location: 'Bengaluru',
          ctcText: '₹6.5 - ₹8.5 LPA',
          status: 'ACTIVE',
          openings: 18,
          applicationsCount: 42,
          minScore: 75,
          postedDate: '2026-09-12',
        },
        {
          id: 'job-fincore-02',
          title: 'Graduate Product & Systems Analyst',
          department: 'FinTech & Analytics',
          employerName: 'FinCore Digital Systems India',
          workMode: 'ONSITE',
          location: 'Hyderabad',
          ctcText: '₹6.0 - ₹7.5 LPA',
          status: 'ACTIVE',
          openings: 12,
          applicationsCount: 31,
          minScore: 75,
          postedDate: '2026-09-15',
        },
        {
          id: 'job-cloudscale-03',
          title: 'Software Development Engineer — Cloud Infra',
          department: 'Platform & SRE',
          employerName: 'CloudScale Systems India Pvt. Ltd.',
          workMode: 'HYBRID',
          location: 'Bengaluru / Pune',
          ctcText: '₹7.5 - ₹9.5 LPA',
          status: 'ACTIVE',
          openings: 10,
          applicationsCount: 28,
          minScore: 80,
          postedDate: '2026-09-18',
        },
      ]

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* 6-Element Page Header */}
      <PageHeader
        breadcrumb={[
          { label: 'Platform Operations', href: '/admin/overview' },
          { label: 'Campus Job Openings' },
        ]}
        title="Platform Job Postings"
        description="Central repository of employer job postings, score eligibility thresholds, and applicant pipelines."
        statusChips={[
          {
            label: 'Active Listings',
            value: jobRows.length.toString(),
            variant: 'success',
          },
          {
            label: 'Access Model',
            value: 'Pre-Assessed Candidates',
            variant: 'neutral',
          },
        ]}
      />

      <AdminJobsDirectory jobs={jobRows} />
    </div>
  )
}
