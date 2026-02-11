import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Search, Phone, ArrowRight, Briefcase } from "lucide-react";

async function getVacatureCount() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
    const res = await fetch(`${apiUrl}/api/vacatures?active=true`, {
      cache: 'no-store'
    });
    if (res.ok) {
      const data = await res.json();
      return data.length;
    }
  } catch (error) {
    console.error("Failed to fetch vacature count:", error);
  }
  return 0;
}

export default async function SiteLandingPage() {
  const vacatureCount = await getVacatureCount();

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="py-16 md:py-24 text-center space-y-8">
        <div className="space-y-4">
          <div className="inline-block">
            <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold mb-6">
              <Briefcase className="h-4 w-4" />
              <span>{vacatureCount} actieve vacatures</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight">
            Vind je volgende baan
            <br />
            <span className="text-primary">bij Flexia</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium">
            Ontdek uitdagende vacatures in jouw regio en solliciteer direct online
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/vacatures">
            <Button size="lg" className="text-lg font-bold px-8 py-6 gap-2 shadow-lg hover:shadow-xl transition-all">
              Bekijk vacatures
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/solliciteer">
            <Button variant="outline" size="lg" className="text-lg font-bold px-8 py-6 gap-2 shadow-sm hover:shadow-md transition-all">
              Algemeen solliciteren
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
          <CardContent className="pt-6 space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-black mb-2">Snelle sollicitatie</h3>
              <p className="text-muted-foreground">
                Solliciteer in minder dan 2 minuten met ons eenvoudige formulier
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
          <CardContent className="pt-6 space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-black mb-2">Eenvoudig zoeken</h3>
              <p className="text-muted-foreground">
                Vind snel de juiste vacature met filters op locatie en categorie
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
          <CardContent className="pt-6 space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Phone className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-black mb-2">Direct contact</h3>
              <p className="text-muted-foreground">
                Persoonlijk contact met onze recruiters voor de beste match
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="py-12 text-center bg-muted/30 rounded-2xl">
        <div className="space-y-6 px-6">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">
            Klaar om te beginnen?
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Bekijk onze vacatures en vind de perfecte baan die bij jou past
          </p>
          <Link href="/vacatures">
            <Button size="lg" className="text-lg font-bold px-8 py-6 gap-2">
              Bekijk alle vacatures
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
