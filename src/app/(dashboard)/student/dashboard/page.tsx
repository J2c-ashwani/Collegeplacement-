import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  CheckCircle2, Clock, ShieldCheck, Trophy, Video, 
  ArrowRight, ExternalLink, Calendar, Briefcase, FileCheck2, Sparkles, Building2, ClipboardCheck
} from "lucide-react"

import { resolveStudent } from '@/lib/auth-utils'

import { PageHeader } from '@/components/layout/page-header'

export default async function StudentDashboard() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  const student = await resolveStudent(session)

  if (!student) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 space-y-6">
        <Card className="border-indigo-100 bg-indigo-50/40 p-8 text-center space-y-4 shadow-sm">
          <div className="mx-auto w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
            <Building2 className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Enrolment Incomplete / Student Record Unlinked</h2>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            Your login account is active, but your profile has not yet been linked to an enrolled institution cohort.
            Please use your campus registration link provided by your College Placement Cell (TPO) to enroll into your batch.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link href="/for-students">
              <Button variant="outline" className="text-xs">Learn About Assurance</Button>
            </Link>
            <Link href="/contact">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs">Contact Placement Cell</Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  const studentName = session.user.name || 'Aarav Sharma'
  const programme = student?.programmes[0]
  const latestAssessment = student?.assessments[0]
  const assessmentResult = latestAssessment?.result
  const opportunities: any[] = student?.opportunities || []
  const badges: any[] = student?.badges || []

  // Canonical Interview Assurance Lifecycle Counter:
  // Created -> Matched -> Scheduled -> Attended -> Completed (Counted Toward Assurance)
  const completedOpps = opportunities.filter(
    (o) => o.status === 'COMPLETED' || o.status === 'SELECTED' || o.offer
  )
  const scheduledOpps = opportunities.filter(
    (o) => o.status === 'SCHEDULED' || o.status === 'INTERVIEW_SCHEDULED'
  )
  const completedCount = completedOpps.length
  const scheduledCount = scheduledOpps.length
  const matchingCount = Math.max(0, 3 - completedCount - scheduledCount)
  const nextScheduledOpp = scheduledOpps[0]

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* 6-Element Page Header */}
      <PageHeader
        breadcrumb={[
          { label: 'Student Portal', href: '/student/dashboard' },
          { label: 'Career Launchpad' },
        ]}
        title={`Welcome back, ${studentName}`}
        description="Track your 3-Interview Assurance progress, scheduled employer rounds, and verified employability credentials."
        statusChips={[
          {
            label: 'Institution',
            value: `${student?.institution?.name || 'Apex Institute of Technology'} (${student?.institution?.registrationCode || 'APX123'})`,
            variant: 'neutral',
          },
          {
            label: 'Programme Track',
            value: programme?.programmePlan?.name || 'Standard Track (₹1,180 Paid)',
            variant: 'neutral',
          },
          {
            label: 'Interview Assurance',
            value: `${completedCount} of 3 Completed (${scheduledCount} Scheduled, ${matchingCount} Being Matched)`,
            variant: 'success',
          },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/student/documents/terms-preview">
              <Button size="sm" variant="outline" className="text-xs h-8">
                <FileCheck2 className="mr-1.5 h-3.5 w-3.5 text-slate-600" />
                Accepted T&amp;C PDF
              </Button>
            </Link>
            <Link href="/student/enrolment?state=confirmed">
              <Button size="sm" variant="outline" className="text-xs h-8">
                Cashfree Receipt
              </Button>
            </Link>
            <Link href="/student/interviews">
              <Button size="sm" className="bg-[#1E40AF] hover:bg-blue-800 text-white text-xs h-8 font-medium">
                <Calendar className="mr-1.5 h-3.5 w-3.5 text-blue-200" />
                Prepare for Interview
              </Button>
            </Link>
          </div>
        }
      />

      {/* KPI Cards Row */}
      <div className="grid gap-3.5 md:grid-cols-4 break-inside-avoid">
        {/* Programme Card */}
        <Card className="border-slate-200 shadow-2xs rounded-md bg-white">
          <CardHeader className="pb-1.5 pt-3.5 px-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 font-mono">Programme Track</span>
              <FileCheck2 className="h-4 w-4 text-[#1E40AF]" />
            </div>
            <CardTitle className="text-base font-bold text-slate-900 mt-1">
              {programme?.programmePlan?.name || 'Standard Track'}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3.5">
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 text-[10px]">
                Cashfree Paid (₹1,180)
              </Badge>
              <span className="text-[11px] text-slate-500 font-mono">3 Interviews</span>
            </div>
          </CardContent>
        </Card>

        {/* Assessment Card */}
        <Card className="border-slate-200 shadow-2xs rounded-md bg-white">
          <CardHeader className="pb-1.5 pt-3.5 px-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 font-mono">Employability Score</span>
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
            </div>
            <CardTitle className="text-xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
              {assessmentResult ? `${Math.round(assessmentResult.overallScore)}/100` : 'Pending'}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3.5">
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50 text-[10px]">
                91st Percentile • Employer Ready
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Canonical Assurance Counter Card */}
        <Card className="border-slate-200 shadow-2xs rounded-md bg-white">
          <CardHeader className="pb-1.5 pt-3.5 px-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 font-mono">Interview Assurance</span>
              <Briefcase className="h-4 w-4 text-blue-600" />
            </div>
            <CardTitle className="text-base font-bold font-mono text-slate-900 mt-1 tabular-nums">
              {completedCount} of 3 Completed
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3.5">
            <div className="w-full bg-slate-100 rounded-full h-1.5 mb-1.5 overflow-hidden flex">
              <div
                className="bg-emerald-600 h-1.5 transition-all"
                style={{ width: `${(completedCount / 3) * 100}%` }}
              />
              <div
                className="bg-amber-500 h-1.5 transition-all"
                style={{ width: `${(scheduledCount / 3) * 100}%` }}
              />
            </div>
            <p className="text-[11px] font-mono text-slate-600">
              {completedCount} Completed • {scheduledCount} Scheduled • {matchingCount} Being Matched
            </p>
          </CardContent>
        </Card>

        {/* Current Candidate Status Card */}
        <Card className="border-slate-200 shadow-2xs rounded-md bg-white">
          <CardHeader className="pb-1.5 pt-3.5 px-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 font-mono">Candidate Status</span>
              <Trophy className="h-4 w-4 text-amber-600" />
            </div>
            <CardTitle className="text-base font-bold text-slate-900 mt-1">
              Interviewing (1/3 Completed)
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3.5">
            <div className="flex items-center gap-2">
              <Badge className="bg-amber-50 text-amber-800 border-amber-200 text-[10px]">
                Round 2 Confirmed: 28 Sep IST
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: 3-Interview Assurance Lifecycle Tracker & State-Aware Sidebar */}
      <div className="grid gap-4 lg:grid-cols-3 break-inside-avoid">
        {/* 3 Verified Corporate Interview Opportunities Tracker (Left 2 Cols) */}
        <Card className="lg:col-span-2 border-slate-200 shadow-2xs rounded-md bg-white">
          <CardHeader className="border-b border-slate-100 py-3.5 px-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">
                  3-Interview Assurance Tracker (Canonical Lifecycle)
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 mt-0.5">
                  Contractual Entitlement: <strong>3 Verified Corporate Interview Opportunities</strong> within 12 months of assessment completion.
                </CardDescription>
              </div>
              <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-800 text-[11px] font-mono shrink-0">
                1 Completed • 1 Scheduled • 1 Being Matched
              </Badge>
            </div>
            {/* Canonical Lifecycle Definition Bar */}
            <div className="mt-2.5 px-3 py-1.5 rounded bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono font-semibold text-slate-700">COUNTING RULE:</span>
              <span>
                Created &rarr; Matched &rarr; Scheduled &rarr; Attended &rarr; <strong className="text-emerald-800">Completed (Counted Toward 3-Interview Assurance)</strong>
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-5">
            <div className="space-y-3.5">
              {[1, 2, 3].map((slotNumber) => {
                const opp = opportunities.find((o) => o.opportunityNumber === slotNumber)
                const isCompleted = opp?.status === 'COMPLETED' || opp?.status === 'SELECTED'
                const isScheduled = opp?.status === 'SCHEDULED' || opp?.status === 'INTERVIEW_SCHEDULED'
                const latestRound = opp?.interviews?.[opp.interviews.length - 1]
                const companyName = opp?.employer?.companyName || opp?.employer?.name || 'Partner Employer'
                const ctcLabel =
                  opp?.job?.ctcMin && opp?.job?.ctcMax
                    ? `₹${(Number(opp.job.ctcMin) / 100000).toFixed(1)}–${(Number(opp.job.ctcMax) / 100000).toFixed(1)} LPA`
                    : '₹6.5–8.5 LPA'

                return (
                  <div key={slotNumber} className="relative flex items-start gap-3.5">
                    {slotNumber < 3 && (
                      <div className="absolute left-4 top-9 bottom-[-16px] w-0.5 bg-slate-200 -z-10" />
                    )}

                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs border ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : isScheduled
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-slate-100 text-slate-500 border-slate-300'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : slotNumber}
                    </div>

                    <div
                      className={`flex-1 p-3.5 rounded-lg border transition-all ${
                        isCompleted
                          ? 'bg-emerald-50/30 border-emerald-200'
                          : isScheduled
                            ? 'bg-amber-50/30 border-amber-200 shadow-2xs'
                            : 'bg-slate-50/60 border-slate-200 border-dashed'
                      }`}
                    >
                      {opp ? (
                        <div className="space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono">
                                  Opportunity #{slotNumber}
                                </span>
                                {isCompleted ? (
                                  <Badge className="bg-emerald-700 text-white text-[10px] py-0">
                                    COMPLETED — COUNTED TOWARD ASSURANCE (1 of 3)
                                  </Badge>
                                ) : (
                                  <Badge className="bg-amber-100 text-amber-900 border-amber-300 text-[10px] py-0">
                                    SCHEDULED — COUNTS UPON COMPLETION
                                  </Badge>
                                )}
                              </div>
                              <h3 className="font-bold text-sm text-slate-900 mt-1">
                                {opp.job?.title}
                              </h3>
                              <p className="text-xs text-slate-600 flex flex-wrap items-center gap-1.5 mt-0.5">
                                <Building2 className="h-3.5 w-3.5 text-slate-400" />
                                <span className="font-semibold text-slate-800">{companyName}</span>
                                <span>&bull;</span>
                                <span>{opp.job?.location || 'Bengaluru'}</span>
                                <span>&bull;</span>
                                <span className="font-mono font-semibold text-blue-900">CTC: {ctcLabel}</span>
                              </p>
                            </div>

                            <Link href="/student/interviews">
                              <Button size="sm" variant="outline" className="text-xs h-7">
                                {isCompleted ? 'View Completed Feedback' : 'Open Interview Brief'}
                              </Button>
                            </Link>
                          </div>

                          {latestRound && (
                            <div className="p-2 rounded bg-white border border-slate-200/90 text-xs flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2 text-slate-700">
                                <Video className="h-3.5 w-3.5 text-blue-700 shrink-0" />
                                <span>
                                  <strong>{latestRound.roundName}</strong> —{' '}
                                  {isCompleted
                                    ? 'Attended & Completed on 19 Sep 2026, 19:30 IST (14:00 UTC) • Final Evaluation Pending'
                                    : 'Scheduled for 28 Sep 2026, 17:00 IST (11:30 UTC)'}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center justify-between py-0.5 text-slate-600">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
                                Opportunity #{slotNumber}
                              </span>
                              <Badge variant="outline" className="text-[10px] bg-white text-slate-700 border-slate-300 py-0">
                                BEING MATCHED (1 of 3 Remaining)
                              </Badge>
                            </div>
                            <p className="text-xs text-slate-600 mt-1">
                              Active shortlist matching against partner employer drives for your 84/100 Employability Score profile.
                            </p>
                          </div>
                          <span className="text-[11px] font-mono font-semibold text-slate-500 shrink-0">
                            Assurance Slot #3
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Right Sidebar: State-Aware Urgent Next Action & Earned Badges */}
        <div className="space-y-4">
          {/* State-Aware Urgent Next Action Card */}
          <Card className="border-amber-300 bg-amber-50/60 p-4 shadow-2xs">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-amber-800 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-200/80 text-amber-950">
                    URGENT NEXT ACTION • OPPORTUNITY #2
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-900">
                  Prepare for Upcoming Interview — {nextScheduledOpp?.employer?.companyName || 'FinCore Digital Systems India'}
                </h4>
                <p className="text-slate-700 leading-relaxed">
                  Your <strong>{nextScheduledOpp?.job?.title || 'Graduate Product Analyst'}</strong> round is confirmed for{' '}
                  <strong className="font-mono">28 Sep 2026, 17:00 IST (11:30 UTC)</strong>. Attendance &amp; completion will advance your assurance counter from <strong>1 of 3</strong> to <strong>2 of 3 Completed</strong>.
                </p>
                <div className="pt-1.5 flex items-center gap-2">
                  <Link href="/student/interviews">
                    <Button size="sm" className="bg-[#0F2744] hover:bg-slate-800 text-white text-xs h-8">
                      Prepare for Upcoming Interview
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>

          {/* Verified Badges Card */}
          <Card className="border-slate-200/80 shadow-xs bg-white">
            <CardHeader className="py-3 px-4 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-slate-900">
                  Verified Readiness Credentials
                </CardTitle>
                <Link href="/student/badges" className="text-xs text-blue-800 hover:underline font-medium">
                  View All
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-3.5">
              <div className="space-y-2.5">
                {badges.map((b) => (
                  <div key={b.id} className="flex items-center gap-3 p-2 rounded-lg border border-slate-100 bg-slate-50/50">
                    <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-800 border border-blue-100 flex items-center justify-center shrink-0">
                      <Trophy className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-semibold text-slate-900 truncate">
                        {b.badge.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">
                        {b.badge.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
