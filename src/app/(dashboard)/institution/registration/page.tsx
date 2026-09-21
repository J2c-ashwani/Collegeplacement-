import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { QrCodeStudio } from './qr-code-studio'

export default async function InstitutionRegistrationPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  let institutionId = session.user.institutionId
  if (!institutionId && (session.user.role === 'SUPER_ADMIN' || session.user.role === 'OPERATIONS')) {
    const firstInst = await prisma.institution.findFirst()
    institutionId = firstInst?.id || null
  }

  if (!institutionId) {
    redirect('/login')
  }

  const institution = await prisma.institution.findUnique({
    where: { id: institutionId },
    include: {
      memberships: {
        where: { status: 'ACTIVE' },
        take: 1,
      },
      rosters: {
        where: { status: 'ACTIVE' },
        take: 1,
      },
      _count: {
        select: { students: true },
      },
    },
  })

  if (!institution) {
    redirect('/login')
  }

  const registeredCount = institution._count.students
  const totalExpected = institution.rosters[0]?.totalExpectedStudents || institution.estimatedStudentCount || 600
  const unregisteredGap = Math.max(totalExpected - registeredCount, 0)

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
              Institutional Onboarding Hub
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-mono">Code: {institution.registrationCode}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Student Registration Link & QR Studio</h1>
          <p className="text-xs text-slate-500 mt-1">
            Distribute your institution-specific enrolment portal link to your graduating batch.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 text-xs">
            Portal Active
          </Badge>
        </div>
      </div>

      <QrCodeStudio 
        institutionId={institution.id}
        institutionName={institution.name}
        registrationCode={institution.registrationCode}
        registeredCount={registeredCount}
        totalExpected={totalExpected}
        unregisteredGap={unregisteredGap}
      />
    </div>
  )
}
