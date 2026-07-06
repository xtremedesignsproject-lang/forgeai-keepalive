# ForgeAI v0 — UI Specification

## UI principles
- Private operator dashboard, clear first and visually calm.
- Risk and protection status are more prominent than profit.
- No execution controls in the public market dashboard.
- Use explicit state labels; never imply certainty or guaranteed profit.
- Mobile works for monitoring and kill-switch access; strategy configuration remains desktop-first.

## Navigation
1. Overview
2. Signals
3. Strategies
4. Risk
5. Journal
6. Prop Profiles
7. Alerts
8. System Health
9. Settings

## Overview screen
Required modules:
- Global status bar: kill-switch, worker health, market data freshness, last reconciliation.
- Portfolio risk card: total bot capital, realized daily PnL, daily loss limit remaining, combined planned risk, active positions.
- BTC regime card: current context label, source timeframe, timestamp, explanation link.
- Five market cards: BTC, ETH, HYPE, SOL, SUI with price/mid, funding, OI, 24h volume, freshness.
- Live sleeves: state, current position, daily PnL, drawdown, next eligible time.
- Shadow strategies: latest signal and simulated outcome status.
- Latest Prop Ready alerts and delivery state.

## Signals screen
- Filter by strategy, version, symbol, state, date.
- Each signal shows setup checklist, price levels, expected R:R, expiry, risk decision, prop alert delivery, and execution/journal link.
- `WATCH`, `ARMED`, `BLOCKED`, `INVALIDATED`, `EXPIRED`, and `EXECUTED` must have distinct labels.
- Reason for every blocked signal is visible.

## Strategies screen
- Strategy cards show mode: LIVE / SHADOW / DISABLED.
- Show immutable active version, symbols, timeframes, active risk sleeve, sample size, net results, drawdown, and last evaluation.
- Strategy configuration changes create a new version; there is no silent in-place edit.
- Activating/deactivating a live strategy requires a confirmation dialog and audit record.

## Risk screen
- Per sleeve: capital, notional cap, risk/trade, daily/weekly loss limits, high-water mark, drawdown, state/reason.
- Portfolio: open risk, daily realized PnL, correlation guard, global state.
- Prominent warnings for HEALTH_BLOCKED, DAILY_PAUSED, WEEKLY_PAUSED, and QUARANTINED.
- Kill switch control with status confirmation and audit history.

## Journal screen
- Trade timeline: signal → risk decision → alert → intent → order/fills → protection → exit → reconciliation.
- PnL must show gross, fees, funding, slippage, net PnL, planned R, realized R.
- Optional links/screenshots for manual prop mirror trade; separate bot and prop outcomes.

## Prop Profiles screen
- Profile settings: risk amount, account reference, loss/drawdown rules, sessions, mappings.
- Mapping badge: TRADEABLE / DIRECTIONAL_REFERENCE_ONLY / UNMAPPED.
- Each mapping shows contract/lot assumptions used for suggestion.
- No credential or connection form exists.

## Alerts screen
- Alert audit table: type, signal, delivery timestamp, provider state, expiry, retry/failure reason.
- Preview of Telegram message.
- Configurable watch/ready health and quiet period behavior, except critical alerts cannot be muted.

## System Health screen
- Market-data status, WebSocket/HTTP freshness, signal-worker heartbeat, executor heartbeat, alert delivery, last reconciliation, last successful protective-stop verification.
- Critical incident list and clear recovery status.

## Empty/error states
- No data: explain what service/configuration is needed.
- Stale data: show last good timestamp and block indicator.
- Unknown order/position state: show `NEW ENTRIES BLOCKED` in the global status bar.
- No profitable-performance wording unless user is viewing actual calculated results.
