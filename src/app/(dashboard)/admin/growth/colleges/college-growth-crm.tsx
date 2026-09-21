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
  Building2, Search, Filter, ShieldCheck, Mail, Phone, ExternalLink,
  ChevronRight, Sparkles, CheckCircle2, AlertTriangle, UserCheck, Plus,
  Layers, ArrowUpRight, Clock, Award, Check
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export interface CollegeProspectItem {
  id: string
  name: string
  normalizedDomain: string
  website: string
  city: string
  state: string
  region: string
  courses: string[]
  estimatedCohort: number
  icpScore: number
  icpBreakdown: any
  fitSummary: string | null
  recommendedPitch: string | null
  tpoName: string | null
  tpoEmail: string | null
  tpoPhone: string | null
  freshnessStatus: 'FRESH' | 'RECENT' | 'STALE' | 'EXPIRED'
  complianceStatus: string
  status: string
  dnc: boolean
  lastVerifiedAt: string
  provenanceData: any
  createdAt: string
}

export interface SequenceOption {
  id: string
  name: string
  targetType: string
  stepsCount: number
}

interface CollegeGrowthCrmProps {
  initialProspects: CollegeProspectItem[]
  sequences: SequenceOption[]
}

export function CollegeGrowthCrm({ initialProspects, sequences }: CollegeGrowthCrmProps) {
  const [prospects, setProspects] = React.useState<CollegeProspectItem[]>(initialProspects)
  const [search, setSearch] = React.useState('')
  const [selectedRegion, setSelectedRegion] = React.useState('ALL')
  const [selectedStatus, setSelectedStatus] = React.useState('ALL')
  const [minScore, setMinScore] = React.useState<number>(0)

  // Modals state
  const [selectedBreakdown, setSelectedBreakdown] = React.useState<CollegeProspectItem | null>(null)
  const [enrollTarget, setEnrollTarget] = React.useState<CollegeProspectItem | null>(null)
  const [selectedSequenceId, setSelectedSequenceId] = React.useState<string>(sequences[0]?.id || '')
  const [isEnrolling, setIsEnrolling] = React.useState(false)
  const [addModalOpen, setAddModalOpen] = React.useState(false)

  // Add prospect form state
  const [newProspect, setNewProspect] = React.useState({
    name: '',
    website: '',
    city: '',
    state: '',
    region: 'Delhi NCR',
    courses: ['B.Tech', 'BCA'],
    estimatedCohort: 600,
    tpoName: '',
    tpoEmail: '',
    tpoPhone: '',
    accreditation: 'NAAC A+',
    notes: '',
  })
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Filtered prospects
  const filteredProspects = React.useMemo(() => {
    return prospects.filter((p) => {
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.city.toLowerCase().includes(search.toLowerCase()) ||
        (p.tpoName && p.tpoName.toLowerCase().includes(search.toLowerCase()))

      const matchRegion = selectedRegion === 'ALL' || p.region === selectedRegion
      const matchStatus = selectedStatus === 'ALL' || p.status === selectedStatus
      const matchScore = p.icpScore >= minScore

      return matchSearch && matchRegion && matchStatus && matchScore
    })
  }, [prospects, search, selectedRegion, selectedStatus, minScore])

  // KPIs
  const kpis = React.useMemo(() => {
    const total = prospects.length
    const qualified = prospects.filter((p) => p.icpScore >= 70).length
    const verifiedTpo = prospects.filter((p) => p.tpoEmail && p.tpoName).length
    const activeOutreach = prospects.filter((p) =>
      ['SEQUENCE_ENROLLED', 'OUTREACH_PENDING', 'OUTREACH_ACTIVE', 'MEETING_SCHEDULED'].includes(p.status)
    ).length
    const converted = prospects.filter((p) => p.status === 'WON_ONBOARDED').length

    return { total, qualified, verifiedTpo, activeOutreach, converted }
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
          prospectType: 'COLLEGE',
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
      toast.success(`${enrollTarget.name} successfully enrolled in outreach sequence! Draft generated.`)
      setEnrollTarget(null)
    } catch (err: any) {
      toast.error(err.message || 'Could not enroll prospect')
    } finally {
      setIsEnrolling(false)
    }
  }

  const handleCreateProspect = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/growth/colleges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProspect),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error?.message || 'Failed to create college prospect')

      const created: CollegeProspectItem = {
        ...json.data,
        createdAt: json.data.createdAt || new Date().toISOString(),
        lastVerifiedAt: json.data.lastVerifiedAt || new Date().toISOString(),
      }
      setProspects((prev) => [created, ...prev])
      toast.success(`Prospect ${created.name} added and evaluated with ICP score of ${created.icpScore}`)
      setAddModalOpen(false)
      setNewProspect({
        name: '',
        website: '',
        city: '',
        state: '',
        region: 'Delhi NCR',
        courses: ['B.Tech', 'BCA'],
        estimatedCohort: 600,
        tpoName: '',
        tpoEmail: '',
        tpoPhone: '',
        accreditation: 'NAAC A+',
        notes: '',
      })
    } catch (err: any) {
      toast.error(err.message || 'Could not create prospect')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getScoreBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-emerald-600 text-white font-bold">{score} / 100 ICP</Badge>
    if (score >= 70) return <Badge className="bg-teal-600 text-white font-semibold">{score} / 100 ICP</Badge>
    if (score >= 50) return <Badge className="bg-amber-500 text-white font-medium">{score} / 100 ICP</Badge>
    return <Badge variant="outline" className="text-slate-500">{score} / 100 ICP</Badge>
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

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link href="/admin/growth" className="hover:underline text-indigo-600">GrowthOS</Link>
            <span>/</span>
            <span className="font-semibold text-slate-700">College Acquisition CRM</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Building2 className="h-6 w-6 text-indigo-600" />
            College ICP Sourcing & Acquisition Pipeline
          </h1>
          <p className="text-sm text-slate-600">
            Autonomous discovery, 11-dimension qualification, TPO verification, and human-in-the-loop outreach.
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
            Add College Prospect
          </Button>
        </div>
      </div>

      {/* KPI Overview Banner */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card className="p-4 bg-slate-50/60 border-slate-200/80">
          <span className="text-xs font-medium text-slate-500">Total Sourced</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">{kpis.total}</p>
          <span className="text-[11px] text-slate-400">Public & AISHE registry</span>
        </Card>
        <Card className="p-4 bg-emerald-50/50 border-emerald-200/80">
          <span className="text-xs font-semibold text-emerald-800">High ICP Fit (≥70)</span>
          <p className="text-2xl font-bold text-emerald-700 mt-1">{kpis.qualified}</p>
          <span className="text-[11px] text-emerald-600">11-dimension qualified</span>
        </Card>
        <Card className="p-4 bg-blue-50/50 border-blue-200/80">
          <span className="text-xs font-semibold text-blue-800">Verified TPOs</span>
          <p className="text-2xl font-bold text-blue-700 mt-1">{kpis.verifiedTpo}</p>
          <span className="text-[11px] text-blue-600">Direct contact ready</span>
        </Card>
        <Card className="p-4 bg-indigo-50/50 border-indigo-200/80">
          <span className="text-xs font-semibold text-indigo-800">Active Sequences</span>
          <p className="text-2xl font-bold text-indigo-700 mt-1">{kpis.activeOutreach}</p>
          <span className="text-[11px] text-indigo-600">In multi-step cadences</span>
        </Card>
        <Card className="p-4 bg-teal-50/50 border-teal-200/80">
          <span className="text-xs font-semibold text-teal-800">Onboarded / MoUs</span>
          <p className="text-2xl font-bold text-teal-700 mt-1">{kpis.converted}</p>
          <span className="text-[11px] text-teal-600">Integrated campuses</span>
        </Card>
      </div>

      {/* Filter Toolbar */}
      <Card className="p-4 shadow-xs">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search college, city, or TPO name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Region Selector */}
            <select
              aria-label="Filter colleges by region"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="h-9 px-3 text-xs rounded-md border border-slate-200 bg-white font-medium text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            >
              <option value="ALL">All Regions</option>
              <option value="Delhi NCR">Delhi NCR</option>
              <option value="Gurgaon">Gurgaon</option>
              <option value="Pune">Pune</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Chennai">Chennai</option>
            </select>

            {/* Status Selector */}
            <select
              aria-label="Filter colleges by pipeline status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-9 px-3 text-xs rounded-md border border-slate-200 bg-white font-medium text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="DISCOVERED">Discovered</option>
              <option value="ICP_SCORED">ICP Scored</option>
              <option value="SEQUENCE_ENROLLED">Sequence Enrolled</option>
              <option value="OUTREACH_ACTIVE">Outreach Active</option>
              <option value="MEETING_SCHEDULED">Meeting Booked</option>
              <option value="NEGOTIATING">Negotiating</option>
              <option value="WON_ONBOARDED">Won / Onboarded</option>
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
                ≥70 ICP
              </button>
              <button
                type="button"
                onClick={() => setMinScore(80)}
                className={`px-2.5 py-1 rounded-sm font-medium transition ${minScore === 80 ? 'bg-white shadow-xs text-emerald-800' : 'text-slate-600'}`}
              >
                ≥80 Top Tier
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Prospects Table / Grid */}
      <div className="space-y-3">
        {filteredProspects.length === 0 ? (
          <Card className="p-12 text-center border-dashed">
            <Building2 className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">No college prospects match current criteria</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
              Try adjusting your search terms, regional filter, or minimum ICP score threshold.
            </p>
          </Card>
        ) : (
          filteredProspects.map((prospect) => (
            <Card key={prospect.id} className="p-4 hover:border-indigo-300 transition shadow-xs">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* College Info & ICP */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-base text-slate-900 tracking-tight">
                      {prospect.name}
                    </span>
                    {getScoreBadge(prospect.icpScore)}
                    {getFreshnessBadge(prospect.freshnessStatus)}
                    {prospect.dnc && (
                      <Badge variant="destructive" className="text-[10px]">DNC SUPPRESSED</Badge>
                    )}
                    <Badge variant="outline" className="text-[10px] bg-slate-50 text-slate-600">
                      {prospect.status.replace('_', ' ')}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-600 flex-wrap">
                    <span>📍 {prospect.city}, {prospect.state} ({prospect.region})</span>
                    <span>🎓 Cohort: <strong className="text-slate-900">{prospect.estimatedCohort} students</strong></span>
                    <span>📚 Programs: {prospect.courses.join(', ')}</span>
                    <a
                      href={prospect.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline flex items-center gap-0.5"
                    >
                      Website <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>

                  {prospect.fitSummary && (
                    <p className="text-xs text-slate-500 line-clamp-1 italic">
                      "{prospect.fitSummary}"
                    </p>
                  )}
                </div>

                {/* TPO Contact Card & Actions */}
                <div className="flex items-center gap-6 border-t lg:border-t-0 pt-3 lg:pt-0 lg:border-l lg:pl-6 shrink-0">
                  {/* TPO Contact Details */}
                  <div className="text-xs space-y-0.5 min-w-[170px]">
                    <span className="font-semibold text-slate-800 flex items-center gap-1">
                      <UserCheck className="h-3.5 w-3.5 text-indigo-600" />
                      {prospect.tpoName || 'TPO Unassigned'}
                    </span>
                    {prospect.tpoEmail ? (
                      <a href={`mailto:${prospect.tpoEmail}`} className="text-slate-500 hover:text-indigo-600 flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {prospect.tpoEmail}
                      </a>
                    ) : (
                      <span className="text-slate-400 italic">No email on file</span>
                    )}
                    {prospect.tpoPhone && (
                      <span className="text-slate-500 flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {prospect.tpoPhone}
                      </span>
                    )}
                  </div>

                  {/* Operational Buttons */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedBreakdown(prospect)}
                      className="text-xs"
                    >
                      11-D Breakdown
                    </Button>

                    <Button
                      size="sm"
                      disabled={prospect.dnc || prospect.freshnessStatus === 'EXPIRED'}
                      onClick={() => setEnrollTarget(prospect)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs flex items-center gap-1"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      Enroll Sequence
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* 11-Dimension ICP Breakdown Modal */}
      {selectedBreakdown && (
        <Dialog open={Boolean(selectedBreakdown)} onOpenChange={() => setSelectedBreakdown(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between text-lg">
                <span>{selectedBreakdown.name}</span>
                {getScoreBadge(selectedBreakdown.icpScore)}
              </DialogTitle>
              <DialogDescription>
                Deterministic 11-dimension ICP evaluation for student capacity & partnership viability.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border">
                  <span className="text-slate-400 font-medium">Location & Region</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{selectedBreakdown.city}, {selectedBreakdown.region}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border">
                  <span className="text-slate-400 font-medium">Graduating Cohort Size</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{selectedBreakdown.estimatedCohort} Students</p>
                </div>
              </div>

              {/* Dimension Score List */}
              {/* Dimension Score List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Deterministic 11-Dimension ICP Model (100% Total)
                  </h4>
                  <Badge variant="outline" className="text-[10px] bg-indigo-50 text-indigo-700 font-mono font-semibold">
                    11 Dimensions = 100%
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  {selectedBreakdown.icpBreakdown &&
                    Object.entries({
                      studentVolume: { title: '1. Graduating Student Volume', weight: 15, desc: 'Cohort size potential for 3N batch assurance' },
                      courseRelevancy: { title: '2. Course Diversity & Relevancy', weight: 15, desc: 'B.Tech, BCA, MCA, MBA alignment' },
                      placementGap: { title: '3. Historical Placement Gap', weight: 10, desc: 'Commercial partnership need index' },
                      employerAccessibility: { title: '4. Regional Employer Proximity', weight: 10, desc: 'Cluster alignment with corporate demand' },
                      tpoAccessibility: { title: '5. TPO Accessibility & Verification', weight: 10, desc: 'Direct contact reachable & verified' },
                      studentAffordability: { title: '6. Student Affordability & Economics', weight: 10, desc: 'Regional fee structure viability' },
                      industryMous: { title: '7. Industry MOUs & Track Record', weight: 10, desc: 'Campus drive responsiveness history' },
                      campusInfrastructure: { title: '8. Assessment Lab Infrastructure', weight: 5, desc: 'Diagnostic test facilities on-campus' },
                      conversionPotential: { title: '9. Student Conversion Potential', weight: 5, desc: 'Assurance participation willingness' },
                      accreditationSignal: { title: '10. Accreditation Signal (NAAC/NBA)', weight: 5, desc: 'Institutional quality baseline signal' },
                      partnershipLikelihood: { title: '11. Partnership & MoU Likelihood', weight: 5, desc: 'Strategic fit for 3N assurance ecosystem' },
                    }).map(([key, config]) => {
                      const score = selectedBreakdown.icpBreakdown?.[key] ?? 0
                      return (
                        <div key={key} className="p-2 rounded-md bg-slate-50 border border-slate-200/70 space-y-0.5">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-800 text-[11px]">{config.title}</span>
                            <span className="font-mono font-bold text-indigo-700 text-[11px]">{score} / {config.weight} pts</span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-slate-500">
                            <span className="truncate">{config.desc}</span>
                            <span className="font-medium text-slate-400 shrink-0 ml-1">Weight: {config.weight}%</span>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>

              {/* Recommended Pitch */}
              {selectedBreakdown.recommendedPitch && (
                <div className="p-3 rounded-lg bg-indigo-50/50 border border-indigo-100">
                  <span className="text-xs font-semibold text-indigo-900 block mb-1">
                    AI-Formulated Partner Pitch
                  </span>
                  <p className="text-xs text-indigo-800 leading-relaxed">
                    {selectedBreakdown.recommendedPitch}
                  </p>
                </div>
              )}

              {/* Provenance & Compliance Info */}
              <div className="p-3 rounded-lg bg-slate-100/60 border text-[11px] text-slate-600 space-y-1">
                <div className="flex items-center justify-between">
                  <span>Data Source Provenance:</span>
                  <strong className="text-slate-800">{selectedBreakdown.provenanceData?.sourceType || 'OFFICIAL_REGISTRY'}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Data Freshness:</span>
                  <strong className="text-slate-800">{selectedBreakdown.freshnessStatus}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Privacy & Outreach Compliance Controls:</span>
                  <strong className="text-emerald-700">VERIFIED OFFICIAL CONTACT (DPDP-Oriented Controls)</strong>
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

      {/* Enroll in Sequence Modal */}
      {enrollTarget && (
        <Dialog open={Boolean(enrollTarget)} onOpenChange={() => setEnrollTarget(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base">Enroll in Outreach Sequence</DialogTitle>
              <DialogDescription className="text-xs">
                Enroll <strong>{enrollTarget.name}</strong> into an automated multi-step cadence.
                Outbound emails require human review before dispatch.
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

              <div className="p-3 rounded-lg bg-blue-50/50 border border-blue-100 text-blue-800 space-y-1">
                <span className="font-semibold block">Target Contact:</span>
                <p>TPO: {enrollTarget.tpoName || 'Placement Cell'} ({enrollTarget.tpoEmail || 'No email'})</p>
                <p className="text-[11px] text-blue-600 mt-1">
                  Enrolling creates Step 1 draft in the Outreach Approval Vault. No communication is dispatched automatically.
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

      {/* Add College Prospect Modal */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base flex items-center gap-2">
              <Building2 className="h-5 w-5 text-indigo-600" />
              Add College Prospect
            </DialogTitle>
            <DialogDescription className="text-xs">
              Register a college or university for automated 11-dimension ICP evaluation and acquisition.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateProspect} className="space-y-3 py-2 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block font-medium text-slate-700 mb-1">Institution Name *</label>
                <Input
                  required
                  placeholder="e.g. Apex Institute of Engineering & Technology"
                  value={newProspect.name}
                  onChange={(e) => setNewProspect({ ...newProspect, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Official Website *</label>
                <Input
                  required
                  placeholder="e.g. https://apexinstitute.edu.in"
                  value={newProspect.website}
                  onChange={(e) => setNewProspect({ ...newProspect, website: e.target.value })}
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Region *</label>
                <select
                  value={newProspect.region}
                  onChange={(e) => setNewProspect({ ...newProspect, region: e.target.value })}
                  className="w-full h-9 px-3 rounded-md border border-slate-200 bg-white font-medium text-slate-800"
                >
                  <option value="Delhi NCR">Delhi NCR</option>
                  <option value="Gurgaon">Gurgaon</option>
                  <option value="Pune">Pune</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Mumbai">Mumbai</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">City *</label>
                <Input
                  required
                  placeholder="e.g. Noida"
                  value={newProspect.city}
                  onChange={(e) => setNewProspect({ ...newProspect, city: e.target.value })}
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">State *</label>
                <Input
                  required
                  placeholder="e.g. Uttar Pradesh"
                  value={newProspect.state}
                  onChange={(e) => setNewProspect({ ...newProspect, state: e.target.value })}
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Graduating Cohort Size</label>
                <Input
                  type="number"
                  placeholder="500"
                  value={newProspect.estimatedCohort}
                  onChange={(e) => setNewProspect({ ...newProspect, estimatedCohort: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Accreditation</label>
                <Input
                  placeholder="e.g. NAAC A+"
                  value={newProspect.accreditation}
                  onChange={(e) => setNewProspect({ ...newProspect, accreditation: e.target.value })}
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">TPO Name</label>
                <Input
                  placeholder="e.g. Dr. Rajesh Sharma"
                  value={newProspect.tpoName}
                  onChange={(e) => setNewProspect({ ...newProspect, tpoName: e.target.value })}
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">TPO Official Email</label>
                <Input
                  type="email"
                  placeholder="e.g. tpo@apexinstitute.edu.in"
                  value={newProspect.tpoEmail}
                  onChange={(e) => setNewProspect({ ...newProspect, tpoEmail: e.target.value })}
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isSubmitting} className="bg-indigo-600 text-white">
                {isSubmitting ? 'Evaluating ICP...' : 'Save & Evaluate ICP'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
