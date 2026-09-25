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
  Briefcase,
  Calendar,
  CheckCircle2,
  Building2,
  Users,
  Clock,
  ArrowRight,
  PlusCircle,
} from 'lucide-react';

const ACTIVE_CAMPUS_DRIVES = [
  {
    id: 'drv-2026-nexa',
    employerName: 'NexaTech Enterprise Systems India',
    roleTitle: 'Full-Stack Software Engineer (SDE-1)',
    packageCtc: '₹8.5 – 12.0 LPA',
    eligibilityRules: 'B.Tech CSE/IT • CGPA ≥ 7.50 • 9-Area Score ≥ 75/100 • 0 Backlogs',
    driveDates: '12 Sep 2026 (Round 1) • 30 Sep 2026 (Round 2)',
    eligibleCount: 142,
    shortlistedCount: 38,
    interviewSlotsAssigned: 38,
    attendedCompletedCount: 36,
    offersIssued: 14,
    status: 'ROUND 2 IN PROGRESS',
  },
  {
    id: 'drv-2026-fincore',
    employerName: 'FinCore Digital Systems India',
    roleTitle: 'Backend & Distributed Systems Engineer',
    packageCtc: '₹9.0 – 11.5 LPA',
    eligibilityRules: 'B.Tech CSE/IT/ECE • CGPA ≥ 7.50 • 9-Area Score ≥ 72/100 • 0 Backlogs',
    driveDates: '28 Sep 2026, 10:00 AM – 05:00 PM IST',
    eligibleCount: 168,
    shortlistedCount: 44,
    interviewSlotsAssigned: 44,
    attendedCompletedCount: 0,
    offersIssued: 0,
    status: 'SLOTS CONFIRMED (28 SEP)',
  },
  {
    id: 'drv-2026-quantgrid',
    employerName: 'QuantGrid Analytics India',
    roleTitle: 'Full-Stack Data & Product Analyst',
    packageCtc: '₹8.0 – 10.5 LPA',
    eligibilityRules: 'All Engineering Branches • CGPA ≥ 7.00 • 9-Area Score ≥ 70/100',
    driveDates: '05 Oct 2026 (Slot Allocation Active)',
    eligibleCount: 210,
    shortlistedCount: 52,
    interviewSlotsAssigned: 28,
    attendedCompletedCount: 0,
    offersIssued: 0,
    status: 'MATCHING & SLOT ALLOCATION',
  },
];

export default async function InstitutionDrivesPage() {
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
              TPO Campus Drive &amp; Interview Slot Management
            </Badge>
            <Badge className="bg-amber-50 text-amber-900 border-amber-300 text-[11px]">
              SAMPLE SANDBOX — ILLUSTRATIVE DATA
            </Badge>
            <span className="text-xs text-slate-500 font-semibold">
              Institution: <strong>Apex Institute of Technology (APX123)</strong>
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Create Drive &rarr; Select Employer &amp; Role &rarr; Eligibility &rarr; Students &rarr; Slots &rarr; Attendance &amp; Outcome
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Coordinate corporate recruitment drives, enforce branch/CGPA/readiness-score cutoffs, allocate verified interview slots, and track attendance against the 3-Interview Assurance commitment.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/institution/students">
            <Button size="sm" variant="outline" className="text-xs h-8">
              <Users className="h-3.5 w-3.5 mr-1.5" />
              Inspect Student Roster (482)
            </Button>
          </Link>
          <Link href="/institution/overview">
            <Button size="sm" className="bg-[#1E40AF] hover:bg-blue-900 text-white text-xs h-8">
              Back to TPO Dashboard
            </Button>
          </Link>
        </div>
      </div>

      {/* Create / Configure Campus Drive 6-Step Operational Console */}
      <Card className="border-2 border-[#1E40AF] shadow-2xs bg-white">
        <CardHeader className="pb-3 border-b border-slate-200 bg-blue-50/40">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-[#1E40AF]">
                TPO DRIVE CREATION &amp; INTERVIEW SLOT DISPATCH WORKFLOW
              </span>
              <CardTitle className="text-base font-bold text-slate-900 mt-0.5">
                Active Drive Configuration: FinCore Digital Systems India &bull; Backend Systems Engineer (28 Sep 2026)
              </CardTitle>
            </div>
            <Badge className="bg-emerald-700 text-white text-[11px]">
              44 Interview Slots Locked &amp; Dispatched
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-5 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            <div className="p-3 rounded bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-mono font-bold text-[#1E40AF] block">
                1. SELECT EMPLOYER
              </span>
              <strong className="text-slate-900 block mt-0.5">FinCore Digital Systems</strong>
              <span className="text-[11px] text-slate-500">Verified Corporate Partner</span>
            </div>
            <div className="p-3 rounded bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-mono font-bold text-[#1E40AF] block">
                2. SELECT ROLE &amp; CTC
              </span>
              <strong className="text-slate-900 block mt-0.5">Backend Engineer</strong>
              <span className="text-[11px] text-emerald-700 font-semibold">₹9.0 – 11.5 LPA</span>
            </div>
            <div className="p-3 rounded bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-mono font-bold text-[#1E40AF] block">
                3. ELIGIBILITY CUTOFFS
              </span>
              <strong className="text-slate-900 block mt-0.5">CGPA &ge; 7.5 • Score &ge; 72</strong>
              <span className="text-[11px] text-slate-500">CSE, IT, ECE • 0 Backlogs</span>
            </div>
            <div className="p-3 rounded bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-mono font-bold text-[#1E40AF] block">
                4. MATCHED STUDENTS
              </span>
              <strong className="text-slate-900 block mt-0.5">168 Eligible &rarr; 44 Shortlist</strong>
              <span className="text-[11px] text-slate-500">Includes Aarav Sharma</span>
            </div>
            <div className="p-3 rounded bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-mono font-bold text-[#1E40AF] block">
                5. INTERVIEW SLOTS
              </span>
              <strong className="text-slate-900 block mt-0.5">44 Slots (28 Sep 2026)</strong>
              <span className="text-[11px] text-slate-500">4 Parallel Tech Panels</span>
            </div>
            <div className="p-3 rounded bg-emerald-50 border border-emerald-300">
              <span className="text-[10px] font-mono font-bold text-emerald-900 block">
                6. ASSURANCE OUTCOME
              </span>
              <strong className="text-emerald-950 block mt-0.5">Counts as Opp #2 / #3</strong>
              <span className="text-[11px] text-emerald-800">Upon Panel Completion</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Campus Drives & Interview Outcome Ledger */}
      <Card className="border-slate-200 shadow-2xs bg-white">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-base font-bold text-slate-900">
            Scheduled &amp; Active Campus Drives Ledger (2026 Graduating Cohort)
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Real-time tracking of eligible cohort matches, shortlisted candidates, assigned interview slots, verified attendance, and offers issued.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-500">
                <th className="py-3 px-4">Employer &amp; Role</th>
                <th className="py-3 px-3">Package (CTC)</th>
                <th className="py-3 px-3">Eligibility &amp; Score Cutoffs</th>
                <th className="py-3 px-3">Eligible &rarr; Shortlisted</th>
                <th className="py-3 px-3">Slots &amp; Attendance</th>
                <th className="py-3 px-3">Offers</th>
                <th className="py-3 px-4">Drive Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {ACTIVE_CAMPUS_DRIVES.map((drv) => (
                <tr key={drv.id} className="hover:bg-slate-50/80">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{drv.employerName}</div>
                    <div className="text-[11px] text-[#1E40AF] font-medium">{drv.roleTitle}</div>
                  </td>
                  <td className="py-3.5 px-3 font-mono font-bold text-emerald-700">
                    {drv.packageCtc}
                  </td>
                  <td className="py-3.5 px-3 text-slate-700">
                    <div>{drv.eligibilityRules}</div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">{drv.driveDates}</div>
                  </td>
                  <td className="py-3.5 px-3 font-mono">
                    <strong>{drv.eligibleCount}</strong> Eligible &rarr;{' '}
                    <strong className="text-[#1E40AF]">{drv.shortlistedCount}</strong> Shortlisted
                  </td>
                  <td className="py-3.5 px-3 font-mono">
                    <div>Slots: <strong>{drv.interviewSlotsAssigned}</strong></div>
                    <div className="text-[11px] text-emerald-700">
                      Attended: <strong>{drv.attendedCompletedCount}</strong>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 font-mono font-bold text-slate-900">
                    {drv.offersIssued > 0 ? `${drv.offersIssued} Offers` : 'Upcoming'}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge className="bg-blue-50 text-[#1E40AF] border-blue-200 text-[10px]">
                      {drv.status}
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
