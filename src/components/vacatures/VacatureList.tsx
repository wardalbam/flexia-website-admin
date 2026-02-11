"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MapPin, Pencil } from "lucide-react";

type Vacature = any;

export default function VacatureList({ initialVacatures }: { initialVacatures: Vacature[] }) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedEmployment, setSelectedEmployment] = useState<string[]>([]);
  const [showInactive, setShowInactive] = useState<boolean>(false);

  const categories = useMemo(() => {
    return Array.from(new Set(initialVacatures.map(v => v.category))).filter(Boolean) as string[];
  }, [initialVacatures]);

  const locations = useMemo(() => {
    return Array.from(new Set(initialVacatures.map(v => v.location))).filter(Boolean) as string[];
  }, [initialVacatures]);

  const employmentTypes = useMemo(() => {
    return Array.from(new Set(initialVacatures.flatMap(v => v.employmentType || []))).filter(Boolean) as string[];
  }, [initialVacatures]);

  function toggle<T>(arr: T[], v: T) {
    return arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v];
  }

  const filtered = useMemo(() => {
    return initialVacatures.filter((v) => {
      if (!showInactive && v.isActive === false) return false;
      if (selectedCategories.length && !selectedCategories.includes(v.category)) return false;
      if (selectedLocations.length && !selectedLocations.includes(v.location)) return false;
      if (selectedEmployment.length && !v.employmentType.some((t: string) => selectedEmployment.includes(t))) return false;
      return true;
    });
  }, [initialVacatures, selectedCategories, selectedLocations, selectedEmployment, showInactive]);

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3">
        <div className="flex items-center gap-2 overflow-x-auto md:overflow-visible whitespace-nowrap md:flex-wrap py-1">
          <span className="text-sm text-muted-foreground mr-2">Categorieën:</span>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategories(toggle(selectedCategories, c))}
              className={`inline-block mr-2 px-3 py-1 rounded-full text-sm border font-semibold ${selectedCategories.includes(c) ? 'bg-primary text-background' : 'bg-background hover:bg-muted'}`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto md:overflow-visible whitespace-nowrap md:flex-wrap py-1">
          <span className="text-sm text-muted-foreground mr-2">Locaties:</span>
          {locations.map((l) => (
            <button
              key={l}
              onClick={() => setSelectedLocations(toggle(selectedLocations, l))}
              className={`inline-block mr-2 px-3 py-1 rounded-full text-sm border font-semibold ${selectedLocations.includes(l) ? 'bg-primary text-background' : 'bg-background hover:bg-muted'}`}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto md:overflow-visible whitespace-nowrap md:flex-wrap py-1">
          <span className="text-sm text-muted-foreground mr-2">Dienstverband:</span>
          {employmentTypes.map((e) => (
            <button
              key={e}
              onClick={() => setSelectedEmployment(toggle(selectedEmployment, e))}
              className={`inline-block mr-2 px-3 py-1 rounded-full text-sm border font-semibold ${selectedEmployment.includes(e) ? 'bg-primary text-background' : 'bg-background hover:bg-muted'}`}
            >
              {e.replace("_", " ")}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={showInactive} onChange={() => setShowInactive(s => !s)} />
            Toon inactieve
          </label>
          <Button variant="ghost" size="sm" onClick={() => { setSelectedCategories([]); setSelectedLocations([]); setSelectedEmployment([]); setShowInactive(false); }}>
            Reset
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {filtered.map((v) => (
          <Card key={v.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-center min-w-[60px]">
                    <p className="text-xs text-muted-foreground">#{v.vacatureNumber}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{v.title}</h3>
                      {!v.isActive && (
                        <Badge variant="secondary" className="bg-red-100 text-red-800">Inactief</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <Badge variant="outline">{v.category}</Badge>
                      <span className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{v.location}</span>
                      <span className="text-sm text-muted-foreground">{(v.employmentType || []).map((t: string) => t.replace("_", " ").toLowerCase()).join(", ")}</span>
                      <span className="text-sm text-muted-foreground">{(v._count?.applications ?? 0)} sollicitaties</span>
                    </div>
                  </div>
                </div>
                <Link href={`/vacatures/${v.id}/edit`}>
                  <Button variant="outline" size="sm"><Pencil className="h-3.5 w-3.5 mr-1.5" />Bewerken</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
