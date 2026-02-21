"use client";

import { useMemo, useState, useEffect } from "react";
import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { getCategoryColor } from "@/lib/status-colors";
import Link from "next/link";
import { useRouter } from "next/navigation";
import VacatureQuickView from "./VacatureQuickView";
import { MapPin, Users, Briefcase, Search, X, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Vacature = any;

export default function VacatureList({ vacatures, onSelect, compact = false, selectedId }: { vacatures: Vacature[]; onSelect?: (id: string) => void; compact?: boolean; selectedId?: string }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const prefetched = useRef(new Set<string>());

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  const categories = useMemo(() => {
    return Array.from(new Set(vacatures.map(v => v.category?.name))).filter(Boolean) as string[];
  }, [vacatures]);

  const locations = useMemo(() => {
    return Array.from(new Set(vacatures.map(v => v.city))).filter(Boolean) as string[];
  }, [vacatures]);

  const filtered = useMemo(() => {
    let result = vacatures.filter((v) => {
      // Status filter
      if (statusFilter === "active" && (!v.isActive || v.archived)) return false;
      if (statusFilter === "inactive" && v.isActive) return false;
      if (statusFilter === "archived" && !v.archived) return false;

      // Category filter
      if (categoryFilter !== "all" && v.category?.name !== categoryFilter) return false;

      // Location filter
      if (locationFilter !== "all" && v.city !== locationFilter) return false;

      // Search
      if (search) {
        const q = search.toLowerCase();
        const matchesTitle = v.title?.toLowerCase().includes(q);
        const matchesNumber = String(v.vacatureNumber).includes(q);
        const matchesCompany = v.companyName?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesNumber && !matchesCompany) return false;
      }

      return true;
    });

    // Sort
    if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt || b.publishedAt).getTime() - new Date(a.createdAt || a.publishedAt).getTime());
    } else if (sortBy === "oldest") {
      result.sort((a, b) => new Date(a.createdAt || a.publishedAt).getTime() - new Date(b.createdAt || b.publishedAt).getTime());
    } else if (sortBy === "most_applications") {
      result.sort((a, b) => (b._count?.applications ?? 0) - (a._count?.applications ?? 0));
    } else if (sortBy === "salary_high") {
      result.sort((a, b) => (b.salary ?? 0) - (a.salary ?? 0));
    }

    return result;
  }, [vacatures, statusFilter, categoryFilter, locationFilter, sortBy, search]);

  const hasFilters = statusFilter !== "all" || categoryFilter !== "all" || locationFilter !== "all" || search !== "";

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setCategoryFilter("all");
    setLocationFilter("all");
    setSortBy("newest");
  };

  // Counts for status tabs
  const counts = useMemo(() => {
    const all = vacatures.length;
    const active = vacatures.filter(v => v.isActive && !v.archived).length;
    const inactive = vacatures.filter(v => !v.isActive).length;
    const archived = vacatures.filter(v => v.archived).length;
    return { all, active, inactive, archived };
  }, [vacatures]);

  const [quickId, setQuickId] = useState<string | null>(null);
  const [quickOpen, setQuickOpen] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      const id = e?.detail?.id;
      if (id) {
        setQuickId(String(id));
        setQuickOpen(true);
      }
    };
    window.addEventListener("vacature:open", handler as EventListener);
    return () => window.removeEventListener("vacature:open", handler as EventListener);
  }, []);

  return (
    <div className="space-y-4">
      {/* Status Tabs: make horizontally scrollable to avoid stretching the cards container */}
      <div className="overflow-x-auto max-w-full">
        <div className="flex items-center gap-1 border-b border-border min-w-max">
        {[
          { value: "all", label: "Alle", count: counts.all },
          { value: "active", label: "Actief", count: counts.active },
          { value: "inactive", label: "Inactief", count: counts.inactive },
          { value: "archived", label: "Gearchiveerd", count: counts.archived },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={cn(
              "px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors -mb-px whitespace-nowrap",
              statusFilter === tab.value
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            )}
          >
            {tab.label}
            <span className={cn(
              "ml-1.5 text-xs px-1.5 py-0.5 rounded-full",
              statusFilter === tab.value
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground"
            )}>{tab.count}</span>
          </button>
        ))}
      </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Zoek op titel, nummer of bedrijf..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded"
            >
              <X className="h-3 w-3 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Category */}
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[160px] h-9 text-sm">
            <SelectValue placeholder="Categorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle categorieën</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Location */}
        <Select value={locationFilter} onValueChange={setLocationFilter}>
          <SelectTrigger className="w-[150px] h-9 text-sm">
            <SelectValue placeholder="Locatie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle locaties</SelectItem>
            {locations.map((l) => (
              <SelectItem key={l} value={l}>{l}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[170px] h-9 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Nieuwste eerst</SelectItem>
            <SelectItem value="oldest">Oudste eerst</SelectItem>
            <SelectItem value="most_applications">Meeste sollicitaties</SelectItem>
            <SelectItem value="salary_high">Hoogste salaris</SelectItem>
          </SelectContent>
        </Select>

        {/* Reset */}
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={resetFilters} className="h-9 text-sm gap-1.5">
            <X className="h-3.5 w-3.5" />
            Reset
          </Button>
        )}

        {/* Count */}
        <span className="text-sm text-muted-foreground ml-auto">
          {filtered.length} van {vacatures.length}
        </span>
      </div>

      {/* Vacature Grid */}
      {filtered.length > 0 ? (
        <>
        <div className={compact ? "space-y-3" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"}>
          {filtered.map((v, idx) => {
            const categoryColor = getCategoryColor(v.category?.name);
            const applicationsCount = v._count?.applications ?? 0;
            const dateAdded = v.createdAt || v.publishedAt;
            const daysOnline = dateAdded ? Math.max(0, Math.floor((Date.now() - new Date(dateAdded).getTime()) / (1000 * 60 * 60 * 24))) : 0;

            const isSelected = selectedId ? String(v.id) === String(selectedId) : false;

            return (
              <div
                key={v.id}
                className={cn("group h-full animate-fade-in", `stagger-${Math.min((idx % 6) + 1, 6)}`)}
                onMouseEnter={() => {
                  // Prefetch the server route (RSC) and warm the vacancy API so the detail modal appears instantly on click
                  try {
                    router.prefetch(`/vacatures/${v.id}`);
                  } catch (e) {
                    // ignore
                  }
                  void fetch(`/api/vacatures/${v.id}`).catch(() => {});
                }}
                onFocus={() => {
                  try {
                    router.prefetch(`/vacatures/${v.id}`);
                  } catch (e) {}
                  void fetch(`/api/vacatures/${v.id}`).catch(() => {});
                }}
                onTouchStart={() => {
                  const id = String(v.id);
                  if (prefetched.current.has(id)) return;
                  prefetched.current.add(id);
                  try {
                    router.prefetch(`/vacatures/${v.id}`);
                  } catch (e) {}
                  void fetch(`/api/vacatures/${v.id}`).catch(() => {});
                }}
                onPointerDown={() => {
                  const id = String(v.id);
                  if (prefetched.current.has(id)) return;
                  prefetched.current.add(id);
                  try {
                    router.prefetch(`/vacatures/${v.id}`);
                  } catch (e) {}
                  void fetch(`/api/vacatures/${v.id}`).catch(() => {});
                }}
              >
                <Card
                  className={cn(
                    "relative shadow-layered hover-lift cursor-pointer border-0 h-full flex flex-col bg-card rounded-xl overflow-hidden",
                    isSelected ? "ring-2 ring-[var(--brand)] bg-[var(--brand)]/5" : ""
                  )}
                  onClick={(e) => {
                      // On small screens, navigate to the vacancy overview page (standalone) instead of opening the quick-view dialog
                      try {
                        const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;
                        if (isMobile) {
                          // navigate to the vacancy page (full overview) on mobile
                          try {
                            router.push(`/vacatures/${v.id}`);
                          } catch (err) {
                            // fallback to location.assign
                            window.location.href = `/vacatures/${v.id}`;
                          }
                          return;
                        }
                      } catch (err) {}

                      // select vacancy in parent shell instead of navigating away on desktop
                      e.preventDefault();
                      e.stopPropagation();
                      if (onSelect) onSelect(String(v.id));
                      // update browser URL without navigation so link remains shareable
                      try {
                        const newUrl = `/vacatures/${v.id}`;
                        window.history.pushState({}, "", newUrl);
                      } catch (e) {}
                    }}
                >
                  <CardContent className="px-4 py-3 flex-1 flex flex-col">
                    {/* Vacancy Number Badge */}
                    <div className="absolute top-2 right-2 bg-muted/50 text-muted-foreground text-[10px] font-bold px-2 py-0.5 rounded">
                      #{v.vacatureNumber}
                    </div>

                    {/* Title */}
                    <h3 className="font-black text-lg tracking-tight line-clamp-2 mb-2 pr-12 group-hover:text-foreground transition-colors">
                      {v.title}
                    </h3>

                    {/* Short description intentionally removed per design: keep cards concise */}

                    {/* Category & Company */}
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        className="rounded-full font-bold text-[11px] px-2.5 py-0.5 border"
                        style={{
                          backgroundColor: categoryColor.background ?? categoryColor.bg ?? categoryColor.background,
                          color: categoryColor.color ?? categoryColor.text ?? undefined,
                          borderColor: categoryColor.border,
                        }}
                      >
                        {v.category?.name}
                      </Badge>
                      {v.companyName && (
                        <span className="text-xs text-muted-foreground font-semibold truncate">
                          {v.companyName}
                        </span>
                      )}
                    </div>

                    {/* Meta Information */}
                    <div className="flex items-center gap-3 mb-2 text-xs text-muted-foreground font-medium flex-wrap">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{v.city}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-3 w-3" />
                        <span>{(v.employmentType || []).slice(0, 2).map((t: string) => t.replace("_", " ")).join(", ")}</span>
                      </div>
                      {dateAdded && (
                        <span className="ml-auto">
                          {new Date(dateAdded).toLocaleDateString("nl-NL", {
                            day: "numeric",
                            month: "short",
                            year: "2-digit"
                          })}
                        </span>
                      )}
                    </div>

                    {/* Footer - Applications, salary and status (frontend-like bottom row) */}
                    <div className="mt-auto pt-4 border-t border-border pt-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5 bg-muted text-foreground rounded-lg px-2.5 py-1.5 border border-border">
                            <Users className="h-4 w-4" />
                            <div className="text-sm font-black">{applicationsCount}</div>
                            <div className="text-[10px] font-bold">sollicitaties</div>
                          </div>

                          <div className="text-sm text-muted-foreground">{daysOnline} dagen</div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-sm font-medium">€{v.salary ?? 0}/uur</div>
                          <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                        {/* Quick edit from overview: open edit page */}
                        
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        {!v.isActive && (
                          <Badge className="bg-red-500/10 text-red-700 border-red-500/20 text-xs font-bold px-2 py-1">
                            Inactief
                          </Badge>
                        )}

                        {v.archived && (
                          <Badge className="bg-orange-500/10 text-orange-700 border-orange-500/20 text-xs font-bold px-2 py-1">
                            Gearchiveerd
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
        <VacatureQuickView id={quickId} open={quickOpen} onOpenChange={(v) => setQuickOpen(v)} />
        </>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg font-semibold mb-1">Geen vacatures gevonden</p>
          <p className="text-sm">Pas je filters aan of maak een nieuwe vacature aan.</p>
          {hasFilters && (
            <Button variant="outline" size="sm" onClick={resetFilters} className="mt-4">
              Filters wissen
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
