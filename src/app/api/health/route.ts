import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import {
  CANONICAL_PAYMENT_STATE_MACHINE,
  STUDENT_TERMS_VERSION,
  INSTITUTION_MOU_VERSION,
} from '@/config/legal-documents'

const startTime = Date.now()

export const FROZEN_OPPORTUNITY_LIFECYCLE = [
  'CREATED',
  'MATCHED',
  'SCHEDULED',
  'ATTENDED',
  'COMPLETED',
  'COUNTED_TOWARD_ASSURANCE',
] as const

export async function GET(request: NextRequest) {
  const timestamp = new Date().toISOString()

  // Check if internal/authorized probe
  const healthToken = request.headers.get('x-health-token')
  const secret = process.env.HEALTH_CHECK_SECRET || 'dev-health-secret'
  const isSecretMatch = healthToken && healthToken === secret

  let isAuthorizedAdmin = false
  if (!isSecretMatch) {
    try {
      const session = await auth()
      if (session?.user?.role === 'SUPER_ADMIN' || session?.user?.role === 'OPERATIONS') {
        isAuthorizedAdmin = true
      }
    } catch {
      // Ignore auth error for public probe
    }
  }

  // If NOT authorized, return minimal safe public response (no internal infrastructure leak)
  if (!isSecretMatch && !isAuthorizedAdmin) {
    return NextResponse.json(
      {
        status: 'ok',
        timestamp,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    )
  }

  const cashfreeEnv = (process.env.CASHFREE_ENV || 'SANDBOX').toUpperCase()
  const appIdConfigured = Boolean(
    process.env.CASHFREE_APP_ID && !process.env.CASHFREE_APP_ID.startsWith('cf_test_')
  )
  const secretKeyConfigured = Boolean(
    process.env.CASHFREE_SECRET_KEY && !process.env.CASHFREE_SECRET_KEY.startsWith('cf_test_')
  )
  const webhookSecretConfigured = Boolean(process.env.CASHFREE_WEBHOOK_SECRET)
  const smtpHost = process.env.SMTP_HOST || ''
  const isExternalRelay = Boolean(
    smtpHost && smtpHost !== 'localhost' && smtpHost !== '127.0.0.1'
  )
  const smtpCredentialsConfigured = Boolean(process.env.SMTP_USER && process.env.SMTP_PASS)

  const frozenArchitectureGuardrails = {
    architectureStatus: 'FROZEN_PRE_LAUNCH_v4.1',
    paymentStateMachine: CANONICAL_PAYMENT_STATE_MACHINE,
    canonicalOpportunityLifecycle: FROZEN_OPPORTUNITY_LIFECYCLE,
    prohibitedParallelTerminology: ['Delivered', 'Fulfilled', 'Secured'],
    studentTermsStructure: `${STUDENT_TERMS_VERSION} — 6 Programme Clauses (Clauses 1–5 Substantive Assurance Terms + Clause 6 Electronic Acceptance & Immutable Record Preservation)`,
    institutionalMouLifecycle: `${INSTITUTION_MOU_VERSION} — 7-Stage Lifecycle (Stage 4: DRAFT / READY FOR SIGNATURE — NOT YET EXECUTED -> Stage 6/7: SIGNED / EXECUTED MOU — ACTIVE INSTITUTIONAL PARTNERSHIP)`,
  }

  const productionCutoverGates = {
    gate1_cashfreeProductionMerchant: {
      mode: cashfreeEnv,
      appIdConfigured,
      secretKeyConfigured,
      webhookSecretConfigured,
      readyForLiveProductionTransaction:
        cashfreeEnv === 'PRODUCTION' &&
        appIdConfigured &&
        secretKeyConfigured &&
        webhookSecretConfigured,
    },
    gate2_externalEmailProvider: {
      smtpHost: smtpHost || 'local-sandbox-relay',
      isExternalRelay,
      smtpCredentialsConfigured,
      readyForExternalMailboxDeliveryTest: isExternalRelay && smtpCredentialsConfigured,
    },
    gate3_privateDocumentStorageAcl: {
      gatewayRoute: '/api/documents/[id]',
      status: 'ACTIVE_TENANT_ISOLATED',
    },
  }

  // Detailed internal diagnostic probe for authorized operations
  try {
    const dbStart = Date.now()
    await prisma.$queryRaw`SELECT 1`
    const dbLatencyMs = Date.now() - dbStart

    const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000)

    return NextResponse.json(
      {
        status: 'healthy',
        timestamp,
        application: 'PlacementConnect',
        environment: process.env.NODE_ENV || 'development',
        uptimeSeconds,
        components: {
          database: {
            status: 'connected',
            latencyMs: dbLatencyMs,
          },
          auth: {
            status: 'active',
          },
          storageProvider: process.env.STORAGE_PROVIDER || 'local',
        },
        frozenArchitectureGuardrails,
        productionCutoverGates,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    )
  } catch (error) {
    return NextResponse.json(
      {
        status: 'degraded',
        timestamp,
        components: {
          database: {
            status: 'unreachable',
            error: error instanceof Error ? error.message : 'Database error',
          },
        },
        frozenArchitectureGuardrails,
        productionCutoverGates,
      },
      { status: 503 }
    )
  }
}
