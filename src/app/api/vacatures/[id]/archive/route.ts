import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// POST /api/vacatures/[id]/archive - Toggle archive status
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { archived } = body;

  const existing = await prisma.vacature.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Vacature niet gevonden" }, { status: 404 });
  }

  const vacature = await prisma.vacature.update({
    where: { id },
    data: {
      archived: archived === true,
      lastUpdatedById: session.user?.id,
    },
  });

  return NextResponse.json(vacature);
}
