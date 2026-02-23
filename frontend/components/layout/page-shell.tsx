import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

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

function ComingSoonCard({ title }: { title: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-elevated)]/40">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)]">
        {/* Animated construction icon */}
        <div className="relative flex h-8 w-8 items-center justify-center">
          <div className="absolute h-8 w-8 animate-ping rounded-full border border-[var(--accent-green)]/20" />
          <div className="h-3 w-3 rounded-full bg-[var(--accent-green)]/60" />
        </div>
      </div>
      <h2 className="text-lg font-semibold text-[var(--text-primary)]">{title} is being built</h2>
      <p className="mt-1 max-w-xs text-center text-sm text-[var(--text-secondary)]">
        This module is under active development and will be available soon.
      </p>
      <div className="mt-6 flex gap-2">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-1.5 w-8 rounded-full bg-[var(--border)]"
            style={{
              backgroundColor: i === 0 ? 'var(--accent-green)' : 'var(--border)',
            }}
          />
        ))}
      </div>
    </div>
  );
}
