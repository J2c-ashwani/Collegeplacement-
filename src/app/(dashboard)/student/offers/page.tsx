import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trophy, CheckCircle2, Building2, Calendar, FileText, Download, DollarSign, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default async function StudentOffersPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  let student = await prisma.student.findFirst({
    where: { userId: session.user.id },
    include: {
      institution: true,
      opportunities: {
        where: { offer: { isNot: null } },
        include: {
          offer: {
            include: {
              job: true,
              employer: true,
              placement: true,
            },
          },
        },
      },
    },
  })

  if (!student && (session.user.role === 'SUPER_ADMIN' || session.user.role === 'OPERATIONS')) {
    student = await prisma.student.findFirst({
      include: {
        institution: true,
        opportunities: {
          where: { offer: { isNot: null } },
          include: {
            offer: {
              include: {
                job: true,
                employer: true,
                placement: true,
              },
            },
          },
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
            Please register through your college placement link to access your verified employment offers.
          </p>
        </Card>
      </div>
    )
  }

  const offers = student?.opportunities.map((o) => o.offer).filter(Boolean) || []

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Verified Corporate Placement
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500">Official Employment Offers</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Placement Offers & Joining</h1>
          <p className="text-xs text-slate-500 mt-1">
            Review your verified job offer letters, compensation breakdowns, and joining credentials.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 text-xs">
            {offers.length} Confirmed Offers
          </Badge>
        </div>
      </div>

      {offers.length > 0 ? (
        <div className="space-y-6">
          {offers.map((offer: any) => {
            const isAccepted = offer.status === 'OFFER_ACCEPTED' || offer.status === 'JOINED' || offer.placement

            return (
              <Card key={offer.id} className="border-emerald-200 shadow-xs bg-white overflow-hidden">
                <div className="p-6 bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                        {offer.employer?.name || 'Corporate Partner'}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs font-mono text-emerald-200">
                        {offer.placement?.placementCode || 'PLC-2026-000182'}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight">
                      {offer.job?.title || 'Junior Software Engineer'}
                    </h2>
                    <p className="text-xs text-slate-300 flex items-center gap-2">
                      <span>Location: {offer.location || 'Bengaluru'}</span>
                      <span>•</span>
                      <span>Joining Date: {offer.joiningDate ? new Date(offer.joiningDate).toLocaleDateString() : '01 July 2026'}</span>
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15 text-center shrink-0">
                    <span className="text-[11px] uppercase tracking-wider text-slate-300 font-semibold">Total CTC</span>
                    <div className="text-3xl font-black text-white tabular-nums mt-0.5">
                      ₹{offer.ctc ? (Number(offer.ctc) / 100000).toFixed(2) : '5.50'} LPA
                    </div>
                  </div>
                </div>

                <CardContent className="p-6 space-y-6">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80">
                      <span className="text-[11px] font-semibold uppercase text-slate-500">Fixed Base Salary</span>
                      <div className="text-lg font-bold text-slate-900 mt-1 tabular-nums">
                        ₹{offer.fixedSalary ? (Number(offer.fixedSalary) / 100000).toFixed(2) : '5.00'} LPA
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80">
                      <span className="text-[11px] font-semibold uppercase text-slate-500">Performance Incentive</span>
                      <div className="text-lg font-bold text-slate-900 mt-1 tabular-nums">
                        ₹{offer.variableSalary ? (Number(offer.variableSalary) / 100000).toFixed(2) : '0.50'} LPA
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80">
                      <span className="text-[11px] font-semibold uppercase text-slate-500">Probation Window</span>
                      <div className="text-lg font-bold text-slate-900 mt-1">
                        90 Days
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
                    <div className="text-xs text-slate-500">
                      Offer issued under the verified institutional placement partnership of {student?.institution?.name || 'Apex Institute of Technology'}.
                    </div>

                    <div className="flex items-center gap-3">
                      <Button variant="outline" size="sm" className="text-xs">
                        <Download className="h-3.5 w-3.5 mr-1.5" /> Download Offer Letter
                      </Button>
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold">
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Confirmed Accepted
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="p-12 text-center border-slate-200/80 bg-white">
          <Trophy className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No Offer Letters Yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            Complete your scheduled interview rounds in your Placement Assurance opportunity slots to unlock corporate job offers.
          </p>
          <div className="mt-4">
            <Link href="/student/interviews">
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
                View Scheduled Interviews
              </Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  )
}
