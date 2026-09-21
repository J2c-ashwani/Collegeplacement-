import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { AdminSettingsForm } from './admin-settings-form'
import { Settings } from 'lucide-react'

import { prisma } from '@/lib/prisma'

export default async function AdminSettingsPage() {
  const session = await auth()
  if (!session?.user?.id || (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'OPERATIONS')) {
    redirect('/login')
  }

  const settings = await prisma.setting.findMany({
    where: { category: 'PLATFORM_RULES' },
  })

  const initialSettings: Record<string, any> = {
    assuranceQuota: '3',
    gstRate: '18',
    liquidityBufferTarget: '1.20',
    throttleGtmOnDeficit: true,
    maintenanceMode: false,
  }

  settings.forEach((s) => {
    initialSettings[s.key] = s.value
  })

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
              System Configuration
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500">Platform Global Parameters</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Platform Settings & Rules</h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure the 3-Assurance legal quota, liquidity buffer thresholds, employer billing rates, and tax policies.
          </p>
        </div>

        <Badge className="bg-slate-100 text-slate-700 border-slate-200 text-xs">
          Production v2.4
        </Badge>
      </div>

      <AdminSettingsForm initialSettings={initialSettings} />
    </div>
  )
}
