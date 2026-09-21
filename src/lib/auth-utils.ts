import { auth } from '@/lib/auth';
import { Role } from '@prisma/client';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

export async function requireAuth(allowedRoles?: Role[]) {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }
  if (allowedRoles && !allowedRoles.includes(session.user.role as Role)) {
    redirect('/');
  }
  return session;
}

export async function requireApiAuth(allowedRoles?: Role[]) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  if (allowedRoles && !allowedRoles.includes(session.user.role as Role)) {
    throw new Error('Forbidden');
  }
  return session;
}

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}

export async function generateVerificationToken(email: string, type: string) {
  const token = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours
  
  await prisma.verificationToken.create({
    data: {
      email,
      token,
      expires,
      type
    }
  });
  
  return token;
}

export async function verifyToken(token: string, type: string) {
  const verificationToken = await prisma.verificationToken.findFirst({
    where: { token, type }
  });
  
  if (!verificationToken || verificationToken.expires < new Date()) {
    return null;
  }
  
  await prisma.verificationToken.delete({
    where: { id: verificationToken.id }
  });
  
  return verificationToken;
}

export async function resolveEmployerId(session: any): Promise<string | null> {
  if (session?.user?.employerId) return session.user.employerId;
  if (session?.user?.id) {
    const empUser = await prisma.employerUser.findFirst({
      where: { userId: session.user.id },
      select: { employerId: true },
    });
    if (empUser) return empUser.employerId;
  }
  // Only super admin or operations can preview with fallback
  if (session?.user?.role === 'SUPER_ADMIN' || session?.user?.role === 'OPERATIONS') {
    const firstEmp = await prisma.employer.findFirst({ select: { id: true } });
    return firstEmp?.id || null;
  }
  return null;
}

export async function resolveStudent(session: any) {
  if (!session?.user?.id) return null;
  return prisma.student.findFirst({
    where: { userId: session.user.id },
    include: {
      institution: true,
      profile: true,
      programmes: {
        where: { status: { in: ['ACTIVE', 'ELIGIBLE', 'TARGET_COMPLETED', 'PLACED'] } },
        include: { programmePlan: true },
        take: 1,
        orderBy: { createdAt: 'desc' },
      },
      assessments: {
        include: { result: true },
        orderBy: { startedAt: 'desc' },
        take: 1,
      },
      badges: {
        include: { badge: true },
      },
      opportunities: {
        include: {
          employer: true,
          job: true,
          interviews: { orderBy: { roundNumber: 'asc' } },
          offer: true,
        },
        orderBy: { opportunityNumber: 'asc' },
        take: 3,
      },
    },
  });
}

