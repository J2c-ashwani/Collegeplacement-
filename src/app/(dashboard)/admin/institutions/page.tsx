import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Building2, CheckCircle2, QrCode, ExternalLink, Users, Plus } from 'lucide-react'
import Link from 'next/link'

export default async function AdminInstitutionsPage() {
  const session = await auth()
  if (!session?.user?.id || (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'OPERATIONS')) {
    redirect('/login')
  }

  const institutions = await prisma.institution.findMany({
    include: {
      memberships: {
        include: { plan: true },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      rosters: {
        take: 1,
        orderBy: { graduationYear: 'desc' },
      },
      _count: {
        select: { students: true, placements: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
              Institutional Network
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500">Partner Accreditation & Memberships</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Partner Colleges & Universities</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage institutional placement agreements, active membership validity, and student batch denominators.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-50 text-xs">
            {institutions.length} Partner Institutions
          </Badge>
        </div>
      </div>

      {/* Table */}
      <Card className="border-slate-200/80 shadow-xs bg-white overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/80 border-b border-slate-200">
              <TableRow>
                <TableHead className="text-xs font-semibold uppercase text-slate-500 py-3">Institution</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-slate-500">Enrolment Code</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-slate-500">Active Plan</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-slate-500">Batch Denominator</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-slate-500">Registered</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-slate-500">Membership</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-slate-500 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {institutions.map((inst) => {
                const membership = inst.memberships[0]
                const roster = inst.rosters[0]
                const totalCohort = roster?.totalExpectedStudents || inst.estimatedStudentCount || 500
                const registered = inst._count.students
                const isActive = membership?.status === 'ACTIVE'

                return (
                  <TableRow key={inst.id} className="hover:bg-slate-50/60 border-b border-slate-100 transition-colors">
                    <TableCell className="py-3.5">
                      <div className="font-semibold text-xs text-slate-900">{inst.name}</div>
                      <div className="text-[11px] text-slate-400">
                        {inst.city}, {inst.state} • {inst.accreditation || 'Accredited'}
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="font-mono font-bold text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
                        {inst.registrationCode}
                      </span>
                    </TableCell>

                    <TableCell className="text-xs font-medium text-slate-700">
                      {membership?.plan?.name || 'Partner Plan'}
                    </TableCell>

                    <TableCell className="font-mono text-xs text-slate-800 font-semibold tabular-nums">
                      {totalCohort} Students
                    </TableCell>

                    <TableCell className="font-mono text-xs text-slate-800 tabular-nums">
                      {registered} Enrolled
                    </TableCell>

                    <TableCell>
                      <Badge className={isActive ? "bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]" : "bg-amber-50 text-amber-700 border-amber-200 text-[10px]"}>
                        {membership?.status || 'ACTIVE'}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <Link href={`/register/${inst.registrationCode}`} target="_blank">
                        <Button size="sm" variant="outline" className="text-xs h-7">
                          Portal <ExternalLink className="h-3 w-3 ml-1" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
