import Link from "next/link";
import { ArrowRight, ArrowUpRight, Phone, Mail, MessageCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { AnimatedSection } from "../components/animated-section";
import { Marquee } from "../components/marquee";
import { SectionHeading } from "../components/section-heading";
import { StatCard } from "../components/stat-card";
import { ServiceCard } from "../components/service-card";
import RecentVacaturesSlider from "../components/recent-vacatures-slider";
import HeroBlobs from "../components/hero-blobs";

import { apiUrl } from "../lib/api";

async function getVacatures() {
  try {
    const res = await fetch(apiUrl(`/api/vacatures?active=true`), { cache: "no-store" });
    if (res.ok) return await res.json();
  } catch (err) {
    console.error("getVacatures fetch error:", err);
  }
  return [];
}

export default async function HomePage() {
  const vacatures = await getVacatures();
  const count = vacatures.length;

  return (
    <>
      {/* ========== HERO — compact, bold, accent with layered artful background ========== */}
      <section className="relative py-20 md:py-28 flex items-center bg-background overflow-hidden" data-header-theme="dark">
          {/* Decorative layered background: subtle image + SVG blobs + gradient overlay */}
          <div
            aria-hidden
            className="absolute inset-0 -z-20 bg-cover bg-center"
            style={{
              backgroundImage:
                "linear-gradient(rgba(8,7,23,0.5), rgba(8,7,23,0.45)), url('https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1600&q=80&auto=format&fit=crop')",
            }}
          />

    {/* Decorative animated blobs (client-side) */}
    <HeroBlobs />
        <svg className="absolute -z-20 right-0 top-0 w-[40rem] opacity-20" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(300,300)">
            <path d="M120,-160C160,-120,180,-60,180,-2C180,56,160,112,120,150C80,188,40,208,-6,216C-52,224,-104,220,-152,192C-200,164,-244,112,-260,52C-276,-8,-264,-76,-228,-122C-192,-168,-132,-192,-72,-200C-12,-208,48,-200,120,-160Z" fill="#ff7a59" />
          </g>
        </svg>
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-3xl space-y-6">
            <AnimatedSection>
              {count > 0 && (
                <div className="inline-flex items-center gap-3 text-sm text-muted-foreground border border-border rounded-full px-4 py-1">
                  <span className="w-2 h-2 rounded-full bg-[var(--brand)] animate-pulse" />
                  {count} open vacatures
                </div>
              )}
            </AnimatedSection>

            <AnimatedSection delay={0.05}>
              <h1 className="text-4xl md:text-5xl font-extrabold text-foreground leading-tight">
                De flexibele kracht
                <br />
                achter jouw <span className="text-[var(--brand)]">horeca</span>
              </h1>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-snug font-medium">
                Werk wanneer jij wilt, personeel wanneer jij het nodig hebt — snel, betrouwbaar en met een glimlach.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.25}>
              <div className="flex flex-col sm:flex-row gap-3 pt-3">
                <Button asChild size="lg" variant="brand" className="rounded-full px-7 py-3 text-base font-semibold shadow-md">
                  <Link href="/vacatures">
                    Bekijk vacatures
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full px-7 py-3 text-base font-semibold border border-border text-foreground hover:bg-[var(--brand)]/6">
                  <Link href="#werkgevers">
                    Ik zoek personeel
                    <ArrowUpRight className="ml-2 h-5 w-5 transition-transform duration-300" />
                  </Link>
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ========== MARQUEE ========== */}
      <Marquee />

      {/* ========== DUAL PANEL — Werknemers & Werkgevers ========== */}
      <section className="py-24 md:py-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-2">
            {/* Werknemers */}
            <AnimatedSection animation="slide-left">
              <div className="group relative bg-secondary rounded-lg p-10 md:p-14 h-full transition-all duration-500 hover:shadow-layered">
                <div className="space-y-6">
                  <span className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--brand)]">
                    Werknemers
                  </span>
                  <h3 className="text-heading font-bold">
                    Werken wanneer jij wilt?
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    Bij Flexia Jobs bepaal jij wanneer je werkt. Je komt terecht bij de mooiste
                    evenementen en gezelligste horecazaken. En het belangrijkste: je krijgt gewoon
                    eerlijk betaald.
                  </p>
                  <div className="pt-4">
                    <Link
                      href="/vacatures"
                      className="inline-flex items-center gap-2 text-sm font-medium animated-underline group/link"
                    >
                      Bekijk vacatures
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Werkgevers */}
            <AnimatedSection animation="slide-right" id="werkgevers">
              <div className="group relative surface-dark rounded-lg p-10 md:p-14 h-full transition-all duration-500 hover:shadow-layered-dark">
                <div className="space-y-6">
                  <span className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--brand)]">
                    Werkgevers
                  </span>
                  <h3 className="text-heading font-bold text-white">
                    Personeel op afroep.
                  </h3>
                  <p className="text-white/50 leading-relaxed text-lg">
                    Flexia Jobs levert niet zomaar handjes, wij leveren gastvrijheid.
                    Onze poule bestaat uit geselecteerde, gemotiveerde krachten die
                    direct inzetbaar zijn.
                  </p>
                  <div className="pt-4">
                    <Link
                      href="/solliciteer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-white animated-underline group/link"
                    >
                      Neem contact op
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ========== DIVIDER ========== */}
      <hr className="section-divider mx-auto max-w-7xl" />

      {/* ========== DIENSTEN ========== */}
      <section className="py-24 md:py-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Left: heading */}
            <div className="lg:sticky lg:top-32 lg:self-start space-y-6">
              <SectionHeading
                badge="Onze diensten"
                title="Het horeca uitzendbureau"
                description="Bij Flexia Jobs verbinden we jongeren die willen werken met horeca bedrijven die snel versterking nodig hebben. Snel, betrouwbaar en altijd met een glimlach."
                align="left"
              />
            </div>

            {/* Right: services */}
            <div>
              <AnimatedSection>
                <ServiceCard number="01" title="Flex personeel" description="Direct inzetbare medewerkers voor jouw horecabedrijf. Flexibel, betrouwbaar en altijd gemotiveerd." />
                <ServiceCard number="02" title="Matching en facturatie" description="Wij matchen de juiste mensen met de juiste werkplek en regelen de volledige administratie." />
                <ServiceCard number="03" title="Evenementen personeel" description="Van festivals tot bedrijfsfeesten — wij leveren professioneel personeel voor elk evenement." />
                <ServiceCard number="04" title="Werving & Selectie" description="Op zoek naar vast personeel? Wij selecteren de beste kandidaten voor jouw team." />
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* ========== STATS — Dark band ========== */}
      <section className="surface-dark py-20 md:py-28 relative overflow-hidden">
        <div className="mesh-blob mesh-brand w-[600px] h-[600px] -top-40 left-1/4 opacity-30" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <AnimatedSection><StatCard number="500+" label="Flexwerkers ingezet" /></AnimatedSection>
            <AnimatedSection delay={0.1}><StatCard number="50+" label="Horecapartners" /></AnimatedSection>
            <AnimatedSection delay={0.2}><StatCard number="24/7" label="Bereikbaar" /></AnimatedSection>
            <AnimatedSection delay={0.3}><StatCard number="98%" label="Tevredenheid" /></AnimatedSection>
          </div>
        </div>
      </section>

      {/* ========== CATEGORIES ========== */}
      <section className="py-24 md:py-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-16">
          <SectionHeading
            badge="Categorieën"
            title="Waar wil jij werken?"
            description="Kies uit onze populairste categorieën en vind de perfecte baan."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Catering & Party", description: "Werk op feesten, events en partijen waar altijd wat te doen is." },
              { title: "Spoelkeuken", description: "Zorg jij dat alles in de keuken blijft draaien? Simpel werk, flexibele shifts." },
              { title: "Keukenhulp", description: "Werk mee in de keuken en zorg dat alles soepel loopt achter de schermen." },
              { title: "Bediening", description: "Leuke uitdagende baan in de bediening in een Horeca bedrijf." },
            ].map((cat, i) => (
              <AnimatedSection key={cat.title} delay={i * 0.1}>
                <Link href="/vacatures">
                  <div className="group relative bg-secondary rounded-lg p-8 h-full transition-all duration-500 hover:bg-foreground hover:text-background cursor-pointer">
                    <div className="space-y-4">
                      <span className="text-xs font-medium uppercase tracking-[0.15em] text-[var(--brand)]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="text-lg font-bold">{cat.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-white/50 transition-colors duration-500">
                        {cat.description}
                      </p>
                      <div className="pt-2">
                        <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all duration-500 group-hover:text-[var(--brand)] group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CONTACT CTA ========== */}
      <section className="py-24 md:py-40 relative overflow-hidden">
        <div className="mesh-blob mesh-brand w-[800px] h-[800px] -top-64 left-1/2 -translate-x-1/2 opacity-20" />
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center space-y-10 relative z-10">
          <AnimatedSection>
            <h2 className="text-display font-bold">
              Klaar om te beginnen?
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Neem vandaag nog contact met ons op en ontdek wat Flexia Jobs
              voor jou kan betekenen.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:0682712876"
                className="inline-flex items-center justify-center gap-3 rounded-full px-8 py-4 bg-foreground text-background text-sm font-medium transition-all duration-300 hover:-translate-y-[1px] hover:shadow-layered-lg"
              >
                <Phone className="h-4 w-4" />
                06 82 71 28 76
              </a>
              <a
                href="https://wa.me/31682712876"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 rounded-full px-8 py-4 border border-border text-sm font-medium transition-all duration-300 hover:-translate-y-[1px] hover:shadow-layered"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
              <a
                href="mailto:info@flexiajobs.nl"
                className="inline-flex items-center justify-center gap-3 rounded-full px-8 py-4 border border-border text-sm font-medium transition-all duration-300 hover:-translate-y-[1px] hover:shadow-layered"
              >
                <Mail className="h-4 w-4" />
                E-mail
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ========== RECENT VACATURES (slider) ========== */}
      {vacatures.length > 0 && (
        <section className="py-24 md:py-40 bg-white relative overflow-hidden">
          <div className="mesh-blob mesh-brand w-[600px] h-[600px] top-0 -right-40 opacity-20" />
          <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-8 relative z-10">
            <div className="flex items-end justify-between">
              <SectionHeading
                badge="Nieuwste"
                title="Recente vacatures"
                align="left"
              />
              <Link href="/vacatures" className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors animated-underline">
                Alle vacatures <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <RecentVacaturesSlider vacatures={vacatures.slice(0, 12)} variant="light" />

            <div className="text-center md:hidden pt-4">
              <Button asChild variant="outline" className="bg-transparent rounded-full px-8 font-medium border-border text-foreground hover:bg-foreground/6">
                <Link href="/vacatures">
                  Alle vacatures
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
