"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Briefcase, Users, Settings } from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/vacatures", label: "Vacatures", icon: Briefcase },
  { href: "/applications", label: "Sollicitaties", icon: Users },
  { href: "/settings", label: "Instellingen", icon: Settings },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  // Hide on login page
  if (pathname === "/login") return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border shadow-lg safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
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
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all flex-1 max-w-[100px]",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground active:scale-95"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 transition-transform",
                isActive && "scale-110"
              )} />
              <span className="text-xs font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
