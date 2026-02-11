"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCategoryColor } from "@/lib/status-colors";
import { cn } from "@/lib/utils";
import { MapPin, Briefcase, Euro, Building2, CheckCircle2, Gift, ArrowLeft } from "lucide-react";

type Vacature = any;

export default function ApplyPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [vacature, setVacature] = useState<Vacature | null>(null);
  const [loadingVacature, setLoadingVacature] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchVacature = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
        const res = await fetch(`${apiUrl}/api/vacatures/${id}`);
        if (res.ok) {
          const data = await res.json();
          setVacature(data);
        }
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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const res = await fetch(`${apiUrl}/api/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          selectedVacatures: [id],
          availability: [],
          source: 'website',
          vacatureId: id,
        }),
      });

      if (res.status === 201) {
        setSuccess(true);
        setTimeout(() => router.push('/vacatures'), 1500);
      } else {
        const err = await res.json();
        alert('Fout bij verzenden: ' + JSON.stringify(err));
      }
    } catch (err) {
      alert('Fout bij verzenden');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12 space-y-4">
        <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-3xl font-black">Bedankt voor je sollicitatie!</h2>
        <p className="text-muted-foreground">
          We hebben je sollicitatie ontvangen en nemen zo snel mogelijk contact met je op.
        </p>
        <Button onClick={() => router.push('/vacatures')} className="mt-6">
          Terug naar vacatures
        </Button>
      </div>
    );
  }

  if (loadingVacature) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <p className="text-muted-foreground">Vacature laden...</p>
      </div>
    );
  }

  if (!vacature) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <p className="text-muted-foreground">Vacature niet gevonden</p>
        <Button onClick={() => router.push('/vacatures')} className="mt-6">
          Terug naar vacatures
        </Button>
      </div>
    );
  }

  const categoryColor = getCategoryColor(vacature.category?.name);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push('/vacatures')}
        className="gap-2 font-bold"
      >
        <ArrowLeft className="h-4 w-4" />
        Terug naar vacatures
      </Button>

      {/* Vacancy Details */}
      <Card>
        <CardContent className="pt-6 space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <Badge
                className={cn(
                  "rounded-full font-bold text-sm px-4 py-1.5",
                  categoryColor.bg,
                  categoryColor.text,
                  "border",
                  categoryColor.border
                )}
              >
                {vacature.category?.name || "Algemeen"}
              </Badge>
              {vacature.companyName && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-semibold">
                  <Building2 className="h-4 w-4" />
                  {vacature.companyName}
                </div>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">
              {vacature.title}
            </h1>

            {vacature.subtitle && (
              <p className="text-lg text-muted-foreground font-medium mb-4">
                {vacature.subtitle}
              </p>
            )}

            {/* Key Info */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">{vacature.city}</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">
                  {vacature.employmentType?.[0]?.replace("_", " ")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Euro className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">€{vacature.salary}/uur</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-xl font-black mb-2">Over de functie</h2>
            <p className="text-muted-foreground leading-relaxed">
              {vacature.description}
            </p>
          </div>

          {/* Requirements */}
          {vacature.requirements?.length > 0 && (
            <div>
              <h2 className="text-xl font-black mb-3">Wat wij zoeken</h2>
              <ul className="space-y-2">
                {vacature.requirements.map((req: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits */}
          {vacature.benefits?.length > 0 && (
            <div>
              <h2 className="text-xl font-black mb-3">Wat wij bieden</h2>
              <ul className="space-y-2">
                {vacature.benefits.map((benefit: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <Gift className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Application Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-black">Solliciteer nu</CardTitle>
          <p className="text-sm text-muted-foreground">
            Vul onderstaand formulier in en wij nemen zo snel mogelijk contact met je op.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold">
                  Voornaam <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full border-2 border-border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="Je voornaam"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold">
                  Achternaam <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full border-2 border-border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="Je achternaam"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-2 border-border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="je.email@voorbeeld.nl"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold">
                Telefoon <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border-2 border-border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="06 12345678"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={loading}
                size="lg"
                className="font-bold flex-1 md:flex-none"
              >
                {loading ? "Verzenden..." : "Sollicitatie verzenden"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => router.push('/vacatures')}
              >
                Annuleren
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
