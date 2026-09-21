import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireApiAuth } from '@/lib/auth-utils'
import { getPaymentGateway, getPublicKey } from '@/services/payment.service'
import { successResponse, validationError, handleApiError } from '@/lib/errors'
import { z } from 'zod'

const createOrderSchema = z.object({
  orderType: z.enum(['INSTITUTION_MEMBERSHIP', 'STUDENT_PROGRAMME', 'EMPLOYER_FEE']),
  planId: z.string().optional(),
  entityId: z.string().optional(), // institutionId or studentId or employerFeeId
  couponCode: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await requireApiAuth()
    const body = await req.json()
    const parsed = createOrderSchema.safeParse(body)

    if (!parsed.success) {
      return validationError('Invalid payment order request', parsed.error.format() as any)
    }

    const { orderType, planId, entityId, couponCode } = parsed.data
    let baseAmount = 0
    let gstPercent = 18
    let description = ''

    // 1. Server-side price resolution from database (NEVER trust frontend amount)
    if (orderType === 'INSTITUTION_MEMBERSHIP') {
      if (!planId) return validationError('planId is required for institution membership')
      const plan = await prisma.institutionPlan.findUnique({ where: { id: planId } })
      if (!plan || !plan.isActive) return validationError('Selected institution plan is invalid or inactive')
      baseAmount = Number(plan.price)
      gstPercent = Number(plan.gstPercent)
      description = `Institution Membership — ${plan.name}`
    } else if (orderType === 'STUDENT_PROGRAMME') {
      if (!planId) return validationError('planId is required for student programme')
      const plan = await prisma.programmePlan.findUnique({ where: { id: planId } })
      if (!plan || !plan.isActive) return validationError('Selected student programme plan is invalid or inactive')
      baseAmount = Number(plan.price)
      gstPercent = Number(plan.gstPercent)
      description = `Student Programme — ${plan.name}`
    } else if (orderType === 'EMPLOYER_FEE') {
      if (!entityId) return validationError('entityId (fee ID) is required for employer fee')
      const fee = await prisma.employerFee.findUnique({ where: { id: entityId } })
      if (!fee || fee.status === 'PAID') return validationError('Fee record not found or already paid')
      baseAmount = Number(fee.amount)
      gstPercent = 18
      description = 'Employer Success Placement Fee'
    }

    // 2. Apply Coupon if provided
    let discount = 0
    let couponId: string | undefined = undefined
    if (couponCode) {
      const coupon = await prisma.coupon.findFirst({
        where: {
          code: couponCode.toUpperCase(),
          isActive: true,
          validFrom: { lte: new Date() },
          validTo: { gte: new Date() },
        },
      })
      if (coupon) {
        if (!coupon.maxUses || coupon.usedCount < coupon.maxUses) {
          couponId = coupon.id
          discount =
            coupon.type === 'PERCENTAGE'
              ? (baseAmount * Number(coupon.value)) / 100
              : Math.min(Number(coupon.value), baseAmount)
        }
      }
    }

    const discountedBase = Math.max(baseAmount - discount, 0)
    const gstAmount = (discountedBase * gstPercent) / 100
    const totalAmount = discountedBase + gstAmount

    const receipt = `rcpt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`

    // 3. Create Gateway Order
    let gatewayOrderId = `order_${Date.now()}`
    try {
      const gateway = getPaymentGateway()
      const gatewayOrder = await gateway.createOrder({
        amount: totalAmount,
        currency: 'INR',
        receipt,
        notes: {
          orderType,
          userId: session.user.id,
          entityId: entityId || '',
        },
      })
      gatewayOrderId = gatewayOrder.id
    } catch (gwErr) {
      console.warn('[Payment Sandbox Mode] Razorpay call failed, using sandbox order ID:', gwErr)
    }

    // 4. Record Order in database
    const order = await prisma.order.create({
      data: {
        orderType,
        entityId: entityId || session.user.institutionId || session.user.id,
        userId: session.user.id,
        amount: discountedBase,
        gstAmount,
        totalAmount,
        currency: 'INR',
        status: 'CREATED',
        gatewayOrderId,
        couponId,
        notes: { description, receipt, planId },
      },
    })

    return successResponse({
      orderId: order.id,
      gatewayOrderId,
      amount: totalAmount,
      currency: 'INR',
      keyId: getPublicKey() || 'rzp_test_sandbox',
      description,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
