import type { Metadata } from "next";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Read request headers set by middleware. When the login page is requested
  // the middleware will add `x-hide-layout: 1` so we can avoid rendering the
  // Sidebar and Header for that route.
  const reqHeaders = headers() as unknown as { get?: (name: string) => string | null };
  const hideLayout = reqHeaders.get?.("x-hide-layout") === "1";
  return (
    <html lang="nl">
      <body className={`${inter.className} antialiased`}>
        <SessionProvider>
          {!hideLayout && <Sidebar />}
          {!hideLayout && <Header />}
          <div
            role="main"
            className={cn(
              "min-h-screen mt-2",
              hideLayout ? "" : "md:ml-64 pb-20 md:pb-4"
            )}
          >
            {children}
          </div>
          {!hideLayout && <MobileBottomNav />}
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
