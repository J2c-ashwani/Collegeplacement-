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
  Users,
  FileCheck2,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Briefcase,
  Award,
  Download,
} from 'lucide-react';

const TPO_COHORT_STUDENTS = [
  {
    id: 'stu-apex-2026-01',
    name: 'Aarav Sharma',
    enrollmentNumber: 'APX2026CS042',
    department: 'B.Tech CSE (2026)',
    cgpa: '8.64',
    backlogs: 0,
    programmeTrack: 'Standard Track (₹1,180 Paid)',
    assessmentScore: '84/100 (91st %ile)',
    interviewAssurance: '1 of 3 Completed',
    interviewSubLabel: '1 Scheduled • 1 Being Matched',
    attendanceRecord: '1/1 Attended (100% Punctual)',
    candidateStatus: 'INTERVIEWING (1/3 COMPLETED)',
    selected: true,
  },
  {
    id: 'stu-apex-2026-02',
    name: 'Diya Nair',
    enrollmentNumber: 'APX2026CS018',
    department: 'B.Tech CSE (2026)',
    cgpa: '9.12',
    backlogs: 0,
    programmeTrack: 'Extended Readiness Track (₹2,950 Paid)',
    assessmentScore: '88/100 (95th %ile)',
    interviewAssurance: '3 of 3 Completed',
    interviewSubLabel: '0 Scheduled • 0 Being Matched',
    attendanceRecord: '3/3 Attended (100% Punctual)',
    candidateStatus: 'OFFER ACCEPTED (₹11.5 LPA)',
    selected: false,
  },
  {
    id: 'stu-apex-2026-03',
    name: 'Rohan Kulkarni',
    enrollmentNumber: 'APX2026IT031',
    department: 'B.Tech IT (2026)',
    cgpa: '8.28',
    backlogs: 0,
    programmeTrack: 'Standard Track (₹1,180 Paid)',
    assessmentScore: '81/100 (87th %ile)',
    interviewAssurance: '2 of 3 Completed',
    interviewSubLabel: '1 Scheduled • 0 Being Matched',
    attendanceRecord: '2/2 Attended (100% Punctual)',
    candidateStatus: 'INTERVIEWING (2/3 COMPLETED)',
    selected: false,
  },
  {
    id: 'stu-apex-2026-04',
    name: 'Meera Krishnan',
    enrollmentNumber: 'APX2026CS064',
    department: 'B.Tech CSE (2026)',
    cgpa: '8.45',
    backlogs: 0,
    programmeTrack: 'Extended Readiness Track (₹2,950 Paid)',
    assessmentScore: '79/100 (84th %ile)',
    interviewAssurance: '1 of 3 Completed',
    interviewSubLabel: '1 Scheduled • 1 Being Matched',
    attendanceRecord: '1/1 Attended (100% Punctual)',
    candidateStatus: 'INTERVIEWING (1/3 COMPLETED)',
    selected: false,
  },
  {
    id: 'stu-apex-2026-05',
    name: 'Kabir Malhotra',
    enrollmentNumber: 'APX2026EC012',
    department: 'B.Tech ECE (2026)',
    cgpa: '7.92',
    backlogs: 0,
    programmeTrack: 'Standard Track (₹1,180 Paid)',
    assessmentScore: '77/100 (80th %ile)',
    interviewAssurance: '0 of 3 Completed',
    interviewSubLabel: '1 Scheduled • 2 Being Matched',
    attendanceRecord: '0/0 Scheduled (Upcoming 29 Sep)',
    candidateStatus: 'ROUND 1 SCHEDULED',
    selected: false,
  },
];

export default async function InstitutionStudentsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <Badge className="bg-blue-50 text-[#1E40AF] border-blue-200 text-[11px]">
              TPO Cohort Roster &amp; Student Detail Inspector
            </Badge>
            <Badge className="bg-amber-50 text-amber-900 border-amber-300 text-[11px]">
              SAMPLE SANDBOX — ILLUSTRATIVE DATA
            </Badge>
            <span className="text-xs text-slate-500 font-semibold">
              Institution: <strong>Apex Institute of Technology (Campus Code: APX123)</strong>
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Graduating Cohort Roster &amp; Student 360° Assurance Dossier
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Synchronized cohort funnel: <strong>510 Expected Cohort &rarr; 482 Registered &rarr; 428 Paid Enrolments &rarr; 412 Assessed &amp; Assurance-Eligible (1,002 of 1,236 Target Interviews Completed)</strong>.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/institution/drives">
            <Button size="sm" variant="outline" className="text-xs h-8">
              <Briefcase className="h-3.5 w-3.5 mr-1.5" />
              Manage Campus Drives &amp; Slots
            </Button>
          </Link>
          <Link href="/institution/overview">
            <Button size="sm" className="bg-[#1E40AF] hover:bg-blue-900 text-white text-xs h-8">
              Back to TPO Overview
            </Button>
          </Link>
        </div>
      </div>

      {/* Expanded Student Detail Inspector: Clicked Student = Aarav Sharma (APX2026CS042) */}
      <Card className="border-2 border-[#1E40AF] shadow-xs bg-white">
        <CardHeader className="pb-3 border-b border-slate-200 bg-blue-50/40">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-[#1E40AF]">
                SELECTED STUDENT 360° OPERATIONAL DOSSIER (CLICKED ROW: AARAV SHARMA • APX2026CS042)
              </span>
              <CardTitle className="text-lg font-bold text-slate-900 mt-0.5">
                Aarav Sharma &bull; Roll No: APX2026CS042 &bull; B.Tech Computer Science &amp; Engineering (2026)
              </CardTitle>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-emerald-700 text-white text-[11px]">
                Assurance Active: 1 of 3 Completed (1 Scheduled • 1 Being Matched)
              </Badge>
              <Badge className="bg-white text-slate-800 border-slate-300 text-[11px]">
                Standard Track (₹1,180 Paid)
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-5 space-y-5 text-xs">
          {/* Top 4 Operational Pillars: Academic Eligibility | Assessment Score | Attendance & SLA | Payment & Legal Record */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="p-3.5 rounded bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">
                1. Academic Eligibility
              </span>
              <div className="text-sm font-bold text-slate-900">CGPA: 8.64 / 10.0</div>
              <div className="text-[11px] text-emerald-700 font-semibold">
                0 Active Backlogs &bull; 10th: 93.4% &bull; 12th: 91.2%
              </div>
              <div className="text-[10px] text-slate-500">
                TPO Roster Verified on 14 Aug 2026
              </div>
            </div>

            <div className="p-3.5 rounded bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">
                2. 9-Area Assessment &amp; Score
              </span>
              <div className="text-sm font-bold text-[#1E40AF]">84 / 100 (91st Percentile)</div>
              <div className="text-[11px] text-slate-700">
                Tech: <strong>82</strong> | Comm: <strong>85</strong> | Ethics: <strong>90</strong> | Logic: <strong>80</strong>
              </div>
              <div className="text-[10px] text-emerald-700 font-semibold">
                Assurance Window: 18 Aug 2026 &rarr; 18 Aug 2027
              </div>
            </div>

            <div className="p-3.5 rounded bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">
                3. Attendance &amp; Refund Eligibility
              </span>
              <div className="text-sm font-bold text-emerald-800">100% Punctual (1/1 Attended)</div>
              <div className="text-[11px] text-slate-700">
                Unexcused No-Shows: <strong>0</strong> &bull; Offer Rejections: <strong>0</strong>
              </div>
              <div className="text-[10px] text-emerald-700 font-semibold">
                100% Base-Fee (₹1,000) Refund Protection Active
              </div>
            </div>

            <div className="p-3.5 rounded bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">
                4. Cashfree &amp; 6-Clause T&amp;C Vault
              </span>
              <div className="text-sm font-bold text-slate-900 font-mono">DOC-TC-88412</div>
              <div className="text-[11px] text-slate-700 font-mono">
                Invoice: PC-INV-STU-88412 (cf_pay_stu_99104421)
              </div>
              <div className="text-[10px] text-[#1E40AF] font-semibold">
                PC-STU-TC-2026.09-v4.1 (6 Clauses Accepted)
              </div>
            </div>
          </div>

          {/* Complete 3-Interview Assurance Ledger for Aarav Sharma */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase font-bold text-slate-800">
                5. AARAV SHARMA — 3-INTERVIEW ASSURANCE OPPORTUNITY LEDGER &amp; ATTENDANCE LOG
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                Canonical Path: Created &rarr; Matched &rarr; Scheduled &rarr; Attended &rarr; Completed &rarr; Counted Toward Assurance
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              <div className="p-3.5 rounded border border-emerald-300 bg-emerald-50/40 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-emerald-900">
                    OPPORTUNITY #1 OF 3
                  </span>
                  <Badge className="bg-emerald-700 text-white text-[10px]">
                    COMPLETED (COUNTED 1/3)
                  </Badge>
                </div>
                <div className="font-bold text-slate-900">
                  NexaTech Enterprise Systems India
                </div>
                <div className="text-[11px] text-slate-700">
                  Role: <strong>Full-Stack Software Engineer (₹8.5–12.0 LPA)</strong>
                </div>
                <div className="text-[11px] text-emerald-900 font-medium">
                  Round 1 Attended &amp; Completed on 12 Sep 2026 (Score: 86/100 &bull; Advanced to Round 2)
                </div>
              </div>

              <div className="p-3.5 rounded border border-blue-300 bg-blue-50/40 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-[#1E40AF]">
                    OPPORTUNITY #2 OF 3
                  </span>
                  <Badge className="bg-[#1E40AF] text-white text-[10px]">
                    SCHEDULED (28 SEP 2026)
                  </Badge>
                </div>
                <div className="font-bold text-slate-900">
                  FinCore Digital Systems India
                </div>
                <div className="text-[11px] text-slate-700">
                  Role: <strong>Backend Systems Engineer (₹9.0–11.5 LPA)</strong>
                </div>
                <div className="text-[11px] text-[#1E40AF] font-medium">
                  Confirmed Slot: 28 Sep 2026, 11:00 AM IST &bull; Counts as 2/3 upon Panel Completion
                </div>
              </div>

              <div className="p-3.5 rounded border border-slate-300 bg-slate-50 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-slate-600">
                    OPPORTUNITY #3 OF 3
                  </span>
                  <Badge className="bg-slate-200 text-slate-800 text-[10px]">
                    BEING MATCHED
                  </Badge>
                </div>
                <div className="font-bold text-slate-900">
                  QuantGrid Analytics India
                </div>
                <div className="text-[11px] text-slate-700">
                  Role: <strong>Full-Stack Product Analyst (₹8.0–10.5 LPA)</strong>
                </div>
                <div className="text-[11px] text-slate-600">
                  Candidate Shortlisted in Employer Pool &bull; Awaiting Interview Slot Release
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Complete Cohort Directory Table */}
      <Card className="border-slate-200 shadow-2xs bg-white">
        <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-slate-900">
              Graduating Cohort Roster (Showing 5 Representative Students of 482 Registered)
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Click any student row to inspect their Academic Eligibility, 9-Area Scorecard, 3-Interview Assurance Ledger, Attendance, and Accepted T&amp;C Document.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-500">
                <th className="py-3 px-4">Student Name &amp; Roll No</th>
                <th className="py-3 px-3">Department &amp; CGPA</th>
                <th className="py-3 px-3">Programme Track</th>
                <th className="py-3 px-3">9-Area Score</th>
                <th className="py-3 px-3">Interview Assurance (0/3–3/3)</th>
                <th className="py-3 px-3">Attendance Record</th>
                <th className="py-3 px-4">Candidate Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {TPO_COHORT_STUDENTS.map((stu) => (
                <tr
                  key={stu.id}
                  className={
                    stu.selected
                      ? 'bg-blue-50/50 border-l-4 border-l-[#1E40AF]'
                      : 'hover:bg-slate-50/80'
                  }
                >
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      {stu.name}
                      {stu.selected && (
                        <Badge className="bg-[#1E40AF] text-white text-[9px] px-1.5 py-0">
                          INSPECTED ABOVE
                        </Badge>
                      )}
                    </div>
                    <div className="font-mono text-[11px] text-slate-500">
                      {stu.enrollmentNumber}
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="font-medium text-slate-900">{stu.department}</div>
                    <div className="text-[11px] text-emerald-700 font-mono">
                      CGPA: {stu.cgpa} • {stu.backlogs} Backlogs
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-slate-700 font-medium">
                    {stu.programmeTrack}
                  </td>
                  <td className="py-3.5 px-3 font-mono font-bold text-[#1E40AF]">
                    {stu.assessmentScore}
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-slate-900">{stu.interviewAssurance}</div>
                    <div className="text-[11px] text-slate-500">{stu.interviewSubLabel}</div>
                  </td>
                  <td className="py-3.5 px-3 text-emerald-800 font-semibold">
                    {stu.attendanceRecord}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge
                      className={
                        stu.candidateStatus.startsWith('OFFER')
                          ? 'bg-emerald-700 text-white text-[10px]'
                          : 'bg-blue-50 text-[#1E40AF] border-blue-200 text-[10px]'
                      }
                    >
                      {stu.candidateStatus}
                    </Badge>
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
