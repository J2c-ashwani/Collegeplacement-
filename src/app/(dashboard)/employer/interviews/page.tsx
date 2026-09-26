import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Video,
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  ShieldCheck,
  CheckSquare,
} from 'lucide-react';
import {
  CANONICAL_AARAV_OPPORTUNITIES,
  CANONICAL_RECRUITER_FUNNEL,
} from '@/config/canonical-assurance-graph';

const nexaOpp = CANONICAL_AARAV_OPPORTUNITIES[0];
const nexaR1 = nexaOpp.interviews[0];
const nexaR2 = nexaOpp.interviews[1];

const SCHEDULED_AND_COMPLETED_ROUNDS = [
  {
    id: nexaR1.id,
    candidateName: 'Aarav Sharma',
    enrollmentNumber: 'APX2026CS042',
    institution: 'Apex Institute of Technology (APX123)',
    roleTitle: nexaOpp.jobTitle,
    opportunityRef: `${nexaOpp.assuranceBadgeText} (${nexaOpp.id})`,
    roundLabel: `${nexaR1.roundName} (${nexaR1.durationMinutes}m)`,
    scheduledDate: `${nexaR1.scheduledDateDisplay} • ${nexaR1.scheduledTimeDisplay}`,
    interviewerPanel: nexaR1.panelDisplay,
    attendanceStatus: nexaR1.attendanceStatus,
    lifecycleStatus: `COMPLETED (Counted 1/3 Toward Assurance • ${nexaR1.transitionAuditId})`,
    evaluationScore: nexaR1.evaluationScoreDisplay,
    transitionTimestamp: nexaR1.transitionTimestampIso,
    badgeVariant: 'emerald',
  },
  {
    id: nexaR2.id,
    candidateName: 'Aarav Sharma',
    enrollmentNumber: 'APX2026CS042',
    institution: 'Apex Institute of Technology (APX123)',
    roleTitle: nexaOpp.jobTitle,
    opportunityRef: `${nexaOpp.id} • Round 2 Advancement`,
    roundLabel: `${nexaR2.roundName} (${nexaR2.durationMinutes}m)`,
    scheduledDate: `${nexaR2.scheduledDateDisplay} • ${nexaR2.scheduledTimeDisplay}`,
    interviewerPanel: nexaR2.panelDisplay,
    attendanceStatus: nexaR2.attendanceStatus,
    lifecycleStatus: `CONFIRMED (${nexaR2.transitionAuditId} • Candidate, Recruiter & Panel Notified)`,
    evaluationScore: `Scheduled — ${nexaR2.meetingPlatform} (${nexaR2.meetingUrl})`,
    transitionTimestamp: nexaR2.transitionTimestampIso,
    badgeVariant: 'blue',
  },
  {
    id: 'iv-nexa-02',
    candidateName: 'Ananya Nair',
    enrollmentNumber: 'APX2026CS018',
    institution: 'Apex Institute of Technology (APX123)',
    roleTitle: nexaOpp.jobTitle,
    opportunityRef: 'Opportunity #2 of 3 (Counts Toward 3-Interview Assurance)',
    roundLabel: 'Round 2 — System Design & Architecture Panel (60m)',
    scheduledDate: '24 Sep 2026 • 15:00–16:00 IST',
    interviewerPanel: 'Ananya Sundaram (Principal Architect)',
    attendanceStatus: 'ATTENDED_ON_TIME',
    lifecycleStatus: 'COMPLETED (Offer Extended — ₹8.5 LPA • AUD-2026-99710)',
    evaluationScore: '92.0 / 100 (Selected for Final Offer)',
    transitionTimestamp: '2026-09-24T16:12:00+05:30',
    badgeVariant: 'emerald',
  },
];

export default async function EmployerInterviewsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  return (
    <div className="max-w-7xl mx-auto space-y-5 pb-4 print:space-y-4 print:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <Badge className="bg-blue-50 text-[#1E40AF] border-blue-200 text-[11px]">
              Interview Scheduling &amp; Structured Evaluation Console
            </Badge>
            <Badge className="bg-slate-100 text-slate-800 border-slate-300 text-[10px] font-mono">
              Canonical Graph: PlacementAssuranceOpportunity
            </Badge>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Corporate Interview Slots, Validation Rubric &amp; Assurance Certification
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Every interview round follows the frozen canonical lifecycle:{' '}
            <strong>
              Created &rarr; Matched &rarr; Scheduled &rarr; Attended &rarr; Completed &rarr; Counted Toward Assurance
            </strong>
            . Derived from <code className="font-mono">{nexaOpp.id}</code>.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/employer/candidates">
            <Button size="sm" variant="outline" className="text-xs h-8">
              Back to Shortlist Funnel ({CANONICAL_RECRUITER_FUNNEL.funnelSummaryText})
            </Button>
          </Link>
        </div>
      </div>

      {/* 1. Live Panel Evaluation Rubric with Explicit Validation Boundaries (0–100) + 6-Point Pre-Certification Checklist */}
      <Card className="border-2 border-[#1E40AF] shadow-2xs bg-white break-inside-avoid">
        <CardHeader className="pb-3 border-b border-slate-100 bg-blue-50/40">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-[#1E40AF]">
                STRUCTURED INTERVIEW EVALUATION RUBRIC &amp; PRE-CERTIFICATION VALIDATION ({nexaR1.id})
              </span>
              <CardTitle className="text-base font-bold text-slate-900 mt-0.5">
                Active Panel Rubric: Aarav Sharma (APX2026CS042) &bull; {nexaR1.roundName} ({nexaR1.scheduledDateDisplay}, {nexaR1.scheduledTimeDisplay})
              </CardTitle>
            </div>
            <Badge className="bg-emerald-700 text-white text-[11px] font-mono">
              CERTIFIED: ATTENDED &amp; COMPLETED (1/3 COUNTED • {nexaR1.transitionAuditId})
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
          {/* Left 7 Cols: Validated Rubric Scores (Range: 0-100) + Panel Notes */}
          <div className="lg:col-span-7 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-800">
                1. Validated Rubric Scores (Strict Input Range: 0–100)
              </span>
              <span className="text-[10px] font-mono text-emerald-700 font-bold">
                Composite Panel Score: 86.3 / 100 (Validated ✓)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-600 font-sans font-bold block">
                  Data Structures &amp; Code
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-300">
                    Score: [ 88 ]
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold">VALID</span>
                </div>
                <span className="text-[10px] text-slate-500 block">Allowed Range: 0–100</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-600 font-sans font-bold block">
                  API &amp; DB Architecture
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-300">
                    Score: [ 85 ]
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold">VALID</span>
                </div>
                <span className="text-[10px] text-slate-500 block">Allowed Range: 0–100</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-600 font-sans font-bold block">
                  Communication &amp; Clarity
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-300">
                    Score: [ 86 ]
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold">VALID</span>
                </div>
                <span className="text-[10px] text-slate-500 block">Allowed Range: 0–100</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">
                Panelist Structured Evaluation Notes ({nexaR1.panelDisplay}):
              </span>
              <p className="text-slate-700 leading-relaxed">
                Candidate demonstrated strong mastery of TypeScript, asynchronous event loops, and PostgreSQL indexing strategies. Recommended for Round 2 System Design &amp; Hiring Manager Panel scheduled on{' '}
                <strong className="text-slate-900">
                  {nexaR2.scheduledDateDisplay} ({nexaR2.scheduledTimeDisplay})
                </strong>
                .
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 text-slate-100 font-mono text-[10px] flex items-center justify-between">
              <span>
                RBAC Enforcement: Only verified Employer panels or Super Admin can certify an interview as COMPLETED. Students are blocked (HTTP 403) from self-certifying.
              </span>
              <span className="text-emerald-400 font-bold shrink-0 ml-2">
                {nexaR1.transitionTimestampIso}
              </span>
            </div>
          </div>

          {/* Right 5 Cols: Mandatory 6-Point Pre-Certification Validation Checklist */}
          <div className="lg:col-span-5 rounded-xl bg-slate-50 border border-slate-200 p-4 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-[11px] font-mono uppercase font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckSquare className="h-3.5 w-3.5 text-emerald-700" />
                  2. Pre-Certification Validation Checklist
                </span>
                <Badge className="bg-emerald-100 text-emerald-900 border-emerald-300 text-[9px] font-mono">
                  6 / 6 GATES VERIFIED
                </Badge>
              </div>

              <div className="space-y-1.5 font-mono text-[11px] text-slate-800">
                <div className="flex items-center gap-2 p-1.5 rounded bg-white border border-slate-200">
                  <span className="text-emerald-700 font-bold">☑</span>
                  <span>
                    <strong>Attendance verified</strong> (Joined {nexaR1.scheduledDateDisplay}, 14:00 IST)
                  </span>
                </div>
                <div className="flex items-center gap-2 p-1.5 rounded bg-white border border-slate-200">
                  <span className="text-emerald-700 font-bold">☑</span>
                  <span>
                    <strong>Evaluation completed</strong> (3/3 rubric scores within 0–100)
                  </span>
                </div>
                <div className="flex items-center gap-2 p-1.5 rounded bg-white border border-slate-200">
                  <span className="text-emerald-700 font-bold">☑</span>
                  <span>
                    <strong>Panel identity verified</strong> ({nexaR1.panelDisplay})
                  </span>
                </div>
                <div className="flex items-center gap-2 p-1.5 rounded bg-white border border-slate-200">
                  <span className="text-emerald-700 font-bold">☑</span>
                  <span>
                    <strong>Required scores submitted</strong> (Composite: 86.3 / 100)
                  </span>
                </div>
                <div className="flex items-center gap-2 p-1.5 rounded bg-white border border-slate-200">
                  <span className="text-emerald-700 font-bold">☑</span>
                  <span>
                    <strong>Candidate notified</strong> (Round 1 passed → Round 2 scheduled)
                  </span>
                </div>
                <div className="flex items-center gap-2 p-1.5 rounded bg-emerald-50 border border-emerald-300">
                  <span className="text-emerald-700 font-bold">☑</span>
                  <span>
                    <strong>Assurance ledger update authorized</strong> (Counts 1/3)
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 space-y-2">
              <Button className="w-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold h-9">
                <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                Certify Interview Completion (ATTENDED → COMPLETED → COUNTED)
              </Button>
              <div className="text-[10px] font-mono text-slate-500 text-center">
                Canonical Audit Ref: {nexaR1.transitionAuditId} • Synced to Student, TPO &amp; Admin Dashboards
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Scheduled & Completed Corporate Interview Rounds Ledger (Derived from CANONICAL_AARAV_OPPORTUNITIES) */}
      <Card className="border-slate-200 shadow-2xs bg-white break-inside-avoid">
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-900">
                Corporate Interview Schedule &amp; Assurance Ledger
              </CardTitle>
              <CardDescription className="text-xs">
                Synchronized directly from <code className="font-mono">CANONICAL_AARAV_OPPORTUNITIES</code> — zero cross-screen date divergence.
              </CardDescription>
            </div>
            <Badge className="bg-indigo-50 text-indigo-800 border-indigo-200 font-mono text-[10px]">
              3 Active Interview Records
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-mono uppercase text-slate-500">
                <th className="py-3 px-4">Candidate &amp; Institution</th>
                <th className="py-3 px-3">Role &amp; Assurance Ref</th>
                <th className="py-3 px-3">Round &amp; Canonical Schedule</th>
                <th className="py-3 px-3">Attendance &amp; Lifecycle Status</th>
                <th className="py-3 px-4 text-right">Panel Evaluation &amp; Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {SCHEDULED_AND_COMPLETED_ROUNDS.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{item.candidateName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {item.enrollmentNumber} &bull; {item.institution}
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="font-semibold text-slate-900">{item.roleTitle}</div>
                    <div className="text-[11px] text-[#1E40AF] font-mono font-semibold">
                      {item.opportunityRef}
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="font-medium text-slate-900">{item.roundLabel}</div>
                    <div className="text-[11px] text-emerald-800 font-mono font-bold">
                      {item.scheduledDate}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Panel: {item.interviewerPanel}
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <Badge
                      className={
                        item.badgeVariant === 'emerald'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 text-[10px]'
                          : 'bg-blue-50 text-blue-800 border-blue-300 text-[10px]'
                      }
                    >
                      {item.lifecycleStatus}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="font-semibold text-slate-800">{item.evaluationScore}</div>
                    <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                      Transitioned: {item.transitionTimestamp}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
