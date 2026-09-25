import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'
import { DashboardHeader } from '@/components/layout/dashboard-header'

export default async function EmployerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user || (session.user.role !== 'EMPLOYER' && session.user.role !== 'EMPLOYER_HR')) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen w-full bg-muted/20">
      <DashboardSidebar 
        role="employer" 
        user={{ 
          name: session.user.name || 'Employer User', 
          email: session.user.email || '', 
          role: session.user.role 
        }} 
      />
      <div className="flex flex-col flex-1 min-w-0">
        <DashboardHeader user={{ name: session.user.name, email: session.user.email, role: session.user.role }} />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
