'use client'

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Briefcase, Plus, MapPin, Sparkles, Users, 
  CheckCircle2, ArrowRight, X, Shield 
} from 'lucide-react'
import Link from 'next/link'

interface JobPostingManagerProps {
  initialJobs: any[]
  employerId: string
}

export function JobPostingManager({ initialJobs, employerId }: JobPostingManagerProps) {
  const [jobs, setJobs] = React.useState(initialJobs)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [formData, setFormData] = React.useState({
    title: '',
    department: 'Engineering',
    location: 'Bengaluru',
    workMode: 'HYBRID',
    ctc: '600000',
    minEmployabilityScore: '75',
    minCgpa: '7.0',
    openings: '3',
    description: '',
  })
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employerId,
          title: formData.title,
          department: formData.department,
          type: 'FULL_TIME',
          location: formData.location,
          workMode: formData.workMode,
          ctc: Number(formData.ctc),
          minEmployabilityScore: Number(formData.minEmployabilityScore),
          minCgpa: Number(formData.minCgpa),
          openings: Number(formData.openings),
          description: formData.description || 'Entry level fresher position matching placement assurance criteria.',
          skills: ['React', 'TypeScript', 'Node.js'],
          requiredBadges: ['Interview Ready'],
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error?.message || data.message || 'Failed to create job posting')
      }

      const createdJob = data.data || data
      setJobs([createdJob, ...jobs])
      setIsModalOpen(false)
      setFormData({
        title: '',
        department: 'Engineering',
        location: 'Bengaluru',
        workMode: 'HYBRID',
        ctc: '600000',
        minEmployabilityScore: '75',
        minCgpa: '7.0',
        openings: '3',
        description: '',
      })
    } catch (err: any) {
      setError(err.message || 'Failed to post job opening')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">
          Showing {jobs.length} active fresher recruitment campaigns
        </p>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" /> Post New Vacancy
        </Button>
      </div>

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-slate-900">Post New Campus Job Vacancy</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            {error && (
              <div className="p-2.5 rounded-md bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateJob} className="space-y-3 text-xs">
              <div>
                <Label className="text-xs">Job Title</Label>
                <Input
                  required
                  placeholder="e.g. Associate Full-Stack Engineer"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Department</Label>
                  <Input
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="mt-1 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs">Location</Label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="mt-1 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs">Annual CTC (₹)</Label>
                  <Input
                    type="number"
                    value={formData.ctc}
                    onChange={(e) => setFormData({ ...formData, ctc: e.target.value })}
                    className="mt-1 text-xs font-mono"
                  />
                </div>
                <div>
                  <Label className="text-xs">Min Score (Cutoff)</Label>
                  <Input
                    type="number"
                    value={formData.minEmployabilityScore}
                    onChange={(e) => setFormData({ ...formData, minEmployabilityScore: e.target.value })}
                    className="mt-1 text-xs font-mono"
                  />
                </div>
                <div>
                  <Label className="text-xs">Min CGPA</Label>
                  <Input
                    step="0.1"
                    type="number"
                    value={formData.minCgpa}
                    onChange={(e) => setFormData({ ...formData, minCgpa: e.target.value })}
                    className="mt-1 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs">Job Description & Tech Stack</Label>
                <textarea
                  rows={3}
                  className="w-full mt-1 p-2 rounded-md border border-slate-200 text-xs bg-slate-50 focus:outline-hidden"
                  placeholder="Briefly describe key fresher responsibilities..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)} className="text-xs">
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
                  {isSubmitting ? 'Publishing...' : 'Publish Opening'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Jobs List */}
      <div className="grid gap-4 md:grid-cols-2">
        {jobs.map((job) => (
          <Card key={job.id} className="border-slate-200/80 shadow-xs bg-white hover:border-indigo-200 transition-colors">
            <CardHeader className="border-b border-slate-100 pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base font-bold text-slate-900">{job.title}</CardTitle>
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                      {job.status}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs text-slate-500 mt-1">
                    {job.department} • {job.location} ({job.workMode})
                  </CardDescription>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-indigo-700 tabular-nums">
                    ₹{job.ctc ? (Number(job.ctc) / 100000).toFixed(1) : '5.5'} LPA
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Min Diagnostic Score</span>
                  <div className="font-mono font-bold text-slate-900 mt-0.5">
                    {job.minEmployabilityScore || 75}/100
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Min College CGPA</span>
                  <div className="font-mono font-bold text-slate-900 mt-0.5">
                    {job.minCgpa || 7.0}+
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-slate-400" />
                  {job.applications?.length || 8} Screened Candidates
                </span>
                <Link href="/employer/candidates">
                  <Button size="sm" variant="outline" className="text-xs h-7">
                    View Shortlist <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
