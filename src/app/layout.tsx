import type { Metadata } from "next";
import React from "react";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { cn } from "@/lib/utils";
import "./globals.css";
import { headers } from "next/headers";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Flexia Admin",
  description: "Admin paneel voor Flexia Jobs",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Read request headers set by middleware. When the login page is requested
  // the middleware will add `x-hide-layout: 1` so we can avoid rendering the
  // Sidebar and Header for that route. `headers()` must be awaited in server
  // components before accessing `.get()`.
  const reqHeaders = await headers();
  const hideLayout = reqHeaders.get("x-hide-layout") === "1";

  // Dynamically load the client-side SW registration only when the layout
  // is shown (admin pages). This avoids shipping the SW registration to
  // server-only pages like the login route.
  let RegisterAdminSWComponent: any = null;
  if (!hideLayout) {
    try {
      const mod = await import("@/components/pwa/RegisterAdminSW");
      RegisterAdminSWComponent = mod.default;
    } catch (e) {
      // ignore dynamic import failures in environments that don't support it
    }
  }

  return (
    <html lang="nl">
      <head>
        {/* Admin-only manifest: included in the admin RootLayout so only admin pages
            expose the manifest and can be installed as a PWA. */}
        <link rel="manifest" href="/manifest-admin.json" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <SessionProvider>
          {!hideLayout && <Sidebar />}
          {!hideLayout && <Header />}
          <div
            role="main"
            className={cn(
              "min-h-screen mt-2 min-w-0",
              hideLayout ? "" : "md:ml-64 pb-20 md:pb-4"
            )}
          >
            {children}
          </div>
          {!hideLayout && <MobileBottomNav />}
          <Toaster />
          {/* Register admin service worker only when layout is rendered (i.e. admin pages) */}
          {!hideLayout && RegisterAdminSWComponent && (
            //@ts-ignore React element constructed from dynamic import
            <RegisterAdminSWComponent />
          )}
        </SessionProvider>
      </body>
    </html>
  );
}
