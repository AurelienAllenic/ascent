import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import crypto from "crypto";

const prisma = new PrismaClient();

const VALID_TYPES = ["PAGE_VIEW", "CLICK", "SECTION_VIEW", "DURATION"] as const;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, path, label, metadata } = body;

    if (!type || !VALID_TYPES.includes(type)) {
      return new Response(JSON.stringify({ error: "Type is required and must be PAGE_VIEW | CLICK | SECTION_VIEW | DURATION" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const salt = process.env.ANALYTICS_SALT || "secret_ascent_analytics";
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    const visitorId = crypto
      .createHash("sha256")
      .update(ip + userAgent + salt)
      .digest("hex")
      .substring(0, 16);

    await prisma.analytics.create({
      data: {
        visitorId,
        type,
        path: path ?? "/",
        label: label ?? null,
        metadata: metadata ?? {},
      },
    });

    return new Response(JSON.stringify({ status: "ok" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Analytics track error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
