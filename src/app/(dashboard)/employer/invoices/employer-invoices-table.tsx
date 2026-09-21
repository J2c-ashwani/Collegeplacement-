'use client'

import * as React from "react"
import { EnterpriseDataTable, EnterpriseColumn } from "@/components/dashboard/enterprise-data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Download, CheckCircle2, Clock, AlertCircle } from "lucide-react"

export interface EmployerInvoiceRow {
  id: string
  invoiceNumber: string
  candidateName: string
  jobTitle: string
  joiningDate: string
  feeBasis: string
  subtotal: string
  gstAmount: string
  totalPayable: string
  status: string
  invoiceDate: string
}

export function EmployerInvoicesTable({ invoices }: { invoices: EmployerInvoiceRow[] }) {
  const columns: EnterpriseColumn<EmployerInvoiceRow>[] = [
    {
      header: "Invoice Reference",
      accessorKey: "invoiceNumber",
      cell: (row) => (
        <div>
          <div className="font-mono font-bold text-xs text-indigo-700">{row.invoiceNumber}</div>
          <div className="text-[11px] text-slate-400">Issued: {row.invoiceDate}</div>
        </div>
      ),
    },
    {
      header: "Candidate & Role",
      accessorKey: "candidateName",
      cell: (row) => (
        <div>
          <div className="font-semibold text-slate-900 text-xs">{row.candidateName}</div>
          <div className="text-[11px] text-slate-500">{row.jobTitle}</div>
        </div>
      ),
    },
    {
      header: "Joining Date",
      accessorKey: "joiningDate",
      cell: (row) => (
        <span className="font-mono text-xs text-slate-700">{row.joiningDate}</span>
      ),
    },
    {
      header: "Fee Policy",
      accessorKey: "feeBasis",
      cell: (row) => (
        <Badge variant="outline" className="text-[10px] bg-slate-50 text-slate-700 border-slate-200">
          {row.feeBasis}
        </Badge>
      ),
    },
    {
      header: "Tax Breakdown",
      accessorKey: "subtotal",
      cell: (row) => (
        <div className="text-xs text-slate-600 font-mono">
          <div>Base: {row.subtotal}</div>
          <div className="text-[11px] text-slate-400">GST (18%): {row.gstAmount}</div>
        </div>
      ),
    },
    {
      header: "Total Payable",
      accessorKey: "totalPayable",
      cell: (row) => (
        <span className="font-mono text-xs font-bold text-slate-900">
          {row.totalPayable}
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => {
        let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200'
        if (row.status === 'PAID') badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200'
        else if (row.status === 'GENERATED' || row.status === 'DUE') badgeStyle = 'bg-blue-50 text-blue-700 border-blue-200'
        else if (row.status === 'OVERDUE') badgeStyle = 'bg-rose-50 text-rose-700 border-rose-200'

        return (
          <Badge variant="outline" className={`text-[11px] font-semibold ${badgeStyle}`}>
            {row.status}
          </Badge>
        )
      },
    },
    {
      header: "Receipt",
      accessorKey: "id",
      sortable: false,
      cell: () => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => alert("Invoice PDF receipt downloaded.")}
          className="h-7 px-2 text-[11px] text-slate-700 hover:text-indigo-600 flex items-center gap-1"
        >
          <Download className="h-3 w-3" />
          <span>Receipt</span>
        </Button>
      ),
    },
  ]

  const statusOptions = [
    { label: "Paid", value: "PAID" },
    { label: "Generated", value: "GENERATED" },
    { label: "Overdue", value: "OVERDUE" },
  ]

  return (
    <EnterpriseDataTable
      columns={columns}
      data={invoices}
      searchKey="candidateName"
      searchPlaceholder="Search invoice by candidate, invoice number, or role..."
      statusKey="status"
      statusOptions={statusOptions}
      exportFilename="employer-success-fee-invoices.csv"
      initialPageSize={10}
    />
  )
}
