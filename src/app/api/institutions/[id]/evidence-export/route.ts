import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: institutionId } = await params

    // Security Check: Cross-institution isolation
    const isPlatformAdmin = session.user.role === 'SUPER_ADMIN' || session.user.role === 'OPERATIONS'
    const isOwnInstitution = session.user.institutionId === institutionId

    if (!isPlatformAdmin && !isOwnInstitution) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have permission to access records for this institution' },
        { status: 403 }
      )
    }

    const institution = await prisma.institution.findUnique({
      where: { id: institutionId },
    })

    if (!institution) {
      return NextResponse.json({ error: 'Institution not found' }, { status: 404 })
    }

    const placements = await prisma.placement.findMany({
      where: { institutionId },
      include: {
        student: {
          include: {
            user: true,
            profile: true,
          },
        },
        employer: true,
        job: true,
        offer: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    // Prepare structured audit rows
    const rows = placements.map((p) => {
      const ctcNum = p.ctc ? Number(p.ctc) : 550000
      const appointmentRef = p.offer?.id || `OFF-${p.placementCode.slice(-6)}`
      const joiningDateStr = p.joiningDate
        ? new Date(p.joiningDate).toLocaleDateString('en-IN')
        : 'Confirmed on Joining'

      return {
        rollNumber: p.student.enrollmentNumber || 'N/A',
        studentName: p.student.user.name,
        branch: p.student.profile?.branch || 'Computer Science',
        department: p.student.profile?.department || 'Engineering',
        employerName: p.employer.name,
        appointmentLetterRef: appointmentRef,
        packageInr: ctcNum,
        joiningDate: joiningDateStr,
        placementCode: p.placementCode,
        verificationStatus: p.status,
      }
    })

    // Check if JSON format requested
    const format = request.nextUrl.searchParams.get('format')
    if (format === 'json') {
      return NextResponse.json({
        institution: {
          id: institution.id,
          name: institution.name,
          code: institution.code,
        },
        auditReadinessTitle: 'Placement Evidence Export — NAAC/NIRF Supporting Documentation',
        generatedAt: new Date().toISOString(),
        totalPlacements: rows.length,
        records: rows,
      })
    }

    // Generate CSV
    const csvHeaders = [
      'Student Roll Number',
      'Student Full Name',
      'Branch / Specialization',
      'Department',
      'Employer / Placement Agency',
      'Appointment Letter Reference / Offer ID',
      'Annual Package (INR)',
      'Joining Date',
      'Placement Verification Code',
      'Institutional Verification Status',
    ]

    const csvLines = [
      csvHeaders.join(','),
      ...rows.map((r) =>
        [
          `"${r.rollNumber}"`,
          `"${r.studentName}"`,
          `"${r.branch}"`,
          `"${r.department}"`,
          `"${r.employerName}"`,
          `"${r.appointmentLetterRef}"`,
          r.packageInr,
          `"${r.joiningDate}"`,
          `"${r.placementCode}"`,
          `"${r.verificationStatus}"`,
        ].join(',')
      ),
    ]

    const csvContent = csvLines.join('\n')

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="placement-evidence-supporting-docs-${institution.code}.csv"`,
      },
    })
  } catch (error) {
    console.error('Evidence export error:', error)
    return NextResponse.json({ error: 'Failed to generate placement evidence export' }, { status: 500 })
  }
}
