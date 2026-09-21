import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

// Audit log service - records every critical action
export interface AuditLogEntry {
  userId?: string | null
  userRole?: string | null
  action: string
  entity: string
  entityId?: string | null
  previousValue?: Record<string, unknown> | null
  newValue?: Record<string, unknown> | null
  ip?: string | null
  userAgent?: string | null
}

export async function createAuditLog(entry: AuditLogEntry) {
  try {
    return await prisma.auditLog.create({
      data: {
        userId: entry.userId ?? undefined,
        userRole: entry.userRole ?? undefined,
        action: entry.action,
        entity: entry.entity,
        entityId: entry.entityId ?? undefined,
        previousValue: entry.previousValue ? (entry.previousValue as Prisma.InputJsonValue) : undefined,
        newValue: entry.newValue ? (entry.newValue as Prisma.InputJsonValue) : undefined,
        ip: entry.ip ?? undefined,
        userAgent: entry.userAgent ?? undefined,
      },
    })
  } catch (error) {
    // Audit logging should never break the main operation
    console.error('[Audit Log Error]', error)
    return null
  }
}

// Convenience helpers for common actions
export const AuditActions = {
  // Auth
  USER_LOGIN: 'USER_LOGIN',
  USER_LOGOUT: 'USER_LOGOUT',
  USER_REGISTER: 'USER_REGISTER',
  PASSWORD_RESET: 'PASSWORD_RESET',
  EMAIL_VERIFIED: 'EMAIL_VERIFIED',

  // Institution
  INSTITUTION_CREATED: 'INSTITUTION_CREATED',
  INSTITUTION_APPROVED: 'INSTITUTION_APPROVED',
  INSTITUTION_REJECTED: 'INSTITUTION_REJECTED',
  INSTITUTION_SUSPENDED: 'INSTITUTION_SUSPENDED',
  MEMBERSHIP_PURCHASED: 'MEMBERSHIP_PURCHASED',
  MEMBERSHIP_ACTIVATED: 'MEMBERSHIP_ACTIVATED',
  MEMBERSHIP_EXPIRED: 'MEMBERSHIP_EXPIRED',

  // Student
  STUDENT_REGISTERED: 'STUDENT_REGISTERED',
  STUDENT_PAYMENT_COMPLETED: 'STUDENT_PAYMENT_COMPLETED',
  STUDENT_STATUS_CHANGED: 'STUDENT_STATUS_CHANGED',
  ASSESSMENT_COMPLETED: 'ASSESSMENT_COMPLETED',
  PROGRAMME_ACTIVATED: 'PROGRAMME_ACTIVATED',

  // Employer
  EMPLOYER_CREATED: 'EMPLOYER_CREATED',
  EMPLOYER_UPDATED: 'EMPLOYER_UPDATED',
  EMPLOYER_APPROVED: 'EMPLOYER_APPROVED',
  EMPLOYER_REJECTED: 'EMPLOYER_REJECTED',

  // Jobs
  JOB_CREATED: 'JOB_CREATED',
  JOB_APPROVED: 'JOB_APPROVED',
  JOB_CLOSED: 'JOB_CLOSED',

  // Placement
  APPLICATION_SUBMITTED: 'APPLICATION_SUBMITTED',
  CANDIDATE_SHORTLISTED: 'CANDIDATE_SHORTLISTED',
  OPPORTUNITY_ASSIGNED: 'OPPORTUNITY_ASSIGNED',
  INTERVIEW_SCHEDULED: 'INTERVIEW_SCHEDULED',
  INTERVIEW_COMPLETED: 'INTERVIEW_COMPLETED',
  INTERVIEW_RESULT_CHANGED: 'INTERVIEW_RESULT_CHANGED',
  OFFER_CREATED: 'OFFER_CREATED',
  OFFER_ACCEPTED: 'OFFER_ACCEPTED',
  PLACEMENT_CONFIRMED: 'PLACEMENT_CONFIRMED',
  PLACEMENT_VERIFIED: 'PLACEMENT_VERIFIED',
  PLACEMENT_REVERSED: 'PLACEMENT_REVERSED',

  // Documents
  DOCUMENT_UPLOADED: 'DOCUMENT_UPLOADED',
  DOCUMENT_VERIFIED: 'DOCUMENT_VERIFIED',
  DOCUMENT_REJECTED: 'DOCUMENT_REJECTED',

  // Payments
  ORDER_PAID: 'ORDER_PAID',
  PAYMENT_RECEIVED: 'PAYMENT_RECEIVED',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  REFUND_INITIATED: 'REFUND_INITIATED',
  REFUND_PROCESSED: 'REFUND_PROCESSED',
  EMPLOYER_FEE_GENERATED: 'EMPLOYER_FEE_GENERATED',

  // Admin
  SETTING_CHANGED: 'SETTING_CHANGED',
  USER_SUSPENDED: 'USER_SUSPENDED',
  ADMIN_OVERRIDE: 'ADMIN_OVERRIDE',
} as const
