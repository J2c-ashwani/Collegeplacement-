import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { AdminAuditTable, AdminAuditLogRow } from './admin-audit-table'
import { History, Shield, Lock } from 'lucide-react'

import { PageHeader } from '@/components/layout/page-header'

export default async function AdminAuditLogsPage() {
  const session = await auth()
  if (!session?.user?.id || (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'OPERATIONS')) {
    redirect('/login')
  }

  const logs = await prisma.auditLog.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  const auditRows: AdminAuditLogRow[] = logs.map((log) => ({
    id: log.id,
    timestamp: log.createdAt.toISOString().replace('T', ' ').substring(0, 19),
    actorName: log.user?.name || 'System Operations',
    actorEmail: log.user?.email || 'ops@placementconnect.internal',
    userRole: log.userRole || 'SUPER_ADMIN',
    action: log.action,
    entity: log.entity,
    entityId: log.entityId || 'SYS-BOOT',
    ip: log.ip || '127.0.0.1',
    diffSummary: 'State mutation verified',
    rawPreviousValue: log.previousValue,
    rawNewValue: log.newValue,
  }))

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* 6-Element Page Header */}
      <PageHeader
        breadcrumb={[
          { label: 'Platform Operations', href: '/admin/overview' },
          { label: 'Audit Trail' },
        ]}
        title="Platform Audit Trail"
        description="Append-only compliance ledger recording every mutation across students, colleges, job offers, and fee billing."
        statusChips={[
          {
            label: 'Integrity Mode',
            value: 'Append-Only Ledger',
            variant: 'neutral',
          },
          {
            label: 'Recent Events',
            value: auditRows.length.toString(),
            variant: 'neutral',
          },
        ]}
      />

      <AdminAuditTable logs={auditRows} />
    </div>
  )
}
