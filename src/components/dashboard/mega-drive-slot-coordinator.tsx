'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  calculateDriveCapacity,
  evaluateDriveAssuranceOutcome,
  DriveSlot,
  DriveSlotStatus,
} from '@/services/mega-drive.service'
import { Calendar, Clock, Users, CheckCircle2, XCircle, AlertTriangle, ShieldCheck, Sparkles, Plus } from 'lucide-react'

interface MegaDriveSlotCoordinatorProps {
  initialJobTitle?: string
  initialEmployerName?: string
  initialSlots?: Array<{
    id: string
    time: string
    interviewer: string
    candidate: string
    college: string
    status: DriveSlotStatus
    assuranceImpact: string
  }>
}

export function MegaDriveSlotCoordinator({
  initialJobTitle = 'Campus Hiring Drive (Batch 2026)',
  initialEmployerName = 'Corporate Partner',
  initialSlots = [],
}: MegaDriveSlotCoordinatorProps) {
  // Configurable Calculator State
  const [interviewers, setInterviewers] = useState<number>(3)
  const [durationHours, setDurationHours] = useState<number>(4)
  const [slotMinutes, setSlotMinutes] = useState<number>(20)
  const [breakMinutes, setBreakMinutes] = useState<number>(20)

  // Calculate live capacity based on user configuration
  const capacityResult = calculateDriveCapacity({
    durationHours,
    slotMinutes,
    interviewerCount: interviewers,
    breakMinutesTotal: breakMinutes,
  })

  const [slots, setSlots] = useState(initialSlots)

  // Handle status transitions with strict assurance accounting
  const handleUpdateStatus = (
    id: string,
    newStatus: 'ATTENDED' | 'NO_SHOW' | 'EMPLOYER_CANCELLED'
  ) => {
    const outcome = evaluateDriveAssuranceOutcome(id, newStatus)
    setSlots((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s
        return {
          ...s,
          status: newStatus,
          assuranceImpact: outcome.explanation,
        }
      })
    )
  }

  // Summary counts
  const totalSlotsCount = slots.length
  const attendedCount = slots.filter((s) => s.status === 'ATTENDED').length
  const noShowCount = slots.filter((s) => s.status === 'NO_SHOW').length
  const cancelledCount = slots.filter((s) => s.status === 'EMPLOYER_CANCELLED').length
  const openCount = slots.filter((s) => s.status === 'OPEN').length
  const confirmedCount = slots.filter((s) => s.status === 'CONFIRMED').length
  const deliveredQuotaCount = attendedCount + noShowCount

  return (
    <div className="space-y-6">
      {/* Drive Capacity Calculator Card */}
      <Card className="border-slate-200/80 shadow-xs bg-white">
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs uppercase font-bold tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                  Engine 1: Liquidity Industrializer
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-500">Configurable Interview Capacity Calculator</span>
              </div>
              <CardTitle className="text-lg font-bold text-slate-900">
                Cluster Mega-Drive Slot Coordinator
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-0.5">
                Calculate and deploy structured interview blocks across parallel evaluator panels to scale interview throughput.
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-300 font-bold px-3 py-1">
              Active Drive: {initialJobTitle}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Inputs Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Interviewers / Panels</Label>
              <Input
                type="number"
                min={1}
                max={20}
                value={interviewers}
                onChange={(e) => setInterviewers(Math.max(1, Number(e.target.value)))}
                className="text-xs font-semibold"
              />
              <p className="text-[11px] text-slate-400">Parallel evaluation streams</p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Drive Window (Hours)</Label>
              <Input
                type="number"
                min={1}
                max={12}
                value={durationHours}
                onChange={(e) => setDurationHours(Math.max(1, Number(e.target.value)))}
                className="text-xs font-semibold"
              />
              <p className="text-[11px] text-slate-400">Total continuous block</p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Slot Duration (Minutes)</Label>
              <Input
                type="number"
                min={10}
                max={60}
                step={5}
                value={slotMinutes}
                onChange={(e) => setSlotMinutes(Math.max(10, Number(e.target.value)))}
                className="text-xs font-semibold"
              />
              <p className="text-[11px] text-slate-400">Per candidate evaluation</p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Panel Breaks (Minutes)</Label>
              <Input
                type="number"
                min={0}
                max={120}
                step={5}
                value={breakMinutes}
                onChange={(e) => setBreakMinutes(Math.max(0, Number(e.target.value)))}
                className="text-xs font-semibold"
              />
              <p className="text-[11px] text-slate-400">Intermission buffer</p>
            </div>
          </div>

          {/* Calculated Capacity Telemetry */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-900 text-white">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Effective Time</div>
              <div className="text-2xl font-bold mt-1 text-white">{capacityResult.effectiveInterviewMinutes} mins</div>
              <p className="text-[11px] text-slate-400 mt-0.5">Excludes {breakMinutes}m break</p>
            </div>

            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Slots / Panel</div>
              <div className="text-2xl font-bold mt-1 text-indigo-300">{capacityResult.slotsPerInterviewer} slots</div>
              <p className="text-[11px] text-slate-400 mt-0.5">At {slotMinutes}m each</p>
            </div>

            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Total Capacity</div>
              <div className="text-2xl font-bold mt-1 text-emerald-400">{capacityResult.totalAvailableSlots} slots</div>
              <p className="text-[11px] text-slate-400 mt-0.5">Across {interviewers} panels</p>
            </div>

            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Assurance Lift</div>
              <div className="text-2xl font-bold mt-1 text-sky-300">+{capacityResult.totalAvailableSlots} Opps</div>
              <p className="text-[11px] text-slate-400 mt-0.5">Satisfies ~{Math.floor(capacityResult.totalAvailableSlots / 3)} students</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Drive Session & Assurance Accounting Ledger */}
      <Card className="border-slate-200/80 shadow-xs bg-white overflow-hidden">
        <CardHeader className="border-b border-slate-100 pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base font-bold text-slate-900">
                Active Mega-Drive Slot Ledger & Assurance Accounting
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Tracks available capacity vs. completed opportunities with strict cancellation and no-show quota rules.
              </CardDescription>
            </div>

            {/* Micro KPI Bar */}
            <div className="flex items-center gap-2 text-xs font-semibold flex-wrap">
              <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                Total: {totalSlotsCount}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                Attended: {attendedCount}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                No-Show: {noShowCount}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                Emp. Cancelled: {cancelledCount}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                Quota Consumed: {deliveredQuotaCount}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/80 border-b border-slate-200">
              <TableRow>
                <TableHead className="text-xs font-semibold uppercase text-slate-500 py-3">Slot ID / Time</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-slate-500">Panel</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-slate-500">Candidate / College</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-slate-500">Slot Status</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-slate-500">Assurance Impact</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-slate-500 text-right">Outcome Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {slots.map((s) => (
                <TableRow key={s.id} className="hover:bg-slate-50/60 border-b border-slate-100 transition-colors">
                  <TableCell className="py-3 font-medium text-xs text-slate-900">
                    <div className="font-mono text-indigo-600 font-semibold">{s.id}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <Clock className="h-3 w-3" />
                      {s.time}
                    </div>
                  </TableCell>

                  <TableCell className="text-xs text-slate-700">
                    {s.interviewer}
                  </TableCell>

                  <TableCell className="text-xs">
                    <div className="font-semibold text-slate-900">{s.candidate}</div>
                    <div className="text-[11px] text-slate-400">{s.college}</div>
                  </TableCell>

                  <TableCell>
                    {s.status === 'ATTENDED' && (
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 text-[10px]">
                        Attended
                      </Badge>
                    )}
                    {s.status === 'NO_SHOW' && (
                      <Badge className="bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-50 text-[10px]">
                        No-Show
                      </Badge>
                    )}
                    {s.status === 'EMPLOYER_CANCELLED' && (
                      <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50 text-[10px]">
                        Emp. Cancelled
                      </Badge>
                    )}
                    {s.status === 'CONFIRMED' && (
                      <Badge className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50 text-[10px]">
                        Confirmed
                      </Badge>
                    )}
                    {s.status === 'OPEN' && (
                      <Badge variant="outline" className="text-slate-500 text-[10px]">
                        Open Slot
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="text-xs text-slate-600 max-w-xs">
                    <span className="text-[11px] leading-tight block">
                      {s.assuranceImpact}
                    </span>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {s.status !== 'ATTENDED' && s.status !== 'OPEN' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleUpdateStatus(s.id, 'ATTENDED')}
                          className="h-7 px-2 text-xs text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
                        >
                          Mark Attended
                        </Button>
                      )}
                      {s.status !== 'NO_SHOW' && s.status !== 'OPEN' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleUpdateStatus(s.id, 'NO_SHOW')}
                          className="h-7 px-2 text-xs text-rose-700 hover:bg-rose-50 hover:text-rose-800"
                        >
                          No-Show
                        </Button>
                      )}
                      {s.status !== 'EMPLOYER_CANCELLED' && s.status !== 'OPEN' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleUpdateStatus(s.id, 'EMPLOYER_CANCELLED')}
                          className="h-7 px-2 text-xs text-amber-700 hover:bg-amber-50 hover:text-amber-800"
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
