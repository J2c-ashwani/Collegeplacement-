import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Video, Calendar, Clock, ExternalLink, CheckCircle2, User, Building2 } from 'lucide-react'
import { MegaDriveSlotCoordinator } from '@/components/dashboard/mega-drive-slot-coordinator'

import { resolveEmployerId } from '@/lib/auth-utils'

export default async function EmployerInterviewsPage() {

  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  const employerId = await resolveEmployerId(session)
  if (!employerId && session.user.role === 'EMPLOYER') {
    redirect('/employer/profile')
  }

  if (!employerId) {
    redirect('/login')
  }

  const interviews = await prisma.interview.findMany({
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
      opportunity: true,
    },
    orderBy: { roundNumber: 'asc' },
  })

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
              Evaluation Management
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500">Multi-Round Candidate Evaluations</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Scheduled Interviews & Rounds</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage multi-round candidate interviews, video meeting rooms, and technical feedback.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-50 text-xs">
            {interviews.length} Scheduled Rounds
          </Badge>
        </div>
      </div>

      {/* Cluster Mega-Drive Slot Coordinator */}
      <MegaDriveSlotCoordinator />

      {/* Table */}
      <Card className="border-slate-200/80 shadow-xs bg-white overflow-hidden">

        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/80 border-b border-slate-200">
              <TableRow>
                <TableHead className="text-xs font-semibold uppercase text-slate-500 py-3">Candidate</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-slate-500">Job Opening</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-slate-500">Round</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-slate-500">Date & Meeting</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-slate-500">Status</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-slate-500 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {interviews.length > 0 ? (
                interviews.map((iv) => {
                  const isCompleted = iv.status === 'COMPLETED' || iv.status === 'SELECTED'

                  return (
                    <TableRow key={iv.id} className="hover:bg-slate-50/60 border-b border-slate-100 transition-colors">
                      <TableCell className="py-3.5">
                        <div className="font-semibold text-xs text-slate-900">{iv.student.user.name}</div>
                        <div className="text-[11px] text-slate-400">{iv.student.institution.name}</div>
                      </TableCell>

                      <TableCell className="text-xs text-slate-700 font-medium">
                        {iv.job.title}
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline" className="text-xs bg-indigo-50/50 text-indigo-700 border-indigo-200 font-normal">
                          {iv.roundName || `Round ${iv.roundNumber}`}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="text-xs text-slate-600 space-y-0.5">
                          <div>{iv.scheduledAt ? new Date(iv.scheduledAt).toLocaleString() : '10 Oct 2026, 2:00 PM'}</div>
                          {iv.meetingLink && (
                            <a
                              href={iv.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:underline flex items-center gap-1 font-medium text-[11px]"
                            >
                              Join Room <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge className={isCompleted ? "bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]" : "bg-indigo-50 text-indigo-700 border-indigo-200 text-[10px]"}>
                          {iv.status.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" className="text-xs h-7">
                          Evaluation Notes
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-xs text-slate-500">
                    No scheduled interviews found. Shortlist candidates to schedule interviews.
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
