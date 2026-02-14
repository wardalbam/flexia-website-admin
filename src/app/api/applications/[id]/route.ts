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
    include: {
      vacature: {
        include: {
          category: true,
        },
      },
      history: {
        orderBy: { createdAt: "desc" },
      },
    },
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

  const userId = session.user?.id ?? null;
  const userName = session.user?.name || session.user?.email || null;

  // Build history entries for changes
  const historyEntries: {
    applicationId: string;
    type: string;
    oldStatus?: string;
    newStatus?: string;
    note?: string;
    userId: string | null;
    userName: string | null;
  }[] = [];

  if (parsed.data.status && parsed.data.status !== existing.status) {
    historyEntries.push({
      applicationId: id,
      type: "STATUS_CHANGE",
      oldStatus: existing.status,
      newStatus: parsed.data.status,
      userId,
      userName,
    });
  }

  if (parsed.data.notes !== undefined && parsed.data.notes !== existing.notes && parsed.data.notes) {
    historyEntries.push({
      applicationId: id,
      type: "NOTE",
      note: parsed.data.notes,
      userId,
      userName,
    });
  }

  // Use transaction: create history first, then update application (so included history is complete)
  const application = await prisma.$transaction(async (tx) => {
    for (const entry of historyEntries) {
      await tx.applicationHistory.create({ data: entry });
    }

    return tx.application.update({
      where: { id },
      data: parsed.data,
      include: {
        vacature: {
          include: {
            category: true,
          },
        },
        history: {
          orderBy: { createdAt: "desc" },
        },
      },
    });
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
