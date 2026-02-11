"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCategoryColor } from "@/lib/status-colors";
import { MapPin, Briefcase, Building2, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

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

export default function VacaturesPage() {
  const [vacatures, setVacatures] = useState<Vacature[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedEmployment, setSelectedEmployment] = useState<string>("all");

  useEffect(() => {
    const fetchVacatures = async () => {
      try {
        // Resolve API URL at runtime: prefer NEXT_PUBLIC_API_URL, fall back to current origin.
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL ??
          (typeof window !== "undefined" ? window.location.origin : "");
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

  // Get unique values for filters
  const categories = Array.from(
    new Set(vacatures.map((v) => v.category?.name).filter(Boolean))
  );
  const cities = Array.from(new Set(vacatures.map((v) => v.city)));
  const employmentTypes = Array.from(
    new Set(vacatures.flatMap((v) => v.employmentType))
  );

  // Filter vacatures based on selections
  const filteredVacatures = vacatures.filter((v) => {
    const categoryMatch =
      selectedCategory === "all" || v.category?.name === selectedCategory;
    const cityMatch = selectedCity === "all" || v.city === selectedCity;
    const employmentMatch =
      selectedEmployment === "all" ||
      v.employmentType?.includes(selectedEmployment);

    return categoryMatch && cityMatch && employmentMatch;
  });

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Vacatures laden...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight">
          Beschikbare Vacatures
        </h1>
        <p className="text-lg text-muted-foreground">
          {filteredVacatures.length}{" "}
          {filteredVacatures.length === 1 ? "vacature" : "vacatures"} gevonden
        </p>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Categorie</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Alle categorieën" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle categorieën</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat || ""}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Locatie</label>
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Alle locaties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle locaties</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Dienstverband</label>
            <Select
              value={selectedEmployment}
              onValueChange={setSelectedEmployment}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Alle typen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle typen</SelectItem>
                {employmentTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Job Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVacatures.map((v) => {
          const categoryColor = getCategoryColor(v.category?.name);
          return (
            <Link key={v.id} href={`/vacatures/${v.id}/apply`}>
              <Card className="relative shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer border border-border h-full flex flex-col bg-card rounded-lg overflow-hidden group">
                <CardContent className="px-4 py-3 flex-1 flex flex-col">
                  {/* Vacancy Number Badge - Top Right Corner */}
                  <div className="absolute top-2 right-2 bg-muted/50 text-muted-foreground text-[10px] font-bold px-2 py-0.5 rounded">
                    #{v.vacatureNumber}
                  </div>

                  {/* Title - Primary Hierarchy */}
                  <h3 className="text-xl md:text-lg font-extrabold tracking-tight line-clamp-2 mb-2 pr-12 group-hover:text-primary transition-colors">
                    {v.title}
                  </h3>

                  {/* Category & Company - Secondary Hierarchy */}
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <Badge
                      className={cn(
                        "rounded-full text-xs px-2 py-0.5 font-semibold",
                        categoryColor.bg,
                        categoryColor.text,
                        "border",
                        categoryColor.border
                      )}
                    >
                      {v.category?.name || "Algemeen"}
                    </Badge>
                    {v.companyName && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground font-semibold">
                        <Building2 className="h-3 w-3" />
                        <span className="truncate">{v.companyName}</span>
                      </div>
                    )}
                  </div>

                  {/* Meta Information - Compact */}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{v.city}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-3 w-3" />
                      <span>
                        {v.employmentType?.[0]?.replace("_", " ") || ""}
                      </span>
                    </div>
                  </div>

                  {/* Description Preview */}
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3 flex-1">
                    {v.description}
                  </p>

                  {/* Salary & Apply CTA */}
                  <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <span className="text-sm font-bold text-foreground">
                      €{v.salary}/uur
                    </span>
                    <span className="text-xs font-bold text-primary group-hover:underline">
                      Solliciteer nu →
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredVacatures.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            Geen vacatures gevonden met de geselecteerde filters.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Probeer andere filters of kom later terug.
          </p>
        </div>
      )}
    </div>
  );
}
