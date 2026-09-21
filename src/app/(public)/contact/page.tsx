'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1000);
  };

  return (
    <div className="bg-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Get in Touch</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Whether you&apos;re an institution looking to partner, an employer ready to hire, or a student with questions, we&apos;re here to help.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-16 max-w-5xl mx-auto">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Contact Information</h2>
            
            <div className="space-y-8">
              <div className="flex items-start">
                <MapPin className="w-6 h-6 text-indigo-600 mt-1 mr-4" />
                <div>
                  <h3 className="font-semibold text-slate-900">Headquarters</h3>
                  <p className="text-slate-600 mt-1">123 Tech Park, Innovation Way<br />Bengaluru, Karnataka 560001<br />India</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Mail className="w-6 h-6 text-indigo-600 mr-4" />
                <div>
                  <h3 className="font-semibold text-slate-900">Email</h3>
                  <p className="text-slate-600 mt-1">contact@placementconnect.com</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Phone className="w-6 h-6 text-indigo-600 mr-4" />
                <div>
                  <h3 className="font-semibold text-slate-900">Phone</h3>
                  <p className="text-slate-600 mt-1">+91 (800) 123-4567</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-slate-50 p-8 rounded-xl border border-slate-200 shadow-sm">
            {isSuccess ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Message Sent Successfully!</h3>
                <p className="text-slate-600 mb-6">Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="text-indigo-600 font-medium hover:text-indigo-800"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input required type="text" id="name" className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" placeholder="John Doe" />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                  <input required type="email" id="email" className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" placeholder="john@example.com" />
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-slate-700 mb-1">I am a...</label>
                  <select required id="type" className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white">
                    <option value="">Select an option</option>
                    <option value="college">College/Institution Representative</option>
                    <option value="employer">Employer/Recruiter</option>
                    <option value="student">Student</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                  <textarea required id="message" rows={4} className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" placeholder="How can we help you?"></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 text-white px-4 py-3 rounded-md font-medium hover:bg-indigo-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
