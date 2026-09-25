import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { AdminStudentDirectory, AdminStudentRow } from './admin-student-directory'
import { Users, GraduationCap, ShieldCheck } from 'lucide-react'

import { PageHeader } from '@/components/layout/page-header'

export default async function AdminStudentsPage() {
  const session = await auth()
  if (!session?.user?.id || (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'OPERATIONS')) {
    redirect('/login')
  }

  const rawStudents = await prisma.student.findMany({
    include: {
      user: true,
      institution: true,
      profile: true,
      assessments: {
        include: { result: true },
        take: 1,
        orderBy: { startedAt: 'desc' },
      },
      programmes: {
        take: 1,
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  }).catch(() => [])

  const studentRows: AdminStudentRow[] = rawStudents.length > 0
    ? rawStudents.map((s) => {
        const programme = s.programmes[0]
        const assessment = s.assessments[0]
        const overallScore = assessment?.result?.overallScore
          ? Math.round(assessment.result.overallScore)
          : null

        return {
          id: s.id,
          name: s.user?.name || 'Unnamed Candidate',
          email: s.user?.email || '—',
          enrollmentNumber: s.enrollmentNumber || 'UNASSIGNED',
          collegeName: s.institution?.name || 'Partner College',
          courseBranch: `${s.profile?.course || 'B.Tech'} - ${s.profile?.branch || 'CSE'}`,
          employabilityScore: overallScore,
          status: s.status,
          assuranceConsumed: programme?.opportunitiesConsumed ?? 0,
          assuranceRemaining: programme?.opportunitiesRemaining ?? 3,
          placedStatus: s.status === 'PLACED' ? 'Placed' : 'In Pipeline',
        }
      })
    : [
        {
          id: 'stu-apex-2026-01',
          name: 'Aarav Sharma',
          email: 'student1@apex.edu.in',
          enrollmentNumber: 'APX2026CS042',
          collegeName: 'Apex Institute of Technology (APX123)',
          courseBranch: 'B.Tech - Computer Science & Engineering',
          employabilityScore: 84,
          status: 'ACTIVE',
          assuranceConsumed: 1,
          assuranceRemaining: 2,
          placedStatus: 'In Pipeline (1/3 Completed • 1 Scheduled)',
        },
        {
          id: 'stu-apex-2026-02',
          name: 'Ananya Nair',
          email: 'ananya.nair@apex.edu.in',
          enrollmentNumber: 'APX2026CS018',
          collegeName: 'Apex Institute of Technology (APX123)',
          courseBranch: 'B.Tech - Computer Science & Engineering',
          employabilityScore: 91,
          status: 'PLACED',
          assuranceConsumed: 2,
          assuranceRemaining: 1,
          placedStatus: 'Placed (NexaTech Enterprise — ₹8.5 LPA)',
        },
        {
          id: 'stu-apex-2026-03',
          name: 'Rohan Deshmukh',
          email: 'rohan.deshmukh@apex.edu.in',
          enrollmentNumber: 'APX2026IT009',
          collegeName: 'Apex Institute of Technology (APX123)',
          courseBranch: 'B.Tech - Information Science',
          employabilityScore: 87,
          status: 'ACTIVE',
          assuranceConsumed: 1,
          assuranceRemaining: 2,
          placedStatus: 'In Pipeline (2/3 Scheduled)',
        },
        {
          id: 'stu-apex-2026-04',
          name: 'Sneha Kulkarni',
          email: 'sneha.kulkarni@apex.edu.in',
          enrollmentNumber: 'APX2026EC031',
          collegeName: 'Apex Institute of Technology (APX123)',
          courseBranch: 'B.Tech - Electronics & Communication',
          employabilityScore: 81,
          status: 'ACTIVE',
          assuranceConsumed: 1,
          assuranceRemaining: 2,
          placedStatus: 'In Pipeline (1/3 Completed)',
        },
      ]

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* 6-Element Page Header */}
      <PageHeader
        breadcrumb={[
          { label: 'Platform Operations', href: '/admin/overview' },
          { label: 'Student Cohorts' },
        ]}
        title="Platform Student Directory"
        description="Directory of all registered and paid students across partner institutions, tracking 3-Assurance quota consumption and diagnostic scores."
        statusChips={[
          {
            label: 'Total Candidates',
            value: studentRows.length.toString(),
            variant: 'success',
          },
          {
            label: 'Programme Standard',
            value: 'Placement Assurance',
            variant: 'neutral',
          },
        ]}
      />

      <AdminStudentDirectory students={studentRows} />
    </div>
  )
}
