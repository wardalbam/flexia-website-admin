"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { AnimatedSection } from "../../../../components/animated-section";
import { MapPin, Briefcase, Euro, Building2, CheckCircle2, ArrowLeft, Clock, Send } from "lucide-react";
import { apiUrl } from "../../../../lib/api";

type Vacature = any;

export default function ApplyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [vacature, setVacature] = useState<Vacature | null>(null);
  const [loadingVacature, setLoadingVacature] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchVacature = async () => {
      // Guard: only fetch when we have a valid id
      if (!id) {
        setLoadingVacature(false);
        return;
      }

      try {
        // Resolve API host consistently (may be a different deploy than the frontend)
        const { apiUrl: _apiUrl } = await import("../../../../lib/api");
        const res = await fetch(_apiUrl(`/api/vacatures/${id}`));
        if (res.ok) setVacature(await res.json());
      } catch (error) {
        console.error("Failed to fetch vacancy:", error);
      } finally {
        setLoadingVacature(false);
      }
    };
    fetchVacature();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
      try {
      // Only include vacatureId / selectedVacatures when id is present
      const payload: any = {
        firstName,
        lastName,
        email,
        phone,
        selectedVacatures: id ? [id] : [],
        availability: [],
        source: "website",
      };
      if (id) payload.vacatureId = id;

      const res = await fetch(apiUrl(`/api/applications`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
                We hebben je sollicitatie ontvangen en nemen zo snel mogelijk contact met je op.
              </p>
            </div>
            <div className="flex gap-3 justify-center pt-2">
              <Button asChild className="bg-foreground text-background hover:bg-foreground/90 rounded-full font-semibold px-6 h-11">
                <Link href="/vacatures">Meer vacatures</Link>
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

  /* ── Loading state ── */
  if (loadingVacature) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 mx-auto border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm font-medium">Vacature laden...</p>
        </div>
      </div>
    );
  }

  /* ── Not found state ── */
  if (!vacature) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <p className="text-lg text-muted-foreground">Vacature niet gevonden</p>
          <Button asChild className="bg-foreground text-background hover:bg-foreground/90 rounded-full font-semibold px-6 h-11">
            <Link href="/vacatures">Terug naar vacatures</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ── Dark hero bar ── */}
      <section className="surface-dark relative overflow-hidden">
        <div className="mesh-blob mesh-brand animate-mesh w-[500px] h-[500px] opacity-40 -top-32 left-1/3" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-5">
          <Link
            href="/vacatures"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-1" />
            <span className="animated-underline">Terug naar vacatures</span>
          </Link>
        </div>
      </section>

      {/* ── Main content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-14">

          {/* Left column — Job details (60%) */}
          <div className="lg:col-span-3 space-y-10">
            {/* Header */}
            <AnimatedSection>
              <div className="space-y-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-sm font-semibold text-[var(--brand)] tracking-wide uppercase">
                    {vacature.category?.name || "Algemeen"}
                  </span>
                  {vacature.companyName && (
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Building2 className="h-3.5 w-3.5" /> {vacature.companyName}
                    </span>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{vacature.title}</h1>
                {vacature.subtitle && (
                  <p className="text-lg text-muted-foreground leading-relaxed">{vacature.subtitle}</p>
                )}
              </div>
            </AnimatedSection>

            {/* Key info pills */}
            <AnimatedSection delay={0.1}>
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-border bg-background">
                  <MapPin className="h-4 w-4 text-muted-foreground" /> {vacature.city}
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-border bg-background">
                  <Briefcase className="h-4 w-4 text-muted-foreground" /> {vacature.employmentType?.[0]?.replace("_", " ")}
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-border bg-background">
                  <Euro className="h-4 w-4 text-muted-foreground" /> &euro;{vacature.salary}/uur
                </span>
              </div>
            </AnimatedSection>

            {/* Description */}
            <AnimatedSection delay={0.15}>
              <div className="space-y-3">
                <h2 className="text-xl font-bold tracking-tight">Over de functie</h2>
                <p className="text-muted-foreground leading-relaxed">{vacature.description}</p>
              </div>
            </AnimatedSection>

            <hr className="section-divider" />

            {/* Requirements */}
            {vacature.requirements?.length > 0 && (
              <AnimatedSection delay={0.2}>
                <div className="space-y-5">
                  <h2 className="text-xl font-bold tracking-tight">Wat wij zoeken</h2>
                  <ul className="space-y-3">
                    {vacature.requirements.map((req: string, i: number) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-[var(--brand)] mt-0.5 shrink-0" />
                        <span className="text-muted-foreground">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            )}

            {/* Benefits */}
            {vacature.benefits?.length > 0 && (
              <AnimatedSection delay={0.25}>
                <div className="space-y-5">
                  <h2 className="text-xl font-bold tracking-tight">Wat wij bieden</h2>
                  <ul className="space-y-3">
                    {vacature.benefits.map((b: string, i: number) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-[var(--brand)] mt-0.5 shrink-0" />
                        <span className="text-muted-foreground">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            )}
          </div>

          {/* Right column — Form (40%) */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24">
              <AnimatedSection animation="slide-right">
                <div className="rounded-2xl border border-border bg-card shadow-layered-lg p-6 md:p-8 space-y-6">
                  <div className="space-y-1.5">
                    <h2 className="text-2xl font-bold tracking-tight">Solliciteer nu</h2>
                    <p className="text-sm text-muted-foreground">
                      Vul het formulier in en wij nemen contact met je op.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-sm font-medium">Voornaam *</Label>
                        <Input
                          id="firstName"
                          required
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Voornaam"
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
                          placeholder="Achternaam"
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
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-full font-semibold h-12 text-base transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group"
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
      </div>
    </>
  );
}
