'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { portfolioApi } from '@/lib/api';
import type { PortfolioResponse } from '@/types/portfolio';

interface UsePortfolioReturn {
  data: PortfolioResponse | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => void;
}

const POLL_INTERVAL_MS = 15_000;

export function usePortfolio(): UsePortfolioReturn {
  const [data, setData] = useState<PortfolioResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true); // initial full load
  const [isRefreshing, setIsRefreshing] = useState(false); // background refresh
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  // useRef so interval callback always has latest state without re-registering
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

  // Initial fetch
  useEffect(() => {
    isMountedRef.current = true;
    fetchData(false);
    return () => {
      isMountedRef.current = false;
    };
  }, [fetchData]);

  // Polling — background refresh every 15s
  useEffect(() => {
    const interval = setInterval(() => fetchData(true), POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchData]);

  return {
    data,
    isLoading,
    isRefreshing,
    error,
    lastUpdated,
    refresh: () => fetchData(false),
  };
}
