"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";
import { cn } from "../lib/utils";

type Animation = "fade-up" | "fade-scale" | "slide-left" | "slide-right";

const animationClasses: Record<Animation, string> = {
  "fade-up": "animate-fade-in",
  "fade-scale": "animate-fade-in-scale",
  "slide-left": "animate-slide-in-left",
  "slide-right": "animate-slide-in-right",
};

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  animation?: Animation;
  delay?: number;
  id?: string;
}

export function AnimatedSection({
  children,
  className,
  animation = "fade-up",
  delay = 0,
  id,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      id={id}
      ref={ref}
      className={cn(
        isVisible ? animationClasses[animation] : "opacity-0",
        className
      )}
      style={delay ? { animationDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
