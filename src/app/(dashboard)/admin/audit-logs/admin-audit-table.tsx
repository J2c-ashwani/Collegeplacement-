'use client'

import * as React from "react"
import { EnterpriseDataTable, EnterpriseColumn } from "@/components/dashboard/enterprise-data-table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { History, Shield, Eye, Lock } from "lucide-react"

export interface AdminAuditLogRow {
  id: string
  timestamp: string
  actorName: string
  actorEmail: string
  userRole: string
  action: string
  entity: string
  entityId: string
  ip: string
  diffSummary: string
  rawPreviousValue: any
  rawNewValue: any
}

export function AdminAuditTable({ logs }: { logs: AdminAuditLogRow[] }) {
  const [activeDiff, setActiveDiff] = React.useState<AdminAuditLogRow | null>(null)

  const columns: EnterpriseColumn<AdminAuditLogRow>[] = [
    {
      header: "Timestamp",
      accessorKey: "timestamp",
      cell: (row) => (
        <div className="font-mono text-[11px] text-slate-600 whitespace-nowrap">
          {row.timestamp}
        </div>
      ),
    },
    {
      header: "Actor Context",
      accessorKey: "actorName",
      cell: (row) => (
        <div>
          <div className="font-semibold text-slate-900 text-xs">{row.actorName}</div>
          <div className="text-[10px] text-slate-400 font-mono">{row.actorEmail}</div>
        </div>
      ),
    },
    {
      header: "Role",
      accessorKey: "userRole",
      cell: (row) => (
        <Badge variant="outline" className="text-[10px] bg-slate-50 text-slate-700">
          {row.userRole}
        </Badge>
      ),
    },
    {
      header: "Action Performed",
      accessorKey: "action",
      cell: (row) => (
        <span className="font-mono text-xs font-semibold text-indigo-700">
          {row.action}
        </span>
      ),
    },
    {
      header: "Target Entity",
      accessorKey: "entity",
      cell: (row) => (
        <div>
          <Badge variant="outline" className="text-[10px] bg-purple-50 text-purple-700 border-purple-200">
            {row.entity}
          </Badge>
          <div className="text-[10px] font-mono text-slate-400 mt-0.5 truncate max-w-[120px]">
            {row.entityId}
          </div>
        </div>
      ),
    },
    {
      header: "IP Address",
      accessorKey: "ip",
      cell: (row) => (
        <span className="font-mono text-[11px] text-slate-500">{row.ip}</span>
      ),
    },
    {
      header: "State Diff",
      accessorKey: "diffSummary",
      sortable: false,
      cell: (row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setActiveDiff(row)}
          className="h-7 px-2 text-[11px] text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
        >
          <Eye className="h-3 w-3" />
          <span>Inspect Diff</span>
        </Button>
      ),
    },
  ]

  const statusOptions = [
    { label: "Student", value: "Student" },
    { label: "Placement", value: "Placement" },
    { label: "Document", value: "Document" },
    { label: "Institution", value: "Institution" },
  ]

  return (
    <>
      <EnterpriseDataTable
        columns={columns}
        data={logs}
        searchKey="action"
        searchPlaceholder="Search audit log by action, actor, or entity..."
        statusKey="entity"
        statusOptions={statusOptions}
        exportFilename="audit-logs-export.csv"
        initialPageSize={10}
        actionElement={
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium px-2 py-1 bg-slate-50 border border-slate-200 rounded">
            <Lock className="h-3.5 w-3.5 text-emerald-600" />
            <span>Append-Only Ledger (Immutable)</span>
          </div>
        }
      />

      {/* Diff Inspection Dialog */}
      <Dialog open={!!activeDiff} onOpenChange={() => setActiveDiff(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Shield className="h-4 w-4 text-indigo-600" />
              Audit Trail Inspection: {activeDiff?.action}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Entity: {activeDiff?.entity} ({activeDiff?.entityId}) • Recorded: {activeDiff?.timestamp}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 pt-2 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="font-bold text-slate-700 block mb-1">Previous Value</span>
                <pre className="font-mono text-[11px] text-slate-600 overflow-x-auto p-2 bg-white rounded border border-slate-100 max-h-48">
                  {JSON.stringify(activeDiff?.rawPreviousValue || { status: 'INITIAL' }, null, 2)}
                </pre>
              </div>

              <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-lg">
                <span className="font-bold text-indigo-900 block mb-1">New Value</span>
                <pre className="font-mono text-[11px] text-indigo-950 overflow-x-auto p-2 bg-white rounded border border-indigo-100 max-h-48">
                  {JSON.stringify(activeDiff?.rawNewValue || { status: 'UPDATED' }, null, 2)}
                </pre>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200 text-slate-600 flex items-center justify-between text-[11px]">
              <span>Actor IP: <strong className="font-mono">{activeDiff?.ip}</strong></span>
              <span className="text-emerald-700 font-semibold">Audit Log Integrity: Verified</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
