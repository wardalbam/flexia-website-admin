import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const applicationSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  birthDate: z.string().optional(),
  city: z.string().optional(),
  gender: z.string().optional(),
  experience: z.string().optional(),
  selectedVacatures: z.array(z.string()).default([]),
  availability: z.array(z.string()).default([]),
  vacatureId: z.string().optional(),
  source: z.string().default("website"),
});

// GET /api/applications - Protected
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { phone: { contains: search } },
    ];
  }

  const [applications, total] = await Promise.all([
    prisma.application.findMany({
      where,
      include: { vacature: { select: { title: true, slug: true, category: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.application.count({ where }),
  ]);

  return NextResponse.json({
    applications,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

// POST /api/applications - Public (for frontend submissions)
export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = applicationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  // If vacatureId is provided, verify it exists
  if (parsed.data.vacatureId) {
    const vacature = await prisma.vacature.findUnique({
      where: { id: parsed.data.vacatureId },
    });
    if (!vacature) {
      return NextResponse.json({ error: "Vacature niet gevonden" }, { status: 404 });
    }
  }

  const application = await prisma.application.create({
    data: parsed.data,
  });

  return NextResponse.json(application, { status: 201 });
}
