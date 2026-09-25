'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { GraduationCap } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // /register has its own full-viewport two-column enterprise onboarding layout
  if (pathname?.startsWith('/register')) {
    return <div className="min-h-screen w-full bg-[#F8FAFC]">{children}</div>
  }

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
      <Link href="/" className="flex items-center space-x-2.5 mb-6">
        <div className="h-9 w-9 rounded-[4px] bg-[#0F2744] flex items-center justify-center text-white shadow-2xs border border-slate-800">
          <GraduationCap className="h-5 w-5 text-blue-400" />
        </div>
        <div>
          <span className="font-bold text-xl text-slate-900 tracking-tight block leading-tight">PlacementConnect</span>
          <span className="text-[11px] font-medium text-slate-500 block">Verified Campus Placement &amp; Hiring Platform</span>
        </div>
      </Link>
      <div className="w-full max-w-md">
        {children}
      </div>
      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
        <Link href="/privacy" className="hover:text-slate-800 hover:underline transition-colors">
          Privacy
        </Link>
        <span className="text-slate-300">&middot;</span>
        <Link href="/terms" className="hover:text-slate-800 hover:underline transition-colors">
          Terms
        </Link>
        <span className="text-slate-300">&middot;</span>
        <Link href="/security" className="hover:text-slate-800 hover:underline transition-colors">
          Security
        </Link>
      </div>
    </div>
  )
}
