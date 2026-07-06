# ForgeAI Constitution

## 1. Purpose
ForgeAI is a private trading operations system for Glenn Baratbate. Its purpose is to make rule-following, risk accounting, alerting, execution verification, and performance learning more reliable than ad hoc discretionary trading.

## 2. Decision authority
1. Glenn sets capital, risk caps, strategy activation, and deployment approval.
2. Deterministic strategy code may produce signals only from documented rule sets.
3. A language model may summarize, explain, journal, and surface anomalies. It has no live trade-decision or execution authority.
4. Codex may implement only approved tasks and may not relax a safety control for convenience.

## 3. Capital isolation
- Live automation uses an account/wallet dedicated to bot capital.
- Initial bot capital is US$200: US$100 each for Strategy A and Strategy B.
- Long-term holdings and the main discretionary wallet must remain outside the bot account.
- Every capital increase requires manual approval and a written progress-log entry.

## 4. Fail closed
The system must block new entries when any of the following is true:
- Market data is stale or malformed.
- Exchange connectivity is unavailable.
- A duplicate signal/order cannot be ruled out.
- The previous order/position state is not reconciled.
- A filled position lacks a confirmed protective stop.
- A strategy, portfolio, or health limit is reached.
- The worker restarts with an unresolved open position.

## 5. Execution principles
- No transfer, withdrawal, or non-trading account-management capability in executor code.
- No unbounded order frequency.
- No martingale, averaging down, grid expansion, automatic leverage changes, or automatic compounding.
- All orders must carry a strategy version, idempotency/client-order ID, intended risk, and an audit record.
- Position entry must be followed by verification of a reduce-only protective stop.
- A kill switch must stop new entries and cancel unfilled orders.

## 6. Initial strategy governance
- Live A: Trend continuation.
- Live B: Failed breakout.
- Shadow C: Liquidity sweep reversal.
- Shadow D: Breakout and retest.
- Shadow E: Range reversal.
- Any material strategy-rule change creates a new immutable strategy version and separate evaluation sample.

## 7. Prop Signal Relay
ForgeAI may send setup alerts for manual use in Glenn's prop-firm account. It must not connect to, log into, copy trades to, or place orders in a prop-firm account. Prop alerts are advisory and must include an expiry/invalidity condition.

## 8. Evidence before scaling
A strategy can be considered for a capital increase only after:
- 30 completed live trades and 45 calendar days, whichever takes longer;
- no unresolved execution defect, missing stop, or reconciliation issue;
- positive expectancy after fees, funding, and slippage;
- review of a separate holdout period not used to tune that strategy;
- Glenn's written approval.

## 9. Source of truth
The current strategy specification, risk rules, release gates, immutable execution logs, exchange reconciliation records, and journal data are the source of truth. Chat summaries are not sufficient evidence for an execution claim.
