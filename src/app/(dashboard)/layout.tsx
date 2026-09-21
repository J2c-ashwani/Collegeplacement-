import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { SidebarProvider } from '@/components/ui/sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  return (
    <SidebarProvider>
      {children}
    </SidebarProvider>
  )
}
