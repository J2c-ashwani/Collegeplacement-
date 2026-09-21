'use client'

import * as React from "react"
import { Search, ArrowUpDown, ArrowUp, ArrowDown, Download, ChevronLeft, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export interface EnterpriseColumn<T> {
  header: string
  accessorKey: keyof T | string
  sortable?: boolean
  cell?: (item: T) => React.ReactNode
}

interface FilterOption {
  label: string
  value: string
}

interface EnterpriseDataTableProps<T> {
  title?: string
  description?: string
  columns: EnterpriseColumn<T>[]
  data: T[]
  searchKey?: keyof T | string
  searchPlaceholder?: string
  statusKey?: keyof T | string
  statusOptions?: FilterOption[]
  exportFilename?: string
  initialPageSize?: number
  actionElement?: React.ReactNode
}

export function EnterpriseDataTable<T extends Record<string, any>>({
  title,
  description,
  columns,
  data,
  searchKey,
  searchPlaceholder = "Search records...",
  statusKey,
  statusOptions,
  exportFilename = "export.csv",
  initialPageSize = 10,
  actionElement,
}: EnterpriseDataTableProps<T>) {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [debouncedSearch, setDebouncedSearch] = React.useState("")
  const [selectedStatus, setSelectedStatus] = React.useState<string>("ALL")
  const [sortKey, setSortKey] = React.useState<string | null>(null)
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(initialPageSize)

  // 300ms search debounce for responsive UX
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      setCurrentPage(1)
    }, 250)
    return () => clearTimeout(handler)
  }, [searchTerm])

  // Status and debounced search filtering
  const filteredData = React.useMemo(() => {
    return data.filter((item) => {
      // Status filter
      if (statusKey && selectedStatus !== 'ALL') {
        const itemStatus = String(item[statusKey])
        if (itemStatus !== selectedStatus) return false
      }

      // Search term filter
      if (!debouncedSearch) return true
      if (searchKey) {
        const value = item[searchKey]
        return String(value ?? '').toLowerCase().includes(debouncedSearch.toLowerCase())
      }
      // If no single search key, search across all string/number fields
      return Object.values(item).some((val) =>
        String(val ?? '').toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    })
  }, [data, debouncedSearch, searchKey, statusKey, selectedStatus])

  // Sorting
  const sortedData = React.useMemo(() => {
    if (!sortKey) return filteredData
    return [...filteredData].sort((a, b) => {
      const valA = a[sortKey]
      const valB = b[sortKey]
      if (valA === valB) return 0
      if (valA === null || valA === undefined) return 1
      if (valB === null || valB === undefined) return -1
      if (valA < valB) return sortDirection === 'asc' ? -1 : 1
      return sortDirection === 'asc' ? 1 : -1
    })
  }, [filteredData, sortKey, sortDirection])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize))
  const paginatedData = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return sortedData.slice(start, start + pageSize)
  }, [sortedData, currentPage, pageSize])

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === 'asc') setSortDirection('desc')
      else {
        setSortKey(null)
        setSortDirection('asc')
      }
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  // CSV Exporter
  const handleExportCSV = () => {
    if (sortedData.length === 0) return
    const headers = columns.map((c) => c.header).join(',')
    const rows = sortedData.map((row) =>
      columns
        .map((col) => {
          const val = row[col.accessorKey]
          const stringVal = val === null || val === undefined ? '' : String(val)
          // Escape quotes
          return `"${stringVal.replace(/"/g, '""')}"`
        })
        .join(',')
    )
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', exportFilename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-4">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {(title || description) && (
          <div>
            {title && <h3 className="text-base font-semibold text-slate-900">{title}</h3>}
            {description && <p className="text-xs text-slate-500">{description}</p>}
          </div>
        )}
        <div className="flex flex-wrap items-center gap-2.5 ml-auto">
          {/* Debounced Search */}
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 text-xs h-9 bg-white"
            />
          </div>

          {/* Status Filter Chips / Options */}
          {statusOptions && (
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md text-xs font-medium">
              <button
                type="button"
                onClick={() => { setSelectedStatus('ALL'); setCurrentPage(1); }}
                className={`px-2.5 py-1 rounded transition-colors ${selectedStatus === 'ALL' ? 'bg-white shadow-2xs font-semibold text-indigo-700' : 'text-slate-600 hover:text-slate-900'}`}
              >
                All ({data.length})
              </button>
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => { setSelectedStatus(opt.value); setCurrentPage(1); }}
                  className={`px-2.5 py-1 rounded transition-colors ${selectedStatus === opt.value ? 'bg-white shadow-2xs font-semibold text-indigo-700' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {/* CSV Export */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="h-9 text-xs text-slate-700 hover:text-slate-900 flex items-center gap-1.5"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            Export CSV
          </Button>

          {actionElement}
        </div>
      </div>

      {/* Main Table Grid */}
      <div className="rounded-lg border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
        <Table>
          <TableHeader className="bg-slate-50/75">
            <TableRow>
              {columns.map((col, i) => (
                <TableHead
                  key={i}
                  className={`text-xs font-semibold text-slate-700 ${col.sortable !== false ? 'cursor-pointer select-none hover:text-indigo-600' : ''}`}
                  onClick={() => col.sortable !== false && handleSort(String(col.accessorKey))}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.header}</span>
                    {col.sortable !== false && (
                      sortKey === col.accessorKey ? (
                        sortDirection === 'asc' ? (
                          <ArrowUp className="h-3 w-3 text-indigo-600" />
                        ) : (
                          <ArrowDown className="h-3 w-3 text-indigo-600" />
                        )
                      ) : (
                        <ArrowUpDown className="h-3 w-3 text-slate-400 opacity-60" />
                      )
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center text-slate-500 text-sm">
                  No records matching criteria.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, i) => (
                <TableRow key={i} className="hover:bg-slate-50/60 transition-colors">
                  {columns.map((col, j) => (
                    <TableCell key={j} className="text-xs text-slate-700 py-3">
                      {col.cell ? col.cell(row) : String(row[col.accessorKey] ?? '—')}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination & Summary Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-4 py-3 border-t border-slate-200/80 bg-slate-50/50 text-xs text-slate-600">
          <div>
            Showing <span className="font-semibold text-slate-800">{sortedData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</span> to{' '}
            <span className="font-semibold text-slate-800">{Math.min(currentPage * pageSize, sortedData.length)}</span> of{' '}
            <span className="font-semibold text-slate-800">{sortedData.length}</span> entries
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8 px-2.5 text-xs"
            >
              <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Previous
            </Button>
            <span className="text-xs font-medium px-2">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="h-8 px-2.5 text-xs"
            >
              Next <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
