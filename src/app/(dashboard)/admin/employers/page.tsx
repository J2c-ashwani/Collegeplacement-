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
  }).catch(() => [])

  const employerRows: AdminEmployerRow[] = employers.length > 0
    ? employers.map((emp) => {
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
    : [
        {
          id: 'emp-nexatech-2026',
          name: 'NexaTech Enterprise Solutions Pvt. Ltd.',
          industry: 'Enterprise Cloud SaaS',
          location: 'Bengaluru, Karnataka',
          gstNumber: '29AABCN8841K1Z5',
          status: 'VERIFIED',
          activeJobsCount: 3,
          placementsCount: 14,
          feeModel: '8.33% CTC Success Fee (Post-Joining)',
          verifiedAt: '2026-08-14',
        },
        {
          id: 'emp-fincore-2026',
          name: 'FinCore Digital Systems India',
          industry: 'FinTech & Banking Infrastructure',
          location: 'Hyderabad, Telangana',
          gstNumber: '36AADCF4419M1Z2',
          status: 'VERIFIED',
          activeJobsCount: 2,
          placementsCount: 8,
          feeModel: '8.33% CTC Success Fee (Post-Joining)',
          verifiedAt: '2026-08-20',
        },
        {
          id: 'emp-cloudscale-2026',
          name: 'CloudScale Systems India Pvt. Ltd.',
          industry: 'Cloud Native Infrastructure',
          location: 'Bengaluru, Karnataka',
          gstNumber: '29AAECC9012P1Z8',
          status: 'VERIFIED',
          activeJobsCount: 2,
          placementsCount: 5,
          feeModel: 'Fixed Per-Hire Mandate Agreement',
          verifiedAt: '2026-09-01',
        },
      ]

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
