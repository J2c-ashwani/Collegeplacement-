'use client'

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Building2, Save, CheckCircle2, ShieldCheck, Mail, MapPin } from "lucide-react"

interface EmployerProfileFormProps {
  initialProfile?: {
    name?: string
    industry?: string
    gstNumber?: string
    website?: string
    address?: string
    city?: string
    state?: string
    contactName?: string
    contactDesignation?: string
    status?: string
  } | null
}

export function EmployerProfileForm({ initialProfile }: EmployerProfileFormProps) {
  const [companyName, setCompanyName] = React.useState(initialProfile?.name || "TechCorp Solutions Pvt Ltd")
  const [industry, setIndustry] = React.useState(initialProfile?.industry || "Cloud Infrastructure & Enterprise Software")
  const [gstNumber, setGstNumber] = React.useState(initialProfile?.gstNumber || "07AABCT2345K1Z8")
  const [website, setWebsite] = React.useState(initialProfile?.website || "https://techcorp.example.com")
  const [address, setAddress] = React.useState(initialProfile?.address || "Tower B, Cyber City, Phase 2")
  const [city, setCity] = React.useState(initialProfile?.city || "Gurgaon")
  const [state, setState] = React.useState(initialProfile?.state || "Haryana")
  const [contactName, setContactName] = React.useState(initialProfile?.contactName || "Vikramaditya Rao")
  const [contactDesignation, setContactDesignation] = React.useState(initialProfile?.contactDesignation || "Director of Talent Acquisition")
  const [saved, setSaved] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)

    try {
      const res = await fetch('/api/employer-profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: companyName,
          industry,
          gstNumber,
          website,
          address,
          city,
          state,
          contactName,
          contactDesignation,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error?.message || data.message || 'Failed to update profile')
      }

      setSaved(true)
      setTimeout(() => setSaved(false), 4000)
    } catch (err: any) {
      setError(err.message || 'Error updating corporate profile')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <Card className="border-slate-200/80 shadow-2xs bg-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-sky-600" />
              Corporate Identity & Statutory Details
            </CardTitle>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              Verified Employer Partner
            </Badge>
          </div>
          <CardDescription className="text-xs text-slate-500">
            Legal identity used for candidate job offer issuance and tax invoicing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="companyName" className="font-semibold text-slate-700">Company Legal Name</Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="industry" className="font-semibold text-slate-700">Industry Domain</Label>
              <Input
                id="industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="gstNumber" className="font-semibold text-slate-700">GST Identification Number (GSTIN)</Label>
              <Input
                id="gstNumber"
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value)}
                className="h-9 text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="website" className="font-semibold text-slate-700">Official Careers / Website URL</Label>
              <Input
                id="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <Label htmlFor="address" className="font-semibold text-slate-700">Registered Office Address</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="city" className="font-semibold text-slate-700">City</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="state" className="font-semibold text-slate-700">State</Label>
              <Input
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recruiter Point of Contact */}
      <Card className="border-slate-200/80 shadow-2xs bg-white">
        <CardHeader>
          <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Mail className="h-4 w-4 text-indigo-600" />
            Lead Campus Recruiter Details
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Primary point of contact for campus recruitment drives and interview coordination
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="contactName" className="font-semibold text-slate-700">Recruiter Contact Name</Label>
              <Input
                id="contactName"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="designation" className="font-semibold text-slate-700">Official Designation</Label>
              <Input
                id="designation"
                value={contactDesignation}
                onChange={(e) => setContactDesignation(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save action */}
      {error && (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg shadow-2xs">
        <div className="flex items-center gap-2">
          {saved ? (
            <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              Corporate profile details updated successfully!
            </span>
          ) : (
            <span className="text-xs text-slate-500">
              Information is synced with college placement teams during hiring drives.
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
          {isSaving ? 'Updating...' : 'Update Profile'}
        </Button>
      </div>
    </form>
  )
}
