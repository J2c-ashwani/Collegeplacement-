import Link from 'next/link';
import { FileQuestion, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-md flex-col items-center justify-center space-y-6 text-center">
        <div className="flex items-center space-x-2 text-[#0F2744]">
          <GraduationCap className="h-8 w-8" />
          <span className="text-xl font-bold tracking-tight">PlacementConnect</span>
        </div>
        
        <div className="w-full rounded-md border border-slate-200 bg-white p-8 shadow-2xs">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <FileQuestion className="h-6 w-6 text-slate-600" />
          </div>
          
          <h2 className="mb-2 text-xl font-semibold tracking-tight text-slate-900">
            Page not found
          </h2>
          
          <p className="mb-6 text-sm text-slate-500">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0 sm:justify-center">
            <Link href="/">
              <Button className="bg-[#1E40AF] text-white hover:bg-[#1E40AF]/90">
                Return Home
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
