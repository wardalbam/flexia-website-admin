"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import { getCategoryColor } from "../../lib/status-colors";
import { AnimatedSection } from "../../components/animated-section";
import { MapPin, Briefcase, Building2, ArrowUpRight, Search, X } from "lucide-react";
import { cn } from "../../lib/utils";

type Vacature = {
  id: string;
  title: string;
  description: string;
  city: string;
  salary: number;
  vacatureNumber: number;
  employmentType: string[];
  companyName: string | null;
  category: { id: string; name: string } | null;
};

function SkeletonCard() {
  return (
    <Card className="overflow-hidden border border-border">
      <CardContent className="p-6 space-y-5">
        <div className="h-3 w-20 bg-muted rounded-full animate-skeleton" />
        <div className="space-y-2">
          <div className="h-5 w-3/4 bg-muted rounded animate-skeleton" />
          <div className="h-5 w-1/2 bg-muted rounded animate-skeleton" />
        </div>
        <div className="flex items-center gap-4">
          <div className="h-3 w-24 bg-muted rounded-full animate-skeleton" />
          <div className="h-3 w-20 bg-muted rounded-full animate-skeleton" />
        </div>
        <div className="h-3 w-full bg-muted rounded animate-skeleton" />
        <div className="h-3 w-2/3 bg-muted rounded animate-skeleton" />
        <div className="pt-4 border-t border-border">
          <div className="h-4 w-16 bg-muted rounded animate-skeleton" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function VacaturesPage() {
  const [vacatures, setVacatures] = useState<Vacature[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedEmployment, setSelectedEmployment] = useState<string>("all");

  useEffect(() => {
    const fetchVacatures = async () => {
      try {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? (typeof window !== "undefined" ? window.location.origin : "");
  const res = await fetch(`${apiUrl}/api/vacatures?active=true`);
        if (res.ok) {
          const data = await res.json();
          setVacatures(data);
        }
      } catch (error) {
        console.error("Failed to fetch vacatures:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVacatures();
  }, []);

  const categories = Array.from(
    new Set(vacatures.map((v) => v.category?.name).filter(Boolean))
  );
  const cities = Array.from(new Set(vacatures.map((v) => v.city)));
  const employmentTypes = Array.from(
    new Set(vacatures.flatMap((v) => v.employmentType))
  );

  const hasActiveFilters =
    selectedCategory !== "all" || selectedCity !== "all" || selectedEmployment !== "all" || search !== "";

  const filteredVacatures = vacatures.filter((v) => {
    const categoryMatch = selectedCategory === "all" || v.category?.name === selectedCategory;
    const cityMatch = selectedCity === "all" || v.city === selectedCity;
    const employmentMatch = selectedEmployment === "all" || v.employmentType?.includes(selectedEmployment);
    const searchMatch = !search || v.title.toLowerCase().includes(search.toLowerCase()) || v.description.toLowerCase().includes(search.toLowerCase());
    return categoryMatch && cityMatch && employmentMatch && searchMatch;
  });

  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedCity("all");
    setSelectedEmployment("all");
    setSearch("");
  };

  return (
    <>
      {/* ========== HERO — Dark surface with mesh blob ========== */}
      <section className="relative surface-dark overflow-hidden py-24 md:py-32">
        <div className="mesh-blob mesh-brand w-[700px] h-[700px] -top-32 -right-32 animate-mesh opacity-50" />
        <div className="mesh-blob mesh-brand w-[400px] h-[400px] bottom-0 -left-20 animate-mesh opacity-30" style={{ animationDelay: "-10s" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center space-y-6">
          <AnimatedSection>
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--brand)]">
              Vacatures
            </span>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <h1 className="text-display font-bold text-white">
              Onze Vacatures
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <p className="text-lg text-white/50 max-w-xl mx-auto leading-relaxed">
              {loading
                ? "Vacatures laden..."
                : `${filteredVacatures.length} ${filteredVacatures.length === 1 ? "vacature" : "vacatures"} beschikbaar`}
            </p>
          </AnimatedSection>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[var(--background)] to-transparent z-10" />
      </section>

      {/* ========== FILTERS + CONTENT ========== */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 space-y-10">
        {/* Filter Bar */}
        <AnimatedSection>
          <div className="glass sticky top-20 z-30 rounded-lg shadow-layered p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              {/* Search */}
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Zoeken
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Zoek op functie..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 h-11"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Categorie
                </label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Alle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle categorieën</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat || ""}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* City */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Locatie
                </label>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Alle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle locaties</SelectItem>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Employment Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Type
                </label>
                <Select value={selectedEmployment} onValueChange={setSelectedEmployment}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Alle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle typen</SelectItem>
                    {employmentTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type.replace("_", " ")}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {filteredVacatures.length} {filteredVacatures.length === 1 ? "resultaat" : "resultaten"}
                </span>
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-[var(--brand)] transition-colors duration-300"
                >
                  <X className="h-3.5 w-3.5" />
                  Filters wissen
                </button>
              </div>
            )}
          </div>
        </AnimatedSection>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Job Cards */}
        {!loading && filteredVacatures.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVacatures.map((v, i) => {
              const categoryColor = getCategoryColor(v.category?.name);
              return (
                <AnimatedSection key={v.id} delay={Math.min(i * 0.05, 0.3)}>
                  <Link href={`/vacatures/${v.id}/apply`}>
                    <div className={cn(
                      "group relative bg-white border border-border rounded-lg p-6 h-full",
                      "hover-lift cursor-pointer",
                      "transition-colors duration-300"
                    )}>
                      <div className="space-y-4">
                        {/* Category + Vacature Number */}
                        <div className="flex items-center justify-between">
                          <Badge
                            variant="outline"
                            className={cn(
                              "rounded-full text-xs px-2.5 py-0.5 font-medium",
                              "text-[var(--brand)] bg-transparent",
                              categoryColor.border
                            )}
                          >
                            {v.category?.name || "Algemeen"}
                          </Badge>
                          <span className="text-[11px] text-muted-foreground">
                            #{v.vacatureNumber}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="font-bold text-lg leading-tight line-clamp-2 text-foreground">
                          {v.title}
                        </h3>

                        {/* Company */}
                        {v.companyName && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Building2 className="h-3.5 w-3.5 shrink-0" />
                            <span>{v.companyName}</span>
                          </div>
                        )}

                        {/* City + Employment Type */}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 shrink-0" />
                            {v.city}
                          </span>
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-3.5 w-3.5 shrink-0" />
                            {v.employmentType?.[0]?.replace("_", " ")}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                          {v.description}
                        </p>

                        {/* Salary + Arrow */}
                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <span className="text-sm font-bold text-foreground">
                            &euro;{v.salary}/uur
                          </span>
                          <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-all duration-300 group-hover:text-[var(--brand)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </AnimatedSection>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredVacatures.length === 0 && (
          <AnimatedSection>
            <div className="text-center py-24 space-y-6 max-w-md mx-auto">
              <div className="w-14 h-14 mx-auto bg-secondary rounded-full flex items-center justify-center">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-foreground">
                  Geen vacatures gevonden
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Probeer andere filters of solliciteer algemeen — wij vinden de juiste match voor jou.
                </p>
              </div>
              <div className="flex gap-3 justify-center pt-2">
                <Button
                  onClick={resetFilters}
                  variant="outline"
                  className="rounded-full font-medium"
                >
                  Filters wissen
                </Button>
                <Button asChild className="rounded-full font-medium">
                  <Link href="/solliciteer">Algemeen solliciteren</Link>
                </Button>
              </div>
            </div>
          </AnimatedSection>
        )}
      </div>
    </>
  );
}
