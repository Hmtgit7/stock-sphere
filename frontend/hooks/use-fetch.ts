'use client';

import { useState, useEffect, useCallback } from 'react';

export interface FetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export function useFetch<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deps: any[] = [],
  maxRetries = 2
): FetchState<T> & { refetch: () => void } {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    isLoading: true,
    error: null,
  });

  const [fetchKey, setFetchKey] = useState(0);
  const refetch = useCallback(() => setFetchKey((k) => k + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    async function run(attempt: number) {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const data = await fetcher(controller.signal);
        if (!cancelled) setState({ data, isLoading: false, error: null });
      } catch (err) {
        if (cancelled || controller.signal.aborted) return;
        if (attempt < maxRetries) {
          const delay = 500 * Math.pow(2, attempt);
          await new Promise((r) => setTimeout(r, delay));
          if (!cancelled) run(attempt + 1);
        } else {
          const message = err instanceof Error ? err.message : 'Fetch failed';
          setState({ data: null, isLoading: false, error: message });
        }
      }
    }

    run(0);

    return () => {
      cancelled = true;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchKey, ...deps]);

  return { ...state, refetch };
}
