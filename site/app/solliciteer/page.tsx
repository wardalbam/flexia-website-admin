"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowLeft, Briefcase } from "lucide-react";

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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
      const res = await fetch(`${apiUrl}/api/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          motivation,
          isGeneral: true,
          source: "website",
        }),
      });

      if (res.status === 201) {
        setSuccess(true);
      } else {
        const err = await res.json();
        alert("Fout bij verzenden: " + JSON.stringify(err));
      }
    } catch (err) {
      alert("Fout bij verzenden");
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
          We hebben je algemene sollicitatie ontvangen en nemen zo snel mogelijk contact met je op.
        </p>
        <div className="flex gap-3 justify-center pt-4">
          <Button onClick={() => router.push("/vacatures")}>
            Bekijk vacatures
          </Button>
          <Button variant="outline" onClick={() => router.push("/")}>
            Terug naar home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/")}
        className="gap-2 font-bold"
      >
        <ArrowLeft className="h-4 w-4" />
        Terug
      </Button>

      {/* Header */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <Briefcase className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight">
          Algemene Sollicitatie
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Geen geschikte vacature gevonden? Solliciteer algemeen en we nemen contact met je op zodra er een passende functie vrijkomt.
        </p>
      </div>

      {/* Application Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-black">Jouw gegevens</CardTitle>
          <CardDescription>
            Vul onderstaand formulier in en we nemen zo snel mogelijk contact met je op.
          </CardDescription>
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

            <div className="space-y-2">
              <label className="block text-sm font-semibold">
                Motivatie (optioneel)
              </label>
              <textarea
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
                rows={5}
                className="w-full border-2 border-border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                placeholder="Vertel ons waarom je bij Flexia wilt werken..."
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
                onClick={() => router.push("/")}
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
