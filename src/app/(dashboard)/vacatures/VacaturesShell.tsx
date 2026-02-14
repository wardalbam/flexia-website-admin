"use client";

import { useState, useMemo } from "react";
import VacatureList from "@/components/vacatures/VacatureList";
import { VacatureDetailView } from "@/components/vacatures/VacatureDetailView";

type Vacature = any;

export default function VacaturesShell({ initialVacatures }: { initialVacatures: Vacature[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedVacature = useMemo(() => {
    if (!selectedId) return null;
    return initialVacatures.find((v: any) => String(v.id) === String(selectedId)) ?? null;
  }, [initialVacatures, selectedId]);

  // If no vacancy is selected, render the normal full-width list view.
  if (!selectedVacature) {
    return (
      <div>
        <VacatureList initialVacatures={initialVacatures} onSelect={(id: string) => setSelectedId(id)} />
      </div>
    );
  }

  // When a vacancy is selected, switch to the split view: list on the left, details on the right.
  return (
    <div className="lg:flex lg:gap-6">
      <div className="lg:w-80 lg:h-[calc(100vh-6rem)] lg:overflow-auto lg:sticky lg:top-20">
        {/* Narrow list on the left inside the shell. Render compact single-column list. */}
        <VacatureList
          initialVacatures={initialVacatures}
          onSelect={(id: string) => setSelectedId(id)}
          compact
          selectedId={selectedId ?? undefined}
        />
      </div>
      <div className="lg:flex-1 mt-6 lg:mt-0">
        <VacatureDetailView
          initialVacature={selectedVacature}
          allVacatures={initialVacatures}
          onClose={() => setSelectedId(null)}
        />
      </div>
    </div>
  );
}
