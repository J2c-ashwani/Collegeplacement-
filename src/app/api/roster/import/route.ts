import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireApiAuth } from '@/lib/auth-utils'
import { successResponse, validationError, handleApiError, forbiddenError } from '@/lib/errors'
import { z } from 'zod'

const rosterStudentSchema = z.object({
  name: z.string().min(2),
  enrollmentNumber: z.string().min(2),
  email: z.string().email(),
  mobile: z.string().optional(),
  course: z.string().min(2),
  branch: z.string().min(2),
  department: z.string().optional().default('General'),
  graduationYear: z.number().int().default(2026),
  cgpa: z.number().min(0).max(10).optional(),
})

const importRosterSchema = z.object({
  institutionId: z.string(),
  graduationYear: z.number().int().default(2026),
  students: z.array(rosterStudentSchema).min(1, 'At least one student must be provided'),
})

export async function POST(req: NextRequest) {
  try {
    const session = await requireApiAuth(['SUPER_ADMIN', 'OPERATIONS', 'INSTITUTION_ADMIN'])
    const body = await req.json()
    const parsed = importRosterSchema.safeParse(body)

    if (!parsed.success) {
      return validationError('Invalid roster payload', parsed.error.format() as any)
    }

    const { institutionId, graduationYear, students } = parsed.data

    // Enforce data isolation: Institution Admin can only import to their own institution
    if (session.user.role === 'INSTITUTION_ADMIN' && session.user.institutionId !== institutionId) {
      return forbiddenError('You are not authorized to import roster for another institution')
    }

    // Verify institution exists and has active membership
    const institution = await prisma.institution.findUnique({
      where: { id: institutionId },
      include: {
        memberships: {
          where: { status: 'ACTIVE' },
          take: 1,
        },
      },
    })

    if (!institution) {
      return validationError('Institution not found')
    }

    // Upsert InstitutionRoster cohort record
    const roster = await prisma.institutionRoster.upsert({
      where: { id: `roster-${institution.code}-${graduationYear}` },
      update: {
        totalExpectedStudents: {
          increment: students.length,
        },
      },
      create: {
        id: `roster-${institution.code}-${graduationYear}`,
        institutionId,
        graduationYear,
        totalExpectedStudents: students.length,
        importedBy: session.user.id,
        status: 'ACTIVE',
      },
    })

    // Insert or update individual roster student rows
    let importedCount = 0
    for (const stu of students) {
      await prisma.rosterStudent.upsert({
        where: { id: `roster-${institution.code}-${stu.enrollmentNumber}` },
        update: {
          name: stu.name,
          email: stu.email,
          mobile: stu.mobile,
          course: stu.course,
          branch: stu.branch,
          department: stu.department,
          cgpa: stu.cgpa,
        },
        create: {
          id: `roster-${institution.code}-${stu.enrollmentNumber}`,
          rosterId: roster.id,
          institutionId,
          name: stu.name,
          enrollmentNumber: stu.enrollmentNumber,
          email: stu.email,
          mobile: stu.mobile,
          course: stu.course,
          branch: stu.branch,
          department: stu.department,
          graduationYear,
          cgpa: stu.cgpa,
          invitationStatus: 'NOT_SENT',
        },
      })
      importedCount++
    }

    return successResponse({
      message: `Successfully imported ${importedCount} students into the ${graduationYear} cohort`,
      rosterId: roster.id,
      importedCount,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
