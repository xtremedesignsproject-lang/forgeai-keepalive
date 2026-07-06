# ForgeAI Trading Desk

A rules-first, AI-assisted personal crypto trading desk for **BTC, ETH, HYPE, SOL, and SUI**.

## What v0 does

- Displays live mid-prices from Hyperliquid’s public API.
- Creates a single market-health view for the five core instruments.
- Establishes the database model for trade cards, journal entries, rule checks, and risk controls.
- Keeps trading **manual**. This repository does not store private keys, sign orders, or place orders.

## What v0 does not do

- No autonomous trading.
- No private-key storage.
- No exchange write actions.
- No LLM-generated buy/sell orders.

## Stack

- **Web:** Next.js + TypeScript
- **Charts:** TradingView Lightweight Charts
- **Market source:** Hyperliquid public `info` endpoint
- **Database:** Supabase Postgres
- **Automation:** n8n + Telegram, added after the dashboard and journal are working

## Repository layout

```text
apps/web/                    # ForgeAI dashboard
supabase/migrations/         # Source-of-truth journal and risk schema
docs/                        # Architecture and operating rules
```

## Local start

1. Copy `apps/web/.env.example` to `apps/web/.env.local`.
2. Add Supabase values only after creating the Supabase project.
3. From `apps/web`, run:

```bash
npm install
npm run dev
```

4. Open `http://localhost:3000`.

The dashboard can show public market data before Supabase is configured.

## Safety model

The live desk is deliberately split into layers:

1. **Public market-data layer** — read-only.
2. **Journal and rule layer** — authenticated database actions.
3. **Alerts layer** — n8n/Telegram, with no wallet authority.
4. **Future execution layer** — separate service, separate API wallet, strict limits, and manual approval by default.

See [docs/architecture.md](docs/architecture.md) and [docs/trade-card-spec.md](docs/trade-card-spec.md).
