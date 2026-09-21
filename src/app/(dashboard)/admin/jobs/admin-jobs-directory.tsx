'use client'

import * as React from "react"
import { EnterpriseDataTable, EnterpriseColumn } from "@/components/dashboard/enterprise-data-table"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Building2, Users, CheckCircle2, Clock } from "lucide-react"

export interface AdminJobRow {
  id: string
  title: string
  department: string
  employerName: string
  workMode: string
  location: string
  ctcText: string
  status: string
  openings: number
  applicationsCount: number
  minScore: number | null
  postedDate: string
}

export function AdminJobsDirectory({ jobs }: { jobs: AdminJobRow[] }) {
  const columns: EnterpriseColumn<AdminJobRow>[] = [
    {
      header: "Job Title",
      accessorKey: "title",
      cell: (row) => (
        <div>
          <div className="font-semibold text-slate-900 text-xs">{row.title}</div>
          <div className="text-[11px] text-slate-400">{row.department}</div>
        </div>
      ),
    },
    {
      header: "Hiring Employer",
      accessorKey: "employerName",
      cell: (row) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-800 font-medium">
          <Building2 className="h-3.5 w-3.5 text-slate-400" />
          <span>{row.employerName}</span>
        </div>
      ),
    },
    {
      header: "Mode & Location",
      accessorKey: "location",
      cell: (row) => (
        <div>
          <Badge variant="outline" className="text-[10px] bg-slate-50 text-slate-700">
            {row.workMode}
          </Badge>
          <div className="text-[11px] text-slate-400 mt-0.5">{row.location}</div>
        </div>
      ),
    },
    {
      header: "Compensation (CTC)",
      accessorKey: "ctcText",
      cell: (row) => (
        <span className="font-mono text-xs font-bold text-slate-900">
          {row.ctcText}
        </span>
      ),
    },
    {
      header: "Openings & Pipeline",
      accessorKey: "applicationsCount",
      cell: (row) => (
        <div className="text-xs">
          <span className="font-bold text-indigo-700">{row.applicationsCount}</span>
          <span className="text-slate-400"> applicants</span>
          <div className="text-[11px] text-slate-500">{row.openings} vacancies</div>
        </div>
      ),
    },
    {
      header: "Score Cutoff",
      accessorKey: "minScore",
      cell: (row) =>
        row.minScore ? (
          <Badge variant="outline" className="text-[10px] font-mono bg-indigo-50 text-indigo-700 border-indigo-200">
            &ge; {row.minScore}%
          </Badge>
        ) : (
          <span className="text-slate-400 text-xs italic">Open</span>
        ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => {
        let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200'
        if (row.status === 'ACTIVE') badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200'
        else if (row.status === 'PENDING_APPROVAL') badgeStyle = 'bg-amber-50 text-amber-700 border-amber-200'
        else if (row.status === 'CLOSED') badgeStyle = 'bg-slate-100 text-slate-600 border-slate-300'

        return (
          <Badge variant="outline" className={`text-[11px] font-semibold ${badgeStyle}`}>
            {row.status}
          </Badge>
        )
      },
    },
  ]

  const statusOptions = [
    { label: "Active", value: "ACTIVE" },
    { label: "Pending Approval", value: "PENDING_APPROVAL" },
    { label: "Closed", value: "CLOSED" },
  ]

  return (
    <EnterpriseDataTable
      columns={columns}
      data={jobs}
      searchKey="title"
      searchPlaceholder="Search job title, employer, or location..."
      statusKey="status"
      statusOptions={statusOptions}
      exportFilename="platform-job-openings.csv"
      initialPageSize={10}
    />
  )
}
