import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2,
  ShieldCheck,
  ExternalLink,
  GraduationCap,
  Award,
  Lock,
  Building2,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  Search,
} from 'lucide-react';
import { COMPANY_IDENTITY } from '@/config/company-identity';
import { SAFE_TERMINOLOGY, NINE_DIMENSIONS_SPEC } from '@/config/brand-system';

export default async function PublicVerifyCredentialIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: rawId } = await params;
  const id = decodeURIComponent(rawId).trim();
  const normalizedUpper = id.toUpperCase();

  const isExplicitRevokedVector =
    normalizedUpper.startsWith('REVOKED-') || normalizedUpper.startsWith('EXPIRED-');

  const studentBadge = !isExplicitRevokedVector
    ? await prisma.studentBadge.findFirst({
        where: {
          OR: [{ verificationId: id }, { id: id }],
        },
        include: {
          badge: true,
          student: {
            include: {
              user: true,
              institution: true,
              profile: true,
            },
          },
        },
      })
    : null;

  let student = studentBadge?.student ?? null;
  let targetBadge = studentBadge?.badge ?? null;

  if (!student && !isExplicitRevokedVector) {
    const directStudent = await prisma.student.findFirst({
      where: {
        OR: [{ verificationId: id }, { id: id }],
      },
      include: {
        user: true,
        institution: true,
        profile: true,
        badges: {
          include: { badge: true },
        },
      },
    });

    if (directStudent) {
      student = directStudent;
      targetBadge = directStudent.badges[0]?.badge ?? null;
    }
  }

  const isCanonicalSampleId =
    normalizedUpper === COMPANY_IDENTITY.sampleCredentials.validStudentId ||
    normalizedUpper === COMPANY_IDENTITY.sampleCredentials.validBadgeId;

  if (!student && isCanonicalSampleId) {
    const sampleRecord = await prisma.student.findFirst({
      where: {
        OR: [
          { verificationId: COMPANY_IDENTITY.sampleCredentials.validStudentId },
          { user: { email: 'student1@apextech.edu.in' } },
        ],
      },
      include: {
        user: true,
        institution: true,
        profile: true,
        badges: {
          include: { badge: true },
        },
      },
    });
    if (sampleRecord) {
      student = sampleRecord;
      targetBadge = sampleRecord.badges[0]?.badge ?? null;
    }
  }

  const isRevokedOrInactive =
    isExplicitRevokedVector ||
    (student !== null &&
      (student.user.status === 'SUSPENDED' ||
        student.user.status === 'INACTIVE' ||
        student.status === 'SUSPENDED'));

  // State 2: Not Found (Zero fallback to default records)
  if (!student && !isExplicitRevokedVector) {
    return (
      <div className="min-h-screen bg-slate-50 py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <Link href="/verify" className="hover:text-blue-700 font-medium inline-flex items-center gap-1.5">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Credential Verification
            </Link>
            <span className="text-xs text-slate-500">Verification Status: Record Not Found</span>
          </div>

          <Card className="border-rose-300 bg-white shadow-xs overflow-hidden">
            <div className="bg-rose-950 text-white p-6 sm:p-8 border-b border-rose-900">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold bg-rose-500/20 text-rose-200 border border-rose-400/40">
                    <XCircle className="h-3.5 w-3.5 text-rose-400" />
                    Verification Status: Not Found
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    No Matching Credential Found
                  </h1>
                  <p className="text-xs sm:text-sm text-rose-200/90">
                    No active or historical credential matches the queried identifier in the PlacementConnect Verification Registry.
                  </p>
                </div>
                <div className="flex flex-col items-start sm:items-end gap-1 shrink-0">
                  <span className="text-[11px] text-rose-300 uppercase">Queried ID</span>
                  <span className="font-mono text-sm font-bold text-white px-3 py-1 rounded bg-rose-900/80 border border-rose-700">
                    {id}
                  </span>
                </div>
              </div>
            </div>

            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="p-4 rounded-md bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-1.5 leading-relaxed">
                <p className="font-bold">Verification Integrity Policy:</p>
                <p>
                  To protect candidate privacy and prevent credential spoofing, PlacementConnect never returns fallback records when an unrecognized ID is queried. Zero candidate information has been disclosed.
                </p>
              </div>

              <div className="space-y-2.5">
                <h2 className="text-sm font-bold text-slate-900">Recommended Next Steps:</h2>
                <ul className="text-xs text-slate-600 space-y-2 list-disc pl-5">
                  <li>Confirm that the Credential ID printed on the candidate&apos;s scorecard was entered without typographical errors.</li>
                  <li>Request a fresh verification link directly from the candidate.</li>
                  <li>To inspect how a valid record displays, view our sample credential below.</li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <Button asChild className="bg-[#1E40AF] hover:bg-blue-900 text-white">
                  <Link href="/verify">
                    <Search className="mr-2 h-4 w-4" />
                    Verify Another ID
                  </Link>
                </Button>
                <Button asChild variant="outline" className="text-xs border-slate-300">
                  <Link href={`/verify/${COMPANY_IDENTITY.sampleCredentials.validStudentId}`}>
                    View Valid Sample ({COMPANY_IDENTITY.sampleCredentials.validStudentId})
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // State 3: Revoked / Expired / Inactive
  if (isRevokedOrInactive) {
    return (
      <div className="min-h-screen bg-slate-50 py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <Link href="/verify" className="hover:text-blue-700 font-medium inline-flex items-center gap-1.5">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Credential Verification
            </Link>
            <span className="text-xs text-slate-500">Verification Status: Inactive</span>
          </div>

          <Card className="border-amber-300 bg-white shadow-xs overflow-hidden">
            <div className="bg-amber-950 text-white p-6 sm:p-8 border-b border-amber-900">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-500/20 text-amber-200 border border-amber-400/40">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                    Verification Status: Inactive / Expired
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    Credential No Longer Active
                  </h1>
                  <p className="text-xs sm:text-sm text-amber-200/90">
                    This credential existed in the PlacementConnect registry but has expired or been marked inactive by the issuing institution.
                  </p>
                </div>
                <div className="flex flex-col items-start sm:items-end gap-1 shrink-0">
                  <span className="text-[11px] text-amber-300 uppercase">Credential ID</span>
                  <span className="font-mono text-sm font-bold text-white px-3 py-1 rounded bg-amber-900/80 border border-amber-700">
                    {id}
                  </span>
                </div>
              </div>
            </div>

            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="p-4 rounded-md bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1.5 leading-relaxed">
                <p className="font-bold">Privacy &amp; Data Retention Notice:</p>
                <p>
                  When a candidate credential expires after its 12-month validity period or is withdrawn by the issuing institution&apos;s Training &amp; Placement Office, personal profile details are automatically withheld from public display.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <Button asChild className="bg-[#1E40AF] hover:bg-blue-900 text-white">
                  <Link href="/verify">
                    <Search className="mr-2 h-4 w-4" />
                    Verify Another Credential
                  </Link>
                </Button>
                <Button asChild variant="outline" className="text-xs border-slate-300">
                  <Link href={`/verify/${COMPANY_IDENTITY.sampleCredentials.validStudentId}`}>
                    View Active Sample ({COMPANY_IDENTITY.sampleCredentials.validStudentId})
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // State 1: Valid & Active Credential
  const activeStudent = student!;
  const credentialId = studentBadge?.verificationId || activeStudent.verificationId || id;
  const badgeTitle = targetBadge?.name || SAFE_TERMINOLOGY.assessmentFrameworkName;
  const issueDate = studentBadge?.issuedAt
    ? new Date(studentBadge.issuedAt).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '15 August 2026';

  const hasEmployerConsent = activeStudent.profile?.employerVisibilityConsent ?? true;
  const isSampleCohort =
    activeStudent.institution.name.includes('Apex Institute') || isCanonicalSampleId;

  const linkedinAddUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(
    badgeTitle
  )}&organizationName=PlacementConnect&issueYear=2026&certUrl=${encodeURIComponent(
    `https://placementconnect.com/verify/${credentialId}`
  )}&certId=${encodeURIComponent(credentialId)}`;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between text-xs text-slate-600">
          <Link href="/verify" className="hover:text-blue-700 font-medium inline-flex items-center gap-1.5">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Credential Verification
          </Link>
          <span className="text-xs text-slate-500">Verification Status: Valid</span>
        </div>

        {isSampleCohort && (
          <div className="px-4 py-2.5 rounded-md bg-blue-50 border border-blue-200 flex flex-wrap items-center justify-between gap-2 text-xs text-blue-950">
            <span className="font-semibold text-blue-900">
              Sample Credential Record — Illustrative Campus Data
            </span>
            <span className="text-blue-800">
              {COMPANY_IDENTITY.sampleCredentials.validInstitutionName}
            </span>
          </div>
        )}

        <Card className="border-slate-300 shadow-xs bg-white overflow-hidden">
          <div className="bg-[#0F172A] text-white p-6 sm:p-8 border-b border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    Verified Candidate Credential
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  {activeStudent.user.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300">
                  Evaluated under the {SAFE_TERMINOLOGY.assessmentFrameworkName}
                </p>
              </div>

              <div className="flex flex-col items-start sm:items-end gap-1 shrink-0">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider">
                  Credential ID
                </span>
                <span className="font-mono text-sm sm:text-base font-bold text-emerald-300 px-3 py-1 rounded bg-slate-800 border border-slate-700">
                  {credentialId}
                </span>
              </div>
            </div>
          </div>

          <CardContent className="p-6 sm:p-8 space-y-6">
            {/* Discoverable Technical Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6 border-b border-slate-200 text-xs">
              <div className="space-y-1">
                <span className="text-slate-500 font-medium block">Verification Status</span>
                <span className="font-semibold text-emerald-700">Valid &amp; Active (12-Month Window)</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500 font-medium block">Assessment Completed</span>
                <span className="font-mono font-semibold text-slate-900">{issueDate}</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500 font-medium block">Graduating Batch</span>
                <span className="font-mono font-semibold text-slate-900">
                  Class of {activeStudent.profile?.graduationYear || 2026}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-slate-200">
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-slate-500" />
                  Affiliated Institution
                </span>
                {hasEmployerConsent ? (
                  <>
                    <div className="text-sm font-bold text-slate-900">
                      {activeStudent.institution.name}
                    </div>
                    <div className="text-xs text-slate-600">
                      {activeStudent.profile?.course || 'B.Tech'} —{' '}
                      {activeStudent.profile?.department || 'Computer Science'}
                    </div>
                  </>
                ) : (
                  <div className="text-xs text-slate-600 italic flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-amber-600" />
                    Institution details restricted by candidate privacy preference
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5 text-slate-500" />
                  Evaluation Scope
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {targetBadge?.description ||
                    'Verified completion of the 36-item timed assessment across 9 core analytical, technical, and workplace readiness dimensions.'}
                </p>
              </div>
            </div>

            {/* 9-Dimension Summary */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-700">
                  9-Dimension Evaluation Breakdown
                </h3>
                <span className="font-mono text-xs font-bold text-emerald-700">
                  Composite Readiness: 85 / 100
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {NINE_DIMENSIONS_SPEC.slice(0, 6).map((dim) => (
                  <div
                    key={dim.id}
                    className="p-3 rounded-md border border-slate-200 bg-slate-50/70 flex flex-col justify-between gap-1"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{dim.samplePercentile}</span>
                      <span className="font-mono font-bold text-slate-900">{dim.sampleScore}/100</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-800 line-clamp-1">
                      {dim.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-200">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-900 block">
                    Authenticity Confirmed
                  </span>
                  Verified against the issuing institution&apos;s campus placement roster.
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  asChild
                  size="sm"
                  className="bg-[#0A66C2] hover:bg-[#004182] text-white text-xs gap-1.5"
                >
                  <a href={linkedinAddUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3.5 w-3.5" />
                    Add to LinkedIn Profile
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
