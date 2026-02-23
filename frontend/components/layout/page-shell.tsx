import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ComingSoonCard } from './coming-soon-card';

interface PageShellProps {
  icon: LucideIcon;
  title: string;
  description: string;
  badge?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageShell({
  icon: Icon,
  title,
  description,
  badge = 'Coming Soon',
  children,
  className,
}: PageShellProps) {
  return (
    <div className={cn('mx-auto max-w-[1400px] px-3 py-5 sm:px-6 sm:py-8 lg:px-8', className)}>
      {/* Page header */}
      <div className="mb-5 flex items-center gap-3 sm:mb-8 sm:gap-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] sm:h-10 sm:w-10">
          <Icon className="h-4 w-4 text-[var(--accent-green)] sm:h-5 sm:w-5" />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-lg font-semibold text-[var(--text-primary)] sm:text-xl">{title}</h1>
            {badge && (
              <span className="rounded-full border border-[var(--accent-amber)]/30 bg-[var(--accent-amber)]/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[var(--accent-amber)]">
                {badge}
              </span>
            )}
          </div>
          <p className="truncate text-xs text-[var(--text-secondary)] sm:text-sm">{description}</p>
        </div>
      </div>

      {children ?? <ComingSoonCard title={title} />}
    </div>
  );
}
