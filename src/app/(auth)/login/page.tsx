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
    <Card className="w-full shadow-lg border-0 bg-white">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Sign in</CardTitle>
        <CardDescription className="text-center">
          Enter your email and password to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive" className="py-2">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="m@example.com" required disabled={isLoading} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-500 font-medium">
                Forgot Password?
              </Link>
            </div>
            <Input id="password" name="password" type="password" required disabled={isLoading} />
          </div>
          <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Sign In
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-center">
        <p className="mt-2 text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-indigo-600 hover:text-indigo-500 font-medium">
            Register
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
