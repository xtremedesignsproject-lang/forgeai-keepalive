import { NextResponse } from "next/server";
import { fetchCoreMarketSnapshot } from "@/lib/hyperliquid";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const markets = await fetchCoreMarketSnapshot();
    return NextResponse.json({
      markets,
      source: "Hyperliquid public API",
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load market data";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
