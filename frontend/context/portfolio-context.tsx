'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { usePortfolio, type UsePortfolioReturn } from '@/hooks/use-portfolio';

const PortfolioContext = createContext<UsePortfolioReturn | null>(null);

interface PortfolioProviderProps {
  children: ReactNode;
}

// Single fetch/poll shared across all consumers — no duplicate API calls.
export function PortfolioProvider({ children }: PortfolioProviderProps) {
  const portfolio = usePortfolio();
  return <PortfolioContext.Provider value={portfolio}>{children}</PortfolioContext.Provider>;
}

export function usePortfolioContext(): UsePortfolioReturn {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolioContext must be used inside <PortfolioProvider>.');
  return ctx;
}
