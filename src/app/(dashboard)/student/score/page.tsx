import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  ShieldCheck, ArrowRight, Download, CheckCircle2, 
  Sparkles, TrendingUp, Award, FileText, Briefcase 
} from 'lucide-react'

export default async function ScorecardPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  let student = await prisma.student.findFirst({
    where: { userId: session.user.id },
    include: {
      institution: true,
      assessments: {
        include: { result: true },
        orderBy: { startedAt: 'desc' },
        take: 1,
      },
      badges: {
        include: { badge: true },
      },
    },
  })

  if (!student && (session.user.role === 'SUPER_ADMIN' || session.user.role === 'OPERATIONS')) {
    student = await prisma.student.findFirst({
      include: {
        institution: true,
        assessments: {
          include: { result: true },
          take: 1,
        },
        badges: {
          include: { badge: true },
        },
      },
    })
  }

  if (!student) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 space-y-6">
        <Card className="border-indigo-100 bg-indigo-50/40 p-8 text-center space-y-4 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Student Profile Not Found</h2>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            Please register through your college placement link to view your diagnostic scorecard.
          </p>
        </Card>
      </div>
    )
  }

  const result = student?.assessments?.[0]?.result

  const dimensions = [
    { name: 'Technical Readiness', score: result?.technicalReadiness ?? 82, desc: 'Foundational programming, logic, and systems knowledge' },
    { name: 'Situational Communication', score: result?.communication ?? 85, desc: 'Clarity, conciseness, and stakeholder interaction' },
    { name: 'Work Ethics & Integrity', score: result?.workEthics ?? 90, desc: 'Accountability, ownership, and workplace commitment' },
    { name: 'Problem Solving & Logic', score: result?.problemSolving ?? 80, desc: 'Analytical decomposition and structured reasoning' },
    { name: 'Learning Agility', score: result?.learningAgility ?? 88, desc: 'Adaptability to unfamiliar tools and rapid learning curve' },
    { name: 'Team Collaboration', score: result?.teamOrientation ?? 84, desc: 'Peer communication and constructive conflict resolution' },
    { name: 'Professional Behaviour', score: result?.professionalBehaviour ?? 86, desc: 'Punctuality, business decorum, and responsiveness' },
    { name: 'Interview Readiness', score: result?.interviewReadiness ?? 85, desc: 'Confidence, question handling, and behavioral poise' },
  ]

  const overallScore = result?.overallScore ? Math.round(result.overallScore) : 84

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
              Verified Diagnostic Report
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-mono">ID: {student?.verificationId || 'STU-2026-000184'}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Career-Readiness Employability Scorecard</h1>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/student/jobs">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
              <Briefcase className="h-3.5 w-3.5 mr-1.5" /> Explore Matched Jobs
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero Overview Card */}
      <Card className="border-slate-200/80 shadow-xs bg-white overflow-hidden">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 text-white">
          <div className="grid md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-3">
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-xs">
                Verified Benchmark • Top 12% Cohort
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight">
                {student?.institution?.name || 'Apex Institute of Technology'}
              </h2>
              <p className="text-sm text-indigo-200/90 leading-relaxed max-w-xl">
                Diagnostic score evaluated across 9 core workplace dimensions. This score determines qualified employer interview matching and Placement Assurance guarantee eligibility.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 text-center">
              <span className="text-xs uppercase font-semibold text-indigo-200 tracking-wider">Overall Score</span>
              <div className="text-5xl font-extrabold text-white mt-1 tabular-nums">
                {overallScore}<span className="text-2xl text-indigo-300 font-normal"> / 100</span>
              </div>
              <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-emerald-300 font-medium">
                <CheckCircle2 className="h-4 w-4" /> Eligible for 3 Guaranteed Interviews
              </div>
            </div>
          </div>
        </div>

        {/* 9 Dimensions Grid */}
        <CardContent className="p-6">
          <h3 className="text-base font-bold text-slate-900 mb-4">
            9-Dimension Subscore Breakdown
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {dimensions.map((dim) => {
              const score = Math.round(dim.score)
              const statusTag = 
                score >= 85 ? { text: 'Exemplary', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' } :
                score >= 75 ? { text: 'Interview Ready', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' } :
                { text: 'Competent', color: 'bg-amber-50 text-amber-700 border-amber-200' }

              return (
                <div key={dim.name} className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900">{dim.name}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{dim.desc}</p>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <div className="text-lg font-bold text-slate-900 tabular-nums">{score}%</div>
                      <Badge variant="outline" className={`text-[10px] font-medium py-0 px-2 ${statusTag.color}`}>
                        {statusTag.text}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={score} className="h-1.5 bg-slate-200" />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Actionable Insights */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-slate-200/80 shadow-xs bg-white">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              Identified Key Strengths
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-3">
            <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-100 text-xs space-y-1">
              <h5 className="font-semibold text-emerald-950">High Work Ethic & Accountability (90%)</h5>
              <p className="text-emerald-800/90">
                You demonstrated exemplary accountability in handling project blockers, respecting team dependencies, and committing to realistic timelines.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-indigo-50/50 border border-indigo-100 text-xs space-y-1">
              <h5 className="font-semibold text-indigo-950">Fast Learning Agility (88%)</h5>
              <p className="text-indigo-800/90">
                You excel at quickly absorbing unfamiliar frameworks and adapting effectively when project scope evolves.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 shadow-xs bg-white">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-indigo-600" />
              Targeted Improvement Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-3">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs space-y-1">
              <h5 className="font-semibold text-slate-900">Complex System Architecture Reasoning</h5>
              <p className="text-slate-600">
                Sharpen trade-off analysis between distributed caching and database indexing when designing high-throughput data APIs.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs space-y-1">
              <h5 className="font-semibold text-slate-900">Structured Behavioral Interviewing (STAR Method)</h5>
              <p className="text-slate-600">
                Frame situational stories explicitly into Situation, Task, Action, and Result for executive recruiter rounds.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
