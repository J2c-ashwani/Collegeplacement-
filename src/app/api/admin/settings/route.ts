import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireApiAuth } from '@/lib/auth-utils'
import { successResponse, validationError, handleApiError } from '@/lib/errors'
import { createAuditLog } from '@/services/audit.service'
import { z } from 'zod'

const updateSettingsSchema = z.object({
  assuranceQuota: z.string().default('3'),
  gstRate: z.string().default('18'),
  liquidityBufferTarget: z.string().default('1.20'),
  throttleGtmOnDeficit: z.boolean().default(true),
  maintenanceMode: z.boolean().default(false),
})

export async function GET() {
  try {
    await requireApiAuth(['SUPER_ADMIN', 'OPERATIONS'])

    const settings = await prisma.setting.findMany({
      where: {
        category: 'PLATFORM_RULES',
      },
    })

    const configMap: Record<string, any> = {
      assuranceQuota: '3',
      gstRate: '18',
      liquidityBufferTarget: '1.20',
      throttleGtmOnDeficit: true,
      maintenanceMode: false,
    }

    settings.forEach((s) => {
      configMap[s.key] = s.value
    })

    return successResponse(configMap)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireApiAuth(['SUPER_ADMIN'])
    const body = await req.json()
    const parsed = updateSettingsSchema.safeParse(body)

    if (!parsed.success) {
      return validationError('Invalid platform settings', parsed.error.format() as any)
    }

    const data = parsed.data

    for (const [key, val] of Object.entries(data)) {
      await prisma.setting.upsert({
        where: { key },
        create: {
          key,
          value: val as any,
          category: 'PLATFORM_RULES',
          updatedBy: session.user.id,
        },
        update: {
          value: val as any,
          updatedBy: session.user.id,
        },
      })
    }

    await createAuditLog({
      userId: session.user.id,
      userRole: session.user.role,
      action: 'PLATFORM_SETTINGS_UPDATED',
      entity: 'Setting',
      newValue: data,
    })

    return successResponse({ message: 'Platform settings updated successfully', settings: data })
  } catch (error) {
    return handleApiError(error)
  }
}
