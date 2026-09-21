import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - PlacementConnect',
  description: 'Privacy policy and data handling practices for PlacementConnect.',
};

export default function PrivacyPage() {
  return (
    <div className="bg-white py-16 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-8">Privacy Policy</h1>
        <div className="prose prose-slate max-w-none">
          <p className="text-sm text-slate-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">1. Information We Collect</h2>
          <p className="text-slate-700 mb-4">
            We collect information you provide directly to us, including but not limited to your name, email address, phone number, educational history, assessment scores, and employment history. We also automatically collect certain technical information when you use our Platform.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">2. How We Use Your Information</h2>
          <p className="text-slate-700 mb-4">
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 mb-6 text-slate-700">
            <li>Provide, maintain, and improve our services</li>
            <li>Match students with relevant employment opportunities</li>
            <li>Facilitate communication between institutions, students, and employers</li>
            <li>Generate analytics and reports for partner institutions</li>
            <li>Ensure the security and integrity of our platform</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">3. Information Sharing</h2>
          <p className="text-slate-700 mb-4">
            Student profiles (including academic records and assessment scores) are shared with verified employer partners only when the student applies for a job or opts into our recruitment pool. We do not sell your personal data to third-party marketers.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">4. Data Security</h2>
          <p className="text-slate-700 mb-4">
            We implement appropriate technical and organizational security measures to protect your personal information against accidental or unlawful destruction, loss, alteration, or unauthorized disclosure.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">5. Your Rights</h2>
          <p className="text-slate-700 mb-4">
            Depending on your location, you may have the right to access, correct, or delete your personal data. Students can manage their data visibility preferences through their dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
