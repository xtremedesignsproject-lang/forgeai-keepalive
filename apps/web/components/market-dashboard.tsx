"use client";

import { useCallback, useEffect, useState } from "react";

type Market = {
  symbol: string;
  mid: number;
  funding?: number;
  openInterest?: number;
  dayNotionalVolume?: number;
};

type ResponseShape = { markets: Market[]; fetchedAt: string; source: string };

const money = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 });

export function MarketDashboard() {
  const [data, setData] = useState<ResponseShape | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/market", { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Market feed unavailable");
      setData(payload);
      setError(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Market feed unavailable");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const id = window.setInterval(() => void load(), 15_000);
    return () => window.clearInterval(id);
  }, [load]);

  return (
    <main>
      <header className="header">
        <div>
          <h1>ForgeAI Trading Desk</h1>
          <p>Market context first. Manual execution only. Trade every thesis, not every candle.</p>
        </div>
        <div className="status">{loading ? "Connecting…" : "Read-only market feed"}</div>
      </header>

      {error ? <p className="error">{error}</p> : null}

      <section className="grid" aria-label="Core market prices">
        {data?.markets.map((market) => (
          <article className="card" key={market.symbol}>
            <div className="symbol">{market.symbol}-PERP</div>
            <div className="price">${money.format(market.mid)}</div>
            <div className="meta">Funding: {market.funding == null ? "—" : `${(market.funding * 100).toFixed(4)}%`}</div>
            <div className="meta">Open interest: {market.openInterest == null ? "—" : compact.format(market.openInterest)}</div>
            <div className="meta">24h notional: {market.dayNotionalVolume == null ? "—" : `$${compact.format(market.dayNotionalVolume)}`}</div>
          </article>
        ))}
      </section>

      <section className="layout">
        <article className="panel">
          <h2>v0 operating posture</h2>
          <div className="note">No order can be sent from this desk. It is deliberately limited to market context, trade validation, and journaling while your framework is proven.</div>
          <div className="rule"><strong>1. Regime before setup</strong><span>BTC 4H direction and liquidity conditions gate altcoin trades.</span></div>
          <div className="rule"><strong>2. Risk before entry</strong><span>Every proposed trade must have a defined invalidation, stop, and dollar-risk cap.</span></div>
          <div className="rule"><strong>3. Journal before scaling</strong><span>Trade cards and outcome data become the evidence for future automation.</span></div>
        </article>
        <aside className="panel">
          <h2>Next data modules</h2>
          <p>• Hyperliquid account snapshot</p>
          <p>• Trade Card creation</p>
          <p>• Setup-rule validation</p>
          <p>• Telegram alerts through n8n</p>
          <p>• Daily review and performance analytics</p>
          <button onClick={() => void load()}>Refresh market data</button>
          <p className="meta">{data ? `Last updated ${new Date(data.fetchedAt).toLocaleString()}` : "Waiting for market feed"}</p>
        </aside>
      </section>
    </main>
  );
}
