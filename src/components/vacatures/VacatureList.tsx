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
  const [showArchived, setShowArchived] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("newest");

  const categories = useMemo(() => {
    return Array.from(new Set(initialVacatures.map(v => v.category?.name))).filter(Boolean) as string[];
  }, [initialVacatures]);

  const locations = useMemo(() => {
    return Array.from(new Set(initialVacatures.map(v => v.city))).filter(Boolean) as string[];
  }, [initialVacatures]);

  const employmentTypes = useMemo(() => {
    return Array.from(new Set(initialVacatures.flatMap(v => v.employmentType || []))).filter(Boolean) as string[];
  }, [initialVacatures]);

  const filtered = useMemo(() => {
    let result = initialVacatures.filter((v) => {
      // Filter out archived vacatures by default
      if (!showArchived && v.archived === true) return false;
      if (activeFilter === "active" && v.isActive === false) return false;
      if (selectedCategories.length && !selectedCategories.includes(v.category?.name)) return false;
      if (selectedLocations.length && !selectedLocations.includes(v.city)) return false;
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

          {/* Show Archived Toggle */}
          <Button
            variant={showArchived ? "default" : "outline"}
            size="sm"
            onClick={() => setShowArchived(!showArchived)}
            className="px-6 py-4 text-sm font-bold transition-all rounded-xl"
          >
            {showArchived ? "Toon Gearchiveerd" : "Verberg Archief"}
          </Button>

          {/* Reset Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedCategories([]);
              setSelectedLocations([]);
              setSelectedEmployment([]);
              setActiveFilter("active");
              setShowArchived(false);
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
          const categoryColor = getCategoryColor(v.category?.name);
          const applicationsCount = v._count?.applications ?? 0;
          const dateAdded = v.createdAt || v.publishedAt;

          return (
            <Link key={v.id} href={`/vacatures/${v.id}`} className="group h-full">
              <Card className="relative shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.01] cursor-pointer border border-border h-full flex flex-col bg-card rounded-lg overflow-hidden">
                <CardContent className="px-4 py-3 flex-1 flex flex-col">
                  {/* Vacancy Number Badge - Top Right Corner */}
                  <div className="absolute top-2 right-2 bg-muted/50 text-muted-foreground text-[10px] font-bold px-2 py-0.5 rounded">
                    #{v.vacatureNumber}
                  </div>

                  {/* Title - Primary Hierarchy */}
                  <h3 className="font-black text-lg tracking-tight line-clamp-2 mb-2 pr-12 group-hover:text-foreground transition-colors">
                    {v.title}
                  </h3>

                  {/* Category & Company - Secondary Hierarchy */}
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={cn(
                      "rounded-full font-bold text-[11px] px-2.5 py-0.5",
                      categoryColor.bg,
                      categoryColor.text,
                      "border",
                      categoryColor.border
                    )}>
                      {v.category?.name}
                    </Badge>
                    {v.companyName && (
                      <span className="text-xs text-muted-foreground font-semibold truncate">
                        {v.companyName}
                      </span>
                    )}
                  </div>

                  {/* Meta Information - Compact Row */}
                  <div className="flex items-center gap-3 mb-2 text-xs text-muted-foreground font-medium flex-wrap">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{v.city}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-3 w-3" />
                      <span>{(v.employmentType || []).slice(0, 2).map((t: string) =>
                        t.replace("_", " ")
                      ).join(", ")}</span>
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

                  {/* Footer - Applications & Status */}
                  <div className="flex items-center gap-2 mt-auto pt-2">
                    {/* Applications Count */}
                    <div className="flex items-center gap-1.5 bg-muted text-foreground rounded-lg px-2.5 py-1.5 border border-border">
                      <Users className="h-4 w-4" />
                      <span className="text-sm font-black">{applicationsCount}</span>
                      <span className="text-[10px] font-bold">sollicitaties</span>
                    </div>

                    {/* Inactive Status */}
                    {!v.isActive && (
                      <Badge className="bg-red-500/10 text-red-700 border-red-500/20 text-xs font-bold px-2 py-1">
                        Inactief
                      </Badge>
                    )}

                    {/* Archived Status */}
                    {v.archived && (
                      <Badge className="bg-orange-500/10 text-orange-700 border-orange-500/20 text-xs font-bold px-2 py-1">
                        Gearchiveerd
                      </Badge>
                    )}
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
