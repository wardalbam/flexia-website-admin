import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import "./globals.css";

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
  return (
    <html lang="nl">
      <body className={`${inter.className} antialiased`}>
        <SessionProvider>
          <Sidebar />
          <Header />
          <div role="main" className="md:ml-64 mt-2">{children}</div>
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
