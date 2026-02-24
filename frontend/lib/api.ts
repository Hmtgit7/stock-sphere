import type { ApiResponse, PortfolioResponse } from '@/types/portfolio';
import { API_BASE_URL, API_MAX_RETRIES, API_RETRY_BASE_DELAY_MS } from '@/lib/constants';

class ApiError extends Error {
  constructor(
    message: string,
    public readonly retryable: boolean
  ) {
    super(message);
  }
}

async function apiFetch<T>(path: string, signal?: AbortSignal, attempt = 0): Promise<T> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1${path}`, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      signal,
    });

    if (!res.ok) {
      // only 5xx and 429 are worth retrying; 4xx client errors are not
      throw new ApiError(
        `API error: ${res.status} ${res.statusText}`,
        res.status >= 500 || res.status === 429
      );
    }

    const json: ApiResponse<T> = await res.json();
    return json.data;
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') throw err;

    const retryable = !(err instanceof ApiError) || err.retryable;
    if (retryable && attempt < API_MAX_RETRIES) {
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
