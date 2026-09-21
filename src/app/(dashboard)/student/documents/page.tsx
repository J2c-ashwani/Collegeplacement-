import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { StudentDocumentsVault, StudentDocumentItem } from './student-documents-vault'
import { ShieldCheck, Lock } from 'lucide-react'

export default async function StudentDocumentsPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  const student = await prisma.student.findFirst({
    where: { userId: session.user.id },
    include: {
      documents: {
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  // Format documents directly from DB (strictly zero dummy document fallbacks)
  const documentItems: StudentDocumentItem[] = (student?.documents || []).map((d) => {
    let status: StudentDocumentItem['status'] = 'PENDING'
    if (d.verificationStatus === 'VERIFIED') status = 'VERIFIED'
    else if (d.verificationStatus === 'FLAGGED') status = 'FLAGGED'
    else if (d.verificationStatus === 'REJECTED') status = 'REJECTED'

    return {
      id: d.id,
      type: d.type.replace('_', ' '),
      filename: d.originalFilename || d.filename,
      uploadedAt: d.createdAt.toISOString().split('T')[0],
      status,
      size: `${Math.round(d.size / 1024)} KB`,
      verificationComment: d.verificationComment || undefined,
    }
  })

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
              Career Assets
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500">Encrypted Digital Document Vault</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Document Vault & Verification</h1>
          <p className="text-xs text-slate-500 mt-1">
            Upload resumes, academic marksheets, and certifications. Track institutional verification status chips in real time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs flex items-center gap-1">
            <Lock className="h-3 w-3" />
            Tenant Isolated
          </Badge>
        </div>
      </div>

      <StudentDocumentsVault initialDocs={documentItems} />
    </div>
  )
}
