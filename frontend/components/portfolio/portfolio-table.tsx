'use client';
'use no memo';

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from '@tanstack/react-table';
import { useState, useMemo, memo } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatNumber, formatPct, gainLossClass, cn } from '@/lib/utils';
import type { EnrichedHolding } from '@/types/portfolio';

const columnHelper = createColumnHelper<EnrichedHolding>();

// Column defs outside component — stable reference, no re-creation on render
const columns = [
  columnHelper.accessor('particulars', {
    header: 'Stock',
    cell: (info) => (
      <div>
        <p className="font-medium text-[var(--text-primary)]">{info.getValue()}</p>
        <p className="text-xs text-[var(--text-secondary)]">{info.row.original.ticker}</p>
        {/* Stage-2 analyst signal from Excel */}
        {info.row.original.stage2 && (
          <span className="mt-0.5 inline-flex items-center gap-1 text-[10px] text-[var(--accent-green)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-green)]" />
            Buy Signal
          </span>
        )}
      </div>
    ),
  }),
  columnHelper.accessor('exchange', {
    header: 'Exch',
    cell: (info) => <Badge label={info.getValue()} variant="neutral" />,
  }),
  columnHelper.accessor('purchasePrice', {
    header: 'Buy Price',
    cell: (info) => formatCurrency(info.getValue()),
  }),
  columnHelper.accessor('quantity', {
    header: 'Qty',
    cell: (info) => formatNumber(info.getValue(), 0),
  }),
  columnHelper.accessor('investment', {
    header: 'Investment',
    cell: (info) => formatCurrency(info.getValue()),
  }),
  columnHelper.accessor('portfolioPct', {
    header: 'Weight',
    cell: (info) => (
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-[var(--chart-green)]"
            style={{ width: `${Math.min(info.getValue(), 100)}%` }}
          />
        </div>
        <span className="text-xs text-[var(--text-secondary)]">{info.getValue().toFixed(1)}%</span>
      </div>
    ),
  }),
  columnHelper.accessor('cmp', {
    header: 'CMP',
    cell: (info) => {
      const isFallback = info.row.original.isFallbackPrice;
      return (
        <div className="flex items-center gap-1">
          <span className="font-mono text-[var(--text-primary)]">
            {formatCurrency(info.getValue())}
          </span>
          {/* ~ indicator when static fallback price is used */}
          {isFallback && (
            <span
              title="Static fallback price — live data unavailable"
              className="text-[10px] text-[var(--accent-amber)]"
            >
              ~
            </span>
          )}
        </div>
      );
    },
  }),
  columnHelper.accessor('presentValue', {
    header: 'Present Value',
    cell: (info) => (
      <span className="font-mono text-[var(--text-primary)]">
        {formatCurrency(info.getValue())}
      </span>
    ),
  }),
  columnHelper.accessor('gainLoss', {
    header: 'Gain / Loss',
    cell: (info) => {
      const val = info.getValue();
      // ← use server-computed gainLossPct — no client-side math
      const pct = info.row.original.gainLossPct;
      return (
        <div className={gainLossClass(val)}>
          <p className="font-mono font-medium">{formatCurrency(val)}</p>
          <p className="text-xs opacity-80">{formatPct(pct)}</p>
        </div>
      );
    },
  }),
  columnHelper.accessor('peRatio', {
    header: 'P/E',
    cell: (info) => formatNumber(info.getValue()),
  }),
  columnHelper.accessor('latestEarnings', {
    header: 'Earnings',
    cell: (info) => (
      <span className="text-xs text-[var(--text-secondary)]">{info.getValue() ?? '—'}</span>
    ),
  }),
];

// ── Mobile card — your original code, updated to EnrichedHolding + new fields ──
function MobileHoldingCard({ holding, idx }: { holding: EnrichedHolding; idx: number }) {
  const isPos = (holding.gainLoss ?? 0) >= 0;

  return (
    <div
      className={cn(
        'rounded-xl border border-[var(--border)] p-3',
        idx % 2 === 0 ? 'bg-[var(--surface)]' : 'bg-[var(--surface-elevated)]'
      )}
    >
      {/* Row 1: name + exchange + weight */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-semibold text-[var(--text-primary)]">{holding.particulars}</p>
          <p className="text-xs text-[var(--text-secondary)]">{holding.ticker}</p>
          {/* Stage-2 signal on mobile too */}
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

      {/* Row 2: key numbers */}
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
              <span className="text-[10px] text-[var(--accent-amber)]">~</span>
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

      {/* Row 3: P&L bar — your original code */}
      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="flex-1">
          <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className={cn(
                'h-full rounded-full',
                isPos ? 'bg-[var(--accent-green)]' : 'bg-[var(--accent-red)]'
              )}
              style={{
                width: `${Math.min(Math.abs(holding.portfolioPct), 100)}%`,
              }}
            />
          </div>
        </div>
        {/* ← use server gainLossPct */}
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

interface PortfolioTableProps {
  holdings: EnrichedHolding[];
}

export const PortfolioTable = memo(function PortfolioTable({ holdings }: PortfolioTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const data = useMemo(() => holdings, [holdings]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      {/* ── Mobile: card list (hidden on sm+) — your original layout ── */}
      <div className="flex flex-col gap-2 sm:hidden">
        {holdings.map((h, idx) => (
          <MobileHoldingCard key={h.ticker} holding={h} idx={idx} />
        ))}
      </div>

      {/* ── Desktop: full table (hidden below sm) ── */}
      <div className="hidden overflow-x-auto rounded-xl border border-[var(--border)] sm:block">
        <table className="w-full min-w-[900px] border-collapse text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="border-b border-[var(--border)] bg-[var(--surface)]"
              >
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="select-none px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]"
                    onClick={header.column.getToggleSortingHandler()}
                    style={{
                      cursor: header.column.getCanSort() ? 'pointer' : 'default',
                    }}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <span className="text-[var(--text-secondary)]">
                          {header.column.getIsSorted() === 'asc' ? (
                            <ChevronUp className="h-3 w-3" />
                          ) : header.column.getIsSorted() === 'desc' ? (
                            <ChevronDown className="h-3 w-3" />
                          ) : (
                            <ChevronsUpDown className="h-3 w-3 opacity-40" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, idx) => (
              <tr
                key={row.id}
                className={cn(
                  'border-b border-[var(--border)] transition-colors hover:bg-white/[0.02]',
                  idx % 2 === 0 ? 'bg-[var(--surface)]' : 'bg-[var(--surface-elevated)]'
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
});
