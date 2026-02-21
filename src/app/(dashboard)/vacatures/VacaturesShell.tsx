"use client";

import { useState, useMemo } from "react";
import { useEffect } from "react";
import useSWR from "swr";
import { useSearchParams } from "next/navigation";
import VacatureList from "@/components/vacatures/VacatureList";
import { VacatureDetailView } from "@/components/vacatures/VacatureDetailView";
import { Skeleton } from "@/components/ui/skeleton";

type Vacature = any;

export default function VacaturesShell() {
  const { data: vacatures, isLoading } = useSWR<Vacature[]>("/api/vacatures");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const searchParams = useSearchParams();

  // If a `selected` query param is present, use it to set the selected vacancy
  useEffect(() => {
    const sel = searchParams?.get("selected");
    if (sel) setSelectedId(String(sel));
  }, [searchParams]);

  const selectedVacature = useMemo(() => {
    if (!selectedId || !vacatures) return null;
    return vacatures.find((v: any) => String(v.id) === String(selectedId)) ?? null;
  }, [vacatures, selectedId]);

  if (isLoading || !vacatures) {
    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-full" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-52 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!selectedVacature) {
    return (
      <div>
        <VacatureList vacatures={vacatures} onSelect={(id: string) => setSelectedId(id)} />
      </div>
    );
  }

  return (
    <div className="lg:flex lg:gap-6">
      <div className="lg:w-80 lg:h-[calc(100vh-6rem)] lg:overflow-auto lg:sticky lg:top-20">
        <VacatureList
          vacatures={vacatures}
          onSelect={(id: string) => setSelectedId(id)}
          compact
          selectedId={selectedId ?? undefined}
        />
      </div>
      <div className="lg:flex-1 mt-6 lg:mt-0">
        <VacatureDetailView
          initialVacature={selectedVacature}
          allVacatures={vacatures}
          onClose={() => setSelectedId(null)}
        />
      </div>
    </div>
  );
}
