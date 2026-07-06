-- ForgeAI Trading Desk v0
-- Manual trading journal, trade validation, and risk controls.
-- No wallet keys or exchange credentials are stored in this schema.

create extension if not exists pgcrypto;

create type public.trade_side as enum ('long', 'short');
create type public.trade_status as enum ('draft', 'planned', 'open', 'partially_closed', 'closed', 'cancelled', 'rejected');
create type public.setup_type as enum ('breakout_retest', 'failed_breakout', 'liquidity_sweep', 'trend_continuation', 'range_reversal', 'other');

create table public.trading_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  timezone text not null default 'Asia/Manila',
  max_risk_per_trade_usd numeric(18,2),
  max_daily_loss_usd numeric(18,2),
  max_open_positions integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.trade_cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  symbol text not null check (symbol in ('BTC', 'ETH', 'HYPE', 'SOL', 'SUI')),
  side public.trade_side not null,
  status public.trade_status not null default 'draft',
  setup public.setup_type not null,
  timeframe text not null check (timeframe in ('15m', '1h', '4h', '1d')),
  thesis text not null,
  entry_low numeric(24,10) not null,
  entry_high numeric(24,10) not null,
  invalidation_price numeric(24,10) not null,
  stop_price numeric(24,10) not null,
  target_1_price numeric(24,10),
  target_2_price numeric(24,10),
  planned_risk_usd numeric(18,2) not null check (planned_risk_usd > 0),
  planned_leverage numeric(10,2),
  btc_regime text,
  funding_context text,
  oi_context text,
  catalyst_context text,
  checklist jsonb not null default '{}'::jsonb,
  ai_review text,
  rejection_reason text,
  screenshot_url text,
  opened_at timestamptz,
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (entry_low <= entry_high)
);

create table public.trade_fills (
  id uuid primary key default gen_random_uuid(),
  trade_card_id uuid not null references public.trade_cards(id) on delete cascade,
  fill_type text not null check (fill_type in ('entry', 'take_profit', 'stop_loss', 'manual_exit', 'funding', 'fee')),
  quantity numeric(24,10),
  price numeric(24,10),
  realized_pnl_usd numeric(18,2),
  fee_usd numeric(18,2),
  occurred_at timestamptz not null default now(),
  exchange_ref text,
  notes text
);

create table public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  trade_card_id uuid references public.trade_cards(id) on delete set null,
  entry_type text not null check (entry_type in ('pre_trade', 'in_trade', 'post_trade', 'daily_review')),
  body text not null,
  emotion_tags text[] not null default '{}',
  rule_violations text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table public.market_snapshots (
  id bigint generated always as identity primary key,
  symbol text not null check (symbol in ('BTC', 'ETH', 'HYPE', 'SOL', 'SUI')),
  source text not null default 'hyperliquid',
  mid_price numeric(24,10) not null,
  funding_rate numeric(18,12),
  open_interest numeric(24,10),
  day_notional_volume numeric(24,2),
  observed_at timestamptz not null default now()
);

create index trade_cards_user_status_idx on public.trade_cards(user_id, status, created_at desc);
create index trade_cards_symbol_idx on public.trade_cards(symbol, created_at desc);
create index journal_entries_trade_card_idx on public.journal_entries(trade_card_id, created_at desc);
create index market_snapshots_symbol_time_idx on public.market_snapshots(symbol, observed_at desc);

alter table public.trading_profiles enable row level security;
alter table public.trade_cards enable row level security;
alter table public.trade_fills enable row level security;
alter table public.journal_entries enable row level security;
alter table public.market_snapshots enable row level security;

create policy "profile owner access" on public.trading_profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "trade card owner access" on public.trade_cards
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "trade fill owner access" on public.trade_fills
  for all using (
    exists (select 1 from public.trade_cards t where t.id = trade_card_id and t.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.trade_cards t where t.id = trade_card_id and t.user_id = auth.uid())
  );

create policy "journal owner access" on public.journal_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Market snapshots are written by a server-side worker only. Authenticated users may read them.
create policy "authenticated market snapshot reads" on public.market_snapshots
  for select to authenticated using (true);
