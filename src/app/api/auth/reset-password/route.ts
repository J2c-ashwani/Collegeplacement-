import { NextResponse } from 'next/dist/server/web/spec-extension/response';
import { resetPasswordSchema } from '@/lib/validators/auth';
import { prisma } from '@/lib/prisma';
import { verifyToken, hashPassword } from '@/lib/auth-utils';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = resetPasswordSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    
    const { token, password } = parsed.data;
    
    const resetToken = await verifyToken(token, 'PASSWORD_RESET');
    
    if (!resetToken) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }
    
    const hashedPassword = await hashPassword(password);
    
    await prisma.user.update({
      where: { email: resetToken.email },
      data: {
        passwordHash: hashedPassword,
      },
    });
    
    return NextResponse.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
