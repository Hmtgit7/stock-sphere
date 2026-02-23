'use client';

import { useState, memo } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { PortfolioTable } from './portfolio-table';
import { formatCurrency, gainLossClass, cn } from '@/lib/utils';
import type { SectorSummary } from '@/types/portfolio';

interface SectorGroupsProps {
  sectors: SectorSummary[];
}

export const SectorGroups = memo(function SectorGroups({ sectors }: SectorGroupsProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(sectors.map((s) => s.sector)));

  const toggle = (sector: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(sector)) {
        next.delete(sector);
      } else {
        next.add(sector);
      }
      return next;
    });

  return (
    <div className="flex flex-col gap-4">
      {sectors.map((sector) => {
        const isOpen = expanded.has(sector.sector);
        return (
          <div
            key={sector.sector}
            className="overflow-hidden rounded-xl border border-[var(--border)]"
          >
            <button
              onClick={() => toggle(sector.sector)}
              className="flex w-full items-center justify-between bg-[var(--surface-elevated)] px-3 py-3 transition-colors hover:bg-white/[0.03] sm:px-5 sm:py-4"
            >
              <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                {isOpen ? (
                  <ChevronDown className="h-4 w-4 shrink-0 text-[var(--text-secondary)]" />
                ) : (
                  <ChevronRight className="h-4 w-4 shrink-0 text-[var(--text-secondary)]" />
                )}
                <span className="truncate font-semibold text-[var(--text-primary)]">
                  {sector.sector}
                </span>
                <span className="shrink-0 text-xs text-[var(--text-secondary)]">
                  {sector.holdings.length} stocks
                </span>
              </div>

              <div className="flex items-center gap-3 sm:gap-6">
                {/* P&L — always visible on all screen sizes */}
                <div className="text-right">
                  <p className="text-[10px] text-[var(--text-secondary)] sm:text-xs">P&amp;L</p>
                  <p
                    className={cn(
                      'text-xs font-semibold sm:text-sm',
                      gainLossClass(sector.gainLoss)
                    )}
                  >
                    {formatCurrency(sector.gainLoss)}
                    {/* ← server-computed sector gainLossPct */}
                    {sector.gainLossPct !== undefined && (
                      <span className="ml-1 text-[10px] opacity-75">
                        ({sector.gainLossPct > 0 ? '+' : ''}
                        {sector.gainLossPct.toFixed(1)}%)
                      </span>
                    )}
                  </p>
                </div>
                {/* Invested + Value — desktop only, your original layout */}
                <div className="hidden text-right sm:block">
                  <p className="text-xs text-[var(--text-secondary)]">Invested</p>
                  <p className="text-sm font-medium">{formatCurrency(sector.totalInvestment)}</p>
                </div>
                <div className="hidden text-right sm:block">
                  <p className="text-xs text-[var(--text-secondary)]">Value</p>
                  <p className="text-sm font-medium">{formatCurrency(sector.totalPresentValue)}</p>
                </div>
              </div>
            </button>

            {isOpen && (
              <div className="p-2 sm:p-4">
                <PortfolioTable holdings={sector.holdings} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
});
