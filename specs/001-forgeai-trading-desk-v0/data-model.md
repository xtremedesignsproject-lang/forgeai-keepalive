# ForgeAI v0 — Data Model

## Principles
- Store immutable strategy versions and event records.
- Store all timestamps in UTC.
- Never store private keys or raw signing credentials.
- Separate user configuration, signal evidence, execution intent, exchange observations, and analytics.

## Existing core tables
Existing migration tables for `trading_profiles`, `trade_cards`, `trade_fills`, `journal_entries`, and `market_snapshots` remain useful but need extension/migration for the automated pilot.

## Proposed additions

### `strategy_versions`
Immutable definition of one signal/execution rule set.
- id, strategy_key, version, mode (`live`, `shadow`, `disabled`)
- symbol_universe, timeframes, parameter_json
- entry/exit/risk rule references
- effective_from, retired_at, created_at

### `strategy_sleeves`
Capital and risk allocation per active strategy version.
- id, strategy_version_id, allocated_capital_usd
- notional_cap_usd, risk_per_trade_usd
- daily_loss_cap_usd, weekly_loss_cap_usd, drawdown_cap_usd
- high_water_mark_usd, state, state_reason

### `market_candles`
Normalized candles for strategy evaluation.
- symbol, timeframe, open_time, open, high, low, close, volume
- source, received_at, checksum/version

### `signals`
One candidate strategy outcome.
- id, strategy_version_id, symbol, side, state (`watch`, `armed`, `invalidated`, `expired`, `blocked`, `executed`, `shadow_closed`)
- generated_at, valid_until, rule_result_json
- entry_low/high, stop, tp1, tp2, expected_rr
- market_context_json, block_reason

### `risk_decisions`
Deterministic audit for each candidate that asks whether it can proceed.
- id, signal_id, evaluated_at, outcome (`approved`, `blocked`)
- quantity, estimated_notional, planned_loss, fee_slippage_reserve
- strategy_limit_state, portfolio_limit_state, reasons_json

### `prop_profiles`
Manual prop-account calculator configuration.
- id, owner_id, profile_name, reference_equity
- preferred_risk_type/value, daily_loss_limit, drawdown_limit
- timezone, session_rules_json, is_active

### `prop_instrument_mappings`
Mapping from ForgeAI symbol to optional prop symbol.
- id, prop_profile_id, source_symbol, mapping_state
- prop_instrument, contract_multiplier, tick_size, tick_value
- max_contracts, notes

### `alert_deliveries`
Every telegram/notification attempt.
- id, signal_id, alert_type, destination_key
- payload_redacted_json, created_at, delivered_at, status, provider_message_id, failure_reason

### `execution_intents`
Immutable intent passed to server-only executor.
- id, signal_id, risk_decision_id, client_order_id
- requested_entry, quantity, stop, targets, expiry
- state, created_at, submitted_at, terminal_at, failure_reason

### `exchange_orders`
Observed order state only; no secret material.
- id, execution_intent_id, exchange_order_id, client_order_id
- order_type, reduce_only, trigger_price, requested_json
- observed_state, submitted_at, updated_at, raw_response_redacted_json

### `position_snapshots`
Periodic observed position/equity state.
- id, sleeve_id, symbol, observed_at
- size, entry_price, mark_price, liquidation_price
- unrealized_pnl, realized_pnl, margin_used, stop_confirmed

### `reconciliation_checks`
Reconciliation result for intended/local/exchange states.
- id, sleeve_id, execution_intent_id, checked_at
- outcome (`ok`, `mismatch`, `blocked`), discrepancy_json
- local_state, exchange_state, action_taken

### `risk_events`
Auditable blocks, pauses, quarantines, kill-switch changes, and recovery actions.
- id, sleeve_id nullable, event_type, severity, reason
- created_at, resolved_at, resolved_by

### `daily_strategy_metrics`
Daily summary after fees/funding/slippage.
- strategy_version_id, trading_day, trades, gross_pnl, fees, funding, slippage, net_pnl
- planned_r, realized_r, max_drawdown, state

## Key relationships
`strategy_versions` → `strategy_sleeves` → `signals` → `risk_decisions` → `execution_intents` → `exchange_orders` / `trade_fills`.

`signals` → `alert_deliveries` and optionally `prop_profiles` through a delivery context.

`reconciliation_checks`, `risk_events`, `position_snapshots`, and `daily_strategy_metrics` support audit and monitoring.

## Retention and redaction
- Keep decision/audit records for the life of the pilot.
- Redact raw provider payloads before persistence when they could contain sensitive information.
- Store alert bodies without credentials, account numbers, or full wallet information.
