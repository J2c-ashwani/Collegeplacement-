import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Trophy, CheckCircle2, DollarSign, Building2, User, FileText } from 'lucide-react'

import { resolveEmployerId } from '@/lib/auth-utils'

export default async function EmployerOffersPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  const employerId = await resolveEmployerId(session)
  if (!employerId && session.user.role === 'EMPLOYER') {
    redirect('/employer/profile')
  }

  const offers = employerId
    ? await prisma.offer.findMany({
        where: { employerId },
        include: {
          student: {
            include: {
              user: true,
              profile: true,
              institution: true,
            },
          },
          job: true,
          placement: true,
        },
        orderBy: { createdAt: 'desc' },
      })
    : []

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Joining & Fee Ledger
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500">Corporate Employment Offers</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Offers & Verified Hires</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track extended employment offers, candidate acceptances, and joining verification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 text-xs">
            {offers.length} Active Offers
          </Badge>
        </div>
      </div>

      {/* Offers Table */}
      <Card className="border-slate-200/80 shadow-xs bg-white overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/80 border-b border-slate-200">
              <TableRow>
                <TableHead className="text-xs font-semibold uppercase text-slate-500 py-3">Candidate</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-slate-500">Institution</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-slate-500">Job Title</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-slate-500">Offered CTC</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-slate-500">Joining Date</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-slate-500">Offer Status</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-slate-500 text-right">Success Fee</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {offers.length > 0 ? (
                offers.map((offer) => {
                  const isAccepted = offer.status === 'OFFER_ACCEPTED' || offer.placement

                  return (
                    <TableRow key={offer.id} className="hover:bg-slate-50/60 border-b border-slate-100 transition-colors">
                      <TableCell className="py-3.5">
                        <div className="font-semibold text-xs text-slate-900">{offer.student.user.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{offer.student.enrollmentNumber}</div>
                      </TableCell>

                      <TableCell className="text-xs text-slate-600">
                        {offer.student.institution.name}
                      </TableCell>

                      <TableCell className="text-xs font-medium text-slate-800">
                        {offer.job.title}
                      </TableCell>

                      <TableCell className="font-mono text-xs font-bold text-slate-900 tabular-nums">
                        ₹{offer.ctc ? (Number(offer.ctc) / 100000).toFixed(2) : '5.50'} LPA
                      </TableCell>

                      <TableCell className="text-xs text-slate-500">
                        {offer.joiningDate ? new Date(offer.joiningDate).toLocaleDateString() : '01 July 2026'}
                      </TableCell>

                      <TableCell>
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                          {offer.status.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right font-mono text-xs text-emerald-700 font-bold">
                        ₹10,000 + GST
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-xs text-slate-500">
                    No active offers issued yet. Advance candidates from interview rounds to extend offers.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
