'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Download, Filter, Eye, CheckCircle2, Trophy } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface StudentDirectoryTableProps {
  initialStudents: any[]
}

export function StudentDirectoryTable({ initialStudents }: StudentDirectoryTableProps) {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [selectedDept, setSelectedDept] = React.useState('ALL')
  const [selectedStatus, setSelectedStatus] = React.useState('ALL')

  const filteredStudents = initialStudents.filter((s) => {
    const nameMatch = (s.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    const rollMatch = (s.enrollmentNumber || '').toLowerCase().includes(searchTerm.toLowerCase())
    const emailMatch = (s.user?.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    const branch = s.profile?.branch || 'Computer Science'
    const status = s.status || 'REGISTERED'

    const matchesSearch = nameMatch || rollMatch || emailMatch
    const matchesDept = selectedDept === 'ALL' || branch.includes(selectedDept)
    const matchesStatus = selectedStatus === 'ALL' || status === selectedStatus

    return matchesSearch && matchesDept && matchesStatus
  })

  const exportCSV = () => {
    const headers = ['Roll No', 'Name', 'Email', 'Branch', 'CGPA', 'Diagnostic Score', 'Placement Status']
    const rows = filteredStudents.map((s) => [
      s.enrollmentNumber || '',
      s.user?.name || '',
      s.user?.email || '',
      s.profile?.branch || 'Computer Science',
      s.profile?.cgpa || '8.0',
      s.assessments?.[0]?.result?.overallScore ? Math.round(s.assessments[0].result.overallScore) : 'Pending',
      s.status || 'REGISTERED',
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'student_cohort_directory.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by student name, roll no, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 text-xs bg-slate-50 border-slate-200"
            />
          </div>

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-slate-700 focus:outline-hidden"
          >
            <option value="ALL">All Departments</option>
            <option value="Computer">Computer Science</option>
            <option value="Information">Information Technology</option>
            <option value="Electronics">Electronics</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-slate-700 focus:outline-hidden"
          >
            <option value="ALL">All Statuses</option>
            <option value="REGISTERED">Registered</option>
            <option value="ACTIVE">Enrolled (Paid)</option>
            <option value="PLACED">Placed 🎉</option>
          </select>
        </div>

        <Button onClick={exportCSV} variant="outline" size="sm" className="text-xs shrink-0">
          <Download className="h-3.5 w-3.5 mr-1.5 text-slate-500" /> Export CSV ({filteredStudents.length})
        </Button>
      </div>

      {/* Table Card */}
      <Card className="border-slate-200/80 shadow-xs bg-white overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/80 border-b border-slate-200">
              <TableRow>
                <TableHead className="text-xs font-semibold uppercase text-slate-500 py-3">Roll No</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-slate-500">Student Name</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-slate-500">Branch & Year</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-slate-500">Degree CGPA</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-slate-500">Diagnostic Score</TableHead>
                <TableHead className="text-xs font-semibold uppercase text-slate-500">Programme Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((s) => {
                  const score = s.assessments?.[0]?.result?.overallScore
                  const isPlaced = s.status === 'PLACED'

                  return (
                    <TableRow key={s.id} className="hover:bg-slate-50/60 border-b border-slate-100 transition-colors">
                      <TableCell className="font-mono text-xs text-indigo-700 font-semibold py-3.5">
                        {s.enrollmentNumber || 'APX2026CS001'}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-xs text-slate-900">{s.user?.name}</div>
                        <div className="text-[11px] text-slate-400">{s.user?.email}</div>
                      </TableCell>
                      <TableCell className="text-xs text-slate-600">
                        {s.profile?.branch || 'Computer Science'} • 2026
                      </TableCell>
                      <TableCell className="font-mono text-xs text-slate-800 font-semibold tabular-nums">
                        {s.profile?.cgpa ? s.profile.cgpa.toFixed(2) : '8.20'}
                      </TableCell>
                      <TableCell>
                        {score ? (
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-xs text-slate-900 tabular-nums">
                              {Math.round(score)}/100
                            </span>
                            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] py-0">
                              Ready
                            </Badge>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Pending</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            isPlaced
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : s.status === 'ACTIVE'
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }
                        >
                          {isPlaced ? 'Placed Confirmed' : s.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-xs text-slate-500">
                    No students match your filter criteria.
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
