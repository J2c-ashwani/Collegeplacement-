import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

const startTime = Date.now()

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
      },
      { status: 503 }
    )
  }
}
