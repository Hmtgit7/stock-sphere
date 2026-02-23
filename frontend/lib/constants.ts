// ── Polling ────────────────────────────────────────────────────────────────
/** How often (ms) the portfolio data is refreshed in the background. */
export const POLL_INTERVAL_MS = 15_000;

/** How many times apiFetch retries on transient network failures. */
export const API_MAX_RETRIES = 2;

/** Base delay (ms) for exponential back-off between retries. */
export const API_RETRY_BASE_DELAY_MS = 500;

// ── Cache ──────────────────────────────────────────────────────────────────
/** Base URL for the backend API — falls back to localhost for local dev. */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
