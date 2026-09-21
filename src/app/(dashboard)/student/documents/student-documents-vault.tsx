'use client'

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Upload, CheckCircle2, Clock, AlertTriangle, XCircle, Download, ShieldCheck, Eye } from "lucide-react"

export interface StudentDocumentItem {
  id: string
  type: string
  filename: string
  uploadedAt: string
  status: 'VERIFIED' | 'PENDING' | 'FLAGGED' | 'REJECTED'
  size: string
  verificationComment?: string
}

export function StudentDocumentsVault({ initialDocs }: { initialDocs: StudentDocumentItem[] }) {
  const [docs, setDocs] = React.useState<StudentDocumentItem[]>(initialDocs)
  const [isUploading, setIsUploading] = React.useState(false)
  const [uploadError, setUploadError] = React.useState<string | null>(null)

  const handleUpload = async (docType: string) => {
    setIsUploading(true)
    setUploadError(null)

    const typeMapping: Record<string, string> = {
      'Primary Resume': 'RESUME',
      'Semester Marksheet': 'ACADEMIC',
      'Course Certificate': 'CERTIFICATE',
    }

    const prismaType = typeMapping[docType] || 'OTHER'
    const filename = `${docType.toLowerCase().replace(/\s+/g, '_')}_2026.pdf`
    const dummyBase64 = typeof window !== 'undefined' ? btoa('Mock PDF Content for Document Verification') : ''

    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: prismaType,
          filename,
          mimeType: 'application/pdf',
          size: 1400000,
          base64Content: dummyBase64,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error?.message || data.message || 'Upload failed')
      }

      const created = data.data || data
      const newDoc: StudentDocumentItem = {
        id: created.id,
        type: docType,
        filename: created.filename || filename,
        uploadedAt: 'Just now',
        status: 'PENDING',
        size: '1.4 MB',
        verificationComment: 'Submitted for institutional verification',
      }
      setDocs((prev) => [newDoc, ...prev])
    } catch (err: any) {
      setUploadError(err.message || 'Error uploading document')
    } finally {
      setIsUploading(false)
    }
  }

  const getStatusChip = (status: StudentDocumentItem['status']) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs flex items-center gap-1 font-semibold">
            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
            VERIFIED
          </Badge>
        )
      case 'PENDING':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs flex items-center gap-1 font-semibold">
            <Clock className="h-3 w-3 text-amber-600" />
            PENDING VERIFICATION
          </Badge>
        )
      case 'FLAGGED':
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-xs flex items-center gap-1 font-semibold">
            <AlertTriangle className="h-3 w-3 text-orange-600" />
            FLAGGED FOR REVIEW
          </Badge>
        )
      case 'REJECTED':
        return (
          <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 text-xs flex items-center gap-1 font-semibold">
            <XCircle className="h-3 w-3 text-rose-600" />
            REJECTED
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-6">
      {uploadError && (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium">
          {uploadError}
        </div>
      )}

      {/* Vault Upload Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-slate-200/80 shadow-2xs bg-white flex flex-col justify-between">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="h-4 w-4 text-indigo-600" />
              Primary Resume (ATS)
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Shared with recruiters upon 1-click job application
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button
              size="sm"
              variant="outline"
              disabled={isUploading}
              onClick={() => handleUpload("Primary Resume")}
              className="w-full text-xs flex items-center justify-center gap-1.5 border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/30"
            >
              <Upload className="h-3.5 w-3.5 text-slate-500" />
              {isUploading ? 'Uploading...' : 'Upload New Version (PDF)'}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 shadow-2xs bg-white flex flex-col justify-between">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Academic Marksheets
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              10th, 12th, and Semester Transcripts for institutional audit
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button
              size="sm"
              variant="outline"
              disabled={isUploading}
              onClick={() => handleUpload("Semester Marksheet")}
              className="w-full text-xs flex items-center justify-center gap-1.5 border-dashed border-slate-300 hover:border-emerald-400 hover:bg-emerald-50/30"
            >
              <Upload className="h-3.5 w-3.5 text-slate-500" />
              {isUploading ? 'Uploading...' : 'Upload Transcript (PDF)'}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 shadow-2xs bg-white flex flex-col justify-between">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="h-4 w-4 text-purple-600" />
              Certificates & Badges
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Internship certificates, hackathon rankings, and skill credentials
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button
              size="sm"
              variant="outline"
              disabled={isUploading}
              onClick={() => handleUpload("Course Certificate")}
              className="w-full text-xs flex items-center justify-center gap-1.5 border-dashed border-slate-300 hover:border-purple-400 hover:bg-purple-50/30"
            >
              <Upload className="h-3.5 w-3.5 text-slate-500" />
              {isUploading ? 'Uploading...' : 'Upload Certificate (PDF)'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Vault Document Ledger */}
      <Card className="border-slate-200/80 shadow-2xs bg-white">
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-900">
                Uploaded Records & Verification Ledger
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Documents are encrypted and isolated under multi-tenant role access rules
              </CardDescription>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              {docs.length} Documents Encrypted
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {docs.length === 0 ? (
            <div className="p-12 text-center text-slate-500 space-y-2">
              <FileText className="h-8 w-8 mx-auto text-slate-300" />
              <p className="font-semibold text-slate-700">No documents uploaded yet</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Upload your resume, academic transcripts, or certificates above to submit them for placement cell verification.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 text-xs">
            {docs.map((doc) => (
              <div key={doc.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 mt-0.5">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 flex items-center gap-2">
                      <span>{doc.filename}</span>
                      <span className="text-[11px] font-normal text-slate-400 font-mono">({doc.size})</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Type: <strong>{doc.type}</strong> • Uploaded: {doc.uploadedAt}
                    </p>
                    {doc.verificationComment && (
                      <p className="text-[11px] text-slate-600 italic mt-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 inline-block">
                        Verification Note: &quot;{doc.verificationComment}&quot;
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  {getStatusChip(doc.status)}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs text-slate-600 hover:text-indigo-600"
                    onClick={() => alert(`Previewing ${doc.filename}`)}
                  >
                    <Eye className="h-3.5 w-3.5 mr-1" />
                    Preview
                  </Button>
                </div>
              </div>
            ))}
          </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
