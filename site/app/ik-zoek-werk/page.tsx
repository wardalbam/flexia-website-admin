import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  Clock,
  Euro,
  Shield,
  Zap,
  MessageCircle,
  CheckCircle2,
  Quote,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { AnimatedSection } from "../../components/animated-section";

export const metadata = {
  title: "Ik zoek werk — Flexia",
  description:
    "Vind flexibel werk in de horeca en evenementen. Werk wanneer jij wilt, eerlijk betaald en snel geregeld via Flexia Jobs.",
  openGraph: {
    title: "Ik zoek werk — Flexia",
    description:
      "Vind flexibel werk in de horeca en evenementen. Werk wanneer jij wilt, eerlijk betaald en snel geregeld via Flexia Jobs.",
    url: "https://www.flexiajobs.nl/ik-zoek-werk",
    siteName: "Flexia",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ik zoek werk — Flexia",
    description:
      "Vind flexibel werk in de horeca en evenementen. Werk wanneer jij wilt, eerlijk betaald en snel geregeld via Flexia Jobs.",
  },
};

export default function IkZoekWerkPage() {
  return (
    <>
      {/* ========== HERO — split with image ========== */}
      <section className="relative overflow-hidden surface-dark">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 md:py-28">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="relative z-10 space-y-5">
              <AnimatedSection>
                <span className="inline-block font-mono text-xs uppercase tracking-[0.2em] text-[var(--brand)]">
                  Voor werkzoekenden
                </span>
              </AnimatedSection>

              <AnimatedSection delay={0.05}>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-[1.05]">
                  Aan het werk.
                  <br />
                  Op <span className="text-[var(--brand)]">jouw</span> manier.
                </h1>
              </AnimatedSection>

              <AnimatedSection delay={0.15}>
                <p className="text-lg text-white/50 max-w-md leading-relaxed">
                  Flexibele shifts in de horeca en op evenementen. Jij kiest
                  waar en wanneer — wij regelen de rest.
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
                    <Link href="/vacatures">
                      Bekijk vacatures
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="rounded-full px-7 py-3 text-base font-semibold border-white/20 text-white hover:bg-white/10 bg-transparent"
                  >
                    <Link href="/solliciteer">
                      Direct solliciteren
                      <ArrowUpRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </AnimatedSection>
            </div>

            {/* Hero image placeholder */}
            <AnimatedSection animation="slide-right">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-white/5">
                <Image
                  src="/images/personeel-banner.png"
                  alt="Flexibel werken in de horeca"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ========== HORIZONTAL STEPPER ========== */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center space-y-3 mb-12">
              <span className="inline-block font-mono text-xs uppercase tracking-[0.2em] text-[var(--brand)]">
                Zo werkt het
              </span>
              <h2 className="text-3xl md:text-4xl font-bold">
                In 3 stappen aan de slag
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-0">
            {[
              {
                step: "01",
                title: "Meld je aan",
                description:
                  "Maak een profiel aan en vertel ons wat je zoekt. Ervaring is mooi, maar niet vereist.",
              },
              {
                step: "02",
                title: "Kies je shifts",
                description:
                  "Bekijk beschikbare vacatures en kies wanneer en waar je wilt werken.",
              },
              {
                step: "03",
                title: "Ga aan de slag",
                description:
                  "Wij matchen je met de beste werkplekken. Eerlijk betaald, direct beginnen.",
              },
            ].map((item, i) => (
              <AnimatedSection key={item.step} delay={i * 0.15}>
                <div className="relative text-center px-6 py-6">
                  {i < 2 && (
                    <div
                      aria-hidden
                      className="hidden md:block absolute top-[2.75rem] left-[60%] right-[-40%] h-px bg-border"
                    />
                  )}
                  <div className="relative mx-auto w-12 h-12 rounded-full border-2 border-[var(--brand)] flex items-center justify-center mb-4 bg-background">
                    <span className="text-sm font-bold text-[var(--brand)]">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-[220px] mx-auto">
                    {item.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FEATURE IMAGE + TEXT — split ========== */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <AnimatedSection animation="slide-left">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-white">
                <Image
                  src="/images/personeel-banner.png"
                  alt="Werken bij Flexia"
                  fill
                  className="object-cover"
                />
              </div>
            </AnimatedSection>

            <AnimatedSection animation="slide-right">
              <div className="space-y-6">
                <span className="inline-block font-mono text-xs uppercase tracking-[0.2em] text-[var(--brand)]">
                  Wat je verdient
                </span>
                <h2 className="text-3xl md:text-4xl font-bold">
                  Eerlijk tarief,
                  <br />
                  geen verrassingen.
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Je weet vooraf precies wat je verdient. Het tarief hangt af van
                  de functie en het tijdstip. Uitbetaling is altijd op tijd en
                  volledig transparant.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  {[
                    "Transparante tarieven",
                    "Op tijd uitbetaald",
                    "Contract en verzekering",
                  ].map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-background text-sm font-medium"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-[var(--brand)]" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ========== BENEFITS — compact rows ========== */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <div className="space-y-3 mb-10">
              <span className="inline-block font-mono text-xs uppercase tracking-[0.2em] text-[var(--brand)]">
                Voordelen
              </span>
              <h2 className="text-3xl md:text-4xl font-bold">Waarom Flexia?</h2>
            </div>
          </AnimatedSection>

          {[
            {
              icon: Clock,
              title: "Flexibele uren",
              description:
                "Werk rond je studie, hobby of andere baan. Jij bepaalt je beschikbaarheid.",
            },
            {
              icon: Euro,
              title: "Eerlijk betaald",
              description:
                "Transparante tarieven, op tijd uitbetaald. Geen verrassingen.",
            },
            {
              icon: Zap,
              title: "Snel aan de slag",
              description:
                "Na je aanmelding kun je vaak binnen twee dagen je eerste shift draaien.",
            },
            {
              icon: Shield,
              title: "Goed geregeld",
              description:
                "Je werkt met een contract, bent verzekerd en wij regelen de administratie.",
            },
          ].map((feature) => (
            <AnimatedSection key={feature.title}>
              <div className="flex items-start gap-5 py-5 border-b border-border/40 last:border-0">
                <div className="shrink-0 w-10 h-10 rounded-xl bg-foreground flex items-center justify-center">
                  <feature.icon className="h-5 w-5 text-background" />
                </div>
                <div>
                  <h3 className="font-bold mb-0.5">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* ========== TESTIMONIALS — dark, cards ========== */}
      <section className="surface-dark py-16 md:py-24 relative overflow-hidden">
        <div className="mesh-blob mesh-brand w-[500px] h-[500px] -bottom-40 -right-40 opacity-20" />
        <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
          <AnimatedSection>
            <div className="mb-10">
              <span className="inline-block font-mono text-xs uppercase tracking-[0.2em] text-[var(--brand)]">
                Ervaringen
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-3">
                Wat onze flexwerkers zeggen
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                quote:
                  "Binnen een week had ik mijn eerste shift. Alles was goed geregeld en ik werd op tijd betaald.",
                name: "Jeroen",
                role: "Bediening, Amsterdam",
              },
              {
                quote:
                  "Ideaal naast mijn studie. Ik kies zelf wanneer ik werk en de locaties zijn altijd top.",
                name: "Samira",
                role: "Catering, Utrecht",
              },
              {
                quote:
                  "Het team van Flexia is altijd bereikbaar. Als er iets is, wordt het meteen opgelost.",
                name: "Thomas",
                role: "Spoelkeuken, Den Haag",
              },
            ].map((testimonial, i) => (
              <AnimatedSection key={testimonial.name} delay={i * 0.1}>
                <div className="bg-white/[0.05] border border-white/10 rounded-xl p-6 h-full flex flex-col">
                  <Quote className="h-5 w-5 text-[var(--brand)] mb-3 shrink-0" />
                  <p className="text-white/70 text-sm leading-relaxed flex-1">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="mt-4 pt-3 border-t border-white/10">
                    <p className="font-semibold text-white text-sm">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-white/40">{testimonial.role}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FAQ ========== */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center space-y-3 mb-12">
              <span className="inline-block font-mono text-xs uppercase tracking-[0.2em] text-[var(--brand)]">
                Veelgestelde vragen
              </span>
              <h2 className="text-3xl md:text-4xl font-bold">
                Goed om te weten
              </h2>
            </div>
          </AnimatedSection>

          <div className="space-y-0">
            {[
              {
                q: "Heb ik ervaring nodig?",
                a: "Nee, ervaring is niet vereist. Wij zoeken gemotiveerde mensen met een servicegerichte instelling.",
              },
              {
                q: "Hoe snel kan ik beginnen?",
                a: "Na je aanmelding nemen wij binnen 24 uur contact op. Vaak kun je al binnen 48 uur je eerste shift draaien.",
              },
              {
                q: "Hoe word ik betaald?",
                a: "Je werkt op basis van een contract via Flexia. Uitbetaling is wekelijks of maandelijks, afhankelijk van je voorkeur.",
              },
              {
                q: "Kan ik zelf mijn uren kiezen?",
                a: "Ja, jij geeft je beschikbaarheid door en wij plannen je alleen in op momenten die voor jou werken.",
              },
              {
                q: "Wat als ik een keer niet kan?",
                a: "Geen probleem. Geef het op tijd door en wij regelen vervanging.",
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
        </div>
      </section>

      {/* ========== REQUIREMENTS — inline pills ========== */}
      <section className="bg-secondary py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
              <h2 className="text-xl md:text-2xl font-bold shrink-0">
                Wat heb je nodig?
              </h2>
              <div className="flex flex-wrap gap-2">
                {[
                  "16 jaar of ouder",
                  "Min. 1 shift per week",
                  "Woonachtig in NL",
                  "Gemotiveerd",
                  "Bereikbaar via telefoon",
                ].map((req) => (
                  <span
                    key={req}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-background text-sm font-medium"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-[var(--brand)]" />
                    {req}
                  </span>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ========== CTA — dark band ========== */}
      <section className="surface-dark py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center space-y-6">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Klaar om te starten?
            </h2>
            <p className="text-lg text-white/50 max-w-lg mx-auto mt-3">
              Meld je vandaag aan en we nemen binnen 24 uur contact op.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                asChild
                size="lg"
                variant="brand"
                className="rounded-full px-8 py-4 text-base font-semibold shadow-md"
              >
                <Link href="/solliciteer">
                  Solliciteer nu
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <a
                href="https://wa.me/31682712876"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 rounded-full px-8 py-4 border border-white/20 text-white text-sm font-medium transition-all duration-300 hover:-translate-y-[1px] hover:bg-white/10"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp ons
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
