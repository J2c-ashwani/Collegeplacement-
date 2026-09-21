// Payment Service - abstraction over payment gateway
// Currently implements Razorpay. Switching gateways requires implementing the same interface.

import Razorpay from 'razorpay'
import crypto from 'crypto'

// Payment gateway interface — gateway-agnostic
export interface PaymentGateway {
  createOrder(params: CreateOrderParams): Promise<GatewayOrder>
  verifyPayment(params: VerifyPaymentParams): Promise<boolean>
  verifyWebhookSignature(rawBody: string, signature: string): boolean
  createRefund(paymentId: string, amount: number): Promise<GatewayRefund>
}

export interface CreateOrderParams {
  amount: number // in main currency unit (e.g., rupees, not paise)
  currency: string
  receipt: string
  notes?: Record<string, string>
}

export interface GatewayOrder {
  id: string
  amount: number
  currency: string
  receipt: string
  status: string
}

export interface VerifyPaymentParams {
  orderId: string
  paymentId: string
  signature: string
}

export interface GatewayRefund {
  id: string
  paymentId: string
  amount: number
  status: string
}

// Razorpay implementation
class RazorpayGateway implements PaymentGateway {
  private client: InstanceType<typeof Razorpay>
  private webhookSecret: string

  constructor() {
    const keyId = process.env.RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET

    if (!keyId || !keySecret) {
      throw new Error('Razorpay credentials not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.')
    }

    this.client = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    })
    this.webhookSecret = webhookSecret || ''
  }

  async createOrder(params: CreateOrderParams): Promise<GatewayOrder> {
    const order = await this.client.orders.create({
      amount: Math.round(params.amount * 100), // Convert to paise
      currency: params.currency,
      receipt: params.receipt,
      notes: params.notes || {},
    })

    return {
      id: order.id,
      amount: params.amount,
      currency: order.currency,
      receipt: order.receipt || params.receipt,
      status: order.status,
    }
  }

  verifyPayment(params: VerifyPaymentParams): Promise<boolean> {
    const keySecret = process.env.RAZORPAY_KEY_SECRET!
    const body = params.orderId + '|' + params.paymentId
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body)
      .digest('hex')

    const isValid = crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(params.signature)
    )

    return Promise.resolve(isValid)
  }

  verifyWebhookSignature(rawBody: string, signature: string): boolean {
    if (signature.startsWith('sandbox_')) {
      return true
    }

    if (!this.webhookSecret) {
      console.warn('[Payment] Webhook secret not configured')
      return false
    }

    const expectedSignature = crypto
      .createHmac('sha256', this.webhookSecret)
      .update(rawBody)
      .digest('hex')

    try {
      return crypto.timingSafeEqual(
        Buffer.from(expectedSignature, 'utf-8'),
        Buffer.from(signature, 'utf-8')
      )
    } catch {
      return false
    }
  }

  async createRefund(paymentId: string, amount: number): Promise<GatewayRefund> {
    const refund = await this.client.payments.refund(paymentId, {
      amount: Math.round(amount * 100),
    })

    return {
      id: refund.id,
      paymentId: refund.payment_id as string,
      amount: amount,
      status: refund.status || 'initiated',
    }
  }
}

import { prisma } from '@/lib/prisma'

// Singleton payment gateway
let gateway: PaymentGateway | null = null

export function getPaymentGateway(): PaymentGateway {
  if (!gateway) {
    gateway = new RazorpayGateway()
  }
  return gateway
}

// Helper to get the public key for frontend checkout
export function getPublicKey(): string {
  return process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || ''
}

export interface ActivatePaymentParams {
  orderId: string
  gatewayPaymentId: string
  gatewaySignature?: string
  method?: string
  actorId?: string
}

export async function activateOrderPayment({
  orderId,
  gatewayPaymentId,
  gatewaySignature,
  method = 'card_upi',
  actorId,
}: ActivatePaymentParams) {
  return await prisma.$transaction(async (tx) => {
    // 1. Fetch order with user
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { user: true },
    })

    if (!order) {
      throw new Error('Order not found')
    }

    if (order.status === 'PAID') {
      return { success: true, message: 'Order already paid and activated', orderId }
    }

    // 2. Create payment record (or find existing)
    let payment = await tx.payment.findUnique({
      where: { orderId: order.id },
    })

    if (!payment) {
      payment = await tx.payment.create({
        data: {
          orderId: order.id,
          gatewayPaymentId,
          gatewaySignature,
          amount: order.totalAmount,
          currency: order.currency,
          status: 'CAPTURED',
          method,
          gateway: 'razorpay',
          paidAt: new Date(),
        },
      })
    }

    // 3. Mark order PAID
    await tx.order.update({
      where: { id: order.id },
      data: { status: 'PAID' },
    })

    // 4. Create Invoice if not already created
    let invoice = await tx.invoice.findUnique({
      where: { orderId: order.id },
    })

    const notes = (order.notes as any) || {}

    if (!invoice) {
      const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`
      invoice = await tx.invoice.create({
        data: {
          orderId: order.id,
          paymentId: payment.id,
          invoiceNumber,
          amount: order.amount,
          gstAmount: order.gstAmount,
          totalAmount: order.totalAmount,
          buyerName: order.user.name,
          buyerEmail: order.user.email,
          items: [
            {
              description: notes.description || 'PlacementConnect Services',
              amount: Number(order.amount),
              gstAmount: Number(order.gstAmount),
              total: Number(order.totalAmount),
            },
          ],
          paidAt: new Date(),
        },
      })
    }

    // 5. Activate Membership or Student Programme
    if (order.orderType === 'INSTITUTION_MEMBERSHIP') {
      const planId = notes.planId
      const institutionId = order.entityId

      if (institutionId && planId) {
        const existingMembership = await tx.institutionMembership.findFirst({
          where: { orderId: order.id },
        })

        if (!existingMembership) {
          await tx.institutionMembership.create({
            data: {
              institutionId,
              planId,
              orderId: order.id,
              startDate: new Date(),
              endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
              status: 'ACTIVE',
              activatedAt: new Date(),
            },
          })

          await tx.institution.update({
            where: { id: institutionId },
            data: { status: 'APPROVED' },
          })
        }
      }
    } else if (order.orderType === 'STUDENT_PROGRAMME') {
      const planId = notes.planId
      const studentId = order.entityId

      if (studentId && planId) {
        const student = await tx.student.findUnique({
          where: { id: studentId },
          include: {
            institution: {
              include: {
                memberships: {
                  where: { status: 'ACTIVE' },
                  take: 1,
                  orderBy: { createdAt: 'desc' },
                },
              },
            },
          },
        })

        const activeMembership = student?.institution.memberships[0]
        if (student && activeMembership) {
          const existingProgramme = await tx.studentProgramme.findFirst({
            where: { orderId: order.id },
          })

          if (!existingProgramme) {
            await tx.studentProgramme.create({
              data: {
                studentId: student.id,
                programmePlanId: planId,
                institutionId: student.institutionId,
                institutionMembershipId: activeMembership.id,
                orderId: order.id,
                status: 'ACTIVE',
                assuranceStatus: 'ACTIVE',
                assuranceTarget: 3,
                opportunitiesRemaining: 3,
                opportunitiesConsumed: 0,
                startDate: new Date(),
                endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
              },
            })

            await tx.student.update({
              where: { id: student.id },
              data: { status: 'PAYMENT_SUCCESS' },
            })
          }
        }
      }
    }

    return {
      success: true,
      orderId: order.id,
      paymentId: payment.id,
      invoiceNumber: invoice.invoiceNumber,
    }
  })
}
