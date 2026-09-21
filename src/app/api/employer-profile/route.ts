import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireApiAuth, resolveEmployerId } from '@/lib/auth-utils'
import { successResponse, validationError, handleApiError, notFoundError } from '@/lib/errors'
import { createAuditLog, AuditActions } from '@/services/audit.service'
import { z } from 'zod'

const updateEmployerProfileSchema = z.object({
  name: z.string().min(2).optional(),
  industry: z.string().optional(),
  gstNumber: z.string().optional(),
  website: z.string().url().or(z.literal('')).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  description: z.string().optional(),
  contactName: z.string().optional(),
  contactDesignation: z.string().optional(),
})

export async function GET(req: NextRequest) {
  try {
    const session = await requireApiAuth(['EMPLOYER', 'SUPER_ADMIN', 'OPERATIONS'])
    const employerId = await resolveEmployerId(session)

    if (!employerId) {
      return notFoundError('No employer profile linked to this account')
    }

    const employer = await prisma.employer.findUnique({
      where: { id: employerId },
      include: {
        users: {
          include: { user: true },
          take: 5,
        },
      },
    })

    if (!employer) {
      return notFoundError('Employer not found')
    }

    const primaryUser = employer.users.find((u) => u.isPrimary) || employer.users[0]

    return successResponse({
      id: employer.id,
      name: employer.name,
      industry: employer.industry || '',
      gstNumber: employer.gstNumber || '',
      website: employer.website || '',
      address: employer.address || '',
      city: employer.city || '',
      state: employer.state || '',
      description: employer.description || '',
      status: employer.status,
      contactName: primaryUser?.user?.name || session.user.name || '',
      contactDesignation: primaryUser?.designation || 'Talent Acquisition Director',
    })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await requireApiAuth(['EMPLOYER', 'SUPER_ADMIN', 'OPERATIONS'])
    let employerId = await resolveEmployerId(session)

    const body = await req.json()
    const parsed = updateEmployerProfileSchema.safeParse(body)
    if (!parsed.success) {
      return validationError('Invalid employer profile payload', parsed.error.format() as any)
    }

    const data = parsed.data

    // If recruiter has no employer yet, create one and link
    if (!employerId) {
      const newEmployer = await prisma.employer.create({
        data: {
          name: data.name || 'Company Name',
          industry: data.industry,
          gstNumber: data.gstNumber,
          website: data.website || null,
          address: data.address,
          city: data.city,
          state: data.state,
          description: data.description,
          status: 'APPROVED',
        },
      })

      await prisma.employerUser.create({
        data: {
          userId: session.user.id,
          employerId: newEmployer.id,
          designation: data.contactDesignation || 'Recruiter Coordinator',
          isPrimary: true,
        },
      })

      employerId = newEmployer.id
    } else {
      await prisma.employer.update({
        where: { id: employerId },
        data: {
          ...(data.name ? { name: data.name } : {}),
          ...(data.industry !== undefined ? { industry: data.industry } : {}),
          ...(data.gstNumber !== undefined ? { gstNumber: data.gstNumber } : {}),
          ...(data.website !== undefined ? { website: data.website || null } : {}),
          ...(data.address !== undefined ? { address: data.address } : {}),
          ...(data.city !== undefined ? { city: data.city } : {}),
          ...(data.state !== undefined ? { state: data.state } : {}),
          ...(data.description !== undefined ? { description: data.description } : {}),
        },
      })

      if (data.contactDesignation) {
        const empUser = await prisma.employerUser.findFirst({
          where: { userId: session.user.id, employerId },
        })
        if (empUser) {
          await prisma.employerUser.update({
            where: { id: empUser.id },
            data: { designation: data.contactDesignation },
          })
        }
      }
    }

    await createAuditLog({
      userId: session.user.id,
      userRole: session.user.role,
      action: AuditActions.EMPLOYER_UPDATED,
      entity: 'Employer',
      entityId: employerId,
      newValue: data,
    })

    return successResponse({ employerId, message: 'Employer profile updated successfully' })
  } catch (error) {
    return handleApiError(error)
  }
}
