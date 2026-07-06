export const CORE_INSTRUMENTS = ["BTC", "ETH", "HYPE", "SOL", "SUI"] as const;
export type CoreInstrument = (typeof CORE_INSTRUMENTS)[number];

export type MarketSnapshot = {
  symbol: CoreInstrument;
  mid: number;
  funding?: number;
  openInterest?: number;
  dayNotionalVolume?: number;
};

type AssetContext = {
  funding?: string;
  openInterest?: string;
  dayNtlVlm?: string;
};

async function postInfo<T>(body: Record<string, unknown>): Promise<T> {
  const response = await fetch("https://api.hyperliquid.xyz/info", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!response.ok) throw new Error(`Hyperliquid request failed: ${response.status}`);
  return response.json() as Promise<T>;
}

export async function fetchCoreMarketSnapshot(): Promise<MarketSnapshot[]> {
  const [mids, metaAndContexts] = await Promise.all([
    postInfo<Record<string, string>>({ type: "allMids" }),
    postInfo<[unknown, AssetContext[]]>({ type: "metaAndAssetCtxs" }),
  ]);

  const contexts = metaAndContexts[1] ?? [];
  const symbolIndex: Record<CoreInstrument, number> = { BTC: 0, ETH: 1, HYPE: 2, SOL: 5, SUI: 16 };

  return CORE_INSTRUMENTS.map((symbol) => {
    const context = contexts[symbolIndex[symbol]];
    return {
      symbol,
      mid: Number(mids[symbol]),
      funding: context?.funding ? Number(context.funding) : undefined,
      openInterest: context?.openInterest ? Number(context.openInterest) : undefined,
      dayNotionalVolume: context?.dayNtlVlm ? Number(context.dayNtlVlm) : undefined,
    };
  });
}
