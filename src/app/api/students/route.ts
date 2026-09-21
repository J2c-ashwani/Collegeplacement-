import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth-utils'
import { successResponse, validationError, handleApiError, conflictError, forbiddenError } from '@/lib/errors'
import { createAuditLog, AuditActions } from '@/services/audit.service'
import { z } from 'zod'

const registerStudentSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().optional(),
  institutionId: z.string(),
  enrollmentNumber: z.string().min(2),
  course: z.string().min(2),
  branch: z.string().min(2),
  department: z.string().optional().default('Engineering'),
  graduationYear: z.number().int(),
  cgpa: z.number().min(0).max(10).optional(),
  tenthPercentage: z.number().min(0).max(100).optional(),
  twelfthPercentage: z.number().min(0).max(100).optional(),
  skills: z.array(z.string()).default([]),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = registerStudentSchema.safeParse(body)

    if (!parsed.success) {
      return validationError('Invalid student registration details', parsed.error.format() as any)
    }

    const data = parsed.data

    // 1. Verify institution exists and has active membership
    const institution = await prisma.institution.findUnique({
      where: { id: data.institutionId },
      include: {
        memberships: {
          where: {
            status: 'ACTIVE',
            endDate: { gte: new Date() },
          },
          take: 1,
        },
      },
    })

    if (!institution) {
      return validationError('Institution not found')
    }

    if (institution.status !== 'APPROVED' || institution.memberships.length === 0) {
      return forbiddenError('Institution membership is inactive or expired. New enrolments are closed.')
    }

    // 2. Check for duplicate email
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      return conflictError('An account with this email already exists.')
    }

    // 3. Hash password
    const passwordHash = await hashPassword(data.password)

    // 4. Create User
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        passwordHash,
        role: 'STUDENT',
        status: 'ACTIVE', // Activated for institutional flow
        emailVerified: new Date(),
      },
    })

    // 5. Generate Student Verification Code (e.g. STU-2026-000142)
    const studentCount = await prisma.student.count()
    const verificationId = `STU-${data.graduationYear}-${String(studentCount + 1).padStart(6, '0')}`

    // 6. Create Student
    const student = await prisma.student.create({
      data: {
        userId: user.id,
        institutionId: data.institutionId,
        enrollmentNumber: data.enrollmentNumber,
        status: 'PAYMENT_PENDING',
        verificationId,
        registrationSource: 'INSTITUTION_URL',
      },
    })

    // 7. Create Student Profile
    await prisma.studentProfile.create({
      data: {
        studentId: student.id,
        course: data.course,
        branch: data.branch,
        department: data.department,
        graduationYear: data.graduationYear,
        cgpa: data.cgpa,
        tenthPercentage: data.tenthPercentage,
        twelfthPercentage: data.twelfthPercentage,
        skills: data.skills,
        employerVisibilityConsent: true,
        employerVisibilityConsentAt: new Date(),
      },
    })

    // 8. Link to Roster Student record if matched by enrollment or email
    const matchedRoster = await prisma.rosterStudent.findFirst({
      where: {
        institutionId: data.institutionId,
        OR: [{ enrollmentNumber: data.enrollmentNumber }, { email: data.email }],
      },
    })

    if (matchedRoster) {
      await prisma.rosterStudent.update({
        where: { id: matchedRoster.id },
        data: {
          registeredStudentId: student.id,
          invitationStatus: 'REGISTERED',
        },
      })
    }

    await createAuditLog({
      userId: user.id,
      userRole: 'STUDENT',
      action: AuditActions.STUDENT_REGISTERED,
      entity: 'Student',
      entityId: student.id,
      newValue: {
        institutionId: data.institutionId,
        verificationId,
        enrollmentNumber: data.enrollmentNumber,
      },
    })

    return successResponse(
      {
        studentId: student.id,
        verificationId,
        message: 'Student account created successfully',
      },
      undefined,
      201
    )
  } catch (error) {
    return handleApiError(error)
  }
}
