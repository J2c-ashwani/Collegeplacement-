'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Send, Loader2 } from 'lucide-react'

interface ApplyButtonProps {
  jobId: string
  jobTitle: string
  alreadyApplied?: boolean
}

export function ApplyButton({ jobId, jobTitle, alreadyApplied = false }: ApplyButtonProps) {
  const [applied, setApplied] = React.useState(alreadyApplied)
  const [isApplying, setIsApplying] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleApply = async () => {
    setIsApplying(true)
    setError(null)

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error?.message || data.message || 'Application failed')
      }

      setApplied(true)
    } catch (err: any) {
      setError(err.message || 'Could not submit application')
    } finally {
      setIsApplying(false)
    }
  }

  if (applied) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-md border border-emerald-200">
        <CheckCircle2 className="h-3.5 w-3.5" /> Applied
      </span>
    )
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        onClick={handleApply}
        disabled={isApplying}
        size="sm"
        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium h-8"
      >
        {isApplying ? (
          <>
            <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> Submitting...
          </>
        ) : (
          <>
            <Send className="h-3.5 w-3.5 mr-1" /> 1-Click Apply
          </>
        )}
      </Button>
      {error && <span className="text-[10px] text-rose-600 max-w-xs">{error}</span>}
    </div>
  )
}
