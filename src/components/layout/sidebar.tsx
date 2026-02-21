"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Briefcase, Users, Settings, LogOut, Layers, UserCog } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/vacatures", label: "Vacatures", icon: Briefcase },
  { href: "/applications", label: "Sollicitaties", icon: Users },
  { href: "/settings/categories", label: "Categorieën", icon: Layers, adminOnly: true },
  { href: "/settings/users", label: "Gebruikers", icon: UserCog, adminOnly: true },
  { href: "/settings", label: "Instellingen", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role;
  const isAdmin = userRole === "ADMIN" || userRole === "SUPER_ADMIN";

  if (pathname === "/login") return null;

  return (
    <aside className="hidden md:block fixed left-0 top-0 z-40 h-screen w-64 border-r border-white/[0.06] bg-[var(--surface-dark)]">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-white/[0.06] px-6">
          <div className="w-9 h-9 bg-gradient-to-br from-[var(--brand)] to-[var(--brand-dark)] rounded-xl flex items-center justify-center shadow-lg shadow-[var(--brand)]/20">
            <span className="text-black font-black text-base">F</span>
          </div>
          <span className="font-black text-lg tracking-tight text-white">
            flexia<span className="text-[var(--brand)]">.</span>
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-3 pt-4">
          {navItems.map((item) => {
            if (item.adminOnly && !isAdmin) return null;

            const isActive =
              item.href === "/"
                ? pathname === "/"
                : item.href === "/settings"
                ? pathname === "/settings"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                className={cn(
                  "relative flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300",
                  isActive
                    ? "bg-[var(--brand)]/10 text-[var(--brand)]"
                    : "text-white/40 hover:bg-white/[0.04] hover:text-white/80"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[var(--brand)] rounded-r-full" />
                )}
                <item.icon className={cn("h-[18px] w-[18px]", isActive && "text-[var(--brand)]")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User info + Logout */}
        <div className="border-t border-white/[0.06] p-3 space-y-2">
          {session?.user && (
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 bg-[var(--brand)]/15 rounded-full flex items-center justify-center shrink-0">
                <span className="text-[var(--brand)] text-xs font-bold">
                  {(session.user.name || "A")[0].toUpperCase()}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white/80 truncate">{session.user.name || "Admin"}</p>
                <p className="text-[10px] text-white/30 truncate">{session.user.email}</p>
              </div>
            </div>
          )}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-white/30 transition-all duration-300 hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Uitloggen
          </button>
        </div>
      </div>
    </aside>
  );
}
