import { NextResponse } from 'next/dist/server/web/spec-extension/response';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth-utils';

export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    
    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }
    
    const verificationToken = await verifyToken(token, 'EMAIL_VERIFICATION');
    
    if (!verificationToken) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }
    
    await prisma.user.update({
      where: { email: verificationToken.email },
      data: {
        emailVerified: new Date(),
        status: 'ACTIVE',
      },
    });
    
    return NextResponse.json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    console.error('Verify email error', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
