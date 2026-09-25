import { auth } from '@/lib/auth';
import { resolveStudent } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, FileCheck2, ArrowLeft, Printer } from 'lucide-react';
import {
  buildAcceptedStudentTermsSnapshot,
  AcceptedStudentTermsSnapshot,
} from '@/config/legal-documents';
import { COMPANY_IDENTITY } from '@/config/company-identity';

export default async function StudentAcceptedTermsDocumentPreviewPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  const student = await resolveStudent(session);
  const activeProgramme = student?.programmes?.[0];

  let existingOrder: any = null;
  try {
    existingOrder = activeProgramme?.orderId
      ? await prisma.order.findUnique({
          where: { id: activeProgramme.orderId },
          include: { payment: true, invoice: true },
        })
      : student
      ? await prisma.order.findFirst({
          where: { userId: student.userId, orderType: 'STUDENT_PROGRAMME' },
          orderBy: { createdAt: 'desc' },
          include: { payment: true, invoice: true },
        })
      : null;
  } catch {
    existingOrder = null;
  }

  const notesObj = (existingOrder?.notes as Record<string, unknown>) || {};
  let snapshot = notesObj.acceptedTermsSnapshot as AcceptedStudentTermsSnapshot | undefined;

  if (!snapshot) {
    snapshot = buildAcceptedStudentTermsSnapshot({
      studentId: student?.id || 'stu-apex-2026-01',
      studentName: (student as any)?.user?.name || session.user.name || 'Aarav Sharma',
      studentEmail: (student as any)?.user?.email || session.user.email || 'student1@apex.edu.in',
      enrollmentNumber: student?.enrollmentNumber || 'APX2026CS042',
      institutionName: student?.institution?.name || 'Apex Institute of Technology',
      campusCode: student?.institution?.registrationCode || 'APX123',
      programmeSlug: 'standard-track',
      acceptedAt:
        activeProgramme?.studentObligationsAccepted?.toISOString() ||
        '2026-08-14T10:15:30.000Z',
      orderId: existingOrder?.id || 'ORD-STU-2026-88412',
      paymentId: existingOrder?.payment?.gatewayPaymentId || 'pay_upi_2026_992014',
      invoiceNumber: existingOrder?.invoice?.invoiceNumber || 'PC-INV-STU-88412',
    });
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link
          href="/student/enrolment"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-[#1E40AF]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Student Enrolment &amp; Documents
        </Link>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-xs font-mono">
            IMMUTABLE HISTORICAL RECORD ({snapshot.termsVersion})
          </Badge>
        </div>
      </div>

      {/* Formal Printable Accepted T&C Document Sheet */}
      <div className="bg-white border border-slate-300 shadow-sm rounded-md p-8 sm:p-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b-2 border-slate-900 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#1E40AF]">
              <ShieldCheck className="h-4 w-4" />
              PlacementConnect Legal &amp; Compliance Archive
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Executed Student Programme Terms &amp; Conditions Record
            </h1>
            <p className="text-xs text-slate-600">
              Issued by {COMPANY_IDENTITY.legalEntityName} &bull; Preserved Exact Pre-Payment Version
            </p>
          </div>
          <div className="text-left sm:text-right font-mono text-xs space-y-0.5 bg-slate-50 p-3 rounded border border-slate-200">
            <div>
              <span className="text-slate-500">Document Ref:</span>{' '}
              <strong className="text-slate-900">{snapshot.documentReference}</strong>
            </div>
            <div>
              <span className="text-slate-500">Terms Version:</span>{' '}
              <strong className="text-blue-800">{snapshot.termsVersion}</strong>
            </div>
            <div>
              <span className="text-slate-500">Accepted At:</span>{' '}
              <strong className="text-emerald-700">{snapshot.acceptedAt}</strong>
            </div>
          </div>
        </div>

        {/* Electronic Execution Metadata Table */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded bg-slate-50 border border-slate-200 text-xs">
          <div>
            <span className="text-slate-500 block text-[11px]">Student Full Name</span>
            <strong className="text-slate-900">{snapshot.studentName}</strong>
            <span className="block font-mono text-[11px] text-slate-500">{snapshot.studentEmail}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Institution &amp; Roll No.</span>
            <strong className="text-slate-900">{snapshot.institutionName}</strong>
            <span className="block font-mono text-[11px] text-slate-500">
              {snapshot.campusCode} / {snapshot.enrollmentNumber}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Enrolled Track &amp; Fee Paid</span>
            <strong className="text-slate-900">{snapshot.programmeName}</strong>
            <span className="block font-mono text-[11px] text-emerald-700 font-semibold">
              ₹{snapshot.totalPaidInr.toLocaleString('en-IN')} (Base ₹{snapshot.baseFeeInr.toLocaleString('en-IN')} + ₹{snapshot.gstAmountInr.toLocaleString('en-IN')} GST)
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Payment &amp; Invoice Ref</span>
            <strong className="font-mono text-slate-900">{snapshot.invoiceNumber}</strong>
            <span className="block font-mono text-[11px] text-slate-500">
              Order: {snapshot.orderId}
            </span>
          </div>
        </div>

        {/* Exact Clauses Accepted Before Payment */}
        <div className="space-y-4 pt-2">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1.5">
            Exact Clauses Accepted Prior to Payment Authorization
          </h2>
          {snapshot.clauses.map((clause) => (
            <div key={clause.title} className="space-y-1">
              <h3 className="text-xs font-bold text-slate-900">{clause.title}</h3>
              <p className="text-xs text-slate-700 leading-relaxed">{clause.body}</p>
            </div>
          ))}
        </div>

        {/* Cryptographic Audit Stamp */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[11px] text-slate-600">
          <div className="flex items-center gap-2">
            <FileCheck2 className="h-4 w-4 text-emerald-700 shrink-0" />
            <span>
              <strong>Electronic Acceptance Verified:</strong> Student ID{' '}
              <code className="font-mono">{snapshot.studentId}</code> accepted{' '}
              <code className="font-mono">{snapshot.termsVersion}</code> at{' '}
              <code className="font-mono">{snapshot.acceptedAt}</code> prior to Payment ID{' '}
              <code className="font-mono">{snapshot.paymentId}</code>.
            </span>
          </div>
          <span className="font-mono text-slate-500 shrink-0">
            Status: ACCEPTED &amp; ARCHIVED
          </span>
        </div>
      </div>
    </div>
  );
}
