# ForgeAI v0 — Implementation Plan

## Architecture

### 1. Web application
`apps/web` remains the private dashboard for market context, configuration, journal, risk status, prop profiles, alerts, and review. It does not sign exchange actions.

### 2. Market-data and signal worker
A server-side worker ingests public market data, normalizes it, builds candles/indicators, evaluates deterministic strategy versions, and writes candidate signals and snapshots.

### 3. Execution service
A separate server-only service receives only approved, fully validated live signals. It owns the encrypted agent-wallet signing material, order lifecycle, protective-order verification, retry/idempotency behavior, and reconciliation.

### 4. Reconciliation and health worker
A continuous worker compares local intended state with exchange open orders, fills, positions, and protective-stop state. It fails closed on unknown or mismatched state.

### 5. Alert worker
A separate integration publishes Telegram Watch, Prop Ready, entry, exit, risk, health, and review alerts. n8n may route notifications but never holds signing authority.

### 6. Database
Supabase/Postgres stores configuration, immutable strategy versions, signals, trade plans, orders, fills, risk events, alert deliveries, reconciliation checks, and journal/analytics data. Service-role access is server-side only.

## Sequenced releases

### Release 1 — Specification and local validation
- Add `AGENTS.md`, constitution, specs, risk rules, Prop Signal Relay, data model, API contracts, and acceptance tests.
- Repair/build/lint the existing dashboard.
- Add test runner, smoke test, CI, and visible local preview.

### Release 2 — Market data and strategy simulator
- Normalize market data and candles for the five symbols.
- Build pure deterministic strategy functions with no exchange dependency.
- Add backtest/replay harness and shadow-signal logging.
- Add dashboard view for strategy status, detected setups, and rejected reasons.

### Release 3 — Risk engine and prop alerts
- Implement pure risk sizing and portfolio guard functions.
- Add Prop Profile configuration and instrument mapping.
- Send WATCH, PROP_READY, INVALIDATED, and health alerts in simulated/shadow mode.
- Record delivery and setup lifecycle.

### Release 4 — Execution plumbing in non-live environment
- Build a separate execution-service package.
- Implement secret injection only in deployment runtime.
- Add order intent, idempotency, expiry, protective stop, take-profit, cancel, kill-switch, and reconciliation state machine.
- Validate against testnet/non-live environment and conduct failure drills.

### Release 5 — Live pilot
- Fund the isolated bot account with US$200 only after all release-gate evidence is reviewed.
- Enable Trend Continuation v1 and Failed Breakout v1 live.
- Keep three other strategies shadow-only.
- Enforce US$2/trade, US$4 strategy daily, US$8 strategy weekly, US$20 drawdown, and US$8 portfolio daily limits.

### Release 6 — Observation and evidence
- Generate daily/weekly summaries.
- Review strategy-specific results after 30 trades and 45 days, whichever is longer.
- Make no automatic capital adjustment.
- Version and retest every material change.

## Deployment boundaries
- Dashboard: Vercel or equivalent private deployment.
- Database: Supabase.
- Workers/executor: always-on private VPS/container service.
- Alert routing: n8n/Telegram or direct Telegram bot integration.
- Secrets: deployment platform encrypted secret manager only.

## Required implementation order
1. Complete Release 1 and have Glenn approve the spec.
2. Complete Release 2 before writing any exchange order implementation.
3. Complete Release 3 and use Prop Signal Relay in shadow mode.
4. Complete Release 4 with successful tests and drills.
5. Only then prepare Release 5 wallet funding and live activation.

## Explicit no-go conditions
Do not fund or activate the live pilot when any of the following is missing:
- clean build/lint/test evidence;
- deterministic strategy tests;
- risk-guard tests;
- bot-only account isolation;
- protective stop confirmation behavior;
- reconciliation behavior;
- kill switch;
- Telegram critical alerts;
- testnet/dry-run evidence;
- documented incident/recovery procedure.
