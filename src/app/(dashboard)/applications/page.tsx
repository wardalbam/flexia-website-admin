// Header is now global in RootLayout
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const statusLabels: Record<string, string> = {
  NEW: "Nieuw",
  REVIEWED: "Bekeken",
  CONTACTED: "Gecontacteerd",
  INTERVIEW_SCHEDULED: "Gesprek Gepland",
  HIRED: "Aangenomen",
  REJECTED: "Afgewezen",
  WITHDRAWN: "Teruggetrokken",
};

const statusColors: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-800",
  REVIEWED: "bg-yellow-100 text-yellow-800",
  CONTACTED: "bg-purple-100 text-purple-800",
  INTERVIEW_SCHEDULED: "bg-orange-100 text-orange-800",
  HIRED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  WITHDRAWN: "bg-gray-100 text-gray-800",
};

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string; page?: string }>;
}) {
  const params = await searchParams;
  const status = params.status;
  const search = params.search;
  const page = parseInt(params.page || "1");
  const limit = 20;

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  const [applications, total] = await Promise.all([
    prisma.application.findMany({
      where,
      include: { vacature: { select: { title: true, category: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.application.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <>
      <main className="p-4 space-y-6">
        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <form className="flex gap-3 flex-wrap" action="/applications" method="GET">
            <input
              type="text"
              name="search"
              placeholder="Zoek op naam of email..."
              defaultValue={search || ""}
              className="px-3 py-2 border border-input rounded-lg text-sm bg-background"
            />
            <select
              name="status"
              defaultValue={status || ""}
              className="px-3 py-2 border border-input rounded-lg text-sm bg-background"
            >
              <option value="">Alle statussen</option>
              {Object.entries(statusLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
            >
              Filteren
            </button>
          </form>
        </div>

        {/* Stats row */}
        <div className="flex gap-2 text-sm text-muted-foreground">
          <span>{total} sollicitatie{total !== 1 ? "s" : ""} gevonden</span>
          {totalPages > 1 && <span>- Pagina {page} van {totalPages}</span>}
        </div>

        {/* Applications list */}
        <div className="space-y-3">
          {applications.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                Geen sollicitaties gevonden.
              </CardContent>
            </Card>
          ) : (
          applications.map((app: any) => (
              <Link key={app.id} href={`/applications/${app.id}`}>
                <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                  <CardContent className="flex items-center justify-between py-4">
                    <div className="space-y-1">
                      <p className="font-medium">
                        {app.firstName} {app.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {app.email} &middot; {app.phone}
                      </p>
                      {app.vacature && (
                        <p className="text-xs text-muted-foreground">
                          {app.vacature.title}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={statusColors[app.status] || ""} variant="secondary">
                        {statusLabels[app.status] || app.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(app.createdAt).toLocaleDateString("nl-NL")}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            {page > 1 && (
              <Link
                href={`/applications?page=${page - 1}${status ? `&status=${status}` : ""}${search ? `&search=${search}` : ""}`}
                className="px-3 py-1.5 border border-input rounded-lg text-sm hover:bg-muted"
              >
                Vorige
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`/applications?page=${page + 1}${status ? `&status=${status}` : ""}${search ? `&search=${search}` : ""}`}
                className="px-3 py-1.5 border border-input rounded-lg text-sm hover:bg-muted"
              >
                Volgende
              </Link>
            )}
          </div>
        )}
      </main>
    </>
  );
}
