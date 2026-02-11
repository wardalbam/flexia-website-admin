"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Briefcase, Users, Settings, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/vacatures", label: "Vacatures", icon: Briefcase },
  { href: "/applications", label: "Sollicitaties", icon: Users },
  { href: "/settings", label: "Instellingen", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  // Hide the sidebar on the login page
  if (pathname === "/login") return null;

  return (
    <aside className="hidden md:block fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-border px-6">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-primary-foreground font-black text-lg">F</span>
          </div>
          <span className="font-black text-xl tracking-tight">Flexia</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm scale-[1.02]"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-[1.01]"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-border p-4">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive hover:scale-[1.01]"
          >
            <LogOut className="h-5 w-5" />
            Uitloggen
          </button>
        </div>
      </div>
    </aside>
  );
}
