# ForgeAI Trading Desk architecture

## Purpose

ForgeAI is a decision-quality and trading-journal system. It is not an autonomous strategy engine in v0.

## v0 data flow

```text
Hyperliquid public API
        ↓
Next.js server route (/api/market)
        ↓
ForgeAI dashboard
        ↓
Trade Card + Journal (Supabase)
        ↓
n8n validation and Telegram notification
```

## Boundaries

| Layer | Responsibility | May hold wallet authority? |
|---|---|---:|
| Dashboard | Visualize markets, create Trade Cards, show reviews | No |
| Supabase | Journal, rules, risk limits, snapshots | No |
| n8n | Scheduled checks and Telegram notifications | No |
| AI reviewer | Explain missing evidence and rule conflicts | No |
| Future execution service | Sign a specifically approved order only | Separate, restricted API wallet only |

## Market data

- Use Hyperliquid `POST /info` for public snapshots.
- Use its WebSocket API later for live mid-prices, order books, user fills, and account events.
- Resolve symbols from the live `metaAndAssetCtxs` universe; never rely on fixed asset indexes.
- Use CCXT only as a normalized connector when an exchange-agnostic view is needed. Hyperliquid-native reads remain the account-state source of truth.

## First risk controls

1. Every Trade Card requires an invalidation price and stop.
2. Planned dollar risk must be below the profile limit.
3. BTC regime must be recorded before altcoin entries.
4. The system logs rejected ideas; skipped trade data is useful training data.
5. The desk sends alerts, not orders.

## Phase sequence

1. Public market dashboard — current branch.
2. Supabase authentication, Trade Card UI, and journal input.
3. Read-only Hyperliquid account monitor using public account queries.
4. n8n + Telegram alerts and daily review.
5. Historical analytics from closed Trade Cards.
6. Only after documented evidence: isolated testnet execution service with human approval.
