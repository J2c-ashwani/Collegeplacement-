'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-md flex-col items-center justify-center space-y-6 text-center">
        <div className="flex items-center space-x-2 text-[#0F2744]">
          <GraduationCap className="h-8 w-8" />
          <span className="text-xl font-bold tracking-tight">PlacementConnect</span>
        </div>
        
        <div className="w-full rounded-md border border-slate-200 bg-white p-8 shadow-2xs">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          
          <h2 className="mb-2 text-xl font-semibold tracking-tight text-slate-900">
            Something went wrong
          </h2>
          
          <p className="mb-6 text-sm text-slate-500">
            We encountered an unexpected issue while processing your request. Our team has been notified.
          </p>
          
          <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0 sm:justify-center">
            <Button 
              onClick={() => reset()}
              className="bg-[#1E40AF] text-white hover:bg-[#1E40AF]/90"
            >
              Try Again
            </Button>
            <Link href="/login">
              <Button variant="outline">
                Return to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
