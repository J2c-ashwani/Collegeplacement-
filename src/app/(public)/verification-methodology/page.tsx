import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ShieldCheck, 
  FileCheck2, 
  Building2, 
  Calculator, 
  Users, 
  AlertCircle, 
  Globe2, 
  History, 
  CheckCircle2, 
  Scale,
  ArrowRight
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Placement Verification Methodology | PlacementConnect',
  description: 'The canonical institutional standards, definitions, and verification protocols governing verified placement outcomes, median compensation calculation, and audit integrity on PlacementConnect.',
}

export default function VerificationMethodologyPage() {
  const lastUpdated = 'September 2026'

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Hero Header */}
      <section className="bg-white border-b border-slate-200/90 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
            <ShieldCheck className="h-3.5 w-3.5" />
            Institutional Governance &amp; Audit Standard
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            PlacementConnect Verification Methodology
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Every statistic on an institutional placement profile or accreditation dossier is grounded in primary source documentation. This document codifies the technical definitions, mathematical rules, and evidentiary standards required for a record to be classified as <strong>Verified</strong>.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-500">
            <span>Version: <strong className="text-slate-800 font-mono">VERIF-STD-2026.1</strong></span>
            <span>•</span>
            <span>Effective: <strong className="text-slate-800">{lastUpdated}</strong></span>
            <span>•</span>
            <span>Governing Scope: Institutional &amp; Student Verified Records</span>
          </div>
        </div>
      </section>

      {/* Main Content: 11 Core Methodological Protocols */}
      <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Guiding Principle */}
        <div className="p-5 rounded-lg bg-indigo-50/70 border border-indigo-200 text-xs sm:text-sm text-indigo-950 space-y-2">
          <div className="font-bold text-indigo-900 flex items-center gap-2">
            <Scale className="h-4 w-4 text-indigo-700" />
            The Provenance Principle
          </div>
          <p className="text-indigo-900/90 leading-relaxed">
            PlacementConnect does not certify institutional marketing brochures or unverified self-declarations. Every published figure maps directly to an underlying corporate transaction, validated employer credential, or uploaded primary document. When an institution presents a PlacementConnect Verified Record, the data is guaranteed to withstand rigorous third-party and regulatory scrutiny.
          </p>
        </div>

        {/* Protocols Grid */}
        <div className="space-y-6">

          {/* Protocol 1: Verified Offer */}
          <Card className="border-slate-200 shadow-2xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-indigo-600 uppercase">Protocol 01</span>
                <Badge variant="outline" className="text-[11px] bg-slate-50">Document Standard</Badge>
              </div>
              <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileCheck2 className="h-4 w-4 text-indigo-600" />
                What Constitutes a Verified Offer
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs sm:text-sm text-slate-600 space-y-2.5 leading-relaxed">
              <p>
                An offer is accepted into the verified ledger only when supported by a formal written offer letter or corporate appointment order issued on the employer&apos;s legal letterhead, or delivered via an authenticated corporate domain email.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-700">
                <li>Must specify candidate legal name, designated job title, joining corridor, and annualized compensation breakdown.</li>
                <li>Verbal offers, preliminary interview shortlists, and conditional letters contingent on commercial client acquisition are strictly prohibited from the placed count.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Protocol 2: Confirmed Joining */}
          <Card className="border-slate-200 shadow-2xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-indigo-600 uppercase">Protocol 02</span>
                <Badge variant="outline" className="text-[11px] bg-slate-50">Outcome Verification</Badge>
              </div>
              <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                What Constitutes a Confirmed Joining
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs sm:text-sm text-slate-600 space-y-2.5 leading-relaxed">
              <p>
                A candidate is designated as &quot;Joined&quot; upon submission of at least one verifiable secondary artifact:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-700">
                <li>Corporate onboarding confirmation email from human resources; OR</li>
                <li>First-month salary pay slip; OR</li>
                <li>Signed institutional joining report counter-attested by the employer&apos;s authorized representative.</li>
              </ul>
              <p className="text-slate-500 text-xs italic">
                Records with an offer letter but pending joining date remain in the &quot;Offer Accepted — Joining Pending&quot; state and are flagged in the institutional gap tracker until verified.
              </p>
            </CardContent>
          </Card>

          {/* Protocol 3: Employer Identity */}
          <Card className="border-slate-200 shadow-2xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-indigo-600 uppercase">Protocol 03</span>
                <Badge variant="outline" className="text-[11px] bg-slate-50">Entity Authentication</Badge>
              </div>
              <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-sky-600" />
                Employer Entity Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs sm:text-sm text-slate-600 space-y-2.5 leading-relaxed">
              <p>
                Hiring entities must be verified legal entities prior to candidate matching. Verification requires:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-700">
                <li>Active Corporate Identification Number (CIN) or verified GSTIN registration;</li>
                <li>Validated corporate domain email credentials for recruiter accounts; and</li>
                <li>Execution of the standard Employer Recruiter Agreement.</li>
              </ul>
              <p>Unregistered intermediaries or unverified third-party staffing brokers cannot issue verified offers under their own brand.</p>
            </CardContent>
          </Card>

          {/* Protocol 4: CTC Normalization */}
          <Card className="border-slate-200 shadow-2xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-indigo-600 uppercase">Protocol 04</span>
                <Badge variant="outline" className="text-[11px] bg-slate-50">Financial Modeling</Badge>
              </div>
              <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Calculator className="h-4 w-4 text-amber-600" />
                CTC Normalization &amp; Component Rules
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs sm:text-sm text-slate-600 space-y-2.5 leading-relaxed">
              <p>
                To eliminate inflated CTC marketing claims, PlacementConnect normalizes all packages to guaranteed annualized earning potential (INR Lakhs per Annum):
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-700">
                <li><strong>Included:</strong> Guaranteed base salary + mandatory allowances + performance bonus payable in Year 1.</li>
                <li><strong>Excluded:</strong> Multi-year unvested ESOP pools, retention bonuses conditional upon Year 3+ service, non-monetary health cover limits, and hypothetical variable ceilings.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Protocol 5: Median CTC Calculation */}
          <Card className="border-slate-200 shadow-2xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-indigo-600 uppercase">Protocol 05</span>
                <Badge variant="outline" className="text-[11px] bg-slate-50">Statistical Governance</Badge>
              </div>
              <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Scale className="h-4 w-4 text-emerald-600" />
                Median CTC Calculation &amp; Quartile Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs sm:text-sm text-slate-600 space-y-2.5 leading-relaxed">
              <p>
                Mean (average) salaries are heavily distorted by outlier packages. Consequently, PlacementConnect enforces the <strong>Median (Q2, 50th percentile)</strong> as the primary institutional benchmark.
              </p>
              <div className="p-3 bg-slate-50 rounded border border-slate-200 font-mono text-xs text-slate-800">
                Sorted Packages (N) &rarr; Median = Value at index Floor(N / 2)
              </div>
              <p>
                Reports display the 25th Percentile (Q1), Median (Q2), 75th Percentile (Q3), and Verified Highest Offer to provide complete transparency into cohort compensation spread.
              </p>
            </CardContent>
          </Card>

          {/* Protocol 6: Handling Duplicate Offers */}
          <Card className="border-slate-200 shadow-2xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-indigo-600 uppercase">Protocol 06</span>
                <Badge variant="outline" className="text-[11px] bg-slate-50">De-Duplication</Badge>
              </div>
              <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-600" />
                De-Duplication of Multiple Offers
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs sm:text-sm text-slate-600 space-y-2.5 leading-relaxed">
              <p>
                When a high-performing student receives multiple corporate offers, the institutional placement count increments by <strong>exactly one (1) placed individual</strong>.
              </p>
              <p>
                The student selects one primary accepted offer. While secondary offers are recorded in employer recruitment metrics, they are strictly quarantined from the institutional conversion numerator to prevent artificial rate inflation.
              </p>
            </CardContent>
          </Card>

          {/* Protocol 7: Withdrawn & Revoked Offers */}
          <Card className="border-slate-200 shadow-2xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-indigo-600 uppercase">Protocol 07</span>
                <Badge variant="outline" className="text-[11px] bg-slate-50">Exception Management</Badge>
              </div>
              <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-rose-600" />
                Treatment of Withdrawn or Revoked Offers
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs sm:text-sm text-slate-600 space-y-2.5 leading-relaxed">
              <p>
                If an employer revokes an offer due to business restructuring, the placement record is immediately transitioned to <code className="font-mono text-xs bg-rose-50 text-rose-700 px-1 py-0.5 rounded">OFFER_REVOKED</code> and deducted from verified institutional outcomes.
              </p>
              <p>
                If the affected student was enrolled in the assurance programme, their assurance status is reactivated and their interview quota is automatically restored without penalty.
              </p>
            </CardContent>
          </Card>

          {/* Protocol 8: Non-Seeking Students */}
          <Card className="border-slate-200 shadow-2xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-indigo-600 uppercase">Protocol 08</span>
                <Badge variant="outline" className="text-[11px] bg-slate-50">Denominator Separation</Badge>
              </div>
              <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Users className="h-4 w-4 text-slate-600" />
                Classification of Students Not Seeking Placement
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs sm:text-sm text-slate-600 space-y-2.5 leading-relaxed">
              <p>
                Students opting for higher education (GATE, CAT, GRE), family business, or civil services are classified under formal opt-out declarations.
              </p>
              <p>
                PlacementConnect maintains <strong>4 distinct denominator rates</strong> to ensure compliance with accreditation guidelines:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-xs">
                <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                  <div className="font-bold text-slate-900">1. Cohort Rate</div>
                  <div className="text-slate-500">Placed ÷ Total Batch</div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                  <div className="font-bold text-slate-900">2. Registered Rate</div>
                  <div className="text-slate-500">Placed ÷ Seeking Students</div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                  <div className="font-bold text-slate-900">3. Programme Rate</div>
                  <div className="text-slate-500">Placed ÷ Enrolled Programme</div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                  <div className="font-bold text-slate-900">4. Eligible Rate</div>
                  <div className="text-slate-500">Placed ÷ Assessment Cleared</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Protocol 9: International Offers */}
          <Card className="border-slate-200 shadow-2xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-indigo-600 uppercase">Protocol 09</span>
                <Badge variant="outline" className="text-[11px] bg-slate-50">Currency &amp; Forex</Badge>
              </div>
              <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Globe2 className="h-4 w-4 text-sky-600" />
                International Offers &amp; Forex Conversion
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs sm:text-sm text-slate-600 space-y-2.5 leading-relaxed">
              <p>
                Offers denominated in foreign currencies (USD, AED, EUR, SGD) are normalized to INR using the official Reserve Bank of India (RBI) reference exchange rate on the date of offer issuance.
              </p>
              <p>
                Profiles clearly indicate whether compensation packages are domestic or international, and purchasing-power parity (PPP) caveats are noted on executive briefings.
              </p>
            </CardContent>
          </Card>

          {/* Protocol 10: Internships vs Placements */}
          <Card className="border-slate-200 shadow-2xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-indigo-600 uppercase">Protocol 10</span>
                <Badge variant="outline" className="text-[11px] bg-slate-50">Tenure Classification</Badge>
              </div>
              <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Scale className="h-4 w-4 text-slate-600" />
                Distinction Between Internships &amp; Full-Time Placements
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs sm:text-sm text-slate-600 space-y-2.5 leading-relaxed">
              <p>
                Pre-graduation internships and training stipends are strictly separated from permanent placement records.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-700">
                <li>Pre-Placement Offers (PPOs) resulting from internships are counted <em>only</em> once a permanent full-time appointment contract is executed.</li>
                <li>Monthly internship stipends are never annualized into full-time CTC figures.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Protocol 11: Audit Trail & Historical Corrections */}
          <Card className="border-slate-200 shadow-2xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-indigo-600 uppercase">Protocol 11</span>
                <Badge variant="outline" className="text-[11px] bg-slate-50">Audit Immutability</Badge>
              </div>
              <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <History className="h-4 w-4 text-indigo-600" />
                Immutable Audit Trail &amp; Record Mutations
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs sm:text-sm text-slate-600 space-y-2.5 leading-relaxed">
              <p>
                Every modification to an institutional placement record, compensation package, or verification state is recorded in an immutable, append-only system log (<code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">AuditLog</code>).
              </p>
              <p>
                Every audit record captures: (1) Operator identity, (2) Timestamp, (3) Previous state, (4) Updated state, and (5) Evidentiary justification. No placement figure can be modified retrospectively without generating an audit trail entry.
              </p>
            </CardContent>
          </Card>

        </div>

        {/* Footer CTA */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            For methodology inquiries or verification audits, contact{' '}
            <a href="mailto:governance@placementconnect.com" className="text-[#1E40AF] underline">
              governance@placementconnect.com
            </a>
          </p>
          <Link
            href="/verify"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#1E40AF] hover:bg-blue-800 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            Verify a Candidate or Institutional Record
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

      </main>
    </div>
  )
}
