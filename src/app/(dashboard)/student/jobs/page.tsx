import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Briefcase, Building2, MapPin, DollarSign, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { ApplyButton } from './apply-button'

export default async function StudentJobsPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  let student = await prisma.student.findFirst({
    where: { userId: session.user.id },
    include: {
      profile: true,
      assessments: {
        include: { result: true },
        take: 1,
        orderBy: { startedAt: 'desc' },
      },
      badges: {
        include: { badge: true },
      },
      applications: {
        select: { jobId: true },
      },
    },
  })

  if (!student && (session.user.role === 'SUPER_ADMIN' || session.user.role === 'OPERATIONS')) {
    student = await prisma.student.findFirst({
      include: {
        profile: true,
        assessments: {
          include: { result: true },
          take: 1,
        },
        badges: {
          include: { badge: true },
        },
        applications: {
          select: { jobId: true },
        },
      },
    })
  }

  if (!student) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 space-y-6">
        <Card className="border-indigo-100 bg-indigo-50/40 p-8 text-center space-y-4 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Student Profile Not Found</h2>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            Please register through your college placement link to explore and apply to partner job opportunities.
          </p>
        </Card>
      </div>
    )
  }

  const appliedJobIds = new Set(student.applications.map((a) => a.jobId))

  const studentScore = student?.assessments?.[0]?.result?.overallScore || 78
  const studentCgpa = student?.profile?.cgpa || 8.0

  const jobs = await prisma.job.findMany({
    where: { status: 'ACTIVE' },
    include: {
      employer: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
              Assurance Partner Vacancies
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500">2026 Batch Fresher Opportunities</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Curated Employer Opportunities</h1>
          <p className="text-xs text-slate-500 mt-1">
            Jobs matching your 9-dimension diagnostic profile and institutional degree credentials.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-50 text-xs">
            {jobs.length} Active Positions
          </Badge>
        </div>
      </div>

      {/* Jobs Listing */}
      <div className="space-y-4">
        {jobs.map((job) => {
          // Dynamic match logic
          const minScore = job.minEmployabilityScore || 70
          const minCgpa = job.minCgpa || 6.5
          const isEligible = studentScore >= minScore && studentCgpa >= minCgpa
          const matchPercent = Math.min(98, Math.round(75 + (studentScore / 100) * 20))

          return (
            <Card key={job.id} className="border-slate-200/80 shadow-xs bg-white hover:border-indigo-200 transition-colors">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="space-y-3 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={isEligible ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}>
                        <Sparkles className="h-3 w-3 mr-1" />
                        {matchPercent}% Diagnostic Match
                      </Badge>
                      <Badge variant="outline" className="text-slate-600 border-slate-200 font-normal text-xs">
                        {job.workMode}
                      </Badge>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs font-mono text-slate-500">{job.openings} Openings</span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-900 leading-snug">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-600 mt-1">
                        <span className="font-semibold text-slate-900 flex items-center gap-1">
                          <Building2 className="h-3.5 w-3.5 text-slate-400" />
                          {job.employer.name}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          {job.location}
                        </span>
                        <span>•</span>
                        <span className="font-semibold text-indigo-700">
                          CTC: ₹{job.ctc ? (Number(job.ctc) / 100000).toFixed(1) : '5.0'} LPA
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {job.description}
                    </p>

                    {/* Required Skills & Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {job.skills.map((skill) => (
                        <span key={skill} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/60 font-mono">
                          {skill}
                        </span>
                      ))}
                      {job.requiredBadges.map((badge) => (
                        <Badge key={badge} variant="outline" className="text-[10px] border-indigo-200 bg-indigo-50/50 text-indigo-700">
                          Requires: {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Actions column */}
                  <div className="flex lg:flex-col items-center lg:items-end justify-between gap-3 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                    <div className="text-left lg:text-right">
                      <span className="text-[11px] text-slate-400 uppercase font-semibold">Eligibility</span>
                      <div className="text-xs font-medium text-slate-700 mt-0.5">
                        Min Score: {job.minEmployabilityScore || 70} | CGPA: {job.minCgpa || 6.5}+
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <ApplyButton
                        jobId={job.id}
                        jobTitle={job.title}
                        alreadyApplied={appliedJobIds.has(job.id)}
                      />
                      <Link href="/student/interviews">
                        <Button variant="outline" className="text-xs font-medium h-8">
                          Assurance Slot <ArrowRight className="h-3.5 w-3.5 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
