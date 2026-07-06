# ForgeAI v0 — Ordered Task Backlog

## P0 — Specification freeze
- [ ] T001 Review and approve constitution, spec, plan, risk rules, Prop Signal Relay, data model, API contracts, and acceptance tests.
- [ ] T002 Update repository README to distinguish current manual prototype from gated automated-pilot roadmap.
- [ ] T003 Add GitHub PR template requiring specification link, tests, screenshots, and security declaration.

## P1 — Build and visual development
- [ ] T010 Install `apps/web` dependencies and record exact versions/lockfile.
- [ ] T011 Make `npm run lint` pass.
- [ ] T012 Make `npm run build` pass.
- [ ] T013 Add a test command and a market-dashboard smoke test.
- [ ] T014 Add GitHub Actions CI for install, lint, test, and build.
- [ ] T015 Start local preview in Codex browser and capture desktop/mobile screenshots.

## P2 — Domain model and strategy simulation
- [ ] T020 Add database schema/migrations for strategy versions, signals, signal evaluations, alert deliveries, risk state, execution intent, order state, fills, reconciliation checks, and prop profiles.
- [ ] T021 Add typed market-data domain models and boundary validation.
- [ ] T022 Implement candle retrieval/storage for 4H, 1H, and 15m.
- [ ] T023 Implement pure `trendContinuationV1` evaluator with unit tests.
- [ ] T024 Implement pure `failedBreakoutV1` evaluator with unit tests.
- [ ] T025 Implement three shadow evaluators with identical audit logging.
- [ ] T026 Implement replay/backtest harness using saved market snapshots; clearly label it as research, not proof of future profitability.
- [ ] T027 Build strategy-monitor screen showing signals, criteria passed/failed, and strategy version.

## P3 — Risk, prop alerts, and journal
- [ ] T030 Implement risk sizing, strategy limits, portfolio limits, cooldowns, and fail-closed states as pure tested functions.
- [ ] T031 Build risk-status dashboard with reasons for blocks and active limits.
- [ ] T032 Implement Prop Profile configuration and instrument-mapping states.
- [ ] T033 Implement WATCH, PROP_READY, INVALIDATED, BOT_ENTERED, and POSITION_EVENT message builders.
- [ ] T034 Deliver alerts in shadow mode and persist delivery state.
- [ ] T035 Build manual journal/reconciliation views for shadow results and optional prop results.

## P4 — Execution service, dry run, and testnet
- [ ] T040 Create separate `services/executor` package with no browser imports.
- [ ] T041 Define server-only secret interface; add no-secret logging guard.
- [ ] T042 Implement immutable execution intents and unique client-order IDs.
- [ ] T043 Implement order lifecycle state machine: intended → submitted → accepted → partially filled/filled → protected → closed/canceled/failed.
- [ ] T044 Implement protective stop and take-profit lifecycle, including confirmation checks.
- [ ] T045 Implement stale-order cancellation and kill-switch behavior.
- [ ] T046 Implement continuous exchange/local reconciliation.
- [ ] T047 Implement dry-run mode with exact payload audit and no live call.
- [ ] T048 Add testnet/non-live integration tests.
- [ ] T049 Run and document failure drills: network loss, stale data, duplicate signal, API error, restart with position, missing stop.

## P5 — Limited live pilot
- [ ] T050 Review all release evidence and approve bot-only wallet funding.
- [ ] T051 Fund bot-only account with US$200 maximum.
- [ ] T052 Enable Trend Continuation v1 and Failed Breakout v1 only.
- [ ] T053 Confirm live dashboard, Telegram, kill switch, and daily PnL reports.
- [ ] T054 Observe all live and shadow outcomes without changing rules for the initial evaluation window.

## P6 — Evidence and controlled iteration
- [ ] T060 Complete 30 live trades and 45 calendar days per strategy, whichever is longer.
- [ ] T061 Calculate expectancy after fees, funding, slippage, and all losses.
- [ ] T062 Verify execution reliability: no unexplained fills, missing stops, or unreconciled positions.
- [ ] T063 Review holdout period results.
- [ ] T064 Approve, pause, retire, or version-bump each strategy.
- [ ] T065 Consider third live sleeve only after documented approval.

## Definition of task completion
A task is complete only when its linked acceptance criteria pass, test/build evidence is in the PR, security boundaries are unchanged or explicitly reviewed, and Glenn accepts the result.
