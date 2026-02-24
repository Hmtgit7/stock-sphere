'use client';

import { usePortfolioContext } from '@/context/portfolio-context';
import { DashboardHeader } from './header';
import { StatsBar } from './stats-bar';
import { SectorGroups } from '@/components/portfolio/sector-groups';
import { ExitedPositions } from '@/components/portfolio/exited-positions';
import { ErrorBanner } from '@/components/ui/error-banner';
import { DashboardSkeleton } from './dashboard-skeleton';
import { Skeleton } from '@/components/ui/skeleton';
import { Info } from 'lucide-react';
import dynamic from 'next/dynamic';

const PortfolioBreakdown = dynamic(
  () => import('@/components/charts/portfolio-breakdown').then((m) => m.PortfolioBreakdown),
  { loading: () => <Skeleton className="h-[310px] w-full rounded-xl" />, ssr: false }
);

const GainLossBar = dynamic(
  () => import('@/components/charts/gainloss-bar').then((m) => m.GainLossBar),
  { loading: () => <Skeleton className="h-[310px] w-full rounded-xl" />, ssr: false }
);

export function Dashboard() {
  const { data, isLoading, isRefreshing, error, lastUpdated, refresh } = usePortfolioContext();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-[1400px] px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:gap-6">
          <DashboardHeader
            isRefreshing={isRefreshing}
            lastUpdated={lastUpdated}
            onRefresh={refresh}
          />

          {error && <ErrorBanner message={error} />}

          {data && (
            <>
              <StatsBar data={data} />

              {data.sectors.length > 0 && (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <PortfolioBreakdown sectors={data.sectors} />
                  <GainLossBar sectors={data.sectors} />
                </div>
              )}

              <div>
                <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-[var(--text-secondary)]">
                  Holdings by Sector
                </h2>
                <SectorGroups sectors={data.sectors} />
              </div>

              {data.soldHoldings?.length > 0 && (
                <div>
                  <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-[var(--text-secondary)]">
                    Exited Positions
                  </h2>
                  <ExitedPositions soldHoldings={data.soldHoldings} />
                </div>
              )}

              <div className="flex items-start gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--accent-amber)]" />
                <p className="text-xs text-[var(--text-secondary)]">{data.dataDisclaimer}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
