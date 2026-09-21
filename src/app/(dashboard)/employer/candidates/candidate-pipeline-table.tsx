'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Sparkles, Video, CheckCircle2, Trophy, Building2, Filter, X } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface CandidatePipelineTableProps {
  initialCandidates: any[]
  activeJobs?: { id: string; title: string; department?: string | null }[]
}

export function CandidatePipelineTable({ initialCandidates, activeJobs = [] }: CandidatePipelineTableProps) {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [scoreFilter, setScoreFilter] = React.useState('ALL')
  const [selectedCandidate, setSelectedCandidate] = React.useState<any>(null)
  const [scheduledIds, setScheduledIds] = React.useState<string[]>([])
  const [scheduleSuccess, setScheduleSuccess] = React.useState<string | null>(null)
  const [scheduleError, setScheduleError] = React.useState<string | null>(null)
  const [selectedJobId, setSelectedJobId] = React.useState<string>(activeJobs[0]?.id || '')
  const [roundName, setRoundName] = React.useState('Round 1: Technical Diagnostic & Problem Solving')
  const [mode, setMode] = React.useState<'VIDEO' | 'IN_PERSON'>('VIDEO')
  const [scheduledAt, setScheduledAt] = React.useState('2026-07-05T14:00')
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const filtered = initialCandidates.filter((c) => {
    const name = (c.user?.name || '').toLowerCase()
    const college = (c.institution?.name || '').toLowerCase()
    const branch = (c.profile?.branch || '').toLowerCase()
    const query = searchTerm.toLowerCase()

    const matchesSearch = name.includes(query) || college.includes(query) || branch.includes(query)
    const score = c.assessments?.[0]?.result?.overallScore || 75
    const matchesScore =
      scoreFilter === 'ALL' ||
      (scoreFilter === '80' && score >= 80) ||
      (scoreFilter === '85' && score >= 85)

    return matchesSearch && matchesScore
  })

  const handleSchedule = (candidate: any) => {
    setSelectedCandidate(candidate)
    setScheduleError(null)
    if (activeJobs.length > 0 && !selectedJobId) {
      setSelectedJobId(activeJobs[0].id)
    }
  }

  const confirmSchedule = async () => {
    if (!selectedCandidate) return
    const jobIdToUse = selectedJobId || activeJobs[0]?.id

    if (!jobIdToUse) {
      setScheduleError('Please create or select an active job opening before scheduling.')
      return
    }

    setIsSubmitting(true)
    setScheduleError(null)

    try {
      const res = await fetch('/api/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: selectedCandidate.id,
          jobId: jobIdToUse,
          roundName,
          mode,
          scheduledAt: new Date(scheduledAt).toISOString(),
          meetingLink: mode === 'VIDEO' ? 'https://meet.google.com/xyz-pc-eval' : undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error?.message || data.message || 'Failed to dispatch interview')
      }

      setScheduledIds((prev) => [...prev, selectedCandidate.id])
      setScheduleSuccess(`Interview invitation dispatched to ${selectedCandidate.user?.name}!`)
      setSelectedCandidate(null)
      setTimeout(() => setScheduleSuccess(null), 5000)
    } catch (err: any) {
      setScheduleError(err.message || 'Error assigning opportunity')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Toast banner if scheduled */}
      {scheduleSuccess && (
        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            {scheduleSuccess}
          </span>
          <button onClick={() => setScheduleSuccess(null)}>
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by student name, college, or branch..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 text-xs bg-slate-50 border-slate-200"
            />
          </div>

          <select
            value={scoreFilter}
            onChange={(e) => setScoreFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-slate-700 focus:outline-hidden"
          >
            <option value="ALL">All Diagnostic Scores</option>
            <option value="80">Top Scores (≥80/100)</option>
            <option value="85">Elite Scores (≥85/100)</option>
          </select>
        </div>

        <span className="text-xs text-slate-500 font-mono">
          {filtered.length} candidates matching
        </span>
      </div>

      {/* Schedule Interview Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">Schedule Interview Round</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Allocates to student&apos;s Placement Assurance Opportunity tracker
                </p>
              </div>
              <button onClick={() => setSelectedCandidate(null)} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            {scheduleError && (
              <div className="p-2.5 rounded-md bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium">
                {scheduleError}
              </div>
            )}

            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/60 text-xs space-y-1.5">
              <div className="font-semibold text-slate-900">{selectedCandidate.user?.name}</div>
              <div className="text-slate-500">{selectedCandidate.institution?.name} • {selectedCandidate.profile?.branch}</div>
              <div className="text-indigo-700 font-mono font-bold">
                Diagnostic Score: {Math.round(selectedCandidate.assessments?.[0]?.result?.overallScore || 82)}/100
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-slate-700">Target Job Opening</label>
                {activeJobs.length > 0 ? (
                  <select
                    value={selectedJobId}
                    onChange={(e) => setSelectedJobId(e.target.value)}
                    className="w-full mt-1 p-2 rounded-md border border-slate-200 text-xs bg-slate-50"
                  >
                    {activeJobs.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.title} ({j.department})
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="mt-1 p-2 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-[11px]">
                    No active job postings found. Please create a job opening first.
                  </div>
                )}
              </div>

              <div>
                <label className="font-medium text-slate-700">Interview Round</label>
                <select
                  value={roundName}
                  onChange={(e) => setRoundName(e.target.value)}
                  className="w-full mt-1 p-2 rounded-md border border-slate-200 text-xs bg-slate-50"
                >
                  <option value="Round 1: Technical Diagnostic & Problem Solving">Round 1: Technical Diagnostic & Problem Solving</option>
                  <option value="Round 2: Systems & Coding Architecture">Round 2: Systems & Coding Architecture</option>
                  <option value="Round 3: Behavioral & Culture Fit">Round 3: Behavioral & Culture Fit</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-slate-700">Interview Mode</label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as any)}
                  className="w-full mt-1 p-2 rounded-md border border-slate-200 text-xs bg-slate-50"
                >
                  <option value="VIDEO">Video Call (Google Meet / Zoom)</option>
                  <option value="IN_PERSON">Campus / Office In-Person</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-slate-700">Date & Time</label>
                <Input
                  type="datetime-local"
                  className="mt-1 text-xs"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t">
              <Button variant="outline" size="sm" onClick={() => setSelectedCandidate(null)} className="text-xs">
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={confirmSchedule}
                disabled={isSubmitting || activeJobs.length === 0}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs"
              >
                {isSubmitting ? 'Dispatching...' : 'Confirm & Dispatch Link'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Table Card */}
      <Card className="border-slate-200/80 shadow-xs bg-white overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/80 border-b border-slate-200">
              <TableRow>
                <TableHead className="text-xs font-semibold uppercase text-slate-500 py-3">Candidate</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-slate-500">Institution & Branch</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-slate-500">College CGPA</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-slate-500">Overall Diagnostic</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-slate-500">Verified Badges</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-slate-500 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => {
                const res = c.assessments?.[0]?.result
                const score = res?.overallScore ? Math.round(res.overallScore) : 80
                const isScheduled = scheduledIds.includes(c.id)

                return (
                  <TableRow key={c.id} className="hover:bg-slate-50/60 border-b border-slate-100 transition-colors">
                    <TableCell className="py-3.5">
                      <div className="font-semibold text-xs text-slate-900">{c.user?.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{c.enrollmentNumber}</div>
                    </TableCell>

                    <TableCell>
                      <div className="text-xs font-medium text-slate-800">{c.institution?.name}</div>
                      <div className="text-[11px] text-slate-500">{c.profile?.branch || 'Computer Science'} • 2026</div>
                    </TableCell>

                    <TableCell className="font-mono text-xs font-bold text-slate-800 tabular-nums">
                      {c.profile?.cgpa ? c.profile.cgpa.toFixed(2) : '8.20'}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-sm text-indigo-700 tabular-nums">
                          {score}/100
                        </span>
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] py-0">
                          Interview Ready
                        </Badge>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {c.badges?.slice(0, 2).map((b: any) => (
                          <Badge key={b.id} variant="outline" className="text-[10px] bg-slate-50 text-slate-700 border-slate-200">
                            {b.badge.name}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      {isScheduled ? (
                        <Badge className="bg-emerald-600 text-white text-[11px]">
                          <CheckCircle2 className="h-3 w-3 mr-1" /> Scheduled
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleSchedule(c)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-7"
                        >
                          <Video className="h-3.5 w-3.5 mr-1" /> Schedule
                        </Button>
                      )}
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
