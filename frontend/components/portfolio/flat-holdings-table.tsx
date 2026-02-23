'use client';

import { usePortfolio } from '@/hooks/use-portfolio';
import { PortfolioTable } from './portfolio-table';
import { Spinner } from '@/components/ui/spinner';
import { ErrorBanner } from '@/components/ui/error-banner';

export function FlatHoldingsTable() {
  const { data, isLoading, error } = usePortfolio();

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <Spinner className="h-8 w-8" />
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
