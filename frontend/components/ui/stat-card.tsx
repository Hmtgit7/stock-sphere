import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string;
  subValue?: string;
  isPositive?: boolean | null;
  icon?: ReactNode;
  className?: string;
}

export function StatCard({ label, value, subValue, isPositive, icon, className }: StatCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-3 sm:p-5',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-secondary)] sm:text-xs">
          {label}
        </span>
        {icon && <span className="text-[var(--text-secondary)]">{icon}</span>}
      </div>
      <p className="mt-1.5 text-lg font-semibold text-[var(--text-primary)] sm:mt-2 sm:text-2xl">
        {value}
      </p>
      {subValue && (
        <p
          className={cn(
            'mt-0.5 text-xs font-medium sm:mt-1 sm:text-sm',
            isPositive === null || isPositive === undefined
              ? 'text-[var(--text-secondary)]'
              : isPositive
                ? 'text-[var(--accent-green)]'
                : 'text-[var(--accent-red)]'
          )}
        >
          {subValue}
        </p>
      )}
    </div>
  );
}
