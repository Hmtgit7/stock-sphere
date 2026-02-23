'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { portfolioApi } from '@/lib/api';
import { useInterval } from '@/hooks/use-interval';
import { POLL_INTERVAL_MS } from '@/lib/constants';
import type { PortfolioResponse } from '@/types/portfolio';

export interface UsePortfolioReturn {
  data: PortfolioResponse | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => void;
}

export function usePortfolio(): UsePortfolioReturn {
  const [data, setData] = useState<PortfolioResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const isMountedRef = useRef(true);

  const fetchData = useCallback(async (isBackground = false) => {
    if (isBackground) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const result = await portfolioApi.getPortfolio();
      if (!isMountedRef.current) return;
      setData(result);
      setError(null);
      setLastUpdated(new Date());
    } catch (err) {
      if (!isMountedRef.current) return;
      setError(err instanceof Error ? err.message : 'Failed to fetch portfolio');
    } finally {
      if (!isMountedRef.current) return;
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    fetchData(false);
    return () => {
      isMountedRef.current = false;
    };
  }, [fetchData]);

  useInterval(() => fetchData(true), POLL_INTERVAL_MS);

  return {
    data,
    isLoading,
    isRefreshing,
    error,
    lastUpdated,
    refresh: () => fetchData(false),
  };
}
