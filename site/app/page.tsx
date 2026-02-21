import Link from "next/link";
import { ArrowRight, Phone, Mail, MessageCircle, ShieldCheck, Zap, Smile, Repeat } from "lucide-react";
import { Button } from "../components/ui/button";
import { AnimatedSection } from "../components/animated-section";
import { Marquee } from "../components/marquee";
import { SectionHeading } from "../components/section-heading";
import { ServiceCard } from "../components/service-card";
import RecentVacaturesSlider from "../components/recent-vacatures-slider";
import { AboutImage } from "../components/about-image";
import { CategoryCards } from "../components/category-cards";

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
      {/* ========== HERO ========== */}
      <section
        className="relative w-full h-screen overflow-hidden"
        aria-labelledby="hero-heading"
        data-header-theme="dark"
      >
        {/* Background image */}
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{ backgroundImage: `url('/images/personeel-banner.png')` }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

        {/* Content — editorial bottom-aligned layout */}
        <div className="relative z-10 h-full flex flex-col justify-end max-w-7xl mx-auto px-6 lg:px-8 pb-12 md:pb-20">
          {/* Badge */}
          {count > 0 && (
            <div className="inline-flex items-center gap-3 text-sm text-white/60 border border-white/15 px-4 py-1.5 mb-8 w-fit backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[var(--brand)] animate-pulse" />
              {count} open vacatures
            </div>
          )}

          {/* Grid: heading left, sub + CTAs right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
            {/* Heading */}
            <div className="lg:col-span-7">
              <h1
                id="hero-heading"
                className="font-black text-white leading-[0.9] tracking-[-0.03em] text-[clamp(3.5rem,11vw,9rem)]"
              >
                 
                <br />
                <span className="text-[var(--brand)]">Direct</span> aan de slag.
                <br />
                 
              </h1>
            </div>

            {/* Subheading + CTAs */}
            <div className="lg:col-span-5 flex flex-col gap-6 lg:pb-2">
              <p className="text-base md:text-lg text-white/60 leading-relaxed max-w-md">
                Krachtige matches tussen flexwerkers en horecazaken.
                Snelle beschikbaarheid, heldere communicatie.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/vacatures" className="inline-flex">
                  <Button
                    size="lg"
                    className="px-8 py-3 text-base font-bold bg-[var(--brand)] text-white hover:bg-[var(--brand-dark)] transition-colors"
                  >
                    Ik zoek werk
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/vind-personeel" className="inline-flex">
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-8 py-3 text-base font-bold border-white/30 text-white bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    Ik zoek personeel
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== MARQUEE ========== */}
      <Marquee />

      {/* ========== DUAL PANEL — Werknemers & Werkgevers ========== */}
      <section className="grid lg:grid-cols-2 min-h-[70vh]">
        {/* Werknemers — light panel */}
        <AnimatedSection animation="slide-left" className="h-full">
          <Link href="/vacatures" className="group relative flex flex-col justify-between h-full bg-[var(--surface-light)] p-10 md:p-16 lg:p-20 overflow-hidden cursor-pointer transition-colors duration-500 hover:bg-secondary">
            {/* Decorative large number */}
            <span
              aria-hidden
              className="absolute -right-6 -top-10 text-[clamp(10rem,20vw,18rem)] font-black leading-none text-black/[0.03] select-none transition-transform duration-700 group-hover:translate-x-3 group-hover:-translate-y-3"
            >
              01
            </span>

            {/* Top: badge */}
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-[var(--brand)] border border-[var(--brand)]/20 px-3 py-1">
                Werknemers
              </span>
            </div>

            {/* Middle: content */}
            <div className="relative z-10 mt-12 md:mt-20 space-y-5 max-w-lg">
              <h3 className="text-display font-bold text-foreground">
                Jouw volgende
                <br />
                shift wacht.
              </h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Bij Flexia Jobs bepaal jij wanneer je werkt. Je komt terecht bij de mooiste
                evenementen en gezelligste horecazaken. En het belangrijkste: je krijgt
                eerlijk betaald.
              </p>
            </div>

            {/* Bottom: CTA arrow */}
            <div className="relative z-10 mt-10 flex items-center gap-3">
              <span className="text-sm font-bold uppercase tracking-[0.15em] text-foreground">
                Bekijk vacatures
              </span>
              <div className="w-10 h-10 rounded-full border border-foreground/20 flex items-center justify-center transition-all duration-500 group-hover:bg-foreground group-hover:border-foreground">
                <ArrowRight className="h-4 w-4 text-foreground transition-all duration-500 group-hover:text-white group-hover:translate-x-0.5" />
              </div>
            </div>
          </Link>
        </AnimatedSection>

        {/* Werkgevers — dark panel */}
        <AnimatedSection animation="slide-right" id="werkgevers" className="h-full">
          <Link href="/vind-personeel" className="group relative flex flex-col justify-between h-full surface-dark p-10 md:p-16 lg:p-20 overflow-hidden cursor-pointer transition-colors duration-500 hover:bg-[#111]">
            {/* Decorative large number */}
            <span
              aria-hidden
              className="absolute -right-6 -top-10 text-[clamp(10rem,20vw,18rem)] font-black leading-none text-white/[0.03] select-none transition-transform duration-700 group-hover:translate-x-3 group-hover:-translate-y-3"
            >
              02
            </span>

            {/* Top: badge */}
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-[var(--brand)] border border-[var(--brand)]/20 px-3 py-1">
                Werkgevers
              </span>
            </div>

            {/* Middle: content */}
            <div className="relative z-10 mt-12 md:mt-20 space-y-5 max-w-lg">
              <h3 className="text-display font-bold text-white">
                Jouw team,
                <br />
                direct compleet.
              </h3>
              <p className="text-white/50 leading-relaxed text-lg">
                Flexia Jobs levert niet zomaar handjes, wij leveren gastvrijheid.
                Onze poule bestaat uit geselecteerde, gemotiveerde krachten die
                direct inzetbaar zijn.
              </p>
            </div>

            {/* Bottom: CTA arrow */}
            <div className="relative z-10 mt-10 flex items-center gap-3">
              <span className="text-sm font-bold uppercase tracking-[0.15em] text-white">
                Personeel aanvragen
              </span>
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center transition-all duration-500 group-hover:bg-white group-hover:border-white">
                <ArrowRight className="h-4 w-4 text-white transition-all duration-500 group-hover:text-black group-hover:translate-x-0.5" />
              </div>
            </div>
          </Link>
        </AnimatedSection>
      </section>

      {/* ========== OVER ONS ========== */}
      <section className="py-24 md:py-40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-6 items-center">
            {/* Image — offset with tilt-on-hover */}
            <AnimatedSection animation="slide-left" className="lg:col-span-5">
              <div className="relative">
                {/* Decorative brand accent block */}
                <div
                  aria-hidden
                  className="absolute -bottom-4 -left-4 w-full h-full bg-[var(--brand)]/10 -z-10"
                />
                <AboutImage
                  src="/images/catering-staff-agency-B1T9L3ZT.webp"
                  alt="Het Flexia Jobs team"
                />
              </div>
            </AnimatedSection>

            {/* Text — right column, staggered layout */}
            <div className="lg:col-span-6 lg:col-start-7 space-y-8">
              <AnimatedSection>
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--brand)]">
                  Over Flexia Jobs
                </span>
              </AnimatedSection>

              <AnimatedSection delay={0.05}>
                <h2 className="text-display font-bold text-foreground">
                  Wij verbinden
                  <br />
                  <span className="text-[var(--brand)]">talent</span> met horeca.
                </h2>
              </AnimatedSection>

              <AnimatedSection delay={0.1}>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                  Flexia Jobs is opgericht met één doel: de horeca voorzien van
                  betrouwbaar, gastvrij personeel. Wij geloven dat goed personeel
                  het verschil maakt — voor de zaak én voor de gast.
                </p>
              </AnimatedSection>

              <AnimatedSection delay={0.15}>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                  Of je nu een druk restaurant runt of een groot evenement
                  organiseert, wij zorgen voor de juiste mensen op het juiste
                  moment.
                </p>
              </AnimatedSection>

              {/* Value cards */}
              <AnimatedSection delay={0.2}>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {[
                    { icon: ShieldCheck, label: "Betrouwbaar", desc: "Altijd op tijd, altijd geregeld" },
                    { icon: Zap, label: "Snel schakelen", desc: "Vandaag nodig, vandaag geregeld" },
                    { icon: Smile, label: "Gastvrij", desc: "Service met een glimlach" },
                    { icon: Repeat, label: "Flexibel", desc: "Mee met jouw planning" },
                  ].map(({ icon: Icon, label, desc }) => (
                    <div
                      key={label}
                      className="group/card relative p-5 border border-border bg-white overflow-hidden transition-all duration-500 hover:border-[var(--brand)] hover:shadow-layered cursor-default"
                    >
                      <div className="absolute inset-0 bg-[var(--brand)]/5 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100" />
                      <div className="relative z-10 flex flex-col gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-[var(--brand)]/10 flex items-center justify-center transition-colors duration-500 group-hover/card:bg-[var(--brand)]/20">
                          <Icon className="h-4 w-4 text-[var(--brand)]" />
                        </div>
                        <span className="text-sm font-bold text-foreground">{label}</span>
                        <span className="text-xs text-muted-foreground leading-relaxed">{desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* ========== DIENSTEN ========== */}
      <section className="py-24 md:py-40 surface-darker">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Left: heading */}
            <div className="lg:sticky lg:top-32 lg:self-start space-y-6">
              <AnimatedSection className="space-y-5">
                <span className="inline-block font-mono text-xs uppercase tracking-[0.2em] text-[var(--brand)]">
                  Onze diensten
                </span>
                <h2 className="text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] font-bold text-white">
                  Het horeca uitzendbureau
                </h2>
                <p className="text-lg leading-relaxed text-white/50">
                  Bij Flexia Jobs verbinden we jongeren die willen werken met horeca bedrijven die snel versterking nodig hebben. Snel, betrouwbaar en altijd met een glimlach.
                </p>
              </AnimatedSection>
            </div>

            {/* Right: services */}
            <div>
              <AnimatedSection>
                <ServiceCard dark number="01" title="Flex personeel" description="Direct inzetbare medewerkers voor jouw horecabedrijf. Flexibel, betrouwbaar en altijd gemotiveerd." />
                <ServiceCard dark number="02" title="Matching en facturatie" description="Wij matchen de juiste mensen met de juiste werkplek en regelen de volledige administratie." />
                <ServiceCard dark number="03" title="Evenementen personeel" description="Van festivals tot bedrijfsfeesten — wij leveren professioneel personeel voor elk evenement." />
                <ServiceCard dark number="04" title="Werving & Selectie" description="Op zoek naar vast personeel? Wij selecteren de beste kandidaten voor jouw team." />
              </AnimatedSection>
            </div>
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

          <AnimatedSection>
            <CategoryCards />
          </AnimatedSection>
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
