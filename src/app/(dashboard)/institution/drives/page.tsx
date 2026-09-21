import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { InstitutionDrivesTable, InstitutionDriveRow } from './institution-drives-table'
import { Briefcase } from 'lucide-react'

export default async function InstitutionDrivesPage() {
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

  const jobs = await prisma.job.findMany({
    where: { status: 'ACTIVE' },
    include: {
      employer: true,
      _count: {
        select: { applications: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const driveRows: InstitutionDriveRow[] = jobs.map((j) => {
    let ctcString = '₹4.5 - ₹7.0 LPA'
    if (j.ctc) {
      ctcString = `₹${(Number(j.ctc) / 100000).toFixed(1)} LPA`
    } else if (j.salaryMin && j.salaryMax) {
      ctcString = `₹${(Number(j.salaryMin) / 100000).toFixed(1)} - ₹${(Number(j.salaryMax) / 100000).toFixed(1)} LPA`
    }

    const branches = j.branch.length > 0 ? j.branch.join(', ') : 'All Branches (CSE, IT, ECE)'

    return {
      id: j.id,
      companyName: j.employer?.name || 'Corporate Partner',
      jobTitle: j.title,
      driveDate: j.applicationDeadline ? j.applicationDeadline.toISOString().split('T')[0] : 'Open Drive',
      mode: j.workMode,
      departments: branches,
      minScore: j.minEmployabilityScore ? Math.round(j.minEmployabilityScore) : null,
      ctcText: ctcString,
      registeredCount: j._count.applications,
      status: 'ACTIVE',
    }
  })

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
              Campus Recruitment
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500">Corporate Visiting Schedule</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Campus Hiring Drives & Mega-Drives</h1>
          <p className="text-xs text-slate-500 mt-1">
            Scheduled visiting employers, branch eligibility criteria, score cutoffs, and participating student counts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 text-xs">
            {driveRows.length} Scheduled Drives
          </Badge>
        </div>
      </div>

      <InstitutionDrivesTable drives={driveRows} />
    </div>
  )
}
