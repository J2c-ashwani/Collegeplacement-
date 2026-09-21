import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireApiAuth } from '@/lib/auth-utils'
import { successResponse, validationError, handleApiError } from '@/lib/errors'
import { z } from 'zod'

const markReadSchema = z.object({
  id: z.string().optional(),
  markAllRead: z.boolean().optional(),
})

export async function GET() {
  try {
    const session = await requireApiAuth()

    const notifications = await prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 30,
    })

    const unreadCount = await prisma.notification.count({
      where: { userId: session.user.id, read: false },
    })

    return successResponse({
      notifications,
      unreadCount,
    })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await requireApiAuth()
    const body = await req.json()
    const parsed = markReadSchema.safeParse(body)

    if (!parsed.success) {
      return validationError('Invalid payload', parsed.error.format() as any)
    }

    const { id, markAllRead } = parsed.data

    if (markAllRead) {
      await prisma.notification.updateMany({
        where: { userId: session.user.id, read: false },
        data: { read: true, readAt: new Date() },
      })
      return successResponse({ message: 'All notifications marked as read' })
    }

    if (id) {
      await prisma.notification.update({
        where: { id, userId: session.user.id },
        data: { read: true, readAt: new Date() },
      })
      return successResponse({ message: 'Notification marked as read' })
    }

    return validationError('Must specify either id or markAllRead')
  } catch (error) {
    return handleApiError(error)
  }
}
