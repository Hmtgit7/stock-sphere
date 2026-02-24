'use client';

import { useMemo, memo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { SectorSummary } from '@/types/portfolio';
import { PortfolioBreakdownTooltip } from './tooltips/portfolio-breakdown-tooltip';

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
            <Tooltip content={<PortfolioBreakdownTooltip />} />
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
