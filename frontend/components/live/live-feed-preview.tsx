'use client';

import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/helpers';

// Simulated live feed items — replace with real WebSocket data later
const MOCK_FEED = [
  { id: 1, from: 'NSE', to: 'HDFCBANK', amount: '50 shares', status: 'completed', time: '2s ago' },
  { id: 2, from: 'NSE', to: 'BAJFINANCE', amount: '15 shares', status: 'pending', time: '5s ago' },
  { id: 3, from: 'BSE', to: 'POLYCAB', amount: '28 shares', status: 'completed', time: '12s ago' },
  { id: 4, from: 'NSE', to: 'LTIM', amount: '16 shares', status: 'completed', time: '18s ago' },
  { id: 5, from: 'NSE', to: 'TATAPOWER', amount: '225 shares', status: 'failed', time: '25s ago' },
];

const STATUS_STYLES: Record<string, string> = {
  completed: 'bg-green-500/10 text-[var(--accent-green)]',
  pending: 'bg-amber-500/10 text-[var(--accent-amber)]',
  failed: 'bg-red-500/10   text-[var(--accent-red)]',
};

export function LiveFeedPreview() {
  const [feed, setFeed] = useState(MOCK_FEED);
  const [pulse, setPulse] = useState(false);

  // Simulate a new entry every 8 seconds
  useEffect(() => {
    const id = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 600);
      setFeed((prev) => [
        {
          id: Date.now(),
          from: Math.random() > 0.5 ? 'NSE' : 'BSE',
          to: prev[Math.floor(Math.random() * prev.length)].to,
          amount: `${Math.floor(Math.random() * 100 + 1)} shares`,
          status: ['completed', 'pending', 'failed'][Math.floor(Math.random() * 3)],
          time: 'just now',
        },
        ...prev.slice(0, 9), // keep max 10 items
      ]);
    }, 8000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border)] px-3 py-3 sm:px-5">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'h-2 w-2 rounded-full bg-[var(--accent-green)] transition-all',
              pulse && 'scale-150 bg-[var(--accent-amber)]'
            )}
          />
          <span className="text-xs font-medium text-[var(--text-secondary)]">
            LIVE TRANSACTION FEED
          </span>
        </div>
        <span className="font-mono text-xs text-[var(--text-secondary)]">{feed.length} events</span>
      </div>

      {/* Feed rows */}
      <ul className="divide-y divide-[var(--border)]">
        {feed.map((item, idx) => (
          <li
            key={item.id}
            className={cn(
              'flex flex-col gap-1.5 px-3 py-2.5 transition-all sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-3',
              idx === 0 && pulse ? 'bg-[var(--accent-green)]/5' : 'hover:bg-white/[0.02]'
            )}
          >
            <div className="flex items-center gap-2 font-mono text-xs sm:gap-3 sm:text-sm">
              <span className="rounded-md bg-[var(--surface)] px-2 py-0.5 text-xs text-[var(--text-secondary)]">
                {item.from}
              </span>
              <ArrowRight className="h-3 w-3 shrink-0 text-[var(--text-secondary)]" />
              <span className="font-semibold text-[var(--text-primary)]">{item.to}</span>
              <span className="text-[var(--text-secondary)]">{item.amount}</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <span
                className={cn(
                  'rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
                  STATUS_STYLES[item.status]
                )}
              >
                {item.status}
              </span>
              <span className="font-mono text-xs text-[var(--text-secondary)]">{item.time}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
