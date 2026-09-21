import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, handleApiError } from '@/lib/errors'
import { defaultEmailProvider } from '@/services/growth-providers'
import { classifyInboundReply } from '@/services/growth-intelligence.service'
import { suppressProspectDnc } from '@/services/growth-sequence-worker'

export async function POST(req: NextRequest) {
  try {
    const rawPayload = await req.json()
    const signature = req.headers.get('x-webhook-signature') || ''

    // Verify webhook
    if (!defaultEmailProvider.verifyWebhook(rawPayload, signature)) {
      return successResponse({ received: false, error: 'Invalid webhook signature' }, undefined, 401)
    }

    const eventType = rawPayload.type || rawPayload.event
    const messageId = rawPayload.message_id || rawPayload.data?.email_id

    if (!messageId) {
      return successResponse({ received: true, note: 'No message ID present' })
    }

    const outreach = await prisma.growthOutreach.findFirst({
      where: { providerMessageId: messageId },
    })

    if (!outreach) {
      return successResponse({ received: true, note: 'No matching outreach found' })
    }

    // 1. Record event
    if (eventType === 'email.delivered') {
      await prisma.outreachEvent.create({
        data: { outreachId: outreach.id, eventType: 'DELIVERED', payload: rawPayload },
      })
    } else if (eventType === 'email.opened') {
      await prisma.outreachEvent.create({
        data: { outreachId: outreach.id, eventType: 'OPENED', payload: rawPayload },
      })
    } else if (eventType === 'email.clicked') {
      await prisma.outreachEvent.create({
        data: { outreachId: outreach.id, eventType: 'CLICKED', payload: rawPayload },
      })
    } else if (eventType === 'email.bounced') {
      await prisma.outreachEvent.create({
        data: { outreachId: outreach.id, eventType: 'BOUNCED', payload: rawPayload },
      })
    } else if (eventType === 'email.replied' || rawPayload.reply_text) {
      const parsedInbound = defaultEmailProvider.parseInbound(rawPayload)
      const classification = classifyInboundReply(parsedInbound.body)

      await prisma.replyEvent.create({
        data: {
          outreachId: outreach.id,
          senderEmail: parsedInbound.sender,
          snippet: parsedInbound.body.substring(0, 120),
          body: parsedInbound.body,
          intent: classification.intent,
          confidence: classification.confidence,
          suggestedAction: classification.suggestedAction,
          requiresHumanReview: classification.requiresHumanReview,
        },
      })

      if (classification.intent === 'UNSUBSCRIBE_DNC') {
        const prospectId = outreach.collegeProspectId || outreach.employerProspectId
        if (prospectId) {
          await suppressProspectDnc(outreach.prospectType, prospectId, 'Webhook unsubscribe')
        }
      }
    }

    return successResponse({ received: true })
  } catch (error) {
    return handleApiError(error)
  }
}
