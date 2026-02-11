import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const vacatureSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().min(1),
  slug: z.string().min(1),
  vacatureNumber: z.number().int().positive(),
  description: z.string().min(1),
  longDescription: z.string().min(1),
  seoContent: z.string().min(1),
  requirements: z.array(z.string()).min(1),
  benefits: z.array(z.string()).min(1),
  categoryId: z.string().nullable(),
  companyName: z.string().optional(),
  imageKey: z.string().min(1),
  employmentType: z.array(z.string()).min(1),
  city: z.string().min(1),
  location: z.string().optional(),
  salary: z.number().positive(),
  isActive: z.boolean(),
});

// GET /api/vacatures - Public endpoint
export async function GET(req: NextRequest) {
  // Use req.nextUrl which is a safe URL object provided by Next.js
  const { searchParams } = req.nextUrl;
  const active = searchParams.get("active");
  const categoryId = searchParams.get("categoryId");
  const city = searchParams.get("city");

  const where: Record<string, unknown> = {};
  if (active !== null) where.isActive = active === "true";
  if (categoryId) where.categoryId = categoryId;
  if (city) where.city = city;

  const vacatures = await prisma.vacature.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { applications: true } },
      category: true,
    },
  });

  return NextResponse.json(vacatures);
}

// POST /api/vacatures - Protected
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = vacatureSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const existing = await prisma.vacature.findFirst({
    where: {
      OR: [
        { slug: parsed.data.slug },
        { vacatureNumber: parsed.data.vacatureNumber },
      ],
    },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Een vacature met deze slug of nummer bestaat al" },
      { status: 409 }
    );
  }

  const vacature = await prisma.vacature.create({
    data: {
      ...parsed.data,
      createdById: session.user?.id,
      lastUpdatedById: session.user?.id,
    },
  });
  return NextResponse.json(vacature, { status: 201 });
}
