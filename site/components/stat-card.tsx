import { cn } from "../lib/utils";

interface StatCardProps {
  number: string;
  label: string;
  className?: string;
}

export function StatCard({ number, label, className }: StatCardProps) {
  return (
    <div className={cn("border-t border-current/10 pt-6 space-y-2", className)}>
      <div className="text-5xl md:text-6xl font-light tracking-tight">
        {number}
      </div>
      <div className="text-xs uppercase tracking-[0.15em] opacity-50">
        {label}
      </div>
    </div>
  );
}
