import Link from "next/link";
import { Badge } from "../../../components/ui/badge";
import { MapPin, Briefcase, Euro, ArrowLeft } from "lucide-react";
import { getCategoryColor } from "../../../lib/status-colors";

type Params = { params: { id: string } };

export default async function VacatureLanding({ params }: Params) {
  const { id } = params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  try {
    const res = await fetch(`${apiUrl}/api/vacatures/${id}`, { cache: "no-store" });
    if (!res.ok) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="text-center space-y-4">
            <p className="text-lg text-muted-foreground">Vacature niet gevonden</p>
            <Link className="inline-flex items-center gap-2 text-sm font-medium text-foreground" href="/vacatures">
              <ArrowLeft className="h-4 w-4" /> Terug naar vacatures
            </Link>
          </div>
        </div>
      );
    }

    const vacature = await res.json();
    const categoryColor = getCategoryColor(vacature.category?.name);

    return (
      <div>
        <section className="surface-dark relative overflow-hidden">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-5">
            <Link
              href="/vacatures"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors group"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Terug naar vacatures</span>
            </Link>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <div className="grid lg:grid-cols-5 gap-10 lg:gap-14">
            <div className="lg:col-span-3 space-y-10">
              <div className="space-y-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-sm font-semibold text-[var(--brand)] tracking-wide uppercase">
                    {vacature.category?.name || "Algemeen"}
                  </span>
                  {vacature.companyName && (
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <span className="h-3.5 w-3.5" /> {vacature.companyName}
                    </span>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{vacature.title}</h1>
                {vacature.subtitle && (
                  <p className="text-lg text-muted-foreground leading-relaxed">{vacature.subtitle}</p>
                )}
              </div>

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

              <div className="space-y-3 pt-6">
                <h2 className="text-xl font-bold tracking-tight">Over de functie</h2>
                <p className="text-muted-foreground leading-relaxed">{vacature.description}</p>
              </div>

              {vacature.requirements?.length > 0 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-bold tracking-tight">Wat wij zoeken</h2>
                  <ul className="space-y-3 list-disc pl-5 text-muted-foreground">
                    {vacature.requirements.map((req: string, i: number) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              {vacature.benefits?.length > 0 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-bold tracking-tight">Wat wij bieden</h2>
                  <ul className="space-y-3 list-disc pl-5 text-muted-foreground">
                    {vacature.benefits.map((b: string, i: number) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="lg:col-span-2">
              <div className="lg:sticky lg:top-24">
                <div className="rounded-2xl border border-border bg-card shadow-layered-lg p-6 md:p-8 space-y-6">
                  <div className="space-y-1.5">
                    <h2 className="text-2xl font-bold tracking-tight">Solliciteer</h2>
                    <p className="text-sm text-muted-foreground">Interesse? Klik op solliciteer om direct te reageren via ons sollicitatieformulier.</p>
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                      Vacaturenummer: <span className="font-bold">#{vacature.vacatureNumber}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Locatie: <span className="font-bold">{vacature.city}</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Link href={`/vacatures/${vacature.id}/apply`} className="w-full inline-block text-center bg-foreground text-background rounded-full px-6 py-3 font-semibold hover:opacity-95">
                      Solliciteer nu
                    </Link>
                  </div>

                  <div className="pt-5 border-t border-border flex items-center gap-3 text-sm text-muted-foreground">
                    <span>Wij nemen binnen 24 uur contact met je op</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  } catch (err) {
    console.error("Error fetching vacature:", err);
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <p className="text-lg text-muted-foreground">Er is een fout opgetreden bij het laden van de vacature.</p>
          <Link className="inline-flex items-center gap-2 text-sm font-medium text-foreground" href="/vacatures">
            <ArrowLeft className="h-4 w-4" /> Terug naar vacatures
          </Link>
        </div>
      </div>
    );
  }
}
