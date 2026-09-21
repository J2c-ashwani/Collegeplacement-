import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireApiAuth } from '@/lib/auth-utils'
import { successResponse, handleApiError, forbiddenError, validationError } from '@/lib/errors'
import { defaultCalendarProvider } from '@/services/growth-providers'
import { z } from 'zod'

const createMeetingSchema = z.object({
  prospectType: z.enum(['COLLEGE', 'EMPLOYER']),
  prospectId: z.string(),
  title: z.string().min(3),
  scheduledAt: z.string(), // ISO date
  attendeeEmail: z.string().email(),
  agenda: z.string().optional(),
})

const updateMeetingOutcomeSchema = z.object({
  meetingId: z.string(),
  outcome: z.enum([
    'SCHEDULED',
    'HELD_QUALIFIED',
    'HELD_PROPOSAL_REQUESTED',
    'HELD_MOU_IN_PROGRESS',
    'HELD_UNQUALIFIED',
    'RESCHEDULED',
    'NO_SHOW',
    'CANCELLED',
  ]),
  outcomeNotes: z.string().optional(),
  nextStepAction: z.string().optional(),
})

export async function GET(_req: NextRequest) {
  try {
    const session = await requireApiAuth()
    if (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'OPERATIONS') {
      return forbiddenError('Access restricted to Platform Operations')
    }

    const meetings = await prisma.growthMeeting.findMany({
      include: {
        collegeProspect: true,
        employerProspect: true,
      },
      orderBy: { scheduledAt: 'desc' },
      take: 50,
    })

    return successResponse(meetings)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireApiAuth()
    if (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'OPERATIONS') {
      return forbiddenError('Access restricted to Platform Operations')
    }

    const body = await req.json()

    // Outcome update
    if (body.outcome) {
      const parsedOutcome = updateMeetingOutcomeSchema.parse(body)
      const updated = await prisma.growthMeeting.update({
        where: { id: parsedOutcome.meetingId },
        data: {
          outcome: parsedOutcome.outcome,
          outcomeNotes: parsedOutcome.outcomeNotes,
          nextStepAction: parsedOutcome.nextStepAction,
        },
      })
      return successResponse(updated)
    }

    // Meeting creation
    const parsed = createMeetingSchema.parse(body)
    const scheduledDate = new Date(parsed.scheduledAt)

    const calendarRes = await defaultCalendarProvider.createEvent({
      title: parsed.title,
      scheduledAt: scheduledDate,
      attendeeEmail: parsed.attendeeEmail,
      agenda: parsed.agenda,
    })

    const meeting = await prisma.growthMeeting.create({
      data: {
        prospectType: parsed.prospectType,
        collegeProspectId: parsed.prospectType === 'COLLEGE' ? parsed.prospectId : null,
        employerProspectId: parsed.prospectType === 'EMPLOYER' ? parsed.prospectId : null,
        ownerId: session.user.id,
        title: parsed.title,
        scheduledAt: scheduledDate,
        meetingUrl: calendarRes.meetingUrl,
        calendarEventId: calendarRes.eventId,
        agenda: parsed.agenda,
        outcome: 'SCHEDULED',
      },
    })

    // Update prospect status
    if (parsed.prospectType === 'COLLEGE') {
      await prisma.collegeProspect.update({
        where: { id: parsed.prospectId },
        data: { status: 'MEETING_SCHEDULED' },
      })
    } else {
      await prisma.employerProspect.update({
        where: { id: parsed.prospectId },
        data: { status: 'MEETING_SCHEDULED' },
      })
    }

    return successResponse(meeting, undefined, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
