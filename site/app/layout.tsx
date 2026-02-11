import React from "react";
import Link from "next/link";
import "./globals.css";
import { Briefcase } from "lucide-react";

export const metadata = {
  title: "Flexia Jobs - Vind je volgende baan",
  description: "Zoek en solliciteer op vacatures bij Flexia",
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body>
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xl font-black tracking-tight">Flexia Jobs</span>
              </Link>
              <nav className="flex items-center gap-6">
                <Link
                  href="/"
                  className="text-sm font-semibold hover:text-primary transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/vacatures"
                  className="text-sm font-semibold hover:text-primary transition-colors"
                >
                  Vacatures
                </Link>
                <Link
                  href="/solliciteer"
                  className="text-sm font-bold text-primary hover:underline transition-colors"
                >
                  Solliciteer
                </Link>
              </nav>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-200px)]">
          {children}
        </main>

        <footer className="border-t bg-muted/30 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                <span className="font-bold">Flexia Jobs</span>
              </div>
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} Flexia. Alle rechten voorbehouden.
              </p>
              <nav className="flex items-center gap-4">
                <Link
                  href="/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/vacatures"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Vacatures
                </Link>
              </nav>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
