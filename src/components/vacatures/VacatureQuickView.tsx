"use client";

import useSWR from "swr";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Share2, Edit, Users, Calendar, MapPin, Euro } from "lucide-react";
import { toast } from "sonner";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function VacatureQuickView({ id, open, onOpenChange }: { id: string | null; open: boolean; onOpenChange: (v: boolean) => void; }) {
  const { data: vacature, error } = useSWR(id ? `/api/vacatures/${id}` : null, fetcher, { revalidateOnFocus: false });

  const handleShare = async () => {
    if (!vacature) return;
    const origin = (process.env.NEXT_PUBLIC_FRONTEND_URL as string) || "https://www.flexiajobs.nl";
    const url = `${origin.replace(/\/$/, "")}/singel/${vacature.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: vacature.title || "Vacature", url });
        toast.success("Link gedeeld");
        return;
      }
      await navigator.clipboard.writeText(url);
      toast.success("Link gekopieerd naar klembord");
    } catch (err) {
      window.open(url, "_blank");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Fullscreen on small screens, centered modal on larger screens */}
      <DialogContent className="w-full max-w-none h-[100dvh] sm:h-auto sm:max-w-3xl rounded-none sm:rounded-lg top-0 sm:top-[50%] left-0 sm:left-[50%] translate-x-0 sm:translate-x-[-50%] translate-y-0 sm:translate-y-[-50%]">
        <DialogHeader>
          <DialogTitle>{vacature ? vacature.title : "Vacature"}</DialogTitle>
        </DialogHeader>

        <div className="p-4">
          {!vacature && !error && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {error && (
            <div className="text-center text-sm text-muted-foreground py-8">Er is een fout opgetreden bij het laden van de vacature.</div>
          )}

          {vacature && (
            <div className="space-y-4">
              <p className="text-muted-foreground">{vacature.subtitle}</p>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="font-semibold">{vacature._count?.applications ?? 0} sollicitaties</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(vacature.publishedAt).toLocaleDateString("nl-NL")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{vacature.location || vacature.city}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Euro className="h-4 w-4" />
                  <span>€{vacature.salary}/uur</span>
                </div>
              </div>

              <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {vacature.description}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <div className="flex items-center gap-2 w-full">
            {vacature && (
              <>
                <Button variant="outline" onClick={handleShare} className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Deel
                </Button>
                <Link href={`/vacatures/${vacature.id}/edit`} className="ml-auto">
                  <Button className="gap-2">
                    <Edit className="h-4 w-4" /> Bewerken
                  </Button>
                </Link>
                <Link href={`/vacatures/${vacature.id}`}>
                  <Button variant="ghost">Volledige pagina</Button>
                </Link>
              </>
            )}
            {!vacature && <Button onClick={() => onOpenChange(false)}>Sluiten</Button>}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
