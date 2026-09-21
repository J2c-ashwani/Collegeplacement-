'use client'

import * as React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { 
  TrendingUp, ShieldAlert, CheckCircle2, ArrowRight, Zap, 
  HelpCircle, Building2, Briefcase, Users, Flame, 
  Check, Lock, ChevronRight, Activity, Globe
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export interface GrowthCommandCenterProps {
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
      topMarketDeficits: Array<{ region: string; deficit: number; primaryDomain: string }>
    }
    regionalClusters: Array<{
      region: string
      confirmedCapacity: number
      requiredObligation: number
      balance: number
      status: 'SURPLUS' | 'BALANCED' | 'DEFICIT'
    }>
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

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. TOP EXECUTIVE COMMAND CENTER: Business Numbers First */}
      <div className="border border-slate-200 bg-white rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-bold tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200 flex items-center gap-1">
                <Activity className="h-3 w-3" />
                Autonomous Marketplace Intelligence
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500">Human-Controlled Execution</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              GrowthOS Command Center
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Balances higher education talent supply with active corporate fresher hiring demand via contractual 3N Assurance signals.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleBulkApproveSafe}
              disabled={isApproving || pendingSafeCount === 0}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-9 px-3.5 flex items-center gap-1.5 shadow-sm"
            >
              <Check className="h-3.5 w-3.5" />
              <span>Approve All Safe Actions ({pendingSafeCount})</span>
            </Button>
          </div>
        </div>

        {/* Core Business Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
          {/* Metric 1: Assurance Coverage */}
          <div className="p-4 rounded-lg bg-gradient-to-br from-indigo-50/60 to-white border border-indigo-100/80">
            <span className="text-[11px] font-medium text-slate-500 block uppercase tracking-wider">
              Assurance Coverage
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-slate-900 font-mono">
                {data.commandCenter.assuranceCoveragePercent}%
              </span>
              {data.commandCenter.capacityGap > 0 ? (
                <span className="text-xs font-semibold text-rose-600 font-mono bg-rose-50 px-1.5 py-0.5 rounded">
                  Gap: {data.commandCenter.capacityGap}
                </span>
              ) : (
                <span className="text-xs font-semibold text-emerald-600 font-mono bg-emerald-50 px-1.5 py-0.5 rounded">
                  Balanced
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {data.commandCenter.deliveredOpportunities} delivered of {data.commandCenter.requiredOpportunities} total obligations
            </p>
          </div>

          {/* Metric 2: Employer Capacity */}
          <div className="p-4 rounded-lg bg-slate-50/70 border border-slate-200/80">
            <span className="text-[11px] font-medium text-slate-500 block uppercase tracking-wider">
              Employer Capacity
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-slate-900 font-mono">
                {data.commandCenter.confirmedEmployerCapacity.toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-500">interview slots</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Confirmed across {data.employerFunnel.activeEmployers} corporate hiring partners
            </p>
          </div>

          {/* Metric 3: Student Supply */}
          <div className="p-4 rounded-lg bg-slate-50/70 border border-slate-200/80">
            <span className="text-[11px] font-medium text-slate-500 block uppercase tracking-wider">
              Enrolled Student Supply
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-slate-900 font-mono">
                {data.commandCenter.activePaidStudents.toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-500">active students</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Contractual target: {data.commandCenter.requiredOpportunities.toLocaleString()} opportunities
            </p>
          </div>

          {/* Metric 4: AI Actions Attention */}
          <div className="p-4 rounded-lg bg-amber-50/50 border border-amber-200/80">
            <span className="text-[11px] font-medium text-amber-900 block uppercase tracking-wider">
              Action Queue
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-amber-950 font-mono">
                {actions.filter(a => a.status === 'PENDING').length}
              </span>
              <span className="text-[11px] text-amber-800">recommendations</span>
            </div>
            <p className="text-[11px] text-amber-700 mt-1">
              Ranked by Impact × Urgency × Confidence
            </p>
          </div>

          {/* Metric 5: Top Market Deficits */}
          <div className="p-4 rounded-lg bg-slate-50/70 border border-slate-200/80">
            <span className="text-[11px] font-medium text-slate-500 block uppercase tracking-wider">
              Top Market Deficit
            </span>
            <div className="mt-1">
              <span className="text-sm font-bold text-rose-700 font-mono block">
                {data.commandCenter.topMarketDeficits[0]?.region}: {data.commandCenter.topMarketDeficits[0]?.deficit} slots
              </span>
              <span className="text-[10px] text-slate-500 block truncate">
                {data.commandCenter.topMarketDeficits[0]?.primaryDomain}
              </span>
            </div>
            <p className="text-[10px] text-indigo-600 font-semibold mt-1">
              Employer AI active in Delhi NCR
            </p>
          </div>
        </div>
      </div>

      {/* 2. TODAY'S RECOMMENDED ACTIONS (Ranked by Action Score) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Flame className="h-5 w-5 text-rose-500" />
              Ranked AI Action Queue
            </h2>
            <p className="text-xs text-slate-500">
              Operations priority list computed by: Impact × Urgency × Confidence ÷ Effort.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="flex items-center gap-1 font-mono">
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
                className={`p-4 rounded-xl border transition-all ${
                  isRed
                    ? 'border-rose-200 bg-rose-50/30'
                    : isOrange
                    ? 'border-amber-200 bg-amber-50/20'
                    : 'border-slate-200 bg-white'
                } flex flex-col md:flex-row md:items-center justify-between gap-4`}
              >
                <div className="space-y-1 max-w-3xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      className={`text-[10px] font-mono font-bold ${
                        isRed
                          ? 'bg-rose-100 text-rose-800 border-rose-200'
                          : isOrange
                          ? 'bg-amber-100 text-amber-800 border-amber-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {action.priority.replace('_', ' ')}
                    </Badge>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                      Action Score: {action.actionScore}
                    </span>
                    {action.isSafeAction && (
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-medium flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        Policy Verified Safe
                      </span>
                    )}
                    {action.targetRegion && (
                      <span className="text-[11px] text-slate-500">
                        Region: <strong>{action.targetRegion}</strong>
                      </span>
                    )}
                  </div>

                  <h3 className="font-semibold text-slate-900 text-sm">{action.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{action.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedWhyAction(action)}
                    className="h-8 text-xs text-indigo-700 hover:text-indigo-900 border-indigo-200 bg-indigo-50/50 flex items-center gap-1"
                  >
                    <HelpCircle className="h-3.5 w-3.5" />
                    <span>Why?</span>
                  </Button>

                  {isPending ? (
                    <Button
                      size="sm"
                      onClick={() => handleApproveAction(action.id)}
                      className="h-8 text-xs bg-slate-900 hover:bg-slate-800 text-white"
                    >
                      Approve & Execute
                    </Button>
                  ) : (
                    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs">
                      ✓ {action.status}
                    </Badge>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 3. REGIONAL LIQUIDITY & SUPPLY/DEMAND BALANCE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Globe className="h-4 w-4 text-indigo-600" />
              Regional Supply & Demand Liquidity Matrix
            </h2>
            <span className="text-xs text-slate-400">Delhi NCR • Gurgaon • Pune • Bangalore</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.regionalClusters.map((cluster) => {
              const isDeficit = cluster.status === 'DEFICIT'
              const isSurplus = cluster.status === 'SURPLUS'

              return (
                <Card key={cluster.region} className="border-slate-200">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900 text-sm">{cluster.region}</span>
                      <Badge
                        className={`text-[10px] ${
                          isDeficit
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : isSurplus
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {cluster.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100 font-mono">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-sans">Obligation (3N)</span>
                        <span className="font-bold text-slate-800">{cluster.requiredObligation}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-sans">Employer Capacity</span>
                        <span className="font-bold text-slate-800">{cluster.confirmedCapacity}</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-500 pt-1 flex items-center justify-between">
                      <span>Balance Slots:</span>
                      <strong className={cluster.balance < 0 ? 'text-rose-600' : 'text-emerald-600'}>
                        {cluster.balance > 0 ? `+${cluster.balance}` : cluster.balance}
                      </strong>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* 4. CRM FUNNEL QUICK ACCESS */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-slate-900">GrowthOS CRM Workspaces</h2>
          
          <div className="space-y-2.5">
            <Link href="/admin/growth/colleges" className="block">
              <Card className="hover:border-indigo-300 hover:shadow-sm transition-all border-slate-200">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-slate-900">College Acquisition CRM</div>
                      <p className="text-[11px] text-slate-500">{data.collegeFunnel.discovered} Discovered • {data.collegeFunnel.mous} MoUs Active</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/growth/employers" className="block">
              <Card className="hover:border-indigo-300 hover:shadow-sm transition-all border-slate-200">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-slate-900">Employer Demand CRM</div>
                      <p className="text-[11px] text-slate-500">{data.employerFunnel.hiringNow} Hiring Freshers • {data.employerFunnel.activeEmployers} Partners</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/growth/outreach" className="block">
              <Card className="hover:border-indigo-300 hover:shadow-sm transition-all border-slate-200">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-slate-900">Outreach Sequences & Vault</div>
                      <p className="text-[11px] text-slate-500">{data.commandCenter.pendingDraftsCount} Drafts Pending Review</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>

      {/* 5. AI OBSERVABILITY / "WHY?" MODAL */}
      <Dialog open={!!selectedWhyAction} onOpenChange={() => setSelectedWhyAction(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-indigo-600" />
              AI Mathematical Justification: Why this action?
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Explainability breakdown derived from live PostgreSQL placement assurance obligations.
            </DialogDescription>
          </DialogHeader>

          {selectedWhyAction?.reasoning && (
            <div className="space-y-3 pt-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Target Region:</span>
                  <strong className="font-mono text-slate-800">{selectedWhyAction.reasoning.targetRegion}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Regional Capacity Gap:</span>
                  <strong className="font-mono text-rose-600">{selectedWhyAction.reasoning.regionalGapSlots} slots</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Current Coverage Ratio:</span>
                  <strong className="font-mono text-slate-800">{selectedWhyAction.reasoning.coverageRatio}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Addressable Capacity:</span>
                  <strong className="font-mono text-emerald-600">+{selectedWhyAction.reasoning.estimatedAddressableCapacity} slots</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">AI Model Confidence:</span>
                  <strong className="font-mono text-indigo-600">{selectedWhyAction.reasoning.confidenceScore}</strong>
                </div>
              </div>

              {selectedWhyAction.reasoning.topUnmetRoles?.length > 0 && (
                <div>
                  <span className="font-semibold text-slate-700 block mb-1">Top Unmet Requisition Roles:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedWhyAction.reasoning.topUnmetRoles.map((role: string, idx: number) => (
                      <Badge key={idx} variant="outline" className="text-[11px] bg-white">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-3 bg-indigo-50/60 rounded border border-indigo-100 text-indigo-950">
                <span className="font-semibold block mb-0.5">Assurance Impact Summary:</span>
                <p className="leading-relaxed">{selectedWhyAction.reasoning.impactExplanation}</p>
              </div>
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedWhyAction(null)}
              className="text-xs"
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
                className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
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
