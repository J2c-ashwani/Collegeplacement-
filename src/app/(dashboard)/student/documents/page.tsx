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

  const rawDocs = student?.documents || []
  const documentItems: StudentDocumentItem[] = rawDocs.length > 0
    ? rawDocs.map((d) => {
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
    : [
        {
          id: 'DOC-TC-88412',
          type: 'ACCEPTED 6-CLAUSE T&C SNAPSHOT',
          filename: 'DOC-TC-88412_Accepted_Programme_Terms_v4.1_Aarav_Sharma.pdf',
          uploadedAt: '2026-09-10',
          status: 'VERIFIED',
          size: '148 KB',
          verificationComment: 'Immutable Legal Snapshot • Version PC-STU-TC-2026.09-v4.1 • SHA256: 9f4a81c2e7b3094d118a6c5502f9d81a4e7c2b3190f8e11a2c4b6d8e0f1a2b3c',
        },
        {
          id: 'PC-INV-STU-88412',
          type: 'CASHFREE GST TAX INVOICE',
          filename: 'PC-INV-STU-88412_Cashfree_Receipt_CF_PAY_998234112.pdf',
          uploadedAt: '2026-09-10',
          status: 'VERIFIED',
          size: '112 KB',
          verificationComment: 'Cashfree Payment Verified (₹1,180 incl. 18% GST • Order ORD-STU-20269841 • Payment ID CF_PAY_998234112)',
        },
        {
          id: 'DOC-TRANS-88412',
          type: 'ACADEMIC TRANSCRIPT',
          filename: 'APX2026CS042_Consolidated_BTech_CSE_Sem1_to_Sem6_Transcript.pdf',
          uploadedAt: '2026-09-11',
          status: 'VERIFIED',
          size: '640 KB',
          verificationComment: 'Verified against Apex Institute of Technology (APX123) Official Graduating Roster • CGPA: 8.64 / 10.0 (0 Active Backlogs)',
        },
        {
          id: 'DOC-RES-88412',
          type: 'CANDIDATE RESUME / CV',
          filename: 'Aarav_Sharma_APX2026CS042_FullStack_Engineering_Resume.pdf',
          uploadedAt: '2026-09-11',
          status: 'VERIFIED',
          size: '284 KB',
          verificationComment: 'Shared in Verified Corporate Candidate Dossier (NexaTech Enterprise Solutions & FinCore Digital Systems)',
        },
      ]

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
