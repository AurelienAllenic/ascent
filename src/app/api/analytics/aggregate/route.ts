import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth";
import { aggregateDailyStats } from "../../../../../lib/aggregateAnalytics";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const result = await aggregateDailyStats();
    return NextResponse.json({
      success: true,
      result: { date: result.details?.[0]?.date ?? "ok", ...result },
    });
  } catch (err) {
    console.error("Aggregate error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Aggregation failed" },
      { status: 500 }
    );
  }
}
