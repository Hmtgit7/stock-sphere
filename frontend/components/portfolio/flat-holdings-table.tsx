'use client';

import { usePortfolioContext } from '@/context/portfolio-context';
import { PortfolioTable } from './portfolio-table';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorBanner } from '@/components/ui/error-banner';

export function FlatHoldingsTable() {
  // Consumes the shared PortfolioContext — no duplicate API call
  const { data, isLoading, error } = usePortfolioContext();

  if (isLoading)
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4">
        <Skeleton className="mb-4 h-3.5 w-48" />
        <div className="flex flex-col gap-0 divide-y divide-[var(--border)]">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-3">
              <Skeleton className="h-7 w-7 rounded-full" />
              <div className="flex flex-1 items-center justify-between gap-4">
                <div>
                  <Skeleton className="mb-1.5 h-3.5 w-16 sm:w-20" />
                  <Skeleton className="h-3 w-24 sm:w-32" />
                </div>
                <Skeleton className="h-4 w-20 sm:w-24" />
                <Skeleton className="hidden h-4 w-20 sm:block" />
                <Skeleton className="hidden h-4 w-16 sm:block" />
                <Skeleton className="hidden h-4 w-16 sm:block" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  if (error) return <ErrorBanner message={error} />;
  if (!data) return null;

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4">
      <p className="mb-3 text-xs text-[var(--text-secondary)]">
        {data.holdings.length} positions · Sorted by portfolio weight
      </p>
      <PortfolioTable holdings={data.holdings} />
    </div>
  );
}
