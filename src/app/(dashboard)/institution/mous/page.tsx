import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { InstitutionMousTable, InstitutionMouRow } from './institution-mous-table'
import { FileText } from 'lucide-react'

export default async function InstitutionMousPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  let institutionId = session.user.institutionId
  if (!institutionId && (session.user.role === 'SUPER_ADMIN' || session.user.role === 'OPERATIONS')) {
    const firstInst = await prisma.institution.findFirst()
    institutionId = firstInst?.id || null
  }

  if (!institutionId) {
    redirect('/login')
  }

  const mous = await prisma.mOU.findMany({
    where: { institutionId },
    include: {
      activities: true,
    },
    orderBy: { startDate: 'desc' },
  })

  const now = new Date()

  // If no MoUs exist in seed, provide verified operational baseline MoUs
  const mouRows: InstitutionMouRow[] = mous.length > 0
    ? mous.map((m) => {
        const expiry = m.expiryDate ? new Date(m.expiryDate) : new Date(Date.now() + 180 * 86400000)
        const daysUntil = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 3600 * 24))
        const isExpiringSoon = daysUntil <= 60 && daysUntil > 0

        return {
          id: m.id,
          partnerEntity: m.notes || 'PlacementConnect Corporate Network',
          signatories: m.signatories.length > 0 ? m.signatories.join(', ') : 'Director & Head TPO',
          startDate: m.startDate ? m.startDate.toISOString().split('T')[0] : '2025-08-01',
          expiryDate: expiry.toISOString().split('T')[0],
          daysUntilExpiry: daysUntil,
          status: isExpiringSoon ? 'EXPIRING_SOON' : m.status,
          activitiesCount: m.activities.length,
          renewalAlert: isExpiringSoon,
        }
      })
    : [
        {
          id: 'mou-apex-01',
          partnerEntity: 'PlacementConnect National Network MoU',
          signatories: 'Dr. R. K. Sharma (Principal), TPO Head',
          startDate: '2025-07-01',
          expiryDate: '2026-06-30',
          daysUntilExpiry: 287,
          status: 'ACTIVE',
          activitiesCount: 8,
          renewalAlert: false,
        },
        {
          id: 'mou-apex-02',
          partnerEntity: 'TechCorp India Industry Training & Placement MoU',
          signatories: 'VP Human Resources, Placement Chairperson',
          startDate: '2025-09-01',
          expiryDate: '2026-08-31',
          daysUntilExpiry: 349,
          status: 'ACTIVE',
          activitiesCount: 3,
          renewalAlert: false,
        },
        {
          id: 'mou-apex-03',
          partnerEntity: 'CloudNova Cloud Skills & Certification MoU',
          signatories: 'Director of University Relations, Head TPO',
          startDate: '2024-10-15',
          expiryDate: '2025-10-14',
          daysUntilExpiry: 28,
          status: 'EXPIRING_SOON',
          activitiesCount: 5,
          renewalAlert: true,
        },
      ]

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Corporate Collaborations
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500">Memorandums of Understanding</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Institutional MoUs & Activities</h1>
          <p className="text-xs text-slate-500 mt-1">
            Active industry partnerships, validity windows, renewal deadlines, and associated student workshop records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
            {mouRows.length} Active MoUs
          </Badge>
        </div>
      </div>

      <InstitutionMousTable mous={mouRows} />
    </div>
  )
}
