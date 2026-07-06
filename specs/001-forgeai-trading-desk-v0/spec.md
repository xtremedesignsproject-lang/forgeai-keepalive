# ForgeAI Trading Desk v0 — Product Specification

## Status
Draft for review. This specification is the implementation source of truth for the initial automated live pilot and Prop Signal Relay.

## Problem
Glenn cannot consistently monitor and manually execute every qualifying crypto setup because he has other daily responsibilities. ForgeAI must therefore execute a small, fixed set of deterministic strategies in a tightly capped bot-only account while collecting complete, auditable data.

## Product goal
Operate a reliable private trading system that:
1. monitors BTC, ETH, HYPE, SOL, and SUI;
2. produces setup alerts suitable for manual prop-firm trading before bot entry;
3. runs two deterministic strategies live with isolated US$100 sleeves;
4. runs three additional strategies in shadow mode;
5. fails closed, protects open positions, journals every event, and produces reviewable results.

## Users
- Glenn: operator, capital owner, receiver of Telegram alerts, final approver of rule/capital changes.
- Codex: implementation agent only.
- ChatGPT: specification, trading-system, and review support only.

## In scope
- Private authenticated web dashboard.
- Public market-data monitoring for BTC, ETH, HYPE, SOL, SUI.
- Deterministic signal engine.
- Execution service hosted separately from dashboard and n8n.
- Two live strategy sleeves: Trend Continuation v1 and Failed Breakout v1.
- Three shadow strategy sleeves: Liquidity Sweep Reversal v1, Breakout Retest v1, Range Reversal v1.
- Trade/event journal, exchange-state reconciliation, protective stop verification, kill switch, Telegram alerts, daily/weekly reports.
- Prop Signal Relay that sends Watch and Prop Ready alerts before eligible bot entries.

## Out of scope
- LLM-generated signals or LLM-triggered orders.
- Public multi-user SaaS, billing, copy trading, portfolio management for others.
- Connecting to or executing trades on prop-firm accounts.
- Transfers, withdrawals, or any non-trading wallet action.
- Autonomous strategy adaptation, automatic capital scaling, leverage changes, martingale, averaging down, or grids.
- Live activation of more than two strategy sleeves at launch.

## Core user flows

### Flow A: Prop setup notification
1. A deterministic strategy detects a forming setup.
2. ForgeAI emits a Watch alert when the setup is approaching but has not reached the final entry condition.
3. When all pre-entry requirements are satisfied, ForgeAI sends a Prop Ready alert containing entry zone, stop, targets, expected reward/risk, invalidation, expiry, strategy version, and prop-account risk calculation.
4. The alert explicitly says manual prop trade only.
5. The system records the alert timestamp and validity state.

### Flow B: Automated bot trade
1. A live strategy receives a confirmed deterministic entry signal.
2. Portfolio and strategy risk locks run before any order is submitted.
3. If the Prop Ready lead window is enabled, ForgeAI sends the alert, waits the configured short window, revalidates the signal, then submits the order only if still valid.
4. The execution service submits a constrained exchange order with a unique client-order ID.
5. After entry confirmation, it submits and verifies a reduce-only protective stop and planned take-profit orders.
6. Reconciliation confirms order, fills, position, stop, and local journal state.
7. ForgeAI sends Bot Entered notification and tracks all subsequent events.

### Flow C: Fail closed
1. The worker detects stale market data, a missing stop, unreconciled position, duplicate request risk, API failure, or breached risk limit.
2. It blocks new entries immediately.
3. It cancels any stale unfilled orders where possible.
4. It sends Telegram health/risk alert and logs the reason.
5. Resume requires the configured recovery rule; hard-drawdown quarantine requires Glenn's explicit reactivation.

## Market and timeframe model
- Market universe: BTC, ETH, HYPE, SOL, SUI perpetuals.
- Context timeframe: 4H.
- Setup timeframe: 1H.
- Entry confirmation timeframe: 15m.
- Initial design is swing/intraday, not high-frequency scalping.
- Assets must be resolved using live exchange metadata.

## Initial strategies

### Strategy A — Trend Continuation v1
A directional continuation setup that requires 4H and 1H alignment, a defined pullback/return area, 15m confirmation, and adequate reward-to-risk. Full rule parameters belong in `risk-rules.md` and the strategy-specific rule module.

### Strategy B — Failed Breakout v1
A reversal setup where price breaks a documented prior range or swing level, rejects, returns within the range, and confirms on the 15m timeframe. Full rule parameters belong in `risk-rules.md` and the strategy-specific rule module.

### Shadow-only strategies
Liquidity Sweep Reversal v1, Breakout Retest v1, Range Reversal v1 must log exactly the same decision data but may not send live orders in the initial pilot.

## Success criteria
- Every live signal and decision has an immutable strategy version and auditable rule result.
- Every live order is reconciled with the exchange or the system fails closed.
- Every filled position has a verified protective stop or new entries halt.
- Glenn receives a Prop Ready alert before eligible bot entry whenever alerting is operational.
- The system can reconstruct PnL after fees, funding, slippage, and all state transitions.
- The two-strategy pilot remains inside capital, daily-loss, weekly-loss, and drawdown limits.

## Non-functional requirements
- Server-side executor only; UI cannot sign exchange requests.
- No secrets in source control, logs, client bundles, or alert payloads.
- All timestamps stored UTC and displayed Asia/Manila by default.
- Critical alerts must be rate-limited but never suppressed for missing stops, kill-switch activation, or health failure.
- Dashboard should remain usable on desktop and mobile.
