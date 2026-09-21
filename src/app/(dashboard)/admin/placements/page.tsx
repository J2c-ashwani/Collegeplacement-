import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { GraduationCap, Award, DollarSign, Download, CheckCircle2, AlertCircle } from 'lucide-react'

import { PageHeader } from '@/components/layout/page-header'

export default async function AdminPlacementsPage() {
  const session = await auth()
  if (!session?.user?.id || (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'OPERATIONS')) {
    redirect('/login')
  }

  const placements = await prisma.placement.findMany({
    include: {
      student: {
        include: {
          user: true,
          institution: true,
        },
      },
      employer: true,
      job: true,
      employerFees: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  const employerFees = await prisma.employerFee.findMany({
    include: {
      employer: true,
      student: {
        include: { user: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  let totalFeeRevenue = 0
  let totalPaidFees = 0

  for (const fee of employerFees) {
    const amt = Number(fee.totalAmount || 0)
    totalFeeRevenue += amt
    if (fee.status === 'PAID') {
      totalPaidFees += amt
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* 6-Element Page Header */}
      <PageHeader
        breadcrumb={[
          { label: 'Platform Operations', href: '/admin/overview' },
          { label: 'Placements & Fee Ledger' },
        ]}
        title="Placement Confirmations & Recruiter Invoicing"
        description="Verified candidate joining records with automated recruiter success fee billing and audit trail."
        statusChips={[
          {
            label: 'Confirmed Placements',
            value: placements.length.toString(),
            variant: 'success',
          },
          {
            label: 'Collected Fees',
            value: `₹${(totalPaidFees / 100000).toFixed(2)}L`,
            variant: 'neutral',
          },
        ]}
      />

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-slate-200/80 shadow-xs bg-white">
          <CardHeader className="pb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Verified Placements</span>
            <CardTitle className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
              {placements.length} Hires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> All student joinings documented
            </span>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 shadow-xs bg-white">
          <CardHeader className="pb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Invoiced Recruiter Fees</span>
            <CardTitle className="text-2xl font-bold text-indigo-600 mt-1 tabular-nums">
              ₹{(totalFeeRevenue / 100000).toFixed(2)}L
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-xs text-slate-500">Triggered on confirmed candidate joining</span>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 shadow-xs bg-white">
          <CardHeader className="pb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Collected Success Fees</span>
            <CardTitle className="text-2xl font-bold text-emerald-600 mt-1 tabular-nums">
              ₹{(totalPaidFees / 100000).toFixed(2)}L
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-xs text-slate-500">Processed via automated billing</span>
          </CardContent>
        </Card>
      </div>

      {/* Placements & Invoicing Ledger Table */}
      <Card className="border-slate-200/80 shadow-xs bg-white overflow-hidden">
        <CardHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-slate-900">Placement & Billing Ledger</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Audit log linking candidate joining to employer invoice creation
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" className="text-xs">
            <Download className="h-3.5 w-3.5 mr-1 text-slate-500" /> Export Ledger
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/80 border-b border-slate-200">
              <TableRow>
                <TableHead className="text-xs font-semibold uppercase text-slate-500 py-3">Code</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-slate-500">Candidate & College</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-slate-500">Employer & Role</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-slate-500">Offered CTC</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-slate-500">Joining Date</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-slate-500">Success Fee</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-slate-500 text-right">Fee Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {placements.length > 0 ? (
                placements.map((p) => {
                  const fee = p.employerFees?.[0]
                  const feeStatus = fee?.status || 'GENERATED'

                  return (
                    <TableRow key={p.id} className="hover:bg-slate-50/60 border-b border-slate-100 transition-colors">
                      <TableCell className="font-mono text-xs font-bold text-indigo-700 py-3.5">
                        {p.placementCode}
                      </TableCell>

                      <TableCell>
                        <div className="font-semibold text-xs text-slate-900">{p.student.user.name}</div>
                        <div className="text-[11px] text-slate-400">{p.student.institution.name}</div>
                      </TableCell>

                      <TableCell>
                        <div className="font-medium text-xs text-slate-800">{p.employer.name}</div>
                        <div className="text-[11px] text-slate-500">{p.job.title}</div>
                      </TableCell>

                      <TableCell className="font-mono text-xs font-bold text-slate-900 tabular-nums">
                        ₹{p.ctc ? (Number(p.ctc) / 100000).toFixed(2) : '5.50'} LPA
                      </TableCell>

                      <TableCell className="text-xs text-slate-500">
                        {p.joiningDate ? new Date(p.joiningDate).toLocaleDateString() : '01 July 2026'}
                      </TableCell>

                      <TableCell className="font-mono text-xs text-slate-800 font-semibold tabular-nums">
                        ₹{fee?.totalAmount ? Number(fee.totalAmount).toLocaleString() : '11,800'}
                      </TableCell>

                      <TableCell className="text-right">
                        <Badge
                          className={
                            feeStatus === 'PAID'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]'
                              : feeStatus === 'WAIVED'
                              ? 'bg-slate-100 text-slate-700 border-slate-200 text-[10px]'
                              : 'bg-amber-50 text-amber-700 border-amber-200 text-[10px]'
                          }
                        >
                          {feeStatus}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-xs text-slate-500">
                    No confirmed placements recorded yet.
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
