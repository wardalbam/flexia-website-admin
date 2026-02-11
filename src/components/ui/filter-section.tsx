import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  alwaysExpanded?: boolean;
}

export function FilterSection({
  title,
  children,
  defaultExpanded = true,
  alwaysExpanded = false
}: FilterSectionProps) {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);

  if (alwaysExpanded) {
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-foreground tracking-tight">{title}</h3>
        <div className="flex flex-wrap gap-2">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-sm font-bold text-foreground hover:text-primary transition-colors"
      >
        {title}
        <ChevronDown className={cn(
          "h-4 w-4 transition-transform",
          isExpanded && "rotate-180"
        )} />
      </button>
      {isExpanded && (
        <div className="flex flex-wrap gap-2">
          {children}
        </div>
      )}
    </div>
  );
}
