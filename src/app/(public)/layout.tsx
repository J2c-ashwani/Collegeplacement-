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
      {/* Unified Enterprise Header Container */}
      <header className="sticky top-0 w-full z-50">
        {/* Quiet Institutional Network Utility Bar */}
        <div className="bg-[#0F172A] text-slate-300 border-b border-slate-800 text-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-8 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 min-w-0">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
              <span className="font-medium text-slate-200 truncate">
                PlacementConnect Institutional Network
              </span>
            </div>
            <div className="flex items-center gap-4 sm:gap-6 shrink-0 text-slate-300">
              <Link
                href="/verify"
                className="text-emerald-300 hover:text-white flex items-center gap-1 font-medium transition-colors"
              >
                <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                <span className="hidden sm:inline">Verify a Candidate Credential &rarr;</span>
                <span className="sm:hidden">Verify Credential &rarr;</span>
              </Link>
              <Link
                href="/security"
                className="hidden md:inline hover:text-white transition-colors"
              >
                Security &amp; Privacy
              </Link>
            </div>
          </div>
        </div>

        {/* Main Sticky Navbar (3-Zone Enterprise Layout) */}
        <div className="bg-white/98 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Desktop 3-Zone Navigation (≥1024px) */}
            <div className="hidden lg:grid lg:grid-cols-[auto_1fr_auto] items-center h-16 gap-3 xl:gap-6">
              {/* Zone 1: Compact Brand */}
              <div className="flex items-center shrink-0">
                <Link href="/" className="flex items-center gap-2.5 group">
                  <div className="h-8 w-8 rounded-md bg-[#1E40AF] text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-2xs group-hover:bg-blue-900 transition-colors shrink-0">
                    <ShieldCheck className="h-4.5 w-4.5 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[15px] font-bold tracking-tight text-slate-900 leading-tight group-hover:text-[#1E40AF] transition-colors whitespace-nowrap">
                      PlacementConnect
                    </span>
                    <span className="text-[9.5px] font-semibold uppercase tracking-wider text-slate-500 leading-none mt-0.5 whitespace-nowrap">
                      Placement Platform
                    </span>
                  </div>
                </Link>
              </div>

              {/* Zone 2: Primary Navigation (Centered, single line, no wrapping) */}
              <nav className="flex items-center justify-center gap-3.5 xl:gap-6 px-1 min-w-0">
                <Link
                  href="/for-colleges"
                  className="text-[13px] xl:text-sm font-medium text-slate-600 hover:text-[#1E40AF] whitespace-nowrap transition-colors"
                >
                  For Colleges
                </Link>
                <Link
                  href="/for-employers"
                  className="text-[13px] xl:text-sm font-medium text-slate-600 hover:text-[#1E40AF] whitespace-nowrap transition-colors"
                >
                  For Employers
                </Link>
                <Link
                  href="/for-students"
                  className="text-[13px] xl:text-sm font-medium text-slate-600 hover:text-[#1E40AF] whitespace-nowrap transition-colors"
                >
                  For Students
                </Link>
                <Link
                  href="/placement-assurance"
                  className="text-[13px] xl:text-sm font-medium text-slate-600 hover:text-[#1E40AF] whitespace-nowrap transition-colors"
                >
                  Assurance
                </Link>
                <Link
                  href="/pricing"
                  className="text-[13px] xl:text-sm font-medium text-slate-600 hover:text-[#1E40AF] whitespace-nowrap transition-colors"
                >
                  Pricing
                </Link>
                <Link
                  href="/about"
                  className="text-[13px] xl:text-sm font-medium text-slate-600 hover:text-[#1E40AF] whitespace-nowrap transition-colors"
                >
                  About
                </Link>
              </nav>

              {/* Zone 3: Account + CTAs (3-tier hierarchy, single line, no wrapping) */}
              <div className="flex items-center justify-end shrink-0 gap-2 xl:gap-3">
                {/* 1. Utility: Simple text link */}
                <Link
                  href="/login"
                  className="text-xs xl:text-sm font-medium text-slate-600 hover:text-slate-900 px-2 py-1.5 whitespace-nowrap transition-colors"
                >
                  Sign In
                </Link>

                {/* 2. Secondary CTA: Outlined */}
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center text-xs font-semibold border border-blue-600/30 text-[#1E40AF] bg-blue-50/40 hover:bg-blue-100/60 h-9 px-3 xl:px-3.5 rounded-md whitespace-nowrap transition-colors"
                >
                  Request Partnership
                </Link>

                {/* 3. Primary CTA: Solid Brand */}
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center text-xs font-semibold bg-[#1E40AF] hover:bg-blue-900 text-white h-9 px-3.5 xl:px-4 rounded-md shadow-2xs whitespace-nowrap transition-colors"
                >
                  Get Started
                </Link>
              </div>
            </div>

            {/* Tablet & Mobile Header Bar (< 1024px) */}
            <div className="lg:hidden flex items-center justify-between h-16">
              <div className="flex items-center shrink-0">
                <Link href="/" className="flex items-center gap-2.5 group">
                  <div className="h-8 w-8 rounded-md bg-[#1E40AF] text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-2xs shrink-0">
                    <ShieldCheck className="h-4.5 w-4.5 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[15px] font-bold tracking-tight text-slate-900 leading-tight whitespace-nowrap">
                      PlacementConnect
                    </span>
                    <span className="text-[9.5px] font-semibold uppercase tracking-wider text-slate-500 leading-none mt-0.5 whitespace-nowrap">
                      Placement Platform
                    </span>
                  </div>
                </Link>
              </div>

              <div className="flex items-center gap-2.5">
                <Link
                  href="/register"
                  className="text-xs font-semibold text-white bg-[#1E40AF] hover:bg-blue-900 px-3 py-1.5 rounded-md shadow-2xs whitespace-nowrap transition-colors"
                >
                  Get Started
                </Link>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                  aria-expanded={isMenuOpen}
                  className="p-1.5 rounded-md text-slate-700 hover:text-[#1E40AF] hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-700 transition-colors"
                >
                  {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Tablet & Mobile Navigation Drawer */}
          {isMenuOpen && (
            <div className="lg:hidden bg-white border-t border-slate-200 shadow-xl max-h-[calc(100vh-100px)] overflow-y-auto">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 space-y-5">
                <div className="space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 pb-1">
                    Institutional Portals
                  </div>
                  <Link
                    href="/for-colleges"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 text-sm text-slate-900 hover:bg-slate-50 hover:text-[#1E40AF] rounded-md font-semibold transition-colors"
                  >
                    For Colleges &amp; TPOs
                  </Link>
                  <Link
                    href="/for-employers"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 text-sm text-slate-900 hover:bg-slate-50 hover:text-[#1E40AF] rounded-md font-semibold transition-colors"
                  >
                    For Corporate Employers
                  </Link>
                  <Link
                    href="/for-students"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 text-sm text-slate-900 hover:bg-slate-50 hover:text-[#1E40AF] rounded-md font-semibold transition-colors"
                  >
                    For Graduating Students
                  </Link>
                </div>

                <div className="space-y-1 pt-3 border-t border-slate-100">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 pb-1">
                    Governance &amp; Platform
                  </div>
                  <Link
                    href="/placement-assurance"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#1E40AF] rounded-md font-medium transition-colors"
                  >
                    Progressive Interview Assurance
                  </Link>
                  <Link
                    href="/pricing"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#1E40AF] rounded-md font-medium transition-colors"
                  >
                    Pricing Schedule
                  </Link>
                  <Link
                    href="/about"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#1E40AF] rounded-md font-medium transition-colors"
                  >
                    About PlacementConnect
                  </Link>
                  <Link
                    href="/verify"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 text-sm text-emerald-800 bg-emerald-50/70 hover:bg-emerald-100/70 rounded-md font-semibold transition-colors"
                  >
                    Verify Candidate Credential &rarr;
                  </Link>
                  <Link
                    href="/security"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#1E40AF] rounded-md font-medium transition-colors"
                  >
                    Security &amp; Privacy
                  </Link>
                </div>

                <div className="pt-3 border-t border-slate-200 space-y-2">
                  <Link
                    href="/contact"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-center py-2.5 px-4 text-xs font-semibold text-[#1E40AF] bg-blue-50/70 hover:bg-blue-100/70 border border-blue-600/30 rounded-md transition-colors"
                  >
                    Request Partnership
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-center py-2 px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
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
