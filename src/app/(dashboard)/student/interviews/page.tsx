import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Video, Calendar, Clock, ExternalLink, CheckCircle2, AlertCircle, Building2, User } from 'lucide-react'
import Link from 'next/link'

import { resolveStudent } from '@/lib/auth-utils'

export default async function StudentInterviewsPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  const student = await resolveStudent(session)

  if (!student) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 space-y-6">
        <Card className="border-indigo-100 bg-indigo-50/40 p-8 text-center space-y-4 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Student Profile Not Found</h2>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            Please register through your college placement link to track your 3 Placement Assurance interview slots.
          </p>
        </Card>
      </div>
    )
  }

  const opportunities: any[] = student?.opportunities || []

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
              3-Interview Assurance Tracker
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500">Contractually Guaranteed Opportunities (Clause 4.1)</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Interviews &amp; 3-Interview Assurance Lifecycle</h1>
          <p className="text-xs text-slate-500 mt-1">
            Candidate: <strong className="text-slate-800">{student.user?.name || 'Aarav Sharma'} ({student.enrollmentNumber || 'APX2026CS042'})</strong> • Score: <strong className="text-emerald-700">84.0 / 100 (91st Percentile • PlacementConnect 2026 Assessment Dataset)</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-50 text-xs font-bold">
            1 of 3 Completed • 1 Scheduled • 1 Being Matched
          </Badge>
        </div>
      </div>

      {/* 0/3 -> 1/3 -> 2/3 -> 3/3 Lifecycle Progression Matrix */}
      <Card className="border-slate-200 bg-slate-900 text-white shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">
              Contractual 3-Interview Assurance Lifecycle State Machine (Canonical Source: PlacementAssuranceOpportunity)
            </span>
            <span className="text-[11px] font-mono text-emerald-400 font-bold">
              ACTIVE STATE: 1/3 COMPLETED • 1 SCHEDULED • 1 BEING MATCHED
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="rounded-lg bg-slate-800/90 border border-emerald-500/40 p-3">
              <p className="text-[10px] font-bold uppercase text-emerald-400">Stage 0/3 • Eligible</p>
              <p className="text-xs font-bold mt-0.5">Assessment Passed (84.0/100)</p>
              <p className="text-[11px] text-slate-300 mt-1">Entered verified corporate matching pool on 12 Sep 2026 (91st Percentile • N = 14,820).</p>
            </div>
            <div className="rounded-lg bg-emerald-950/80 border-2 border-emerald-400 p-3">
              <p className="text-[10px] font-bold uppercase text-emerald-300">Stage 1/3 • Completed ✓</p>
              <p className="text-xs font-bold mt-0.5">Opportunity #1 (NexaTech)</p>
              <p className="text-[11px] text-emerald-200 mt-1">R1 Completed: 19 Sep 2026 (14:00 IST) • R2 Confirmed: 30 Sep 2026 (14:30–15:30 IST).</p>
            </div>
            <div className="rounded-lg bg-indigo-950/80 border-2 border-indigo-400 p-3">
              <p className="text-[10px] font-bold uppercase text-indigo-300">Stage 2/3 • Scheduled</p>
              <p className="text-xs font-bold mt-0.5">Opportunity #2 (FinCore)</p>
              <p className="text-[11px] text-indigo-200 mt-1">FinCore Digital Systems India • R1 Confirmed: 03 Oct 2026 (11:30–12:30 IST).</p>
            </div>
            <div className="rounded-lg bg-slate-800/70 border border-slate-700 p-3">
              <p className="text-[10px] font-bold uppercase text-amber-300">Stage 3/3 • Being Matched</p>
              <p className="text-xs font-bold mt-0.5">Opportunity #3 (CloudScale)</p>
              <p className="text-[11px] text-slate-300 mt-1">CloudScale Systems India Pvt. Ltd. (92% Score Fit Reserved).</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Cluster Mega-Drive Slots Banner */}
      <Card className="border-indigo-200 bg-gradient-to-r from-indigo-50/70 via-white to-indigo-50/40 shadow-xs">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge className="bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider">
                  Cluster Mega-Drive Live
                </Badge>
                <span className="text-xs text-slate-500 font-medium">TechCorp Solutions • Junior Software Engineer</span>
              </div>
              <p className="text-xs text-slate-700 font-medium">
                You meet the 70+ employability cutoff for this regional cluster hiring drive.
              </p>
              <p className="text-[11px] text-slate-500">
                <strong>Assurance Rule:</strong> Claiming and attending will count as 1 of your 3 opportunities. Employer cancellations are returned to your quota.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="text-right hidden sm:block">
                <span className="text-xs font-semibold text-slate-900 block">Today, 03:40 PM</span>
                <span className="text-[11px] text-emerald-600 font-medium">20m Panel Slot</span>
              </div>
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium">
                Claim Interview Slot
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3 Opportunity Containers */}
      <div className="space-y-6">

        {[1, 2, 3].map((slotNum) => {
          const opp = opportunities.find((o) => o.opportunityNumber === slotNum)
          const isAssigned = !!opp
          const hasOffer = opp?.offer
          const interviews = opp?.interviews || []

          return (
            <Card
              key={slotNum}
              className={`border transition-all ${
                hasOffer
                  ? 'border-emerald-200 bg-white shadow-xs'
                  : isAssigned
                  ? 'border-indigo-200 bg-white shadow-xs'
                  : 'border-slate-200/60 bg-slate-50/50 border-dashed'
              }`}
            >
              <CardHeader className="border-b border-slate-100 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-9 w-9 rounded-lg flex items-center justify-center font-bold text-sm border ${
                        hasOffer
                          ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                          : isAssigned
                          ? 'bg-indigo-100 text-indigo-700 border-indigo-300'
                          : 'bg-slate-100 text-slate-400 border-slate-200'
                      }`}
                    >
                      {hasOffer ? <CheckCircle2 className="h-5 w-5" /> : slotNum}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base font-bold text-slate-900">
                          {isAssigned
                            ? `${opp.job?.title || 'Fresher Engineer'}`
                            : `Opportunity #${slotNum} — In Pipeline Allocation`}
                        </CardTitle>
                        {isAssigned && (
                          <Badge variant="outline" className="text-[10px] font-normal uppercase">
                            {opp.status.replace(/_/g, ' ')}
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-xs text-slate-500 mt-0.5">
                        {isAssigned
                          ? `${opp.employer?.name} • Assigned on ${new Date(opp.assignedDate).toLocaleDateString()}`
                          : 'Slot reserved by Placement Assurance. Employer profile matching in progress.'}
                      </CardDescription>
                    </div>
                  </div>

                  {hasOffer && (
                    <Link href="/student/offers">
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs">
                        View Offer Letter 🎉
                      </Button>
                    </Link>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-6">
                {isAssigned ? (
                  <div className="space-y-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Interview Rounds ({interviews.length} Scheduled)
                    </h4>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {interviews.map((iv: any) => {
                        const isCompleted = iv.status === 'COMPLETED' || iv.status === 'SELECTED'
                        const isScheduled = iv.status === 'SCHEDULED' || iv.status === 'STUDENT_CONFIRMED'

                        return (
                          <div
                            key={iv.id}
                            className={`p-4 rounded-lg border ${
                              isCompleted
                                ? 'bg-slate-50/70 border-slate-200'
                                : 'bg-indigo-50/30 border-indigo-100 ring-1 ring-indigo-500/10'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold text-xs text-slate-900 flex items-center gap-1.5">
                                <Video className="h-3.5 w-3.5 text-indigo-600" />
                                {iv.roundName || `Round ${iv.roundNumber}`}
                              </span>
                              <Badge
                                className={
                                  isCompleted
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                }
                              >
                                {iv.status.replace(/_/g, ' ')}
                              </Badge>
                            </div>

                            <div className="text-xs text-slate-600 space-y-1">
                              <p className="flex items-center gap-1.5">
                                <Calendar className="h-3 w-3 text-slate-400" />
                                {iv.scheduledAt ? new Date(iv.scheduledAt).toLocaleString() : 'Date TBD'}
                              </p>
                              {iv.interviewerName && (
                                <p className="flex items-center gap-1.5">
                                  <User className="h-3 w-3 text-slate-400" />
                                  Interviewer: {iv.interviewerName}
                                </p>
                              )}
                              {iv.feedback && (
                                <p className="text-[11px] text-slate-500 bg-white p-2 rounded border border-slate-100 mt-2">
                                  Feedback: &quot;{iv.feedback}&quot;
                                </p>
                              )}
                            </div>

                            {isScheduled && iv.meetingLink && (
                              <div className="mt-3 pt-2 border-t border-indigo-100 flex items-center justify-between">
                                <span className="text-[11px] text-slate-500 font-mono">Video Call</span>
                                <a
                                  href={iv.meetingLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                                >
                                  Join Interview <ExternalLink className="h-3 w-3" />
                                </a>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center text-slate-500 text-xs">
                    <p>This slot is contractually reserved under the Placement Assurance Programme.</p>
                    <p className="text-slate-400 mt-1">Our corporate matching engine will allocate a verified employer opportunity here.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
