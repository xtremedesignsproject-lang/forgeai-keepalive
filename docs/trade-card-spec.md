# Trade Card specification

A Trade Card is the required pre-trade record for every live idea. Its purpose is to make a trade explainable before it is profitable or unprofitable.

## Required fields

| Field | Requirement |
|---|---|
| Symbol | BTC, ETH, HYPE, SOL, or SUI |
| Side | Long or short |
| Setup | Breakout retest, failed breakout, liquidity sweep, trend continuation, range reversal, or other |
| Timeframe | 15m, 1h, 4h, or 1d |
| Thesis | One clear paragraph explaining the edge |
| Entry zone | Low and high prices |
| Invalidation | The technical reason the thesis is wrong |
| Stop | A price derived from invalidation, not convenience |
| Planned risk | Dollar loss if the stop is hit |
| BTC regime | Required for ETH, HYPE, SOL, and SUI |

## Checklist fields

The app stores these as booleans with optional notes:

- Higher-timeframe bias aligns with the side.
- Entry trigger is present, not merely anticipated.
- Stop is outside normal noise and inside maximum risk.
- Minimum reward-to-risk target is justified.
- Funding and open interest do not contradict the thesis.
- There is no known high-impact event that invalidates the setup window.
- Correlated exposure remains within the portfolio cap.

## AI review behavior

The AI reviewer may:

- Identify incomplete fields.
- Point out conflicts such as a short against BTC strength.
- Summarize funding/OI/news context supplied to it.
- Explain why the trade qualifies, needs confirmation, or should be rejected.

The AI reviewer may not:

- Place an order.
- Change risk settings.
- Override a missing stop or invalidation.
- Treat confidence language as evidence.

## Post-trade review

Closed trades receive a journal entry answering:

1. Was the original thesis valid?
2. Was the execution compliant with the card?
3. Did I respect the stop and planned exits?
4. Was the outcome driven by setup quality, execution quality, or variance?
5. What rule should change, if any?
