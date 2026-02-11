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
    <div className="space-y-6">
      {/* Compact Modern Filter Section */}
      <div className="bg-gradient-to-br from-card via-card to-primary/5 rounded-lg border border-border/50 shadow-sm p-4 backdrop-blur-sm">
        <div className="flex flex-col gap-4">
          {/* Filter Controls Row */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Category Dropdown */}
            <div className="flex items-center gap-2">
              <Select
                value={selectedCategories[0] || "all"}
                onValueChange={(value) => setSelectedCategories(value === "all" ? [] : [value])}
              >
                <SelectTrigger className={cn(
                  "px-4 py-2.5 border rounded-lg text-sm font-semibold transition-all",
                  selectedCategories.length > 0
                    ? "border-purple-400 bg-purple-100 text-purple-900 ring-2 ring-purple-200"
                    : "border-purple-200 bg-purple-50/50 text-purple-900 hover:bg-purple-100/50"
                )}>
                  <SelectValue placeholder="Alle categorieën" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle categorieën</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedCategories.length > 0 && (
                <Badge
                  className="bg-purple-500 text-white hover:bg-purple-600 cursor-pointer rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1.5"
                  onClick={() => setSelectedCategories([])}
                >
                  {selectedCategories[0]}
                  <X className="h-3 w-3" />
                </Badge>
              )}
            </div>

            {/* Location Dropdown */}
            <div className="flex items-center gap-2">
              <Select
                value={selectedLocations[0] || "all"}
                onValueChange={(value) => setSelectedLocations(value === "all" ? [] : [value])}
              >
                <SelectTrigger className={cn(
                  "px-4 py-2.5 border rounded-lg text-sm font-semibold transition-all",
                  selectedLocations.length > 0
                    ? "border-blue-400 bg-blue-100 text-blue-900 ring-2 ring-blue-200"
                    : "border-blue-200 bg-blue-50/50 text-blue-900 hover:bg-blue-100/50"
                )}>
                  <SelectValue placeholder="Alle locaties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle locaties</SelectItem>
                  {locations.map((l) => (
                    <SelectItem key={l} value={l}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedLocations.length > 0 && (
                <Badge
                  className="bg-blue-500 text-white hover:bg-blue-600 cursor-pointer rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1.5"
                  onClick={() => setSelectedLocations([])}
                >
                  {selectedLocations[0]}
                  <X className="h-3 w-3" />
                </Badge>
              )}
            </div>

            {/* Employment Type Dropdown */}
            <div className="flex items-center gap-2">
              <Select
                value={selectedEmployment[0] || "all"}
                onValueChange={(value) => setSelectedEmployment(value === "all" ? [] : [value])}
              >
                <SelectTrigger className={cn(
                  "px-4 py-2.5 border rounded-lg text-sm font-semibold transition-all",
                  selectedEmployment.length > 0
                    ? "border-green-400 bg-green-100 text-green-900 ring-2 ring-green-200"
                    : "border-green-200 bg-green-50/50 text-green-900 hover:bg-green-100/50"
                )}>
                  <SelectValue placeholder="Alle types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle types</SelectItem>
                  {employmentTypes.map((e) => (
                    <SelectItem key={e} value={e}>{e.replace("_", " ")}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedEmployment.length > 0 && (
                <Badge
                  className="bg-green-500 text-white hover:bg-green-600 cursor-pointer rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1.5"
                  onClick={() => setSelectedEmployment([])}
                >
                  {selectedEmployment[0].replace("_", " ")}
                  <X className="h-3 w-3" />
                </Badge>
              )}
            </div>

            {/* Sort Dropdown */}
            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value)}
            >
              <SelectTrigger className="px-4 py-2.5 border border-orange-200 bg-orange-50/50 rounded-lg text-sm font-semibold text-orange-900 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all hover:bg-orange-100/50">
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
              <SelectTrigger className="px-4 py-2.5 border border-gray-200 bg-gray-50/50 rounded-lg text-sm font-semibold text-gray-900 focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all hover:bg-gray-100/50">
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
              className="px-4 py-2.5 text-sm font-semibold hover:bg-red-100/50 hover:text-red-700 transition-all"
            >
              Reset
            </Button>

            {/* Results Count */}
            {filtered.length !== initialVacatures.length && (
              <Badge className="ml-auto bg-primary/10 text-primary border-primary/20 font-bold">
                {filtered.length} van {initialVacatures.length}
              </Badge>
            )}
          </div>
        </div>
      </div>

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
