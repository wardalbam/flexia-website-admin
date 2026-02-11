import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface FilterChipProps {
  label: string;
  selected: boolean;
  onToggle: () => void;
  count?: number;
}

export function FilterChip({ label, selected, onToggle, count }: FilterChipProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all",
        "border-2 whitespace-nowrap",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        selected
          ? "bg-primary text-primary-foreground border-primary shadow-sm scale-105"
          : "bg-background text-foreground border-border hover:bg-muted hover:border-muted-foreground/20"
      )}
    >
      {label}
      {count !== undefined && (
        <span className={cn(
          "px-1.5 py-0.5 rounded-full text-xs font-bold",
          selected ? "bg-primary-foreground/20" : "bg-muted"
        )}>
          {count}
        </span>
      )}
      {selected && <X className="h-3 w-3" />}
    </button>
  );
}
