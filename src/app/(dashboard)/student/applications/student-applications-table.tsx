'use client'

import * as React from "react"
import { EnterpriseDataTable, EnterpriseColumn } from "@/components/dashboard/enterprise-data-table"
import { Badge } from "@/components/ui/badge"
import { Building2, Briefcase, Calendar, CheckCircle2, Clock, AlertCircle } from "lucide-react"

export interface StudentApplicationRow {
  id: string
  jobTitle: string
  companyName: string
  location: string
  appliedDate: string
  matchScore: number | null
  status: string
  ctcText: string
  stageFeedback: string
}

export function StudentApplicationsTable({ applications }: { applications: StudentApplicationRow[] }) {
  const columns: EnterpriseColumn<StudentApplicationRow>[] = [
    {
      header: "Position & Company",
      accessorKey: "jobTitle",
      cell: (row) => (
        <div>
          <div className="font-semibold text-slate-900 text-xs">{row.jobTitle}</div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
            <Building2 className="h-3 w-3 text-slate-400" />
            <span>{row.companyName}</span>
            <span>•</span>
            <span>{row.location}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Applied On",
      accessorKey: "appliedDate",
      cell: (row) => (
        <span className="font-mono text-xs text-slate-600">{row.appliedDate}</span>
      ),
    },
    {
      header: "Match Score",
      accessorKey: "matchScore",
      cell: (row) =>
        row.matchScore ? (
          <Badge variant="outline" className="text-xs font-mono font-bold bg-indigo-50 text-indigo-700 border-indigo-200">
            {row.matchScore}% Match
          </Badge>
        ) : (
          <span className="text-slate-400 text-xs italic">Evaluating</span>
        ),
    },
    {
      header: "Package (CTC)",
      accessorKey: "ctcText",
      cell: (row) => (
        <span className="font-mono text-xs font-bold text-slate-900">{row.ctcText}</span>
      ),
    },
    {
      header: "Hiring Pipeline Stage",
      accessorKey: "status",
      cell: (row) => {
        let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200'
        if (row.status === 'SELECTED' || row.status === 'OFFER_EXTENDED') {
          badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200'
        } else if (row.status === 'SHORTLISTED') {
          badgeStyle = 'bg-blue-50 text-blue-700 border-blue-200'
        } else if (row.status === 'INTERVIEW_SCHEDULED') {
          badgeStyle = 'bg-purple-50 text-purple-700 border-purple-200'
        } else if (row.status === 'REJECTED') {
          badgeStyle = 'bg-slate-100 text-slate-500 border-slate-200'
        }

        return (
          <div>
            <Badge variant="outline" className={`text-[11px] font-semibold ${badgeStyle}`}>
              {row.status}
            </Badge>
            <div className="text-[10px] text-slate-400 mt-1 max-w-[180px] truncate" title={row.stageFeedback}>
              {row.stageFeedback}
            </div>
          </div>
        )
      },
    },
  ]

  const statusOptions = [
    { label: "Selected", value: "SELECTED" },
    { label: "Shortlisted", value: "SHORTLISTED" },
    { label: "Applied", value: "APPLIED" },
  ]

  return (
    <EnterpriseDataTable
      columns={columns}
      data={applications}
      searchKey="jobTitle"
      searchPlaceholder="Search application by job title or company..."
      statusKey="status"
      statusOptions={statusOptions}
      exportFilename="student-job-applications.csv"
      initialPageSize={10}
    />
  )
}
