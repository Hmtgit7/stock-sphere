'use client';

import { memo } from 'react';
import { formatCurrency } from '@/lib/formatters';
import { usePortfolioBreakdownTooltip } from '../hooks/use-portfolio-breakdown-tooltip';
import type { BreakdownTooltipEntry } from '../hooks/use-portfolio-breakdown-tooltip';

// Hardcoded theme hex values so CSS vars resolve correctly
// inside Recharts' detached tooltip DOM node.
export const PortfolioBreakdownTooltip = memo(function PortfolioBreakdownTooltip(
  props: BreakdownTooltipEntry
) {
  const data = usePortfolioBreakdownTooltip(props);
  if (!data) return null;
  const { name, invested, presentValue, isProfit } = data;

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
      {/* Sector name */}
      <p style={{ color: '#e8edd4', fontWeight: 600, marginBottom: 8 }}>{name}</p>

      {/* Divider */}
      <div style={{ height: 1, background: '#2e3828', marginBottom: 8 }} />

      {/* Invested row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 4 }}>
        <span style={{ color: '#8a9a7a' }}>Invested</span>
        <span style={{ color: '#e8edd4', fontFamily: 'monospace' }}>
          {formatCurrency(invested)}
        </span>
      </div>

      {/* Present value row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
        <span style={{ color: '#8a9a7a' }}>Value</span>
        <span
          style={{
            color: isProfit ? '#4ade80' : '#f87171',
            fontFamily: 'monospace',
            fontWeight: 600,
          }}
        >
          {formatCurrency(presentValue)}
        </span>
      </div>
    </div>
  );
});
