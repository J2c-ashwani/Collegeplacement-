'use client'

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "An error occurred. Please try again.")
      } else {
        setSuccess(true)
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full border border-slate-200 shadow-2xs rounded-md bg-white">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-xl font-bold text-center text-slate-900 tracking-tight">Reset Your Password</CardTitle>
        <CardDescription className="text-center text-xs text-slate-500">
          Enter your email address and we&apos;ll send you a password reset link.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {success ? (
          <Alert className="py-2 text-xs bg-emerald-50 text-emerald-800 border-emerald-200">
            <AlertDescription>
              If an account exists with that email, you&apos;ll receive a password reset link shortly.
            </AlertDescription>
          </Alert>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="py-2 text-xs">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-slate-700">Email Address</Label>
              <Input id="email" name="email" type="email" placeholder="name@institution.edu.in" required disabled={isLoading} className="text-xs h-9 rounded-sm" />
            </div>
            <Button type="submit" className="w-full bg-[#1E40AF] hover:bg-blue-800 text-white font-medium text-xs h-9 rounded-sm shadow-2xs" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : null}
              Send Reset Link
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-center pt-2 pb-6">
        <p className="text-xs text-slate-500">
          <Link href="/login" className="text-[#1E40AF] hover:underline font-semibold">
            Back to Sign In
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
