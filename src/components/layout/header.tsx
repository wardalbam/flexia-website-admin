"use client";

import { useSession } from "next-auth/react";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export function Header({ title }: { title?: string }) {
  const { data: session } = useSession();
  const pathname = usePathname() || "/";

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
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur px-6">
      <div className="flex items-center gap-4">
        {/* Mobile menu trigger */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button aria-label="Open menu" className="inline-flex items-center justify-center p-2 rounded-md hover:bg-muted">
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-2 p-4">
                <Link href="/" className="px-3 py-2 rounded hover:bg-muted">Dashboard</Link>
                <Link href="/vacatures" className="px-3 py-2 rounded hover:bg-muted">Vacatures</Link>
                <Link href="/applications" className="px-3 py-2 rounded hover:bg-muted">Sollicitaties</Link>
                <Link href="/settings" className="px-3 py-2 rounded hover:bg-muted">Instellingen</Link>
                <button onClick={() => signOut({ callbackUrl: '/login' })} className="text-left px-3 py-2 rounded hover:bg-muted">Uitloggen</button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {inferredTitle ? (
          <h1 className="text-lg font-semibold">{inferredTitle}</h1>
        ) : null}
      </div>

      <div className="hidden md:flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium">{session?.user?.name || "Admin"}</p>
          <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
        </div>
        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
          <span className="text-primary text-sm font-bold">
            {(session?.user?.name || "A")[0].toUpperCase()}
          </span>
        </div>
      </div>
      {/* On mobile show the avatar/name to the right of the title */}
      <div className="md:hidden flex items-center gap-3">
        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
          <span className="text-primary text-sm font-bold">{(session?.user?.name || "A")[0].toUpperCase()}</span>
        </div>
      </div>
    </header>
  );
}
