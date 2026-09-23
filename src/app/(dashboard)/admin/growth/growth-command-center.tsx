'use client'

import * as React from "react"
import Link from "next/link"
import { toast } from "sonner"
import { 
  Building2, Briefcase, Users, Check,
  ChevronRight, HelpCircle, Lock,
  Globe, ShieldCheck, ArrowUpRight, Zap
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PageHeader } from "@/components/layout/page-header"

interface GrowthCommandCenterProps {
  initialData: {
    commandCenter: {
      assuranceCoverageRatio: number
      assuranceCoveragePercent: number
      capacityGap: number
      confirmedEmployerCapacity: number
      activePaidStudents: number
      requiredOpportunities: number
      remainingObligation: number
      deliveredOpportunities: number
      activeActionsCount: number
      pendingDraftsCount: number
      topMarketDeficits: { region: string; deficit: number; primaryDomain: string }[]
    }
    regionalClusters: {
      region: string
      activeStudents: number
      requiredQuota: number
      confirmedCapacity: number
      deficit: number
      coverageRatio: number
      topRoles: string[]
    }[]
    collegeFunnel: {
      discovered: number
      qualified: number
      contactIdentified: number
      outreachReady: number
      meetings: number
      mous: number
      paidInstitutions: number
    }
    employerFunnel: {
      discovered: number
      hiringNow: number
      qualified: number
      recruitersIdentified: number
      outreachReady: number
      meetings: number
      activeEmployers: number
      hiringCampaigns: number
    }
    actions: any[]
  }
}

export function GrowthCommandCenter({ initialData }: GrowthCommandCenterProps) {
  const [data, setData] = React.useState(initialData)
  const [actions, setActions] = React.useState(initialData.actions)
  const [selectedWhyAction, setSelectedWhyAction] = React.useState<any | null>(null)
  const [isApproving, setIsApproving] = React.useState(false)

  const handleApproveAction = async (actionId: string) => {
    try {
      const res = await fetch('/api/growth/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionId, intent: 'APPROVE' }),
      })
      if (!res.ok) throw new Error('Failed to approve action')

      setActions((prev) =>
        prev.map((a) => (a.id === actionId ? { ...a, status: 'APPROVED' } : a))
      )
      toast.success('Growth action approved and queued for execution')
    } catch {
      toast.error('Could not approve action')
    }
  }

  const handleBulkApproveSafe = async () => {
    setIsApproving(true)
    try {
      const res = await fetch('/api/growth/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bulkApproveSafe: true }),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error?.message || 'Approval failed')

      setActions((prev) =>
        prev.map((a) => (a.isSafeAction ? { ...a, status: 'APPROVED' } : a))
      )
      toast.success(result.data?.message || 'All safe actions approved successfully!')
    } catch (err: any) {
      toast.error(err.message || 'Bulk approval failed')
    } finally {
      setIsApproving(false)
    }
  }

  const pendingSafeCount = actions.filter(
    (a) => a.status === 'PENDING' && a.isSafeAction
  ).length

  const isBalanced = data.commandCenter.capacityGap === 0

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Page Header with 6-Element Operational Hierarchy */}
      <PageHeader
        breadcrumbs={[
          { label: "Admin Operations", href: "/admin/overview" },
          { label: "GrowthOS Control Tower" },
        ]}
        title="GrowthOS Command Center"
        description="Autonomous marketplace telemetry balancing higher education talent supply with active corporate fresher hiring demand via contractual 3N Assurance signals."
        statusChip={
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] text-xs font-semibold border ${
              isBalanced
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-rose-50 text-rose-800 border-rose-200"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isBalanced ? "bg-emerald-600" : "bg-rose-600"
              }`}
            />
            Coverage: {data.commandCenter.assuranceCoverageRatio}x •{" "}
            {isBalanced ? "Balanced" : `Deficit: ${data.commandCenter.capacityGap} slots`}
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <Link href="/admin/growth/outreach">
              <Button variant="outline" size="sm" className="text-xs border-slate-200">
                Outreach Vault
              </Button>
            </Link>
            <Button
              onClick={handleBulkApproveSafe}
              disabled={isApproving || pendingSafeCount === 0}
              className="bg-[#0F2744] hover:bg-[#1E40AF] text-white text-xs h-8 px-3 flex items-center gap-1.5 shadow-2xs"
            >
              <Check className="h-3.5 w-3.5" />
              <span>Approve All Safe Actions</span>
              {pendingSafeCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-mono">
                  {pendingSafeCount}
                </span>
              )}
            </Button>
          </div>
        }
      />

      {/* 2. Assurance Liquidity & Telemetry Matrix */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {/* Metric 1: Assurance Coverage */}
        <div className="pedl-card p-3.5">
          <div className="flex items-center justify-between">
            <span className="pedl-label text-[11px]">Assurance Coverage</span>
            <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="pedl-kpi-val text-2xl">
              {data.commandCenter.assuranceCoveragePercent}%
            </span>
            {data.commandCenter.capacityGap > 0 ? (
              <span className="text-[11px] font-semibold text-rose-700 font-mono bg-rose-50 px-1.5 py-0.5 rounded-[4px] border border-rose-200">
                Gap: {data.commandCenter.capacityGap}
              </span>
            ) : (
              <span className="text-[11px] font-semibold text-emerald-700 font-mono bg-emerald-50 px-1.5 py-0.5 rounded-[4px] border border-emerald-200">
                Balanced
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {data.commandCenter.deliveredOpportunities} delivered of {data.commandCenter.requiredOpportunities} total obligations
          </p>
        </div>

        {/* Metric 2: Employer Capacity */}
        <div className="pedl-card p-3.5">
          <div className="flex items-center justify-between">
            <span className="pedl-label text-[11px]">Employer Capacity</span>
            <Briefcase className="h-3.5 w-3.5 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="pedl-kpi-val text-2xl">
              {data.commandCenter.confirmedEmployerCapacity.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">slots</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Confirmed across {data.employerFunnel.activeEmployers} corporate hiring partners
          </p>
        </div>

        {/* Metric 3: Student Supply */}
        <div className="pedl-card p-3.5">
          <div className="flex items-center justify-between">
            <span className="pedl-label text-[11px]">Enrolled Student Supply</span>
            <Users className="h-3.5 w-3.5 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="pedl-kpi-val text-2xl">
              {data.commandCenter.activePaidStudents.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">students</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Contractual quota: {data.commandCenter.requiredOpportunities.toLocaleString()} opportunities
          </p>
        </div>

        {/* Metric 4: AI Actions Attention */}
        <div className="pedl-card p-3.5">
          <div className="flex items-center justify-between">
            <span className="pedl-label text-[11px]">Action Queue</span>
            <Zap className="h-3.5 w-3.5 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="pedl-kpi-val text-2xl">
              {actions.filter(a => a.status === 'PENDING').length}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">pending</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Prioritized by Impact × Urgency × Confidence
          </p>
        </div>

        {/* Metric 5: Top Market Deficits */}
        <div className="pedl-card p-3.5 col-span-2 md:col-span-1">
          <div className="flex items-center justify-between">
            <span className="pedl-label text-[11px]">Regional Liquidity Status</span>
            <Globe className="h-3.5 w-3.5 text-slate-400" />
          </div>
          <div className="mt-1.5">
            {(data.commandCenter.topMarketDeficits[0]?.deficit ?? 0) > 0 ? (
              <>
                <span className="text-sm font-bold text-rose-700 dark:text-rose-400 font-mono block">
                  {data.commandCenter.topMarketDeficits[0]?.region}: {data.commandCenter.topMarketDeficits[0]?.deficit} slots
                </span>
                <span className="text-[11px] text-slate-500 block truncate mt-0.5">
                  {data.commandCenter.topMarketDeficits[0]?.primaryDomain}
                </span>
              </>
            ) : (
              <>
                <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400 font-mono block">
                  0 Slot Deficit
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate mt-0.5">
                  All corridors above 1.2x threshold
                </span>
              </>
            )}
          </div>
          <p className="text-[11px] text-[#1E40AF] dark:text-blue-400 font-medium mt-1">
            {data.commandCenter.capacityGap > 0 ? 'Demand sourcing prioritized' : 'Ready for batch onboarding'}
          </p>
        </div>
      </div>

      {/* 3. Ranked AI Action Queue with Time & Velocity Context */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Zap className="h-4 w-4 text-[#1E40AF] dark:text-blue-400" />
              Ranked AI Action Queue
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Operations triage computed by: Impact × Urgency × Confidence ÷ Effort.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1 font-mono text-[11px]">
              <Lock className="h-3 w-3 text-slate-400" />
              Safe Action Policy Active
            </span>
          </div>
        </div>

        <div className="space-y-2.5">
          {actions.map((action) => {
            const isRed = action.priority === 'URGENT_RED'
            const isOrange = action.priority === 'HIGH_ORANGE'
            const isPending = action.status === 'PENDING'

            return (
              <div
                key={action.id}
                className="pedl-card p-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 max-w-3xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2 py-0.5 rounded-[4px] text-[10px] font-mono font-bold border ${
                        isRed
                          ? "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800"
                          : isOrange
                          ? "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800"
                          : "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                      }`}
                    >
                      {action.priority.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-slate-300 dark:text-slate-600">•</span>
                    <span className="text-[11px] font-mono font-bold text-[#0F2744] dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-[4px] border border-slate-200 dark:border-slate-700">
                      Score: {action.actionScore}
                    </span>
                    {action.isSafeAction && (
                      <span className="text-[10px] text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.5 rounded-[4px] font-medium flex items-center gap-1">
                        <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                        Policy Verified Safe
                      </span>
                    )}
                    {action.targetRegion && (
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Region: <strong className="text-slate-800 dark:text-slate-200">{action.targetRegion}</strong>
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{action.title}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-0.5">{action.description}</p>
                  </div>

                  {/* Execution & Provenance Context Ribbon */}
                  <div className="flex items-center gap-4 text-[11px] font-mono text-slate-500 dark:text-slate-400 flex-wrap pt-0.5">
                    <span>
                      Lifecycle:{" "}
                      <strong className={isPending ? "text-amber-700 dark:text-amber-400" : "text-emerald-700 dark:text-emerald-400"}>
                        {isPending ? "RECOMMENDED (Not Yet Contacted)" : "APPROVED FOR EXECUTION"}
                      </strong>
                    </span>
                    <span>
                      Category: <strong className="text-slate-800 dark:text-slate-200">{action.actionType || 'LIQUIDITY_BALANCE'}</strong>
                    </span>
                    {action.reasoning?.confidenceScore && (
                      <span>
                        Model Confidence: <strong className="text-slate-800 dark:text-slate-200">{action.reasoning.confidenceScore}</strong>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedWhyAction(action)}
                    className="h-8 text-xs text-[#0F2744] dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 flex items-center gap-1"
                  >
                    <HelpCircle className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                    <span>Why?</span>
                  </Button>

                  {isPending ? (
                    <Button
                      size="sm"
                      onClick={() => handleApproveAction(action.id)}
                      className="h-8 text-xs bg-[#0F2744] hover:bg-[#1E40AF] text-white"
                    >
                      Approve Action
                    </Button>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-[4px] border border-emerald-200 dark:border-emerald-800">
                      <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      Approved
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 4. Regional Supply & Demand Liquidity Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Globe className="h-4 w-4 text-[#1E40AF]" />
              Regional Supply & Demand Liquidity Matrix
            </h2>
            <span className="text-xs text-slate-400 font-mono">Current Operational Telemetry</span>
          </div>

          <div className="pedl-card overflow-hidden">
            <div className="divide-y divide-slate-100">
              {data.regionalClusters.map((cluster) => {
                const hasDeficit = cluster.deficit > 0
                return (
                  <div key={cluster.region} className="p-4 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-900">{cluster.region}</span>
                        <span
                          className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-[4px] border ${
                            hasDeficit
                              ? "bg-rose-50 text-rose-800 border-rose-200"
                              : "bg-emerald-50 text-emerald-800 border-emerald-200"
                          }`}
                        >
                          {cluster.coverageRatio}x Coverage
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-3">
                        <span>Students: <strong>{cluster.activeStudents}</strong></span>
                        <span>Quota ($3N$): <strong>{cluster.requiredQuota}</strong></span>
                        <span>Capacity: <strong>{cluster.confirmedCapacity}</strong></span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      {hasDeficit ? (
                        <div className="space-y-0.5">
                          <span className="text-xs font-mono font-bold text-rose-700 block">
                            -{cluster.deficit} slots deficit
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">Est. 4.5 wks to close</span>
                        </div>
                      ) : (
                        <span className="text-xs font-mono font-bold text-emerald-700 block">
                          Balanced
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* 5. GrowthOS CRM Workspaces */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-slate-900">GrowthOS CRM Workspaces</h2>
          
          <div className="space-y-2.5">
            <Link href="/admin/growth/colleges" className="block group">
              <div className="pedl-card p-3.5 hover:border-slate-400 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-8 w-8 rounded-[4px] bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-xs text-slate-900 truncate">College Acquisition CRM</div>
                    <p className="text-[11px] text-slate-500 truncate">{data.collegeFunnel.discovered} Discovered • {data.collegeFunnel.mous} MoUs</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-700 transition-colors shrink-0" />
              </div>
            </Link>

            <Link href="/admin/growth/employers" className="block group">
              <div className="pedl-card p-3.5 hover:border-slate-400 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-8 w-8 rounded-[4px] bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-xs text-slate-900 truncate">Employer Demand CRM</div>
                    <p className="text-[11px] text-slate-500 truncate">{data.employerFunnel.hiringNow} Hiring Freshers • {data.employerFunnel.activeEmployers} Partners</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-700 transition-colors shrink-0" />
              </div>
            </Link>

            <Link href="/admin/growth/outreach" className="block group">
              <div className="pedl-card p-3.5 hover:border-slate-400 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-8 w-8 rounded-[4px] bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                    <Users className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-xs text-slate-900 truncate">Outreach Sequences & Vault</div>
                    <p className="text-[11px] text-slate-500 truncate">{data.commandCenter.pendingDraftsCount} Drafts Pending Review</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-700 transition-colors shrink-0" />
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* 6. AI OBSERVABILITY / "WHY?" MODAL */}
      <Dialog open={!!selectedWhyAction} onOpenChange={() => setSelectedWhyAction(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="h-4.5 w-4.5 text-[#1E40AF]" />
              AI Mathematical Justification: Why this action?
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Explainability breakdown derived from database-driven placement assurance capacity metrics.
            </DialogDescription>
          </DialogHeader>

          {selectedWhyAction?.reasoning && (
            <div className="space-y-3 pt-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-[4px] border border-slate-200/80 space-y-2 font-mono">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-sans">Target Region:</span>
                  <strong className="text-slate-900">{selectedWhyAction.reasoning.targetRegion}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-sans">Regional Capacity Gap:</span>
                  <strong className="text-rose-700">{selectedWhyAction.reasoning.regionalGapSlots} slots</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-sans">Current Coverage Ratio:</span>
                  <strong className="text-slate-900">{selectedWhyAction.reasoning.coverageRatio}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-sans">Addressable Capacity:</span>
                  <strong className="text-emerald-700">+{selectedWhyAction.reasoning.estimatedAddressableCapacity} slots</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-sans">AI Model Confidence:</span>
                  <strong className="text-[#1E40AF]">{selectedWhyAction.reasoning.confidenceScore}</strong>
                </div>
              </div>

              {selectedWhyAction.reasoning.topUnmetRoles?.length > 0 && (
                <div>
                  <span className="font-semibold text-slate-700 block mb-1">Top Unmet Requisition Roles:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedWhyAction.reasoning.topUnmetRoles.map((role: string, idx: number) => (
                      <span key={idx} className="px-2 py-0.5 rounded-[4px] text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-3 bg-slate-50 rounded-[4px] border border-slate-200 text-slate-800 text-xs">
                <span className="font-semibold block mb-0.5 text-slate-900">Assurance Impact Summary:</span>
                <p className="leading-relaxed text-slate-600">{selectedWhyAction.reasoning.impactExplanation}</p>
              </div>
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedWhyAction(null)}
              className="text-xs border-slate-200"
            >
              Close
            </Button>
            {selectedWhyAction?.status === 'PENDING' && (
              <Button
                size="sm"
                onClick={() => {
                  handleApproveAction(selectedWhyAction.id)
                  setSelectedWhyAction(null)
                }}
                className="text-xs bg-[#0F2744] hover:bg-[#1E40AF] text-white"
              >
                Approve Action
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
