/**
 * Pluggable Email & Calendar Provider Abstractions for GrowthOS
 */

export interface InboundEmailMessage {
  sender: string
  subject: string
  body: string
  threadId?: string
  messageId?: string
}

export interface EmailProvider {
  send(params: {
    to: string
    subject: string
    body: string
    replyTo?: string
    headers?: Record<string, string>
  }): Promise<{ messageId: string }>
  verifyWebhook(payload: unknown, signature: string): boolean
  parseInbound(payload: unknown): InboundEmailMessage
}

export interface CalendarProvider {
  createEvent(params: {
    title: string
    scheduledAt: Date
    attendeeEmail: string
    agenda?: string
    durationMinutes?: number
  }): Promise<{ eventId: string; meetingUrl: string }>
  cancelEvent(eventId: string): Promise<boolean>
}

/**
 * Console/Dev Email Provider
 */
export class ConsoleEmailProvider implements EmailProvider {
  async send(params: {
    to: string
    subject: string
    body: string
    replyTo?: string
    headers?: Record<string, string>
  }): Promise<{ messageId: string }> {
    const mockId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
    console.log(`[GrowthOS Email][DEV OUTBOUND] To: ${params.to} | Subject: ${params.subject} | ID: ${mockId}`)
    return { messageId: mockId }
  }

  verifyWebhook(_payload: unknown, _signature: string): boolean {
    return true
  }

  parseInbound(payload: unknown): InboundEmailMessage {
    const data = (payload as Record<string, unknown>) || {}
    return {
      sender: String(data.sender || 'prospect@example.com'),
      subject: String(data.subject || 'Re: Partnership Inquiry'),
      body: String(data.body || ''),
      threadId: data.threadId ? String(data.threadId) : undefined,
      messageId: data.messageId ? String(data.messageId) : undefined,
    }
  }
}

/**
 * Resend Email Provider for Production
 */
export class ResendEmailProvider implements EmailProvider {
  private apiKey: string
  private defaultFrom: string

  constructor(apiKey?: string, defaultFrom?: string) {
    this.apiKey = apiKey || process.env.RESEND_API_KEY || 're_mock_key'
    this.defaultFrom = defaultFrom || process.env.EMAIL_FROM || 'PlacementConnect Growth <growth@placementconnect.internal>'
  }

  async send(params: {
    to: string
    subject: string
    body: string
    replyTo?: string
    headers?: Record<string, string>
  }): Promise<{ messageId: string }> {
    if (!process.env.RESEND_API_KEY) {
      console.log(`[Resend Mock Mode] Sending to ${params.to}: ${params.subject}`)
      return { messageId: `resend_${Date.now()}` }
    }

    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: this.defaultFrom,
          to: params.to,
          subject: params.subject,
          text: params.body,
          reply_to: params.replyTo,
          headers: params.headers,
        }),
      })

      if (!res.ok) {
        throw new Error(`Resend API error: ${res.statusText}`)
      }

      const data = await res.json()
      return { messageId: data.id || `msg_${Date.now()}` }
    } catch (err) {
      console.error('[Resend Send Error]', err)
      return { messageId: `msg_fallback_${Date.now()}` }
    }
  }

  verifyWebhook(_payload: unknown, signature: string): boolean {
    return Boolean(signature)
  }

  parseInbound(payload: unknown): InboundEmailMessage {
    const data = (payload as Record<string, unknown>) || {}
    return {
      sender: String(data.from || data.sender || ''),
      subject: String(data.subject || ''),
      body: String(data.text || data.body || ''),
      threadId: data.thread_id ? String(data.thread_id) : undefined,
      messageId: data.email_id ? String(data.email_id) : undefined,
    }
  }
}

/**
 * Mock Google Meet Calendar Provider
 */
export class MockCalendarProvider implements CalendarProvider {
  async createEvent(params: {
    title: string
    scheduledAt: Date
    attendeeEmail: string
    agenda?: string
    durationMinutes?: number
  }): Promise<{ eventId: string; meetingUrl: string }> {
    const eventId = `cal_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
    const meetingCode = `meet-${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 6)}`
    const meetingUrl = `https://meet.google.com/${meetingCode}`

    console.log(`[GrowthOS Calendar][EVENT CREATED] Title: ${params.title} | Time: ${params.scheduledAt.toISOString()} | Attendee: ${params.attendeeEmail} | URL: ${meetingUrl}`)
    return { eventId, meetingUrl }
  }

  async cancelEvent(eventId: string): Promise<boolean> {
    console.log(`[GrowthOS Calendar][EVENT CANCELLED] Event ID: ${eventId}`)
    return true
  }
}

// Default exported provider singletons
export const defaultEmailProvider: EmailProvider =
  process.env.EMAIL_PROVIDER === 'resend' && process.env.RESEND_API_KEY
    ? new ResendEmailProvider()
    : new ConsoleEmailProvider()

export const defaultCalendarProvider: CalendarProvider = new MockCalendarProvider()
