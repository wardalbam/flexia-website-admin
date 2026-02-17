import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Phone,
  MessageCircle,
  Mail,
  CheckCircle2,
  Minus,
  Quote,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { AnimatedSection } from "../../components/animated-section";

export const metadata = {
  title: "Ik zoek personeel — Flexia",
  description:
    "Vind betrouwbaar horecapersoneel op afroep. Flexia levert geselecteerde, gemotiveerde krachten voor uw zaak of evenement.",
  openGraph: {
    title: "Ik zoek personeel — Flexia",
    description:
      "Vind betrouwbaar horecapersoneel op afroep. Flexia levert geselecteerde, gemotiveerde krachten voor uw zaak of evenement.",
    url: "https://www.flexiajobs.nl/vind-personeel",
    siteName: "Flexia",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ik zoek personeel — Flexia",
    description:
      "Vind betrouwbaar horecapersoneel op afroep. Flexia levert geselecteerde, gemotiveerde krachten voor uw zaak of evenement.",
  },
};

export default function IkZoekPersoneelPage() {
  return (
    <>
      {/* ========== HERO — with image ========== */}
      <section className="relative overflow-hidden surface-dark">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 md:py-28">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="space-y-5">
              <AnimatedSection>
                <span className="inline-block font-mono text-xs uppercase tracking-[0.2em] text-[var(--brand)]">
                  Voor werkgevers
                </span>
              </AnimatedSection>

              <AnimatedSection delay={0.05}>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-[1.05]">
                  Personeel wanneer
                  <br />
                  <span className="text-[var(--brand)]">u</span> het nodig
                  hebt.
                </h1>
              </AnimatedSection>

              <AnimatedSection delay={0.15}>
                <p className="text-lg text-white/50 max-w-md leading-relaxed">
                  Betrouwbare, geselecteerde horecakrachten voor uw zaak of
                  evenement. Vandaag aanvragen, morgen aan het werk.
                </p>
              </AnimatedSection>

              <AnimatedSection delay={0.25}>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    asChild
                    size="lg"
                    variant="brand"
                    className="rounded-full px-7 py-3 text-base font-semibold shadow-md"
                  >
                    <Link href="/contact">
                      Neem contact op
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <a
                    href="tel:0682712876"
                    className="inline-flex items-center justify-center gap-3 rounded-full px-7 py-3 text-base font-semibold border border-white/20 text-white transition-all duration-300 hover:-translate-y-[1px] hover:bg-white/10"
                  >
                    <Phone className="h-4 w-4" />
                    Bel direct
                  </a>
                </div>
              </AnimatedSection>
            </div>

            {/* Hero image placeholder */}
            <AnimatedSection animation="slide-right">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-white/5">
                <Image
                  src="/images/personeel-banner.png"
                  alt="Horecapersoneel via Flexia"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ========== VERTICAL TIMELINE — "Onze aanpak" ========== */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <div className="space-y-3 mb-12">
              <span className="inline-block font-mono text-xs uppercase tracking-[0.2em] text-[var(--brand)]">
                Onze aanpak
              </span>
              <h2 className="text-3xl md:text-4xl font-bold">
                Van aanvraag tot inzet
              </h2>
            </div>
          </AnimatedSection>

          <div className="relative">
            <div
              aria-hidden
              className="absolute left-[15px] md:left-[19px] top-2 bottom-2 w-px bg-border"
            />

            <div className="space-y-10">
              {[
                {
                  title: "U belt, appt of mailt",
                  description:
                    "Geef door hoeveel mensen u nodig heeft, wanneer en voor welk type werk. Wij denken mee over de juiste bezetting.",
                },
                {
                  title: "Wij selecteren uit onze poule",
                  description:
                    "Binnen enkele uren matchen wij de beste krachten uit onze pool van ervaren en gescreende medewerkers.",
                },
                {
                  title: "Uw personeel staat klaar",
                  description:
                    "Op de afgesproken tijd staan uw medewerkers op locatie. Wij regelen contract, verzekering en facturatie.",
                },
                {
                  title: "Nazorg en evaluatie",
                  description:
                    "Na afloop evalueren we samen. Tevreden? Dan weet u ons te vinden voor de volgende keer.",
                },
              ].map((step, i) => (
                <AnimatedSection key={i} delay={i * 0.1}>
                  <div className="relative flex gap-6 md:gap-10">
                    <div className="relative z-10 shrink-0 w-[31px] md:w-[39px] flex justify-center pt-1.5">
                      <div className="w-3 h-3 rounded-full bg-[var(--brand)]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-1">{step.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== IMAGE + TEXT SPLIT ========== */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <AnimatedSection animation="slide-right" className="order-2 lg:order-1">
              <div className="space-y-5">
                <span className="inline-block font-mono text-xs uppercase tracking-[0.2em] text-[var(--brand)]">
                  Kwaliteit
                </span>
                <h2 className="text-3xl md:text-4xl font-bold leading-snug">
                  Wij leveren geen handjes.
                  <br />
                  Wij leveren <span className="text-[var(--brand)]">gastvrijheid</span>.
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Elke medewerker in onze poule is persoonlijk gescreend op
                  ervaring, betrouwbaarheid en motivatie. U krijgt professionals
                  die direct inzetbaar zijn.
                </p>
                <ul className="space-y-2 pt-2">
                  {[
                    "Persoonlijk geselecteerd",
                    "Ervaren in de horeca",
                    "Direct inzetbaar",
                    "Vervanging bij uitval",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <CheckCircle2 className="h-4 w-4 text-[var(--brand)] shrink-0" />
                      <span className="text-sm font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="slide-left" className="order-1 lg:order-2">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-white">
                <Image
                  src="/images/personeel-banner.png"
                  alt="Geselecteerd horecapersoneel"
                  fill
                  className="object-cover"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ========== COMPARISON TABLE ========== */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center space-y-3 mb-12">
              <span className="inline-block font-mono text-xs uppercase tracking-[0.2em] text-[var(--brand)]">
                Vergelijk
              </span>
              <h2 className="text-3xl md:text-4xl font-bold">
                Flexia vs. zelf regelen
              </h2>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="rounded-xl border border-border overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-[1fr_80px_80px] sm:grid-cols-[1fr_120px_120px] bg-secondary">
                <div className="p-3 sm:p-4" />
                <div className="p-3 sm:p-4 text-center bg-foreground">
                  <span className="text-xs font-bold text-background uppercase tracking-wider">
                    Flexia
                  </span>
                </div>
                <div className="p-3 sm:p-4 text-center">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Zelf
                  </span>
                </div>
              </div>

              {/* Rows */}
              {[
                "Personeel binnen 24 uur",
                "Gescreende krachten",
                "Contract en verzekering",
                "Facturatie en administratie",
                "Vervanging bij uitval",
                "Geen langetermijnverplichting",
                "24/7 bereikbaar",
              ].map((item, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[1fr_80px_80px] sm:grid-cols-[1fr_120px_120px] border-t border-border bg-background"
                >
                  <div className="p-3 sm:p-4 text-sm font-medium flex items-center">
                    {item}
                  </div>
                  <div className="p-3 sm:p-4 flex items-center justify-center border-l border-border">
                    <CheckCircle2 className="h-4 w-4 text-[var(--brand)]" />
                  </div>
                  <div className="p-3 sm:p-4 flex items-center justify-center border-l border-border">
                    <Minus className="h-4 w-4 text-muted-foreground/30" />
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ========== SERVICES — compact rows on dark ========== */}
      <section className="surface-dark py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <div className="space-y-3 mb-10">
              <span className="inline-block font-mono text-xs uppercase tracking-[0.2em] text-[var(--brand)]">
                Diensten
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Wat wij voor u regelen
              </h2>
            </div>
          </AnimatedSection>

          {[
            {
              number: "01",
              title: "Flex personeel",
              description:
                "Direct inzetbare medewerkers voor drukke periodes, ziektevervanging of seizoenspieken.",
            },
            {
              number: "02",
              title: "Evenementen",
              description:
                "Professioneel personeel voor bedrijfsfeesten, festivals en partijen.",
            },
            {
              number: "03",
              title: "Volledige ontzorging",
              description:
                "Contracten, verzekeringen, facturatie — wij nemen de administratieve last over.",
            },
            {
              number: "04",
              title: "Werving & selectie",
              description:
                "Op zoek naar vast personeel? Wij selecteren de beste kandidaten voor uw team.",
            },
          ].map((service, i) => (
            <AnimatedSection key={service.number} delay={i * 0.08}>
              <div className="group flex items-baseline gap-6 md:gap-8 py-6 border-b border-white/10 last:border-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:pl-3">
                <span className="text-2xl md:text-3xl font-light text-[var(--brand)] leading-none shrink-0 tabular-nums">
                  {service.number}
                </span>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-1">
                    {service.title}
                  </h3>
                  <p className="text-sm text-white/40 leading-relaxed max-w-lg">
                    {service.description}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* ========== TESTIMONIALS — cards ========== */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <div className="space-y-3 mb-10">
              <span className="inline-block font-mono text-xs uppercase tracking-[0.2em] text-[var(--brand)]">
                Klantervaringen
              </span>
              <h2 className="text-3xl md:text-4xl font-bold">
                Wat onze partners zeggen
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                quote:
                  "In twee dagen hadden we drie uitstekende krachten op de vloer. Flexia denkt mee en levert kwaliteit.",
                name: "Restaurant De Haven",
                location: "Amsterdam",
              },
              {
                quote:
                  "Eindelijk een partij die begrijpt hoe de horeca werkt. Snel schakelen, betrouwbare mensen, nette facturatie.",
                name: "Grand Café Centraal",
                location: "Utrecht",
              },
            ].map((testimonial, i) => (
              <AnimatedSection
                key={testimonial.name}
                delay={i * 0.1}
                animation={i === 0 ? "slide-left" : "slide-right"}
              >
                <div className="border border-border rounded-xl p-6 md:p-8 h-full flex flex-col">
                  <Quote className="h-5 w-5 text-[var(--brand)] mb-4 shrink-0" />
                  <blockquote className="text-lg font-medium leading-relaxed flex-1">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>
                  <div className="mt-6 pt-4 border-t border-border">
                    <p className="font-bold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FAQ ========== */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <div className="space-y-3 mb-12">
              <span className="inline-block font-mono text-xs uppercase tracking-[0.2em] text-[var(--brand)]">
                Veelgestelde vragen
              </span>
              <h2 className="text-3xl md:text-4xl font-bold">
                Voor werkgevers
              </h2>
            </div>
          </AnimatedSection>

          {[
            {
              q: "Hoe snel kan ik personeel krijgen?",
              a: "In de meeste gevallen binnen 24 uur. Bij last-minute aanvragen doen wij ons best om dezelfde dag te leveren.",
            },
            {
              q: "Wat kost het?",
              a: "Wij werken met een all-in uurtarief, afhankelijk van functie en tijdstip. Geen verborgen kosten, één duidelijke factuur.",
            },
            {
              q: "Zit ik ergens aan vast?",
              a: "Nee. U kunt per inzet personeel aanvragen, zonder langetermijnverplichtingen.",
            },
            {
              q: "Wat als iemand niet komt opdagen?",
              a: "Wij regelen altijd vervanging. Bij onvoorziene uitval schakelen wij direct een vervanger in.",
            },
            {
              q: "Welke functies kunnen jullie invullen?",
              a: "Bediening, catering, keukenhulp, spoelkeuken en evenementenpersoneel. Neem contact op voor specifieke wensen.",
            },
          ].map((faq, i) => (
            <AnimatedSection key={i} delay={i * 0.05}>
              <div className="py-5 border-b border-border/40 last:border-0">
                <h3 className="font-bold mb-1">{faq.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {faq.a}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* ========== CTA — brand-colored band ========== */}
      <section className="bg-[var(--brand)] py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center space-y-6">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-black">
              Personeel nodig?
            </h2>
            <p className="text-lg text-black/60 max-w-lg mx-auto mt-3">
              Neem vandaag nog contact op. Wij zorgen voor de juiste mensen op
              de juiste plek.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="tel:0682712876"
                className="inline-flex items-center justify-center gap-3 rounded-full px-8 py-4 bg-black text-white text-sm font-semibold transition-all duration-300 hover:-translate-y-[1px] hover:shadow-layered-lg"
              >
                <Phone className="h-4 w-4" />
                06 82 71 28 76
              </a>
              <a
                href="https://wa.me/31682712876"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 rounded-full px-8 py-4 bg-black/10 text-black text-sm font-semibold transition-all duration-300 hover:-translate-y-[1px] hover:bg-black/20"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
              <a
                href="mailto:info@flexiajobs.nl"
                className="inline-flex items-center justify-center gap-3 rounded-full px-8 py-4 bg-black/10 text-black text-sm font-semibold transition-all duration-300 hover:-translate-y-[1px] hover:bg-black/20"
              >
                <Mail className="h-4 w-4" />
                E-mail
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
