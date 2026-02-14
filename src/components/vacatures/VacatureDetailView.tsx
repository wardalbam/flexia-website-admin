"use client";

import { useState, useEffect } from "react";
import useSWR, { mutate as globalMutate } from "swr";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { getCategoryColor } from "@/lib/status-colors";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Edit,
  Trash2,
  MapPin,
  Briefcase,
  Euro,
  Calendar,
  Users,
  CheckCircle2,
  Gift,
  ArrowLeft,
  Share2,
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
  onClose,
}: {
  initialVacature: Vacature;
  allVacatures: Vacature[];
  onClose?: () => void;
}) {
  const router = useRouter();
  // Track the currently selected vacancy id. SWR will provide cached
  // data for the selected id when available.
  const [selectedId, setSelectedId] = useState<string>(initialVacature.id);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [entered, setEntered] = useState(false);
  const fetcher = (url: string) => fetch(url).then((r) => r.json());

  // Use SWR to fetch and cache vacancy details across the admin session.
  const { data: selectedVacature, error } = useSWR(
    selectedId ? `/api/vacatures/${selectedId}` : null,
    fetcher,
    {
      fallbackData: selectedId === initialVacature.id ? initialVacature : undefined,
      revalidateOnFocus: false,
      // When we provide the initialVacature that matches selectedId we don't want
      // SWR to revalidate on mount — we want to use the already-fetched data
      // from the list to avoid extra network requests and spinners.
      revalidateOnMount: false,
      revalidateIfStale: false,
    }
  );

  // Provide a safe, minimal fallback object so the UI can render while
  // SWR is fetching or when data is temporarily undefined. This prevents
  // client-side crashes like "Cannot read properties of undefined (reading 'category')".
  const vacancy: Vacature = selectedVacature ?? {
    id: selectedId,
    title: "",
    subtitle: "",
    description: "",
    longDescription: "",
    requirements: [],
    benefits: [],
    employmentType: [],
    city: "",
    location: "",
    salary: 0,
    isActive: false,
    archived: false,
    vacatureNumber: 0,
    _count: { applications: 0 },
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: null,
    lastUpdatedBy: null,
  };

  const handleVacatureClick = async (vacatureId: string) => {
    if (vacatureId === selectedId) return;

    setIsLoading(true);
    // Update URL without full page reload
    router.push(`/vacatures/${vacatureId}`, { scroll: false });

    // Let SWR handle cache: set the selected id which will trigger SWR to
    // return cached data immediately if present, or fetch if not.
    setSelectedId(vacatureId);

    // No need to await here; let SWR update `selectedVacature` asynchronously.
    setIsLoading(false);
  };

  const prefetchVacature = async (vacatureId: string) => {
    // Use SWR's global mutate to prefetch and cache the vacancy detail.
    const key = `/api/vacatures/${vacatureId}`;
    try {
      await globalMutate(key, fetcher(key), { revalidate: false });
    } catch (e) {
      // ignore prefetch errors
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    // Optimistically remove vacancy from list cache
    try {
      globalMutate("/api/vacatures", (prev: any) => {
        if (!prev) return prev;
        return Array.isArray(prev) ? prev.filter((p: any) => p.id !== vacancy.id) : prev;
      }, false);
    } catch (e) {}
    try {
      const res = await fetch(`/api/vacatures/${vacancy.id}`, {
        method: "DELETE",
      });
    } catch {
      toast.error("Er ging iets mis bij het verwijderen");
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  const handleShare = async () => {
    // Prefer a configured public frontend origin, fall back to the public site used in repo
    const origin = (process.env.NEXT_PUBLIC_FRONTEND_URL as string) || "https://www.flexiajobs.nl";
    const publicPath = `/singel/${vacancy.id}`;
    const url = `${origin.replace(/\/$/, "")}${publicPath}`;

    try {
      if (navigator.share) {
        await navigator.share({ title: vacancy.title || "Vacature", url });
        toast.success("Link gedeeld");
        return;
      }

      await navigator.clipboard.writeText(url);
      toast.success("Link gekopieerd naar klembord");
    } catch (err) {
      // fallback: open the link in a new tab
      window.open(url, "_blank");
    }
  };

  const categoryColor = getCategoryColor(vacancy.category?.name);
  const daysOnline = vacancy.publishedAt ? getDaysOnline(vacancy.publishedAt) : 0;

  // Show a small skeleton for content when switching vacancies to avoid
  // a jarring layout flash — this makes transitions feel smoother.
  const [contentVisible, setContentVisible] = useState(true);
  useEffect(() => {
    // Hide content immediately, then reveal after a short delay.
    setContentVisible(false);
    const t = setTimeout(() => setContentVisible(true), 80);
    return () => clearTimeout(t);
  }, [vacancy.id]);

  useEffect(() => {
    setEntered(true);
    return () => setEntered(false);
  }, [vacancy.id]);

  return (
    <div className={cn("flex flex-col lg:flex-row transition-transform duration-200 ease-out", entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2")}>
      {/* Sidebar with Vacature List - Desktop Only (render only when this detail view is standalone) */}
      {!onClose && (
        <aside className="hidden lg:block w-80 border-r border-border bg-card overflow-y-auto">
        <div className="p-4 border-b border-border sticky top-0 bg-card z-10">
          {onClose ? (
            <Button variant="ghost" size="sm" className="gap-2 font-bold" onClick={onClose}>
              <ArrowLeft className="h-4 w-4" />
              Alle Vacatures
            </Button>
          ) : (
            <a href="/vacatures">
              <Button variant="ghost" size="sm" className="gap-2 font-bold">
                <ArrowLeft className="h-4 w-4" />
                Alle Vacatures
              </Button>
            </a>
          )}
        </div>
        <div className="p-3 space-y-2">
          {allVacatures.map((v) => {
            const isActive = v.id === vacancy.id;
            const vCategoryColor = getCategoryColor(v.category?.name);
            return (
              <button
                key={v.id}
                onClick={() => handleVacatureClick(v.id)}
                onMouseEnter={() => prefetchVacature(v.id)}
                onFocus={() => prefetchVacature(v.id)}
                className={cn(
                  "w-full text-left p-3 rounded-xl border transition-all duration-300 cursor-pointer",
                  isActive
                    ? "bg-[var(--brand)]/5 border-[var(--brand)] shadow-sm"
                    : "border-border hover:bg-muted hover:border-muted-foreground/20"
                )}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-bold text-sm line-clamp-2 flex-1 min-w-0">
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
      )}

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
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1">
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
                  {vacancy.category?.name}
                </Badge>
                {!vacancy.isActive && (
                  <Badge className="bg-red-500/10 text-red-700 border-red-500/20 font-semibold px-3 py-1">
                    Inactief
                  </Badge>
                )}
                {vacancy.archived && (
                  <Badge className="bg-orange-500/10 text-orange-700 border-orange-500/20 font-semibold px-3 py-1">
                    Gearchiveerd
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground ml-auto">#{vacancy.vacatureNumber}</span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-2">
                {vacancy.title}
              </h1>

              <p className="text-lg text-muted-foreground font-medium mb-4">
                {vacancy.subtitle}
              </p>

              {/* Compact Stats Row */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="relative group inline-block">
                  <a href={`/applications?vacatureId=${vacancy.id}`} className="inline-flex items-center gap-3 bg-muted/40 rounded-md px-3 py-2 text-sm">
                    <div className="p-1 bg-muted/20 rounded">
                      <Users className="h-4 w-4 text-foreground" />
                    </div>
                    <div className="leading-tight text-sm">
                      <div className="text-base font-bold">{vacancy._count?.applications ?? 0}</div>
                      <div className="text-xs text-muted-foreground">sollicitaties</div>
                    </div>
                  </a>

                  {vacancy.applications && vacancy.applications.length > 0 && (
                    <div className="absolute left-0 z-20 mt-2 w-64 bg-popover text-popover-foreground rounded-md border p-2 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
                      <div className="text-xs text-muted-foreground mb-1">Recente sollicitanten</div>
                      <ul className="space-y-1 max-h-40 overflow-auto">
                        {vacancy.applications.map((a: any) => (
                          <li key={a.id} className="text-sm">
                            <strong className="font-semibold">{a.firstName} {a.lastName}</strong>
                            <div className="text-xs text-muted-foreground">{new Date(a.createdAt).toLocaleDateString("nl-NL")}</div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="inline-flex items-center gap-3 bg-muted/40 rounded-md px-3 py-2 text-sm">
                  <div className="p-1 bg-muted/20 rounded">
                    <Calendar className="h-4 w-4 text-foreground" />
                  </div>
                  <div className="leading-tight text-sm">
                    <div className="text-base font-bold">{daysOnline}</div>
                    <div className="text-xs text-muted-foreground">dagen online</div>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 text-sm text-muted-foreground ml-auto">
                  <MapPin className="h-4 w-4" />
                  <span className="font-semibold">{vacancy.location || vacancy.city}</span>
                </div>
                <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <Euro className="h-4 w-4" />
                  <span className="font-semibold">€{vacancy.salary}/uur</span>
                </div>
              </div>
            </div>

            {/* Actions - compact and placed to the right */}
            <div className="flex-shrink-0 flex items-start gap-2">
              <a href={`/vacatures/${vacancy.id}/edit`}>
                <Button size="sm" variant="outline" className="gap-2">
                  <Edit className="h-4 w-4" /> Bewerken
                </Button>
              </a>
              <Button size="sm" variant="outline" className="gap-2" onClick={handleShare}>
                <Share2 className="h-4 w-4" /> Deel
              </Button>
              <Button size="sm" variant="destructive" className="gap-2" onClick={() => setDeleteOpen(true)}>
                <Trash2 className="h-4 w-4" /> Verwijderen
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <a href={`/vacatures/${vacancy.id}/edit`}>
              <Button size="lg" className="font-bold gap-2 rounded-full">
                <Edit className="h-5 w-5" />
                Bewerken
              </Button>
            </a>
            <Button size="lg" variant="outline" className="font-bold gap-2 rounded-full" onClick={handleShare}>
              <Share2 className="h-5 w-5" />
              Deel
            </Button>
            <Button
              size="lg"
              variant="destructive"
              className="font-bold gap-2 rounded-full"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="h-5 w-5" />
              Verwijderen
            </Button>
          </div>

          {/* Dienstverband */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Briefcase className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-bold">Dienstverband</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {vacancy.employmentType.map((type: string) => (
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
          <div className={cn("transition-opacity duration-200", contentVisible ? "opacity-100" : "opacity-60") }>
            <h2 className="text-2xl font-black mb-3">Beschrijving</h2>
            {contentVisible ? (
              <p className="text-muted-foreground text-lg leading-relaxed">
                {vacancy.description}
              </p>
            ) : (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            )}
          </div>

          {/* Long Description */}
          {vacancy.longDescription && vacancy.longDescription !== vacancy.description && (
            <div className={cn("transition-opacity duration-200", contentVisible ? "opacity-100" : "opacity-60")}>
              <h2 className="text-2xl font-black mb-3">Meer informatie</h2>
              {contentVisible ? (
                <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {vacancy.longDescription}
                </div>
              ) : (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              )}
            </div>
          )}

          {/* Requirements */}
          {vacancy.requirements?.length > 0 && (
            <div className={cn("transition-opacity duration-200", contentVisible ? "opacity-100" : "opacity-60")}>
              <h2 className="text-2xl font-black mb-4">Vereisten</h2>
              {contentVisible ? (
                <ul className="space-y-3">
                  {vacancy.requirements.map((req: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-foreground mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{req}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="space-y-3">
                  <li><Skeleton className="h-4 w-full" /></li>
                  <li><Skeleton className="h-4 w-5/6" /></li>
                  <li><Skeleton className="h-4 w-4/6" /></li>
                </ul>
              )}
            </div>
          )}

          {/* Benefits */}
          {vacancy.benefits?.length > 0 && (
            <div className={cn("transition-opacity duration-200", contentVisible ? "opacity-100" : "opacity-60")}>
              <h2 className="text-2xl font-black mb-4">Wat bieden wij?</h2>
              {contentVisible ? (
                <ul className="space-y-3">
                  {vacancy.benefits.map((benefit: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <Gift className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="space-y-3">
                  <li><Skeleton className="h-4 w-full" /></li>
                  <li><Skeleton className="h-4 w-5/6" /></li>
                </ul>
              )}
            </div>
          )}

          {/* Metadata Footer */}
          <div className="pt-6 border-t border-border text-sm text-muted-foreground space-y-3">
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <span>
                Gepubliceerd:{" "}
                <strong className="text-foreground">
                  {new Date(vacancy.publishedAt).toLocaleDateString("nl-NL", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </strong>
              </span>
              <span>
                Laatst bijgewerkt:{" "}
                <strong className="text-foreground">
                  {new Date(vacancy.updatedAt).toLocaleDateString("nl-NL", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </strong>
              </span>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {vacancy.createdBy && (
                <span>
                  Aangemaakt door:{" "}
                  <strong className="text-foreground">
                    {vacancy.createdBy.name || vacancy.createdBy.email}
                  </strong>
                </span>
              )}
              {vacancy.lastUpdatedBy && (
                <span>
                  Laatst bewerkt door:{" "}
                  <strong className="text-foreground">
                    {vacancy.lastUpdatedBy.name || vacancy.lastUpdatedBy.email}
                  </strong>
                </span>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Vacature verwijderen</DialogTitle>
            <DialogDescription>
              Weet je zeker dat je <strong>&ldquo;{vacancy.title}&rdquo;</strong> wilt
              verwijderen? Dit kan niet ongedaan worden gemaakt. Alle gekoppelde
              sollicitaties verliezen hun vacature-referentie.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={deleting}>
                Annuleren
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Verwijderen..." : "Ja, verwijderen"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
