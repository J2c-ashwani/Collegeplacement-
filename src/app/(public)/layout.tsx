'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <header className="fixed top-0 w-full bg-white border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-indigo-600">
                PlacementConnect
              </Link>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <Link href="/for-colleges" className="text-slate-600 hover:text-indigo-600 font-medium">For Colleges</Link>
              <Link href="/for-students" className="text-slate-600 hover:text-indigo-600 font-medium">For Students</Link>
              <Link href="/for-employers" className="text-slate-600 hover:text-indigo-600 font-medium">For Employers</Link>
              <Link href="/placement-assurance" className="text-slate-600 hover:text-indigo-600 font-medium">Placement Assurance</Link>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">Login</Link>
              <Link href="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 transition">Register</Link>
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-slate-600 hover:text-indigo-600 focus:outline-none"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="/for-colleges" className="block px-3 py-2 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-md font-medium">For Colleges</Link>
              <Link href="/for-students" className="block px-3 py-2 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-md font-medium">For Students</Link>
              <Link href="/for-employers" className="block px-3 py-2 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-md font-medium">For Employers</Link>
              <Link href="/placement-assurance" className="block px-3 py-2 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-md font-medium">Placement Assurance</Link>
              <Link href="/login" className="block px-3 py-2 text-indigo-600 hover:bg-indigo-50 rounded-md font-medium">Login</Link>
              <Link href="/register" className="block px-3 py-2 bg-indigo-600 text-white rounded-md font-medium">Register</Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow pt-16">
        {children}
      </main>

      <footer className="bg-slate-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <span className="text-2xl font-bold text-indigo-400 mb-4 block">PlacementConnect</span>
              <p className="text-slate-400 text-sm">
                Your reliable partner in building career readiness and connecting top fresher talent with leading employers.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-slate-200">Solutions</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/for-colleges" className="hover:text-white transition">For Colleges</Link></li>
                <li><Link href="/for-students" className="hover:text-white transition">For Students</Link></li>
                <li><Link href="/for-employers" className="hover:text-white transition">For Employers</Link></li>
                <li><Link href="/placement-assurance" className="hover:text-white transition">Placement Assurance</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-slate-200">Company</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
                <li><Link href="/faqs" className="hover:text-white transition">FAQs</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-slate-200">Legal</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
            <p>&copy; {new Date().getFullYear()} PlacementConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
