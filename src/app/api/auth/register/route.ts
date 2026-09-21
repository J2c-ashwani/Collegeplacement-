import { NextResponse } from 'next/dist/server/web/spec-extension/response';
import { prisma } from '@/lib/prisma';
import { registerSchema } from '@/lib/validators/auth';
import { hashPassword, generateVerificationToken } from '@/lib/auth-utils';
import { Role } from '@prisma/client';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid fields', details: parsed.error }, { status: 400 });
    }
    
    const { name, email, password, phone, role } = parsed.data;
    
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }
    
    const hashedPassword = await hashPassword(password);
    
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        phone,
        role: (role as Role) || 'STUDENT',
        status: 'PENDING_VERIFICATION',
      },
    });
    
    const token = await generateVerificationToken(email, 'EMAIL_VERIFICATION');
    console.log(`[EMAIL_PROVIDER=console] Verification token for ${email}: ${token}`);
    
    return NextResponse.json({ success: true, message: 'Registration successful' }, { status: 201 });
  } catch (error) {
    console.error('Registration error', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
