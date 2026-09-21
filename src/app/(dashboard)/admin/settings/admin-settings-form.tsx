'use client'

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Settings, Save, CheckCircle2, ShieldAlert, Scale, CreditCard, Mail } from "lucide-react"

interface AdminSettingsFormProps {
  initialSettings?: Record<string, any>
}

export function AdminSettingsForm({ initialSettings }: AdminSettingsFormProps) {
  const [assuranceQuota, setAssuranceQuota] = React.useState(String(initialSettings?.assuranceQuota ?? "3"))
  const [gstRate, setGstRate] = React.useState(String(initialSettings?.gstRate ?? "18"))
  const [liquidityBufferTarget, setLiquidityBufferTarget] = React.useState(String(initialSettings?.liquidityBufferTarget ?? "1.20"))
  const [throttleGtmOnDeficit, setThrottleGtmOnDeficit] = React.useState(Boolean(initialSettings?.throttleGtmOnDeficit ?? true))
  const [maintenanceMode, setMaintenanceMode] = React.useState(Boolean(initialSettings?.maintenanceMode ?? false))
  const [savedSuccess, setSavedSuccess] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assuranceQuota,
          gstRate,
          liquidityBufferTarget,
          throttleGtmOnDeficit,
          maintenanceMode,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error?.message || data.message || 'Failed to update platform settings')
      }

      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 4000)
    } catch (err: any) {
      setError(err.message || 'Error saving settings')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: 3-Assurance Programme Legal Rules */}
        <Card className="border-slate-200/80 shadow-2xs bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Scale className="h-4 w-4 text-indigo-600" />
                Legal Assurance Engine Parameters
              </CardTitle>
              <Badge variant="outline" className="bg-indigo-50 text-indigo-700 text-xs">
                Core Engine
              </Badge>
            </div>
            <CardDescription className="text-xs text-slate-500">
              Contractual quota target promised to paid programme students
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <Label htmlFor="quota" className="font-semibold text-slate-700">
                Guaranteed Interview Quota per Paid Student ($N \to 3N$)
              </Label>
              <Input
                id="quota"
                type="number"
                value={assuranceQuota}
                onChange={(e) => setAssuranceQuota(e.target.value)}
                className="h-9 text-xs"
              />
              <p className="text-[11px] text-slate-500">
                Default: 3 verified opportunities. Defines the marketplace legal obligation formula.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="buffer" className="font-semibold text-slate-700">
                Required Liquidity Buffer Ratio
              </Label>
              <Input
                id="buffer"
                type="number"
                step="0.05"
                value={liquidityBufferTarget}
                onChange={(e) => setLiquidityBufferTarget(e.target.value)}
                className="h-9 text-xs"
              />
              <p className="text-[11px] text-slate-500">
                Target ratio: 1.20x (20% excess employer capacity over student obligations).
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div className="space-y-0.5">
                <span className="font-semibold text-slate-800">Auto-Throttle Onboarding in Deficit</span>
                <p className="text-[11px] text-slate-500">
                  Blocks new institution batch registrations when coverage drops below 1.0x.
                </p>
              </div>
              <Switch
                checked={throttleGtmOnDeficit}
                onCheckedChange={setThrottleGtmOnDeficit}
              />
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Corporate Billing & Tax Settings */}
        <Card className="border-slate-200/80 shadow-2xs bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-purple-600" />
                Billing, Success Fees & GST
              </CardTitle>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 text-xs">
                Statutory
              </Badge>
            </div>
            <CardDescription className="text-xs text-slate-500">
              Tax rates and corporate billing agreements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <Label htmlFor="gst" className="font-semibold text-slate-700">
                Goods and Services Tax (GST %)
              </Label>
              <Input
                id="gst"
                type="number"
                value={gstRate}
                onChange={(e) => setGstRate(e.target.value)}
                className="h-9 text-xs"
              />
              <p className="text-[11px] text-slate-500">
                Applied automatically across all institutional subscriptions and employer fee invoices.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label className="font-semibold text-slate-700">
                Employer Success Fee Policy
              </Label>
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200 text-slate-700 font-medium">
                Dynamic: <em>&quot;Success Fee: As per your employer agreement&quot;</em>
              </div>
              <p className="text-[11px] text-slate-500">
                Configured per recruiter tier (fixed milestone vs % of candidate CTC).
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div className="space-y-0.5">
                <span className="font-semibold text-slate-800">Maintenance Mode</span>
                <p className="text-[11px] text-slate-500">
                  Temporarily pause public registration pages for scheduled migrations.
                </p>
              </div>
              <Switch
                checked={maintenanceMode}
                onCheckedChange={setMaintenanceMode}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg shadow-2xs">
        <div className="flex items-center gap-2">
          {savedSuccess ? (
            <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              Settings saved and synchronized with database!
            </span>
          ) : (
            <span className="text-xs text-slate-500">
              Changes take effect immediately across all active tenant sessions.
            </span>
          )}
        </div>

        <Button
          type="submit"
          size="sm"
          disabled={isSaving}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs flex items-center gap-1.5"
        >
          <Save className="h-3.5 w-3.5" />
          {isSaving ? 'Saving...' : 'Save Configuration'}
        </Button>
      </div>
    </form>
  )
}
