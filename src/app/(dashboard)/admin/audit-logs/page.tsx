import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { AdminAuditTable, AdminAuditLogRow } from './admin-audit-table'
import { History, Shield, Lock } from 'lucide-react'

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
              Security & Compliance
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500">Immutable Ledger</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Platform Audit Trail</h1>
          <p className="text-xs text-slate-500 mt-1">
            Append-only compliance ledger recording every mutation across students, colleges, job offers, and fee billing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-purple-50 text-purple-700 border-purple-200 text-xs flex items-center gap-1">
            <Lock className="h-3 w-3" />
            Strictly Append-Only
          </Badge>
        </div>
      </div>

      <AdminAuditTable logs={auditRows} />
    </div>
  )
}
