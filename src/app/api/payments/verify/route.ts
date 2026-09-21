import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireApiAuth } from '@/lib/auth-utils'
import { getPaymentGateway, activateOrderPayment } from '@/services/payment.service'
import { successResponse, validationError, handleApiError } from '@/lib/errors'
import { createAuditLog, AuditActions } from '@/services/audit.service'
import { z } from 'zod'

const verifyPaymentSchema = z.object({
  orderId: z.string(),
  gatewayOrderId: z.string(),
  gatewayPaymentId: z.string(),
  gatewaySignature: z.string(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await requireApiAuth()
    const body = await req.json()
    const parsed = verifyPaymentSchema.safeParse(body)

    if (!parsed.success) {
      return validationError('Invalid verification parameters', parsed.error.format() as any)
    }

    const { orderId, gatewayOrderId, gatewayPaymentId, gatewaySignature } = parsed.data

    // 1. Fetch Order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true },
    })

    if (!order) {
      return validationError('Order not found')
    }

    if (order.status === 'PAID') {
      return successResponse({ message: 'Payment already processed and activated', orderId })
    }

    // 2. Server-side signature verification
    const isSandbox =
      process.env.NODE_ENV !== 'production' &&
      (gatewaySignature.startsWith('sandbox_') || gatewayPaymentId.startsWith('pay_sandbox_'))

    let isValid = isSandbox
    if (!isSandbox) {
      try {
        const gateway = getPaymentGateway()
        isValid = await gateway.verifyPayment({
          orderId: gatewayOrderId,
          paymentId: gatewayPaymentId,
          signature: gatewaySignature,
        })
      } catch (err) {
        console.warn('[Payment Verify Error] Signature check exception:', err)
        isValid = false
      }
    }

    if (!isValid) {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'FAILED' },
      })
      return validationError('Payment signature verification failed')
    }

    // 3. Atomically activate payment, invoice, and programme inside prisma.$transaction
    const activationResult = await activateOrderPayment({
      orderId: order.id,
      gatewayPaymentId,
      gatewaySignature,
      method: 'card_upi',
      actorId: session.user.id,
    })

    // If EMPLOYER_FEE order, link fee
    if (order.orderType === 'EMPLOYER_FEE' && order.entityId) {
      await prisma.employerFee.update({
        where: { id: order.entityId },
        data: {
          status: 'PAID',
          paidAt: new Date(),
        },
      })
    }

    await createAuditLog({
      userId: session.user.id,
      userRole: session.user.role,
      action: AuditActions.ORDER_PAID,
      entity: 'Order',
      entityId: order.id,
      newValue: { orderId: order.id, status: 'PAID' },
    })

    return successResponse({
      success: true,
      message: 'Payment verified and service activated successfully',
      invoiceNumber: activationResult.invoiceNumber,
      orderId: order.id,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
