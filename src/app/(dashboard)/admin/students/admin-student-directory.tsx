'use client'

import * as React from "react"
import { EnterpriseDataTable, EnterpriseColumn } from "@/components/dashboard/enterprise-data-table"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react"

export interface AdminStudentRow {
  id: string
  name: string
  email: string
  enrollmentNumber: string
  collegeName: string
  courseBranch: string
  employabilityScore: number | null
  status: string
  assuranceConsumed: number
  assuranceRemaining: number
  placedStatus: string
}

export function AdminStudentDirectory({ students }: { students: AdminStudentRow[] }) {
  const columns: EnterpriseColumn<AdminStudentRow>[] = [
    {
      header: "Candidate",
      accessorKey: "name",
      cell: (row) => (
        <div>
          <div className="font-semibold text-slate-900">{row.name}</div>
          <div className="text-[11px] text-slate-400">{row.email}</div>
        </div>
      ),
    },
    {
      header: "Enrollment ID",
      accessorKey: "enrollmentNumber",
      cell: (row) => (
        <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
          {row.enrollmentNumber}
        </span>
      ),
    },
    {
      header: "Partner College",
      accessorKey: "collegeName",
      cell: (row) => (
        <div>
          <div className="font-medium text-slate-800 text-xs">{row.collegeName}</div>
          <div className="text-[11px] text-slate-400">{row.courseBranch}</div>
        </div>
      ),
    },
    {
      header: "Employability Score",
      accessorKey: "employabilityScore",
      cell: (row) =>
        row.employabilityScore !== null ? (
          <div className="flex items-center gap-1.5">
            <span
              className={`font-mono font-bold text-xs ${
                row.employabilityScore >= 75
                  ? 'text-emerald-700'
                  : row.employabilityScore >= 60
                  ? 'text-blue-700'
                  : 'text-amber-700'
              }`}
            >
              {row.employabilityScore}%
            </span>
            {row.employabilityScore >= 75 && (
              <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200 px-1 py-0">
                Top Tier
              </Badge>
            )}
          </div>
        ) : (
          <span className="text-slate-400 text-xs italic">Pending Test</span>
        ),
    },
    {
      header: "Assurance Quota",
      accessorKey: "assuranceConsumed",
      cell: (row) => (
        <div className="text-xs">
          <span className="font-semibold text-indigo-700">{row.assuranceConsumed}</span>
          <span className="text-slate-400"> of 3 used</span>
          <div className="text-[11px] text-slate-500">{row.assuranceRemaining} remaining</div>
        </div>
      ),
    },
    {
      header: "Programme Status",
      accessorKey: "status",
      cell: (row) => {
        let badgeColor = 'bg-slate-100 text-slate-700 border-slate-200'
        if (row.status === 'PLACED') badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200'
        else if (row.status === 'ACTIVE') badgeColor = 'bg-indigo-50 text-indigo-700 border-indigo-200'
        else if (row.status === 'ASSESSMENT_PENDING') badgeColor = 'bg-amber-50 text-amber-700 border-amber-200'

        return (
          <Badge variant="outline" className={`text-[11px] font-semibold ${badgeColor}`}>
            {row.status}
          </Badge>
        )
      },
    },
  ]

  const statusOptions = [
    { label: "Active", value: "ACTIVE" },
    { label: "Placed", value: "PLACED" },
    { label: "Assessment Pending", value: "ASSESSMENT_PENDING" },
  ]

  return (
    <EnterpriseDataTable
      columns={columns}
      data={students}
      searchKey="name"
      searchPlaceholder="Search candidate by name, college, or enrollment..."
      statusKey="status"
      statusOptions={statusOptions}
      exportFilename="platform-students-directory.csv"
      initialPageSize={10}
    />
  )
}
