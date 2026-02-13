"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "../lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/vacatures", label: "Vacatures" },
  { href: "/ik-zoek-werk", label: "Ik zoek werk" },
  { href: "/ik-zoek-personeel", label: "Ik zoek personeel" },
  { href: "/solliciteer", label: "Solliciteer" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [heroDark, setHeroDark] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Detect whether the header overlaps a dark section
  useEffect(() => {
    const darkSections = document.querySelectorAll(
      '.surface-dark, .surface-darker, [data-header-theme="dark"]'
    );

    if (darkSections.length === 0) {
      setHeroDark(false);
      return;
    }

    // Observe only sections near the top of the viewport (header area ~5%)
    const observer = new IntersectionObserver(
      (entries) => {
        const anyDark = entries.some((entry) => entry.isIntersecting);
        setHeroDark(anyDark);
      },
      { rootMargin: "0px 0px -90% 0px" }
    );

    darkSections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  // When not scrolled, use light text only if hero is dark
  const lightText = !scrolled && heroDark;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "glass shadow-layered py-3"
          : mobileOpen
            ? heroDark
              ? "glass-dark py-3"
              : "glass py-3"
            : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between">
          {/* Logo — typographic only */}
          <Link href="/" className="group flex items-baseline">
            <span
              className={cn(
                "text-[1.35rem] font-bold tracking-tight transition-colors duration-500 group-hover:opacity-80",
                lightText ? "text-white" : "text-foreground"
              )}
            >
              flexia
            </span>
            <span className="text-[1.35rem] font-bold" style={{ color: "var(--brand)" }}>
              .
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-[0.8125rem] font-medium tracking-wide uppercase animated-underline transition-colors duration-500",
                  lightText
                    ? pathname === link.href
                      ? "text-white"
                      : "text-white/60 hover:text-white"
                    : pathname === link.href
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/solliciteer"
              className={cn(
                "ml-2 inline-flex items-center justify-center rounded-full px-7 py-2.5 text-[0.8125rem] font-semibold tracking-wide transition-all duration-500 hover:scale-[1.02]",
                lightText
                  ? "bg-white text-foreground hover:bg-white/90"
                  : "bg-foreground text-background hover:opacity-90"
              )}
            >
              Solliciteer Nu
            </Link>
          </nav>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={cn(
              "md:hidden p-2 -mr-2 transition-colors duration-500",
              lightText ? "text-white" : "text-foreground"
            )}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu — slide-down panel */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          mobileOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div
          className={cn(
            "px-6 pt-6 pb-8 mt-4 border-t",
            lightText ? "border-white/10" : "border-border/50"
          )}
        >
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block py-3.5 text-[0.9375rem] font-medium tracking-wide transition-colors duration-300 border-b last:border-b-0",
                  lightText
                    ? cn(
                        "border-white/10",
                        pathname === link.href
                          ? "text-white"
                          : "text-white/60 hover:text-white"
                      )
                    : cn(
                        "border-border/30",
                        pathname === link.href
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6">
            <Link
              href="/solliciteer"
              className={cn(
                "block w-full text-center rounded-full py-3.5 text-[0.875rem] font-semibold tracking-wide transition-all duration-500",
                lightText
                  ? "bg-white text-foreground hover:bg-white/90"
                  : "bg-foreground text-background hover:opacity-90"
              )}
            >
              Solliciteer Nu
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
