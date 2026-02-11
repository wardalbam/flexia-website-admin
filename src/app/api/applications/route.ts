import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

// Allowed frontend origins. In production you should set FRONTEND_ORIGIN to
// https://flexiajobs.nl (or whatever your public site is). During
// development we accept localhost origins so local frontends can post.
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "https://flexiajobs.nl";
const DEV_LOCAL_ORIGINS = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3001",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

function isOriginAllowed(origin: string | null) {
  if (!origin) return false;
  if (process.env.NODE_ENV === "development") {
    return DEV_LOCAL_ORIGINS.includes(origin) || origin === FRONTEND_ORIGIN;
  }
  return origin === FRONTEND_ORIGIN;
}

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
  isGeneral: z.boolean().default(false),
  motivation: z.string().optional(),
});

// GET /api/applications - Protected
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
  }

  // Use req.nextUrl which is a safe URL object provided by Next.js
  const { searchParams } = req.nextUrl;
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
  // Basic origin check: allow only expected frontend origins to POST here.
  const origin = req.headers.get("origin");
  if (!isOriginAllowed(origin)) {
    return new NextResponse(JSON.stringify({ error: "Origin not allowed" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Set CORS header to allow the calling origin when allowed
  const corsOrigin = origin ?? FRONTEND_ORIGIN;
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

  const application = await prisma.application.create({ data: parsed.data });

  const res = NextResponse.json(application, { status: 201 });
  res.headers.set("Access-Control-Allow-Origin", corsOrigin);
  return res;
}

// Support CORS preflight from the frontend
export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (!isOriginAllowed(origin)) {
    return new NextResponse(null, { status: 204 });
  }

  const res = new NextResponse(null, { status: 204 });
  res.headers.set("Access-Control-Allow-Origin", origin ?? FRONTEND_ORIGIN);
  res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return res;
}
