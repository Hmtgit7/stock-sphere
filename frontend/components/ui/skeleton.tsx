import { cn } from '@/lib/helpers';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('animate-pulse rounded-md bg-white/[0.06]', className)} {...props} />;
}
