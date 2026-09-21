'use client'

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        setError("Invalid email or password")
      } else {
        const sessionRes = await fetch('/api/auth/session')
        const sessionData = await sessionRes.json()
        const role = sessionData?.user?.role

        let target = '/student/dashboard'
        if (role === 'INSTITUTION_ADMIN') target = '/institution/overview'
        else if (role === 'EMPLOYER') target = '/employer/overview'
        else if (role === 'SUPER_ADMIN' || role === 'OPERATIONS') target = '/admin/overview'

        const searchParams = new URLSearchParams(window.location.search)
        const callbackUrl = searchParams.get('callbackUrl')
        router.push(callbackUrl ? decodeURIComponent(callbackUrl) : target)
        router.refresh()
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
        <CardTitle className="text-xl font-bold text-center text-slate-900 tracking-tight">Sign In to Platform</CardTitle>
        <CardDescription className="text-center text-xs text-slate-500">
          Enter your authorized credentials to access your workspace
        </CardDescription>
      </CardHeader>
      <CardContent>
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
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-xs font-semibold text-slate-700">Password</Label>
              <Link href="/forgot-password" className="text-xs text-[#1E40AF] hover:underline font-medium">
                Forgot Password?
              </Link>
            </div>
            <Input id="password" name="password" type="password" required disabled={isLoading} className="text-xs h-9 rounded-sm" />
          </div>
          <Button type="submit" className="w-full bg-[#1E40AF] hover:bg-blue-800 text-white font-medium text-xs h-9 rounded-sm shadow-2xs" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : null}
            Sign In
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-center pt-2 pb-6">
        <p className="text-xs text-slate-500">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-[#1E40AF] hover:underline font-semibold">
            Institutional Registration
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
