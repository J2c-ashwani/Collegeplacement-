import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { resolveStudent } from '@/lib/auth-utils'
import { formatDate, formatDateTime } from '@/lib/date-format'
import {
  Calendar,
  Clock,
  Video,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  ShieldCheck,
  Award,
} from 'lucide-react'

export default async function StudentInterviewsPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  const student = await resolveStudent(session.user.id)
  if (!student) {
    redirect('/student/enrolment')
  }

  const opportunities = student.opportunities || []

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 text-[11px]">
              Guaranteed Opportunities Console
            </Badge>
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-mono">
              3-Interview Placement Assurance Active
            </Badge>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Interview Rounds &amp; Placement Assurance Tracking
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Track your 3 contractual placement opportunities, interview schedules, panel assessments, and offers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-50 text-xs font-bold">
            1 Active In Progress • 1 Scheduled • 1 In Matching Pipeline
          </Badge>
        </div>
      </div>

      {/* 0/3 -> 1/3 -> 2/3 -> 3/3 Lifecycle Progression Matrix */}
      <Card className="border-slate-200 bg-slate-900 text-white shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">
              Contractual 3-Interview Assurance Lifecycle (Model A: Employer Opportunity Unit)
            </span>
            <span className="text-[11px] font-mono text-emerald-400 font-bold">
              ACTIVE STATE: 1 ACTIVE IN PROGRESS • 1 SCHEDULED • 1 IN MATCHING PIPELINE
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="rounded-lg bg-slate-800/90 border border-emerald-500/40 p-3">
              <p className="text-[10px] font-bold uppercase text-emerald-400">Stage 0/3 • Assurance Eligible</p>
              <p className="text-xs font-bold mt-0.5">Diagnostic Score: 84.0/100</p>
              <p className="text-[11px] text-slate-300 mt-1">Entered verified corporate matching pool on 12 Sep 2026 (91st Percentile • N = 14,820 • PC-ASSESS-2026-v1).</p>
            </div>
            <div className="rounded-lg bg-blue-950/80 border-2 border-blue-400 p-3">
              <p className="text-[10px] font-bold uppercase text-blue-300">Stage 1/3 • In Progress (Active)</p>
              <p className="text-xs font-bold mt-0.5">Opportunity #1 (NexaTech)</p>
              <p className="text-[11px] text-blue-200 mt-1">Round 1 Completed (19 Sep 2026 • 86.3/100) • Round 2 Confirmed (30 Sep 2026, 14:30–15:30 IST). Concludes toward quota upon round outcome.</p>
            </div>
            <div className="rounded-lg bg-indigo-950/80 border-2 border-indigo-400 p-3">
              <p className="text-[10px] font-bold uppercase text-indigo-300">Stage 2/3 • Scheduled</p>
              <p className="text-xs font-bold mt-0.5">Opportunity #2 (FinCore)</p>
              <p className="text-[11px] text-indigo-200 mt-1">FinCore Digital Systems India • Round 1 Confirmed: 03 Oct 2026 (11:30–12:30 IST • Independent Employer #2).</p>
            </div>
            <div className="rounded-lg bg-slate-800/70 border border-slate-700 p-3">
              <p className="text-[10px] font-bold uppercase text-amber-300">Stage 3/3 • In Matching Pipeline</p>
              <p className="text-xs font-bold mt-0.5">Opportunity #3 (CloudScale)</p>
              <p className="text-[11px] text-slate-300 mt-1">CloudScale Systems India Pvt. Ltd. (92% Score Fit Reserved in Cohort Pool).</p>
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
              <p className="text-[11px] text-slate-600">
                <strong>Assurance Protection:</strong> Claiming reserves your slot immediately without deducting quota. The opportunity counts toward your contractual 3-interview assurance only after your attendance is verified. Employer cancellations or unexcused host no-shows automatically restore your matching quota with zero penalty.
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
          const opp = opportunities.find((o: any) => o.opportunityNumber === slotNum)
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
                            {opp.status?.replace(/_/g, ' ') || 'ACTIVE'}
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-xs text-slate-500 mt-0.5">
                        {isAssigned
                          ? `${opp.employer?.name} • Assigned ${opp.assignedDateDisplay || formatDate(opp.assignedDate || opp.createdAt, '12 Sep 2026')}`
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
                    {(() => {
                      const completedCount = interviews.filter((i: any) => i.status === 'COMPLETED' || i.status === 'SELECTED').length;
                      const upcomingCount = interviews.filter((i: any) => i.status !== 'COMPLETED' && i.status !== 'SELECTED').length;
                      const summaryBadge =
                        completedCount > 0 && upcomingCount > 0
                          ? `${completedCount} COMPLETED • ${upcomingCount} CONFIRMED`
                          : completedCount > 0
                          ? `${completedCount} COMPLETED`
                          : `${upcomingCount} SCHEDULED`;
                      return (
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Interview Rounds ({summaryBadge})
                        </h4>
                      );
                    })()}

                    <div className="grid gap-3 sm:grid-cols-2">
                      {interviews.map((iv: any) => {
                        const isCompleted = iv.status === 'COMPLETED' || iv.status === 'SELECTED'
                        const isScheduled = iv.status === 'SCHEDULED' || iv.status === 'STUDENT_CONFIRMED' || iv.status === 'CONFIRMED'

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
                                {iv.status?.replace(/_/g, ' ') || 'CONFIRMED'}
                              </Badge>
                            </div>

                            <div className="text-xs text-slate-600 space-y-1">
                              <p className="flex items-center gap-1.5">
                                <Calendar className="h-3 w-3 text-slate-400" />
                                {iv.scheduledFullDisplay || (iv.scheduledAt ? formatDateTime(iv.scheduledAt) : 'Schedule Confirmed')}
                              </p>
                              {iv.panelDisplay && (
                                <p className="flex items-center gap-1.5">
                                  <User className="h-3 w-3 text-slate-400" />
                                  Panel: {iv.panelDisplay}
                                </p>
                              )}
                              {iv.evaluationScoreDisplay && (
                                <p className="text-[11px] font-mono text-emerald-700 bg-white p-1.5 rounded border border-emerald-100 mt-2">
                                  Outcome: {iv.evaluationScoreDisplay}
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
