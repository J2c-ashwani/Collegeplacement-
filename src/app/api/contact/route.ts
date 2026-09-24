import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      firstName,
      lastName,
      email,
      organization,
      roleType,
      subject,
      message,
    } = body;

    if (!firstName || !email || !message) {
      return NextResponse.json(
        { error: 'Please provide your name, official email address, and message.' },
        { status: 400 }
      );
    }

    const fullName = `${firstName} ${lastName || ''}`.trim();
    const normalizedRole = (roleType || 'INSTITUTION').toUpperCase();
    const ticketId = `INQ-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    // Persist immutable audit trail record of the institutional/corporate inquiry
    const auditRecord = await prisma.auditLog.create({
      data: {
        action: 'PUBLIC_INQUIRY_SUBMITTED',
        entity: 'ContactInquiry',
        entityId: ticketId,
        userRole: normalizedRole,
        newValue: {
          ticketId,
          fullName,
          email,
          organization: organization || 'Not specified',
          roleType: normalizedRole,
          subject: subject || 'Institutional / Corporate Partnership Inquiry',
          message,
          submittedAt: new Date().toISOString(),
        },
      },
    });

    return NextResponse.json({
      success: true,
      ticketId,
      auditId: auditRecord.id,
      message: 'Your inquiry has been logged with our Institutional & Corporate Operations Desk.',
    });
  } catch (error) {
    console.error('[CONTACT_API_ERROR]', error);
    return NextResponse.json(
      { error: 'Unable to record inquiry at this moment. Please email contact@placementconnect.com.' },
      { status: 500 }
    );
  }
}
