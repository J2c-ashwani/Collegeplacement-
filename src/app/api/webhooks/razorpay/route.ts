import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getPaymentGateway, activateOrderPayment } from '@/services/payment.service'

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-razorpay-signature')

    if (!signature) {
      return NextResponse.json({ error: 'Missing x-razorpay-signature header' }, { status: 400 })
    }

    // Verify webhook signature
    const gateway = getPaymentGateway()
    const isValid = gateway.verifyWebhookSignature(rawBody, signature)

    if (!isValid && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 })
    }

    const event = JSON.parse(rawBody)
    const eventType = event.event
    console.log(`[Webhook Razorpay] Received event: ${eventType}`)

    // Idempotent processing & atomic service activation
    if (eventType === 'payment.captured' || eventType === 'order.paid') {
      const paymentEntity = event.payload?.payment?.entity
      const gatewayOrderId = paymentEntity?.order_id
      const gatewayPaymentId = paymentEntity?.id

      if (gatewayOrderId) {
        const order = await prisma.order.findFirst({
          where: { gatewayOrderId },
        })

        if (order && order.status !== 'PAID') {
          await activateOrderPayment({
            orderId: order.id,
            gatewayPaymentId: gatewayPaymentId || `pay_webhook_${Date.now()}`,
            gatewaySignature: signature || 'webhook_verified',
            method: paymentEntity?.method || 'webhook_captured',
          })
          console.log(`[Webhook Razorpay] Order ${order.id} atomically activated via webhook`)
        }
      }
    } else if (eventType === 'payment.failed') {
      const paymentEntity = event.payload?.payment?.entity
      const gatewayOrderId = paymentEntity?.order_id

      if (gatewayOrderId) {
        await prisma.order.updateMany({
          where: { gatewayOrderId, status: 'CREATED' },
          data: { status: 'FAILED' },
        })
      }
    }

    return NextResponse.json({ received: true, event: eventType }, { status: 200 })
  } catch (error) {
    console.error('[Webhook Razorpay Error]', error)
    return NextResponse.json({ error: 'Internal server error processing webhook' }, { status: 500 })
  }
}
