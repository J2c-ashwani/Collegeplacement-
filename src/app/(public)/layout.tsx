'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { COMPANY_IDENTITY } from '@/config/company-identity';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      {/* Quiet Institutional Network Utility Bar */}
      <div className="bg-[#0F172A] text-slate-300 border-b border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
            <span className="text-slate-200 font-medium">
              PlacementConnect Institutional Network
            </span>
            <span className="hidden md:inline text-slate-500">—</span>
            <span className="hidden md:inline text-slate-400">
              Campus Placement Operations, Graduate Evaluation &amp; Verified Hiring
            </span>
          </div>
          <div className="flex items-center gap-5 shrink-0">
            <Link
              href="/verify"
              className="text-emerald-300 hover:text-white flex items-center gap-1 font-medium transition-colors"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Verify a Candidate Credential &rarr;
            </Link>
            <Link
              href="/security"
              className="hidden sm:inline text-slate-300 hover:text-white transition-colors"
            >
              Security &amp; Privacy
            </Link>
          </div>
        </div>
      </div>

      {/* Main Sticky Header (lg:flex breakpoint prevents 768px tablet header collisions) */}
      {/* Main Sticky Header */}
      <header className="sticky top-0 w-full bg-white/98 backdrop-blur-md border-b border-slate-200/90 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="h-9 w-9 rounded-md bg-[#1E40AF] text-white flex items-center justify-center font-bold text-base tracking-tight shadow-2xs">
                  <ShieldCheck className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="text-base font-bold tracking-tight text-slate-900 block leading-tight">
                    PlacementConnect
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">
                    Campus Placement Infrastructure
                  </span>
                </div>
              </Link>
            </div>

            <nav className="hidden lg:flex items-center space-x-6 text-xs font-semibold">
              <Link
                href="/for-colleges"
                className="text-slate-600 hover:text-[#1E40AF] transition-colors"
              >
                For Colleges
              </Link>
              <Link
                href="/for-employers"
                className="text-slate-600 hover:text-[#1E40AF] transition-colors"
              >
                For Employers
              </Link>
              <Link
                href="/for-students"
                className="text-slate-600 hover:text-[#1E40AF] transition-colors"
              >
                For Students
              </Link>
              <Link
                href="/placement-assurance"
                className="text-slate-600 hover:text-[#1E40AF] transition-colors"
              >
                Placement Assurance
              </Link>
              <Link
                href="/verification-methodology"
                className="text-slate-600 hover:text-[#1E40AF] transition-colors"
              >
                Methodology
              </Link>
              <Link
                href="/pricing"
                className="text-slate-600 hover:text-[#1E40AF] transition-colors"
              >
                Pricing
              </Link>
            </nav>

            <div className="hidden lg:flex items-center space-x-3">
              <Link
                href="/login"
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-2.5 py-1.5 transition-colors"
              >
                Portal Sign In
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#1E40AF] hover:bg-blue-900 text-white px-3.5 py-2 rounded-md shadow-2xs transition-colors"
              >
                Request Walkthrough
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="lg:hidden flex items-center gap-2">
              <Link
                href="/login"
                className="text-xs font-semibold text-slate-700 px-2.5 py-1.5 rounded border border-slate-200 bg-slate-50"
              >
                Sign In
              </Link>
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={isMenuOpen}
                className="p-2 rounded-md text-slate-700 hover:text-[#1E40AF] hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-700"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Tablet & Mobile Navigation Drawer */}
        {/* Tablet & Mobile Navigation Drawer */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-200 shadow-xl">
            <div className="px-5 pt-4 pb-6 space-y-4">
              <div className="space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3">
                  Campus Hiring Portals
                </div>
                <Link
                  href="/for-colleges"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 text-sm text-slate-900 hover:bg-slate-50 rounded-md font-semibold"
                >
                  For Colleges &amp; TPOs
                </Link>
                <Link
                  href="/for-employers"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 text-sm text-slate-900 hover:bg-slate-50 rounded-md font-semibold"
                >
                  For Corporate Employers
                </Link>
                <Link
                  href="/for-students"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 text-sm text-slate-900 hover:bg-slate-50 rounded-md font-semibold"
                >
                  For Graduating Students
                </Link>
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-100">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3">
                  Governance &amp; Trust
                </div>
                <Link
                  href="/placement-assurance"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md font-medium"
                >
                  Progressive Interview Assurance
                </Link>
                <Link
                  href="/verification-methodology"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md font-medium"
                >
                  Verification Methodology
                </Link>
                <Link
                  href="/pricing"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md font-medium"
                >
                  Pricing Schedule
                </Link>
                <Link
                  href="/verify"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 text-sm text-emerald-800 bg-emerald-50/70 rounded-md font-semibold"
                >
                  Verify a Credential
                </Link>
              </div>

              <div className="pt-3 border-t border-slate-200 space-y-2">
                <Link
                  href="/contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-center py-2.5 px-4 text-xs font-semibold text-white bg-[#1E40AF] hover:bg-blue-900 rounded-md shadow-2xs"
                >
                  Request Institutional Walkthrough
                </Link>
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-center py-2 px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md"
                >
                  Portal Sign In
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">{children}</main>

      {/* Editorial Institutional Footer */}
      <footer className="bg-[#0F172A] text-slate-300 border-t border-slate-800 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-[4px] bg-[#1E40AF] text-white flex items-center justify-center font-mono font-bold text-xs">
                  PC
                </div>
                <span className="text-lg font-bold text-white tracking-tight">
                  {COMPANY_IDENTITY.brandName}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-md">
                {COMPANY_IDENTITY.operatingModelDisclosure}
              </p>
              <p className="text-[11px] text-slate-500 leading-relaxed max-w-md">
                {COMPANY_IDENTITY.pilotTransparencyNote}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3.5">
                Platform
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li>
                  <Link href="/for-colleges" className="hover:text-white transition">
                    For Colleges &amp; TPOs
                  </Link>
                </li>
                <li>
                  <Link href="/for-employers" className="hover:text-white transition">
                    For Corporate Employers
                  </Link>
                </li>
                <li>
                  <Link href="/for-students" className="hover:text-white transition">
                    For Graduating Students
                  </Link>
                </li>
                <li>
                  <Link href="/placement-assurance" className="hover:text-white transition">
                    Progressive Interview Assurance
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white transition">
                    Pricing (INR)
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3.5">
                Trust &amp; Verification
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li>
                  <Link
                    href="/verify"
                    className="text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1"
                  >
                    Verify a Credential
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </li>
                <li>
                  <Link href="/verification-methodology" className="hover:text-white transition">
                    Verification Methodology
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="hover:text-white transition">
                    Security &amp; Data Isolation
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white transition">
                    About PlacementConnect
                  </Link>
                </li>
                <li>
                  <Link href="/faqs" className="hover:text-white transition">
                    Frequently Asked Questions
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition">
                    Contact &amp; Partnerships
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3.5">
                Governance &amp; Legal
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li>
                  <Link href="/privacy" className="hover:text-white transition">
                    Privacy &amp; DPDP Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/refund-policy" className="hover:text-white transition">
                    Refund &amp; Assurance Policy
                  </Link>
                </li>
                <li className="pt-2 border-t border-slate-800/80">
                  <span className="block text-[11px] text-slate-500">
                    Institutional Partnerships
                  </span>
                  <a
                    href={`mailto:${COMPANY_IDENTITY.desks.institutionalPartnerships.email}`}
                    className="font-mono text-slate-300 hover:text-white"
                  >
                    {COMPANY_IDENTITY.desks.institutionalPartnerships.email}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <p>
              &copy; 2026 {COMPANY_IDENTITY.legalUnitName}. All rights reserved.
            </p>
            <div className="text-slate-500">
              {COMPANY_IDENTITY.jurisdiction}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
