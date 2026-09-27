'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CheckCircle2, Lock, Sparkles, Clock, Calendar, ShieldCheck, AlertCircle } from 'lucide-react'

interface ClusterSlotClaimProps {
  hasActiveOpportunity: boolean
  activeEmployerName?: string
}

export function ClusterSlotClaim({
  hasActiveOpportunity,
  activeEmployerName = 'Corporate Partner',
}: ClusterSlotClaimProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isClaimed, setIsClaimed] = useState(false)
  const [isClaiming, setIsClaiming] = useState(false)

  const handleClaim = () => {
    setIsClaiming(true)
    setTimeout(() => {
      setIsClaiming(false)
      setIsClaimed(true)
      setIsOpen(false)
    }, 600)
  }

  return (
    <>
      <Card className="border-indigo-200 bg-gradient-to-r from-indigo-50/70 via-white to-indigo-50/40 shadow-xs">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge className="bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider">
                  Cluster Mega-Drive Live
                </Badge>
                <span className="text-xs text-slate-500 font-medium">TechCorp Solutions • Junior Software Engineer</span>
              </div>
              <p className="text-xs text-slate-700 font-medium">
                You meet the 70+ employability cutoff for this regional cluster hiring drive.
              </p>
              <p className="text-[11px] text-slate-600">
                <strong>Progressive Assurance Governance:</strong> Corporate interview opportunities are facilitated sequentially. A student proceeds through one active employer process at a time, ensuring maximum preparation focus and panel commitment.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="text-right hidden sm:block">
                <span className="text-xs font-semibold text-slate-900 block">Today, 03:40 PM</span>
                <span className="text-[11px] text-emerald-600 font-medium">20m Panel Slot</span>
              </div>
              {isClaimed ? (
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Slot Claimed
                </Badge>
              ) : hasActiveOpportunity ? (
                <Button
                  size="sm"
                  onClick={() => setIsOpen(true)}
                  className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium flex items-center gap-1.5"
                >
                  <Lock className="h-3 w-3 text-amber-300" />
                  Claim Slot (Locked)
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => setIsOpen(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium"
                >
                  Claim Interview Slot
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold text-slate-900">
              {hasActiveOpportunity ? (
                <>
                  <Lock className="h-4 w-4 text-amber-600" />
                  Sequential Progression Rule Active
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-indigo-600" />
                  Claim Cluster Interview Slot
                </>
              )}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-600 pt-1">
              {hasActiveOpportunity ? (
                <span>
                  Under PlacementConnect&apos;s Progressive Assurance Constitution, candidates advance through <strong>one verified corporate interview process at a time</strong>.
                </span>
              ) : (
                <span>
                  Reserve your 20-minute panel slot for the TechCorp Solutions campus drive.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          {hasActiveOpportunity ? (
            <div className="space-y-3 py-2 text-xs">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 space-y-1.5">
                <div className="font-semibold flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5 text-amber-700" />
                  Active Opportunity: {activeEmployerName}
                </div>
                <p className="text-[11px] text-amber-800">
                  You currently have an active interview progression with <strong>{activeEmployerName}</strong>. If you receive an offer, you exit the assurance cycle immediately as placed. If you remain unselected upon conclusion, this cluster channel and your next progressive opportunity will immediately unlock.
                </p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 space-y-1 text-[11px]">
                <div className="font-semibold text-slate-800">Why sequential progression?</div>
                <p>
                  Preventing multi-booking ensures genuine corporate commitment, gives every eligible candidate their confirmed slot, and avoids unexcused cancellations.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3 py-2 text-xs">
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg space-y-1.5 text-indigo-950">
                <div className="font-bold">TechCorp Solutions — Junior Software Engineer</div>
                <div className="flex items-center gap-3 text-[11px] text-indigo-800">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Today</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> 03:40 PM IST</span>
                  <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> Verified Panel</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500">
                Claiming reserves your panel slot immediately. An invitation link and preparatory brief will be dispatched to your registered email.
              </p>
            </div>
          )}

          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-xs"
            >
              {hasActiveOpportunity ? 'Understood' : 'Cancel'}
            </Button>
            {!hasActiveOpportunity && (
              <Button
                type="button"
                size="sm"
                onClick={handleClaim}
                disabled={isClaiming}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs"
              >
                {isClaiming ? 'Reserving...' : 'Confirm Slot Reservation'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
