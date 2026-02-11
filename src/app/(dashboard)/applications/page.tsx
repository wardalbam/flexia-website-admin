// Header is now global in RootLayout
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { statusLabels, getStatusBadgeClasses } from "@/lib/status-colors";
import { cn } from "@/lib/utils";
import Link from "next/link";

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
      <main className="p-4 md:p-6 space-y-6">
        {/* Modern Filter Section */}
        <div className="bg-card rounded-xl border border-border shadow-sm p-4 md:p-6">
          <form className="flex flex-col md:flex-row gap-3" action="/applications" method="GET">
            <input
              type="text"
              name="search"
              placeholder="Zoek op naam of email..."
              defaultValue={search || ""}
              className="flex-1 px-4 py-2.5 border-2 border-border rounded-xl text-sm bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium"
            />
            <select
              name="status"
              defaultValue={status || ""}
              className="px-4 py-2.5 border-2 border-border rounded-xl text-sm bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-semibold min-w-[200px]"
            >
              <option value="">Alle statussen</option>
              {Object.entries(statusLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <Button type="submit" className="font-semibold">
              Filteren
            </Button>
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
                <Card className="hover:shadow-lg transition-all hover:scale-[1.01] group">
                  <CardContent className="flex flex-col md:flex-row md:items-center justify-between py-4 gap-3">
                    <div className="space-y-1 flex-1">
                      <p className="font-bold text-base tracking-tight group-hover:text-primary transition-colors">
                        {app.firstName} {app.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground font-medium">
                        {app.email} &middot; {app.phone}
                      </p>
                      {app.vacature && (
                        <p className="text-xs text-muted-foreground font-semibold">
                          {app.vacature.title}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
                      <Badge className={cn("font-bold", getStatusBadgeClasses(app.status))}>
                        {statusLabels[app.status] || app.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">
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
