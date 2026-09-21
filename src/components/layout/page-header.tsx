import * as React from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface StatusChipItem {
  label: string
  value: string
  variant?: 'success' | 'warning' | 'danger' | 'neutral'
}

export interface PageHeaderProps {
  breadcrumbs?: BreadcrumbItem[]
  breadcrumb?: BreadcrumbItem[]
  title: string
  description?: string
  statusChip?: React.ReactNode
  statusChips?: StatusChipItem[]
  actions?: React.ReactNode
  className?: string
}

/**
 * PlacementConnect Enterprise Operational Page Header
 * Implements the 6-question operational hierarchy:
 * 1. Where am I? (Breadcrumb + Title)
 * 2. What is happening? (Description + Status Chips)
 * 3. What should I do? (Actions)
 */
export function PageHeader({
  breadcrumbs,
  breadcrumb,
  title,
  description,
  statusChip,
  statusChips,
  actions,
  className = "",
}: PageHeaderProps) {
  const activeBreadcrumbs = breadcrumbs || breadcrumb

  return (
    <div className={`space-y-2 border-b border-slate-200/80 pb-4 dark:border-slate-800 ${className}`}>
      {/* Breadcrumb row */}
      {activeBreadcrumbs && activeBreadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500">
          {activeBreadcrumbs.map((crumb, idx) => {
            const isLast = idx === activeBreadcrumbs.length - 1
            return (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight className="h-3 w-3 text-slate-400 shrink-0" />}
                {crumb.href && !isLast ? (
                  <Link
                    href={crumb.href}
                    className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className={isLast ? "font-medium text-slate-800 dark:text-slate-200" : ""}>
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            )
          })}
        </nav>
      )}

      {/* Title, Status, and Actions bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-0.5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {title}
            </h1>
            {statusChips && statusChips.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                {statusChips.map((chip, i) => {
                  let variantClasses = "bg-slate-100 text-slate-700 border-slate-200"
                  if (chip.variant === 'success') variantClasses = "bg-emerald-50 text-emerald-700 border-emerald-200"
                  if (chip.variant === 'warning') variantClasses = "bg-amber-50 text-amber-700 border-amber-200"
                  if (chip.variant === 'danger') variantClasses = "bg-rose-50 text-rose-700 border-rose-200"
                  return (
                    <span
                      key={i}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono border ${variantClasses}`}
                    >
                      <span className="font-sans text-slate-500 font-normal">{chip.label}:</span>
                      <span className="font-bold tabular-nums">{chip.value}</span>
                    </span>
                  )
                })}
              </div>
            )}
            {statusChip && <div className="shrink-0">{statusChip}</div>}
          </div>
          {description && (
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}
