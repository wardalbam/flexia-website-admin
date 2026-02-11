import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCategoryColor } from "@/lib/status-colors";
import { cn } from "@/lib/utils";
import {
  Edit,
  MapPin,
  Briefcase,
  Euro,
  Calendar,
  Users,
  CheckCircle2,
  Gift,
  ArrowLeft,
} from "lucide-react";

function getDaysOnline(publishedAt: Date): number {
  const now = new Date();
  const diff = now.getTime() - publishedAt.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export default async function VacatureDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const vacature = await prisma.vacature.findUnique({
    where: { id },
    include: {
      _count: {
        select: { applications: true },
      },
      createdBy: {
        select: { name: true, email: true },
      },
      lastUpdatedBy: {
        select: { name: true, email: true },
      },
      category: true,
    },
  });

  if (!vacature) {
    notFound();
  }

  // Fetch recent vacatures for sidebar (optimized - only essential fields)
  const allVacatures = await prisma.vacature.findMany({
    orderBy: { publishedAt: "desc" },
    take: 25,
    select: {
      id: true,
      title: true,
      category: {
        select: { name: true },
      },
      vacatureNumber: true,
      isActive: true,
      _count: {
        select: { applications: true },
      },
    },
  });

  const categoryColor = getCategoryColor(vacature.category?.name);
  const daysOnline = getDaysOnline(vacature.publishedAt);

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Sidebar with Vacature List - Desktop Only */}
      <aside className="hidden lg:block w-80 border-r border-border bg-card overflow-y-auto">
        <div className="p-4 border-b border-border sticky top-0 bg-card z-10">
          <Link href="/vacatures">
            <Button variant="ghost" size="sm" className="gap-2 font-bold">
              <ArrowLeft className="h-4 w-4" />
              Alle Vacatures
            </Button>
          </Link>
        </div>
        <div className="p-3 space-y-2">
          {allVacatures.map((v) => {
            const isActive = v.id === vacature.id;
            const vCategoryColor = getCategoryColor(v.category?.name);
            return (
              <Link key={v.id} href={`/vacatures/${v.id}`}>
                <div
                  className={cn(
                    "p-3 rounded-lg border transition-all cursor-pointer",
                    isActive
                      ? "bg-primary/5 border-primary shadow-sm"
                      : "border-border hover:bg-muted hover:border-muted-foreground/20"
                  )}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-bold text-sm line-clamp-2 flex-1">
                      {v.title}
                    </h4>
                    {!v.isActive && (
                      <Badge className="bg-red-500/10 text-red-700 border-red-500/20 text-xs px-1.5 py-0">
                        ✕
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      className={cn(
                        "rounded-full text-xs px-2 py-0.5",
                        vCategoryColor.bg,
                        vCategoryColor.text,
                        "border",
                        vCategoryColor.border
                      )}
                    >
                      {v.category?.name}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {v._count.applications}
                    </span>
                    <span>#{v.vacatureNumber}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 space-y-8">
          {/* Back Button - Mobile Only */}
          <div className="lg:hidden">
            <Link href="/vacatures">
              <Button variant="ghost" size="sm" className="gap-2 font-bold">
                <ArrowLeft className="h-4 w-4" />
                Terug
              </Button>
            </Link>
          </div>

          {/* Header */}
          <div>
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <Badge
                className={cn(
                  "rounded-full font-bold text-sm px-4 py-1.5",
                  categoryColor.bg,
                  categoryColor.text,
                  "border",
                  categoryColor.border
                )}
              >
                {vacature.category?.name}
              </Badge>
              {!vacature.isActive && (
                <Badge className="bg-red-500/10 text-red-700 border-red-500/20 font-semibold px-3 py-1">
                  Inactief
                </Badge>
              )}
              <span className="text-xs text-muted-foreground ml-auto">
                #{vacature.vacatureNumber}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
              {vacature.title}
            </h1>

            <p className="text-xl text-muted-foreground font-medium mb-6">
              {vacature.subtitle}
            </p>

            {/* Key Metrics - Inline */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
              <Link
                href={`/applications?vacatureId=${vacature.id}`}
                className="flex items-center gap-2 font-bold hover:text-primary transition-colors"
              >
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <span className="text-2xl font-black">{vacature._count.applications}</span>
                  <span className="text-muted-foreground ml-1">sollicitaties</span>
                </div>
              </Link>

              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Calendar className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <span className="text-2xl font-black">{daysOnline}</span>
                  <span className="text-muted-foreground ml-1">dagen online</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">
                  {vacature.location || vacature.city}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Euro className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">€{vacature.salary}/uur</span>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <div>
            <Link href={`/vacatures/${vacature.id}/edit`}>
              <Button size="lg" className="font-bold gap-2">
                <Edit className="h-5 w-5" />
                Bewerken
              </Button>
            </Link>
          </div>

          {/* Dienstverband */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Briefcase className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-bold">Dienstverband</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {vacature.employmentType.map((type) => (
                <Badge
                  key={type}
                  className="bg-muted text-foreground border border-border px-4 py-1.5 text-sm font-semibold"
                >
                  {type.replace("_", " ")}
                </Badge>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-2xl font-black mb-3">Beschrijving</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {vacature.description}
            </p>
          </div>

          {/* Long Description */}
          {vacature.longDescription && vacature.longDescription !== vacature.description && (
            <div>
              <h2 className="text-2xl font-black mb-3">Meer informatie</h2>
              <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {vacature.longDescription}
              </div>
            </div>
          )}

          {/* Requirements */}
          {vacature.requirements.length > 0 && (
            <div>
              <h2 className="text-2xl font-black mb-4">Vereisten</h2>
              <ul className="space-y-3">
                {vacature.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits */}
          {vacature.benefits.length > 0 && (
            <div>
              <h2 className="text-2xl font-black mb-4">Wat bieden wij?</h2>
              <ul className="space-y-3">
                {vacature.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Gift className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Metadata Footer */}
          <div className="pt-6 border-t border-border text-sm text-muted-foreground space-y-3">
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <span>
                Gepubliceerd:{" "}
                <strong className="text-foreground">
                  {new Date(vacature.publishedAt).toLocaleDateString("nl-NL", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </strong>
              </span>
              <span>
                Laatst bijgewerkt:{" "}
                <strong className="text-foreground">
                  {new Date(vacature.updatedAt).toLocaleDateString("nl-NL", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </strong>
              </span>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {vacature.createdBy && (
                <span>
                  Aangemaakt door:{" "}
                  <strong className="text-foreground">
                    {vacature.createdBy.name || vacature.createdBy.email}
                  </strong>
                </span>
              )}
              {vacature.lastUpdatedBy && (
                <span>
                  Laatst bewerkt door:{" "}
                  <strong className="text-foreground">
                    {vacature.lastUpdatedBy.name || vacature.lastUpdatedBy.email}
                  </strong>
                </span>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
