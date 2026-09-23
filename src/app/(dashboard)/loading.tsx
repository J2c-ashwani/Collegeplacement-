import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardLoading() {
  return (
    <div className="flex flex-col space-y-8 p-8">
      {/* Page Header Skeleton */}
      <div className="space-y-3">
        {/* Breadcrumbs */}
        <Skeleton className="h-4 w-48" />
        {/* Title */}
        <Skeleton className="h-8 w-64" />
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-md border border-slate-200 bg-white p-6 shadow-2xs">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>
            <div className="mt-4 space-y-2">
              <Skeleton className="h-7 w-20" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>
      
      {/* Main Content Area Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Skeleton className="col-span-4 h-[400px] rounded-md border border-slate-200 bg-white shadow-2xs" />
        <Skeleton className="col-span-3 h-[400px] rounded-md border border-slate-200 bg-white shadow-2xs" />
      </div>
    </div>
  );
}
