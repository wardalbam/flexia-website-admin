import type { Metadata } from "next";
import React from "react";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { SWRProvider } from "@/components/providers/swr-provider";
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
  const reqHeaders = await headers();
  const hideLayout = reqHeaders.get("x-hide-layout") === "1";

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
        <link rel="manifest" href="/manifest-admin.json" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <SessionProvider>
          <SWRProvider>
            {!hideLayout && <Sidebar />}
            <div
              role="main"
              className={cn(
                "min-h-screen min-w-0",
                hideLayout ? "" : "md:ml-64 pb-20 md:pb-4"
              )}
            >
              {children}
            </div>
            {!hideLayout && <MobileBottomNav />}
            <Toaster />
            {!hideLayout && RegisterAdminSWComponent && (
              //@ts-ignore React element constructed from dynamic import
              <RegisterAdminSWComponent />
            )}
          </SWRProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
