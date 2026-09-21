import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { AdminEmployerDirectory, AdminEmployerRow } from './admin-employer-directory'

import { PageHeader } from '@/components/layout/page-header'

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
      {/* 6-Element Page Header */}
      <PageHeader
        breadcrumb={[
          { label: 'Platform Operations', href: '/admin/overview' },
          { label: 'Corporate Employers' },
        ]}
        title="Corporate Employer Directory"
        description="Manage participating recruiters, job quotas, hiring volume, and agreement-based success fee compliance."
        statusChips={[
          {
            label: 'Corporate Partners',
            value: employerRows.length.toString(),
            variant: 'success',
          },
          {
            label: 'Fee Model',
            value: 'As per agreement',
            variant: 'neutral',
          },
        ]}
      />

      <AdminEmployerDirectory employers={employerRows} />
    </div>
  )
}
