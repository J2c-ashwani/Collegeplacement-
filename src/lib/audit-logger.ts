import { prisma } from '@/lib/prisma'
import { createAuditLog, AuditLogEntry, AuditActions } from '@/services/audit.service'

export { createAuditLog, AuditActions, type AuditLogEntry }
export const logAuditEvent = createAuditLog
export type LogAuditParams = AuditLogEntry

/**
 * Immutable query interface for operational compliance audits.
 * Read-only accessor.
 */
export async function getAuditLogs(options?: {
  entity?: string
  entityId?: string
  limit?: number
  offset?: number
}) {
  return prisma.auditLog.findMany({
    where: {
      ...(options?.entity ? { entity: options.entity } : {}),
      ...(options?.entityId ? { entityId: options.entityId } : {}),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: options?.limit ?? 50,
    skip: options?.offset ?? 0,
  })
}
