"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/select";
import { AnimatedSection } from "../../components/animated-section";
import { apiUrl } from "../../lib/api";
import {
  CheckCircle2,
  ArrowLeft,
  Calendar,
  CreditCard,
  PartyPopper,
  HeartHandshake,
  Send,
  Clock,
} from "lucide-react";

const AVAILABILITY_OPTIONS = [
  { value: "maandag", label: "Maandag" },
  { value: "dinsdag", label: "Dinsdag" },
  { value: "woensdag", label: "Woensdag" },
  { value: "donderdag", label: "Donderdag" },
  { value: "vrijdag", label: "Vrijdag" },
  { value: "zaterdag", label: "Zaterdag" },
  { value: "zondag", label: "Zondag" },
];

const CATEGORY_OPTIONS = [
  { value: "bediening", label: "Bediening" },
  { value: "catering-events", label: "Catering & Events" },
  { value: "keukenhulp", label: "Keukenhulp" },
  { value: "spoelkeuken", label: "Spoelkeuken" },
  { value: "anders", label: "Anders / Geen voorkeur" },
];

export default function GeneralApplicationPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [city, setCity] = useState("");
  const [gender, setGender] = useState("");
  const [experience, setExperience] = useState("");
  const [availability, setAvailability] = useState<string[]>([]);
  const [selectedVacatures, setSelectedVacatures] = useState<string[]>([]);
  const [motivation, setMotivation] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const toggleAvailability = (day: string) => {
    setAvailability((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const toggleCategory = (cat: string) => {
    setSelectedVacatures((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
      try {
      const res = await fetch(apiUrl(`/api/applications`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          birthDate: birthDate || undefined,
          city: city || undefined,
          gender: gender || undefined,
          experience: experience || undefined,
          availability,
          selectedVacatures,
          motivation: motivation || undefined,
          isGeneral: true,
          source: "website",
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
                We hebben je sollicitatie ontvangen en nemen zo snel mogelijk
                contact met je op.
              </p>
            </div>
            <div className="flex gap-3 justify-center pt-2">
              <Button
                asChild
                className="bg-foreground text-background hover:bg-foreground/90 rounded-full font-semibold px-6 h-11"
              >
                <Link href="/vacatures">Bekijk vacatures</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full font-semibold px-6 h-11"
              >
                <Link href="/">Home</Link>
              </Button>
            </div>
          </div>
        </AnimatedSection>
      </div>
    );
  }

  const sellingPoints = [
    {
      icon: <Calendar className="h-5 w-5" />,
      title: "Werk wanneer jij wilt",
      description:
        "Jij bepaalt je eigen rooster en wanneer je beschikbaar bent.",
    },
    {
      icon: <CreditCard className="h-5 w-5" />,
      title: "Eerlijk betaald",
      description:
        "Geen gedoe. Transparante tarieven en snelle uitbetaling.",
    },
    {
      icon: <PartyPopper className="h-5 w-5" />,
      title: "De leukste events",
      description:
        "Van festivals tot chique diners — werk op de tofste locaties.",
    },
    {
      icon: <HeartHandshake className="h-5 w-5" />,
      title: "Persoonlijke begeleiding",
      description:
        "Een vast aanspreekpunt dat voor je klaarstaat. Altijd.",
    },
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
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                Algemene Sollicitatie
              </h1>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <p className="text-lg text-white/60 leading-relaxed max-w-xl">
                Geen geschikte vacature gevonden? Schrijf je in en wij vinden de
                juiste match zodra er een passende functie vrijkomt.
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
              <h2 className="text-2xl font-bold tracking-tight">
                Waarom Flexia?
              </h2>
            </AnimatedSection>

            <div className="space-y-2">
              {sellingPoints.map((item, i) => (
                <AnimatedSection key={item.title} delay={0.1 + i * 0.1}>
                  <div className="flex items-start gap-4 p-4 rounded-xl transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-secondary/60">
                    <div className="text-[var(--brand)] shrink-0 mt-0.5">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                        {item.description}
                      </p>
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
                  <h2 className="text-2xl font-bold tracking-tight">
                    Jouw gegevens
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Vul het formulier zo volledig mogelijk in, dan kunnen wij je
                    sneller matchen.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* --- Persoonlijke gegevens --- */}
                  <div className="space-y-1.5 pt-2">
                    <h3 className="text-xs font-medium uppercase tracking-[0.15em] text-[var(--brand)]">
                      Persoonlijke gegevens
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-medium">
                        Voornaam *
                      </Label>
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
                      <Label htmlFor="lastName" className="text-sm font-medium">
                        Achternaam *
                      </Label>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="birthDate"
                        className="text-sm font-medium"
                      >
                        Geboortedatum *
                      </Label>
                      <Input
                        id="birthDate"
                        type="date"
                        required
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender" className="text-sm font-medium">
                        Geslacht
                      </Label>
                      <Select value={gender} onValueChange={setGender}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Selecteer" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="man">Man</SelectItem>
                          <SelectItem value="vrouw">Vrouw</SelectItem>
                          <SelectItem value="anders">Anders</SelectItem>
                          <SelectItem value="geen-voorkeur">
                            Zeg ik liever niet
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* --- Contact --- */}
                  <div className="space-y-1.5 pt-4">
                    <h3 className="text-xs font-medium uppercase tracking-[0.15em] text-[var(--brand)]">
                      Contactgegevens
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      E-mailadres *
                    </Label>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">
                        Telefoonnummer *
                      </Label>
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
                      <Label htmlFor="city" className="text-sm font-medium">
                        Woonplaats *
                      </Label>
                      <Input
                        id="city"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Bijv. Amsterdam"
                        className="h-11"
                      />
                    </div>
                  </div>

                  {/* --- Beschikbaarheid --- */}
                  <div className="space-y-1.5 pt-4">
                    <h3 className="text-xs font-medium uppercase tracking-[0.15em] text-[var(--brand)]">
                      Beschikbaarheid
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Wanneer ben je beschikbaar? *
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {AVAILABILITY_OPTIONS.map((day) => {
                        const isSelected = availability.includes(day.value);
                        return (
                          <button
                            key={day.value}
                            type="button"
                            onClick={() => toggleAvailability(day.value)}
                            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                              isSelected
                                ? "bg-foreground text-background border-foreground"
                                : "bg-background text-foreground border-border hover:border-foreground/30"
                            }`}
                          >
                            {day.label}
                          </button>
                        );
                      })}
                    </div>
                    {availability.length === 0 && (
                      <p className="text-xs text-muted-foreground">
                        Selecteer minimaal 1 dag
                      </p>
                    )}
                  </div>

                  {/* --- Werkvoorkeur --- */}
                  <div className="space-y-1.5 pt-4">
                    <h3 className="text-xs font-medium uppercase tracking-[0.15em] text-[var(--brand)]">
                      Werkvoorkeur
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      In welke categorie wil je werken?
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORY_OPTIONS.map((cat) => {
                        const isSelected = selectedVacatures.includes(
                          cat.value
                        );
                        return (
                          <button
                            key={cat.value}
                            type="button"
                            onClick={() => toggleCategory(cat.value)}
                            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                              isSelected
                                ? "bg-foreground text-background border-foreground"
                                : "bg-background text-foreground border-border hover:border-foreground/30"
                            }`}
                          >
                            {cat.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience" className="text-sm font-medium">
                      Ervaring in de horeca
                    </Label>
                    <Select value={experience} onValueChange={setExperience}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Selecteer je ervaring" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="geen">
                          Geen ervaring
                        </SelectItem>
                        <SelectItem value="minder-dan-1-jaar">
                          Minder dan 1 jaar
                        </SelectItem>
                        <SelectItem value="1-2-jaar">1-2 jaar</SelectItem>
                        <SelectItem value="3-5-jaar">3-5 jaar</SelectItem>
                        <SelectItem value="meer-dan-5-jaar">
                          Meer dan 5 jaar
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* --- Motivatie --- */}
                  <div className="space-y-1.5 pt-4">
                    <h3 className="text-xs font-medium uppercase tracking-[0.15em] text-[var(--brand)]">
                      Over jou
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="motivation"
                      className="text-sm font-medium"
                    >
                      Motivatie (optioneel)
                    </Label>
                    <Textarea
                      id="motivation"
                      value={motivation}
                      onChange={(e) => setMotivation(e.target.value)}
                      rows={4}
                      placeholder="Vertel kort over jezelf, je ervaring en waarom je bij Flexia wilt werken..."
                    />
                  </div>

                  {/* --- Submit --- */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button
                      type="submit"
                      disabled={loading || availability.length === 0}
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
