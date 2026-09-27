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
  Lock,
} from 'lucide-react'
import { ClusterSlotClaim } from './cluster-slot-claim'

export default async function StudentInterviewsPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  const student = await resolveStudent(session.user.id)
  if (!student) {
    redirect('/student/enrolment')
  }

  const opportunities: any[] = student.opportunities || []

  // Canonical Sequential Progressive Logic:
  // Slot N unlocks only when Slot N-1 concludes unselected (REJECTED/COMPLETED without offer).
  // Immediate exit upon selection anywhere.
  const opp1 = opportunities.find((o: any) => o.opportunityNumber === 1)
  const opp2 = opportunities.find((o: any) => o.opportunityNumber === 2)
  const opp3 = opportunities.find((o: any) => o.opportunityNumber === 3)

  const isOpp1Selected = opp1?.status === 'SELECTED' || !!opp1?.offer
  const isOpp1ConcludedUnselected = opp1?.status === 'REJECTED' || (opp1?.status === 'COMPLETED' && !opp1?.offer)

  const isOpp2Selected = opp2?.status === 'SELECTED' || !!opp2?.offer
  const isOpp2ConcludedUnselected = opp2?.status === 'REJECTED' || (opp2?.status === 'COMPLETED' && !opp2?.offer)

  const isOpp3Selected = opp3?.status === 'SELECTED' || !!opp3?.offer
  const isOpp3ConcludedUnselected = opp3?.status === 'REJECTED' || (opp3?.status === 'COMPLETED' && !opp3?.offer)

  const isAnySelected = isOpp1Selected || isOpp2Selected || isOpp3Selected

  // Active Opportunity currently in flight (not yet concluded)
  const activeOpp = !isAnySelected
    ? [opp1, opp2, opp3].find(
        (o) => o && !['REJECTED', 'CANCELLED', 'NO_SHOW', 'WITHDRAWN', 'COMPLETED', 'SELECTED'].includes(o.status)
      ) || (!isOpp1ConcludedUnselected && opp1 ? opp1 : null)
    : null

  const hasActiveOpp = !!activeOpp
  const activeEmployerName =
    activeOpp?.employer?.companyName || activeOpp?.employer?.name || 'Corporate Partner'

  // Dynamic Header Status text
  let headerStatusText = 'Stage 0/3 • Matching Initial Opportunity'
  if (isAnySelected) {
    headerStatusText = 'Assurance Goal Achieved • Selected & Placed 🎉'
  } else if (activeOpp) {
    const oppInterviews = activeOpp.interviews || []
    const hasScheduled = oppInterviews.some((i: any) => i.status === 'SCHEDULED' || i.status === 'CONFIRMED')
    headerStatusText = hasScheduled
      ? `Opportunity #${activeOpp.opportunityNumber} Active • Round Confirmed`
      : `Opportunity #${activeOpp.opportunityNumber} In Progress • Evaluation Underway`
  } else if (isOpp3ConcludedUnselected) {
    headerStatusText = '3 Opportunities Concluded • Backstop Review Active'
  } else if (isOpp2ConcludedUnselected) {
    headerStatusText = '2 Opportunities Concluded • Opportunity #3 In Matching'
  } else if (isOpp1ConcludedUnselected) {
    headerStatusText = 'Opportunity #1 Concluded • Opportunity #2 In Matching'
  }

  // Diagnostic Assessment Context
  const assessment = student.assessments?.[0]
  const diagnosticScore = assessment?.result?.overallScore ?? 84.0
  const percentile = assessment?.result?.percentile ?? 91

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 text-[11px]">
              Progressive Opportunities Console
            </Badge>
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-mono">
              Progressive Interview Assurance Active
            </Badge>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Interview Rounds &amp; Progressive Assurance Tracking
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Track your progressive corporate interview opportunities, scheduled panel rounds, evaluation outcomes, and verified offers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-50 text-xs font-bold">
            {headerStatusText}
          </Badge>
        </div>
      </div>

      {/* Dynamic 0/3 -> 1/3 -> 2/3 -> 3/3 Lifecycle Progression Matrix */}
      <Card className="border-slate-200 bg-slate-900 text-white shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">
              Progressive Corporate Interview Lifecycle (Up to 3 Opportunities • Immediate Exit upon Selection)
            </span>
            <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase">
              STATUS: {headerStatusText}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Stage 0: Assurance Eligible */}
            <div className="rounded-lg bg-slate-800/90 border border-emerald-500/40 p-3">
              <p className="text-[10px] font-bold uppercase text-emerald-400">Stage 0 • Assurance Eligible</p>
              <p className="text-xs font-bold mt-0.5">Diagnostic Score: {diagnosticScore}/100</p>
              <p className="text-[11px] text-slate-300 mt-1">
                Entered verified corporate matching pool ({percentile}th Percentile • PC-ASSESS-2026-v1). Entitled to up to 3 progressive interview opportunities.
              </p>
            </div>

            {/* Stage 1: Opportunity #1 */}
            <div
              className={`rounded-lg p-3 ${
                isOpp1Selected
                  ? 'bg-emerald-950/80 border-2 border-emerald-400'
                  : opp1 && !isOpp1ConcludedUnselected
                  ? 'bg-blue-950/80 border-2 border-blue-400'
                  : isOpp1ConcludedUnselected
                  ? 'bg-slate-800/80 border border-slate-700'
                  : 'bg-slate-800/70 border border-slate-700'
              }`}
            >
              <p
                className={`text-[10px] font-bold uppercase ${
                  isOpp1Selected
                    ? 'text-emerald-300'
                    : opp1 && !isOpp1ConcludedUnselected
                    ? 'text-blue-300'
                    : 'text-slate-400'
                }`}
              >
                {isOpp1Selected
                  ? 'Opportunity #1 • Selected 🎉'
                  : opp1 && !isOpp1ConcludedUnselected
                  ? 'Opportunity #1 • In Progress'
                  : isOpp1ConcludedUnselected
                  ? 'Opportunity #1 • Concluded'
                  : 'Opportunity #1 • Matching'}
              </p>
              <p className="text-xs font-bold mt-0.5">
                {opp1
                  ? opp1.employer?.companyName || opp1.employer?.name || 'Verified Employer'
                  : 'Awaiting Corporate Allocation'}
              </p>
              <p className="text-[11px] text-slate-300 mt-1">
                {isOpp1Selected
                  ? 'Corporate offer issued. Student exited assurance cycle.'
                  : opp1 && !isOpp1ConcludedUnselected
                  ? `${opp1.job?.title || 'Fresher Engineer'} • Round 1 Evaluated • Round 2 Confirmed`
                  : isOpp1ConcludedUnselected
                  ? 'Opportunity concluded without selection. Unlocked Opportunity #2.'
                  : 'Matching engine allocating corporate opening based on 9-dimension score fit.'}
              </p>
            </div>

            {/* Stage 2: Opportunity #2 */}
            <div
              className={`rounded-lg p-3 ${
                isOpp2Selected
                  ? 'bg-emerald-950/80 border-2 border-emerald-400'
                  : isOpp1Selected
                  ? 'bg-slate-900/60 border border-slate-800 opacity-60'
                  : isOpp1ConcludedUnselected && opp2 && !isOpp2ConcludedUnselected
                  ? 'bg-indigo-950/80 border-2 border-indigo-400'
                  : isOpp2ConcludedUnselected
                  ? 'bg-slate-800/80 border border-slate-700'
                  : isOpp1ConcludedUnselected
                  ? 'bg-slate-800/70 border border-slate-700'
                  : 'bg-slate-900/60 border border-slate-800 opacity-80'
              }`}
            >
              <p
                className={`text-[10px] font-bold uppercase ${
                  isOpp2Selected
                    ? 'text-emerald-300'
                    : isOpp1Selected
                    ? 'text-slate-500'
                    : isOpp1ConcludedUnselected && opp2 && !isOpp2ConcludedUnselected
                    ? 'text-indigo-300'
                    : isOpp1ConcludedUnselected
                    ? 'text-amber-300'
                    : 'text-slate-400'
                }`}
              >
                {isOpp2Selected
                  ? 'Opportunity #2 • Selected 🎉'
                  : isOpp1Selected
                  ? 'Opportunity #2 • Concluded (Exit)'
                  : isOpp1ConcludedUnselected && opp2 && !isOpp2ConcludedUnselected
                  ? 'Opportunity #2 • In Progress'
                  : isOpp1ConcludedUnselected
                  ? 'Opportunity #2 • Matching'
                  : 'Opportunity #2 • Sequential Lock'}
              </p>
              <p className="text-xs font-bold mt-0.5">
                {isOpp1Selected
                  ? 'Not Required (Placed in Opp #1)'
                  : isOpp1ConcludedUnselected && opp2
                  ? opp2.employer?.companyName || opp2.employer?.name || 'Verified Employer'
                  : isOpp1ConcludedUnselected
                  ? 'In Matching Allocation'
                  : 'Reserved in Cohort Pool'}
              </p>
              <p className="text-[11px] text-slate-300 mt-1">
                {isOpp1Selected
                  ? 'Student achieved corporate placement in Opportunity #1.'
                  : isOpp1ConcludedUnselected && opp2
                  ? `${opp2.job?.title || 'Fresher Role'} • Progressive opportunity actively in progress.`
                  : isOpp1ConcludedUnselected
                  ? 'Allocating independent corporate employer for second progressive opportunity.'
                  : 'Sequential progression: Unlocks automatically if Opportunity #1 completes without selection.'}
              </p>
            </div>

            {/* Stage 3: Opportunity #3 */}
            <div
              className={`rounded-lg p-3 ${
                isOpp3Selected
                  ? 'bg-emerald-950/80 border-2 border-emerald-400'
                  : isOpp1Selected || isOpp2Selected
                  ? 'bg-slate-900/60 border border-slate-800 opacity-60'
                  : isOpp2ConcludedUnselected && opp3 && !isOpp3ConcludedUnselected
                  ? 'bg-indigo-950/80 border-2 border-indigo-400'
                  : isOpp3ConcludedUnselected
                  ? 'bg-slate-800/80 border border-slate-700'
                  : isOpp2ConcludedUnselected
                  ? 'bg-slate-800/70 border border-slate-700'
                  : 'bg-slate-900/60 border border-slate-800 opacity-80'
              }`}
            >
              <p
                className={`text-[10px] font-bold uppercase ${
                  isOpp3Selected
                    ? 'text-emerald-300'
                    : isOpp1Selected || isOpp2Selected
                    ? 'text-slate-500'
                    : isOpp2ConcludedUnselected && opp3
                    ? 'text-indigo-300'
                    : isOpp2ConcludedUnselected
                    ? 'text-amber-300'
                    : 'text-slate-400'
                }`}
              >
                {isOpp3Selected
                  ? 'Opportunity #3 • Selected 🎉'
                  : isOpp1Selected || isOpp2Selected
                  ? 'Opportunity #3 • Concluded (Exit)'
                  : isOpp2ConcludedUnselected && opp3
                  ? 'Opportunity #3 • In Progress'
                  : isOpp2ConcludedUnselected
                  ? 'Opportunity #3 • Matching'
                  : 'Opportunity #3 • Sequential Lock'}
              </p>
              <p className="text-xs font-bold mt-0.5">
                {isOpp1Selected || isOpp2Selected
                  ? 'Not Required (Placed Earlier)'
                  : isOpp2ConcludedUnselected && opp3
                  ? opp3.employer?.companyName || opp3.employer?.name || 'Verified Employer'
                  : isOpp2ConcludedUnselected
                  ? 'In Matching Allocation'
                  : 'Reserved in Cohort Pool'}
              </p>
              <p className="text-[11px] text-slate-300 mt-1">
                {isOpp1Selected || isOpp2Selected
                  ? 'Student achieved corporate placement in an earlier progressive round.'
                  : isOpp2ConcludedUnselected && opp3
                  ? `${opp3.job?.title || 'Fresher Role'} • Final progressive opportunity in progress.`
                  : isOpp2ConcludedUnselected
                  ? 'Allocating independent corporate employer for final progressive opportunity.'
                  : 'Sequential progression: Unlocks automatically if Opportunity #2 completes without selection.'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Cluster Mega-Drive Slots Banner */}
      <ClusterSlotClaim
        hasActiveOpportunity={hasActiveOpp}
        activeEmployerName={activeEmployerName}
      />

      {/* Up to 3 Sequential Opportunity Containers */}
      <div className="space-y-6">
        {[1, 2, 3].map((slotNum) => {
          let opp: any = null
          let isSequentiallyLocked = false
          let lockReason = ''
          let isCycleConcluded = false

          if (slotNum === 1) {
            opp = opp1
          } else if (slotNum === 2) {
            if (isOpp1Selected) {
              isCycleConcluded = true
            } else if (!isOpp1ConcludedUnselected) {
              isSequentiallyLocked = true
              lockReason = 'Sequential Gating: Opportunity #2 unlocks only if Opportunity #1 completes without an offer.'
            } else {
              opp = opp2
            }
          } else if (slotNum === 3) {
            if (isOpp1Selected || isOpp2Selected) {
              isCycleConcluded = true
            } else if (!isOpp2ConcludedUnselected) {
              isSequentiallyLocked = true
              lockReason = 'Sequential Gating: Opportunity #3 unlocks only if Opportunity #2 completes without an offer.'
            } else {
              opp = opp3
            }
          }

          const isAssigned = !!opp
          const hasOffer = opp?.offer || opp?.status === 'SELECTED'
          const interviews = opp?.interviews || []

          return (
            <Card
              key={slotNum}
              className={`border transition-all ${
                hasOffer
                  ? 'border-emerald-200 bg-white shadow-xs'
                  : isAssigned
                  ? 'border-indigo-200 bg-white shadow-xs'
                  : isSequentiallyLocked || isCycleConcluded
                  ? 'border-slate-200/60 bg-slate-50/40'
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
                          : isSequentiallyLocked
                          ? 'bg-slate-100 text-slate-500 border-slate-200'
                          : 'bg-slate-100 text-slate-400 border-slate-200'
                      }`}
                    >
                      {hasOffer ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : isSequentiallyLocked ? (
                        <Lock className="h-4 w-4" />
                      ) : (
                        slotNum
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base font-bold text-slate-900">
                          {isAssigned
                            ? `${opp.job?.title || 'Fresher Software Engineer'}`
                            : isCycleConcluded
                            ? `Opportunity #${slotNum} — Assurance Cycle Concluded`
                            : isSequentiallyLocked
                            ? `Opportunity #${slotNum} — Sequentially Reserved`
                            : `Opportunity #${slotNum} — In Pipeline Allocation`}
                        </CardTitle>
                        {isAssigned && (
                          <Badge variant="outline" className="text-[10px] font-normal uppercase">
                            {opp.status?.replace(/_/g, ' ') || 'ACTIVE'}
                          </Badge>
                        )}
                        {isSequentiallyLocked && (
                          <Badge variant="outline" className="text-[10px] text-slate-500 font-mono">
                            LOCKED (SEQUENTIAL)
                          </Badge>
                        )}
                        {isCycleConcluded && (
                          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                            OFFER ACHIEVED
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-xs text-slate-500 mt-0.5">
                        {isAssigned
                          ? `${opp.employer?.companyName || opp.employer?.name} • Assigned ${opp.assignedDateDisplay || formatDate(opp.assignedDate || opp.createdAt, '12 Sep 2026')}`
                          : isCycleConcluded
                          ? 'Immediate exit on selection: Further progressive opportunities are not needed.'
                          : isSequentiallyLocked
                          ? lockReason
                          : 'Slot reserved under Progressive Interview Assurance. Corporate matching in progress.'}
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
                      const completedCount = interviews.filter((i: any) => i.status === 'COMPLETED' || i.status === 'SELECTED').length
                      const upcomingCount = interviews.filter((i: any) => i.status !== 'COMPLETED' && i.status !== 'SELECTED').length
                      const summaryBadge =
                        completedCount > 0 && upcomingCount > 0
                          ? `${completedCount} COMPLETED • ${upcomingCount} CONFIRMED`
                          : completedCount > 0
                          ? `${completedCount} COMPLETED`
                          : `${upcomingCount} SCHEDULED`
                      return (
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Interview Rounds ({summaryBadge})
                        </h4>
                      )
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
                ) : isSequentiallyLocked ? (
                  <div className="py-6 px-4 text-center text-slate-500 text-xs max-w-md mx-auto space-y-2">
                    <div className="inline-flex p-2 rounded-full bg-slate-100 text-slate-600 mb-1">
                      <Lock className="h-4 w-4" />
                    </div>
                    <p className="font-semibold text-slate-700">Sequential Opportunity Gating Active</p>
                    <p className="text-slate-500 leading-relaxed">
                      To ensure focused preparation and confirmed corporate interviewer commitment, progressive opportunities are facilitated sequentially. If previous rounds conclude without a selection, Opportunity #{slotNum} will automatically activate.
                    </p>
                  </div>
                ) : isCycleConcluded ? (
                  <div className="py-6 px-4 text-center text-slate-500 text-xs max-w-md mx-auto space-y-2">
                    <div className="inline-flex p-2 rounded-full bg-emerald-100 text-emerald-700 mb-1">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <p className="font-semibold text-emerald-800">Assurance Programme Successfully Concluded</p>
                    <p className="text-slate-500 leading-relaxed">
                      You have received a corporate placement offer. In accordance with the Progressive Assurance Constitution, candidates exit the assurance tracking cycle upon successful selection.
                    </p>
                  </div>
                ) : (
                  <div className="py-6 text-center text-slate-500 text-xs">
                    <p>This slot is reserved under your Progressive Interview Assurance entitlement.</p>
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
