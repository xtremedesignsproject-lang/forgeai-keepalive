# ForgeAI Automated Pilot — Risk Rules

## 1. Capital sleeves
At launch, each live strategy has an isolated US$100 capital sleeve.

| Strategy | Status | Sleeve |
| --- | --- | ---: |
| Trend Continuation v1 | Live | US$100 |
| Failed Breakout v1 | Live | US$100 |
| Liquidity Sweep Reversal v1 | Shadow | US$0 |
| Breakout Retest v1 | Shadow | US$0 |
| Range Reversal v1 | Shadow | US$0 |

The live bot account may hold only the approved total pilot capital. Long-term holdings and discretionary trading capital are excluded.

## 2. Per-strategy limits
- Maximum gross entry notional: US$100 at 1x gross notional cap.
- Maximum planned loss per trade: US$2.00, including configured fee/slippage reserve.
- Maximum open positions: 1.
- Maximum new entries per trading day: 2.
- Maximum realized loss per trading day: US$4.00. Pause until next daily session.
- Maximum realized loss per rolling week: US$8.00. Pause pending review.
- Hard strategy drawdown: US$20.00 from its high-water mark. Quarantine; never auto-resume.
- Same symbol + same direction cooldown after stop: 4 hours.

## 3. Portfolio limits at launch
- Maximum bot capital: US$200.
- Maximum concurrent positions: 2.
- Maximum combined planned open loss: US$4.00.
- Maximum portfolio realized loss per daily session: US$8.00. Disable all new entries.
- During stress or high correlation, do not allow a second same-direction altcoin trade if the correlation guard is active.

## 4. Position-sizing rule
For each proposed trade:

1. Determine an eligible stop price from the strategy specification.
2. Determine the current/limit entry price.
3. Estimate fee and slippage reserve before entry.
4. Compute maximum quantity from risk budget and notional cap.
5. Round down to the exchange's valid size increment.
6. Recalculate worst-case loss after rounding. Reject if it exceeds allowed risk.

Conceptually:

`risk_per_unit = abs(entry_price - stop_price) + per_unit_fee_slippage_reserve`

`quantity = floor_to_increment(min((risk_budget / risk_per_unit), (notional_cap / entry_price)))`

A trade is invalid when the quantity rounds to zero, the protective stop cannot be submitted, the estimated total loss exceeds the cap, or the reward-to-risk minimum is not met.

## 5. Mandatory trade conditions
A live entry may occur only when all are true:
- The strategy version is active and live-enabled.
- Symbol is in the approved universe.
- Timeframes and candle data are fresh.
- Strategy conditions pass deterministically.
- Entry, stop, and targets are valid relative to direction.
- Expected minimum reward-to-risk meets the strategy threshold.
- Strategy, portfolio, cooldown, and daily/weekly limits pass.
- No unresolved order, fill, position, or stop reconciliation issue exists.
- Kill switch is not active.
- Prop Ready alert has been emitted if the alert service is healthy; alert failure blocks entry unless Glenn has explicitly configured a temporary alert-bypass maintenance mode.

## 6. Mandatory protective-order behavior
- Entry without verified stop is a critical fault.
- A protective stop must be reduce-only and tied to the exact open position direction.
- Take-profit orders must not increase position size.
- Unfilled entries must carry a short expiry or be canceled by the stale-order worker.
- A dead-man/cancel-all mechanism may cancel open orders but is not a substitute for a position stop.

## 7. Hard prohibitions
- No martingale or loss-recovery sizing.
- No averaging down.
- No grids.
- No automatic leverage change.
- No automatic deposit, transfer, withdrawal, or capital top-up.
- No change to a protective stop that increases loss beyond the original planned risk.
- No model/LLM override of a deterministic risk block.

## 8. Risk states
- `ACTIVE`: eligible for new signals and entries.
- `COOLDOWN`: no same-symbol/same-direction entries for the defined time.
- `DAILY_PAUSED`: daily loss or daily-entry cap reached.
- `WEEKLY_PAUSED`: weekly loss cap reached.
- `HEALTH_BLOCKED`: stale data, API fault, missing stop, reconciliation defect, or unknown state.
- `QUARANTINED`: hard drawdown or critical defect; explicit Glenn approval required to reactivate.

## 9. Strategy-level minimum reward/risk
Initial defaults, subject to strategy-specific testing:
- Trend Continuation v1: minimum TP2 expected reward/risk of 1.8R.
- Failed Breakout v1: minimum TP2 expected reward/risk of 2.0R.
- All calculations use the conservative entry side and include fee/slippage reserve.

## 10. Change control
Any change to stop logic, target logic, signal filters, risk size, leverage cap, timeframes, or entry conditions creates a new strategy version. It must not be blended into prior performance statistics.
