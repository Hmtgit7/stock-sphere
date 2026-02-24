'use client';

import { useState, memo } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { SoldHolding } from '@/types/portfolio';
import { cn, gainLossClass } from '@/lib/helpers';
import { formatCurrency } from '@/lib/formatters';

interface ExitedPositionsProps {
  soldHoldings: SoldHolding[];
}

export const ExitedPositions = memo(function ExitedPositions({
  soldHoldings,
}: ExitedPositionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const totalRealizedPnL = soldHoldings.reduce((sum, h) => sum + h.realizedPnL, 0);
  const isPositive = totalRealizedPnL >= 0;

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)]">
      {/* Header */}
      <button
        onClick={() => setIsOpen((p) => !p)}
        className="flex w-full items-center justify-between bg-[var(--surface-elevated)] px-3 py-3 transition-colors hover:bg-white/[0.03] sm:px-5 sm:py-4"
      >
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          {isOpen ? (
            <ChevronDown className="h-4 w-4 shrink-0 text-[var(--text-secondary)]" />
          ) : (
            <ChevronRight className="h-4 w-4 shrink-0 text-[var(--text-secondary)]" />
          )}
          <span className="font-semibold text-[var(--text-primary)]">Exited Positions</span>
          <span className="shrink-0 text-xs text-[var(--text-secondary)]">
            {soldHoldings.length} stocks
          </span>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-[var(--text-secondary)] sm:text-xs">Realised P&amp;L</p>
          <p className={cn('text-xs font-semibold sm:text-sm', gainLossClass(totalRealizedPnL))}>
            {isPositive ? '+' : ''}
            {formatCurrency(totalRealizedPnL)}
          </p>
        </div>
      </button>

      {isOpen && (
        <div className="p-2 sm:p-4">
          {/* Desktop table */}
          <div className="hidden overflow-x-auto rounded-xl border border-[var(--border)] sm:block">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--surface)]">
                  {[
                    'Stock',
                    'Sector',
                    'Buy Price',
                    'Qty',
                    'Invested',
                    'Sold At',
                    'Sale Value',
                    'Realised P&L',
                    'Return %',
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {soldHoldings.map((h, idx) => (
                  <tr
                    key={h.id}
                    className={cn(
                      'border-b border-[var(--border)] transition-colors hover:bg-white/[0.02]',
                      idx % 2 === 0 ? 'bg-[var(--surface)]' : 'bg-[var(--surface-elevated)]'
                    )}
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-[var(--text-primary)]">{h.particulars}</p>
                      <p className="text-xs text-[var(--text-secondary)]">{h.ticker}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{h.sector}</td>
                    <td className="px-4 py-3">{formatCurrency(h.purchasePrice)}</td>
                    <td className="px-4 py-3">{h.quantity}</td>
                    <td className="px-4 py-3">{formatCurrency(h.investment)}</td>
                    <td className="px-4 py-3 font-mono">{formatCurrency(h.soldPrice)}</td>
                    <td className="px-4 py-3 font-mono">{formatCurrency(h.saleValue)}</td>
                    <td
                      className={cn(
                        'px-4 py-3 font-mono font-semibold',
                        gainLossClass(h.realizedPnL)
                      )}
                    >
                      {h.realizedPnL >= 0 ? '+' : ''}
                      {formatCurrency(h.realizedPnL)}
                    </td>
                    <td className={cn('px-4 py-3 font-mono text-sm', gainLossClass(h.realizedPnL))}>
                      {h.realizedPnLPct >= 0 ? '+' : ''}
                      {h.realizedPnLPct.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="flex flex-col gap-2 sm:hidden">
            {soldHoldings.map((h, idx) => (
              <div
                key={h.id}
                className={cn(
                  'rounded-xl border border-[var(--border)] p-3',
                  idx % 2 === 0 ? 'bg-[var(--surface)]' : 'bg-[var(--surface-elevated)]'
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-[var(--text-primary)]">{h.particulars}</p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {h.ticker} · {h.sector}
                    </p>
                  </div>
                  <div
                    className={cn('text-right text-sm font-semibold', gainLossClass(h.realizedPnL))}
                  >
                    <p>
                      {h.realizedPnL >= 0 ? '+' : ''}
                      {formatCurrency(h.realizedPnL)}
                    </p>
                    <p className="text-xs opacity-75">
                      {h.realizedPnLPct >= 0 ? '+' : ''}
                      {h.realizedPnLPct.toFixed(2)}%
                    </p>
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-[var(--text-secondary)]">Invested</p>
                    <p className="font-medium">{formatCurrency(h.investment)}</p>
                  </div>
                  <div>
                    <p className="text-[var(--text-secondary)]">Sold At</p>
                    <p className="font-mono font-medium">{formatCurrency(h.soldPrice)}</p>
                  </div>
                  <div>
                    <p className="text-[var(--text-secondary)]">Sale Value</p>
                    <p className="font-mono font-medium">{formatCurrency(h.saleValue)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});
