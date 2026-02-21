import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
  }

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    activeVacatures,
    totalApplications,
    newApplications,
    weeklyApplications,
    recentApplications,
    applicationsByVacature,
    applicationsByStatus,
    last30DaysApplications,
    latestVacatures,
  ] = await Promise.all([
    prisma.vacature.count({ where: { isActive: true } }),
    prisma.application.count(),
    prisma.application.count({ where: { status: "NEW" } }),
    prisma.application.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.application.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { vacature: { select: { title: true, category: true } } },
    }),
    // Applications grouped by vacature for bar chart
    prisma.application.groupBy({
      by: ["vacatureId"],
      _count: true,
      orderBy: { _count: { vacatureId: "desc" } },
      take: 8,
    }),
    // Applications grouped by status for donut chart
    prisma.application.groupBy({
      by: ["status"],
      _count: true,
    }),
    // Applications from the last 30 days for trend chart
    prisma.application.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
    // Latest vacatures for sidebar
    prisma.vacature.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, slug: true, location: true, publishedAt: true, isActive: true },
    }),
  ]);

  // Resolve vacature names for the by-vacature chart
  const vacatureIds = applicationsByVacature
    .map((g) => g.vacatureId)
    .filter(Boolean) as string[];
  const vacatures = vacatureIds.length > 0
    ? await prisma.vacature.findMany({
        where: { id: { in: vacatureIds } },
        select: { id: true, title: true },
      })
    : [];
  const vacatureMap = Object.fromEntries(vacatures.map((v) => [v.id, v.title]));

  // Build daily counts for the last 30 days
  const dailyCounts: Record<string, number> = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    dailyCounts[d.toISOString().slice(0, 10)] = 0;
  }
  for (const app of last30DaysApplications) {
    const key = new Date(app.createdAt).toISOString().slice(0, 10);
    if (key in dailyCounts) dailyCounts[key]++;
  }

  const response = NextResponse.json({
    stats: {
      activeVacatures,
      totalApplications,
      newApplications,
      weeklyApplications,
    },
    recentApplications,
    latestVacatures,
    charts: {
      applicationsTrend: Object.entries(dailyCounts).map(([date, count]) => ({
        date,
        count,
      })),
      applicationsByStatus: applicationsByStatus.map((g) => ({
        status: g.status,
        count: g._count,
      })),
      applicationsByVacature: applicationsByVacature.map((g) => ({
        vacature: g.vacatureId ? (vacatureMap[g.vacatureId] || "Onbekend") : "Algemeen",
        count: g._count,
      })),
    },
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
