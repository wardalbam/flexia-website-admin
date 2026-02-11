"use client";

// Header is now global in RootLayout
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Application = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate?: string | null;
  city?: string | null;
  gender?: string | null;
  experience?: string | null;
  selectedVacatures: string[];
  availability: string[];
  status: string;
  notes?: string | null;
  source: string;
  createdAt: string;
  vacature?: { title: string; category: string; slug: string } | null;
};

const statusLabels: Record<string, string> = {
  NEW: "Nieuw",
  REVIEWED: "Bekeken",
  CONTACTED: "Gecontacteerd",
  INTERVIEW_SCHEDULED: "Gesprek Gepland",
  HIRED: "Aangenomen",
  REJECTED: "Afgewezen",
  WITHDRAWN: "Teruggetrokken",
};

const statusColors: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-800",
  REVIEWED: "bg-yellow-100 text-yellow-800",
  CONTACTED: "bg-purple-100 text-purple-800",
  INTERVIEW_SCHEDULED: "bg-orange-100 text-orange-800",
  HIRED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  WITHDRAWN: "bg-gray-100 text-gray-800",
};

export default function ApplicationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/applications/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Niet gevonden");
        return res.json();
      })
      .then((data) => {
        setApplication(data);
        setStatus(data.status);
        setNotes(data.notes || "");
      })
      .catch(() => toast.error("Sollicitatie niet gevonden"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes }),
      });
      if (!res.ok) throw new Error("Fout bij opslaan");
      const updated = await res.json();
      setApplication(updated);
      toast.success("Sollicitatie bijgewerkt");
    } catch {
      toast.error("Er is iets misgegaan");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Weet je zeker dat je deze sollicitatie wilt verwijderen?")) return;
    try {
      const res = await fetch(`/api/applications/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Fout bij verwijderen");
      toast.success("Sollicitatie verwijderd");
      router.push("/applications");
    } catch {
      toast.error("Er is iets misgegaan");
    }
  };

  if (loading) {
    return (
      <>
      <main className="p-4">
        {/* header shows the page title */}
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-32 bg-muted rounded" />
          </div>
        </main>
      </>
    );
  }

  if (!application) {
    return (
      <>
        <main className="p-4">
          {/* header shows the page title */}
          <p className="text-muted-foreground">Sollicitatie niet gevonden.</p>
          <Link href="/applications" className="text-primary hover:underline text-sm mt-2 inline-block">
            Terug naar overzicht
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <main className="p-4 space-y-6">
        {/* header shows the page title. For detail pages we keep the header generic (Sollicitaties).
            If you'd like the applicant name in the header we can compute it client-side or
            wire a context — for now the header remains the single source of truth. */}
        <Link
          href="/applications"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Terug naar overzicht
        </Link>

        <div className="grid grid-cols-3 gap-6">
          {/* Personal Info */}
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Persoonsgegevens
                <Badge className={statusColors[application.status]} variant="secondary">
                  {statusLabels[application.status]}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-muted-foreground">Naam</dt>
                  <dd className="font-medium">{application.firstName} {application.lastName}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Email</dt>
                  <dd className="font-medium">{application.email}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Telefoon</dt>
                  <dd className="font-medium">{application.phone}</dd>
                </div>
                {application.city && (
                  <div>
                    <dt className="text-muted-foreground">Woonplaats</dt>
                    <dd className="font-medium">{application.city}</dd>
                  </div>
                )}
                {application.birthDate && (
                  <div>
                    <dt className="text-muted-foreground">Geboortedatum</dt>
                    <dd className="font-medium">{application.birthDate}</dd>
                  </div>
                )}
                {application.gender && (
                  <div>
                    <dt className="text-muted-foreground">Geslacht</dt>
                    <dd className="font-medium">{application.gender}</dd>
                  </div>
                )}
              </dl>

              {application.experience && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-1">Ervaring</p>
                  <p className="text-sm whitespace-pre-wrap">{application.experience}</p>
                </div>
              )}

              {application.selectedVacatures.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-1">Geselecteerde vacatures</p>
                  <div className="flex flex-wrap gap-1">
                    {application.selectedVacatures.map((v, i) => (
                      <Badge key={i} variant="outline">{v}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {application.availability.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-1">Beschikbaarheid</p>
                  <div className="flex flex-wrap gap-1">
                    {application.availability.map((a, i) => (
                      <Badge key={i} variant="outline">{a}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {application.vacature && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-1">Gekoppelde vacature</p>
                  <p className="text-sm font-medium">{application.vacature.title}</p>
                </div>
              )}

              <div className="mt-4 pt-4 border-t flex gap-4 text-xs text-muted-foreground">
                <span>Bron: {application.source}</span>
                <span>Ontvangen: {new Date(application.createdAt).toLocaleString("nl-NL")}</span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Status & Notities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Notities</Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={5}
                    placeholder="Voeg notities toe..."
                  />
                </div>
                <Button onClick={handleUpdate} disabled={saving} className="w-full">
                  {saving ? "Opslaan..." : "Bijwerken"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" onClick={handleDelete} className="w-full">
                  Verwijderen
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
