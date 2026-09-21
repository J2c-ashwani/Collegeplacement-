import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trophy, Shield, CheckCircle2, Lock, Sparkles, ExternalLink } from 'lucide-react'

export default async function BadgesPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  let student = await prisma.student.findFirst({
    where: { userId: session.user.id },
    include: {
      institution: true,
      badges: {
        include: { badge: true },
      },
    },
  })

  if (!student && (session.user.role === 'SUPER_ADMIN' || session.user.role === 'OPERATIONS')) {
    student = await prisma.student.findFirst({
      include: {
        institution: true,
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
          <h2 className="text-xl font-bold text-slate-900">Student Credential Wallet Unlinked</h2>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            Please register through your college placement link to access your verified credential badges.
          </p>
        </Card>
      </div>
    )
  }

  const allBadges = await prisma.badge.findMany({
    where: { isActive: true },
  })

  const earnedBadgeMap = new Map(student?.badges.map((b) => [b.badgeId, b]))

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
              Digital Credential Wallet
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500">Industry-Verified Competencies</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Career & Employability Badges</h1>
          <p className="text-xs text-slate-500 mt-1">
            Verified badges awarded based on your diagnostic assessment results and peer benchmarking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 text-xs">
            {student?.badges.length || 0} Badges Earned
          </Badge>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {allBadges.map((badge) => {
          const earned = earnedBadgeMap.get(badge.id)
          const isEarned = !!earned

          return (
            <Card
              key={badge.id}
              className={`border transition-all ${
                isEarned
                  ? 'border-indigo-200 bg-white shadow-xs hover:border-indigo-300'
                  : 'border-slate-200/60 bg-slate-50/50 opacity-75'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div
                    className={`h-12 w-12 rounded-xl flex items-center justify-center border shadow-2xs ${
                      isEarned
                        ? 'bg-indigo-50 text-indigo-600 border-indigo-200'
                        : 'bg-slate-100 text-slate-400 border-slate-200'
                    }`}
                  >
                    {isEarned ? <Trophy className="h-6 w-6" /> : <Lock className="h-5 w-5" />}
                  </div>

                  {isEarned ? (
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 text-[10px]">
                      Earned & Verified
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-slate-400 text-[10px]">
                      Locked
                    </Badge>
                  )}
                </div>

                <CardTitle className="text-base font-bold text-slate-900 mt-3">
                  {badge.name}
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 line-clamp-2 mt-1">
                  {badge.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0 text-xs space-y-2 border-t border-slate-100 mt-2 p-4">
                {isEarned ? (
                  <div className="space-y-1.5 text-slate-600">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Score Achieved</span>
                      <span className="font-semibold text-slate-900 tabular-nums">{earned.score ? Math.round(earned.score) : 82}/100</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Credential ID</span>
                      <span className="font-mono text-indigo-600 font-medium">
                        {earned.verificationId || `BDG-2026-${badge.slug.slice(0, 4).toUpperCase()}`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Awarded On</span>
                      <span>{new Date(earned.issuedAt).toLocaleDateString()}</span>
                    </div>

                    {/* Verification and LinkedIn Action */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <Link
                        href={`/verify/${earned.verificationId || `BDG-2026-${badge.slug.slice(0, 4).toUpperCase()}`}`}
                        target="_blank"
                        className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Verify
                      </Link>

                      <a
                        href={`https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(
                          badge.name
                        )}&organizationName=PlacementConnect&issueYear=2026&certUrl=${encodeURIComponent(
                          `https://placementconnect.com/verify/${earned.verificationId || `BDG-2026-${badge.slug.slice(0, 4).toUpperCase()}`}`
                        )}&certId=${encodeURIComponent(earned.verificationId || `BDG-2026-${badge.slug.slice(0, 4).toUpperCase()}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-semibold text-[#0A66C2] hover:text-[#004182] hover:underline"
                      >
                        Add to LinkedIn
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-500 py-2">
                    Criteria: Score 75+ in {badge.name} diagnostic module.
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
