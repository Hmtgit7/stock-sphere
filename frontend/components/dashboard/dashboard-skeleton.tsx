import { Skeleton } from '@/components/ui/skeleton';

// ── Stat card skeleton ─────────────────────────────────────────────────────
function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-3 sm:p-5">
      <div className="flex items-start justify-between">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-4 w-4 rounded-sm" />
      </div>
      <Skeleton className="mt-3 h-7 w-28 sm:h-8" />
      <Skeleton className="mt-1.5 h-3 w-16" />
    </div>
  );
}

// ── Chart card skeleton ────────────────────────────────────────────────────
function ChartSkeleton() {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4 sm:p-5">
      <Skeleton className="mb-4 h-4 w-32" />
      <Skeleton className="h-48 w-full rounded-lg sm:h-56" />
    </div>
  );
}

// ── Sector group row skeleton ──────────────────────────────────────────────
function SectorRowSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)]">
      {/* header row */}
      <div className="flex items-center justify-between bg-[var(--surface-elevated)] px-3 py-3 sm:px-5 sm:py-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <Skeleton className="h-4 w-4 rounded-sm" />
          <Skeleton className="h-4 w-28 sm:w-36" />
          <Skeleton className="h-3 w-12" />
        </div>
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="text-right">
            <Skeleton className="mb-1 h-2.5 w-8" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="hidden text-right sm:block">
            <Skeleton className="mb-1 h-2.5 w-14" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="hidden text-right sm:block">
            <Skeleton className="mb-1 h-2.5 w-10" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>
      {/* table row shimmer */}
      <div className="divide-y divide-[var(--border)] px-3 sm:px-5">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 py-3">
            <Skeleton className="h-7 w-7 rounded-full" />
            <div className="flex flex-1 justify-between gap-4">
              <div>
                <Skeleton className="mb-1.5 h-3.5 w-16 sm:w-20" />
                <Skeleton className="h-3 w-24 sm:w-32" />
              </div>
              <Skeleton className="h-4 w-20 sm:w-24" />
              <Skeleton className="hidden h-4 w-20 sm:block" />
              <Skeleton className="hidden h-4 w-16 sm:block" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Full dashboard skeleton ────────────────────────────────────────────────
export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-[1400px] px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:gap-6">
          {/* Header */}
          <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Skeleton className="h-7 w-36 sm:h-8 sm:w-44" />
              <Skeleton className="mt-1.5 h-3.5 w-52" />
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-8 w-24 rounded-lg" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
          </header>

          {/* Stats bar — 2 cols → 3 → 5 */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-5">
            {[...Array(5)].map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <ChartSkeleton />
            <ChartSkeleton />
          </div>

          {/* Section heading */}
          <div>
            <Skeleton className="mb-3 h-3.5 w-40" />
            <div className="flex flex-col gap-4">
              {[...Array(3)].map((_, i) => (
                <SectorRowSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
