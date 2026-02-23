# 📈 Stock Sphere

A real-time portfolio dashboard built with **Next.js 16**, **NestJS 11**, **Tailwind CSS v4**, and **TypeScript**. Fetches live stock prices from Yahoo Finance and fundamentals from Google Finance.

---

## 🔗 Live URLs

| Service        | URL                                                                                                    |
| -------------- | ------------------------------------------------------------------------------------------------------ |
| **Frontend**   | [stock-sphere-frontend-lyart.vercel.app](https://stock-sphere-frontend-lyart.vercel.app/)              |
| **Backend**    | [backend-production-4a0b.up.railway.app](https://backend-production-4a0b.up.railway.app/api/v1/health) |
| **Repository** | [github.com/Hmtgit7/stock-sphere](https://github.com/Hmtgit7/stock-sphere)                             |

---

## 🛠️ Tech Stack

| Layer          | Technology                                   |
| -------------- | -------------------------------------------- |
| **Frontend**   | Next.js 16, React 19, TanStack Table v8      |
| **Styling**    | Tailwind CSS v4, Lucide React, Recharts      |
| **Backend**    | NestJS 11, Axios, Cheerio                    |
| **Caching**    | @nestjs/cache-manager (in-memory)            |
| **Tooling**    | pnpm workspaces, Husky, Commitlint, Prettier |
| **Deployment** | Vercel (frontend) · Railway (backend)        |

---

## ✨ Features

- 📊 **Real-time Stock Prices** — Live CMP updates every 15 seconds
- 💼 **Portfolio Management** — Track investments, gains/losses, and portfolio percentage
- 📈 **Market Fundamentals** — P/E ratios and latest earnings data
- 🎯 **Sector Grouping** — Visualize holdings by sector
- ⚡ **Smart Caching** — Reduces API calls with intelligent TTL-based caching
- 🛡️ **Error Resilience** — Graceful handling of partial data failures
- 🎨 **Modern UI** — Responsive dashboard with dark/light mode support

---

## 📋 Prerequisites

- **Node.js** >= 20.x
- **pnpm** >= 10.29.3

---

## 🚀 Local Setup

### 1. Clone and Install

```bash
git clone https://github.com/Hmtgit7/stock-sphere.git
cd stock-sphere
pnpm install
```

### 2. Configure Environment

**Backend:**

```bash
cd backend
cp .env.example .env
```

**Frontend:**

```bash
cd frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local
```

### 3. Start Backend (NestJS on port 3001)

```bash
cd backend
pnpm start:dev
```

### 4. Start Frontend (Next.js on port 3000)

```bash
cd frontend
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📡 API Reference

**Base URL:** `/api/v1`

| Method | Endpoint                            | Description                              |
| ------ | ----------------------------------- | ---------------------------------------- |
| `GET`  | `/health`                           | Health check (Railway probe)             |
| `GET`  | `/portfolio`                        | Full enriched portfolio with live data   |
| `GET`  | `/market-data/cmp/:ticker`          | Single stock CMP from Yahoo Finance      |
| `GET`  | `/market-data/fundamentals/:ticker` | P/E ratio + earnings from Google Finance |

### Sample Response — `GET /portfolio`

```json
{
  "success": true,
  "timestamp": "2026-02-22T09:00:00.000Z",
  "data": {
    "holdings": [
      {
        "id": "1",
        "particulars": "Reliance Industries",
        "sector": "Energy",
        "exchange": "NSE",
        "ticker": "RELIANCE.NS",
        "purchasePrice": 2400,
        "quantity": 10,
        "investment": 24000,
        "portfolioPct": 18.46,
        "cmp": 2510.35,
        "presentValue": 25103.50,
        "gainLoss": 1103.50,
        "peRatio": 28.4,
        "latestEarnings": "Q3 FY26",
        "lastUpdated": "2026-02-22T09:00:00.000Z"
      }
    ],
    "sectors": [...],
    "totalInvestment": 130000,
    "totalPresentValue": 138500,
    "totalGainLoss": 8500
  }
}
```

---

## 📁 Project Structure

```
stock-sphere/
├── backend/                 # NestJS — Railway
│   └── src/
│       ├── modules/
│       │   ├── portfolio/   # Holdings logic + sector grouping
│       │   ├── market-data/ # Yahoo + Google Finance providers
│       │   └── health/      # Railway health probe
│       ├── common/          # Interceptors, filters, pipes
│       └── config/          # Zod-validated env
└── frontend/                # Next.js — Vercel
    ├── app/                 # App Router pages
    ├── components/          # Dashboard, Portfolio, UI atoms
    ├── hooks/               # usePortfolio, useLiveClock
    ├── lib/                 # API client, utils
    └── types/               # Shared TypeScript interfaces
```

---

## 🏗️ Architecture Decisions

### API Strategy

Yahoo Finance has no official public API. This project uses the reverse-engineered `query1.finance.yahoo.com/v8/finance/chart` JSON endpoint with browser-like headers. Google Finance fundamentals (P/E, earnings) are scraped with Cheerio.

### Caching Strategy

- **CMP data:** 30s TTL (matches 15s frontend poll + buffer)
- **Fundamentals:** 5-minute TTL (P/E ratios rarely change intraday)

### Error Resilience

`Promise.allSettled` is used at both the per-stock and per-field level, ensuring a single failed API call never crashes the entire portfolio response. Failed values render as `—` in the UI.

### Git Workflow

- **Branches:** Must follow `feat/*`, `fix/*`, `chore/*`, `docs/*`
- **Commits:** Must follow Conventional Commits (e.g., `feat: add sector grouping`)
- **Enforcement:** Husky hooks validate both on pre-commit and commit-msg

---

## 📝 License

**UNLICENSED** — Assignment submission for Octa Byte AI Pvt Ltd.

---

## 👨‍💻 Author

**Hemant Gehlod**

- GitHub: [@Hmtgit7](https://github.com/Hmtgit7)
- LinkedIn: [hemant-gehlod](https://www.linkedin.com/in/hemant-gehlod/)

---

## 🙏 Acknowledgments

[Next.js](https://nextjs.org) · [NestJS](https://nestjs.com) · [TanStack Table](https://tanstack.com/table) · [Recharts](https://recharts.org) · [Tailwind CSS](https://tailwindcss.com)

---

<div align="center">Made with ❤️ for Octa Byte AI Pvt Ltd</div>
