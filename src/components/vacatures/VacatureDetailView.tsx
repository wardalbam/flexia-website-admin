"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

type Vacature = any;

function getDaysOnline(publishedAt: string | Date): number {
  const now = new Date();
  const published = new Date(publishedAt);
  const diff = now.getTime() - published.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function VacatureDetailView({
  initialVacature,
  allVacatures,
}: {
  initialVacature: Vacature;
  allVacatures: Vacature[];
}) {
  const router = useRouter();
  const [selectedVacature, setSelectedVacature] = useState(initialVacature);
  const [isLoading, setIsLoading] = useState(false);

  const handleVacatureClick = async (vacatureId: string) => {
    if (vacatureId === selectedVacature.id) return;

    setIsLoading(true);

    // Update URL without full page reload
    router.push(`/vacatures/${vacatureId}`, { scroll: false });

    try {
      // Fetch the vacancy details
      const response = await fetch(`/api/vacatures/${vacatureId}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedVacature(data);
      }
    } catch (error) {
      console.error("Failed to load vacancy:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const categoryColor = getCategoryColor(selectedVacature.category?.name);
  const daysOnline = getDaysOnline(selectedVacature.publishedAt);

  return (
    // Make layout flow naturally (no fixed outer height) so mobile scroll is the page's
    // responsibility and we avoid nested scroll gaps. Stack on mobile, row on large.
    <div className="flex flex-col lg:flex-row">
      {/* Sidebar with Vacature List - Desktop Only */}
      <aside className="hidden lg:block w-80 border-r border-border bg-card overflow-y-auto">
        <div className="p-4 border-b border-border sticky top-0 bg-card z-10">
          <a href="/vacatures">
            <Button variant="ghost" size="sm" className="gap-2 font-bold">
              <ArrowLeft className="h-4 w-4" />
              Alle Vacatures
            </Button>
          </a>
        </div>
        <div className="p-3 space-y-2">
          {allVacatures.map((v) => {
            const isActive = v.id === selectedVacature.id;
            const vCategoryColor = getCategoryColor(v.category?.name);
            return (
              <button
                key={v.id}
                onClick={() => handleVacatureClick(v.id)}
                className={cn(
                  "w-full text-left p-3 rounded-lg border transition-all cursor-pointer",
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
              </button>
            );
          })}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div
          className={cn(
            "max-w-4xl mx-auto p-6 space-y-8 transition-opacity duration-200",
            isLoading && "opacity-50 pointer-events-none"
          )}
        >
          {/* Back Button - Mobile Only */}
          <div className="lg:hidden">
            <a href="/vacatures">
              <Button variant="ghost" size="sm" className="gap-2 font-bold">
                <ArrowLeft className="h-4 w-4" />
                Terug
              </Button>
            </a>
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
                {selectedVacature.category?.name}
              </Badge>
              {!selectedVacature.isActive && (
                <Badge className="bg-red-500/10 text-red-700 border-red-500/20 font-semibold px-3 py-1">
                  Inactief
                </Badge>
              )}
              <span className="text-xs text-muted-foreground ml-auto">
                #{selectedVacature.vacatureNumber}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
              {selectedVacature.title}
            </h1>

            <p className="text-xl text-muted-foreground font-medium mb-6">
              {selectedVacature.subtitle}
            </p>

            {/* Key Metrics - Inline */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
              <a
                href={`/applications?vacatureId=${selectedVacature.id}`}
                className="flex items-center gap-2 font-bold hover:text-primary transition-colors"
              >
                <div className="p-2 bg-muted/50 rounded-lg">
                  <Users className="h-4 w-4 text-foreground" />
                </div>
                <div>
                  <span className="text-2xl font-black">{selectedVacature._count.applications}</span>
                  <span className="text-muted-foreground ml-1">sollicitaties</span>
                </div>
              </a>

              <div className="flex items-center gap-2">
                <div className="p-2 bg-muted/50 rounded-lg">
                  <Calendar className="h-4 w-4 text-foreground" />
                </div>
                <div>
                  <span className="text-2xl font-black">{daysOnline}</span>
                  <span className="text-muted-foreground ml-1">dagen online</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">
                  {selectedVacature.location || selectedVacature.city}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Euro className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">€{selectedVacature.salary}/uur</span>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <div>
            <a href={`/vacatures/${selectedVacature.id}/edit`}>
              <Button size="lg" className="font-bold gap-2">
                <Edit className="h-5 w-5" />
                Bewerken
              </Button>
            </a>
          </div>

          {/* Dienstverband */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Briefcase className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-bold">Dienstverband</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedVacature.employmentType.map((type: string) => (
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
              {selectedVacature.description}
            </p>
          </div>

          {/* Long Description */}
          {selectedVacature.longDescription && selectedVacature.longDescription !== selectedVacature.description && (
            <div>
              <h2 className="text-2xl font-black mb-3">Meer informatie</h2>
              <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {selectedVacature.longDescription}
              </div>
            </div>
          )}

          {/* Requirements */}
          {selectedVacature.requirements?.length > 0 && (
            <div>
              <h2 className="text-2xl font-black mb-4">Vereisten</h2>
              <ul className="space-y-3">
                {selectedVacature.requirements.map((req: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits */}
          {selectedVacature.benefits?.length > 0 && (
            <div>
              <h2 className="text-2xl font-black mb-4">Wat bieden wij?</h2>
              <ul className="space-y-3">
                {selectedVacature.benefits.map((benefit: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <Gift className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
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
                  {new Date(selectedVacature.publishedAt).toLocaleDateString("nl-NL", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </strong>
              </span>
              <span>
                Laatst bijgewerkt:{" "}
                <strong className="text-foreground">
                  {new Date(selectedVacature.updatedAt).toLocaleDateString("nl-NL", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </strong>
              </span>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {selectedVacature.createdBy && (
                <span>
                  Aangemaakt door:{" "}
                  <strong className="text-foreground">
                    {selectedVacature.createdBy.name || selectedVacature.createdBy.email}
                  </strong>
                </span>
              )}
              {selectedVacature.lastUpdatedBy && (
                <span>
                  Laatst bewerkt door:{" "}
                  <strong className="text-foreground">
                    {selectedVacature.lastUpdatedBy.name || selectedVacature.lastUpdatedBy.email}
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
