"use client";
import { useState, useEffect } from "react";
import useSWR, { mutate as globalMutate } from "swr";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Search,
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
  const [sidebarSearch, setSidebarSearch] = useState("");
  const fetcher = (url: string) => fetch(url).then((r) => r.json());

  // Keep internal selectedId in sync when parent passes a different initialVacature.
  useEffect(() => {
    if (initialVacature?.id && initialVacature.id !== selectedId) {
      setSelectedId(initialVacature.id);
    }
    // Also reset content visibility when a new vacancy is provided
    // so skeletons show briefly and content fades in.
    // (Handled by contentVisible effect elsewhere.)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialVacature?.id]);

  // Use SWR to fetch and cache vacancy details across the admin session.
  const { data: selectedVacature, error } = useSWR(
    selectedId ? `/api/vacatures/${selectedId}` : null,
    fetcher,
    {
      fallbackData: selectedId === initialVacature.id ? initialVacature : undefined,
      revalidateOnFocus: false,
      // Only skip the initial revalidation when we have fallbackData for the
      // currently selected id (i.e. it's the same as the server-provided
      // `initialVacature`). For other ids we want SWR to fetch the detail as
      // usual.
      revalidateOnMount: selectedId === initialVacature.id ? false : true,
      revalidateIfStale: selectedId === initialVacature.id ? false : true,
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
    try {
      const res = await fetch(`/api/vacatures/${vacancy.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      toast.success("Vacature verwijderd");
      // Revalidate the vacatures list so the UI updates immediately
      globalMutate("/api/vacatures");
      router.push("/vacatures");
      router.refresh();
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
    // Public site uses /vacatures/{id} paths for job details
    const publicPath = `/vacatures/${vacancy.id}`;
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
      {/* Sidebar with Vacature List - Desktop Only */}
      {!onClose && (
        <aside className="hidden lg:block w-80 border-r border-border bg-card lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)] lg:overflow-auto">
          <div className="sticky top-0 bg-card z-10 border-b border-border">
            <div className="p-3 pb-2">
              <a href="/vacatures">
                <Button variant="ghost" size="sm" className="gap-2 font-bold">
                  <ArrowLeft className="h-4 w-4" />
                  Alle Vacatures
                </Button>
              </a>
            </div>
            <div className="px-3 pb-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Zoek vacature..."
                  value={sidebarSearch}
                  onChange={(e) => setSidebarSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-sm rounded-lg border border-border bg-muted/50 placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-[var(--brand)] focus:border-[var(--brand)] transition-colors"
                />
              </div>
            </div>
          </div>
          <div className="p-2 space-y-1">
            {allVacatures
              .filter((v) => {
                if (!sidebarSearch.trim()) return true;
                const q = sidebarSearch.toLowerCase();
                return (
                  v.title.toLowerCase().includes(q) ||
                  v.category?.name?.toLowerCase().includes(q) ||
                  String(v.vacatureNumber).includes(q)
                );
              })
              .map((v) => {
                const isActive = v.id === vacancy.id;
                const vCategoryColor = getCategoryColor(v.category?.name);
                return (
                  <button
                    key={v.id}
                    onClick={() => handleVacatureClick(v.id)}
                    onMouseEnter={() => prefetchVacature(v.id)}
                    onFocus={() => prefetchVacature(v.id)}
                    className={cn(
                      "w-full text-left px-3 py-2.5 rounded-xl border transition-all duration-200 cursor-pointer",
                      isActive
                        ? "bg-[var(--brand)]/5 border-[var(--brand)]/40 shadow-sm"
                        : "border-transparent hover:bg-muted/80"
                    )}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="font-bold text-sm line-clamp-1 flex-1 min-w-0">
                        {v.title}
                      </h4>
                      {!v.isActive && (
                        <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" title="Inactief" />
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <Badge
                        className="rounded-full text-[10px] px-2 py-0 border"
                        style={{
                          backgroundColor: vCategoryColor.background ?? vCategoryColor.bg,
                          color: vCategoryColor.color ?? vCategoryColor.text,
                          borderColor: vCategoryColor.border,
                        }}
                      >
                        {v.category?.name}
                      </Badge>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-0.5">
                          <Users className="h-3 w-3" />
                          {v._count.applications}
                        </span>
                        <span>#{v.vacatureNumber}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            {allVacatures.length > 0 &&
              !allVacatures.some((v) => {
                if (!sidebarSearch.trim()) return true;
                const q = sidebarSearch.toLowerCase();
                return v.title.toLowerCase().includes(q) || v.category?.name?.toLowerCase().includes(q) || String(v.vacatureNumber).includes(q);
              }) && (
                <p className="text-xs text-muted-foreground text-center py-4">Geen resultaten</p>
              )}
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1">
        <div
          className={cn(
            "max-w-4xl mx-auto p-4 md:p-6 space-y-6 transition-opacity duration-200",
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

          {/* Back to list button (visible on all sizes) */}
          <div className="hidden lg:block mb-3">
            <a href="/vacatures" className="inline-flex">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Terug naar lijst
              </Button>
            </a>
          </div>

          {/* Header Card */}
          <Card className="shadow-layered border-0 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <Badge
                      className="rounded-full font-bold text-sm px-4 py-1.5 border"
                      style={{
                        backgroundColor: categoryColor.background ?? categoryColor.bg,
                        color: categoryColor.color ?? categoryColor.text,
                        borderColor: categoryColor.border,
                      }}
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

                  <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-1">
                    {vacancy.title}
                  </h1>

                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">{vacancy.subtitle || "—"}</p>
                  </div>
                </div>
                {/* Actions were moved — they will render at the bottom of the detail view for clearer grouping */}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <a href={`/applications?vacatureId=${vacancy.id}`} className="group">
              <Card className="shadow-layered border-0 hover-lift h-full">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2.5 bg-blue-500/10 rounded-xl">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-black">{(vacancy._count?.applications ?? 0) || ""}</p>
                    <p className="text-xs text-muted-foreground">{(vacancy._count?.applications ?? 0) === 0 ? "Nog geen sollicitaties" : "Sollicitaties"}</p>
                  </div>
                </CardContent>
              </Card>
            </a>

            <Card className="shadow-layered border-0 h-full">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2.5 bg-green-500/10 rounded-xl">
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-black">{daysOnline}</p>
                  <p className="text-xs text-muted-foreground">Dagen online</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-layered border-0 h-full">
              <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2.5 bg-purple-500/10 rounded-xl">
                  <MapPin className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-lg font-black">{vacancy.city || vacancy.location || "—"}</p>
                  <p className="text-xs text-muted-foreground">Locatie</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-layered border-0 h-full">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/10 rounded-xl">
                  <Euro className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-lg font-black">{vacancy.salary ? `€${vacancy.salary}` : "—"}</p>
                  <p className="text-xs text-muted-foreground">Salaris</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Dienstverband Card */}
          <Card className="shadow-layered border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                Dienstverband
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 items-center">
                {/* also show badges for clarity */}
                <div className="flex flex-wrap gap-2">
                  {vacancy.employmentType.map((type: string) => (
                    <Badge key={type} className="bg-muted text-foreground border border-border px-4 py-1.5 text-sm font-semibold">
                      {type.replace("_", " ")}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description Card */}
          <Card className={cn("shadow-layered border-0 transition-opacity duration-200", contentVisible ? "opacity-100" : "opacity-60")}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">Beschrijving</CardTitle>
            </CardHeader>
            <CardContent>
              {contentVisible ? (
                <p className="text-muted-foreground leading-relaxed">
                  {vacancy.description}
                </p>
              ) : (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Long Description Card */}
          {vacancy.longDescription && vacancy.longDescription !== vacancy.description && (
            <Card className={cn("shadow-layered border-0 transition-opacity duration-200", contentVisible ? "opacity-100" : "opacity-60")}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold">Meer informatie</CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          )}

          {/* Requirements & Benefits - side by side on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Requirements Card */}
            {vacancy.requirements?.length > 0 && (
              <Card className={cn("shadow-layered border-0 transition-opacity duration-200", contentVisible ? "opacity-100" : "opacity-60")}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    Vereisten
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {contentVisible ? (
                    <ul className="space-y-2.5">
                      {vacancy.requirements.map((req: string, index: number) => (
                        <li key={index} className="flex items-start gap-2.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-foreground mt-2 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{req}</span>
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
                </CardContent>
              </Card>
            )}

            {/* Benefits Card */}
            {vacancy.benefits?.length > 0 && (
              <Card className={cn("shadow-layered border-0 transition-opacity duration-200", contentVisible ? "opacity-100" : "opacity-60")}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Gift className="h-4 w-4 text-muted-foreground" />
                    Wat bieden wij?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {contentVisible ? (
                    <ul className="space-y-2.5">
                      {vacancy.benefits.map((benefit: string, index: number) => (
                        <li key={index} className="flex items-start gap-2.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-[var(--brand)] mt-2 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <ul className="space-y-3">
                      <li><Skeleton className="h-4 w-full" /></li>
                      <li><Skeleton className="h-4 w-5/6" /></li>
                    </ul>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Metadata Footer (rendered without an extra Card/container as requested) */}
          <div className="p-4 text-sm text-muted-foreground space-y-2">
            <div className="flex flex-wrap gap-x-6 gap-y-1">
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
            <div className="flex flex-wrap gap-x-6 gap-y-1">
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
          {/* Actions at bottom: edit / share / delete — grouped and sticky to the bottom of the content area */}
          <div className="mt-4 flex items-center gap-2">
            <a href={`/vacatures/${vacancy.id}/edit`}>
              <Button size="sm" variant="outline" className="gap-2 rounded-full">
                <Edit className="h-4 w-4" /> Bewerken
              </Button>
            </a>
            <Button size="sm" variant="outline" className="gap-2 rounded-full" onClick={handleShare}>
              <Share2 className="h-4 w-4" /> Deel
            </Button>
            <Button size="sm" variant="destructive" className="gap-2 rounded-full ml-auto" onClick={() => setDeleteOpen(true)}>
              <Trash2 className="h-4 w-4" />
            </Button>
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
