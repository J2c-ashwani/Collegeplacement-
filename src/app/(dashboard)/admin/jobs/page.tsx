import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { AdminJobsDirectory, AdminJobRow } from './admin-jobs-directory'

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
  })

  const jobRows: AdminJobRow[] = jobs.map((j) => {
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

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Job Network
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500">Cross-Platform Openings Catalog</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Platform Job Postings</h1>
          <p className="text-xs text-slate-500 mt-1">
            Central repository of employer job postings, score eligibility thresholds, and applicant pipelines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
            {jobRows.length} Active Listings
          </Badge>
        </div>
      </div>

      <AdminJobsDirectory jobs={jobRows} />
    </div>
  )
}
