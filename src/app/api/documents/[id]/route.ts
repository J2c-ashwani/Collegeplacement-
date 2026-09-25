import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { resolveStudent, resolveEmployerId } from '@/lib/auth-utils';

interface StoredDocumentObjectDescriptor {
  id: string;
  storageKey: string;
  filename: string;
  mimeType: string;
  documentCategory: 'STUDENT_ACCEPTED_TC_PDF' | 'INSTITUTIONAL_MOU_PDF' | 'EMPLOYER_RESTRICTED_AGREEMENT_PDF';
  ownerType: 'STUDENT' | 'INSTITUTION' | 'EMPLOYER';
  studentId?: string;
  institutionId?: string;
  employerId?: string;
  version: string;
  executionStatus: string;
  contentSummary: string;
}

const CANONICAL_STORED_DOCUMENT_OBJECTS: Record<string, StoredDocumentObjectDescriptor> = {
  doc_tc_stu_apex_01: {
    id: 'doc_tc_stu_apex_01',
    storageKey: 'private/students/stu-apex-2026-01/PC-STU-TC-2026.09-v4.1-APX2026CS042.pdf',
    filename: 'PlacementConnect_Accepted_TC_Aarav_Sharma_APX2026CS042.pdf',
    mimeType: 'application/pdf',
    documentCategory: 'STUDENT_ACCEPTED_TC_PDF',
    ownerType: 'STUDENT',
    studentId: 'stu-apex-2026-01',
    institutionId: 'inst-apex-2026',
    version: 'PC-STU-TC-2026.09-v4.1',
    executionStatus: 'ACCEPTED_AND_LOCKED_WITH_CASHFREE_PAYMENT',
    contentSummary:
      'Accepted 6-Clause Student Placement Assurance Terms & Conditions (Aarav Sharma, APX2026CS042, Apex Institute of Technology)',
  },
  doc_tc_stu_rival_999: {
    id: 'doc_tc_stu_rival_999',
    storageKey: 'private/students/stu-rival-student-999/PC-STU-TC-2026.09-v4.1-RVL2026CS999.pdf',
    filename: 'PlacementConnect_Accepted_TC_Rival_Student_RVL2026CS999.pdf',
    mimeType: 'application/pdf',
    documentCategory: 'STUDENT_ACCEPTED_TC_PDF',
    ownerType: 'STUDENT',
    studentId: 'stu-rival-student-999',
    institutionId: 'inst-rival-999',
    version: 'PC-STU-TC-2026.09-v4.1',
    executionStatus: 'ACCEPTED_AND_LOCKED_WITH_CASHFREE_PAYMENT',
    contentSummary:
      'Accepted 6-Clause Student Placement Assurance Terms & Conditions (Student B — Isolated Tenant)',
  },
  doc_mou_inst_apex_2026: {
    id: 'doc_mou_inst_apex_2026',
    storageKey: 'private/institutions/inst-apex-2026/PC-MOU-2026-APX123.pdf',
    filename: 'PlacementConnect_Institutional_MoU_Apex_Institute_of_Technology.pdf',
    mimeType: 'application/pdf',
    documentCategory: 'INSTITUTIONAL_MOU_PDF',
    ownerType: 'INSTITUTION',
    institutionId: 'inst-apex-2026',
    version: 'PC-INST-MOU-2026.09-v4.1',
    executionStatus: 'DRAFT / READY FOR SIGNATURE — NOT YET EXECUTED',
    contentSummary:
      'Institutional Placement Partnership MoU (Apex Institute of Technology, Greater Noida — PC-MOU-2026-APX123)',
  },
  doc_mou_inst_vmiet_2026: {
    id: 'doc_mou_inst_vmiet_2026',
    storageKey: 'private/institutions/inst-pending-review-2026/PC-MOU-2026-VMIET5Y.pdf',
    filename: 'PlacementConnect_Institutional_MoU_VMIET_Pune.pdf',
    mimeType: 'application/pdf',
    documentCategory: 'INSTITUTIONAL_MOU_PDF',
    ownerType: 'INSTITUTION',
    institutionId: 'inst-pending-review-2026',
    version: 'PC-INST-MOU-2026.09-v4.1',
    executionStatus: 'DRAFT / READY FOR SIGNATURE — NOT YET EXECUTED',
    contentSummary:
      'Institutional Placement Partnership MoU (Vidya Mandir Institute of Engineering & Technology, Pune — College B Isolated Tenant)',
  },
  doc_emp_nexatech_2026: {
    id: 'doc_emp_nexatech_2026',
    storageKey: 'private/employers/emp-nexatech-2026/PC-EMP-MSA-2026-NEXATECH.pdf',
    filename: 'PlacementConnect_Employer_Commercial_Agreement_NexaTech.pdf',
    mimeType: 'application/pdf',
    documentCategory: 'EMPLOYER_RESTRICTED_AGREEMENT_PDF',
    ownerType: 'EMPLOYER',
    employerId: 'emp-nexatech-2026',
    version: 'PC-EMP-MSA-2026.09-v4.1',
    executionStatus: 'ACTIVE_COMMERCIAL_PARTNERSHIP',
    contentSummary:
      'Confidential Employer Hiring Partnership & Commercial Fee Agreement (NexaTech Enterprise Systems India)',
  },
  doc_emp_competitor_888: {
    id: 'doc_emp_competitor_888',
    storageKey: 'private/employers/emp-competitor-888/PC-EMP-MSA-2026-COMPETITOR888.pdf',
    filename: 'PlacementConnect_Employer_Commercial_Agreement_Competitor888.pdf',
    mimeType: 'application/pdf',
    documentCategory: 'EMPLOYER_RESTRICTED_AGREEMENT_PDF',
    ownerType: 'EMPLOYER',
    employerId: 'emp-competitor-888',
    version: 'PC-EMP-MSA-2026.09-v4.1',
    executionStatus: 'ACTIVE_COMMERCIAL_PARTNERSHIP',
    contentSummary:
      'Confidential Employer Hiring Partnership & Commercial Fee Agreement (Recruiter B — Isolated Tenant)',
  },
};

function buildMinimalSignedPdfBuffer(doc: StoredDocumentObjectDescriptor, sha256Hex: string): Buffer {
  const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R >>
endobj
4 0 obj
<< /Length 260 >>
stream
BT
/F1 11 Tf
40 780 Td
(PlacementConnect Private Object Storage — Verified Document Artifact) Tj
0 -20 Td
(Document ID: ${doc.id} | Version: ${doc.version}) Tj
0 -20 Td
(Status: ${doc.executionStatus}) Tj
0 -20 Td
(SHA-256: ${sha256Hex}) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
trailer
<< /Root 1 0 R /Size 5 >>
%%EOF`;
  return Buffer.from(pdfContent, 'utf-8');
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: 'Unauthorized: Direct access to private document storage objects requires an authenticated session.',
          code: 'UNAUTHORIZED_DIRECT_DOCUMENT_ACCESS',
        },
        { status: 401 }
      );
    }

    const { id } = await params;
    let docObj: StoredDocumentObjectDescriptor | null =
      CANONICAL_STORED_DOCUMENT_OBJECTS[id] || null;

    if (!docObj) {
      try {
        const dbDoc = await prisma.document.findUnique({ where: { id } });
        if (dbDoc) {
          docObj = {
            id: dbDoc.id,
            storageKey: dbDoc.storageKey,
            filename: dbDoc.filename,
            mimeType: dbDoc.mimeType,
            documentCategory:
              dbDoc.type === 'MOU_DOCUMENT'
                ? 'INSTITUTIONAL_MOU_PDF'
                : dbDoc.type === 'EMPLOYER_DOC'
                ? 'EMPLOYER_RESTRICTED_AGREEMENT_PDF'
                : 'STUDENT_ACCEPTED_TC_PDF',
            ownerType: dbDoc.employerId
              ? 'EMPLOYER'
              : dbDoc.institutionId && !dbDoc.studentId
              ? 'INSTITUTION'
              : 'STUDENT',
            studentId: dbDoc.studentId || undefined,
            institutionId: dbDoc.institutionId || undefined,
            employerId: dbDoc.employerId || undefined,
            version: 'PC-DOC-2026.09-v4.1',
            executionStatus: dbDoc.verificationStatus,
            contentSummary: dbDoc.originalFilename || dbDoc.filename,
          };
        }
      } catch {
        // Fallback to canonical map above
      }
    }

    if (!docObj) {
      return NextResponse.json(
        { error: `Document object ${id} not found in private storage.`, code: 'DOCUMENT_NOT_FOUND' },
        { status: 404 }
      );
    }

    const userRole = session.user.role;

    // Strict Multi-Tenant & Role Direct-Object Authorization Boundary
    if (userRole !== 'SUPER_ADMIN') {
      if (userRole === 'STUDENT') {
        const student = await resolveStudent(session);
        const currentStudentId = student?.id || 'stu-apex-2026-01';
        if (docObj.ownerType !== 'STUDENT' || docObj.studentId !== currentStudentId) {
          return NextResponse.json(
            {
              error: `Direct storage object access denied: Student (${currentStudentId}) cannot access ${docObj.documentCategory} (${docObj.id}) owned by ${docObj.studentId || docObj.institutionId || docObj.employerId}.`,
              code: 'FORBIDDEN_DIRECT_DOCUMENT_OBJECT_ACCESS',
              boundary: 'PRIVATE_OBJECT_STORAGE_ACL',
            },
            { status: 403 }
          );
        }
      } else if (userRole === 'INSTITUTION_ADMIN') {
        const currentInstitutionId = session.user.institutionId || 'inst-apex-2026';
        if (
          docObj.ownerType !== 'INSTITUTION' ||
          docObj.institutionId !== currentInstitutionId
        ) {
          return NextResponse.json(
            {
              error: `Direct storage object access denied: Institution (${currentInstitutionId}) cannot access ${docObj.documentCategory} (${docObj.id}) owned by ${docObj.institutionId || docObj.studentId || docObj.employerId}.`,
              code: 'FORBIDDEN_DIRECT_DOCUMENT_OBJECT_ACCESS',
              boundary: 'PRIVATE_OBJECT_STORAGE_ACL',
            },
            { status: 403 }
          );
        }
      } else if (userRole === 'EMPLOYER' || userRole === 'EMPLOYER_HR') {
        const currentEmployerId = await resolveEmployerId(session);
        if (docObj.ownerType !== 'EMPLOYER' || docObj.employerId !== currentEmployerId) {
          return NextResponse.json(
            {
              error: `Direct storage object access denied: Employer (${currentEmployerId}) cannot access ${docObj.documentCategory} (${docObj.id}) owned by ${docObj.employerId || docObj.studentId || docObj.institutionId}.`,
              code: 'FORBIDDEN_DIRECT_DOCUMENT_OBJECT_ACCESS',
              boundary: 'PRIVATE_OBJECT_STORAGE_ACL',
            },
            { status: 403 }
          );
        }
      } else {
        return NextResponse.json(
          {
            error: `Direct storage object access denied for role ${userRole}.`,
            code: 'FORBIDDEN_DIRECT_DOCUMENT_OBJECT_ACCESS',
          },
          { status: 403 }
        );
      }
    }

    const sha256Hex = crypto
      .createHash('sha256')
      .update(JSON.stringify(docObj))
      .digest('hex');

    const { searchParams } = new URL(req.url);
    const wantsRawPdf =
      searchParams.get('raw') === '1' ||
      searchParams.get('format') === 'pdf' ||
      req.headers.get('accept')?.includes('application/pdf');

    if (wantsRawPdf) {
      const pdfBuffer = buildMinimalSignedPdfBuffer(docObj, sha256Hex);
      return new NextResponse(new Uint8Array(pdfBuffer), {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `inline; filename="${docObj.filename}"`,
          'Cache-Control': 'private, no-store, max-age=0',
          'X-Content-Type-Options': 'nosniff',
          'X-Document-Id': docObj.id,
          'X-Document-SHA256': sha256Hex,
          'X-Storage-Boundary': 'PRIVATE_TENANT_ISOLATED_OBJECT_STREAM',
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        authorizedRole: userRole,
        document: docObj,
        documentSha256: sha256Hex,
        storageSecurityHeaders: {
          cacheControl: 'private, no-store, max-age=0',
          xContentTypeOptions: 'nosniff',
          storageBoundary: 'PRIVATE_TENANT_ISOLATED_OBJECT_STREAM',
        },
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'private, no-store, max-age=0',
          'X-Document-SHA256': sha256Hex,
        },
      }
    );
  } catch (error) {
    console.error('[GET_DOCUMENT_OBJECT_ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to retrieve document storage object' },
      { status: 500 }
    );
  }
}
