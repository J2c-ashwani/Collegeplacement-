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
  ArrowRight,
} from 'lucide-react';

const SCHEDULED_AND_COMPLETED_ROUNDS = [
  {
    id: 'iv-nexa-01',
    candidateName: 'Aarav Sharma',
    enrollmentNumber: 'APX2026CS042',
    institution: 'Apex Institute of Technology (APX123)',
    roleTitle: 'Associate Software Engineer (Full-Stack)',
    opportunityRef: 'Opportunity #1 of 3 (Counts Toward 3-Interview Assurance)',
    roundLabel: 'Round 1 — Technical & Algorithmic Assessment Panel (60m)',
    scheduledDate: '19 Sep 2026, 14:00–15:00 IST',
    interviewerPanel: 'Vikramaditya Rao (VP Engineering)',
    attendanceStatus: 'ATTENDED_ON_TIME',
    lifecycleStatus: 'COMPLETED (Counted 1/3 Toward Assurance)',
    evaluationScore: '86/100 (Advanced to Round 2 System Design)',
    badgeVariant: 'emerald',
  },
  {
    id: 'iv-nexa-01-r2',
    candidateName: 'Aarav Sharma',
    enrollmentNumber: 'APX2026CS042',
    institution: 'Apex Institute of Technology (APX123)',
    roleTitle: 'Associate Software Engineer (Full-Stack)',
    opportunityRef: 'Opportunity #1 of 3 — Round 2 Advancement',
    roundLabel: 'Round 2 — System Design & Hiring Manager Panel (60m)',
    scheduledDate: '30 Sep 2026, 14:30–15:30 IST',
    interviewerPanel: 'Hiring Manager (Vikramaditya Rao) + Senior Engineer (Meera Krishnan)',
    attendanceStatus: 'CONFIRMED_UPCOMING',
    lifecycleStatus: 'CONFIRMED (Candidate, Recruiter & Panel Notified • Calendar Created)',
    evaluationScore: 'Scheduled — Google Meet (meet.google.com/nxa-r2)',
    badgeVariant: 'blue',
  },
  {
    id: 'iv-nexa-02',
    candidateName: 'Ananya Nair',
    enrollmentNumber: 'APX2026CS018',
    institution: 'Apex Institute of Technology (APX123)',
    roleTitle: 'Associate Software Engineer (Full-Stack)',
    opportunityRef: 'Opportunity #2 of 3 (Counts Toward 3-Interview Assurance)',
    roundLabel: 'Round 2 — System Design & Architecture Panel (60m)',
    scheduledDate: '28 Sep 2026, 15:00–16:00 IST',
    interviewerPanel: 'Ananya Sundaram (Principal Architect)',
    attendanceStatus: 'ATTENDED_ON_TIME',
    lifecycleStatus: 'COMPLETED (Offer Extended — ₹8.5 LPA)',
    evaluationScore: '92/100 (Selected for Final Offer)',
    badgeVariant: 'emerald',
  },
];

export default async function EmployerInterviewsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <Badge className="bg-blue-50 text-[#1E40AF] border-blue-200 text-[11px]">
              Interview Scheduling &amp; Structured Evaluation Console
            </Badge>
            <Badge className="bg-amber-50 text-amber-900 border-amber-300 text-[11px]">
              SAMPLE SANDBOX — ILLUSTRATIVE DATA
            </Badge>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Corporate Interview Slots, Attendance Verification &amp; Panel Evaluation
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Every interview round follows the frozen canonical lifecycle:{' '}
            <strong>Created &rarr; Matched &rarr; Scheduled &rarr; Attended &rarr; Completed &rarr; Counted Toward Assurance</strong>.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/employer/candidates">
            <Button size="sm" variant="outline" className="text-xs h-8">
              Back to Candidate Shortlist (42 Matches)
            </Button>
          </Link>
        </div>
      </div>

      {/* Live Panel Evaluation & Assurance Certification Card */}
      <Card className="border-2 border-[#1E40AF] shadow-2xs bg-white">
        <CardHeader className="pb-3 border-b border-slate-100 bg-blue-50/40">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-[#1E40AF]">
                STRUCTURED INTERVIEW EVALUATION &amp; ASSURANCE COMPLETION CERTIFICATION
              </span>
              <CardTitle className="text-base font-bold text-slate-900 mt-0.5">
                Active Panel Rubric: Aarav Sharma (APX2026CS042) &bull; SDE-1 Technical Evaluation
              </CardTitle>
            </div>
            <Badge className="bg-emerald-700 text-white text-[11px]">
              CERTIFIED: ATTENDED &amp; COMPLETED (1/3 COUNTED)
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
          <div className="lg:col-span-8 space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
              <div className="p-3 rounded bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 font-sans block">Data Structures &amp; Code</span>
                <strong className="text-sm text-slate-900">88 / 100</strong>
              </div>
              <div className="p-3 rounded bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 font-sans block">API &amp; DB Architecture</span>
                <strong className="text-sm text-slate-900">85 / 100</strong>
              </div>
              <div className="p-3 rounded bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 font-sans block">Communication &amp; Clarity</span>
                <strong className="text-sm text-slate-900">86 / 100</strong>
              </div>
              <div className="p-3 rounded bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] text-emerald-800 font-sans block">Attendance Verification</span>
                <strong className="text-sm text-emerald-900">PUNCTUAL ✓</strong>
              </div>
            </div>
            <div className="p-3 rounded bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed">
              <strong>Hiring Panel Notes (Vikramaditya Rao, VP Engineering):</strong> Candidate demonstrated strong command of TypeScript, relational schema normalization, and transactional idempotency. First-round corporate interview certified as <strong>ATTENDED &amp; COMPLETED</strong> (synchronously updating Student &amp; TPO Assurance Ledgers to <strong>1 of 3 Completed</strong>) and advanced to Round 2 System Design.
            </div>
          </div>
          <div className="lg:col-span-4 flex flex-col justify-between p-4 rounded bg-slate-900 text-white space-y-3">
            <div>
              <div className="text-[10px] font-mono uppercase text-blue-300 font-bold">
                Cross-Role Single Source of Truth
              </div>
              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                Only verified Employer panels or Super Admin can certify an interview as <strong>COMPLETED</strong>. Students are blocked (<code>HTTP 403</code>) from self-certifying completion.
              </p>
            </div>
            <div className="space-y-1.5 text-[11px] font-mono bg-slate-800 p-2.5 rounded border border-slate-700">
              <div>Student Ledger: <span className="text-emerald-400">1 of 3 Completed</span></div>
              <div>TPO Cohort Funnel: <span className="text-emerald-400">1,002 / 1,236 (81.07%)</span></div>
              <div>Next Action: <span className="text-amber-300">Round 2 Scheduled</span></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scheduled & Completed Interviews Table */}
      <Card className="border-slate-200 shadow-2xs bg-white">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-base font-bold text-slate-900">
            Corporate Interview Schedule &amp; Assurance Ledger
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-500">
                <th className="py-3 px-4">Candidate &amp; Institution</th>
                <th className="py-3 px-3">Role &amp; Assurance Slot</th>
                <th className="py-3 px-3">Round &amp; Panel</th>
                <th className="py-3 px-3">Schedule (IST)</th>
                <th className="py-3 px-3">Canonical Lifecycle Status</th>
                <th className="py-3 px-4">Evaluation Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {SCHEDULED_AND_COMPLETED_ROUNDS.map((iv) => (
                <tr key={iv.id} className="hover:bg-slate-50/80">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{iv.candidateName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {iv.enrollmentNumber} &bull; {iv.institution}
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="font-semibold text-slate-900">{iv.roleTitle}</div>
                    <div className="text-[11px] text-[#1E40AF] font-medium">{iv.opportunityRef}</div>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="font-medium text-slate-900">{iv.roundLabel}</div>
                    <div className="text-[11px] text-slate-500">Panel: {iv.interviewerPanel}</div>
                  </td>
                  <td className="py-3.5 px-3 font-mono text-[11px] text-slate-800">
                    {iv.scheduledDate}
                  </td>
                  <td className="py-3.5 px-3">
                    <Badge
                      className={
                        iv.badgeVariant === 'emerald'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 text-[10px]'
                          : 'bg-blue-50 text-[#1E40AF] border-blue-200 text-[10px]'
                      }
                    >
                      {iv.lifecycleStatus}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    {iv.evaluationScore}
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
