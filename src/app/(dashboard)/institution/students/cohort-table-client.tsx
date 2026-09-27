'use client'

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Search, Filter, X } from 'lucide-react'

export interface CohortStudent {
  id: string
  name: string
  enrollmentNumber: string
  department: string
  cgpa: string
  backlogs: number
  programmeTrack: string
  assessmentScore: string
  interviewAssurance: string
  interviewSubLabel: string
  attendanceRecord: string
  candidateStatus: string
  selected?: boolean
}

interface CohortTableClientProps {
  students: CohortStudent[]
}

const TRACK_OPTIONS = ['ALL', 'Standard Track', 'Extended Readiness Track', 'Final-Chance Track']

export function CohortTableClient({ students }: CohortTableClientProps) {
  const [search, setSearch] = useState('')
  const [selectedTrack, setSelectedTrack] = useState<string>('ALL')

  const filteredStudents = useMemo(() => {
    return students.filter((stu) => {
      const matchesSearch =
        search.trim() === '' ||
        stu.name.toLowerCase().includes(search.toLowerCase()) ||
        stu.enrollmentNumber.toLowerCase().includes(search.toLowerCase()) ||
        stu.department.toLowerCase().includes(search.toLowerCase())

      const matchesTrack =
        selectedTrack === 'ALL' ||
        stu.programmeTrack.toLowerCase().includes(selectedTrack.toLowerCase())

      return matchesSearch && matchesTrack
    })
  }, [students, search, selectedTrack])

  const cycleTrack = () => {
    const currentIndex = TRACK_OPTIONS.indexOf(selectedTrack)
    const nextIndex = (currentIndex + 1) % TRACK_OPTIONS.length
    setSelectedTrack(TRACK_OPTIONS[nextIndex])
  }

  return (
    <Card className="border-slate-200/80 shadow-xs bg-white">
      <CardHeader className="border-b border-slate-100 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <CardTitle className="text-base font-bold text-slate-900">
            Registered Student Cohort &amp; Placement Assurance Status ({filteredStudents.length} / {students.length})
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Click any student row to inspect their Academic Eligibility, 9-Area Scorecard, Progressive Assurance Ledger, Attendance, and Accepted T&amp;C Document.
          </CardDescription>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, roll no..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-7 py-1 text-xs border border-slate-200 rounded-md w-48 sm:w-56 focus:outline-none focus:ring-1 focus:ring-[#1E40AF]"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
          <Button
            size="sm"
            variant={selectedTrack === 'ALL' ? 'outline' : 'default'}
            onClick={cycleTrack}
            className={`text-xs h-7 gap-1 cursor-pointer ${
              selectedTrack !== 'ALL' ? 'bg-[#1E40AF] text-white hover:bg-blue-900' : ''
            }`}
          >
            <Filter className="h-3 w-3" />
            {selectedTrack === 'ALL' ? 'Filter Track' : `Track: ${selectedTrack}`}
          </Button>
          {selectedTrack !== 'ALL' && (
            <button
              onClick={() => setSelectedTrack('ALL')}
              className="text-xs text-slate-500 hover:text-slate-800 underline"
            >
              Reset
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs min-w-[850px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-500">
              <th className="py-3 px-4 sticky left-0 bg-slate-50 z-10 shadow-[1px_0_0_0_rgba(0,0,0,0.05)]">
                Student Name &amp; Roll No
              </th>
              <th className="py-3 px-3">Department &amp; CGPA</th>
              <th className="py-3 px-3">Programme Track</th>
              <th className="py-3 px-3">9-Area Score</th>
              <th className="py-3 px-3">Interview Assurance (0/3–3/3)</th>
              <th className="py-3 px-3">Attendance Record</th>
              <th className="py-3 px-4">Candidate Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((stu) => (
                <tr
                  key={stu.id}
                  className={
                    stu.selected
                      ? 'bg-blue-50/50 border-l-4 border-l-[#1E40AF]'
                      : 'hover:bg-slate-50/80'
                  }
                >
                  <td className="py-3.5 px-4 sticky left-0 bg-inherit z-10 shadow-[1px_0_0_0_rgba(0,0,0,0.05)]">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      {stu.name}
                      {stu.selected && (
                        <Badge className="bg-[#1E40AF] text-white text-[9px] px-1.5 py-0">
                          INSPECTED ABOVE
                        </Badge>
                      )}
                    </div>
                    <div className="font-mono text-[11px] text-slate-500">
                      {stu.enrollmentNumber}
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="font-medium text-slate-900">{stu.department}</div>
                    <div className="text-[11px] text-emerald-700 font-mono">
                      CGPA: {stu.cgpa} • {stu.backlogs} Backlogs
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-slate-700 font-medium">
                    {stu.programmeTrack}
                  </td>
                  <td className="py-3.5 px-3 font-mono font-bold text-[#1E40AF]">
                    {stu.assessmentScore}
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-slate-900">{stu.interviewAssurance}</div>
                    <div className="text-[11px] text-slate-500">{stu.interviewSubLabel}</div>
                  </td>
                  <td className="py-3.5 px-3 text-emerald-800 font-semibold">
                    {stu.attendanceRecord}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge
                      className={
                        stu.candidateStatus.startsWith('OFFER')
                          ? 'bg-emerald-700 text-white text-[10px]'
                          : stu.candidateStatus.includes('IN PROGRESS')
                          ? 'bg-blue-50 text-[#1E40AF] border-blue-300 text-[10px] font-medium'
                          : 'bg-slate-100 text-slate-800 border-slate-300 text-[10px]'
                      }
                    >
                      {stu.candidateStatus}
                    </Badge>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500 text-xs">
                  No students found matching your search or track filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}
