import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth-utils';
import { Role } from '@prisma/client';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      password,
      phone,
      role = 'INSTITUTION_ADMIN',
      organizationName,
      city = 'New Delhi',
      state = 'Delhi NCR',
      campusCode,
    } = body;

    if (!name || !email || !password || password.length < 8) {
      return NextResponse.json(
        { error: 'Please provide your full name, official email, and a password (min 8 characters).' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email address already exists. Please sign in.' },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const targetRole: Role =
      role === 'EMPLOYER'
        ? 'EMPLOYER'
        : role === 'INSTITUTION_ADMIN'
        ? 'INSTITUTION_ADMIN'
        : 'STUDENT';

    let institutionId: string | undefined = undefined;

    if (targetRole === 'INSTITUTION_ADMIN') {
      const generatedCode =
        (organizationName || 'INST')
          .replace(/[^A-Za-z]/g, '')
          .slice(0, 3)
          .toUpperCase() + Math.floor(100 + Math.random() * 899);

      const createdInst = await prisma.institution.create({
        data: {
          name: organizationName || `${name}'s Institution`,
          code: generatedCode,
          registrationCode: `${generatedCode}-2026`,
          type: 'ENGINEERING',
          city,
          state,
          status: 'APPROVED',
          estimatedStudentCount: 300,
        },
      });
      institutionId = createdInst.id;
    }

    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        passwordHash: hashedPassword,
        phone: phone || null,
        role: targetRole,
        status: 'ACTIVE',
        emailVerified: new Date(),
        ...(institutionId ? { institutionId } : {}),
      },
    });

    if (targetRole === 'EMPLOYER') {
      await prisma.employer.create({
        data: {
          name: organizationName || `${name} Corporate HR`,
          industry: 'Technology & Enterprise Services',
          size: 'MEDIUM',
          city,
          state,
          status: 'APPROVED',
          users: {
            create: {
              userId: user.id,
              designation: 'Talent Acquisition Lead',
              isPrimary: true,
            },
          },
        },
      });
    } else if (targetRole === 'STUDENT') {
      const targetInst =
        (campusCode
          ? await prisma.institution.findFirst({
              where: { code: { equals: campusCode.trim().toUpperCase(), mode: 'insensitive' } },
            })
          : null) || (await prisma.institution.findFirst());

      if (targetInst) {
        await prisma.student.create({
          data: {
            userId: user.id,
            institutionId: targetInst.id,
            enrollmentNumber: `ENR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
            status: 'ACTIVE',
            verificationId: `STU-2026-${Math.floor(100000 + Math.random() * 900000)}`,
          },
        });
      }
    }

    return NextResponse.json(
      {
        success: true,
        role: targetRole,
        message: 'Workspace provisioned and activated. You may now sign in.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[REGISTER_GATEWAY_ERROR]', error);
    return NextResponse.json(
      { error: 'Unable to complete registration. Please check your details and try again.' },
      { status: 500 }
    );
  }
}
