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

type Meta = {
  universe: Array<{ name: string }>;
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
    postInfo<[Meta, AssetContext[]]>({ type: "metaAndAssetCtxs" }),
  ]);

  const [meta, contexts] = metaAndContexts;

  return CORE_INSTRUMENTS.map((symbol) => {
    const index = meta.universe.findIndex((asset) => asset.name === symbol);
    const context = index >= 0 ? contexts[index] : undefined;

    return {
      symbol,
      mid: Number(mids[symbol]),
      funding: context?.funding ? Number(context.funding) : undefined,
      openInterest: context?.openInterest ? Number(context.openInterest) : undefined,
      dayNotionalVolume: context?.dayNtlVlm ? Number(context.dayNtlVlm) : undefined,
    };
  });
}
