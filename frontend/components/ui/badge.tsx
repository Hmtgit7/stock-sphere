import { cn } from '@/lib/helpers';

interface BadgeProps {
  label: string;
  variant?: 'green' | 'red' | 'amber' | 'neutral';
}

export function Badge({ label, variant = 'neutral' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium',
        variant === 'green' && 'bg-green-500/10 text-[var(--accent-green)]',
        variant === 'red' && 'bg-red-500/10 text-[var(--accent-red)]',
        variant === 'amber' && 'bg-amber-500/10 text-[var(--accent-amber)]',
        variant === 'neutral' && 'bg-white/5 text-[var(--text-secondary)]'
      )}
    >
      {label}
    </span>
  );
}
