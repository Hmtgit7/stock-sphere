'use client';

import { memo } from 'react';
import { useLiveClock } from './hooks/use-live-clock';
import { RefreshCw } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

interface HeaderProps {
  isRefreshing: boolean;
  lastUpdated: Date | null;
  onRefresh: () => void;
}

export const DashboardHeader = memo(function DashboardHeader({
  isRefreshing,
  lastUpdated,
  onRefresh,
}: HeaderProps) {
  const now = useLiveClock();

  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)] sm:text-2xl">
          Stock Sphere
        </h1>
        <p className="mt-0.5 text-xs text-[var(--text-secondary)] sm:text-sm">
          Portfolio Dashboard · Live Market Data
        </p>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="text-right">
          <p className="font-mono text-xs text-[var(--text-primary)] sm:text-sm">
            {now.toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}
          </p>
          {lastUpdated && (
            <p className="hidden text-xs text-[var(--text-secondary)] sm:block">
              Updated{' '}
              {lastUpdated.toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface-elevated)] px-2.5 py-1.5 sm:px-3">
          <span
            className={cn(
              'h-2 w-2 rounded-full shrink-0',
              isRefreshing ? 'animate-pulse bg-[var(--accent-amber)]' : 'bg-[var(--accent-green)]'
            )}
          />
          <span className="text-xs text-[var(--text-secondary)]">
            {isRefreshing ? 'Updating' : 'Live'}
          </span>
        </div>

        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] disabled:opacity-50"
          title="Refresh now"
        >
          {isRefreshing ? <Spinner className="h-4 w-4" /> : <RefreshCw className="h-4 w-4" />}
        </button>
      </div>
    </header>
  );
});
