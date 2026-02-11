import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { Briefcase, Users, UserPlus, CalendarDays } from "lucide-react";
import Link from "next/link";

const statusColors: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-800",
  REVIEWED: "bg-yellow-100 text-yellow-800",
  CONTACTED: "bg-purple-100 text-purple-800",
  INTERVIEW_SCHEDULED: "bg-orange-100 text-orange-800",
  HIRED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  WITHDRAWN: "bg-gray-100 text-gray-800",
};

const statusLabels: Record<string, string> = {
  NEW: "Nieuw",
  REVIEWED: "Beoordeeld",
  CONTACTED: "Gecontacteerd",
  INTERVIEW_SCHEDULED: "Gesprek gepland",
  HIRED: "Aangenomen",
  REJECTED: "Afgewezen",
  WITHDRAWN: "Teruggetrokken",
};

export default async function DashboardPage() {
  const [
    activeVacatures,
    totalApplications,
    newApplications,
    weekApplications,
    recentApplications,
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
  ]);

  const stats = [
    { label: "Actieve Vacatures", value: activeVacatures, icon: Briefcase, color: "text-primary" },
    { label: "Totaal Sollicitaties", value: totalApplications, icon: Users, color: "text-blue-600" },
    { label: "Nieuwe Sollicitaties", value: newApplications, icon: UserPlus, color: "text-green-600" },
    { label: "Deze Week", value: weekApplications, icon: CalendarDays, color: "text-purple-600" },
  ];

  return (
    <>
      <Header title="Dashboard" />
      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`${stat.color}`}>
                    <stat.icon className="h-8 w-8 opacity-80" />
                  </div>
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
            {recentApplications.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Nog geen sollicitaties ontvangen
              </p>
            ) : (
              <div className="space-y-3">
                {recentApplications.map((app) => (
                  <Link
                    key={app.id}
                    href={`/applications/${app.id}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary text-sm font-bold">
                          {app.firstName[0]}{app.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {app.firstName} {app.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">{app.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right hidden sm:block">
                        <p className="text-xs text-muted-foreground">
                          {app.selectedVacatures.join(", ")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(app.createdAt).toLocaleDateString("nl-NL")}
                        </p>
                      </div>
                      <Badge variant="secondary" className={statusColors[app.status]}>
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
    </>
  );
}
