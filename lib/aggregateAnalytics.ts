import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type ClicksRecord = Record<string, number>;

function toClicksRecord(obj: unknown): ClicksRecord {
  if (!obj || typeof obj !== "object") return {};
  const out: ClicksRecord = {};
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === "number") out[k] = v;
  }
  return out;
}

function mergeClicks(a: ClicksRecord, b: ClicksRecord): ClicksRecord {
  const out = { ...a };
  for (const [label, count] of Object.entries(b)) {
    out[label] = (out[label] || 0) + count;
  }
  return out;
}

export async function aggregateDailyStats() {
  const events = await prisma.analytics.findMany({ orderBy: { createdAt: "asc" } });

  if (events.length === 0) {
    return {
      eventsProcessed: 0,
      deletedCount: 0,
      message: "Aucune donnée à agréger",
    };
  }

  const eventsByDate: Record<string, typeof events> = {};
  for (const event of events) {
    const dateString = event.createdAt.toISOString().split("T")[0];
    if (!eventsByDate[dateString]) eventsByDate[dateString] = [];
    eventsByDate[dateString].push(event);
  }

  const results: { date: string; eventsProcessed: number; pageViews: number; uniqueVisitors: number }[] = [];

  for (const [dateString, dayEvents] of Object.entries(eventsByDate)) {
    const pageViews = dayEvents.filter((e) => e.type === "PAGE_VIEW").length;
    const clicks: ClicksRecord = {};
    const visitorIdsSet = new Set<string>();

    for (const event of dayEvents) {
      visitorIdsSet.add(event.visitorId);
      if (event.type === "CLICK" && event.label) {
        clicks[event.label] = (clicks[event.label] || 0) + 1;
      }
    }

    const existing = await prisma.analyticsDaily.findUnique({ where: { date: dateString } });
    let finalPageViews = pageViews;
    let finalClicks: ClicksRecord = { ...clicks };
    const finalVisitorIds = new Set(visitorIdsSet);

    if (existing) {
      finalPageViews += existing.pageViews;
      finalClicks = mergeClicks(finalClicks, toClicksRecord(existing.clicks));
      const ids = Array.isArray(existing.visitorIds) ? (existing.visitorIds as string[]) : [];
      ids.forEach((id) => finalVisitorIds.add(id));
    }

    await prisma.analyticsDaily.upsert({
      where: { date: dateString },
      create: {
        date: dateString,
        pageViews: finalPageViews,
        clicks: finalClicks as object,
        uniqueVisitors: finalVisitorIds.size,
        visitorIds: Array.from(finalVisitorIds) as object,
      },
      update: {
        pageViews: finalPageViews,
        clicks: finalClicks as object,
        uniqueVisitors: finalVisitorIds.size,
        visitorIds: Array.from(finalVisitorIds) as object,
      },
    });

    results.push({
      date: dateString,
      eventsProcessed: dayEvents.length,
      pageViews: finalPageViews,
      uniqueVisitors: finalVisitorIds.size,
    });
  }

  const deleteResult = await prisma.analytics.deleteMany({});
  return {
    eventsProcessed: events.length,
    deletedCount: deleteResult.count,
    daysAggregated: results.length,
    details: results,
    message: "Aggregation completed successfully",
  };
}

export async function aggregateMonthlyStats(year: number, month: number) {
  const monthString = String(month).padStart(2, "0");
  const prefix = `${year}-${monthString}-`;

  const days = await prisma.analyticsDaily.findMany({
    where: { date: { startsWith: prefix } },
    orderBy: { date: "asc" },
  });

  if (days.length === 0) {
    return { year, month, daysCount: 0, deletedDays: 0, message: "Aucune donnée quotidienne" };
  }

  const dailyStats = days.map((day) => ({
    date: day.date,
    pageViews: day.pageViews,
    clicks: day.clicks,
    uniqueVisitors: day.uniqueVisitors,
    visitorIds: day.visitorIds,
  }));

  let pageViews = 0;
  const clicksSum: ClicksRecord = {};
  const visitorIdsSet = new Set<string>();

  for (const day of days) {
    pageViews += day.pageViews || 0;
    const c = toClicksRecord(day.clicks);
    for (const [k, v] of Object.entries(c)) {
      clicksSum[k] = (clicksSum[k] || 0) + v;
    }
    const ids = Array.isArray(day.visitorIds) ? (day.visitorIds as string[]) : [];
    ids.forEach((id) => visitorIdsSet.add(id));
  }

  await prisma.analyticsMonthly.upsert({
    where: { year_month: { year, month } },
    create: {
      year,
      month,
      pageViews,
      clicks: clicksSum as object,
      uniqueVisitors: visitorIdsSet.size,
      visitorIds: Array.from(visitorIdsSet) as object,
      dailyStats: dailyStats as object,
    },
    update: {
      pageViews,
      clicks: clicksSum as object,
      uniqueVisitors: visitorIdsSet.size,
      visitorIds: Array.from(visitorIdsSet) as object,
      dailyStats: dailyStats as object,
    },
  });

  const deleteResult = await prisma.analyticsDaily.deleteMany({
    where: { date: { startsWith: prefix } },
  });
  return {
    year,
    month,
    daysCount: days.length,
    pageViews,
    uniqueVisitors: visitorIdsSet.size,
    deletedDays: deleteResult.count,
    message: "Monthly aggregation completed",
  };
}

export async function aggregateYearlyStats(year: number) {
  const months = await prisma.analyticsMonthly.findMany({
    where: { year },
    orderBy: { month: "asc" },
  });

  if (months.length === 0) {
    return { year, monthsCount: 0, deletedMonths: 0, message: "Aucune donnée mensuelle" };
  }

  const monthlyStats = months.map((m) => ({
    month: m.month,
    pageViews: m.pageViews,
    clicks: m.clicks,
    uniqueVisitors: m.uniqueVisitors,
    visitorIds: m.visitorIds,
    dailyStats: m.dailyStats,
  }));

  let pageViews = 0;
  const clicksSum: ClicksRecord = {};
  const visitorIdsSet = new Set<string>();

  for (const m of months) {
    pageViews += m.pageViews || 0;
    const c = toClicksRecord(m.clicks);
    for (const [k, v] of Object.entries(c)) {
      clicksSum[k] = (clicksSum[k] || 0) + v;
    }
    const ids = Array.isArray(m.visitorIds) ? (m.visitorIds as string[]) : [];
    ids.forEach((id) => visitorIdsSet.add(id));
  }

  await prisma.analyticsYearly.upsert({
    where: { year },
    create: {
      year,
      pageViews,
      clicks: clicksSum as object,
      uniqueVisitors: visitorIdsSet.size,
      visitorIds: Array.from(visitorIdsSet) as object,
      monthlyStats: monthlyStats as object,
    },
    update: {
      pageViews,
      clicks: clicksSum as object,
      uniqueVisitors: visitorIdsSet.size,
      visitorIds: Array.from(visitorIdsSet) as object,
      monthlyStats: monthlyStats as object,
    },
  });

  const deleteResult = await prisma.analyticsMonthly.deleteMany({ where: { year } });
  return {
    year,
    monthsCount: months.length,
    pageViews,
    uniqueVisitors: visitorIdsSet.size,
    deletedMonths: deleteResult.count,
    message: "Yearly aggregation completed",
  };
}
