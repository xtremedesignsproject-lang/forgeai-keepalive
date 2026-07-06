# ForgeAI Trading Desk

A private, rules-first crypto operations system for **BTC, ETH, HYPE, SOL, and SUI**.

## Current repository status
The existing dashboard is a **technical prototype**. It displays public market data and has an initial journal/risk schema. It is not yet built, tested, or approved for live trading.

The repository now includes a gated specification for a limited autonomous live pilot:

- **Live Strategy A:** Trend Continuation v1 — US$100 isolated sleeve.
- **Live Strategy B:** Failed Breakout v1 — US$100 isolated sleeve.
- **Shadow strategies:** Liquidity Sweep Reversal, Breakout Retest, Range Reversal.
- **Total initial bot capital:** US$200 maximum in a dedicated bot-only account.
- **Prop Signal Relay:** sends manual-use setup alerts before eligible bot entries; it never connects to a prop-firm account.

No exchange-write code should be implemented until the release gates in the Spec Kit are met.

## What ForgeAI v0 is intended to do
- Display public market context for the five approved instruments.
- Detect deterministic strategy conditions on 4H/1H/15m timeframes.
- Calculate strict sleeve and portfolio risk before a trade intent is created.
- Deliver WATCH and PROP_READY Telegram alerts for manual prop-firm use.
- Run a separate server-only executor only after test, security, reconciliation, and kill-switch requirements pass.
- Journal all signals, orders, fills, funding, fees, slippage, stop verification, PnL, and system-health events.

## What ForgeAI must not do
- Never place an order based on an LLM/AI decision.
- Never expose or store a signing key in the web UI, GitHub, client code, Supabase client code, n8n, Telegram, logs, or ChatGPT.
- Never include transfer, withdrawal, staking, or other non-trading wallet action in the executor.
- Never connect to or trade a prop-firm account.
- Never use martingale, averaging down, grid expansion, automatic leverage changes, or automatic compounding.

## Architecture
- **Web:** Next.js + TypeScript dashboard.
- **Charts:** TradingView Lightweight Charts.
- **Market source:** Hyperliquid public market data.
- **Database:** Supabase Postgres.
- **Alerts:** Telegram / n8n with no wallet authority.
- **Future executor:** separate server-only service with a dedicated bot-only account and strict risk/reconciliation controls.

## Spec Kit
Read before implementing new behavior:

- [`AGENTS.md`](AGENTS.md)
- [ForgeAI Constitution](.specify/memory/constitution.md)
- [Product specification](specs/001-forgeai-trading-desk-v0/spec.md)
- [Implementation plan](specs/001-forgeai-trading-desk-v0/plan.md)
- [Risk rules](specs/001-forgeai-trading-desk-v0/risk-rules.md)
- [Prop Signal Relay](specs/001-forgeai-trading-desk-v0/prop-signal-relay.md)
- [Task backlog](specs/001-forgeai-trading-desk-v0/tasks.md)
- [Acceptance tests](specs/001-forgeai-trading-desk-v0/acceptance-tests.md)

## Local start
1. Copy `apps/web/.env.example` to `apps/web/.env.local`.
2. Add Supabase values only after creating the Supabase project.
3. From `apps/web`, run:

```bash
npm install
npm run lint
npm run test
npm run build
npm run dev
```

4. Open `http://localhost:3000`.

The dashboard should show public market data before Supabase is configured. It must not be interpreted as live-trading readiness.
