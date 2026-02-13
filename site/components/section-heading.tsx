import { cn } from "../lib/utils";
import { AnimatedSection } from "./animated-section";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
}

export function SectionHeading({
  badge,
  title,
  description,
  align = "center",
  dark = false,
  className,
}: SectionHeadingProps) {
  return (
    <AnimatedSection
      className={cn(
        "space-y-5",
        align === "center" && "text-center",
        className
      )}
    >
      {badge && (
        <span className="inline-block font-mono text-xs uppercase tracking-[0.2em] text-[var(--brand)]">
          {badge}
        </span>
      )}
      <h2 className={cn("text-display font-bold", dark && "text-white")}>{title}</h2>
      {description && (
        <p
          className={cn(
            "text-lg leading-relaxed",
            dark ? "text-white/50" : "text-muted-foreground",
            align === "center" && "max-w-xl mx-auto"
          )}
        >
          {description}
        </p>
      )}
    </AnimatedSection>
  );
}
