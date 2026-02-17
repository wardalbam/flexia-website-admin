import Link from "next/link";
import { Phone, Mail, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="surface-dark">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 pt-14 pb-8">
        {/* Main grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2540.25 1894.5" className="h-7 w-7 text-white"><path fill="currentColor" d="M 9.543 6.477 L 2531.781 6.477 L 2531.781 630.469 L 1265.313 630.469 C 1265.313 630.469 1278.371 796.969 1399.145 887.035 C 1495.582 958.953 1624.922 950.238 1624.922 950.238 L 2531.781 950.238 L 2531.781 1560.828 L 1668.27 1560.828 C 1668.27 1560.828 1319.551 1583.348 1052.699 1398.273 C 692.688 1148.598 653.707 719.285 653.707 719.285 L 653.707 1888.613 L 9.543 1888.613 Z"/></svg>
              <div className="flex items-baseline">
                <span className="text-[1.35rem] font-bold tracking-tight text-white">
                  flexia
                </span>
                <span className="text-[1.35rem] font-bold" style={{ color: "var(--brand)" }}>
                  .
                </span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-white/50 max-w-xs">
              De flexibele kracht achter jouw horecateam.
            </p>
          </div>

          {/* Navigatie */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-white/30">
              Navigatie
            </h4>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-sm text-white/50 hover:text-white/80 transition-colors duration-300">Home</Link>
              <Link href="/vacatures" className="text-sm text-white/50 hover:text-white/80 transition-colors duration-300">Vacatures</Link>
              <Link href="/ik-zoek-werk" className="text-sm text-white/50 hover:text-white/80 transition-colors duration-300">Ik zoek werk</Link>
              <Link href="/vind-personeel" className="text-sm text-white/50 hover:text-white/80 transition-colors duration-300">Ik zoek personeel</Link>
              <Link href="/solliciteer" className="text-sm text-white/50 hover:text-white/80 transition-colors duration-300">Solliciteer</Link>
            </nav>
          </div>

          {/* Categorieën */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-white/30">
              Categorie&euml;n
            </h4>
            <nav className="flex flex-col gap-2">
              <Link href="/vacatures" className="text-sm text-white/50 hover:text-white/80 transition-colors duration-300">Catering &amp; Party</Link>
              <Link href="/vacatures" className="text-sm text-white/50 hover:text-white/80 transition-colors duration-300">Bediening</Link>
              <Link href="/vacatures" className="text-sm text-white/50 hover:text-white/80 transition-colors duration-300">Spoelkeuken</Link>
              <Link href="/vacatures" className="text-sm text-white/50 hover:text-white/80 transition-colors duration-300">Keukenhulp</Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-white/30">
              Contact
            </h4>
            <div className="flex flex-col gap-2">
              <a href="tel:0682712876" className="flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors duration-300 group">
                <Phone className="h-3.5 w-3.5 text-white/30 group-hover:text-white/60 transition-colors duration-300" />
                06 82 71 28 76
              </a>
              <a href="mailto:info@flexiajobs.nl" className="flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors duration-300 group">
                <Mail className="h-3.5 w-3.5 text-white/30 group-hover:text-white/60 transition-colors duration-300" />
                info@flexiajobs.nl
              </a>
              <a href="https://wa.me/31682712876" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors duration-300 group">
                <MessageCircle className="h-3.5 w-3.5 text-white/30 group-hover:text-white/60 transition-colors duration-300" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} Flexia Jobs. Alle rechten voorbehouden.
          </p>
          <p className="text-xs text-white/30">
            KVK: 99067277
          </p>
        </div>
      </div>
    </footer>
  );
}
