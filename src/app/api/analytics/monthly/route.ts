import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: "Non authentifié" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { searchParams } = new URL(request.url);
    const yearParam = searchParams.get("year");
    const monthParam = searchParams.get("month");

    if (!yearParam) {
      return new Response(JSON.stringify({ error: "year est requis" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const year = parseInt(yearParam, 10);
    const month = monthParam ? parseInt(monthParam, 10) : undefined;

    const where: { year: number; month?: number } = { year };
    if (month !== undefined) where.month = month;

    const stats = await prisma.analyticsMonthly.findMany({
      where,
      orderBy: [{ year: "desc" }, { month: "desc" }],
    });

    return new Response(JSON.stringify(stats), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Get monthly stats error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
