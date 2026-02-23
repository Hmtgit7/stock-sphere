'use client';

import { useEffect, useRef } from 'react';

export function useInterval(callback: () => void, delay: number | null): void {
  // Ref keeps the latest callback without restarting the interval on re-renders.
  const savedCallback = useRef<() => void>(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}
