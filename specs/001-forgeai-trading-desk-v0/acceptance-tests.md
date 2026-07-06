# ForgeAI v0 — Acceptance Tests

## A. Specification and safety
- [ ] A1: `AGENTS.md` and constitution state that LLMs cannot decide or send live orders.
- [ ] A2: No browser bundle, Git history, dashboard logs, n8n workflow, Telegram payload, or Supabase client code contains a signing key.
- [ ] A3: Executor code contains no transfer, withdrawal, staking, or non-trading asset-action route.

## B. Build and UI
- [ ] B1: `npm run lint` succeeds.
- [ ] B2: `npm run build` succeeds.
- [ ] B3: `npm run test` succeeds.
- [ ] B4: Dashboard loads public market data for BTC, ETH, HYPE, SOL, SUI or visibly reports an error/stale state.
- [ ] B5: Dashboard is readable at desktop and mobile widths.

## C. Strategy simulation
- [ ] C1: Trend Continuation v1 returns the same output for the same candle input.
- [ ] C2: Failed Breakout v1 returns the same output for the same candle input.
- [ ] C3: Each evaluator stores strategy version, conditions passed/failed, and rejection reason.
- [ ] C4: Shadow strategies cannot create an execution intent.
- [ ] C5: Candle/metadata failure prevents a live signal.

## D. Risk controls
- [ ] D1: A proposed trade with missing stop is rejected.
- [ ] D2: A proposed trade with invalid entry/stop/target direction is rejected.
- [ ] D3: Quantity sizing never exceeds US$100 gross notional or US$2 planned loss per sleeve.
- [ ] D4: Strategy daily loss of US$4 blocks new entries.
- [ ] D5: Strategy weekly loss of US$8 blocks new entries.
- [ ] D6: Strategy drawdown of US$20 enters `QUARANTINED` and cannot auto-resume.
- [ ] D7: Portfolio combined risk above US$4 blocks a new entry.
- [ ] D8: Portfolio daily loss of US$8 blocks all new entries.
- [ ] D9: Same-symbol/same-direction stop cooldown blocks a duplicate trade for four hours.
- [ ] D10: Kill switch disables new intents and triggers stale-order cancellation workflow.

## E. Prop Signal Relay
- [ ] E1: WATCH alert is emitted only for an eligible forming setup.
- [ ] E2: PROP_READY alert includes symbol, direction, strategy/version, entry, stop, TP1, TP2, reward/risk, invalidation, expiry, and `MANUAL PROP TRADE ONLY`.
- [ ] E3: PROP_READY is recorded before bot entry submission whenever alert service is healthy.
- [ ] E4: Alert expiry/invalidation stops a user from treating stale setup data as current.
- [ ] E5: Unmapped prop instrument shows `UNMAPPED` rather than inventing a contract.
- [ ] E6: Prop Profile size suggestion cannot exceed profile limits and is clearly labeled as a calculation.

## F. Execution lifecycle — non-live and testnet first
- [ ] F1: Executor uses unique client-order IDs and is idempotent under retry.
- [ ] F2: Dry-run emits an auditable order payload without sending an exchange order.
- [ ] F3: Testnet/non-live integration confirms entry, cancellation, and trigger protective-order behavior.
- [ ] F4: A filled position without verified protective stop blocks new entries and raises critical alert.
- [ ] F5: Restart with an open position reconciles exchange state before any new signal is considered.
- [ ] F6: API/network fault blocks new entries and records health event.
- [ ] F7: Reconciliation detects local/exchange mismatch and fails closed.
- [ ] F8: No test ever permits an execution request to transfer or withdraw funds.

## G. Limited live-pilot go/no-go
All must be true before first live order:
- [ ] G1: A–F are complete with evidence in PRs/logs.
- [ ] G2: Separate bot-only wallet/account exists and has no long-term holdings.
- [ ] G3: US$200 maximum approved funding is confirmed by Glenn.
- [ ] G4: Telegram receives a startup, PROP_READY, entry, stop, health fault, kill-switch, and daily summary test message.
- [ ] G5: Glenn has reviewed dry-run and testnet logs.
- [ ] G6: Incident procedure and recovery steps are documented.
