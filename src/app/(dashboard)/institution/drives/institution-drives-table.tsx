'use client'

import * as React from "react"
import { EnterpriseDataTable, EnterpriseColumn } from "@/components/dashboard/enterprise-data-table"
import { Badge } from "@/components/ui/badge"
import { Building2, Calendar, Users, Briefcase, MapPin } from "lucide-react"

export interface InstitutionDriveRow {
  id: string
  companyName: string
  jobTitle: string
  driveDate: string
  mode: string
  departments: string
  minScore: number | null
  ctcText: string
  registeredCount: number
  status: string
}

export function InstitutionDrivesTable({ drives }: { drives: InstitutionDriveRow[] }) {
  const columns: EnterpriseColumn<InstitutionDriveRow>[] = [
    {
      header: "Visiting Employer",
      accessorKey: "companyName",
      cell: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs shrink-0">
            {row.companyName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-slate-900 text-xs">{row.companyName}</div>
            <div className="text-[11px] text-slate-400">{row.jobTitle}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Date & Schedule",
      accessorKey: "driveDate",
      cell: (row) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-700 font-mono">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          <span>{row.driveDate}</span>
        </div>
      ),
    },
    {
      header: "Mode",
      accessorKey: "mode",
      cell: (row) => (
        <Badge variant="outline" className="text-[10px] bg-slate-50 text-slate-700">
          {row.mode}
        </Badge>
      ),
    },
    {
      header: "Eligible Streams",
      accessorKey: "departments",
      cell: (row) => (
        <div className="text-xs text-slate-600 truncate max-w-[160px]" title={row.departments}>
          {row.departments}
        </div>
      ),
    },
    {
      header: "Package (CTC)",
      accessorKey: "ctcText",
      cell: (row) => (
        <span className="font-mono text-xs font-bold text-slate-900">
          {row.ctcText}
        </span>
      ),
    },
    {
      header: "Cutoff Score",
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
      header: "Student Enrolment",
      accessorKey: "registeredCount",
      cell: (row) => (
        <div className="flex items-center gap-1 font-mono text-xs font-semibold text-indigo-700">
          <Users className="h-3.5 w-3.5 text-indigo-500" />
          <span>{row.registeredCount} Candidates</span>
        </div>
      ),
    },
    {
      header: "Drive Status",
      accessorKey: "status",
      cell: (row) => {
        let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200'
        if (row.status === 'ACTIVE' || row.status === 'CONFIRMED') badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200'
        else if (row.status === 'SCHEDULED') badgeStyle = 'bg-blue-50 text-blue-700 border-blue-200'
        else if (row.status === 'COMPLETED') badgeStyle = 'bg-slate-100 text-slate-600 border-slate-300'

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
    { label: "Scheduled", value: "SCHEDULED" },
    { label: "Completed", value: "COMPLETED" },
  ]

  return (
    <EnterpriseDataTable
      columns={columns}
      data={drives}
      searchKey="companyName"
      searchPlaceholder="Search campus drive by employer or job role..."
      statusKey="status"
      statusOptions={statusOptions}
      exportFilename="campus-hiring-drives.csv"
      initialPageSize={10}
    />
  )
}
