import { GraduationCap } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
      <div className="flex items-center space-x-2.5 mb-6">
        <div className="h-9 w-9 rounded-[4px] bg-[#0F2744] flex items-center justify-center text-white shadow-2xs border border-slate-800">
          <GraduationCap className="h-5 w-5 text-blue-400" />
        </div>
        <div>
          <span className="font-bold text-xl text-slate-900 tracking-tight block leading-tight">PlacementConnect</span>
          <span className="font-mono text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Identity & Access Gateway</span>
        </div>
      </div>
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
}
