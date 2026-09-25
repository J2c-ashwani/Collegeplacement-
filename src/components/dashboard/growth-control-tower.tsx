import { CapacityMetrics } from "@/services/capacity.service"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle2, TrendingUp, Gauge, Users, Briefcase, ShieldAlert, ArrowUpRight, Scale } from "lucide-react"

interface GrowthControlTowerProps {
  metrics: CapacityMetrics
}

export function GrowthControlTower({ metrics }: GrowthControlTowerProps) {
  const isSurplus = metrics.status === 'SURPLUS'
  const isDeficit = metrics.status === 'DEFICIT'

  const statusColor = isSurplus
    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
    : isDeficit
    ? 'bg-rose-50 text-rose-800 border-rose-300'
    : 'bg-amber-50 text-amber-800 border-amber-300'

  return (
    <div className="space-y-4">
      {/* Control Tower Header Card */}
      <Card className="border-slate-200 shadow-2xs overflow-hidden rounded-md bg-white">
        <div className="p-5 text-white bg-[#0F2744] border-b border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-900/60 text-blue-200 border border-blue-700/50 flex items-center gap-1.5">
                  <Gauge className="h-3 w-3 text-blue-400" />
                  Growth Control Tower
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-300">Database-Driven Telemetry</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Employer Capacity & Assurance Liquidity Balance
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                Monitors the <strong>3-Interview Legal Assurance Obligation</strong> (3N opportunities) against active employer hiring slots to prevent capacity default before onboarding new cohorts.
              </p>
            </div>

            <div className="flex flex-col items-end gap-2 shrink-0">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`px-2.5 py-0.5 font-mono font-bold text-xs uppercase tracking-wider ${statusColor}`}>
                  {isSurplus && <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-600 inline" />}
                  {isDeficit && <ShieldAlert className="h-3.5 w-3.5 mr-1 text-rose-600 inline" />}
                  {!isSurplus && !isDeficit && <AlertTriangle className="h-3.5 w-3.5 mr-1 text-amber-600 inline" />}
                  {metrics.status}: {metrics.coverageRatio}x Coverage
                </Badge>
              </div>
              <span className="text-[11px] text-slate-300 font-medium font-mono">
                GTM Status: <strong className="text-white">{metrics.gtmAction}</strong>
              </span>
            </div>
          </div>

          {/* GTM Guidance Alert Bar */}
          <div className="mt-3 pt-3 border-t border-slate-700/80 flex items-start gap-2.5 text-xs text-slate-200">
            {isDeficit ? (
              <ShieldAlert className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
            ) : isSurplus ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            )}
            <p className="leading-relaxed">
              <strong className="text-white">GTM Operational Directive:</strong> {metrics.gtmGuidance}
            </p>
          </div>
        </div>

        {/* Telemetry Core Numbers */}
        <CardContent className="p-6 bg-slate-50/50">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
                <span>Active Assurance (N)</span>
                <Users className="h-3.5 w-3.5 text-indigo-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900">{metrics.activeStudents}</div>
              <p className="text-[11px] text-slate-500 mt-1">Paid programme students</p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
                <span>Required Opps (3N)</span>
                <Scale className="h-3.5 w-3.5 text-indigo-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900">{metrics.requiredOpportunities}</div>
              <p className="text-[11px] text-slate-500 mt-1">Legally promised quota</p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
                <span>Confirmed Capacity</span>
                <Briefcase className="h-3.5 w-3.5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900">{metrics.confirmedEmployerCapacity}</div>
              <p className="text-[11px] text-slate-500 mt-1">Active employer hiring slots</p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
                <span>Capacity Balance</span>
                <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
              </div>
              <div className={`text-2xl font-bold ${metrics.capacityBalance >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                {metrics.capacityBalance >= 0 ? `+${metrics.capacityBalance}` : metrics.capacityBalance}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {metrics.capacityBalance >= 0 ? 'Surplus interview slots' : 'Capacity deficit alert'}
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs col-span-2 md:col-span-1">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
                <span>Remaining Coverage</span>
                <Gauge className="h-3.5 w-3.5 text-violet-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900">{metrics.coverageRatio}&times;</div>
              <p className="text-[11px] text-slate-500 mt-1">
                {metrics.confirmedEmployerCapacity.toLocaleString('en-IN')} &divide; {metrics.remainingObligation.toLocaleString('en-IN')} remaining
              </p>
            </div>
          </div>

          <details className="mt-4 text-xs text-slate-600 bg-white border border-slate-200 rounded-md p-3">
            <summary className="cursor-pointer font-semibold text-slate-800 select-none">
              View Formula Derivation &amp; Secondary Sandbox Telemetry
            </summary>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 font-mono text-[11px]">
              <div>
                <span className="text-slate-500 block">REMAINING OBLIGATION FORMULA</span>
                <strong>{metrics.requiredOpportunities.toLocaleString('en-IN')} (3N) &minus; {(metrics.requiredOpportunities - metrics.remainingObligation).toLocaleString('en-IN')} (Completed) = {metrics.remainingObligation.toLocaleString('en-IN')}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">REMAINING COVERAGE RATIO</span>
                <strong>{metrics.confirmedEmployerCapacity.toLocaleString('en-IN')} &divide; {metrics.remainingObligation.toLocaleString('en-IN')} = {metrics.coverageRatio}&times;</strong>
              </div>
              <div>
                <span className="text-slate-500 block">GROSS 3N COVERAGE RATIO</span>
                <strong>{metrics.confirmedEmployerCapacity.toLocaleString('en-IN')} &divide; {metrics.requiredOpportunities.toLocaleString('en-IN')} = {(metrics.confirmedEmployerCapacity / Math.max(1, metrics.requiredOpportunities)).toFixed(2)}&times;</strong>
              </div>
            </div>
          </details>
        </CardContent>
      </Card>

      {/* Contractual Obligation & Regional Liquidity Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Core Assurance Capacity Balance Sheet */}
        <Card className="border-slate-200/80 shadow-2xs bg-white lg:col-span-2">
          <CardHeader className="pb-3 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 uppercase tracking-wide">
                  Placement Assurance Capacity
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Legal obligation ledger for the 3-Interview Guarantee Programme
                </CardDescription>
              </div>
              {metrics.requiresEmployerAcquisition ? (
                <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 font-semibold text-xs flex items-center gap-1">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  EMPLOYER ACQUISITION REQUIRED
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold text-xs flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  CAPACITY SOLVENT
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 font-mono text-sm">
              <div className="flex items-center justify-between px-6 py-2.5 hover:bg-slate-50/50">
                <span className="text-slate-600 font-sans text-xs sm:text-sm">Active Paid Students</span>
                <span className="font-bold text-slate-900">{metrics.activeStudents.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between px-6 py-2.5 bg-slate-50/30">
                <span className="text-slate-600 font-sans text-xs sm:text-sm">Assurance Opportunities Required (3N)</span>
                <span className="font-bold text-indigo-700">{metrics.requiredOpportunities.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between px-6 py-2.5 hover:bg-slate-50/50">
                <span className="text-slate-600 font-sans text-xs sm:text-sm">Opportunities Delivered</span>
                <span className="font-semibold text-slate-700">{metrics.opportunitiesDelivered.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between px-6 py-2.5 hover:bg-slate-50/50">
                <span className="text-slate-600 font-sans text-xs sm:text-sm">Remaining Obligation</span>
                <span className="font-bold text-slate-900">{metrics.remainingObligation.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between px-6 py-2.5 bg-slate-50/30">
                <span className="text-slate-600 font-sans text-xs sm:text-sm">Confirmed Employer Capacity</span>
                <span className="font-bold text-blue-700">{metrics.confirmedEmployerCapacity.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between px-6 py-3 bg-slate-100/60">
                <span className="font-sans font-semibold text-slate-900 text-xs sm:text-sm">Capacity Gap / Buffer</span>
                <span className={`font-bold ${metrics.capacityGap > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {metrics.capacityGap > 0 ? `-${metrics.capacityGap} GAP` : `+${metrics.capacityBalance} SURPLUS`}
                </span>
              </div>
            </div>

            {/* Quick Cohort Onboarding Check */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span className="font-medium font-sans">
                Onboarding Safety Simulator (+500 Students = +1,500 Opps):
              </span>
              {(() => {
                const check = metrics.canSafelyOnboard(500)
                return (
                  <Badge variant="outline" className={`font-sans text-xs ${check.safe ? 'bg-emerald-100/60 text-emerald-800 border-emerald-300' : 'bg-amber-100/60 text-amber-800 border-amber-300'}`}>
                    {check.safe ? 'Safe (+500 permitted)' : 'Caution (Acquisition Needed)'}
                  </Badge>
                )
              })()}
            </div>
          </CardContent>
        </Card>

        {/* Regional Cluster Breakdown */}
        <Card className="border-slate-200/80 shadow-2xs bg-white">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Regional Cluster Capacity
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Employer slots vs student demand by territory
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 text-xs font-mono">
              {metrics.regionalClusters.map((cluster) => (
                <div key={cluster.region} className="p-3.5 flex items-center justify-between hover:bg-slate-50/50">
                  <div>
                    <p className="font-sans font-medium text-slate-800">{cluster.region}</p>
                    <p className="text-[11px] text-slate-400 font-sans">
                      Capacity: {cluster.confirmedCapacity} | Req: {cluster.requiredObligation}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`font-mono text-xs px-2 py-0.5 ${
                      cluster.balance >= 0
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    {cluster.balance >= 0 ? `+${cluster.balance} capacity` : `${cluster.balance} gap`}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KPI & Quality Telemetry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-slate-200/80 shadow-2xs bg-white">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider text-indigo-700 flex items-center justify-between">
              <span>North Star Metric</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-slate-900">
              {metrics.northStarInterviewsPer100}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs font-medium text-slate-700">Qualified Interviews / 100 Paid Students</p>
            <p className="text-[11px] text-slate-500 mt-1">Platform assurance fulfillment benchmark (Target &ge; 250)</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 shadow-2xs bg-white">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider text-blue-700 flex items-center justify-between">
              <span>Matching Precision</span>
              <CheckCircle2 className="h-3.5 w-3.5" />
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-slate-900">
              {metrics.firstRoundToOfferRate}%
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs font-medium text-slate-700">First-Round to Offer Rate</p>
            <p className="text-[11px] text-slate-500 mt-1">Quality benchmark for pre-assessed candidates (Target 15%–25%)</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 shadow-2xs bg-white">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider text-emerald-700 flex items-center justify-between">
              <span>Joining Conversion</span>
              <TrendingUp className="h-3.5 w-3.5" />
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-slate-900">
              {metrics.offerToJoinRate}%
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs font-medium text-slate-700">Offer-to-Join Conversion</p>
            <p className="text-[11px] text-slate-500 mt-1">Candidate salary alignment & joining fidelity (Target &ge; 80%)</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 shadow-2xs bg-white">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider text-purple-700 flex items-center justify-between">
              <span>Employer Stickiness</span>
              <Users className="h-3.5 w-3.5" />
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-slate-900">
              {metrics.employerRepeatRate}%
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs font-medium text-slate-700">Employer Repeat Hiring Rate</p>
            <p className="text-[11px] text-slate-500 mt-1">Recruiter retention and multi-drive participation (Target &ge; 40%)</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
