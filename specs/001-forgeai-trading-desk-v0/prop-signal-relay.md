# ForgeAI Prop Signal Relay

## Purpose
Send actionable crypto setup notifications before an eligible ForgeAI bot entry so Glenn can decide whether to place a separate manual trade in a prop-firm platform.

## Boundary
- The relay is advisory and manual-use only.
- ForgeAI must not authenticate to, place orders on, copy trades to, or receive prop-firm credentials from any prop account.
- A prop alert is not an order instruction and must clearly show expiry/invalidation.
- Prop instrument availability differs by firm. Every mapping is either `TRADEABLE`, `DIRECTIONAL_REFERENCE_ONLY`, or `UNMAPPED`.

## Alert types

### 1. WATCH
Emitted when a setup is forming but has not satisfied final entry conditions.

Required fields:
- Alert ID
- Strategy name and immutable version
- Symbol and directional bias
- Context/setup/entry timeframes
- Forming entry zone or trigger condition
- Key invalidation reference
- Current status: `WATCH_ONLY`
- Expiry or condition that cancels the watch

### 2. PROP_READY
Emitted when deterministic conditions are complete and the bot is armed for possible entry.

Required fields:
- Alert ID and signal ID
- Strategy/version, symbol, direction, timeframes
- Entry type and entry zone
- Protective stop
- TP1 and TP2
- Expected reward/risk using conservative entry
- Setup invalidation
- Valid-until timestamp in Asia/Manila and UTC
- Bot state: `ARMED`, never “guaranteed”
- Prop mapping state
- Suggested prop-account risk amount and quantity only when a valid configured mapping exists
- Clear label: `MANUAL PROP TRADE ONLY`

### 3. BOT_ENTERED
Emitted after confirmed exchange fill. Includes actual fill, stop verification status, targets, strategy sleeve risk, and reconciliation state.

### 4. INVALIDATED / EXPIRED
Emitted if conditions disappear, entry window expires, risk guard blocks entry, or system health blocks the bot.

### 5. POSITION_EVENT
Emitted for TP1, TP2, stop, break-even move if allowed by versioned rules, manual kill, health pause, and end-of-day summary.

## Delivery timing
- WATCH should arrive as early as strategy logic can do so without flooding Telegram.
- PROP_READY is emitted before the bot entry submission.
- A short configurable lead window may delay bot entry only when that delay does not violate the strategy's price/slippage rule; the signal must be revalidated after the wait.
- Critical bot protection must never be delayed for notification delivery.
- If Telegram is unavailable, record failed delivery. The live-entry behavior follows the risk-rules alert-health rule.

## Telegram template

```text
PROP READY — {symbol} {LONG|SHORT}
Strategy: {strategy_name} v{strategy_version}
Context: {4h_regime} | Setup: {1h_state} | Trigger: {15m_condition}
Entry: {entry_zone}
Stop: {stop_price}
TP1: {tp1_price} | TP2: {tp2_price}
Expected R:R: {rr_tp2}
Invalidation: {invalidation_text}
Valid until: {expiry_manila}
Prop mapping: {mapping_state} {prop_instrument}
Suggested prop risk: {prop_risk} | Suggested size: {prop_size}
Bot: ARMED — final validation pending
MANUAL PROP TRADE ONLY
```

## Prop profile requirements
Each prop profile is separate from bot-capital settings and stores:
- Profile name and platform label
- Account balance/reference equity
- Preferred risk per setup (fixed currency or percent)
- Daily loss cap and trailing/static drawdown reference
- Allowed instruments and mappings
- Contract/lot size and tick value needed for calculation
- Maximum contracts/lots
- Session and time-zone preference
- Whether a given symbol is tradeable or directional reference only

## Measurement
For each alert, record:
- Delivery state and timestamp
- Prop profile used
- Bot armed timestamp, bot fill timestamp, and expiry
- Optional manually entered prop trade outcome
- Delay between alert and manual prop entry
- Difference between manual prop entry and bot fill
- Setup outcome versus prop outcome

These records determine whether an alert is practical for manual prop execution; the bot's performance and prop performance must be analyzed separately.
