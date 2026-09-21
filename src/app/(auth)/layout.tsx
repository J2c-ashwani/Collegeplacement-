import { GraduationCap } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="flex items-center space-x-2 mb-8">
        <GraduationCap className="h-8 w-8 text-indigo-600" />
        <span className="font-bold text-2xl text-indigo-950 tracking-tight">PlacementConnect</span>
      </div>
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
}
