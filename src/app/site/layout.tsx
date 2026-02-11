import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Flexia Jobs - Public Site",
  description: "Zoek en solliciteer op vacatures",
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body className="antialiased">
        <header className="border-b bg-background/50 p-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <Link href="/site" className="text-lg font-bold">Flexia Jobs</Link>
            <nav className="flex items-center gap-4">
              <Link href="/site" className="text-sm hover:underline">Home</Link>
              <Link href="/site/vacatures" className="text-sm hover:underline">Vacatures</Link>
            </nav>
          </div>
        </header>

        <main className="max-w-5xl mx-auto p-6">{children}</main>

        <footer className="border-t p-4 mt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Flexia Jobs
        </footer>
      </body>
    </html>
  );
}
