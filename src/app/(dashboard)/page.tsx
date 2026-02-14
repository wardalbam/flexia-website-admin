// Header is now global in RootLayout
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { statusLabels, getStatusBadgeClasses } from "@/lib/status-colors";
import { Briefcase, Users, UserPlus, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default async function DashboardPage() {
  const [
    activeVacatures,
    totalApplications,
    newApplications,
    weekApplications,
    recentApplications,
    latestVacatures,
  ] = await Promise.all([
    prisma.vacature.count({ where: { isActive: true } }),
    prisma.application.count(),
    prisma.application.count({ where: { status: "NEW" } }),
    prisma.application.count({
      where: {
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    }),
    prisma.application.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { vacature: { select: { title: true } } },
    }),
    prisma.vacature.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, slug: true, location: true, publishedAt: true, isActive: true },
    }),
  ]);

  const recentApplicationsTyped = recentApplications as any[];
  const latestVacaturesTyped = latestVacatures as any[];

  const stats = [
    { label: "Actieve Vacatures", value: activeVacatures, icon: Briefcase, color: "text-primary" },
    { label: "Totaal Sollicitaties", value: totalApplications, icon: Users, color: "text-blue-600" },
    { label: "Nieuwe Sollicitaties", value: newApplications, icon: UserPlus, color: "text-green-600" },
    { label: "Deze Week", value: weekApplications, icon: CalendarDays, color: "text-purple-600" },
  ];

  return (
    <>
      <div className="p-4 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <Card key={stat.label} className="overflow-hidden hover-lift group">
                  <CardContent className="p-6 relative">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity" />
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={cn("p-2 rounded-lg bg-gradient-to-br",
                          stat.color === "text-primary" ? "from-primary/20 to-primary/10" :
                          stat.color === "text-blue-600" ? "from-blue-500/20 to-blue-500/10" :
                          stat.color === "text-green-600" ? "from-green-500/20 to-green-500/10" :
                          "from-purple-500/20 to-purple-500/10"
                        )}>
                          <stat.icon className={cn("h-5 w-5", stat.color)} />
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-muted-foreground">{stat.label}</p>
                      <p className="text-4xl font-black mt-2 tracking-tight">{stat.value}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Applications */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recente Sollicitaties</CardTitle>
                <Link href="/applications" className="text-sm text-primary hover:underline">
                  Bekijk alles
                </Link>
              </CardHeader>
              <CardContent>
                {recentApplicationsTyped.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Nog geen sollicitaties ontvangen</p>
                ) : (
                  <div className="space-y-3">
                    {recentApplicationsTyped.map((app: any) => (
                      <Link
                        key={app.id}
                        href={`/applications/${app.id}`}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-all duration-300"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-primary text-sm font-bold">{app.firstName[0]}{app.lastName[0]}</span>
                          </div>
                          <div>
                            <p className="font-medium text-sm">{app.firstName} {app.lastName}</p>
                            <p className="text-xs text-muted-foreground">{app.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right hidden sm:block">
                            <p className="text-xs text-muted-foreground">{app.selectedVacatures.join(", ")}</p>
                            <p className="text-xs text-muted-foreground">{new Date(app.createdAt).toLocaleDateString("nl-NL")}</p>
                          </div>
                          <Badge className={cn("font-bold", getStatusBadgeClasses(app.status))}>
                            {statusLabels[app.status] || app.status}
                          </Badge>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right column: latest vacatures and quick actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex items-center justify-between">
                <CardTitle>Laatste Vacatures</CardTitle>
                <Link href="/vacatures" className="text-sm text-primary hover:underline">Bekijk alles</Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {latestVacaturesTyped.map((v: any) => (
                    <Link key={v.id} href={`/vacatures/${v.slug}`} className="flex items-center justify-between p-2 rounded hover:bg-muted/50">
                      <div>
                        <p className="font-medium">{v.title}</p>
                        <p className="text-xs text-muted-foreground">{v.location}</p>
                      </div>
                      <div className="text-xs text-muted-foreground">{new Date(v.publishedAt).toLocaleDateString("nl-NL")}</div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Snel Acties</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <Link href="/vacatures/new" className="inline-flex items-center justify-center rounded-full bg-[var(--brand)] text-black px-6 py-2.5 text-sm font-semibold hover:bg-[var(--brand-light)] transition-all duration-300 hover:-translate-y-[1px]">Nieuwe vacature aanmaken</Link>
                  <Link href="/applications" className="inline-flex items-center justify-center rounded-full border border-border bg-background px-6 py-2.5 text-sm font-semibold hover:bg-muted transition-all duration-300">Bekijk sollicitaties</Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
