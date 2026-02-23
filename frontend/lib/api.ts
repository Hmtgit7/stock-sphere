import type { ApiResponse, PortfolioResponse } from '@/types/portfolio';
import { API_BASE_URL, API_MAX_RETRIES, API_RETRY_BASE_DELAY_MS } from '@/lib/constants';

async function apiFetch<T>(path: string, signal?: AbortSignal, attempt = 0): Promise<T> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1${path}`, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      signal,
    });

    if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);

    const json: ApiResponse<T> = await res.json();
    return json.data;
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') throw err;

    if (attempt < API_MAX_RETRIES) {
      const delay = API_RETRY_BASE_DELAY_MS * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return apiFetch<T>(path, signal, attempt + 1);
    }
    throw err;
  }
}

export const portfolioApi = {
  getPortfolio: (signal?: AbortSignal) => apiFetch<PortfolioResponse>('/portfolio', signal),
};
