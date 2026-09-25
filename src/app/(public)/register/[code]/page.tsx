import { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import StudentRegisterForm from './student-register-form'
import { Card, CardContent } from '@/components/ui/card'
import {
  Building2,
  ShieldCheck,
  ArrowLeft,
  AlertTriangle,
  Clock,
  FlaskConical,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Verified Student Registration — PlacementConnect',
  description: 'Complete your institution-verified student registration on PlacementConnect.',
}

export default async function InstitutionRegisterPage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params
  const normalizedCode = code.trim().toUpperCase()
  const isDemoSandbox = normalizedCode === 'APX123'
  const isSimulatedExpired = normalizedCode === 'EXP2025'

  const institution = isSimulatedExpired
    ? null
    : await prisma.institution.findFirst({
        where: {
          OR: [
            { registrationCode: { equals: normalizedCode, mode: 'insensitive' } },
            { code: { equals: normalizedCode, mode: 'insensitive' } },
          ],
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

  const activeMembership = institution?.memberships?.[0]
  const isExpired = isSimulatedExpired || (institution && !activeMembership)

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Top Back & Sign-In Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 font-semibold text-slate-700 hover:text-[#1E40AF] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Role Selection / Change Campus Code
          </Link>
          <div className="text-slate-600">
            Already registered?{' '}
            <Link href="/login" className="font-semibold text-[#1E40AF] hover:underline">
              Sign in to your workspace &rarr;
            </Link>
          </div>
        </div>

        {/* Demo Only Safeguard Banner when viewing APX123 */}
        {isDemoSandbox && (
          <div className="rounded-md bg-amber-50 border border-amber-300 p-4 text-xs text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <FlaskConical className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold uppercase tracking-wide text-amber-900 block">
                  Demo Only — Sample Campus Code (APX123)
                </span>
                <span className="text-amber-800">
                  You are previewing the sample sandbox cohort for{' '}
                  <strong>Apex Institute of Technology</strong>. Real graduating students must return to{' '}
                  <Link href="/register" className="underline font-semibold">
                    /register
                  </Link>{' '}
                  and enter the official campus code issued by their own college&apos;s Training &amp; Placement Office.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* State 1: Invalid Campus Code */}
        {!institution && !isSimulatedExpired ? (
          <Card className="border-rose-200 bg-white shadow-xs overflow-hidden">
            <div className="h-1.5 bg-rose-600 w-full" />
            <CardContent className="p-6 sm:p-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
                <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
                Invalid Campus Code
              </div>
              <h1 className="text-xl font-bold text-slate-900">
                No Active Institution Matches Code &ldquo;{normalizedCode}&rdquo;
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We could not find an approved institutional placement roster matching{' '}
                <code className="font-mono font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">
                  {normalizedCode}
                </code>
                . Please verify the 6-character code shared by your Training &amp; Placement Office.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center h-10 px-5 rounded-md bg-[#1E40AF] hover:bg-blue-900 text-white text-xs font-semibold transition-colors"
                >
                  <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                  Try Another Campus Code
                </Link>
                <Link
                  href="/register/APX123"
                  className="inline-flex items-center justify-center h-10 px-4 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
                >
                  Preview Demo Cohort (APX123)
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : isExpired ? (
          /* State 2: Expired / Inactive Campus Code */
          <Card className="border-amber-200 bg-white shadow-xs overflow-hidden">
            <div className="h-1.5 bg-amber-500 w-full" />
            <CardContent className="p-6 sm:p-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200">
                <Clock className="h-3.5 w-3.5 text-amber-700" />
                Expired or Paused Campus Code
              </div>
              <h1 className="text-xl font-bold text-slate-900">
                Student Registration is Closed for Code &ldquo;{normalizedCode}&rdquo;
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {isSimulatedExpired
                  ? 'The campus code EXP2025 belongs to a concluded academic cohort (2024–25) and is no longer accepting new student registrations.'
                  : `The institutional placement partnership for ${institution?.name} is currently awaiting renewal or temporarily paused.`}
                {' '}Please contact your college&apos;s Training &amp; Placement Officer (TPO) for the current academic year&apos;s active campus code.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center h-10 px-5 rounded-md bg-[#1E40AF] hover:bg-blue-900 text-white text-xs font-semibold transition-colors"
                >
                  <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                  Enter Current Campus Code
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center h-10 px-4 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
                >
                  Already Registered? Sign In &rarr;
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* State 3: Valid Active Institution */
          <>
            <Card className="border-blue-200 bg-white shadow-xs overflow-hidden">
              <div className="h-1.5 bg-[#1E40AF] w-full" />
              <CardContent className="pt-5 pb-5 flex items-start gap-4">
                <div className="h-11 w-11 rounded-lg bg-[#0F172A] text-white flex items-center justify-center shrink-0">
                  <Building2 className="h-5 w-5 text-blue-400" />
                </div>
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                    <ShieldCheck className="h-3.5 w-3.5 text-blue-700" />
                    Verified Institutional Roster
                  </div>
                  <h1 className="text-lg sm:text-xl font-bold text-slate-900">
                    {institution!.name}
                  </h1>
                  <p className="text-xs text-slate-600">
                    {institution!.city}, {institution!.state} &bull; Official Campus Code:{' '}
                    <strong className="font-mono text-[#1E40AF]">
                      {institution!.registrationCode || institution!.code}
                    </strong>
                  </p>
                </div>
              </CardContent>
            </Card>

            <StudentRegisterForm
              institutionId={institution!.id}
              institutionName={institution!.name}
              departments={
                institution!.departments?.length
                  ? institution!.departments
                  : ['Computer Science & Engineering', 'Information Technology', 'Electronics & Communication']
              }
              batches={
                institution!.graduationBatches?.length
                  ? institution!.graduationBatches
                  : ['2026', '2027']
              }
              planName={activeMembership?.plan?.name || 'Annual Institutional Partnership'}
            />
          </>
        )}
      </div>
    </div>
  )
}
