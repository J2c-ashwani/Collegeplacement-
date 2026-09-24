'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  Briefcase,
  GraduationCap,
  Activity,
  ShieldCheck,
  CheckCircle2,
  QrCode,
  ArrowUpRight,
} from 'lucide-react';
import {
  SAFE_TERMINOLOGY,
  FOUR_DENOMINATOR_MODEL,
  NINE_DIMENSIONS_SPEC,
} from '@/config/brand-system';
import { COMPANY_IDENTITY } from '@/config/company-identity';

type ShowcaseTab = 'TPO' | 'EMPLOYER' | 'STUDENT' | 'GROWTH';

export function ProductShowcaseInstrument() {
  const [activeTab, setActiveTab] = useState<ShowcaseTab>('TPO');

  return (
    <div className="rounded-lg border border-slate-300 bg-white shadow-sm overflow-hidden">
      {/* Single Focal Workspace Header Bar (Discoverable Technical Precision) */}
      <div className="bg-[#0F172A] text-white px-5 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 mr-1">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-600" />
            <span className="h-2.5 w-2.5 rounded-full bg-slate-600" />
            <span className="h-2.5 w-2.5 rounded-full bg-slate-600" />
          </div>
          <span className="text-xs font-medium text-slate-200">
            {SAFE_TERMINOLOGY.productPreviewLabel}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-amber-500/20 border border-amber-400/50 text-amber-200 font-mono text-[10px] font-semibold uppercase tracking-wider">
            DEMO DATA — NOT LIVE INSTITUTIONAL RESULTS
          </span>
          <span className="font-mono text-[11px] text-slate-400">
            Sample Workspace: Apex Institute of Technology (Batch 2026)
          </span>
        </div>
      </div>

      {/* Role Switcher Tabs */}
      <div className="bg-slate-100/90 border-b border-slate-200 px-5 pt-3 flex flex-wrap gap-2">
        {[
          {
            id: 'TPO' as const,
            label: 'TPO Placement Ledger',
            icon: Building2,
          },
          {
            id: 'EMPLOYER' as const,
            label: 'Recruiter Hiring Pipeline',
            icon: Briefcase,
          },
          {
            id: 'STUDENT' as const,
            label: 'Candidate Scorecard & Credential',
            icon: GraduationCap,
          },
          {
            id: 'GROWTH' as const,
            label: 'Interview Capacity Balance',
            icon: Activity,
          },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-xs font-semibold rounded-t-md border-t border-x flex items-center gap-2 transition-colors ${
                isActive
                  ? 'bg-white text-[#1E40AF] border-slate-300 -mb-px pb-3'
                  : 'bg-slate-200/50 text-slate-600 border-transparent hover:text-slate-900'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content Area (Discoverable System Depth) */}
      <div className="p-6 sm:p-8 bg-white">
        {activeTab === 'TPO' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-[#1E40AF]">
                    Four-Level Placement Reporting
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-50 border border-amber-300 text-amber-900 font-mono text-[10px] font-bold uppercase tracking-wide">
                    ILLUSTRATIVE SAMPLE WORKSPACE
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  Apex Institute of Technology — Graduating Batch 2026 (Sample Cohort)
                </h3>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-3 py-1 rounded bg-slate-100 border border-slate-200 text-slate-700 font-mono">
                  <QrCode className="h-3.5 w-3.5 inline mr-1.5 text-blue-700" />
                  Campus Code: APX123 (Demo)
                </span>
                <span className="px-3 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-900 font-semibold">
                  384 Confirmed Placements (Sample Data)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {FOUR_DENOMINATOR_MODEL.map((d) => (
                <div
                  key={d.id}
                  className="p-4 rounded-md border border-slate-200 bg-slate-50/60 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">{d.code}</span>
                    <span className="font-mono font-semibold text-slate-700">{d.percentOfBatch} of batch</span>
                  </div>
                  <div className="text-2xl font-mono font-bold text-slate-900 tabular-nums">
                    {d.sampleCount} <span className="text-xs font-sans font-normal text-slate-500">students</span>
                  </div>
                  <div className="p-2 rounded bg-white border border-slate-200/80 flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">Placement Rate:</span>
                    <span className="font-mono font-bold text-[#1E40AF]">{d.samplePlacementRate}</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-500">{d.formulaText}</div>
                  <p className="text-xs text-slate-600 leading-relaxed">{d.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'EMPLOYER' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="text-xs font-semibold text-emerald-800">
                  Pre-Assessed Graduate Shortlist &amp; Interview Funnel
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  TechCorp Solutions — Software Engineer (2026 Batch)
                </h3>
              </div>
              <span className="text-xs px-3 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-900 font-semibold">
                Institution-Verified Cohort • 9-Competency Shortlist (Sample Data)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
              {[
                { label: 'Matched & Screened', count: '82', pct: '100%' },
                { label: 'Shortlisted for Drive', count: '61', pct: '74%' },
                { label: 'Candidates Interviewed', count: '44', pct: '54%' },
                { label: 'Offers Extended', count: '6', pct: '7%' },
                { label: 'Confirmed Joined', count: '4', pct: '5%' },
              ].map((stage) => (
                <div
                  key={stage.label}
                  className="p-4 rounded-md border border-slate-200 bg-slate-50/70 space-y-1.5"
                >
                  <div className="text-xs font-medium text-slate-600">{stage.label}</div>
                  <div className="text-2xl font-mono font-bold text-slate-900 tabular-nums">
                    {stage.count}{' '}
                    <span className="text-xs font-normal text-slate-500">({stage.pct})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'STUDENT' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <div className="text-xs font-semibold text-[#1E40AF]">
                  Verified Candidate Credential
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {COMPANY_IDENTITY.sampleCredentials.validStudentName} — Composite Score: 85 / 100
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-mono">
                  <span>Credential ID: {COMPANY_IDENTITY.sampleCredentials.validStudentId}</span>
                  <span>Verification status: Valid</span>
                  <span>Assessment completed: 15 August 2026</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-xs px-3 py-1 rounded bg-blue-50 border border-blue-200 text-blue-900 font-medium">
                  Interviews Completed: <strong className="font-mono">2 / 3</strong>
                </span>
                <Link
                  href={`/verify/${COMPANY_IDENTITY.sampleCredentials.validStudentId}`}
                  className="text-xs px-3 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-900 font-semibold inline-flex items-center gap-1 hover:bg-emerald-100 transition-colors"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Inspect Live Record
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {NINE_DIMENSIONS_SPEC.map((dim) => (
                <div
                  key={dim.id}
                  className="p-3.5 rounded-md border border-slate-200 bg-slate-50/60 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">{dim.samplePercentile}</span>
                    <span className="font-mono font-bold text-slate-900">{dim.sampleScore}/100</span>
                  </div>
                  <div className="text-xs font-bold text-slate-800 line-clamp-1">{dim.name}</div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#1E40AF] rounded-full"
                      style={{ width: `${dim.sampleScore}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'GROWTH' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="text-xs font-semibold text-emerald-800">
                  Employer Interview Supply vs. Student Cohort Demand
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  Confirmed Employer Interview Capacity Balance
                </h3>
              </div>
              <span className="text-xs px-3 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-900 font-semibold">
                Supply Buffer: <strong className="font-mono">1.28x</strong> Active Ratio
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-md border border-slate-200 bg-slate-50/60 space-y-1.5">
                <div className="text-xs font-medium text-slate-500">
                  Promised Student Interviews
                </div>
                <div className="text-2xl font-mono font-bold text-slate-900">
                  1,320 Interview Slots
                </div>
                <p className="text-xs text-slate-600">
                  440 enrolled students &times; 3 guaranteed interview opportunities each.
                </p>
              </div>
              <div className="p-5 rounded-md border border-slate-200 bg-slate-50/60 space-y-1.5">
                <div className="text-xs font-medium text-slate-500">
                  Required 20% Safety Buffer
                </div>
                <div className="text-2xl font-mono font-bold text-[#1E40AF]">
                  1,584 Target Slots
                </div>
                <p className="text-xs text-slate-600">
                  Minimum confirmed employer capacity required before activating new cohorts.
                </p>
              </div>
              <div className="p-5 rounded-md border border-slate-200 bg-slate-50/60 space-y-1.5">
                <div className="text-xs font-medium text-slate-500">
                  Confirmed Employer Pipeline
                </div>
                <div className="text-2xl font-mono font-bold text-emerald-700">
                  1,690 Active Slots
                </div>
                <p className="text-xs text-slate-600 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  Cohort commitments fully backed by active employer interview schedules.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
