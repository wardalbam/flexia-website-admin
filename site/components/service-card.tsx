import { cn } from "../lib/utils";

interface ServiceCardProps {
  number: string;
  title: string;
  description: string;
  className?: string;
}

export function ServiceCard({
  number,
  title,
  description,
  className,
}: ServiceCardProps) {
  return (
    <div
      className={cn(
        "group flex items-start gap-8 py-10 border-b border-border/40 last:border-0",
        "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:pl-4",
        className
      )}
    >
      <span className="text-5xl md:text-6xl font-light text-[var(--brand)] leading-none shrink-0">
        {number}
      </span>
      <div className="space-y-2 pt-1">
        <h3 className="text-xl md:text-2xl font-bold tracking-tight">
          {title}
        </h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
