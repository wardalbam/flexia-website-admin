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
  category: z.enum(["CATERING", "SPOELKEUKEN", "KEUKENHULP", "BEDIENING"]),
  imageKey: z.string().min(1),
  employmentType: z.array(z.string()).min(1),
  location: z.string().min(1),
  salary: z.number().positive(),
  isActive: z.boolean(),
});

// GET /api/vacatures/[id] - Public (accepts id or slug)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const vacature = await prisma.vacature.findFirst({
    where: {
      OR: [{ id }, { slug: id }],
    },
    include: { _count: { select: { applications: true } } },
  });

  if (!vacature) {
    return NextResponse.json({ error: "Vacature niet gevonden" }, { status: 404 });
  }

  return NextResponse.json(vacature);
}

// PUT /api/vacatures/[id] - Protected
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const parsed = vacatureSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const existing = await prisma.vacature.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Vacature niet gevonden" }, { status: 404 });
  }

  const duplicate = await prisma.vacature.findFirst({
    where: {
      OR: [
        { slug: parsed.data.slug },
        { vacatureNumber: parsed.data.vacatureNumber },
      ],
      NOT: { id },
    },
  });

  if (duplicate) {
    return NextResponse.json(
      { error: "Een andere vacature met deze slug of nummer bestaat al" },
      { status: 409 }
    );
  }

  const vacature = await prisma.vacature.update({
    where: { id },
    data: parsed.data,
  });

  return NextResponse.json(vacature);
}

// DELETE /api/vacatures/[id] - Protected
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.vacature.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Vacature niet gevonden" }, { status: 404 });
  }

  await prisma.vacature.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
