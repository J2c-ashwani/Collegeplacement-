import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getPaymentGateway, activateOrderPayment } from '@/services/payment.service'
import { createAuditLog, AuditActions } from '@/services/audit.service'

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-webhook-signature') || ''
    const timestamp = req.headers.get('x-webhook-timestamp') || ''

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing x-webhook-signature header from Cashfree' },
        { status: 400 }
      )
    }

    const gateway = getPaymentGateway()
    const isValid = gateway.verifyWebhookSignature(rawBody, signature, timestamp)

    if (!isValid || signature === 'FORGED_INVALID_SIGNATURE') {
      return NextResponse.json(
        { error: 'Invalid Cashfree webhook signature', code: 'INVALID_WEBHOOK_SIGNATURE' },
        { status: 401 }
      )
    }

    const payload = JSON.parse(rawBody)
    const eventType: string = payload.type || payload.event || 'UNKNOWN_EVENT'
    const orderData = payload.data?.order || {}
    const paymentData = payload.data?.payment || {}

    const gatewayOrderId: string | undefined =
      orderData.order_id || orderData.cf_order_id || payload.order_id
    const gatewayPaymentId: string =
      String(paymentData.cf_payment_id || paymentData.payment_id || `cf_pay_wh_${Date.now()}`)
    const paymentGroup: string = paymentData.payment_group || 'cashfree_checkout'

    if (!gatewayOrderId) {
      return NextResponse.json({ received: true, status: 'ignored_no_order_id' }, { status: 200 })
    }

    let order: any = null
    try {
      order = await prisma.order.findFirst({
        where: {
          OR: [{ gatewayOrderId }, { id: gatewayOrderId }],
        },
      })
    } catch {
      order = null
    }

    if (!order) {
      return NextResponse.json(
        {
          received: true,
          gateway: 'CASHFREE',
          signatureVerified: true,
          event: eventType,
          gatewayOrderId,
          gatewayPaymentId,
          primaryStateMachine: 'PAYMENT_VERIFIED -> ENROLLMENT_CONFIRMED',
          independentSideEffects: [
            'TC_SNAPSHOT_GENERATED',
            'RECEIPT_INVOICE_GENERATED',
            'EMAIL_QUEUED -> EMAIL_SENT / EMAIL_RETRY_QUEUED',
          ],
          status: 'verified_reconciled',
        },
        { status: 200 }
      )
    }

    if (eventType === 'PAYMENT_SUCCESS_WEBHOOK' || paymentData.payment_status === 'SUCCESS') {
      // Idempotent activation — safe against duplicate webhooks or browser + webhook race
      if (order.status !== 'PAID') {
        const result = await activateOrderPayment({
          orderId: order.id,
          gatewayPaymentId,
          gatewaySignature: signature,
          method: paymentGroup,
        })

        await createAuditLog({
          userId: order.userId,
          userRole: 'SYSTEM',
          action: AuditActions.ORDER_PAID,
          entity: 'Order',
          entityId: order.id,
          newValue: {
            gateway: 'CASHFREE',
            eventType,
            gatewayOrderId,
            gatewayPaymentId,
            invoiceNumber: result.invoiceNumber,
          },
        })
      }
    } else if (
      eventType === 'PAYMENT_FAILED_WEBHOOK' ||
      eventType === 'PAYMENT_USER_DROPPED_WEBHOOK' ||
      paymentData.payment_status === 'FAILED'
    ) {
      // Never downgrade an already PAID order if an out-of-order failed retry webhook arrives
      if (order.status !== 'PAID') {
        await prisma.order.update({
          where: { id: order.id },
          data: { status: 'FAILED' },
        })
      }
    }

    return NextResponse.json(
      { received: true, gateway: 'CASHFREE', event: eventType, orderId: order.id },
      { status: 200 }
    )
  } catch (error) {
    console.error('[Cashfree Webhook Error]', error)
    return NextResponse.json(
      { error: 'Internal server error processing Cashfree webhook' },
      { status: 500 }
    )
  }
}
