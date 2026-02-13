"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";

type Vacature = {
  id: string;
  title: string;
  description?: string;
  salary?: number;
  vacatureNumber?: number;
  category?: { name: string } | null;
};

export default function RecentVacaturesSlider({ vacatures, variant = "dark" }: { vacatures: Vacature[]; variant?: "dark" | "light" }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [current, setCurrent] = useState(0);
  const pauseRef = useRef(false);

  function scroll(dir: "left" | "right") {
    const el = containerRef.current;
    if (!el) return;
    const amount = Math.round(el.clientWidth * 0.8);
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  }

  function scrollToIndex(i: number) {
    const el = containerRef.current;
    if (!el) return;
    const amount = Math.round(el.clientWidth * 0.8);
    el.scrollTo({ left: i * amount, behavior: "smooth" });
  }

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    function onScroll() {
      const el2 = containerRef.current;
      if (!el2) return;
      const amount = Math.round(el2.clientWidth * 0.8);
      const idx = Math.round(el2.scrollLeft / (amount || 1));
      setCurrent(idx);
    }
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    // autoplay
    const id = setInterval(() => {
      if (pauseRef.current) return;
      const el = containerRef.current;
      if (!el) return;
      const amount = Math.round(el.clientWidth * 0.8);
      const maxIdx = Math.max(0, Math.ceil(el.scrollWidth / amount) - 1);
      const next = Math.min(maxIdx, Math.round(el.scrollLeft / (amount || 1)) + 1);
      if (next > Math.round(el.scrollLeft / (amount || 1))) {
        el.scrollBy({ left: amount, behavior: "smooth" });
      } else {
        // wrap to start
        el.scrollTo({ left: 0, behavior: "smooth" });
      }
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative" onMouseEnter={() => (pauseRef.current = true)} onMouseLeave={() => (pauseRef.current = false)}>
      <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-20 hidden md:block">
        <button
          aria-label="Vorige vacatures"
          onClick={() => scroll("left")}
          className="p-2 rounded-full bg-white/8 hover:bg-white/12 text-white border border-white/10 shadow-sm"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      </div>

      <div className="overflow-x-auto scrollbar-hide scroll-smooth -mx-6 px-6 md:mx-0 md:px-0" ref={containerRef}>
        <div className="flex gap-6 w-max">
          {vacatures.map((v) => {
            const isLight = variant === "light";
            return (
              <Link key={v.id} href={`/vacatures/${v.id}/apply`} className="block min-w-[300px] md:min-w-[360px]">
                <div
                  className={`group relative rounded-lg p-6 md:p-8 transition-all duration-500 cursor-pointer h-full ${
                    isLight
                      ? "bg-white border border-border hover:shadow-md"
                      : "border border-white/10 hover:border-white/20 hover:bg-white/5 bg-transparent"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-[var(--brand)]">{v.category?.name || "Horeca"}</span>
                      <span className={`${isLight ? "text-muted-foreground" : "text-white/30"} text-xs`}>#{v.vacatureNumber}</span>
                    </div>
                    <h3 className={`text-lg font-bold transition-colors duration-300 line-clamp-2 ${isLight ? "text-foreground group-hover:text-[var(--brand)]" : "text-white group-hover:text-[var(--brand)]"}`}>{v.title}</h3>
                    <p className={`${isLight ? "text-muted-foreground" : "text-white/40"} text-sm line-clamp-3`}>{v.description}</p>
                    <div className={`flex items-center justify-between pt-4 border-t ${isLight ? "border-border" : "border-white/10"}`}>
                      <span className={`${isLight ? "text-foreground" : "text-white"} text-sm font-medium`}>€{v.salary}/uur</span>
                      <ArrowUpRight className={`h-4 w-4 transition-all duration-300 ${isLight ? "text-muted-foreground group-hover:text-[var(--brand)]" : "text-white/30 group-hover:text-[var(--brand)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"}`} />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-20 hidden md:block">
        <button
          aria-label="Volgende vacatures"
          onClick={() => scroll("right")}
          className="p-2 rounded-full bg-white/8 hover:bg-white/12 text-white border border-white/10 shadow-sm"
        >
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>

      {/* pagination dots */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {Array.from({ length: Math.max(1, vacatures.length) }).map((_, i) => (
          <button
            key={i}
            aria-label={`Ga naar slide ${i + 1}`}
            aria-current={i === current}
            onClick={() => scrollToIndex(i)}
            className={`w-2 h-2 rounded-full transition-opacity duration-200 ${i === current ? "bg-white" : "bg-white/30"}`}
          />
        ))}
      </div>

      {/* small screens: hint to swipe */}
      <div className="mt-4 text-sm text-white/60 md:hidden">Swipe om meer vacatures te zien</div>
    </div>
  );
}
