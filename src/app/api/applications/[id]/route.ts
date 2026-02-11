import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const updateSchema = z.object({
  status: z.enum(["NEW", "REVIEWED", "CONTACTED", "INTERVIEW_SCHEDULED", "HIRED", "REJECTED", "WITHDRAWN"]).optional(),
  notes: z.string().optional(),
});

// GET /api/applications/[id] - Protected
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
  }

  const { id } = await params;

  const application = await prisma.application.findUnique({
    where: { id },
    include: { vacature: true },
  });

  if (!application) {
    return NextResponse.json({ error: "Sollicitatie niet gevonden" }, { status: 404 });
  }

  return NextResponse.json(application);
}

// PATCH /api/applications/[id] - Protected (update status/notes)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const parsed = updateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const existing = await prisma.application.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Sollicitatie niet gevonden" }, { status: 404 });
  }

  const application = await prisma.application.update({
    where: { id },
    data: parsed.data,
    include: { vacature: true },
  });

  return NextResponse.json(application);
}

// DELETE /api/applications/[id] - Protected
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.application.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Sollicitatie niet gevonden" }, { status: 404 });
  }

  await prisma.application.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
