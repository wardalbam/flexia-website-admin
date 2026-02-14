"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Briefcase, Users, Settings, LogOut, Layers, UserCog } from "lucide-react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

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

  // Hide the sidebar on the login page
  if (pathname === "/login") return null;

  return (
    <aside className="hidden md:block fixed left-0 top-0 z-40 h-screen w-64 border-r border-white/[0.08] bg-[var(--surface-dark)]">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-white/[0.08] px-6">
          <div className="w-10 h-10 bg-gradient-to-br from-[var(--brand)] to-[var(--brand-dark)] rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-black font-black text-lg">F</span>
          </div>
          <span className="font-black text-xl tracking-tight text-white">
            flexia<span className="text-[var(--brand)]">.</span>
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            // Hide admin-only items from non-admins
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
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300",
                  isActive
                    ? "bg-white/10 text-white shadow-sm"
                    : "text-white/50 hover:bg-white/[0.05] hover:text-white"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-white/[0.08] p-4">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-white/50 transition-all duration-300 hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-5 w-5" />
            Uitloggen
          </button>
        </div>
      </div>
    </aside>
  );
}
