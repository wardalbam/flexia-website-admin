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

  const [
    activeVacatures,
    totalApplications,
    newApplications,
    weeklyApplications,
    recentApplications,
    applicationsByCategory,
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
    prisma.application.groupBy({
      by: ["vacatureId"],
      _count: true,
      orderBy: { _count: { vacatureId: "desc" } },
      take: 10,
    }),
  ]);

  return NextResponse.json({
    stats: {
      activeVacatures,
      totalApplications,
      newApplications,
      weeklyApplications,
    },
    recentApplications,
    applicationsByCategory,
  });
}
