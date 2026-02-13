import Link from "next/link";
import { Phone, Mail, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="surface-dark">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 pt-20 pb-12">
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-20">
          {/* Brand + Navigation */}
          <div className="space-y-8">
            {/* Logo */}
            <Link href="/" className="inline-flex items-baseline">
              <span className="text-[1.35rem] font-bold tracking-tight text-white">
                flexia
              </span>
              <span className="text-[1.35rem] font-bold" style={{ color: "var(--brand)" }}>
                .
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-white/50 max-w-xs">
              De flexibele kracht achter jouw horecateam. Werk wanneer jij wilt, personeel wanneer jij het nodig hebt.
            </p>
            <nav className="flex flex-col gap-3 pt-2">
              <Link
                href="/"
                className="text-sm text-white/50 hover:text-white/80 transition-colors duration-300"
              >
                Home
              </Link>
              <Link
                href="/vacatures"
                className="text-sm text-white/50 hover:text-white/80 transition-colors duration-300"
              >
                Vacatures
              </Link>
              <Link
                href="/solliciteer"
                className="text-sm text-white/50 hover:text-white/80 transition-colors duration-300"
              >
                Solliciteer
              </Link>
            </nav>
          </div>

          {/* Categories */}
          <div className="space-y-6">
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-white/30">
              Categorie&euml;n
            </h4>
            <nav className="flex flex-col gap-3">
              <Link
                href="/vacatures"
                className="text-sm text-white/50 hover:text-white/80 transition-colors duration-300"
              >
                Catering &amp; Party
              </Link>
              <Link
                href="/vacatures"
                className="text-sm text-white/50 hover:text-white/80 transition-colors duration-300"
              >
                Bediening
              </Link>
              <Link
                href="/vacatures"
                className="text-sm text-white/50 hover:text-white/80 transition-colors duration-300"
              >
                Spoelkeuken
              </Link>
              <Link
                href="/vacatures"
                className="text-sm text-white/50 hover:text-white/80 transition-colors duration-300"
              >
                Keukenhulp
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-white/30">
              Contact
            </h4>
            <div className="flex flex-col gap-4">
              <a
                href="tel:0682712876"
                className="flex items-center gap-3 text-sm text-white/50 hover:text-white/80 transition-colors duration-300 group"
              >
                <Phone className="h-4 w-4 text-white/30 group-hover:text-white/60 transition-colors duration-300" />
                06 82 71 28 76
              </a>
              <a
                href="mailto:info@flexiajobs.nl"
                className="flex items-center gap-3 text-sm text-white/50 hover:text-white/80 transition-colors duration-300 group"
              >
                <Mail className="h-4 w-4 text-white/30 group-hover:text-white/60 transition-colors duration-300" />
                info@flexiajobs.nl
              </a>
              <a
                href="https://wa.me/31682712876"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-white/50 hover:text-white/80 transition-colors duration-300 group"
              >
                <MessageCircle className="h-4 w-4 text-white/30 group-hover:text-white/60 transition-colors duration-300" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} Flexia Jobs. Alle rechten voorbehouden.
          </p>
          <p className="text-xs text-white/30">
            Flexibel Horeca Personeel
          </p>
        </div>
      </div>
    </footer>
  );
}
