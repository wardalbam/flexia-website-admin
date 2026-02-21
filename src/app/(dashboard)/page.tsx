"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { statusLabels, getStatusBadgeClasses } from "@/lib/status-colors";
import { Briefcase, Users, UserPlus, CalendarDays, TrendingUp, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import useSWR from "swr";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

const STATUS_COLORS: Record<string, string> = {
  NEW: "#3b82f6",
  REVIEWED: "#eab308",
  CONTACTED: "#a855f7",
  INTERVIEW_SCHEDULED: "#f97316",
  HIRED: "#22c55e",
  REJECTED: "#ef4444",
  WITHDRAWN: "#6b7280",
};

export default function DashboardPage() {
  const { data, isLoading } = useSWR("/api/dashboard/stats");

  if (isLoading || !data) {
    return (
      <div className="p-4 md:p-6 space-y-6 animate-fade-in">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-72 rounded-xl" />
          <Skeleton className="h-72 rounded-xl" />
        </div>
      </div>
    );
  }

  const { stats, recentApplications, latestVacatures, charts } = data;

  const statCards = [
    { label: "Actieve Vacatures", value: stats.activeVacatures, icon: Briefcase, color: "from-primary/20 to-primary/5", iconColor: "text-primary" },
    { label: "Totaal Sollicitaties", value: stats.totalApplications, icon: Users, color: "from-blue-500/20 to-blue-500/5", iconColor: "text-blue-500" },
    { label: "Nieuwe Sollicitaties", value: stats.newApplications, icon: UserPlus, color: "from-green-500/20 to-green-500/5", iconColor: "text-green-500" },
    { label: "Deze Week", value: stats.weeklyApplications, icon: CalendarDays, color: "from-purple-500/20 to-purple-500/5", iconColor: "text-purple-500" },
  ];

  return (
    <div className="p-3 md:p-5 space-y-6 animate-fade-in">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-black tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Overzicht van je recruitment activiteiten</p>
      </div>

      {/* Recent Applications (moved up) */}
      <Card className="shadow-layered border-0 animate-fade-in">
        <CardHeader className="flex items-center justify-between pb-2">
          <CardTitle className="text-base font-bold">Recente Sollicitaties</CardTitle>
          <Link href="/applications" className="text-xs text-primary hover:underline font-semibold">Bekijk alles</Link>
        </CardHeader>
        <CardContent className="p-3">
          {!recentApplications || recentApplications.length === 0 ? (
            <p className="text-muted-foreground text-center py-6 text-sm">Nog geen sollicitaties ontvangen</p>
          ) : (
            <div className="space-y-1">
              {recentApplications.map((app: any, i: number) => (
                <Link
                  key={app.id}
                  href={`/applications/${app.id}`}
                  className={cn("flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-all duration-200 group", `animate-fade-in stagger-${Math.min(i + 1, 6)}`)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-primary text-sm font-bold">{app.firstName[0]}{app.lastName[0]}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">{app.firstName} {app.lastName}</p>
                      <p className="text-xs text-muted-foreground truncate">{app.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-muted-foreground hidden sm:block">
                      {new Date(app.createdAt).toLocaleDateString("nl-NL")}
                    </span>
                    <Badge className={cn("font-bold text-xs", getStatusBadgeClasses(app.status))}>
                      {statusLabels[app.status] || app.status}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Cards (compact) */}
      <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
        {statCards.slice(0, 2).map((stat, i) => (
          <Card key={stat.label} className={cn("overflow-hidden hover-lift group border-0 shadow-layered", `animate-fade-in stagger-${i + 1}`)}>
            <CardContent className="p-4 relative">
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-40 group-hover:opacity-100 transition-opacity duration-300 rounded-xl", stat.color)} />
              <div className="relative">
                <div className="p-2 rounded-lg bg-background/80 w-fit mb-3">
                  <stat.icon className={cn("h-5 w-5", stat.iconColor)} />
                </div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{stat.label}</p>
                <p className="text-2xl font-extrabold mt-1 tracking-tight">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications Trend */}
        <Card className="shadow-layered border-0 animate-fade-in stagger-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold">Sollicitaties (30 dagen)</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={charts.applicationsTrend} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00c896" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00c896" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => {
                      const d = new Date(v);
                      return `${d.getDate()}/${d.getMonth() + 1}`;
                    }}
                    stroke="var(--muted-foreground)"
                    interval="preserveStartEnd"
                  />
                  <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "0.75rem",
                      fontSize: 13,
                    }}
                    labelFormatter={(v) => new Date(v).toLocaleDateString("nl-NL", { day: "numeric", month: "long" })}
                  />
                  <Area type="monotone" dataKey="count" stroke="#00c896" strokeWidth={2} fill="url(#colorCount)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Applications by Status */}
        <Card className="shadow-layered border-0 animate-fade-in stagger-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">Status Verdeling</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-56 flex items-center">
              <div className="w-1/2 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={charts.applicationsByStatus}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="count"
                      nameKey="status"
                    >
                      {charts.applicationsByStatus.map((entry: any) => (
                        <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || "#6b7280"} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "0.75rem",
                        fontSize: 13,
                      }}
                      formatter={(value: any, name: any) => [value, statusLabels[name] || name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-1/2 space-y-2">
                {charts.applicationsByStatus.map((entry: any) => (
                  <div key={entry.status} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: STATUS_COLORS[entry.status] || "#6b7280" }} />
                      <span className="text-muted-foreground text-xs">{statusLabels[entry.status] || entry.status}</span>
                    </div>
                    <span className="font-bold text-xs">{entry.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Applications by Vacature + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-layered border-0 animate-fade-in stagger-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">Sollicitaties per Vacature</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.applicationsByVacature} layout="vertical" margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" allowDecimals={false} />
                  <YAxis
                    type="category"
                    dataKey="vacature"
                    tick={{ fontSize: 11 }}
                    stroke="var(--muted-foreground)"
                    width={120}
                    tickFormatter={(v) => (v.length > 18 ? v.slice(0, 18) + "..." : v)}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "0.75rem",
                      fontSize: 13,
                    }}
                  />
                  <Bar dataKey="count" fill="#00c896" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-layered border-0 animate-fade-in stagger-5">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">Snel Acties</CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <ul className="space-y-2">
                <li>
                  <Link href="/vacatures/new" className="text-sm text-primary hover:underline font-semibold">Nieuwe vacature aanmaken</Link>
                </li>
                <li>
                  <Link href="/applications" className="text-sm text-primary hover:underline font-semibold">Bekijk sollicitaties</Link>
                </li>
              </ul>
            </CardContent>
          </Card>
          
        </div>
      </div>

      {/* End dashboard content */}
    </div>
  );
}
