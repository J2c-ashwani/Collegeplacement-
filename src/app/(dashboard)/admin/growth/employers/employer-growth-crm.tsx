'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from '@/components/ui/dialog'
import {
  Briefcase, Search, Filter, ShieldCheck, Mail, Phone, ExternalLink,
  Sparkles, CheckCircle2, AlertTriangle, UserCheck, Plus, Copy,
  Check, Users, TrendingUp, Layers
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export interface EmployerProspectItem {
  id: string
  companyName: string
  normalizedDomain: string
  website: string
  careersUrl: string | null
  industry: string
  city: string
  state: string
  region: string
  hiringVolume: number
  openRoles: any
  experienceRange: string | null
  employerFitScore: number
  fitBreakdown: any
  assuranceCoveragePotential: any
  matchedStudentCount: number
  matchedSkills: string[]
  matchingRoles: string[]
  recruiterName: string | null
  recruiterEmail: string | null
  recruiterTitle: string | null
  recruiterPhone: string | null
  provenanceData: any
  freshnessStatus: 'FRESH' | 'RECENT' | 'STALE' | 'EXPIRED'
  complianceStatus: string
  status: string
  dnc: boolean
  lastVerifiedAt: string
  createdAt: string
}

export interface SequenceOption {
  id: string
  name: string
  targetType: string
  stepsCount: number
}

interface EmployerGrowthCrmProps {
  initialProspects: EmployerProspectItem[]
  sequences: SequenceOption[]
}

export function EmployerGrowthCrm({ initialProspects, sequences }: EmployerGrowthCrmProps) {
  const [prospects, setProspects] = React.useState<EmployerProspectItem[]>(initialProspects)
  const [search, setSearch] = React.useState('')
  const [selectedRegion, setSelectedRegion] = React.useState('ALL')
  const [selectedStatus, setSelectedStatus] = React.useState('ALL')
  const [minScore, setMinScore] = React.useState<number>(0)

  // Modals
  const [selectedBreakdown, setSelectedBreakdown] = React.useState<EmployerProspectItem | null>(null)
  const [selectedPitch, setSelectedPitch] = React.useState<EmployerProspectItem | null>(null)
  const [enrollTarget, setEnrollTarget] = React.useState<EmployerProspectItem | null>(null)
  const [selectedSequenceId, setSelectedSequenceId] = React.useState<string>(sequences[0]?.id || '')
  const [isEnrolling, setIsEnrolling] = React.useState(false)
  const [addModalOpen, setAddModalOpen] = React.useState(false)
  const [copiedPitch, setCopiedPitch] = React.useState(false)

  // Add form state
  const [newEmployer, setNewEmployer] = React.useState({
    companyName: '',
    website: '',
    careersUrl: '',
    industry: 'Technology / SaaS',
    city: 'Gurgaon',
    state: 'Haryana',
    region: 'Gurgaon',
    hiringVolume: 30,
    openRoles: 'Inside Sales Associate, Tech Support Engineer',
    experienceRange: '0-2 Years',
    recruiterName: '',
    recruiterEmail: '',
    recruiterTitle: 'Talent Acquisition Lead',
    recruiterPhone: '',
    notes: '',
  })
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Filtered prospects
  const filteredProspects = React.useMemo(() => {
    return prospects.filter((p) => {
      const matchSearch =
        !search ||
        p.companyName.toLowerCase().includes(search.toLowerCase()) ||
        p.industry.toLowerCase().includes(search.toLowerCase()) ||
        (p.recruiterName && p.recruiterName.toLowerCase().includes(search.toLowerCase()))

      const matchRegion = selectedRegion === 'ALL' || p.region === selectedRegion
      const matchStatus = selectedStatus === 'ALL' || p.status === selectedStatus
      const matchScore = p.employerFitScore >= minScore

      return matchSearch && matchRegion && matchStatus && matchScore
    })
  }, [prospects, search, selectedRegion, selectedStatus, minScore])

  // KPIs
  const kpis = React.useMemo(() => {
    const total = prospects.length
    const qualified = prospects.filter((p) => p.employerFitScore >= 70).length
    const verifiedRecruiters = prospects.filter((p) => p.recruiterEmail && p.recruiterName).length
    const totalVolume = prospects.reduce((acc, p) => acc + (p.hiringVolume || 0), 0)
    const activePartners = prospects.filter((p) => ['CAMPAIGN_ACTIVE', 'WON_PARTNER'].includes(p.status)).length

    return { total, qualified, verifiedRecruiters, totalVolume, activePartners }
  }, [prospects])

  const handleEnrollInSequence = async () => {
    if (!enrollTarget || !selectedSequenceId) return
    setIsEnrolling(true)
    try {
      const res = await fetch('/api/growth/sequences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sequenceId: selectedSequenceId,
          prospectType: 'EMPLOYER',
          prospectId: enrollTarget.id,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error?.message || 'Failed to enroll prospect')

      setProspects((prev) =>
        prev.map((p) =>
          p.id === enrollTarget.id
            ? { ...p, status: 'SEQUENCE_ENROLLED' }
            : p
        )
      )
      toast.success(`${enrollTarget.companyName} enrolled in Fresher Hiring Sequence! Outreach draft ready.`)
      setEnrollTarget(null)
    } catch (err: any) {
      toast.error(err.message || 'Could not enroll prospect')
    } finally {
      setIsEnrolling(false)
    }
  }

  const handleCreateEmployer = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const rolesArray = newEmployer.openRoles.split(',').map((r) => r.trim()).filter(Boolean)
      const res = await fetch('/api/growth/employers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newEmployer,
          openRoles: rolesArray,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error?.message || 'Failed to create employer prospect')

      const created: EmployerProspectItem = {
        ...json.data,
        createdAt: json.data.createdAt || new Date().toISOString(),
        lastVerifiedAt: json.data.lastVerifiedAt || new Date().toISOString(),
      }
      setProspects((prev) => [created, ...prev])
      toast.success(`${created.companyName} registered with ${created.employerFitScore} Fit Score & ${created.matchedStudentCount} candidate matches`)
      setAddModalOpen(false)
      setNewEmployer({
        companyName: '',
        website: '',
        careersUrl: '',
        industry: 'Technology / SaaS',
        city: 'Gurgaon',
        state: 'Haryana',
        region: 'Gurgaon',
        hiringVolume: 30,
        openRoles: 'Inside Sales Associate, Tech Support Engineer',
        experienceRange: '0-2 Years',
        recruiterName: '',
        recruiterEmail: '',
        recruiterTitle: 'Talent Acquisition Lead',
        recruiterPhone: '',
        notes: '',
      })
    } catch (err: any) {
      toast.error(err.message || 'Could not register employer')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getScoreBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-emerald-600 text-white font-bold">{score} / 100 Fit</Badge>
    if (score >= 70) return <Badge className="bg-teal-600 text-white font-semibold">{score} / 100 Fit</Badge>
    if (score >= 50) return <Badge className="bg-amber-500 text-white font-medium">{score} / 100 Fit</Badge>
    return <Badge variant="outline" className="text-slate-500">{score} / 100 Fit</Badge>
  }

  const getFreshnessBadge = (freshness: string) => {
    switch (freshness) {
      case 'FRESH':
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">FRESH (&lt;7d)</Badge>
      case 'RECENT':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-[10px]">RECENT (&lt;30d)</Badge>
      case 'STALE':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[10px]">STALE (Refresh Req)</Badge>
      case 'EXPIRED':
        return <Badge variant="destructive" className="text-[10px]">EXPIRED (&gt;90d)</Badge>
      default:
        return null
    }
  }

  const copyPitchText = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedPitch(true)
    toast.success('Assurance capacity pitch copied to clipboard')
    setTimeout(() => setCopiedPitch(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link href="/admin/growth" className="hover:underline text-indigo-600">GrowthOS</Link>
            <span>/</span>
            <span className="font-semibold text-slate-700">Employer Demand CRM</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-indigo-600" />
            Employer Sourcing & Interview Slot Acquisition
          </h1>
          <p className="text-sm text-slate-600">
            Identify fresher hiring employers, quantify candidate pool coverage, and acquire guaranteed interview slots.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/growth">
            <Button variant="outline" size="sm">
              Assurance Control Tower
            </Button>
          </Link>
          <Button
            size="sm"
            onClick={() => setAddModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Add Employer Prospect
          </Button>
        </div>
      </div>

      {/* KPI Overview Banner */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card className="p-4 bg-slate-50/60 border-slate-200/80">
          <span className="text-xs font-medium text-slate-500">Total Discovered</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">{kpis.total}</p>
          <span className="text-[11px] text-slate-400">Target enterprises & startups</span>
        </Card>
        <Card className="p-4 bg-emerald-50/50 border-emerald-200/80">
          <span className="text-xs font-semibold text-emerald-800">High Fit (≥70)</span>
          <p className="text-2xl font-bold text-emerald-700 mt-1">{kpis.qualified}</p>
          <span className="text-[11px] text-emerald-600">10-dimension qualified</span>
        </Card>
        <Card className="p-4 bg-blue-50/50 border-blue-200/80">
          <span className="text-xs font-semibold text-blue-800">Recruiter Contacts</span>
          <p className="text-2xl font-bold text-blue-700 mt-1">{kpis.verifiedRecruiters}</p>
          <span className="text-[11px] text-blue-600">Talent Acquisition verified</span>
        </Card>
        <Card className="p-4 bg-indigo-50/50 border-indigo-200/80">
          <span className="text-xs font-semibold text-indigo-800">Fresher Hiring Vol</span>
          <p className="text-2xl font-bold text-indigo-700 mt-1">{kpis.totalVolume}+</p>
          <span className="text-[11px] text-indigo-600">Aggregated fresher openings</span>
        </Card>
        <Card className="p-4 bg-teal-50/50 border-teal-200/80">
          <span className="text-xs font-semibold text-teal-800">Active Hiring Partners</span>
          <p className="text-2xl font-bold text-teal-700 mt-1">{kpis.activePartners}</p>
          <span className="text-[11px] text-teal-600">Contracted hiring drives</span>
        </Card>
      </div>

      {/* Filter Toolbar */}
      <Card className="p-4 shadow-xs">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search company, industry, or recruiter..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Region Selector */}
            <select
              aria-label="Filter employers by region"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="h-9 px-3 text-xs rounded-md border border-slate-200 bg-white font-medium text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            >
              <option value="ALL">All Regions</option>
              <option value="Delhi NCR">Delhi NCR</option>
              <option value="Gurgaon">Gurgaon</option>
              <option value="Pune">Pune</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Hyderabad">Hyderabad</option>
            </select>

            {/* Status Selector */}
            <select
              aria-label="Filter employers by pipeline status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-9 px-3 text-xs rounded-md border border-slate-200 bg-white font-medium text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="DISCOVERED">Discovered</option>
              <option value="QUALIFIED">Qualified</option>
              <option value="SEQUENCE_ENROLLED">Sequence Enrolled</option>
              <option value="OUTREACH_ACTIVE">Outreach Active</option>
              <option value="MEETING_SCHEDULED">Meeting Booked</option>
              <option value="CAMPAIGN_ACTIVE">Campaign Active</option>
              <option value="WON_PARTNER">Won Partner</option>
              <option value="DNC">DNC (Suppressed)</option>
            </select>

            {/* Score filter tabs */}
            <div className="flex items-center rounded-md border border-slate-200 p-0.5 bg-slate-100/80 text-xs">
              <button
                type="button"
                onClick={() => setMinScore(0)}
                className={`px-2.5 py-1 rounded-sm font-medium transition ${minScore === 0 ? 'bg-white shadow-xs text-indigo-700' : 'text-slate-600'}`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setMinScore(70)}
                className={`px-2.5 py-1 rounded-sm font-medium transition ${minScore === 70 ? 'bg-white shadow-xs text-emerald-700' : 'text-slate-600'}`}
              >
                ≥70 Fit
              </button>
              <button
                type="button"
                onClick={() => setMinScore(80)}
                className={`px-2.5 py-1 rounded-sm font-medium transition ${minScore === 80 ? 'bg-white shadow-xs text-emerald-800' : 'text-slate-600'}`}
              >
                ≥80 High Priority
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Prospects Table / Grid */}
      <div className="space-y-3">
        {filteredProspects.length === 0 ? (
          <Card className="p-12 text-center border-dashed">
            <Briefcase className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">No employer prospects match current criteria</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
              Try adjusting your search criteria, regional filter, or minimum fit threshold.
            </p>
          </Card>
        ) : (
          filteredProspects.map((employer) => (
            <Card key={employer.id} className="p-4 hover:border-indigo-300 transition shadow-xs">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Employer Info & Match Stats */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-base text-slate-900 tracking-tight">
                      {employer.companyName}
                    </span>
                    {getScoreBadge(employer.employerFitScore)}
                    {getFreshnessBadge(employer.freshnessStatus)}
                    {employer.dnc && (
                      <Badge variant="destructive" className="text-[10px]">DNC SUPPRESSED</Badge>
                    )}
                    <Badge variant="outline" className="text-[10px] bg-indigo-50 text-indigo-700 border-indigo-200">
                      👥 {employer.matchedStudentCount} Student Pool Match
                    </Badge>
                    <Badge variant="outline" className="text-[10px] bg-slate-50 text-slate-600">
                      {employer.status.replace('_', ' ')}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-600 flex-wrap">
                    <span>🏢 {employer.industry}</span>
                    <span>📍 {employer.city} ({employer.region})</span>
                    <span>🎯 Volume: <strong className="text-slate-900">{employer.hiringVolume} openings</strong></span>
                    <span>🕒 {employer.experienceRange || '0-2 Years'}</span>
                    <a
                      href={employer.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline flex items-center gap-0.5"
                    >
                      Website <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>

                  {/* Matching Roles Tags */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                    <span className="text-[11px] font-medium text-slate-400">Open Roles:</span>
                    {Array.isArray(employer.openRoles) ? (
                      employer.openRoles.slice(0, 3).map((r: string, idx: number) => (
                        <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700">
                          {r}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-slate-500">Fresher Opportunities</span>
                    )}
                  </div>
                </div>

                {/* Recruiter Contact & Action Controls */}
                <div className="flex items-center gap-6 border-t lg:border-t-0 pt-3 lg:pt-0 lg:border-l lg:pl-6 shrink-0">
                  {/* Recruiter Contact */}
                  <div className="text-xs space-y-0.5 min-w-[170px]">
                    <span className="font-semibold text-slate-800 flex items-center gap-1">
                      <UserCheck className="h-3.5 w-3.5 text-indigo-600" />
                      {employer.recruiterName || 'Talent Acquisition Team'}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      {employer.recruiterTitle || 'Hiring Lead'}
                    </span>
                    {employer.recruiterEmail ? (
                      <a href={`mailto:${employer.recruiterEmail}`} className="text-slate-500 hover:text-indigo-600 flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {employer.recruiterEmail}
                      </a>
                    ) : (
                      <span className="text-slate-400 italic">No email on file</span>
                    )}
                  </div>

                  {/* Operational Buttons */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedBreakdown(employer)}
                      className="text-xs"
                    >
                      10-D Fit
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedPitch(employer)}
                      className="text-xs text-indigo-700 bg-indigo-50/50 hover:bg-indigo-100 border-indigo-200"
                    >
                      Assurance Pitch
                    </Button>

                    <Button
                      size="sm"
                      disabled={employer.dnc || employer.freshnessStatus === 'EXPIRED'}
                      onClick={() => setEnrollTarget(employer)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs flex items-center gap-1"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      Enroll
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* 10-Dimension Fit Score Breakdown Modal */}
      {selectedBreakdown && (
        <Dialog open={Boolean(selectedBreakdown)} onOpenChange={() => setSelectedBreakdown(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between text-lg">
                <span>{selectedBreakdown.companyName}</span>
                {getScoreBadge(selectedBreakdown.employerFitScore)}
              </DialogTitle>
              <DialogDescription>
                Deterministic 10-dimension Employer Fit evaluation against candidate capacity and hiring criteria.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border">
                  <span className="text-slate-400 font-medium">Hiring Volume</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{selectedBreakdown.hiringVolume} Freshers</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border">
                  <span className="text-slate-400 font-medium">Matched Candidate Pool</span>
                  <p className="font-semibold text-indigo-700 mt-0.5">{selectedBreakdown.matchedStudentCount} Students</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border">
                  <span className="text-slate-400 font-medium">Deliverable Interview Slots</span>
                  <p className="font-semibold text-emerald-700 mt-0.5">
                    {selectedBreakdown.assuranceCoveragePotential?.deliverableSlots || Math.min(selectedBreakdown.hiringVolume * 3, 45)} Slots
                  </p>
                </div>
              </div>

              {/* 10 Dimensions List */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  10 Fit Dimensions Breakdown
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  {selectedBreakdown.fitBreakdown &&
                    Object.entries(selectedBreakdown.fitBreakdown).map(([dim, val]: [string, any]) => (
                      <div key={dim} className="flex items-center justify-between p-2 rounded-md bg-slate-50/70 border border-slate-100">
                        <span className="text-slate-600 capitalize">{dim.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="font-semibold text-indigo-700">{typeof val === 'number' ? `${val}%` : String(val)}</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Provenance & Compliance */}
              <div className="p-3 rounded-lg bg-slate-100/60 border text-[11px] text-slate-600 space-y-1">
                <div className="flex items-center justify-between">
                  <span>Data Provenance:</span>
                  <strong className="text-slate-800">{selectedBreakdown.provenanceData?.sourceType || 'CORPORATE_CAREER_SITE'}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Data Freshness:</span>
                  <strong className="text-slate-800">{selectedBreakdown.freshnessStatus}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Privacy & Outreach Compliance Controls:</span>
                  <strong className="text-emerald-700">COMPLIANT (Zero-Scraping / Direct Outreach Controls)</strong>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" size="sm" onClick={() => setSelectedBreakdown(null)}>
                Close
              </Button>
              <Button
                size="sm"
                className="bg-indigo-600 text-white"
                onClick={() => {
                  setEnrollTarget(selectedBreakdown)
                  setSelectedBreakdown(null)
                }}
              >
                Enroll in Sequence
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Assurance Capacity Pitch Generator Modal */}
      {selectedPitch && (
        <Dialog open={Boolean(selectedPitch)} onOpenChange={() => setSelectedPitch(null)}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-600" />
                Assurance Capacity Pitch: {selectedPitch.companyName}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Zero-upfront, performance-contingent fresher hiring pitch providing access to pre-assessed, eligibility-matched candidates for verified interview slots.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2 text-xs">
              <div className="p-3 rounded-lg bg-slate-900 text-slate-100 font-mono text-[11px] leading-relaxed relative">
                <button
                  type="button"
                  onClick={() =>
                    copyPitchText(
                      `Hi ${selectedPitch.recruiterName || 'Talent Acquisition Team'},\n\nWe noticed ${selectedPitch.companyName}'s active hiring drive for fresher talent in ${selectedPitch.region}.\n\nPlacementConnect currently provides access to ${selectedPitch.matchedStudentCount} pre-assessed, eligibility-matched candidates meeting your specific criteria. We can deliver ${Math.min(selectedPitch.hiringVolume * 3, 45)} verified first-round interview slots directly to your recruiting team.\n\n• Zero Upfront Listing or Sourcing Fees\n• Pre-screened with 80+ benchmark diagnostic assessments\n• Performance fee (8.33% CTC) applies only on Day-1 joined hires\n\nWould you be open to a brief 10-minute briefing on Thursday at 3:00 PM IST to review candidate batch profiles?`
                    )
                  }
                  className="absolute top-2 right-2 p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  title="Copy Pitch"
                >
                  {copiedPitch ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                </button>

                <p className="text-slate-400 mb-2">Subject: Pre-Assessed Fresher Pipeline for {selectedPitch.companyName} ({selectedPitch.matchedStudentCount} Qualified Candidates)</p>
                <p>Hi {selectedPitch.recruiterName || 'Talent Acquisition Team'},</p>
                <p className="mt-2">We noticed {selectedPitch.companyName}'s active hiring drive for fresher talent in {selectedPitch.region}.</p>
                <p className="mt-2">PlacementConnect currently provides access to <strong>{selectedPitch.matchedStudentCount} pre-assessed, eligibility-matched candidates</strong> meeting your criteria. We can deliver <strong>{Math.min(selectedPitch.hiringVolume * 3, 45)} verified interview slots</strong> directly to your recruiting calendar.</p>
                <p className="mt-2 text-emerald-300">• Zero Upfront Listing or Sourcing Fees</p>
                <p className="text-emerald-300">• 80+ benchmark diagnostic verified</p>
                <p className="text-emerald-300">• Success fee (8.33% CTC) applies only on Day-1 join</p>
                <p className="mt-2">Would you be open to a 10-minute briefing on Thursday at 3:00 PM IST?</p>
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px]">
                💡 <strong>Why this converts:</strong> Resolves campus coordination overhead for the recruiter while offering pre-assessed candidate access against verified interview capacity.
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" size="sm" onClick={() => setSelectedPitch(null)}>
                Close
              </Button>
              <Button
                size="sm"
                className="bg-indigo-600 text-white"
                onClick={() => {
                  setEnrollTarget(selectedPitch)
                  setSelectedPitch(null)
                }}
              >
                Enroll in Fresher Sequence
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Enroll in Sequence Modal */}
      {enrollTarget && (
        <Dialog open={Boolean(enrollTarget)} onOpenChange={() => setEnrollTarget(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base">Enroll Employer into Sequence</DialogTitle>
              <DialogDescription className="text-xs">
                Enroll <strong>{enrollTarget.companyName}</strong> into an automated outreach cadence.
                Outbound messages require human approval before sending.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Target Sequence</label>
                <select
                  value={selectedSequenceId}
                  onChange={(e) => setSelectedSequenceId(e.target.value)}
                  className="w-full h-9 px-3 rounded-md border border-slate-200 bg-white font-medium text-slate-800"
                >
                  {sequences.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.stepsCount} steps)
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 rounded-lg bg-indigo-50/50 border border-indigo-100 text-indigo-800 space-y-1">
                <span className="font-semibold block">Target Contact:</span>
                <p>{enrollTarget.recruiterName || 'Talent Acquisition'} ({enrollTarget.recruiterEmail || 'No email on file'})</p>
                <p className="text-[11px] text-indigo-600 mt-1">
                  Enrolling automatically prepares Step 1 draft in the Outreach Vault. Dispatch happens only upon human approval.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" size="sm" onClick={() => setEnrollTarget(null)}>
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={isEnrolling}
                onClick={handleEnrollInSequence}
                className="bg-indigo-600 text-white"
              >
                {isEnrolling ? 'Enrolling...' : 'Confirm Enrollment & Draft'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Employer Modal */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-indigo-600" />
              Add Employer Prospect
            </DialogTitle>
            <DialogDescription className="text-xs">
              Register an employer to evaluate 10-dimension fit and quantify matching student candidates.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateEmployer} className="space-y-3 py-2 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block font-medium text-slate-700 mb-1">Company Name *</label>
                <Input
                  required
                  placeholder="e.g. Innovatech Solutions Pvt Ltd"
                  value={newEmployer.companyName}
                  onChange={(e) => setNewEmployer({ ...newEmployer, companyName: e.target.value })}
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Company Website *</label>
                <Input
                  required
                  placeholder="e.g. https://innovatech.io"
                  value={newEmployer.website}
                  onChange={(e) => setNewEmployer({ ...newEmployer, website: e.target.value })}
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Industry *</label>
                <Input
                  required
                  placeholder="e.g. FinTech / SaaS"
                  value={newEmployer.industry}
                  onChange={(e) => setNewEmployer({ ...newEmployer, industry: e.target.value })}
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Region *</label>
                <select
                  value={newEmployer.region}
                  onChange={(e) => setNewEmployer({ ...newEmployer, region: e.target.value })}
                  className="w-full h-9 px-3 rounded-md border border-slate-200 bg-white font-medium text-slate-800"
                >
                  <option value="Delhi NCR">Delhi NCR</option>
                  <option value="Gurgaon">Gurgaon</option>
                  <option value="Pune">Pune</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Hyderabad">Hyderabad</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Fresher Hiring Volume</label>
                <Input
                  type="number"
                  placeholder="30"
                  value={newEmployer.hiringVolume}
                  onChange={(e) => setNewEmployer({ ...newEmployer, hiringVolume: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="col-span-2">
                <label className="block font-medium text-slate-700 mb-1">Open Roles (Comma separated)</label>
                <Input
                  placeholder="e.g. Inside Sales Associate, Junior Backend Dev"
                  value={newEmployer.openRoles}
                  onChange={(e) => setNewEmployer({ ...newEmployer, openRoles: e.target.value })}
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Recruiter Name</label>
                <Input
                  placeholder="e.g. Priya Nair"
                  value={newEmployer.recruiterName}
                  onChange={(e) => setNewEmployer({ ...newEmployer, recruiterName: e.target.value })}
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Recruiter Email</label>
                <Input
                  type="email"
                  placeholder="e.g. priya.nair@innovatech.io"
                  value={newEmployer.recruiterEmail}
                  onChange={(e) => setNewEmployer({ ...newEmployer, recruiterEmail: e.target.value })}
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isSubmitting} className="bg-indigo-600 text-white">
                {isSubmitting ? 'Evaluating Fit...' : 'Save & Calculate Pool'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
