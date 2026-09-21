'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle2, ArrowRight, Loader2 } from 'lucide-react'

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
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    enrollmentNumber: '',
    course: 'B.Tech',
    branch: departments[0] || 'Computer Science',
    department: 'Engineering',
    graduationYear: batches[0] ? parseInt(batches[0]) : 2026,
    cgpa: '7.5',
    tenthPercentage: '85.0',
    twelfthPercentage: '80.0',
    skills: 'JavaScript, Python, SQL',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // 1. Create User & Student record via API
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          institutionId,
          cgpa: parseFloat(formData.cgpa) || 7.0,
          tenthPercentage: parseFloat(formData.tenthPercentage) || 80.0,
          twelfthPercentage: parseFloat(formData.twelfthPercentage) || 80.0,
          skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error?.message || 'Failed to complete registration')
      }

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="border-green-200 bg-white shadow-md">
        <CardContent className="pt-8 pb-8 text-center space-y-4">
          <div className="h-14 w-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Enrolment Initiated!</h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Your profile is registered under <strong>{institutionName}</strong>. You can now log in, enroll in the Placement Assurance Programme, and take your Employability Assessment.
          </p>
          <div className="pt-4">
            <Button
              onClick={() => router.push('/login')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6"
            >
              Proceed to Login <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Student Registration</CardTitle>
        <CardDescription>
          Enrolling under {institutionName} &bull; {planName} Partnership
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    placeholder="e.g. Aarav Sharma"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="enrollmentNumber">College Enrollment / Roll No *</Label>
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
                <div className="space-y-2">
                  <Label htmlFor="email">Official / Personal Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="student@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Mobile Number *</Label>
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

              <div className="space-y-2">
                <Label htmlFor="password">Create Password (min 8 chars) *</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
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
                    setError('Please complete all required fields.')
                    return
                  }
                  setError(null)
                  setStep(2)
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white mt-4"
              >
                Next: Academic Details <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="course">Degree / Course</Label>
                  <Input
                    id="course"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="branch">Branch / Department</Label>
                  <select
                    id="branch"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                  >
                    {departments.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="graduationYear">Graduation Year</Label>
                  <select
                    id="graduationYear"
                    name="graduationYear"
                    value={formData.graduationYear}
                    onChange={handleChange}
                    className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                  >
                    {batches.map((b) => (
                      <option key={b} value={parseInt(b)}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cgpa">Current CGPA</Label>
                  <Input
                    id="cgpa"
                    name="cgpa"
                    type="number"
                    step="0.01"
                    value={formData.cgpa}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tenthPercentage">10th Score (%)</Label>
                  <Input
                    id="tenthPercentage"
                    name="tenthPercentage"
                    type="number"
                    step="0.1"
                    value={formData.tenthPercentage}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twelfthPercentage">12th Score (%)</Label>
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

              <div className="space-y-2">
                <Label htmlFor="skills">Key Skills (comma-separated)</Label>
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
                  className="w-1/3"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                    </>
                  ) : (
                    'Complete Registration'
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
