"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { AnimatedSection } from "../../components/animated-section";
import { CheckCircle2, ArrowLeft, Calendar, CreditCard, PartyPopper, HeartHandshake, Send, Clock } from "lucide-react";

export default function GeneralApplicationPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [motivation, setMotivation] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? (typeof window !== "undefined" ? window.location.origin : "");
      const res = await fetch(`${apiUrl}/api/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName, lastName, email, phone, motivation,
          isGeneral: true, source: "website",
        }),
      });
      if (res.status === 201) setSuccess(true);
      else alert("Fout bij verzenden");
    } catch {
      alert("Fout bij verzenden");
    } finally {
      setLoading(false);
    }
  };

  /* ── Success state ── */
  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <AnimatedSection animation="fade-scale">
          <div className="max-w-md mx-auto text-center space-y-8">
            <div className="mx-auto w-20 h-20 rounded-full border border-border flex items-center justify-center">
              <CheckCircle2 className="h-9 w-9 text-[var(--brand)]" />
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tight">Bedankt!</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                We hebben je algemene sollicitatie ontvangen en nemen zo snel mogelijk contact met je op.
              </p>
            </div>
            <div className="flex gap-3 justify-center pt-2">
              <Button asChild className="bg-foreground text-background hover:bg-foreground/90 rounded-full font-semibold px-6 h-11">
                <Link href="/vacatures">Bekijk vacatures</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full font-semibold px-6 h-11">
                <Link href="/">Home</Link>
              </Button>
            </div>
          </div>
        </AnimatedSection>
      </div>
    );
  }

  const sellingPoints = [
    { icon: <Calendar className="h-5 w-5" />, title: "Werk wanneer jij wilt", description: "Jij bepaalt je eigen rooster en wanneer je beschikbaar bent." },
    { icon: <CreditCard className="h-5 w-5" />, title: "Eerlijk betaald", description: "Geen gedoe. Transparante tarieven en snelle uitbetaling." },
    { icon: <PartyPopper className="h-5 w-5" />, title: "De leukste events", description: "Van festivals tot chique diners — werk op de tofste locaties." },
    { icon: <HeartHandshake className="h-5 w-5" />, title: "Persoonlijke begeleiding", description: "Een vast aanspreekpunt dat voor je klaarstaat. Altijd." },
  ];

  return (
    <>
      {/* ── Dark hero section ── */}
      <section className="surface-dark relative overflow-hidden">
        <div className="mesh-blob mesh-brand animate-mesh w-[600px] h-[600px] opacity-40 -top-48 left-1/4" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 md:pt-28 md:pb-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors group mb-8 block"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-1" />
            <span className="animated-underline">Terug</span>
          </Link>

          <div className="max-w-2xl space-y-4">
            <AnimatedSection>
              <span className="text-sm font-semibold text-[var(--brand)] tracking-wide uppercase">
                Open Sollicitatie
              </span>
            </AnimatedSection>
            <AnimatedSection delay={0.1}>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">Algemene Sollicitatie</h1>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <p className="text-lg text-white/60 leading-relaxed max-w-xl">
                Geen geschikte vacature gevonden? Schrijf je in en wij vinden de juiste match zodra er een passende functie vrijkomt.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ── Main content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-14">

          {/* Left column — Selling points */}
          <div className="lg:col-span-2 space-y-8">
            <AnimatedSection>
              <h2 className="text-2xl font-bold tracking-tight">Waarom Flexia?</h2>
            </AnimatedSection>

            <div className="space-y-2">
              {sellingPoints.map((item, i) => (
                <AnimatedSection key={item.title} delay={0.1 + i * 0.1}>
                  <div className="flex items-start gap-4 p-4 rounded-xl transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-secondary/60">
                    <div className="text-[var(--brand)] shrink-0 mt-0.5">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>

          {/* Right column — Form */}
          <div className="lg:col-span-3">
            <AnimatedSection animation="slide-right">
              <div className="rounded-2xl border border-border bg-card shadow-layered-lg p-6 md:p-8 space-y-6">
                <div className="space-y-1.5">
                  <h2 className="text-2xl font-bold tracking-tight">Jouw gegevens</h2>
                  <p className="text-sm text-muted-foreground">
                    Vul het formulier in en we nemen zo snel mogelijk contact met je op.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-medium">Voornaam *</Label>
                      <Input
                        id="firstName"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Je voornaam"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium">Achternaam *</Label>
                      <Input
                        id="lastName"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Je achternaam"
                        className="h-11"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">E-mailadres *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="je@email.nl"
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">Telefoonnummer *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="06 12345678"
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="motivation" className="text-sm font-medium">Motivatie (optioneel)</Label>
                    <Textarea
                      id="motivation"
                      value={motivation}
                      onChange={(e) => setMotivation(e.target.value)}
                      rows={5}
                      placeholder="Vertel ons waarom je bij Flexia wilt werken..."
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-foreground text-background hover:bg-foreground/90 rounded-full font-semibold h-12 text-base transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                          Verzenden...
                        </span>
                      ) : (
                        <>
                          Sollicitatie verzenden
                          <Send className="ml-2 h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1" />
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-full font-semibold h-12 px-6"
                      onClick={() => router.push("/")}
                    >
                      Annuleren
                    </Button>
                  </div>
                </form>

                <div className="pt-5 border-t border-border flex items-center gap-3 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 shrink-0" />
                  <span>Wij nemen binnen 24 uur contact met je op</span>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </>
  );
}
