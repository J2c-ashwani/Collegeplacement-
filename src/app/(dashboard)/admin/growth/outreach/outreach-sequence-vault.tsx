'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from '@/components/ui/dialog'
import {
  Mail, Send, CheckCircle2, AlertTriangle, ShieldCheck, Clock,
  Play, RefreshCw, UserX, MessageSquare, Sparkles, Building2,
  Briefcase, Eye, Trash2, Check, ExternalLink, ShieldAlert
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export interface OutreachDraftItem {
  id: string
  prospectType: 'COLLEGE' | 'EMPLOYER'
  subject: string
  body: string
  status: string
  isSafeAction: boolean
  createdAt: string
  collegeProspect?: {
    id: string
    name: string
    tpoName: string | null
    tpoEmail: string | null
    region: string
    freshnessStatus: string
  } | null
  employerProspect?: {
    id: string
    companyName: string
    recruiterName: string | null
    recruiterEmail: string | null
    region: string
    freshnessStatus: string
  } | null
  step?: {
    stepNumber: number
    channel: string
  } | null
}

export interface SequenceItem {
  id: string
  name: string
  targetType: 'COLLEGE' | 'EMPLOYER'
  description: string | null
  isActive: boolean
  steps: Array<{
    id: string
    stepNumber: number
    delayDays: number
    templateSubject: string
    templateBody: string
    channel: string
  }>
  _count: {
    enrollments: number
  }
}

export interface ReplyItem {
  id: string
  senderEmail: string
  snippet: string
  body: string
  intent: string
  confidence: number
  suggestedAction: string | null
  requiresHumanReview: boolean
  createdAt: string
  outreach: {
    subject: string
    prospectType: string
  }
}

interface OutreachSequenceVaultProps {
  initialDrafts: OutreachDraftItem[]
  initialSequences: SequenceItem[]
  initialReplies: ReplyItem[]
  initialSuppressedCount: number
}

export function OutreachSequenceVault({
  initialDrafts,
  initialSequences,
  initialReplies,
  initialSuppressedCount,
}: OutreachSequenceVaultProps) {
  const [activeTab, setActiveTab] = React.useState<'DRAFTS' | 'SEQUENCES' | 'REPLIES' | 'DNC'>('DRAFTS')
  const [drafts, setDrafts] = React.useState<OutreachDraftItem[]>(initialDrafts)
  const [sequences, setSequences] = React.useState<SequenceItem[]>(initialSequences)
  const [replies, setReplies] = React.useState<ReplyItem[]>(initialReplies)
  const [suppressedCount, setSuppressedCount] = React.useState(initialSuppressedCount)

  // Modals & previews
  const [previewDraft, setPreviewDraft] = React.useState<OutreachDraftItem | null>(null)
  const [isApproving, setIsApproving] = React.useState(false)
  const [isRunningWorker, setIsRunningWorker] = React.useState(false)

  // Simulation modal
  const [simulateModalOpen, setSimulateModalOpen] = React.useState(false)
  const [simSender, setSimSender] = React.useState('tpo@apexinstitute.edu.in')
  const [simBody, setSimBody] = React.useState('Hi team, we are interested. Can we schedule a demo call this Friday at 11 AM?')
  const [isSimulating, setIsSimulating] = React.useState(false)

  // Manual DNC modal
  const [dncModalOpen, setDncModalOpen] = React.useState(false)
  const [dncTarget, setDncTarget] = React.useState('')
  const [dncType, setDncType] = React.useState<'DOMAIN' | 'EMAIL'>('DOMAIN')

  // Pending safe drafts count
  const safeDraftsCount = drafts.filter((d) => d.status === 'DRAFT_PENDING_APPROVAL' && d.isSafeAction).length

  // Approve single draft
  const handleApproveDraft = async (draftId: string) => {
    try {
      const res = await fetch('/api/growth/outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ outreachId: draftId, action: 'APPROVE' }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error?.message || 'Approval failed')

      setDrafts((prev) => prev.map((d) => (d.id === draftId ? { ...d, status: 'SENT' } : d)))
      toast.success('Outreach email approved and dispatched via verified provider!')
      setPreviewDraft(null)
    } catch (err: any) {
      toast.error(err.message || 'Could not approve draft')
    }
  }

  // Bulk approve safe drafts
  const handleBulkApproveSafe = async () => {
    setIsApproving(true)
    try {
      const res = await fetch('/api/growth/outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bulkApproveSafe: true }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error?.message || 'Bulk approval failed')

      setDrafts((prev) =>
        prev.map((d) =>
          d.status === 'DRAFT_PENDING_APPROVAL' && d.isSafeAction ? { ...d, status: 'SENT' } : d
        )
      )
      toast.success(json.data?.message || 'All policy-verified safe drafts dispatched!')
    } catch (err: any) {
      toast.error(err.message || 'Could not execute bulk approval')
    } finally {
      setIsApproving(false)
    }
  }

  // Trigger sequence worker
  const handleRunSequenceWorker = async () => {
    setIsRunningWorker(true)
    try {
      const res = await fetch('/api/growth/sequences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ triggerWorker: true }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error?.message || 'Worker run failed')

      toast.success('Sequence worker completed cadence advancement!')
      // Refresh drafts
      const draftRes = await fetch('/api/growth/outreach?status=DRAFT_PENDING_APPROVAL')
      const draftJson = await draftRes.json()
      if (draftJson.data) setDrafts(draftJson.data)
    } catch (err: any) {
      toast.error(err.message || 'Failed to trigger worker')
    } finally {
      setIsRunningWorker(false)
    }
  }

  // Simulate inbound reply
  const handleSimulateReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (drafts.length === 0) {
      toast.error('Need at least one outreach message to attach simulated reply')
      return
    }
    setIsSimulating(true)
    try {
      const outreachId = drafts[0].id
      const res = await fetch('/api/growth/replies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          outreachId,
          senderEmail: simSender,
          body: simBody,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error?.message || 'Simulation failed')

      const newReply: ReplyItem = {
        id: json.data.reply.id,
        senderEmail: json.data.reply.senderEmail,
        snippet: json.data.reply.snippet,
        body: json.data.reply.body,
        intent: json.data.classification.intent,
        confidence: json.data.classification.confidence,
        suggestedAction: json.data.classification.suggestedAction,
        requiresHumanReview: json.data.classification.requiresHumanReview,
        createdAt: new Date().toISOString(),
        outreach: {
          subject: drafts[0].subject,
          prospectType: drafts[0].prospectType,
        },
      }

      setReplies((prev) => [newReply, ...prev])
      if (json.data.classification.dncTriggered) {
        setSuppressedCount((prev) => prev + 1)
        toast.warning(`Reply classified as ${json.data.classification.intent} - Auto-suppressed in DNC Registry!`)
      } else {
        toast.success(`Reply classified as ${json.data.classification.intent} (${Math.round(json.data.classification.confidence * 100)}% confidence)`)
      }
      setSimulateModalOpen(false)
      setActiveTab('REPLIES')
    } catch (err: any) {
      toast.error(err.message || 'Simulation failed')
    } finally {
      setIsSimulating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link href="/admin/growth" className="hover:underline text-indigo-600">GrowthOS</Link>
            <span>/</span>
            <span className="font-semibold text-slate-700">Outreach Sequences & Approval Vault</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Mail className="h-6 w-6 text-indigo-600" />
            Human-in-the-Loop Outreach & Cadence Vault
          </h1>
          <p className="text-sm text-slate-600">
            Absolute human sign-off gate before external dispatch, multi-step sequence engine, and AI reply triage.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSimulateModalOpen(true)}
            className="text-xs flex items-center gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            Simulate Inbound Reply
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={isRunningWorker}
            onClick={handleRunSequenceWorker}
            className="text-xs flex items-center gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRunningWorker ? 'animate-spin' : ''}`} />
            Run Sequence Worker
          </Button>
          {safeDraftsCount > 0 && (
            <Button
              size="sm"
              disabled={isApproving}
              onClick={handleBulkApproveSafe}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs flex items-center gap-1.5 shadow-xs font-semibold"
            >
              <CheckCircle2 className="h-4 w-4" />
              Approve All Safe Drafts ({safeDraftsCount})
            </Button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('DRAFTS')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
            activeTab === 'DRAFTS'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/40'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Mail className="h-4 w-4" />
          Pending Drafts Queue
          <Badge variant="outline" className="ml-1 text-xs bg-indigo-100/60 text-indigo-800 border-indigo-200">
            {drafts.filter((d) => d.status === 'DRAFT_PENDING_APPROVAL').length}
          </Badge>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('SEQUENCES')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
            activeTab === 'SEQUENCES'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/40'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Play className="h-4 w-4" />
          Active Sequences
          <Badge variant="outline" className="ml-1 text-xs bg-slate-100 text-slate-700">
            {sequences.length}
          </Badge>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('REPLIES')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
            activeTab === 'REPLIES'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/40'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          Inbound Replies & AI Triage
          <Badge variant="outline" className="ml-1 text-xs bg-emerald-100/60 text-emerald-800 border-emerald-200">
            {replies.length}
          </Badge>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('DNC')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
            activeTab === 'DNC'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/40'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <UserX className="h-4 w-4" />
          Suppression & DNC Registry
          <Badge variant="outline" className="ml-1 text-xs bg-rose-100/60 text-rose-800 border-rose-200">
            {suppressedCount}
          </Badge>
        </button>
      </div>

      {/* TAB 1: PENDING DRAFTS QUEUE */}
      {activeTab === 'DRAFTS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3.5 bg-amber-50/60 border border-amber-200/80 rounded-lg text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0" />
              <span>
                <strong>Human Gate Protocol:</strong> GrowthOS will never dispatch outbound emails autonomously.
                Every draft below was formulated by AI and is queued awaiting operator verification.
              </span>
            </div>
            <span className="font-semibold text-amber-800 shrink-0">
              {safeDraftsCount} Safe to Bulk Approve
            </span>
          </div>

          <div className="space-y-3">
            {drafts.length === 0 ? (
              <Card className="p-12 text-center border-dashed">
                <Mail className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-slate-800">No pending drafts in the approval queue</h3>
                <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
                  Enroll colleges or employers from their respective CRMs to formulate personalized outreach drafts.
                </p>
              </Card>
            ) : (
              drafts.map((draft) => {
                const targetName = draft.collegeProspect?.name || draft.employerProspect?.companyName || 'Unknown Prospect'
                const contactName = draft.collegeProspect?.tpoName || draft.employerProspect?.recruiterName || 'Contact'
                const contactEmail = draft.collegeProspect?.tpoEmail || draft.employerProspect?.recruiterEmail || 'No email'
                const freshness = draft.collegeProspect?.freshnessStatus || draft.employerProspect?.freshnessStatus || 'FRESH'
                const isSent = draft.status === 'SENT'

                return (
                  <Card key={draft.id} className={`p-4 transition ${isSent ? 'opacity-60 bg-slate-50' : 'hover:border-indigo-300 shadow-xs'}`}>
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Draft Details */}
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-base text-slate-900 tracking-tight">
                            {targetName}
                          </span>
                          <Badge variant="outline" className="text-[10px] bg-slate-50">
                            {draft.prospectType === 'COLLEGE' ? '🎓 College TPO' : '🏢 Employer TA'}
                          </Badge>
                          {draft.isSafeAction ? (
                            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] flex items-center gap-1 font-semibold" variant="outline">
                              <ShieldCheck className="h-3 w-3" /> Policy Safe
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] flex items-center gap-1" variant="outline">
                              <AlertTriangle className="h-3 w-3" /> Manual Review Req
                            </Badge>
                          )}
                          <Badge variant="outline" className={`text-[10px] ${isSent ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}`}>
                            {isSent ? 'DISPATCHED' : 'PENDING APPROVAL'}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-600 flex-wrap">
                          <span>👤 To: <strong>{contactName}</strong> ({contactEmail})</span>
                          <span>🕒 Formulated: {new Date(draft.createdAt).toLocaleDateString()}</span>
                          {draft.step && (
                            <span>📌 Step {draft.step.stepNumber} via {draft.step.channel}</span>
                          )}
                        </div>

                        <div className="p-2.5 rounded-md bg-slate-50 border border-slate-200/80 text-xs">
                          <p className="font-semibold text-slate-800 mb-0.5">Subject: {draft.subject}</p>
                          <p className="text-slate-600 line-clamp-2 leading-relaxed">{draft.body}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 border-t lg:border-t-0 pt-3 lg:pt-0 lg:border-l lg:pl-4 shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPreviewDraft(draft)}
                          className="text-xs flex items-center gap-1"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Full Preview
                        </Button>

                        {!isSent && (
                          <Button
                            size="sm"
                            onClick={() => handleApproveDraft(draft.id)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs flex items-center gap-1"
                          >
                            <Send className="h-3.5 w-3.5" />
                            Approve & Send
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                )
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ACTIVE SEQUENCES */}
      {activeTab === 'SEQUENCES' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sequences.map((seq) => (
              <Card key={seq.id} className="p-5 space-y-4 shadow-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-base text-slate-900">{seq.name}</span>
                      <Badge variant="outline" className="text-[10px] bg-slate-50">
                        {seq.targetType}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500">{seq.description}</p>
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-semibold" variant="outline">
                    {seq._count.enrollments} Active Prospects
                  </Badge>
                </div>

                {/* Steps Timeline */}
                <div className="space-y-2 border-t pt-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Cadence Timeline ({seq.steps.length} Steps)
                  </span>
                  <div className="space-y-2">
                    {seq.steps.map((step) => (
                      <div key={step.id} className="flex items-start gap-2.5 p-2 rounded-md bg-slate-50 border text-xs">
                        <div className="h-5 w-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                          {step.stepNumber}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-slate-800 truncate">{step.templateSubject}</span>
                            <span className="text-[10px] text-slate-400 shrink-0">Day +{step.delayDays}</span>
                          </div>
                          <span className="text-[10px] text-indigo-600 block mt-0.5 uppercase tracking-wide">
                            {step.channel} CHANNEL
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: INBOUND REPLIES & AI TRIAGE */}
      {activeTab === 'REPLIES' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3.5 bg-blue-50/60 border border-blue-200/80 rounded-lg text-xs text-blue-900">
            <span>
              <strong>Real-Time AI Reply Classification:</strong> Replies are triaged into 9 operational intents.
              Objections, interest, and DNC requests are detected immediately to orchestrate subsequent actions.
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSimulateModalOpen(true)}
              className="bg-white text-xs text-blue-700 shrink-0"
            >
              Simulate Response
            </Button>
          </div>

          <div className="space-y-3">
            {replies.length === 0 ? (
              <Card className="p-12 text-center border-dashed">
                <MessageSquare className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-slate-800">No inbound replies recorded yet</h3>
                <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
                  When prospects reply to outreach emails, AI parses their intent and prepares calendar invites or DNC suppressions.
                </p>
              </Card>
            ) : (
              replies.map((reply) => {
                const isPositive = ['POSITIVE_MEETING', 'POSITIVE_PROPOSAL'].includes(reply.intent)
                const isDnc = ['UNSUBSCRIBE_DNC', 'NOT_INTERESTED'].includes(reply.intent)

                return (
                  <Card key={reply.id} className="p-4 shadow-xs space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-bold text-sm text-slate-900">{reply.senderEmail}</span>
                          <Badge
                            className={`text-xs font-semibold ${
                              isPositive
                                ? 'bg-emerald-600 text-white'
                                : isDnc
                                ? 'bg-rose-600 text-white'
                                : 'bg-slate-700 text-white'
                            }`}
                          >
                            {reply.intent.replace(/_/g, ' ')}
                          </Badge>
                          <Badge variant="outline" className="text-[10px]">
                            {Math.round(reply.confidence * 100)}% Confidence
                          </Badge>
                        </div>
                        <span className="text-xs text-slate-500">In response to: "{reply.outreach.subject}"</span>
                      </div>
                      <span className="text-xs text-slate-400 shrink-0">
                        {new Date(reply.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="p-3 rounded-md bg-slate-50 border text-xs text-slate-700 italic">
                      "{reply.body}"
                    </div>

                    {reply.suggestedAction && (
                      <div className="flex items-center justify-between p-2.5 rounded-md bg-indigo-50/50 border border-indigo-100 text-xs">
                        <span className="text-indigo-900">
                          <strong>AI Suggested Next Step:</strong> {reply.suggestedAction}
                        </span>
                        {isPositive && (
                          <Button size="sm" className="bg-indigo-600 text-white text-xs h-7">
                            Book Discovery Meeting
                          </Button>
                        )}
                      </div>
                    )}
                  </Card>
                )
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 4: SUPPRESSION & DNC REGISTRY */}
      {activeTab === 'DNC' && (
        <div className="space-y-4">
          <Card className="p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <UserX className="h-5 w-5 text-rose-600" />
                  DPDP & Marketplace Suppression Registry
                </h3>
                <p className="text-xs text-slate-500">
                  Strict enforcement: Suppressed domains or emails are blocked from enrollment and sequence dispatches.
                </p>
              </div>
              <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 font-bold">
                {suppressedCount} Suppressed Entities
              </Badge>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-50 border text-xs space-y-2 text-slate-600">
              <p>
                <strong>Compliance Protocol:</strong> In accordance with India Digital Personal Data Protection (DPDP) Act 2023:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-500">
                <li>Immediate unenrollment from all multi-step cadences upon receiving unsubscribe signal.</li>
                <li>Normalized domain-level lock preventing future AI re-discovery or auto-enrollment.</li>
                <li>Complete audit trail with timestamped proof of suppression.</li>
              </ul>
            </div>
          </Card>
        </div>
      )}

      {/* Full Email Preview Modal */}
      {previewDraft && (
        <Dialog open={Boolean(previewDraft)} onOpenChange={() => setPreviewDraft(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-base flex items-center justify-between">
                <span>Email Draft Preview</span>
                {previewDraft.isSafeAction ? (
                  <Badge className="bg-emerald-600 text-white text-xs">Policy Safe</Badge>
                ) : (
                  <Badge className="bg-amber-500 text-white text-xs">Manual Review</Badge>
                )}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Rendered preview of message before external transmission.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border space-y-1">
                <div>
                  <span className="font-semibold text-slate-700">To: </span>
                  <span className="text-slate-900">
                    {previewDraft.collegeProspect?.tpoEmail || previewDraft.employerProspect?.recruiterEmail}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-slate-700">Subject: </span>
                  <span className="text-slate-900 font-medium">{previewDraft.subject}</span>
                </div>
              </div>

              <div className="p-4 rounded-lg border bg-white shadow-inner font-sans text-xs leading-relaxed whitespace-pre-line text-slate-800">
                {previewDraft.body}

                <div className="mt-6 pt-4 border-t text-[11px] text-slate-400">
                  <p>PlacementConnect Enterprise Platform • Level 4, DLF Cyber City, Gurgaon, India</p>
                  <p className="mt-1">
                    To opt out of future updates from PlacementConnect,{' '}
                    <span className="text-indigo-600 underline cursor-pointer">click here to unsubscribe</span>.
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" size="sm" onClick={() => setPreviewDraft(null)}>
                Close
              </Button>
              {previewDraft.status !== 'SENT' && (
                <Button
                  size="sm"
                  onClick={() => handleApproveDraft(previewDraft.id)}
                  className="bg-indigo-600 text-white"
                >
                  Approve & Dispatch Now
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Simulate Inbound Reply Modal */}
      <Dialog open={simulateModalOpen} onOpenChange={setSimulateModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-600" />
              Simulate Inbound Reply
            </DialogTitle>
            <DialogDescription className="text-xs">
              Test AI intent classification and policy enforcement against realistic prospect responses.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSimulateReply} className="space-y-3 py-2 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Sender Email</label>
              <Input
                required
                type="email"
                value={simSender}
                onChange={(e) => setSimSender(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Reply Email Body</label>
              <Textarea
                required
                rows={4}
                value={simBody}
                onChange={(e) => setSimBody(e.target.value)}
              />
            </div>

            {/* Quick response test presets */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-slate-400 font-medium">Quick Presets:</span>
              <button
                type="button"
                onClick={() => setSimBody('Hi, we would love to schedule a demo call this Friday at 11 AM.')}
                className="text-[10px] px-2 py-0.5 rounded-sm bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              >
                Positive Meeting
              </button>
              <button
                type="button"
                onClick={() => setSimBody('Please remove our email from your list. Do not contact us again.')}
                className="text-[10px] px-2 py-0.5 rounded-sm bg-rose-50 text-rose-700 hover:bg-rose-100"
              >
                DNC Unsubscribe
              </button>
              <button
                type="button"
                onClick={() => setSimBody('What is the cost or commission model for your fresher hiring drive?')}
                className="text-[10px] px-2 py-0.5 rounded-sm bg-blue-50 text-blue-700 hover:bg-blue-100"
              >
                Pricing Inquiry
              </button>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setSimulateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isSimulating} className="bg-indigo-600 text-white">
                {isSimulating ? 'Classifying...' : 'Submit & Classify'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
