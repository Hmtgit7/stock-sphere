'use client';

import { memo } from 'react';
import { formatCurrency } from '@/lib/formatters';
import { useGainLossTooltip } from '../hooks/use-gain-loss-tooltip';
import type { TooltipEntry } from '../hooks/use-gain-loss-tooltip';

// Hardcoded theme hex values so CSS vars resolve correctly
// inside Recharts' detached tooltip DOM node.
export const GainLossTooltip = memo(function GainLossTooltip(props: TooltipEntry) {
  const data = useGainLossTooltip(props);
  if (!data) return null;
  const { value, isPositive, label } = data;

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
});
