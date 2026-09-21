'use client'

import * as React from "react"
import { EnterpriseDataTable, EnterpriseColumn } from "@/components/dashboard/enterprise-data-table"
import { Badge } from "@/components/ui/badge"
import { Building2, CheckCircle2, ShieldAlert, Clock, Briefcase } from "lucide-react"

export interface AdminEmployerRow {
  id: string
  name: string
  industry: string
  location: string
  gstNumber: string
  status: string
  activeJobsCount: number
  placementsCount: number
  feeModel: string
  verifiedAt: string | null
}

export function AdminEmployerDirectory({ employers }: { employers: AdminEmployerRow[] }) {
  const columns: EnterpriseColumn<AdminEmployerRow>[] = [
    {
      header: "Corporate Partner",
      accessorKey: "name",
      cell: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700 font-bold text-xs shrink-0">
            {row.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-slate-900">{row.name}</div>
            <div className="text-[11px] text-slate-400">{row.industry || 'Technology & Services'}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Headquarters",
      accessorKey: "location",
      cell: (row) => (
        <div>
          <div className="text-xs text-slate-800">{row.location}</div>
          <div className="text-[10px] font-mono text-slate-400">GST: {row.gstNumber || 'Unregistered'}</div>
        </div>
      ),
    },
    {
      header: "Active Jobs",
      accessorKey: "activeJobsCount",
      cell: (row) => (
        <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-slate-800">
          <Briefcase className="h-3.5 w-3.5 text-slate-400" />
          <span>{row.activeJobsCount} Open</span>
        </div>
      ),
    },
    {
      header: "Verified Hires",
      accessorKey: "placementsCount",
      cell: (row) => (
        <span className="font-mono text-xs font-bold text-indigo-700">
          {row.placementsCount} Placed
        </span>
      ),
    },
    {
      header: "Fee Schedule",
      accessorKey: "feeModel",
      cell: (row) => (
        <Badge variant="outline" className="text-[10px] bg-slate-50 text-slate-700 border-slate-200">
          {row.feeModel}
        </Badge>
      ),
    },
    {
      header: "Verification Status",
      accessorKey: "status",
      cell: (row) => {
        let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200'
        if (row.status === 'APPROVED') badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200'
        else if (row.status === 'PENDING') badgeStyle = 'bg-amber-50 text-amber-700 border-amber-200'
        else if (row.status === 'SUSPENDED') badgeStyle = 'bg-rose-50 text-rose-700 border-rose-200'

        return (
          <Badge variant="outline" className={`text-[11px] font-semibold ${badgeStyle}`}>
            {row.status}
          </Badge>
        )
      },
    },
  ]

  const statusOptions = [
    { label: "Approved", value: "APPROVED" },
    { label: "Pending", value: "PENDING" },
    { label: "Suspended", value: "SUSPENDED" },
  ]

  return (
    <EnterpriseDataTable
      columns={columns}
      data={employers}
      searchKey="name"
      searchPlaceholder="Search employer by company name, industry, or city..."
      statusKey="status"
      statusOptions={statusOptions}
      exportFilename="platform-employers-directory.csv"
      initialPageSize={10}
    />
  )
}
