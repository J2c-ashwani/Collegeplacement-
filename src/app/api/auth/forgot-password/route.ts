import { NextResponse } from 'next/dist/server/web/spec-extension/response';
import { forgotPasswordSchema } from '@/lib/validators/auth';
import { prisma } from '@/lib/prisma';
import { generateVerificationToken } from '@/lib/auth-utils';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = forgotPasswordSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }
    
    const { email } = parsed.data;
    
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (user) {
      const token = await generateVerificationToken(email, 'PASSWORD_RESET');
      console.log(`[EMAIL_PROVIDER=console] Password reset token for ${email}: ${token}`);
    }
    
    return NextResponse.json({ success: true, message: 'If the email exists, a reset link has been sent' });
  } catch (error) {
    console.error('Forgot password error', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
