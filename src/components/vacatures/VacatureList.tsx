"use client";

import { useMemo, useState } from "react";
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
import { getCategoryColor } from "@/lib/status-colors";
import Link from "next/link";
import { MapPin, Users, Briefcase, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Vacature = any;

export default function VacatureList({ initialVacatures }: { initialVacatures: Vacature[] }) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedEmployment, setSelectedEmployment] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("active");
  const [sortBy, setSortBy] = useState<string>("newest");

  const categories = useMemo(() => {
    return Array.from(new Set(initialVacatures.map(v => v.category))).filter(Boolean) as string[];
  }, [initialVacatures]);

  const locations = useMemo(() => {
    return Array.from(new Set(initialVacatures.map(v => v.location))).filter(Boolean) as string[];
  }, [initialVacatures]);

  const employmentTypes = useMemo(() => {
    return Array.from(new Set(initialVacatures.flatMap(v => v.employmentType || []))).filter(Boolean) as string[];
  }, [initialVacatures]);

  const filtered = useMemo(() => {
    let result = initialVacatures.filter((v) => {
      if (activeFilter === "active" && v.isActive === false) return false;
      if (selectedCategories.length && !selectedCategories.includes(v.category)) return false;
      if (selectedLocations.length && !selectedLocations.includes(v.location)) return false;
      if (selectedEmployment.length && !v.employmentType.some((t: string) => selectedEmployment.includes(t))) return false;
      return true;
    });

    // Sort the results
    if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt || b.publishedAt).getTime() - new Date(a.createdAt || a.publishedAt).getTime());
    } else if (sortBy === "oldest") {
      result.sort((a, b) => new Date(a.createdAt || a.publishedAt).getTime() - new Date(b.createdAt || b.publishedAt).getTime());
    } else if (sortBy === "most_applications") {
      result.sort((a, b) => (b._count?.applications ?? 0) - (a._count?.applications ?? 0));
    } else if (sortBy === "least_applications") {
      result.sort((a, b) => (a._count?.applications ?? 0) - (b._count?.applications ?? 0));
    }

    return result;
  }, [initialVacatures, selectedCategories, selectedLocations, selectedEmployment, activeFilter, sortBy]);

  return (
    <div className="space-y-4">
      {/* Filter Controls - Horizontal Scroll on Mobile */}
      <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
        <div className="flex items-center gap-3 min-w-max">
          {/* Category Dropdown */}
          <Select
            value={selectedCategories[0] || "all"}
            onValueChange={(value) => setSelectedCategories(value === "all" ? [] : [value])}
          >
            <SelectTrigger className="px-6 py-4 border-0 bg-muted rounded-xl text-sm font-bold transition-all hover:bg-muted/80 focus:ring-0 focus-visible:ring-0 focus:outline-none">
              <SelectValue placeholder="Alle categorieën" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle categorieën</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Location Dropdown */}
          <Select
            value={selectedLocations[0] || "all"}
            onValueChange={(value) => setSelectedLocations(value === "all" ? [] : [value])}
          >
            <SelectTrigger className="px-6 py-4 border-0 bg-muted rounded-xl text-sm font-bold transition-all hover:bg-muted/80 focus:ring-0 focus-visible:ring-0 focus:outline-none">
              <SelectValue placeholder="Alle locaties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle locaties</SelectItem>
              {locations.map((l) => (
                <SelectItem key={l} value={l}>{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Employment Type Dropdown */}
          <Select
            value={selectedEmployment[0] || "all"}
            onValueChange={(value) => setSelectedEmployment(value === "all" ? [] : [value])}
          >
            <SelectTrigger className="px-6 py-4 border-0 bg-muted rounded-xl text-sm font-bold transition-all hover:bg-muted/80 focus:ring-0 focus-visible:ring-0 focus:outline-none">
              <SelectValue placeholder="Alle types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle types</SelectItem>
              {employmentTypes.map((e) => (
                <SelectItem key={e} value={e}>{e.replace("_", " ")}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort Dropdown */}
          <Select
            value={sortBy}
            onValueChange={(value) => setSortBy(value)}
          >
            <SelectTrigger className="px-6 py-4 border-0 bg-muted rounded-xl text-sm font-bold transition-all hover:bg-muted/80 focus:ring-0 focus-visible:ring-0 focus:outline-none">
              <SelectValue placeholder="Nieuwste eerst" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Nieuwste eerst</SelectItem>
              <SelectItem value="oldest">Oudste eerst</SelectItem>
              <SelectItem value="most_applications">Meeste sollicitaties</SelectItem>
              <SelectItem value="least_applications">Minste sollicitaties</SelectItem>
            </SelectContent>
          </Select>

          {/* Active Filter */}
          <Select
            value={activeFilter}
            onValueChange={(value) => setActiveFilter(value)}
          >
            <SelectTrigger className="px-6 py-4 border-0 bg-muted rounded-xl text-sm font-bold transition-all hover:bg-muted/80 focus:ring-0 focus-visible:ring-0 focus:outline-none">
              <SelectValue placeholder="Alleen actief" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Alleen actief</SelectItem>
              <SelectItem value="all">Alle vacatures</SelectItem>
            </SelectContent>
          </Select>

          {/* Reset Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedCategories([]);
              setSelectedLocations([]);
              setSelectedEmployment([]);
              setActiveFilter("active");
            }}
            className="px-6 py-4 text-sm font-bold hover:bg-red-100/50 hover:text-red-700 transition-all rounded-xl"
          >
            Reset
          </Button>

          {/* Results Count */}
          {filtered.length !== initialVacatures.length && (
            <Badge className="bg-primary/10 text-primary border-primary/20 font-bold px-4 py-2 rounded-xl">
              {filtered.length} van {initialVacatures.length}
            </Badge>
          )}
        </div>
      </div>

      {/* Active Filters Pills */}
      {(selectedCategories.length > 0 || selectedLocations.length > 0 || selectedEmployment.length > 0) && (
        <div className="flex flex-wrap items-center gap-2">
          {selectedCategories.length > 0 && (
            <Badge
              className="bg-purple-500 text-white hover:bg-purple-600 cursor-pointer rounded-full px-4 py-2 text-sm font-semibold flex items-center gap-2"
              onClick={() => setSelectedCategories([])}
            >
              Categorie: {selectedCategories[0]}
              <X className="h-4 w-4" />
            </Badge>
          )}
          {selectedLocations.length > 0 && (
            <Badge
              className="bg-blue-500 text-white hover:bg-blue-600 cursor-pointer rounded-full px-4 py-2 text-sm font-semibold flex items-center gap-2"
              onClick={() => setSelectedLocations([])}
            >
              Locatie: {selectedLocations[0]}
              <X className="h-4 w-4" />
            </Badge>
          )}
          {selectedEmployment.length > 0 && (
            <Badge
              className="bg-green-500 text-white hover:bg-green-600 cursor-pointer rounded-full px-4 py-2 text-sm font-semibold flex items-center gap-2"
              onClick={() => setSelectedEmployment([])}
            >
              Type: {selectedEmployment[0].replace("_", " ")}
              <X className="h-4 w-4" />
            </Badge>
          )}
        </div>
      )}

      {/* Vacature List - 3 Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((v) => {
          const categoryColor = getCategoryColor(v.category);
          const applicationsCount = v._count?.applications ?? 0;
          const dateAdded = v.createdAt || v.publishedAt;

          return (
            <Link key={v.id} href={`/vacatures/${v.id}`} className="group h-full">
              <Card className="shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.01] cursor-pointer border border-border h-full flex flex-col bg-card rounded-lg">
                <CardContent className="p-5 flex-1 flex flex-col">
                  {/* Header */}
                  <div className="flex flex-col gap-2 mb-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-base tracking-tight line-clamp-2 flex-1">
                        {v.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Category Pill */}
                      <Badge className={cn(
                        "rounded-full font-semibold text-xs px-3 py-1",
                        categoryColor.bg,
                        categoryColor.text,
                        "border",
                        categoryColor.border
                      )}>
                        {v.category}
                      </Badge>
                      {/* Company Name */}
                      {v.companyName && (
                        <span className="text-xs text-muted-foreground font-medium">
                          {v.companyName}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="space-y-2 mb-4 flex-1">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                      <MapPin className="h-3.5 w-3.5" />
                      {v.location}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                      <Briefcase className="h-3.5 w-3.5" />
                      {(v.employmentType || []).slice(0, 2).map((t: string) =>
                        t.replace("_", " ").toLowerCase()
                      ).join(", ")}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    {/* Applications Count */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-muted rounded-lg px-2 py-1 border border-border">
                        <Users className="h-3.5 w-3.5 text-foreground" />
                        <span className="text-sm font-black text-foreground">
                          {applicationsCount}
                        </span>
                      </div>
                      {!v.isActive && (
                        <Badge className="bg-red-500/10 text-red-700 border-red-500/20 text-xs font-semibold px-2 py-0">
                          Inactief
                        </Badge>
                      )}
                    </div>

                    {/* Date Added */}
                    {dateAdded && (
                      <span className="text-xs text-muted-foreground font-medium">
                        {new Date(dateAdded).toLocaleDateString("nl-NL", {
                          day: "numeric",
                          month: "short"
                        })}
                      </span>
                    )}
                  </div>

                  {/* Vacancy Number */}
                  <div className="text-xs text-muted-foreground font-medium mt-2">
                    #{v.vacatureNumber}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
