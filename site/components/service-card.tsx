import { cn } from "../lib/utils";

interface ServiceCardProps {
  number: string;
  title: string;
  description: string;
  dark?: boolean;
  className?: string;
}

export function ServiceCard({
  number,
  title,
  description,
  dark = false,
  className,
}: ServiceCardProps) {
  return (
    <div
      className={cn(
        "group flex items-start gap-8 py-10 border-b last:border-0",
        "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:pl-4",
        dark ? "border-white/10" : "border-border/40",
        className
      )}
    >
      <span className="text-5xl md:text-6xl font-light text-[var(--brand)] leading-none shrink-0">
        {number}
      </span>
      <div className="space-y-2 pt-1">
        <h3 className={cn("text-2xl md:text-3xl font-bold tracking-tight", dark && "text-white")}>
          {title}
        </h3>
        <p className={cn("leading-relaxed", dark ? "text-white/50" : "text-muted-foreground")}>{description}</p>
      </div>
    </div>
  );
}
