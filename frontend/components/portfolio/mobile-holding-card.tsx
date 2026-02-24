import { Badge } from '@/components/ui/badge';
import { formatCurrency, gainLossClass, cn } from '@/lib/utils';
import type { EnrichedHolding } from '@/types/portfolio';

interface MobileHoldingCardProps {
  holding: EnrichedHolding;
  idx: number;
}
export function MobileHoldingCard({ holding, idx }: MobileHoldingCardProps) {
  const isPos = (holding.gainLoss ?? 0) >= 0;

  return (
    <div
      className={cn(
        'rounded-xl border border-[var(--border)] p-3',
        idx % 2 === 0 ? 'bg-[var(--surface)]' : 'bg-[var(--surface-elevated)]'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-semibold text-[var(--text-primary)]">{holding.particulars}</p>
          <p className="text-xs text-[var(--text-secondary)]">{holding.ticker}</p>
          {holding.stage2 && (
            <span className="inline-flex items-center gap-1 text-[10px] text-[var(--accent-green)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-green)]" />
              Buy Signal
            </span>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <Badge label={holding.exchange} variant="neutral" />
          <span className="text-xs text-[var(--text-secondary)]">
            {holding.portfolioPct.toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="mt-2.5 grid grid-cols-3 gap-2 text-xs">
        <div>
          <p className="text-[var(--text-secondary)]">Invested</p>
          <p className="font-medium text-[var(--text-primary)]">
            {formatCurrency(holding.investment)}
          </p>
        </div>
        <div>
          <p className="text-[var(--text-secondary)]">CMP</p>
          <div className="flex items-center gap-0.5">
            <p className="font-mono font-medium text-[var(--text-primary)]">
              {formatCurrency(holding.cmp)}
            </p>
            {holding.isFallbackPrice && (
              <span
                className="text-[10px] text-[var(--accent-amber)]"
                title="Static fallback price — live data unavailable"
              >
                ~
              </span>
            )}
          </div>
        </div>
        <div>
          <p className="text-[var(--text-secondary)]">Value</p>
          <p className="font-mono font-medium text-[var(--text-primary)]">
            {formatCurrency(holding.presentValue)}
          </p>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="flex-1">
          <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className={cn(
                'h-full rounded-full',
                isPos ? 'bg-[var(--accent-green)]' : 'bg-[var(--accent-red)]'
              )}
              style={{ width: `${Math.min(Math.abs(holding.portfolioPct ?? 0), 100)}%` }}
            />
          </div>
        </div>
        <div className={cn('text-right text-xs font-semibold', gainLossClass(holding.gainLoss))}>
          <span>
            {holding.gainLoss !== null
              ? (isPos ? '+' : '') + formatCurrency(holding.gainLoss)
              : '—'}
          </span>
          {holding.gainLossPct !== null && (
            <span className="ml-1 opacity-75">({holding.gainLossPct.toFixed(1)}%)</span>
          )}
        </div>
      </div>
    </div>
  );
}
