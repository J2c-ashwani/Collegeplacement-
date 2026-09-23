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

  const studentName = session.user.name || 'Candidate'
  const programme = student?.programmes[0]
  const latestAssessment = student?.assessments[0]
  const assessmentResult = latestAssessment?.result
  const opportunities = student?.opportunities || []
  const badges = student?.badges || []

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 6-Element Page Header */}
      <PageHeader
        breadcrumb={[
          { label: 'Student Portal', href: '/student/dashboard' },
          { label: 'Career Launchpad' },
        ]}
        title={`Welcome back, ${studentName}`}
        description="Track your Placement Assurance journey, qualified interview opportunities, and industry readiness credentials."
        statusChips={[
          {
            label: 'Institution',
            value: student?.institution?.name || 'Apex Institute of Technology',
            variant: 'neutral',
          },
          {
            label: 'Programme Standard',
            value: 'Placement Assurance',
            variant: 'neutral',
          },
          {
            label: 'Assurance Status',
            value: `${opportunities.length} of 3 Fulfilled`,
            variant: opportunities.length > 0 ? 'success' : 'neutral',
          },
        ]}
        actions={
          <div className="flex items-center gap-2.5">
            <Link href="/student/assessment">
              <Button size="sm" className="bg-[#1E40AF] hover:bg-blue-800 text-white text-xs h-8 font-medium">
                <ClipboardCheck className="mr-1.5 h-3.5 w-3.5 text-blue-200" />
                {assessmentResult ? 'Diagnostic Scorecard' : 'Start Assessment'}
              </Button>
            </Link>
            <Link href="/student/jobs">
              <Button size="sm" variant="outline" className="text-xs h-8">
                Browse Campus Jobs
              </Button>
            </Link>
          </div>
        }
      />

      {/* KPI Cards Row */}
      <div className="grid gap-4 md:grid-cols-4">
        {/* Programme Card */}
        <Card className="border-slate-200 shadow-2xs rounded-md bg-white">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-mono">Programme Plan</span>
              <FileCheck2 className="h-4 w-4 text-[#1E40AF]" />
            </div>
            <CardTitle className="text-lg font-bold text-slate-900 mt-1">
              Placement Assurance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 text-xs">
                Active Enrolment
              </Badge>
              <span className="text-xs text-slate-500 font-mono">Up to 3 Interviews</span>
            </div>
          </CardContent>
        </Card>

        {/* Assessment Card */}
        <Card className="border-slate-200 shadow-2xs rounded-md bg-white">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-mono">Employability Score</span>
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
            </div>
            <CardTitle className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
              {assessmentResult ? `${Math.round(assessmentResult.overallScore)}/100` : 'Pending'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {assessmentResult ? (
                <>
                  <Badge className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50 text-xs">
                    Interview Ready
                  </Badge>
                  <span className="text-xs text-slate-500 font-mono">Benchmarked</span>
                </>
              ) : (
                <Link href="/student/assessment" className="text-xs text-[#1E40AF] hover:underline flex items-center font-medium">
                  Take test now <ArrowRight className="h-3 w-3 ml-1" />
                </Link>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Assurance Slots Card */}
        <Card className="border-slate-200 shadow-2xs rounded-md bg-white">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-mono">Assurance Status</span>
              <Briefcase className="h-4 w-4 text-blue-600" />
            </div>
            <CardTitle className="text-lg font-bold font-mono text-slate-900 mt-1 tabular-nums">
              {opportunities.length} of 3 Fulfilled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-slate-100 rounded-full h-2 mb-1.5 overflow-hidden">
              <div 
                className="bg-[#1E40AF] h-2 rounded-full transition-all" 
                style={{ width: `${Math.min(100, (opportunities.length / 3) * 100)}%` }} 
              />
            </div>
            <p className="text-[11px] text-slate-500">
              {3 - opportunities.length} qualified opportunities available
            </p>
          </CardContent>
        </Card>

        {/* Placement Status Card */}
        <Card className="border-slate-200 shadow-2xs rounded-md bg-white">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-mono">Placement Offer</span>
              <Trophy className="h-4 w-4 text-amber-600" />
            </div>
            <CardTitle className="text-lg font-bold text-slate-900 mt-1">
              {student?.status === 'PLACED' ? 'Offer Received' : 'In Selection Pipeline'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge className={student?.status === 'PLACED' ? "bg-emerald-50 text-emerald-700 border-emerald-200 text-xs" : "bg-amber-50 text-amber-700 border-amber-200 text-xs"}>
                {student?.status === 'PLACED' ? 'Offer Confirmed' : 'Active Pipeline'}
              </Badge>
              <span className="text-xs text-slate-500">{student?.institution?.name || 'Partner College'}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: 3-Assurance Tracker & Sidebar */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* 3 Guaranteed Opportunities Tracker (Left 2 Cols) */}
        <Card className="lg:col-span-2 border-slate-200 shadow-2xs rounded-md bg-white">
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">
                  Placement Assurance Tracker
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 mt-0.5">
                  Your programme includes up to 3 qualified interview opportunities, subject to programme terms.
                </CardDescription>
              </div>
              <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-800 text-xs font-medium font-mono">
                Assurance Target: 3
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {[1, 2, 3].map((slotNumber) => {
                const opp = opportunities.find(o => o.opportunityNumber === slotNumber)
                const isAssigned = !!opp
                const hasOffer = opp?.offer
                const latestRound = opp?.interviews?.[opp.interviews.length - 1]

                return (
                  <div key={slotNumber} className="relative flex items-start gap-4">
                    {/* Vertical Connector */}
                    {slotNumber < 3 && (
                      <div className="absolute left-4 top-10 bottom-[-24px] w-0.5 bg-slate-200 -z-10" />
                    )}

                    {/* Step Icon */}
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs border ${
                      hasOffer 
                        ? 'bg-emerald-100 text-emerald-700 border-emerald-300' 
                        : isAssigned 
                        ? 'bg-indigo-100 text-indigo-700 border-indigo-300' 
                        : 'bg-slate-100 text-slate-400 border-slate-200'
                    }`}>
                      {hasOffer ? <CheckCircle2 className="h-4 w-4" /> : slotNumber}
                    </div>

                    {/* Content Box */}
                    <div className={`flex-1 p-4 rounded-lg border transition-all ${
                      hasOffer 
                        ? 'bg-emerald-50/50 border-emerald-200' 
                        : isAssigned 
                        ? 'bg-white border-slate-200 shadow-xs' 
                        : 'bg-slate-50/50 border-slate-200/60 border-dashed'
                    }`}>
                      {isAssigned ? (
                        <div className="space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                                  Opportunity #{slotNumber}
                                </span>
                                <Badge variant="outline" className="text-[11px] font-normal py-0">
                                  {opp.status.replace(/_/g, ' ')}
                                </Badge>
                              </div>
                              <h3 className="font-semibold text-base text-slate-900 mt-0.5">
                                {opp.job?.title || 'Associate Software Engineer'}
                              </h3>
                              <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-0.5">
                                <Building2 className="h-3.5 w-3.5 text-slate-400" />
                                <span className="font-medium text-slate-800">{opp.employer?.name || 'Partner Employer'}</span>
                                <span>•</span>
                                <span>CTC: ₹{opp.job?.ctc ? (Number(opp.job.ctc) / 100000).toFixed(1) : '5.5'} LPA</span>
                              </p>
                            </div>

                            {hasOffer ? (
                              <Badge className="bg-emerald-600 text-white hover:bg-emerald-700">
                                Offer Extended
                              </Badge>
                            ) : (
                              <Link href="/student/interviews">
                                <Button size="sm" variant="outline" className="text-xs h-8">
                                  View Rounds ({opp.interviews.length})
                                </Button>
                              </Link>
                            )}
                          </div>

                          {/* Round progress */}
                          {latestRound && (
                            <div className="p-2.5 rounded-md bg-slate-50 border border-slate-200/80 text-xs flex items-center justify-between">
                              <div className="flex items-center gap-2 text-slate-700">
                                <Video className="h-4 w-4 text-indigo-600 shrink-0" />
                                <span>
                                  {latestRound.roundName || `Round ${latestRound.roundNumber}`} — <strong className="font-medium text-slate-900">{latestRound.status.replace(/_/g, ' ')}</strong>
                                </span>
                              </div>
                              {latestRound.meetingLink && (
                                <a 
                                  href={latestRound.meetingLink} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-indigo-600 hover:underline flex items-center gap-1 font-medium"
                                >
                                  Join Link <ExternalLink className="h-3 w-3" />
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center justify-between py-1 text-slate-500">
                          <div>
                            <h4 className="text-sm font-medium text-slate-700">
                              Opportunity #{slotNumber} — In Pipeline
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Reserved by Placement Assurance guarantee. Employer matching in progress.
                            </p>
                          </div>
                          <span className="text-xs font-mono text-slate-400">Slot Reserved</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Right Sidebar: Badges & Diagnostic Highlights */}
        <div className="space-y-6">
          {/* Verified Badges Card */}
          <Card className="border-slate-200/80 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold text-slate-900">
                  Earned Badges
                </CardTitle>
                <Link href="/student/badges" className="text-xs text-indigo-600 hover:underline font-medium">
                  View All
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              {badges.length > 0 ? (
                <div className="space-y-3">
                  {badges.map((b) => (
                    <div key={b.id} className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50/70 transition-colors">
                      <div className="h-9 w-9 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shrink-0">
                        <Trophy className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-semibold text-slate-900 truncate">
                          {b.badge.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate">
                          Verified • Score {b.score ? Math.round(b.score) : 80}+
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-slate-500">
                  <Trophy className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs">Complete your diagnostic assessment to unlock industry badges.</p>
                  <Link href="/student/assessment" className="mt-2 inline-block">
                    <Button size="sm" variant="outline" className="text-xs h-7">Start Test</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Guidance Box */}
          <Card className="border-indigo-100 bg-indigo-50/40 p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <h4 className="font-semibold text-indigo-950">Next Recommended Action</h4>
                <p className="text-indigo-800/80 leading-relaxed">
                  Review partner employer vacancies tailored to your employability profile. Keeping your profile updated boosts shortlist speed.
                </p>
                <div className="pt-2">
                  <Link href="/student/jobs">
                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-7">
                      Explore Matching Jobs
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
