# ForgeAI v0 — Service Contracts

## Boundary rule
The web application may read dashboard data and authenticated user configuration. It must never submit a signed exchange action. Only the private executor service may interact with exchange write endpoints.

## Dashboard API

### `GET /api/market`
Returns public market snapshot for approved symbols.
- Input: optional refresh parameter.
- Output: symbol, price/mid, funding, open interest, 24h notional, source timestamp, staleness/error state.
- Failure: explicit error response; no fabricated or silently stale data.

### `GET /api/signals`
Authenticated read of current and historical signals.
- Filters: strategy version, symbol, state, date range.
- Output includes rule results and block reasons, never secrets.

### `GET /api/risk/status`
Authenticated read of strategy and portfolio risk states.
- Output: sleeve state, active limits, current planned/open risk, blocks, kill-switch status.

### `POST /api/prop-profiles`
Authenticated creation/update of manual prop-calculator settings.
- Validates mapping state and contract metadata.
- Must never receive prop-firm login credentials.

### `POST /api/kill-switch`
Authenticated operator action.
- Sets system state to block new entries and queues cancellation of unfilled orders.
- Requires audit event, operator identity, timestamp, and status confirmation.
- This endpoint must not close a position unless a separately approved emergency-close policy exists; initial v0 does not include emergency market-close behavior.

## Signal service contract

### Input
- Validated 4H/1H/15m candle series.
- Current market snapshot.
- Immutable strategy-version parameters.
- Current strategy/portfolio risk state.

### Output: `SignalEvaluation`
```ts
{
  strategyVersion: string;
  symbol: 'BTC' | 'ETH' | 'HYPE' | 'SOL' | 'SUI';
  side: 'long' | 'short' | null;
  state: 'watch' | 'armed' | 'invalidated' | 'expired' | 'blocked' | 'none';
  entry: { low: number; high: number } | null;
  stop: number | null;
  targets: { tp1: number; tp2: number } | null;
  expectedRr: number | null;
  validUntil: string | null;
  rules: Array<{ key: string; passed: boolean; detail: string }>;
  marketContext: Record<string, unknown>;
  blockReasons: string[];
}
```

## Risk engine contract

### Input
A validated armed `SignalEvaluation`, sleeve settings, active positions, and risk state.

### Output: `RiskDecision`
```ts
{
  outcome: 'approved' | 'blocked';
  quantity: number;
  estimatedNotionalUsd: number;
  plannedLossUsd: number;
  feeSlippageReserveUsd: number;
  reasons: string[];
  sleeveState: string;
  portfolioState: string;
}
```

A blocked decision is terminal for that signal unless the signal is freshly evaluated under a new valid market state.

## Alert service contract

### Input
Signal Evaluation plus optional Prop Profile.

### Required behavior
- Persist an alert delivery row before/while delivery is attempted.
- Make delivery idempotent using alert ID/type.
- Render explicit expiry/invalidation.
- Never include credentials or private wallet/account details.
- `PROP_READY` must include `MANUAL PROP TRADE ONLY`.

## Executor service contract

### `POST /internal/execution-intents`
Private internal endpoint, inaccessible from browser and n8n.
- Requires preapproved `RiskDecision` and armed signal.
- Creates immutable intent and returns intent ID only.
- Rechecks kill switch, limits, freshness, and idempotency immediately before submission.

### `POST /internal/execution-intents/{id}/submit`
Private worker action.
- Submits approved entry only once.
- Uses unique client-order ID.
- Records redacted exchange response.
- Begins protective-order verification workflow after entry fill.

### `POST /internal/kill-switch`
Private/operator action.
- Prevents all new entries and attempts to cancel stale/open entry orders.
- Writes critical risk event and emits alert.

### `POST /internal/reconcile`
Worker-triggered reconciliation.
- Reads exchange order, fill, position, and stop state.
- Emits `ok`, `mismatch`, or `blocked` outcome.
- `mismatch` or missing stop blocks entries until resolved.

## No-go API constraints
- No endpoint for transfers, withdrawals, wallet export, secret readback, or prop-firm account connection.
- No public route may issue exchange write calls.
- No language-model endpoint may call executor routes.
