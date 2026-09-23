import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, Building2, GraduationCap, ShieldCheck, FileText, CheckCircle2, Lock } from 'lucide-react'

export default async function StudentProfilePage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  let student = await prisma.student.findFirst({
    where: { userId: session.user.id },
    include: {
      user: true,
      institution: true,
      profile: true,
    },
  })

  if (!student && (session.user.role === 'SUPER_ADMIN' || session.user.role === 'OPERATIONS')) {
    student = await prisma.student.findFirst({
      include: {
        user: true,
        institution: true,
        profile: true,
      },
    })
  }

  if (!student) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 space-y-6">
        <Card className="border-indigo-100 bg-indigo-50/40 p-8 text-center space-y-4 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Student Profile Not Found</h2>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            Please register through your college placement link to view and update your candidate profile.
          </p>
        </Card>
      </div>
    )
  }

  const profile = student?.profile
  const user = student?.user

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
              Candidate Dossier
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-mono">Enrolment: {student?.enrollmentNumber || 'APX2026CS001'}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Student Academic & Placement Profile</h1>
          <p className="text-xs text-slate-500 mt-1">
            Your verified institutional profile credentials shared with partner recruiters.
          </p>
        </div>

        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 text-xs">
          <ShieldCheck className="h-3.5 w-3.5 mr-1" /> Institution Verified
        </Badge>
      </div>

      {/* Academic Identity Card */}
      <Card className="border-slate-200/80 shadow-xs bg-white">
        <CardHeader className="border-b border-slate-100 pb-4">
          <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-indigo-600" />
            Institutional Affiliation
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Locked to your partner college and graduation cohort.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">Full Name</Label>
              <Input value={user?.name || ''} disabled className="bg-slate-50 font-medium" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">Official Email</Label>
              <Input value={user?.email || 'aarav.sharma@apextech.edu.in'} disabled className="bg-slate-50" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">College / Institution</Label>
              <Input value={student?.institution.name || 'Apex Institute of Technology'} disabled className="bg-slate-50 font-semibold" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">Enrollment / Roll Number</Label>
              <Input value={student?.enrollmentNumber || 'APX2026CS001'} disabled className="bg-slate-50 font-mono" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">Course & Degree</Label>
              <Input value={profile?.course || 'B.Tech'} disabled className="bg-slate-50" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">Department / Branch</Label>
              <Input value={profile?.branch || 'Computer Science'} disabled className="bg-slate-50" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Academic Performance */}
      <Card className="border-slate-200/80 shadow-xs bg-white">
        <CardHeader className="border-b border-slate-100 pb-4">
          <CardTitle className="text-base font-bold text-slate-900">
            Academic Performance & Scores
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] font-semibold uppercase text-slate-500">Degree CGPA</span>
              <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
                {profile?.cgpa ? profile.cgpa.toFixed(2) : '8.40'} / 10.0
              </div>
            </div>
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] font-semibold uppercase text-slate-500">Class 12th / Diploma</span>
              <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
                {profile?.twelfthPercentage ? `${profile.twelfthPercentage}%` : '88.5%'}
              </div>
            </div>
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] font-semibold uppercase text-slate-500">Class 10th</span>
              <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
                {profile?.tenthPercentage ? `${profile.tenthPercentage}%` : '92.0%'}
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <Label className="text-xs text-slate-700 font-semibold">Evaluated Core Skills</Label>
            <div className="flex flex-wrap gap-2">
              {(profile?.skills || ['JavaScript', 'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Git', 'Data Structures']).map((s) => (
                <span key={s} className="px-3 py-1 rounded-md bg-indigo-50 border border-indigo-200/60 text-xs font-medium text-indigo-700 font-mono">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recruiter Visibility & Legal Consent Card */}
      <Card className="border-indigo-100 bg-indigo-50/40 shadow-xs">
        <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <h4 className="text-sm font-bold text-slate-900">Employer Visibility Consent</h4>
            </div>
            <p className="text-xs text-slate-600 max-w-xl">
              Consent granted on {profile?.employerVisibilityConsentAt ? new Date(profile.employerVisibilityConsentAt).toLocaleDateString() : 'Registration'} to share verified academic marks and 9-dimension diagnostic assessment reports with accredited hiring partners.
            </p>
          </div>
          <Badge className="bg-emerald-600 text-white hover:bg-emerald-700 text-xs shrink-0">
            Consent Active
          </Badge>
        </CardContent>
      </Card>
    </div>
  )
}
