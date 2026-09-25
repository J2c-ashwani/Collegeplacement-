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
  CheckCircle2,
  Filter,
  SlidersHorizontal,
  Calendar,
  FileText,
  ShieldCheck,
  UserCheck,
  Sparkles,
  Building2,
  ArrowRight,
  Video,
} from 'lucide-react';

const CANONICAL_CANDIDATE_POOL = [
  {
    id: 'stu-apex-2026-01',
    name: 'Aarav Sharma',
    enrollmentNumber: 'APX2026CS042',
    institution: 'Apex Institute of Technology (APX123)',
    degreeBranch: 'B.Tech Computer Science & Engineering (2026)',
    cgpa: 8.64,
    backlogs: 0,
    overallScore: 84,
    percentile: '91st %ile',
    techScore: 82,
    problemSolving: 80,
    communication: 85,
    workEthics: 90,
    assuranceTrack: 'Standard Track',
    assuranceProgress: '1 of 3 Completed (1 Scheduled • 1 Being Matched)',
    shortlistStage: 'SHORTLISTED_ROUND_2',
    shortlistLabel: 'Shortlisted — Round 2 Technical Panel Ready',
    skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'System Design'],
  },
  {
    id: 'stu-apex-2026-02',
    name: 'Diya Nair',
    enrollmentNumber: 'APX2026CS018',
    institution: 'Apex Institute of Technology (APX123)',
    degreeBranch: 'B.Tech Computer Science & Engineering (2026)',
    cgpa: 9.12,
    backlogs: 0,
    overallScore: 88,
    percentile: '95th %ile',
    techScore: 89,
    problemSolving: 87,
    communication: 88,
    workEthics: 92,
    assuranceTrack: 'Extended Readiness Track',
    assuranceProgress: '2 of 3 Completed (1 Scheduled • 0 Being Matched)',
    shortlistStage: 'SHORTLISTED_ROUND_2',
    shortlistLabel: 'Shortlisted — Final Architecture Round',
    skills: ['Java', 'Spring Boot', 'Kubernetes', 'PostgreSQL', 'Distributed Systems'],
  },
  {
    id: 'stu-apex-2026-03',
    name: 'Rohan Kulkarni',
    enrollmentNumber: 'APX2026IT031',
    institution: 'Apex Institute of Technology (APX123)',
    degreeBranch: 'B.Tech Information Technology (2026)',
    cgpa: 8.28,
    backlogs: 0,
    overallScore: 81,
    percentile: '87th %ile',
    techScore: 80,
    problemSolving: 82,
    communication: 79,
    workEthics: 86,
    assuranceTrack: 'Standard Track',
    assuranceProgress: '1 of 3 Completed (1 Scheduled • 1 Being Matched)',
    shortlistStage: 'SHORTLISTED_ROUND_1',
    shortlistLabel: 'Shortlisted — Awaiting Slot Confirmation',
    skills: ['Python', 'FastAPI', 'React', 'Docker', 'SQL'],
  },
  {
    id: 'stu-apex-2026-04',
    name: 'Meera Krishnan',
    enrollmentNumber: 'APX2026CS064',
    institution: 'Apex Institute of Technology (APX123)',
    degreeBranch: 'B.Tech Computer Science & Engineering (2026)',
    cgpa: 8.45,
    backlogs: 0,
    overallScore: 79,
    percentile: '84th %ile',
    techScore: 78,
    problemSolving: 79,
    communication: 83,
    workEthics: 88,
    assuranceTrack: 'Extended Readiness Track',
    assuranceProgress: '1 of 3 Completed (1 Scheduled • 1 Being Matched)',
    shortlistStage: 'SHORTLISTED_ROUND_1',
    shortlistLabel: 'Shortlisted — Round 1 Technical Scheduled',
    skills: ['TypeScript', 'Next.js', 'GraphQL', 'AWS', 'Prisma'],
  },
  {
    id: 'stu-apex-2026-05',
    name: 'Kabir Malhotra',
    enrollmentNumber: 'APX2026EC012',
    institution: 'Apex Institute of Technology (APX123)',
    degreeBranch: 'B.Tech Electronics & Communication (2026)',
    cgpa: 7.92,
    backlogs: 0,
    overallScore: 77,
    percentile: '80th %ile',
    techScore: 76,
    problemSolving: 78,
    communication: 77,
    workEthics: 84,
    assuranceTrack: 'Standard Track',
    assuranceProgress: '0 of 3 Completed (1 Scheduled • 2 Being Matched)',
    shortlistStage: 'MATCHED_POOL',
    shortlistLabel: 'Matched Pool — Eligible for Shortlist',
    skills: ['C++', 'Python', 'Embedded Linux', 'REST APIs', 'SQL'],
  },
];

export default async function EmployerCandidatesPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  const featured = CANONICAL_CANDIDATE_POOL[0]; // Aarav Sharma

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <Badge className="bg-blue-50 text-[#1E40AF] border-blue-200 text-[11px]">
              Recruiter Sourcing &amp; Shortlisting Workflow
            </Badge>
            <Badge className="bg-amber-50 text-amber-900 border-amber-300 text-[11px]">
              SAMPLE SANDBOX — ILLUSTRATIVE DATA
            </Badge>
            <span className="text-xs text-slate-500 font-medium">
              Employer: <strong>NexaTech Enterprise Systems India</strong>
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Job &rarr; Matching Candidates (42) &rarr; Shortlist (10) &rarr; Candidate Detail &amp; Interview Schedule
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Filter verified graduating cohorts by 9-Dimension Employability Score, compare sub-scores side-by-side, inspect full candidate telemetry, and schedule verified assurance interviews in one workflow.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/employer/interviews">
            <Button size="sm" variant="outline" className="text-xs h-8">
              <Calendar className="h-3.5 w-3.5 mr-1.5" />
              Open Interview &amp; Evaluation Rubric (14 Active)
            </Button>
          </Link>
          <Link href="/employer/overview">
            <Button size="sm" className="bg-[#1E40AF] hover:bg-blue-900 text-white text-xs h-8">
              Back to Employer Overview
            </Button>
          </Link>
        </div>
      </div>

      {/* Step 1 & Step 2: Active Job Selector + Rapid Shortlist Filter Bar (42 Matches -> 10 Shortlisted) */}
      <Card className="border-slate-200 shadow-2xs bg-white">
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-mono uppercase font-bold text-[#1E40AF]">
                STEP 1 &amp; 2 — ACTIVE JOB REQUISITION &amp; PRECISION SHORTLIST FILTERS
              </span>
              <CardTitle className="text-base font-bold text-slate-900 mt-0.5">
                Active Role: Full-Stack Software Engineer (SDE-1) &bull; ₹8.5 – 12.0 LPA &bull; Bengaluru / Hybrid
              </CardTitle>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="px-3 py-1.5 rounded bg-slate-100 border border-slate-200 font-semibold text-slate-700">
                Total Role-Matched Pool: <strong>42 Candidates</strong>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 hidden sm:inline" />
              <div className="px-3 py-1.5 rounded bg-emerald-50 border border-emerald-300 font-bold text-emerald-900">
                Filtered &amp; Shortlisted: <strong>10 Candidates (Top 24%)</strong>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 bg-slate-50/70">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
            <div className="p-2.5 rounded bg-white border border-blue-300 ring-1 ring-blue-100">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                1. Min 9-Area Score
              </span>
              <strong className="text-slate-900 font-mono">&ge; 77 / 100 (Top 20%)</strong>
            </div>
            <div className="p-2.5 rounded bg-white border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                2. Eligible Branches
              </span>
              <strong className="text-slate-900">CSE, IT, ECE (2026)</strong>
            </div>
            <div className="p-2.5 rounded bg-white border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                3. Academic Cutoff
              </span>
              <strong className="text-slate-900">CGPA &ge; 7.50 • 0 Backlogs</strong>
            </div>
            <div className="p-2.5 rounded bg-white border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                4. Technical &amp; Logic
              </span>
              <strong className="text-slate-900">Tech &ge; 75 • Logic &ge; 75</strong>
            </div>
            <div className="p-2.5 rounded bg-white border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                5. Consent &amp; Verification
              </span>
              <strong className="text-emerald-700">TPO &amp; DPDP Consent ✓</strong>
            </div>
            <div className="flex items-center justify-center p-2 rounded bg-[#1E40AF] text-white font-semibold text-center">
              <span>Showing Top 5 of 10 Shortlisted</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Split View: Left 7 Cols = Candidate Comparison & Shortlist Table | Right 5 Cols = Candidate Detail & Direct Schedule Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: Step 3 — Candidate Pool Comparison & Shortlist Action Table */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="border-slate-200 shadow-2xs bg-white">
            <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase font-bold text-[#1E40AF]">
                  STEP 3 — SIDE-BY-SIDE CANDIDATE COMPARISON &amp; SHORTLIST MATRIX
                </span>
                <CardTitle className="text-sm font-bold text-slate-900 mt-0.5">
                  Pre-Assessed Candidates Matching SDE-1 Criteria (Click Row to Inspect &amp; Schedule)
                </CardTitle>
              </div>
              <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[11px]">
                Batch Shortlist Enabled
              </Badge>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-500">
                    <th className="py-2.5 px-3">Candidate &amp; Roll No</th>
                    <th className="py-2.5 px-2.5">9-Area Score</th>
                    <th className="py-2.5 px-2.5">Sub-Scores (Tech / Logic / Comm)</th>
                    <th className="py-2.5 px-2.5">CGPA</th>
                    <th className="py-2.5 px-3">Shortlist &amp; Assurance State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {CANONICAL_CANDIDATE_POOL.map((cand, idx) => {
                    const isSelected = idx === 0;
                    return (
                      <tr
                        key={cand.id}
                        className={
                          isSelected
                            ? 'bg-blue-50/50 border-l-4 border-l-[#1E40AF]'
                            : 'hover:bg-slate-50/80'
                        }
                      >
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            {cand.name}
                            {isSelected && (
                              <Badge className="bg-[#1E40AF] text-white text-[9px] px-1.5 py-0">
                                INSPECTING
                              </Badge>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            {cand.enrollmentNumber} &bull; {cand.degreeBranch.split('(')[0]}
                          </div>
                        </td>
                        <td className="py-3 px-2.5">
                          <div className="font-mono font-bold text-sm text-[#1E40AF]">
                            {cand.overallScore}/100
                          </div>
                          <span className="text-[10px] font-semibold text-emerald-700">
                            {cand.percentile}
                          </span>
                        </td>
                        <td className="py-3 px-2.5 font-mono text-[11px] text-slate-700">
                          <div>Tech: <strong>{cand.techScore}</strong> | Logic: <strong>{cand.problemSolving}</strong></div>
                          <div>Comm: <strong>{cand.communication}</strong> | Ethics: <strong>{cand.workEthics}</strong></div>
                        </td>
                        <td className="py-3 px-2.5 font-mono font-semibold text-slate-900">
                          {cand.cgpa.toFixed(2)}
                          <span className="block text-[10px] text-emerald-700 font-sans">0 Backlogs</span>
                        </td>
                        <td className="py-3 px-3">
                          <Badge
                            className={
                              cand.shortlistStage.startsWith('SHORTLISTED')
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 text-[10px]'
                                : 'bg-slate-100 text-slate-700 text-[10px]'
                            }
                          >
                            {cand.shortlistLabel}
                          </Badge>
                          <div className="text-[10px] text-slate-500 mt-1">
                            Assurance: <strong>{cand.assuranceProgress.split('(')[0]}</strong>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        {/* Right 5 Columns: Step 4 & Step 5 — Selected Candidate Deep Dossier & Instant Interview Scheduler */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border-2 border-[#1E40AF] shadow-xs bg-white">
            <CardHeader className="pb-3 border-b border-slate-100 bg-blue-50/40">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase font-bold text-[#1E40AF]">
                  STEP 4 — SELECTED CANDIDATE DOSSIER &amp; 9-AREA SCORECARD
                </span>
                <Badge className="bg-emerald-700 text-white text-[10px]">
                  91st Percentile Verified
                </Badge>
              </div>
              <CardTitle className="text-base font-bold text-slate-900 mt-1">
                {featured.name} ({featured.enrollmentNumber})
              </CardTitle>
              <CardDescription className="text-xs text-slate-600">
                {featured.institution} &bull; {featured.degreeBranch} &bull; CGPA: <strong>{featured.cgpa}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4 text-xs">
              {/* Synchronized 3-Interview Assurance State */}
              <div className="p-3 rounded bg-emerald-50/70 border border-emerald-200 space-y-1">
                <div className="flex items-center justify-between font-bold text-emerald-950">
                  <span>Synchronized 3-Interview Assurance Status</span>
                  <span className="font-mono">1 of 3 Completed</span>
                </div>
                <p className="text-[11px] text-emerald-900">
                  <strong>1 Completed</strong> (NexaTech Round 1 Technical — Attended &amp; Verified) &bull;{' '}
                  <strong>1 Scheduled</strong> (FinCore Digital — 28 Sep 2026) &bull;{' '}
                  <strong>1 Being Matched</strong> (QuantGrid Analytics)
                </p>
              </div>

              {/* 9-Dimension Sub-Score Grid */}
              <div className="space-y-1.5">
                <div className="font-bold text-slate-800 uppercase text-[10px] tracking-wider">
                  9-Dimension Employability Diagnostic Breakdown (Overall: 84/100)
                </div>
                <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                  <div className="p-2 rounded bg-slate-50 border border-slate-200 flex justify-between">
                    <span>1. Technical Readiness</span>
                    <strong className="text-[#1E40AF]">82/100</strong>
                  </div>
                  <div className="p-2 rounded bg-slate-50 border border-slate-200 flex justify-between">
                    <span>2. Situational Comm.</span>
                    <strong className="text-[#1E40AF]">85/100</strong>
                  </div>
                  <div className="p-2 rounded bg-slate-50 border border-slate-200 flex justify-between">
                    <span>3. Work Ethics</span>
                    <strong className="text-emerald-700">90/100</strong>
                  </div>
                  <div className="p-2 rounded bg-slate-50 border border-slate-200 flex justify-between">
                    <span>4. Problem Solving</span>
                    <strong className="text-[#1E40AF]">80/100</strong>
                  </div>
                  <div className="p-2 rounded bg-slate-50 border border-slate-200 flex justify-between">
                    <span>5. Learning Agility</span>
                    <strong className="text-emerald-700">88/100</strong>
                  </div>
                  <div className="p-2 rounded bg-slate-50 border border-slate-200 flex justify-between">
                    <span>6. Team Collaboration</span>
                    <strong className="text-[#1E40AF]">84/100</strong>
                  </div>
                  <div className="p-2 rounded bg-slate-50 border border-slate-200 flex justify-between">
                    <span>7. Professional Decor.</span>
                    <strong className="text-emerald-700">86/100</strong>
                  </div>
                  <div className="p-2 rounded bg-slate-50 border border-slate-200 flex justify-between">
                    <span>8. Interview Poise</span>
                    <strong className="text-[#1E40AF]">85/100</strong>
                  </div>
                </div>
              </div>

              {/* Step 5: Direct Interview Scheduling Action Box */}
              <div className="p-3.5 rounded-md bg-slate-900 text-white space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-blue-300 font-bold">
                    STEP 5 — SCHEDULE INTERVIEW ROUND / PANEL SLOT
                  </span>
                  <Badge className="bg-blue-600 text-white text-[10px]">
                    Counts Toward Assurance
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-slate-800 p-2 rounded border border-slate-700">
                    <span className="text-slate-400 block text-[10px]">Selected Round</span>
                    <strong>Round #2 — System Design &amp; Hiring Manager</strong>
                  </div>
                  <div className="bg-slate-800 p-2 rounded border border-slate-700">
                    <span className="text-slate-400 block text-[10px]">Proposed Slot (IST)</span>
                    <strong>30 Sep 2026 • 14:30 IST (Video Meet)</strong>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <Link href="/employer/interviews" className="w-full">
                    <Button className="w-full bg-[#1E40AF] hover:bg-blue-700 text-white text-xs h-9 font-semibold">
                      <Video className="h-3.5 w-3.5 mr-1.5" />
                      Confirm Interview Slot &amp; Dispatch Calendar Invite
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
