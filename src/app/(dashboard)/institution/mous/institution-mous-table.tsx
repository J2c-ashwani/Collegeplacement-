'use client'

import * as React from "react"
import { EnterpriseDataTable, EnterpriseColumn } from "@/components/dashboard/enterprise-data-table"
import { Badge } from "@/components/ui/badge"
import { FileText, Calendar, Building2, AlertTriangle, CheckCircle2, Clock } from "lucide-react"

export interface InstitutionMouRow {
  id: string
  partnerEntity: string
  signatories: string
  startDate: string
  expiryDate: string
  daysUntilExpiry: number
  status: string
  activitiesCount: number
  renewalAlert: boolean
}

export function InstitutionMousTable({ mous }: { mous: InstitutionMouRow[] }) {
  const columns: EnterpriseColumn<InstitutionMouRow>[] = [
    {
      header: "Corporate / Academic Partner",
      accessorKey: "partnerEntity",
      cell: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold text-xs shrink-0">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <div className="font-semibold text-slate-900 text-xs">{row.partnerEntity}</div>
            <div className="text-[11px] text-slate-400">Signatories: {row.signatories}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Effective Window",
      accessorKey: "startDate",
      cell: (row) => (
        <div className="text-xs text-slate-700 font-mono">
          <div>From: {row.startDate}</div>
          <div className="text-slate-400">To: {row.expiryDate}</div>
        </div>
      ),
    },
    {
      header: "Validity Status",
      accessorKey: "status",
      cell: (row) => {
        if (row.renewalAlert) {
          return (
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300 text-[11px] flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Expiring in {row.daysUntilExpiry} days
            </Badge>
          )
        }
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px]">
            {row.status}
          </Badge>
        )
      },
    },
    {
      header: "Industry Engagements",
      accessorKey: "activitiesCount",
      cell: (row) => (
        <div className="font-mono text-xs font-semibold text-slate-800">
          {row.activitiesCount} Activities Logged
        </div>
      ),
    },
  ]

  const statusOptions = [
    { label: "Active", value: "ACTIVE" },
    { label: "Expiring Soon", value: "EXPIRING_SOON" },
  ]

  return (
    <EnterpriseDataTable
      columns={columns}
      data={mous}
      searchKey="partnerEntity"
      searchPlaceholder="Search MoU by partner company or signatory..."
      statusKey="status"
      statusOptions={statusOptions}
      exportFilename="institutional-mous-ledger.csv"
      initialPageSize={10}
    />
  )
}
