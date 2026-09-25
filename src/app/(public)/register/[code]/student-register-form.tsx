'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle2, ArrowRight, ArrowLeft, Loader2, AlertTriangle } from 'lucide-react'

interface FormProps {
  institutionId: string
  institutionName: string
  departments: string[]
  batches: string[]
  planName: string
}

export default function StudentRegisterForm({
  institutionId,
  institutionName,
  departments,
  batches,
  planName,
}: FormProps) {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDuplicateAccount, setIsDuplicateAccount] = useState(false)
  const [success, setSuccess] = useState(false)

  const eligibleBatches = batches.length ? batches : ['2026', '2027']

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    enrollmentNumber: '',
    course: 'B.Tech',
    branch: departments[0] || 'Computer Science & Engineering',
    department: 'Engineering',
    graduationYear: String(eligibleBatches[0] || '2026'),
    cgpa: '7.5',
    tenthPercentage: '85.0',
    twelfthPercentage: '80.0',
    skills: 'JavaScript, Python, SQL',
  })

  const isWrongBatch = !eligibleBatches.includes(String(formData.graduationYear))

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (error) setError(null)
    if (isDuplicateAccount) setIsDuplicateAccount(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsDuplicateAccount(false)

    if (isWrongBatch) {
      setError(
        `Graduation batch ${formData.graduationYear} is not eligible under ${institutionName}'s active placement roster. Only authorized graduating cohorts (${eligibleBatches.join(', ')}) may enroll.`
      )
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          institutionId,
          graduationYear: parseInt(String(formData.graduationYear), 10) || 2026,
          cgpa: parseFloat(formData.cgpa) || 7.0,
          tenthPercentage: parseFloat(formData.tenthPercentage) || 80.0,
          twelfthPercentage: parseFloat(formData.twelfthPercentage) || 80.0,
          skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        const msg = data.error?.message || data.error || 'Failed to complete registration'
        if (
          res.status === 409 ||
          msg.toLowerCase().includes('already') ||
          msg.toLowerCase().includes('exists') ||
          msg.toLowerCase().includes('duplicate')
        ) {
          setIsDuplicateAccount(true)
        }
        throw new Error(msg)
      }

      setSuccess(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="border-emerald-200 bg-white shadow-xs">
        <CardContent className="pt-8 pb-8 text-center space-y-4">
          <div className="h-14 w-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Student Account Created</h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Your student profile is linked to <strong>{institutionName}</strong>. Next, sign in to select your readiness track (Standard Track or Extended Readiness Track), review and accept the programme terms, and complete your enrolment.
          </p>
          <div className="pt-4">
            <Button
              onClick={() => router.push('/login')}
              className="bg-[#1E40AF] hover:bg-blue-900 text-white px-6"
            >
              Sign in to Continue Setup <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-slate-200 bg-white shadow-xs">
      <CardHeader className="border-b border-slate-100 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-slate-900">
            Create Your Verified Student Account
          </CardTitle>
          <span className="text-xs font-mono font-semibold text-blue-800 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
            Step {step} of 2
          </span>
        </div>
        <CardDescription className="text-xs text-slate-600">
          Enrolling under <strong>{institutionName}</strong> ({planName}) &bull; Eligible Cohorts: {eligibleBatches.join(', ')}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {error && (
          <Alert variant="destructive" className="mb-5 border-rose-200 bg-rose-50 text-rose-900">
            <AlertDescription className="text-xs space-y-2">
              <div className="font-semibold">{error}</div>
              {isDuplicateAccount && (
                <div className="pt-1 flex flex-wrap items-center gap-3">
                  <Link
                    href="/login"
                    className="inline-flex items-center px-3 py-1.5 rounded bg-[#1E40AF] text-white font-semibold text-xs hover:bg-blue-900"
                  >
                    Already Registered? Sign In &rarr;
                  </Link>
                  <Link
                    href="/forgot-password"
                    className="inline-flex items-center text-xs font-semibold text-rose-800 underline"
                  >
                    Reset Password
                  </Link>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs font-semibold text-slate-700">
                    Full Name (As per College Records) *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    placeholder="e.g. Aarav Sharma"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="enrollmentNumber" className="text-xs font-semibold text-slate-700">
                    College Enrollment / Roll Number *
                  </Label>
                  <Input
                    id="enrollmentNumber"
                    name="enrollmentNumber"
                    required
                    placeholder="e.g. APX2026CS042"
                    value={formData.enrollmentNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs font-semibold text-slate-700">
                    Mobile Number *
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    required
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-semibold text-slate-700">
                  Create Password (Min. 8 characters) *
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  minLength={8}
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <Button
                type="button"
                onClick={() => {
                  if (!formData.name || !formData.email || !formData.password || !formData.enrollmentNumber) {
                    setError('Please complete your full name, college roll number, email address, and password.')
                    return
                  }
                  if (formData.password.length < 8) {
                    setError('Password must be at least 8 characters long.')
                    return
                  }
                  setError(null)
                  setStep(2)
                }}
                className="w-full bg-[#1E40AF] hover:bg-blue-900 text-white mt-4 h-10 text-xs font-semibold"
              >
                Continue to Academic &amp; Batch Verification <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="course" className="text-xs font-semibold text-slate-700">
                    Degree / Programme
                  </Label>
                  <Input
                    id="course"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="branch" className="text-xs font-semibold text-slate-700">
                    Department / Branch
                  </Label>
                  <select
                    id="branch"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-2xs"
                  >
                    {departments.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="graduationYear" className="text-xs font-semibold text-slate-700">
                    Graduation Batch *
                  </Label>
                  <select
                    id="graduationYear"
                    name="graduationYear"
                    value={formData.graduationYear}
                    onChange={handleChange}
                    className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-2xs"
                  >
                    {eligibleBatches.map((b) => (
                      <option key={b} value={b}>
                        Class of {b} (Authorized Cohort)
                      </option>
                    ))}
                    <option value="2025">Class of 2025 or Earlier (Graduated — Ineligible)</option>
                    <option value="2028">Class of 2028 or Later (Pre-Final Year — Ineligible)</option>
                  </select>
                </div>
              </div>

              {isWrongBatch && (
                <div className="p-3.5 rounded-md bg-amber-50 border border-amber-300 text-xs text-amber-950 flex items-start gap-2.5">
                  <AlertTriangle className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-amber-900">
                      Ineligible Graduation Batch Selected ({formData.graduationYear})
                    </span>
                    <span>
                      {institutionName} has authorized onboarding only for graduating cohorts{' '}
                      <strong>{eligibleBatches.join(', ')}</strong>. Please select your authorized graduating year or contact your TPO if your batch record needs updating.
                    </span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="cgpa" className="text-xs font-semibold text-slate-700">
                    Current CGPA
                  </Label>
                  <Input
                    id="cgpa"
                    name="cgpa"
                    type="number"
                    step="0.01"
                    value={formData.cgpa}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="tenthPercentage" className="text-xs font-semibold text-slate-700">
                    10th Percentage (%)
                  </Label>
                  <Input
                    id="tenthPercentage"
                    name="tenthPercentage"
                    type="number"
                    step="0.1"
                    value={formData.tenthPercentage}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="twelfthPercentage" className="text-xs font-semibold text-slate-700">
                    12th / Diploma (%)
                  </Label>
                  <Input
                    id="twelfthPercentage"
                    name="twelfthPercentage"
                    type="number"
                    step="0.1"
                    value={formData.twelfthPercentage}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="skills" className="text-xs font-semibold text-slate-700">
                  Core Technical &amp; Domain Skills (comma-separated)
                </Label>
                <Input
                  id="skills"
                  name="skills"
                  placeholder="e.g. React, Node.js, SQL, Java, Problem Solving"
                  value={formData.skills}
                  onChange={handleChange}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="w-1/3 h-10 text-xs font-semibold"
                >
                  <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={loading || isWrongBatch}
                  className="w-2/3 h-10 bg-[#1E40AF] hover:bg-blue-900 text-white text-xs font-semibold"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying Roster &amp; Creating Account...
                    </>
                  ) : (
                    'Create Verified Student Account'
                  )}
                </Button>
              </div>
            </>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
