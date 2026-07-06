# ForgeAI Agent Instructions

## Mission
ForgeAI is a private, rules-first crypto research, journaling, alerting, and—only after formal release gates—a limited automated-execution system for Glenn Baratbate.

## Non-negotiable safety boundaries
- Treat all exchange credentials and signing keys as secrets. Never print, commit, upload, log, render, or send them to ChatGPT, GitHub, Supabase client code, n8n, Telegram, or browser code.
- The web app must never contain a private key or direct exchange signing logic.
- n8n and Telegram are notification/control surfaces only. They must not hold signing keys.
- Do not add transfer, withdrawal, staking, asset-send, or account-management code to an executor.
- Do not use an LLM to create, alter, approve, rank, or submit live orders. Live signal logic must be deterministic, versioned, and unit-tested.
- Any execution capability belongs in a separate server-only service and requires a separate bot-only wallet/account with deliberately limited capital.
- No martingale, averaging down, grid expansion, automatic leverage increase, or automatic compounding.

## Product context
Core symbols: BTC, ETH, HYPE, SOL, SUI.

Initial live pilot:
- Strategy A: trend continuation — US$100 isolated sleeve.
- Strategy B: failed breakout — US$100 isolated sleeve.
- Strategies C–E run in shadow mode only.
- Maximum strategy risk per trade: US$2.
- Maximum strategy daily loss: US$4.
- Maximum strategy weekly loss: US$8.
- Hard strategy drawdown: US$20, which quarantines the strategy.
- Maximum portfolio live capital at launch: US$200.
- Maximum combined open risk: US$4.
- Maximum portfolio daily realized loss: US$8, which pauses all new entries.

## Required documentation before implementation
Read these files before changing behavior:
- `.specify/memory/constitution.md`
- `specs/001-forgeai-trading-desk-v0/spec.md`
- `specs/001-forgeai-trading-desk-v0/plan.md`
- `specs/001-forgeai-trading-desk-v0/risk-rules.md`
- `specs/001-forgeai-trading-desk-v0/acceptance-tests.md`

## Engineering rules
- Use TypeScript strict mode. Avoid `any`.
- Validate all external payloads at the boundary and make failures explicit.
- Resolve exchange assets through live metadata; do not hard-code indices.
- Use unique client-order IDs, immutable strategy versions, and idempotent order-state transitions.
- Any filled live position must have a server-verified reduce-only protective stop. If that cannot be confirmed, disable all new entries and alert.
- Reconciliation is mandatory: compare intended order state, exchange orders, fills, positions, stop presence, and local journal state.
- Implement a kill switch that disables new entries and cancels outstanding unfilled orders.
- Every change needs focused tests and must preserve mobile usability.

## Validation commands
From `apps/web`:
```bash
npm install
npm run lint
npm run build
npm run test
```

For the future execution service, tests must include deterministic strategy logic, risk calculation, duplicate-signal prevention, stop attachment, state reconciliation, restart recovery, and fail-closed behavior.

## Pull request standard
- One cohesive feature per PR.
- State the linked specification section and acceptance criteria.
- Include exact commands run and results.
- Never claim testnet/live trading verification unless logs or screenshots are provided.
- Do not merge execution code that lacks a failure-mode test.