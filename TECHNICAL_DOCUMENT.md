# 📋 Technical Document — Stock Sphere

**Project:** Dynamic Portfolio Dashboard  
**Stack:** Next.js 16 · NestJS 11 · Tailwind CSS v4 · TypeScript  
**Deployment:** Vercel (frontend) · Railway (backend)

---

## 1. Key Challenges & Solutions

### Challenge 1: No Official Yahoo Finance / Google Finance API

**Problem:** Both Yahoo Finance and Google Finance discontinued their public APIs. Any solution must use unofficial means.

**Solution — Yahoo Finance:**

The endpoint `https://query1.finance.yahoo.com/v8/finance/chart/:ticker` returns structured JSON without HTML parsing. It is a reverse-engineered internal endpoint that responds correctly when the request includes browser-like `User-Agent` and `Accept-Language` headers.

**Why this is more reliable than HTML scraping:**

- No DOM structure changes break it
- Response is always structured JSON
- `meta.regularMarketPrice` is the authoritative live price field

**Solution — Google Finance:**

Google Finance renders key stats (P/E, earnings) in the HTML of `https://www.google.com/finance/quote/NSE:RELIANCE`. Cheerio parses the `[data-attid]` elements and extracts labeled values. A 5-minute cache prevents hammering Google and avoids rate limits.

**Disclaimer added in UI:** "Data sourced from unofficial endpoints. Prices are indicative, not financial advice."

---

### Challenge 2: Rate Limiting from External Sources

**Problem:** Polling 5+ stocks every 15 seconds = 20+ outbound requests/minute per user. This risks IP bans from Yahoo/Google.

**Solutions Applied:**

1. **In-memory TTL cache** (`@nestjs/cache-manager`): CMP responses cached for 30s. Multiple frontend polls within that window are served from cache — zero external requests.

2. **`Promise.allSettled` batching**: All tickers in a portfolio are fetched in one parallel batch per poll cycle, not sequentially.

3. **Backend as proxy**: The frontend never calls Yahoo/Google directly. All external traffic funnels through the NestJS backend, making it trivial to add queue-based throttling later (BullMQ).

4. **`ThrottlerGuard`**: Incoming requests to the NestJS API are rate-limited to 100 req/60s per IP.

---

### Challenge 3: Partial Data Failures Crashing the UI

**Problem:** If one stock's API call fails (network timeout, blocked IP), the entire portfolio should not error.

**Solution — Layered Resilience:**

```
Portfolio Request
└── Promise.allSettled([enrichHolding(stock1), enrichHolding(stock2)...])
    └── Per stock: Promise.allSettled([getCMP(), getFundamentals()])
        └── On failure → return null (never throw)
```

**Result:**

- Failed CMPs render as `—` in the table
- Failed fundamentals render as `—`
- A global `ErrorBanner` shows when the full portfolio call fails
- An 8-second Axios timeout on Yahoo prevents hanging requests

---

### Challenge 4: Stale UI During Background Refresh

**Problem:** The 15-second polling cycle could cause jarring full-page re-renders or blank states while new data loads.

**Solution:**

Two separate loading states are tracked in `usePortfolio`:

- **`isLoading`**: `true` only on the first fetch (shows full-screen spinner)
- **`isRefreshing`**: `true` on background polls (shows subtle amber dot + spinner in header)

The table and stats never unmount during a background refresh — users always see the last known data while new data loads silently.

---

### Challenge 5: TanStack Table + React 19 Compatibility

**Problem:** React 19's compiler can cause TanStack Table to not re-render on data changes if column definitions are recreated per render.

**Solution:**

- Column definitions declared **outside** the component (module scope) — stable reference, never recreated
- `useMemo` wraps the `data` array passed to `useReactTable`
- The `PortfolioTable` component is wrapped in `React.memo` to prevent re-renders when the parent re-renders with same data

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────┐
│         Vercel (Next.js 16)             │
│                                         │
│  page.tsx (Server Component)            │
│  └── <Dashboard /> (Client Component)   │
│      ├── usePortfolio (15s poll)        │
│      ├── StatsBar                       │
│      └── SectorGroups                   │
│          └── PortfolioTable             │
│              (TanStack Table v8)        │
└──────────────┬──────────────────────────┘
               │ GET /api/v1/portfolio
               │ every 15 seconds
┌──────────────▼──────────────────────────┐
│         Railway (NestJS 11)             │
│                                         │
│  PortfolioController                    │
│  └── PortfolioService                   │
│      └── Promise.allSettled(            │
│          MarketDataService ×N)          │
│          ├── YahooFinanceProvider       │
│          │   └── cache (30s TTL)        │
│          └── GoogleFinanceProvider      │
│              └── cache (5min TTL)       │
└──────────────┬──────────────────────────┘
               │
      ┌────────┴─────────┐
      ▼                  ▼
Yahoo Finance v8    Google Finance
JSON endpoint       HTML + Cheerio
```

---

## 3. Performance Decisions

| Concern                        | Decision                                                                                                         |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| **Unnecessary renders**        | `React.memo` on `StatsBar`, `DashboardHeader`                                                                    |
| **Column re-creation**         | TanStack column defs defined at module scope                                                                     |
| **Data referential stability** | `useMemo(() => holdings, [holdings])`                                                                            |
| **Duplicate API calls**        | `PortfolioContext` — single `usePortfolio()` call shared across all pages via context                            |
| **Yahoo burst rate-limit**     | `ConcurrencyLimiter(5)` — self-contained semaphore caps parallel outbound requests                               |
| **Concurrent ticker requests** | In-flight dedup `Map<string, Promise>` in `YahooFinanceProvider` — two callers for same ticker share one Promise |
| **Cold-start latency**         | `OnApplicationBootstrap` pre-warms cache on startup so first user request is a cache hit                         |
| **API over-fetching**          | 30s backend cache, 15s frontend interval                                                                         |
| **Bundle size**                | Recharts lazy-loaded via `next/dynamic` with `ssr: false` + `Skeleton` fallback                                  |
| **Server load**                | `ThrottlerGuard` 100 req/60s per IP                                                                              |
| **Repeated math**              | `round2(x)` util replaces all `Math.round(x * 100) / 100` calls throughout `PortfolioService`                    |
| **Error extraction**           | `toErrorMessage(err)` / `toHttpStatus(err)` utils replace repeated inline error-casting patterns                 |

---

## 4. Folder Structure

```
stock-sphere/
├── backend/src/
│   ├── modules/
│   │   ├── portfolio/       # PortfolioService (ConcurrencyLimiter, enrichHolding, groupBySector)
│   │   ├── market-data/     # YahooFinanceProvider, GoogleFinanceProvider
│   │   └── health/          # Health check endpoint
│   ├── common/
│   │   ├── filters/         # HttpExceptionFilter
│   │   ├── interceptors/    # TransformInterceptor
│   │   └── utils/           # round2, roundTo, toErrorMessage, toHttpStatus
│   └── config/              # Env configuration
└── frontend/
    ├── app/                 # App Router pages (/, /holdings, /live, /risk, /alerts)
    ├── components/
    │   ├── dashboard/       # Dashboard, StatsBar, DashboardHeader
    │   │   └── hooks/       # useLiveClock (component-scoped)
    │   ├── portfolio/       # PortfolioTable, SectorGroups, FlatHoldingsTable, MobileHoldingCard
    │   │   └── hooks/       # useSectorSummary, usePortfolioSummary
    │   ├── charts/          # GainLossBar, PortfolioBreakdown (lazy-loaded)
    │   ├── layout/          # Navbar, PageShell, ComingSoonCard
    │   └── ui/              # Badge, Skeleton, StatCard, Spinner, ErrorBanner, Logo
    ├── context/             # PortfolioContext — single shared fetch/poll
    ├── hooks/               # use-portfolio, use-interval, use-fetch, use-debounce
    ├── lib/
    │   ├── api.ts           # apiFetch with abort signal + exponential backoff retry
    │   ├── formatters.ts   # formatCurrency, formatNumber, formatPct
    │   ├── calculations.ts  # calculateInvestment, calculateGainLoss, calculatePortfolioPct
    │   ├── helpers.ts       # cn, gainLossClass
    │   ├── constants.ts     # POLL_INTERVAL_MS, API_MAX_RETRIES, API_BASE_URL
    │   └── utils.ts         # barrel re-export of all lib modules
    └── types/               # Shared TypeScript interfaces
```

---

## 5. Security Decisions

- **API keys** (RAPIDAPI_KEY if used) stored only in Railway environment variables — never in client-side code or `.env.local` committed to git
- **CORS** locked to `FRONTEND_URL` env variable (Vercel domain only)
- **`helmet()`** middleware adds standard HTTP security headers
- **`compression()`** reduces Railway egress bandwidth

---

## 6. What I Would Add With More Time

1. **Redis cache** instead of in-memory — survives Railway restarts and scales horizontally

2. **WebSocket gateway** (`@nestjs/websockets`) for push-based updates instead of polling

3. **PostgreSQL + Prisma** to persist portfolios per user with authentication

4. **BullMQ job queue** for rate-limited background scraping with retry logic

5. **End-to-end tests** with Playwright for the complete dashboard flow

6. **Real-time price alerts** — notify users when stocks hit target prices

7. **Historical data charts** — visualize price trends over time

8. **Portfolio analytics** — Sharpe ratio, beta, diversification metrics

---

## 7. Performance Metrics

| Metric                   | Value                                            |
| ------------------------ | ------------------------------------------------ |
| **Frontend bundle size** | ~180KB gzipped                                   |
| **API response time**    | ~200-400ms (with cache hit)                      |
| **API response time**    | ~1.2-2.5s (cache miss, Yahoo + Google)           |
| **Lighthouse score**     | 95+ (Performance, Accessibility, Best Practices) |
| **Time to Interactive**  | < 2s on 3G                                       |

---

## 8. Error Handling Strategy

### Frontend

- **Network failures**: Show error banner with retry button
- **Partial data**: Render `—` for missing fields, keep rest of UI functional
- **Loading states**: Differentiate between initial load and background refresh

### Backend

- **External API failures**: Return `null` for failed fields, never throw
- **Timeout handling**: 8-second Axios timeout prevents hanging requests
- **Rate limit hits**: Return cached data or graceful error response
- **Validation errors**: Zod schema validation with detailed error messages

---

## 9. Deployment Configuration

### Vercel (Frontend)

```bash
# Build command
cd frontend && pnpm build

# Output directory
frontend/.next

# Environment variables
NEXT_PUBLIC_API_URL=https://backend-production-4a0b.up.railway.app
```

### Railway (Backend)

```bash
# Start command
cd backend && pnpm start:prod

# Health check endpoint
/api/v1/health

# Environment variables
FRONTEND_URL=https://stock-sphere-frontend-lyart.vercel.app
NODE_ENV=production
```

---

## 10. Git Workflow

### Branch Naming

- `feat/*` — New features
- `fix/*` — Bug fixes
- `chore/*` — Maintenance tasks
- `docs/*` — Documentation updates

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add real-time price updates
fix: resolve caching issue in portfolio service
chore: update dependencies
docs: improve API documentation
```

### Enforcement

Husky hooks validate:

- Branch name format (pre-commit)
- Commit message format (commit-msg)
- Code formatting with Prettier (pre-commit)

---

## 11. Technology Justifications

**Why Next.js 16?**

- React Server Components reduce client bundle size
- App Router provides better DX for layouts and nested routes
- Built-in optimizations for production deployment

**Why NestJS 11?**

- Enterprise-grade TypeScript framework
- Built-in dependency injection and modular architecture
- Excellent support for caching, throttling, and interceptors

**Why TanStack Table v8?**

- Headless UI library — complete styling control
- Excellent performance with large datasets
- Built-in sorting, filtering, and pagination

**Why Tailwind CSS v4?**

- Utility-first approach speeds up development
- Smaller bundle size with JIT compilation
- Excellent dark mode support

**Why pnpm workspaces?**

- Faster installs than npm/yarn
- Efficient disk space usage with hard links
- Better monorepo support

---

<div align="center">

**Built for Octa Byte AI Pvt Ltd**

Made with ❤️ using Next.js, NestJS, and TypeScript

</div>
