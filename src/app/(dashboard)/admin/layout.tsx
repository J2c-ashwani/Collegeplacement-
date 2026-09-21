import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'
import { DashboardHeader } from '@/components/layout/dashboard-header'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user || (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'OPERATIONS')) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen w-full bg-muted/20">
      <DashboardSidebar 
        role="admin" 
        user={{ 
          name: session.user.name || 'Admin User', 
          email: session.user.email || '', 
          role: session.user.role 
        }} 
      />
      <div className="flex flex-col flex-1 min-w-0">
        <DashboardHeader user={{ name: session.user.name, email: session.user.email, role: session.user.role }} showSearch={true} />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
