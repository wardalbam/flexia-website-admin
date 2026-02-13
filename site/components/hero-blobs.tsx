"use client";

import React, { useEffect, useRef } from "react";

export default function HeroBlobs() {
  const blob1Ref = useRef<HTMLImageElement | null>(null);
  const blob2Ref = useRef<HTMLImageElement | null>(null);
  const textureRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    // Honor users who prefer reduced motion
    if (typeof window === "undefined") return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let rafId: number | null = null;

    function update() {
      const scrollY = window.scrollY || 0;

      // gentle multipliers for parallax — tuned to be subtle
      const t1Y = -(scrollY * 0.06); // blob1 moves slightly up
      const t1X = -(scrollY * 0.01);
      const t1R = scrollY * 0.0006;

      const t2Y = scrollY * 0.035; // blob2 moves down a bit
      const t2X = scrollY * 0.02;
      const t2R = -scrollY * 0.00045;

      const texY = -(scrollY * 0.02);

      if (blob1Ref.current) {
        blob1Ref.current.style.transform = `translate3d(${t1X}px, ${t1Y}px, 0) rotate(${t1R}rad)`;
      }
      if (blob2Ref.current) {
        blob2Ref.current.style.transform = `translate3d(${t2X}px, ${t2Y}px, 0) rotate(${t2R}rad)`;
      }
      if (textureRef.current) {
        textureRef.current.style.transform = `translate3d(0, ${texY}px, 0)`;
      }
      rafId = null;
    }

    function onScroll() {
      if (rafId != null) return;
      rafId = requestAnimationFrame(update);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    // run once to set initial positions
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <img
        ref={blob1Ref}
        src="/images/hero-blob-1.svg"
        alt=""
        aria-hidden
        style={{ willChange: "transform" }}
        className="absolute -z-20 left-[-8%] top-[-6%] w-[40rem] opacity-90 mix-blend-multiply filter blur-sm"
      />

      <img
        ref={blob2Ref}
        src="/images/hero-blob-2.svg"
        alt=""
        aria-hidden
        style={{ willChange: "transform" }}
        className="absolute -z-10 right-[-8%] top-14 w-[56rem] opacity-60 mix-blend-screen"
      />

      <img
        ref={textureRef}
        src="/images/hero-texture.svg"
        alt=""
        aria-hidden
        style={{ willChange: "transform" }}
        className="absolute inset-0 -z-10 w-full h-full opacity-10 pointer-events-none"
      />
    </>
  );
}
