'use client';

import { useMemo, memo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';
import type { SectorSummary } from '@/types/portfolio';
import { formatCurrency } from '@/lib/formatters';

interface GainLossBarProps {
  sectors: SectorSummary[];
}

interface TooltipEntry {
  active?: boolean;
  payload?: { value?: number }[];
  label?: string;
}

// Custom tooltip — hardcoded theme hex values so CSS vars resolve correctly
// inside Recharts' detached tooltip DOM node
function GainLossTooltip({ active, payload, label }: TooltipEntry) {
  if (!active || !payload?.length) return null;
  const value = payload[0].value ?? 0;
  const isPositive = value >= 0;

  return (
    <div
      style={{
        background: '#242b1e',
        border: '1px solid #2e3828',
        borderRadius: '12px',
        padding: '10px 14px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
        minWidth: '148px',
      }}
    >
      {/* Sector name */}
      <p style={{ color: '#e8edd4', fontWeight: 600, fontSize: 12, marginBottom: 6 }}>{label}</p>
      {/* Divider */}
      <div style={{ height: 1, background: '#2e3828', marginBottom: 8 }} />
      {/* P&L row */}
      <div
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}
      >
        <span style={{ color: '#8a9a7a', fontSize: 11 }}>P &amp; L</span>
        <span
          style={{
            color: isPositive ? '#4ade80' : '#f87171',
            fontWeight: 700,
            fontSize: 13,
            fontFamily: 'monospace',
          }}
        >
          {isPositive ? '+' : ''}
          {formatCurrency(value)}
        </span>
      </div>
      {/* Coloured bottom accent bar */}
      <div
        style={{
          marginTop: 10,
          height: 3,
          borderRadius: 99,
          background: isPositive ? '#4ade80' : '#f87171',
          opacity: 0.5,
        }}
      />
    </div>
  );
}

export const GainLossBar = memo(function GainLossBar({ sectors }: GainLossBarProps) {
  const data = useMemo(
    () =>
      sectors.map((s) => ({
        name: s.sector,
        gainLoss: s.gainLoss,
      })),
    [sectors]
  );

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-3 sm:p-5">
      <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)] sm:mb-4 sm:text-sm">
        Gain / Loss by Sector
      </h3>
      <div className="h-[260px] sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={20} margin={{ bottom: 40, left: -10, right: 8, top: 4 }}>
            <XAxis
              dataKey="name"
              interval={0}
              angle={-35}
              textAnchor="end"
              tick={{ fill: 'var(--text-secondary)', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              height={55}
            />
            <YAxis
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              tick={{ fill: 'var(--text-secondary)', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={46}
            />
            <ReferenceLine y={0} stroke="#2e3828" strokeWidth={1} />
            <Tooltip
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              content={(props: any) => <GainLossTooltip {...props} />}
              cursor={{ fill: 'rgba(255,255,255,0.04)', radius: 4 }}
            />
            <Bar dataKey="gainLoss" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`bar-${index}`}
                  fill={entry.gainLoss >= 0 ? 'var(--accent-green)' : 'var(--accent-red)'}
                  fillOpacity={0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});
