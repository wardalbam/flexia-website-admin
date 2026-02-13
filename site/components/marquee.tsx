import { cn } from "../lib/utils";

interface MarqueeProps {
  text?: string;
  className?: string;
  speed?: number;
}

export function Marquee({
  text = "FLEXIA JOBS",
  className,
  speed = 35,
}: MarqueeProps) {
  const items = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className={cn("overflow-hidden py-6 select-none", className)}>
      <div
        className="flex animate-marquee whitespace-nowrap"
        style={{ animationDuration: `${speed}s` }}
      >
        {[...items, ...items].map((_, i) => (
          <span
            key={i}
            className="text-sm uppercase tracking-[0.3em] font-normal opacity-[0.15] text-foreground flex items-center"
          >
            {text}
            <span className="mx-6 opacity-50">&mdash;</span>
          </span>
        ))}
      </div>
    </div>
  );
}
