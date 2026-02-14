"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export function Header({ title }: { title?: string }) {
  const { data: session } = useSession();
  const pathname = usePathname() || "/";

  // Don't render the header on the login page
  if (pathname === "/login") return null;

  // Compute a friendly title from the pathname when no explicit title is passed.
  const inferredTitle = title || (() => {
    if (pathname === "/" || pathname === "") return "Dashboard";
    if (pathname.startsWith("/vacatures/new")) return "Nieuwe Vacature";
    if (pathname.startsWith("/vacatures") && pathname.includes("/edit")) return "Bewerken";
    if (pathname.startsWith("/vacatures")) return "Vacatures";
    if (pathname.startsWith("/applications")) return "Sollicitaties";
    if (pathname.startsWith("/settings")) return "Instellingen";
    return "";
  })();

  return (
    <header className="sticky top-0 z-40 w-full glass shadow-layered">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Mobile: Logo icon + title */}
        <div className="flex items-center gap-3 md:hidden">
          <div className="w-8 h-8 bg-[var(--brand)] rounded-lg flex items-center justify-center">
            <span className="text-black font-black text-sm">F</span>
          </div>
          <div>
            <h1 className="text-base font-bold">{inferredTitle}</h1>
          </div>
        </div>

        {/* Desktop: Page title only */}
        <div className="hidden md:block">
          <h1 className="text-xl font-bold">{inferredTitle}</h1>
        </div>

        {/* User profile (both mobile and desktop) */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold">{session?.user?.name || "Admin"}</p>
            <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
          </div>
          <div className="w-10 h-10 bg-[var(--brand)]/10 rounded-full flex items-center justify-center border-2 border-[var(--brand)]/20">
            <span className="text-[var(--brand)] text-sm font-black">
              {(session?.user?.name || "A")[0].toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
