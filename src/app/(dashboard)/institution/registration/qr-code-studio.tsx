'use client'

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Copy, Check, QrCode, Download, Share2, ExternalLink, 
  Users, AlertCircle, Building2, CheckCircle2, MessageSquare 
} from 'lucide-react'
import Link from 'next/link'

interface QrCodeStudioProps {
  institutionId: string
  institutionName: string
  registrationCode: string
  registeredCount: number
  totalExpected: number
  unregisteredGap: number
}

export function QrCodeStudio({
  institutionId,
  institutionName,
  registrationCode,
  registeredCount,
  totalExpected,
  unregisteredGap,
}: QrCodeStudioProps) {
  const [copied, setCopied] = React.useState(false)
  const [origin, setOrigin] = React.useState('')

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin)
    }
  }, [])

  const registrationUrl = `${origin || 'http://localhost:3000'}/register/${registrationCode}`
  const qrEndpoint = `/api/institutions/${institutionId}/qr`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(registrationUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const shareWhatsApp = () => {
    const text = encodeURIComponent(
      `Attention Batch of 2026 Students of ${institutionName}:\nPlease complete your official Placement Assurance registration using our dedicated institutional link:\n${registrationUrl}`
    )
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank')
  }

  const shareEmail = () => {
    const subject = encodeURIComponent(`Mandatory: Placement Assurance Enrolment — ${institutionName}`)
    const body = encodeURIComponent(
      `Dear Students,\n\nPlease register on the placement portal using our college link:\n${registrationUrl}\n\nThis is required for campus drives and 3-Interview Assurance tracking.\n\nTraining & Placement Cell\n${institutionName}`
    )
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  const registrationPct = totalExpected > 0 ? Math.round((registeredCount / totalExpected) * 100) : 0

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Left 2 Cols: Link and Distribution Tools */}
      <div className="lg:col-span-2 space-y-6">
        {/* Link Box Card */}
        <Card className="border-slate-200/80 shadow-xs bg-white">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-base font-bold text-slate-900">
              Institutional Registration Link
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Students registering through this URL are permanently tied to {institutionName}.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Input
                readOnly
                value={registrationUrl}
                className="font-mono text-xs bg-slate-50 text-slate-800 border-slate-200"
              />
              <Button
                onClick={copyToClipboard}
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-700 text-white shrink-0 text-xs"
              >
                {copied ? <Check className="h-3.5 w-3.5 mr-1" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                {copied ? 'Copied!' : 'Copy Link'}
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button onClick={shareWhatsApp} variant="outline" size="sm" className="text-xs text-emerald-700 border-emerald-200 hover:bg-emerald-50">
                <MessageSquare className="h-3.5 w-3.5 mr-1.5" /> Share on WhatsApp Batch Group
              </Button>
              <Button onClick={shareEmail} variant="outline" size="sm" className="text-xs text-slate-700 border-slate-200 hover:bg-slate-50">
                <Share2 className="h-3.5 w-3.5 mr-1.5" /> Share via Circular Email
              </Button>
              <Link href={`/register/${registrationCode}`} target="_blank">
                <Button variant="ghost" size="sm" className="text-xs text-indigo-600">
                  Preview Student Form <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Cohort Participation Card */}
        <Card className="border-slate-200/80 shadow-xs bg-white">
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">
                  Cohort Enrolment Progress
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Comparing active registrations against total batch denominator
                </CardDescription>
              </div>
              <span className="font-mono text-xs font-bold text-slate-900 tabular-nums">
                {registrationPct}% Registered
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className="bg-indigo-600 h-3 rounded-full transition-all"
                style={{ width: `${Math.min(100, registrationPct)}%` }}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-3 pt-2">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                <span className="text-[11px] text-slate-500 uppercase font-semibold">Total Batch Denominator</span>
                <div className="text-xl font-bold text-slate-900 mt-1 tabular-nums">{totalExpected}</div>
              </div>
              <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-200">
                <span className="text-[11px] text-emerald-700 uppercase font-semibold">Registered Students</span>
                <div className="text-xl font-bold text-emerald-900 mt-1 tabular-nums">{registeredCount}</div>
              </div>
              <div className="p-3 rounded-lg bg-amber-50/50 border border-amber-200">
                <span className="text-[11px] text-amber-700 uppercase font-semibold">Unregistered Gap</span>
                <div className="text-xl font-bold text-amber-900 mt-1 tabular-nums">{unregisteredGap}</div>
              </div>
            </div>

            {unregisteredGap > 0 && (
              <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-800">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>
                  <strong>Participation Notice:</strong> {unregisteredGap} eligible students in your graduating batch have not yet registered. Broadcast the registration link to maximize placement rates.
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right Column: High-Res QR Code Card */}
      <Card className="border-slate-200/80 shadow-xs bg-white text-center">
        <CardHeader className="border-b border-slate-100 pb-3">
          <CardTitle className="text-base font-bold text-slate-900">
            College Campus QR Code
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Print for TPO noticeboards, orientation slides, and posters.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="mx-auto w-48 h-48 p-3 rounded-2xl bg-white border-2 border-slate-200 flex items-center justify-center shadow-xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrEndpoint}
              alt={`QR Code for ${institutionName}`}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="space-y-1">
            <div className="text-xs font-mono font-bold text-slate-800">
              CODE: {registrationCode}
            </div>
            <p className="text-[11px] text-slate-400">
              Scans directly to {institutionName}&apos;s enrolment form
            </p>
          </div>

          <a href={qrEndpoint} download={`QR_${registrationCode}.png`} className="block">
            <Button variant="outline" size="sm" className="w-full text-xs">
              <Download className="h-3.5 w-3.5 mr-1.5" /> Download High-Res PNG
            </Button>
          </a>
        </CardContent>
      </Card>
    </div>
  )
}
