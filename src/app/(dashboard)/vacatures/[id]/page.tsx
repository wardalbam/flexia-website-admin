import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { VacatureDetailView } from "@/components/vacatures/VacatureDetailView";

export default async function VacatureDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const vacature = await prisma.vacature.findUnique({
    where: { id },
    include: {
      _count: {
        select: { applications: true },
      },
      createdBy: {
        select: { name: true, email: true },
      },
      lastUpdatedBy: {
        select: { name: true, email: true },
      },
      category: true,
    },
  });

  if (!vacature) {
    notFound();
  }

  // Fetch recent vacatures for sidebar (optimized - only essential fields)
  const allVacatures = await prisma.vacature.findMany({
    orderBy: { publishedAt: "desc" },
    take: 25,
    select: {
      id: true,
      title: true,
      category: {
        select: { name: true },
      },
      vacatureNumber: true,
      isActive: true,
      _count: {
        select: { applications: true },
      },
    },
  });

  return (
    <VacatureDetailView
      initialVacature={JSON.parse(JSON.stringify(vacature))}
      allVacatures={JSON.parse(JSON.stringify(allVacatures))}
    />
  );
}
