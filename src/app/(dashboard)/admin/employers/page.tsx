import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { AdminEmployerDirectory, AdminEmployerRow } from './admin-employer-directory'

export default async function AdminEmployersPage() {
  const session = await auth()
  if (!session?.user?.id || (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'OPERATIONS')) {
    redirect('/login')
  }

  const employers = await prisma.employer.findMany({
    include: {
      jobs: {
        where: { status: 'ACTIVE' },
        select: { id: true },
      },
      _count: {
        select: { fees: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const employerRows: AdminEmployerRow[] = employers.map((emp) => {
    return {
      id: emp.id,
      name: emp.name,
      industry: emp.industry || 'Technology & IT Services',
      location: `${emp.city || 'Bangalore'}, ${emp.state || 'Karnataka'}`,
      gstNumber: emp.gstNumber || 'Pending Filing',
      status: emp.status,
      activeJobsCount: emp.jobs.length,
      placementsCount: emp._count.fees,
      feeModel: 'As per employer agreement',
      verifiedAt: emp.verifiedAt ? emp.verifiedAt.toISOString().split('T')[0] : null,
    }
  })

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
              Corporate Network
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500">Recruitment Partnerships & Verification</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Corporate Employer Directory</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage participating recruiters, job quotas, hiring volume, and agreement-based success fee compliance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-sky-50 text-sky-700 border-sky-200 text-xs">
            {employerRows.length} Corporate Partners
          </Badge>
        </div>
      </div>

      <AdminEmployerDirectory employers={employerRows} />
    </div>
  )
}
