import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { EmployerProfileForm } from './employer-profile-form'
import { Building2 } from 'lucide-react'

import { prisma } from '@/lib/prisma'
import { resolveEmployerId } from '@/lib/auth-utils'

export default async function EmployerProfilePage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  const employerId = await resolveEmployerId(session)
  let initialProfile = null

  if (employerId) {
    const employer = await prisma.employer.findUnique({
      where: { id: employerId },
      include: {
        users: {
          include: { user: true },
          take: 5,
        },
      },
    })
    if (employer) {
      const primaryUser = employer.users.find((u) => u.isPrimary) || employer.users[0]
      initialProfile = {
        name: employer.name,
        industry: employer.industry || '',
        gstNumber: employer.gstNumber || '',
        website: employer.website || '',
        address: employer.address || '',
        city: employer.city || '',
        state: employer.state || '',
        contactName: primaryUser?.user?.name || session.user.name || '',
        contactDesignation: primaryUser?.designation || 'Talent Acquisition Director',
        status: employer.status,
      }
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
              Corporate Settings
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500">Recruiter Organization Studio</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Company Profile & Recruiter Team</h1>
          <p className="text-xs text-slate-500 mt-1">
            Maintain your official corporate identity, GST tax details, and primary campus recruitment coordinators.
          </p>
        </div>

        <Badge className="bg-sky-50 text-sky-700 border-sky-200 text-xs">
          {initialProfile ? 'Active Recruiter Account' : 'New Recruiter Onboarding'}
        </Badge>
      </div>

      <EmployerProfileForm initialProfile={initialProfile} />
    </div>
  )
}
