import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireApiAuth } from '@/lib/auth-utils'
import { successResponse, handleApiError, forbiddenError, validationError } from '@/lib/errors'
import { classifyInboundReply } from '@/services/growth-intelligence.service'
import { suppressProspectDnc } from '@/services/growth-sequence-worker'
import { z } from 'zod'

const replySchema = z.object({
  outreachId: z.string(),
  senderEmail: z.string().email(),
  body: z.string().min(2),
  snippet: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await requireApiAuth()
    if (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'OPERATIONS') {
      return forbiddenError('Access restricted to Platform Operations')
    }

    const body = await req.json()
    const parsed = replySchema.parse(body)

    const outreach = await prisma.growthOutreach.findUnique({
      where: { id: parsed.outreachId },
      include: {
        collegeProspect: true,
        employerProspect: true,
      },
    })

    if (!outreach) {
      return validationError('Outreach record not found')
    }

    // 1. Classify reply intent
    const classification = classifyInboundReply(parsed.body)

    // 2. Record ReplyEvent
    const replyEvent = await prisma.replyEvent.create({
      data: {
        outreachId: outreach.id,
        senderEmail: parsed.senderEmail,
        snippet: parsed.snippet || parsed.body.substring(0, 120),
        body: parsed.body,
        intent: classification.intent,
        confidence: classification.confidence,
        suggestedAction: classification.suggestedAction,
        requiresHumanReview: classification.requiresHumanReview,
      },
    })

    // 3. Record OutreachEvent
    await prisma.outreachEvent.create({
      data: {
        outreachId: outreach.id,
        eventType: 'REPLIED',
        payload: { intent: classification.intent, sender: parsed.senderEmail },
      },
    })

    // 4. Handle DNC / Unsubscribe automatically
    if (classification.intent === 'UNSUBSCRIBE_DNC') {
      const prospectId = outreach.collegeProspectId || outreach.employerProspectId
      if (prospectId) {
        await suppressProspectDnc(outreach.prospectType, prospectId, 'Inbound unsubscribe/DNC reply')
      }
    } else {
      // Update prospect status to REPLIED
      if (outreach.collegeProspectId) {
        await prisma.collegeProspect.update({
          where: { id: outreach.collegeProspectId },
          data: { status: 'REPLIED' },
        })
      } else if (outreach.employerProspectId) {
        await prisma.employerProspect.update({
          where: { id: outreach.employerProspectId },
          data: { status: 'REPLIED' },
        })
      }
    }

    return successResponse({
      replyEvent,
      classification,
      message: `Reply recorded. Intent classified as ${classification.intent}`,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
