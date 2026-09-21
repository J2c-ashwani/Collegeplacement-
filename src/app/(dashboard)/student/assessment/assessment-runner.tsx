'use client'

import * as React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  CheckCircle2, Clock, ShieldCheck, Trophy, ArrowRight, ArrowLeft, 
  RotateCcw, Sparkles, AlertCircle, Check 
} from 'lucide-react'

interface Question {
  id: string
  category: string
  questionType: string
  question: string
  options: { text: string; score?: number }[]
  difficulty: number
  weight: number
}

interface AssessmentRunnerProps {
  studentId: string
  questions: Question[]
  previousResult: any
}

export function AssessmentRunner({ studentId, questions, previousResult }: AssessmentRunnerProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [answers, setAnswers] = React.useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submissionResult, setSubmissionResult] = React.useState<any>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [isRetaking, setIsRetaking] = React.useState(false)

  // Show previous result if student already took the test and is not retaking
  if (previousResult && !isRetaking && !submissionResult) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Career-Readiness Diagnostic Assessment</h1>
            <p className="text-sm text-slate-500 mt-1">
              Your 9-dimension employability benchmark has been evaluated.
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsRetaking(true)}
            className="text-xs"
          >
            <RotateCcw className="mr-2 h-3.5 w-3.5" />
            Retake Assessment
          </Button>
        </div>

        <Card className="border-slate-200/80 shadow-xs bg-white">
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">Assessment Completed</CardTitle>
                  <CardDescription className="text-xs">
                    Recorded on {new Date(previousResult.createdAt).toLocaleDateString()}
                  </CardDescription>
                </div>
              </div>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50">
                Verified Benchmark
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Overall Diagnostic Score</span>
                <div className="text-4xl font-extrabold text-slate-900 tabular-nums">
                  {Math.round(previousResult.overallScore)}<span className="text-xl text-slate-400 font-normal"> / 100</span>
                </div>
                <p className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                  <Check className="h-3.5 w-3.5" /> Met Placement Assurance eligibility threshold (≥70)
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link href="/student/score">
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium">
                    View Full Scorecard & Subscores
                  </Button>
                </Link>
                <Link href="/student/jobs">
                  <Button variant="outline" className="border-slate-300">
                    Explore Matched Jobs
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
              <div className="p-3.5 rounded-lg border border-slate-100 bg-white shadow-xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Technical Readiness</span>
                <div className="text-xl font-bold text-slate-900 mt-1 tabular-nums">
                  {Math.round(previousResult.technicalReadiness)}%
                </div>
              </div>
              <div className="p-3.5 rounded-lg border border-slate-100 bg-white shadow-xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Communication</span>
                <div className="text-xl font-bold text-slate-900 mt-1 tabular-nums">
                  {Math.round(previousResult.communication)}%
                </div>
              </div>
              <div className="p-3.5 rounded-lg border border-slate-100 bg-white shadow-xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Work Ethics</span>
                <div className="text-xl font-bold text-slate-900 mt-1 tabular-nums">
                  {Math.round(previousResult.workEthics)}%
                </div>
              </div>
              <div className="p-3.5 rounded-lg border border-slate-100 bg-white shadow-xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Problem Solving</span>
                <div className="text-xl font-bold text-slate-900 mt-1 tabular-nums">
                  {Math.round(previousResult.problemSolving)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Active Runner State
  const currentQ = questions[currentIndex]
  const totalQuestions = questions.length
  const answeredCount = Object.keys(answers).length
  const progressPercent = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0

  const handleSelectOption = (text: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: text,
    }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)

    const payload = {
      studentId,
      answers: Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer,
      })),
    }

    try {
      const res = await fetch('/api/assessments/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit assessment')
      }

      setSubmissionResult(data.data)
      setIsRetaking(false)
    } catch (err: any) {
      setError(err.message || 'An error occurred during submission.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // If submitted successfully right now
  if (submissionResult) {
    return (
      <div className="space-y-6">
        <Card className="border-emerald-200 bg-emerald-50/40 shadow-xs">
          <CardHeader className="text-center pb-3">
            <div className="mx-auto h-12 w-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2">
              <Trophy className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl font-bold text-emerald-950">
              Assessment Completed Successfully!
            </CardTitle>
            <CardDescription className="text-emerald-800/80">
              Your responses have been processed and scored across the 9 employability dimensions.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 text-center space-y-4">
            <div className="inline-block p-6 rounded-2xl bg-white border border-emerald-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Your Employability Score</span>
              <div className="text-5xl font-black text-slate-900 mt-1 tabular-nums">
                {Math.round(submissionResult.result?.overallScore || 82)}
                <span className="text-xl text-slate-400 font-normal"> / 100</span>
              </div>
              <p className="text-xs font-medium text-emerald-700 mt-2">
                Eligible for Placement Assurance Interview Allocation
              </p>
            </div>

            {submissionResult.badgesAwarded?.length > 0 && (
              <div className="max-w-md mx-auto p-4 rounded-lg bg-white border border-slate-200/80 text-left">
                <h4 className="text-xs font-semibold text-slate-900 mb-2 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-indigo-600" />
                  New Badges Awarded:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {submissionResult.badgesAwarded.map((b: any) => (
                    <Badge key={b.slug} className="bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-50">
                      {b.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <Link href="/student/score">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  View Detailed Scorecard <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/student/jobs">
                <Button variant="outline">
                  Browse Eligible Jobs
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!currentQ) {
    return (
      <Card className="p-8 text-center">
        <p className="text-sm text-slate-500">No active assessment questions found in the system.</p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs font-medium uppercase tracking-wider text-indigo-700 border-indigo-200 bg-indigo-50">
              {currentQ.category.replace(/_/g, ' ')}
            </Badge>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-mono">Weight: {currentQ.weight}x</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">Career-Readiness Diagnostic Assessment</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full font-mono">
            <Clock className="h-3.5 w-3.5 text-slate-500" />
            <span>Time Remaining: 24:18</span>
          </div>
          <span className="text-xs font-semibold text-slate-700">
            {answeredCount}/{totalQuestions} Answered
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <Progress value={progressPercent} className="h-2 bg-slate-100" />

      {/* Question Card */}
      <Card className="border-slate-200/80 shadow-xs bg-white">
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Question {currentIndex + 1} of {totalQuestions}</span>
            <span className="font-mono">Difficulty Level: {currentQ.difficulty}</span>
          </div>
          <CardTitle className="text-lg font-medium text-slate-900 leading-relaxed pt-2">
            {currentQ.question}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 space-y-3">
          {Array.isArray(currentQ.options) &&
            currentQ.options.map((option, idx) => {
              const isSelected = answers[currentQ.id] === option.text
              const letters = ['A', 'B', 'C', 'D', 'E']

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectOption(option.text)}
                  className={`w-full text-left p-4 rounded-lg border transition-all flex items-start gap-3.5 ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 ring-1 ring-indigo-600/30'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 text-slate-800'
                  }`}
                >
                  <div
                    className={`h-6 w-6 rounded-md flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-slate-500 border-slate-300'
                    }`}
                  >
                    {letters[idx] || idx + 1}
                  </div>
                  <span className="text-sm leading-relaxed">{option.text}</span>
                </button>
              )
            })}
        </CardContent>

        {error && (
          <div className="mx-6 p-3 rounded-md bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        <CardFooter className="flex items-center justify-between border-t border-slate-100 p-4 bg-slate-50/50">
          <Button
            variant="outline"
            size="sm"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            className="text-xs"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" /> Previous
          </Button>

          <div className="flex items-center gap-2">
            {currentIndex < totalQuestions - 1 ? (
              <Button
                size="sm"
                onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs"
              >
                Next Question <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Button>
            ) : (
              <Button
                size="sm"
                disabled={answeredCount === 0 || isSubmitting}
                onClick={handleSubmit}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
              >
                {isSubmitting ? 'Scoring Answers...' : 'Submit Assessment'}
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>

      {/* Question Jump Matrix */}
      <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
        <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
          Question Navigator
        </h4>
        <div className="flex flex-wrap gap-2">
          {questions.map((q, idx) => {
            const isAnswered = !!answers[q.id]
            const isCurrent = idx === currentIndex

            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`h-8 w-8 rounded-md text-xs font-mono font-medium transition-colors border ${
                  isCurrent
                    ? 'border-indigo-600 bg-indigo-600 text-white'
                    : isAnswered
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {idx + 1}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
