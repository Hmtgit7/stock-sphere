'use client';

import { useMemo, memo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { SectorSummary } from '@/types/portfolio';
import { formatCurrency } from '@/lib/formatters';

// Palette — matches the dark green theme
const SECTOR_COLORS = [
  '#4ade80', // green
  '#22d3ee', // cyan
  '#a78bfa', // violet
  '#fbbf24', // amber
  '#f87171', // red
  '#34d399', // emerald
  '#60a5fa', // blue
];

interface TooltipPayload {
  name: string;
  value: number;
  payload: { totalInvestment: number; totalPresentValue: number };
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
  if (!active || !payload?.length) return null;
  const { name, payload: p } = payload[0];
  return (
    <div
      style={{
        background: '#242b1e',
        border: '1px solid #2e3828',
        borderRadius: '12px',
        padding: '10px 14px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
        minWidth: '160px',
        fontSize: 12,
      }}
    >
      <p style={{ color: '#e8edd4', fontWeight: 600, marginBottom: 8 }}>{name}</p>
      <div style={{ height: 1, background: '#2e3828', marginBottom: 8 }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 4 }}>
        <span style={{ color: '#8a9a7a' }}>Invested</span>
        <span style={{ color: '#e8edd4', fontFamily: 'monospace' }}>
          {formatCurrency(p.totalInvestment)}
        </span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
        <span style={{ color: '#8a9a7a' }}>Value</span>
        <span
          style={{
            color: p.totalPresentValue >= p.totalInvestment ? '#4ade80' : '#f87171',
            fontFamily: 'monospace',
            fontWeight: 600,
          }}
        >
          {formatCurrency(p.totalPresentValue)}
        </span>
      </div>
    </div>
  );
}

interface PortfolioBreakdownProps {
  sectors: SectorSummary[];
}

export const PortfolioBreakdown = memo(function PortfolioBreakdown({
  sectors,
}: PortfolioBreakdownProps) {
  const data = useMemo(
    () =>
      sectors.map((s) => ({
        name: s.sector,
        value: s.totalInvestment,
        totalInvestment: s.totalInvestment,
        totalPresentValue: s.totalPresentValue,
      })),
    [sectors]
  );

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-3 sm:p-5">
      <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)] sm:mb-4 sm:text-sm">
        Allocation by Sector
      </h3>
      <div className="h-[270px] sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="42%"
              innerRadius={55}
              outerRadius={88}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={SECTOR_COLORS[index % SECTOR_COLORS.length]}
                  opacity={0.85}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconType="circle"
              iconSize={7}
              wrapperStyle={{ fontSize: '10px', paddingTop: '8px' }}
              formatter={(value) => (
                <span style={{ color: 'var(--text-secondary)', fontSize: '10px' }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});
