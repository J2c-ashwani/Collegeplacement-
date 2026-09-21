import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import StudentRegisterForm from './student-register-form'
import { Card, CardContent } from '@/components/ui/card'
import { Building2, ShieldCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Student Institutional Registration — PlacementConnect',
  description: 'Register for the Placement Assurance Programme through your institution.',
}

export default async function InstitutionRegisterPage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params
  const normalizedCode = code.toUpperCase()

  const institution = await prisma.institution.findFirst({
    where: {
      registrationCode: normalizedCode,
    },
    include: {
      memberships: {
        where: {
          status: 'ACTIVE',
          endDate: { gte: new Date() },
        },
        include: { plan: true },
        take: 1,
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!institution) {
    notFound()
  }

  const activeMembership = institution.memberships[0]
  const isExpired = !activeMembership

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Institutional Partner Banner (Locked - cannot be changed) */}
        <Card className="border-indigo-100 bg-indigo-50/50 shadow-sm overflow-hidden">
          <div className="h-2 bg-indigo-600 w-full" />
          <CardContent className="pt-6 pb-5 flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 mb-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                Verified Institutional Placement Partnership
              </div>
              <h1 className="text-xl font-bold text-slate-900">{institution.name}</h1>
              <p className="text-xs text-slate-600 mt-1">
                {institution.city}, {institution.state} &bull; Registration Code: <strong className="text-indigo-700">{institution.registrationCode}</strong>
              </p>
            </div>
          </CardContent>
        </Card>

        {isExpired ? (
          <Card className="border-red-200 bg-red-50 text-red-800 p-6 rounded-xl">
            <h2 className="font-bold text-base mb-2">Registration Temporarily Paused</h2>
            <p className="text-sm">
              The placement partnership membership for {institution.name} is currently inactive or under renewal.
              New student enrolments are paused. Please reach out to your Training & Placement Officer (TPO) for assistance.
            </p>
          </Card>
        ) : (
          <StudentRegisterForm
            institutionId={institution.id}
            institutionName={institution.name}
            departments={institution.departments}
            batches={institution.graduationBatches}
            planName={activeMembership.plan.name}
          />
        )}
      </div>
    </div>
  )
}
