import type { ApiResponse, PortfolioResponse } from '@/types/portfolio';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}/api/v1${path}`, {
    headers: { 'Content-Type': 'application/json' },
    // No-store for live polling — we handle caching client-side
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  const json: ApiResponse<T> = await res.json();
  return json.data;
}

export const portfolioApi = {
  getPortfolio: () => apiFetch<PortfolioResponse>('/portfolio'),
};
