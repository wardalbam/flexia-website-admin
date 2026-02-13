import { cn } from "../lib/utils";
import { type ReactNode } from "react";

interface GradientBackgroundProps {
  children: ReactNode;
  variant?: "hero" | "section" | "dark";
  className?: string;
}

export function GradientBackground({
  children,
  variant = "hero",
  className,
}: GradientBackgroundProps) {
  const blobs: Record<string, ReactNode> = {
    hero: (
      <>
        <div className="mesh-blob mesh-brand animate-mesh w-[800px] h-[800px] -top-64 -right-64" />
        <div className="mesh-blob mesh-blue animate-mesh w-[600px] h-[600px] bottom-0 -left-48" style={{ animationDelay: "5s" }} />
      </>
    ),
    section: (
      <div className="mesh-blob mesh-brand animate-mesh w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
    ),
    dark: (
      <>
        <div className="mesh-blob mesh-brand animate-mesh w-[700px] h-[700px] opacity-50 -top-32 left-1/4" style={{ animationDelay: "3s" }} />
        <div className="mesh-blob mesh-purple animate-mesh w-[500px] h-[500px] opacity-40 bottom-0 right-1/4" style={{ animationDelay: "8s" }} />
      </>
    ),
  };

  return (
    <section
      className={cn(
        "relative overflow-hidden",
        variant === "dark" && "surface-dark",
        className
      )}
    >
      {blobs[variant]}
      <div className="relative z-10">{children}</div>
    </section>
  );
}
