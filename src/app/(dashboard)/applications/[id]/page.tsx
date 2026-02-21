"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRightLeft, MessageSquare, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import useSWR, { mutate as globalMutate } from "swr";
import { statusLabels, getStatusBadgeClasses } from "@/lib/status-colors";
import { cn } from "@/lib/utils";

export default function ApplicationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data: application, isLoading, mutate } = useSWR(`/api/applications/${id}`);
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [statusInit, setStatusInit] = useState(false);

  // Sync local state when data loads
  if (application && !statusInit) {
    setStatus(application.status);
    setNotes(application.notes || "");
    setStatusInit(true);
  }

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
      mutate(updated, false);
      // Invalidate list caches
      globalMutate((key: any) => typeof key === "string" && key.startsWith("/api/applications"), undefined, { revalidate: true });
      globalMutate("/api/dashboard/stats");
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
      globalMutate((key: any) => typeof key === "string" && key.startsWith("/api/applications"), undefined, { revalidate: true });
      globalMutate("/api/dashboard/stats");
      router.push("/applications");
    } catch {
      toast.error("Er is iets misgegaan");
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 space-y-6 animate-fade-in">
        <Skeleton className="h-5 w-40" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2 h-80 rounded-sm" />
          <Skeleton className="h-60 rounded-sm" />
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="p-4 md:p-6 space-y-4 animate-fade-in">
        <p className="text-muted-foreground">Sollicitatie niet gevonden.</p>
        <Link href="/applications" className="text-primary hover:underline text-sm">
          Terug naar overzicht
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in">
      <Link
        href="/applications"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Terug naar overzicht
      </Link>

      {/* Page title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">{application.firstName} {application.lastName}</h1>
          <p className="text-sm text-muted-foreground mt-1">{application.email}</p>
        </div>
        <Badge className={cn("font-bold", getStatusBadgeClasses(application.status))}>
          {statusLabels[application.status] || application.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Info */}
        <Card className="lg:col-span-2 shadow-layered border-0 animate-fade-in stagger-1">
          <CardHeader>
            <CardTitle className="text-base font-bold">Persoonsgegevens</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Naam</dt>
                <dd className="font-semibold">{application.firstName} {application.lastName}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Email</dt>
                <dd className="font-semibold">{application.email}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Telefoon</dt>
                <dd className="font-semibold">{application.phone}</dd>
              </div>
              {application.city && (
                <div>
                  <dt className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Woonplaats</dt>
                  <dd className="font-semibold">{application.city}</dd>
                </div>
              )}
              {application.birthDate && (
                <div>
                  <dt className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Geboortedatum</dt>
                  <dd className="font-semibold">{application.birthDate}</dd>
                </div>
              )}
              {application.gender && (
                <div>
                  <dt className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Geslacht</dt>
                  <dd className="font-semibold">{application.gender}</dd>
                </div>
              )}
            </dl>

            {application.experience && (
              <div className="mt-6 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Ervaring</p>
                <p className="text-sm whitespace-pre-wrap">{application.experience}</p>
              </div>
            )}

            {application.selectedVacatures?.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Geselecteerde vacatures</p>
                <div className="flex flex-wrap gap-1.5">
                  {application.selectedVacatures.map((v: string, i: number) => (
                    <Badge key={i} variant="outline" className="rounded-full">{v}</Badge>
                  ))}
                </div>
              </div>
            )}

            {application.availability?.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Beschikbaarheid</p>
                <div className="flex flex-wrap gap-1.5">
                  {application.availability.map((a: string, i: number) => (
                    <Badge key={i} variant="outline" className="rounded-full">{a}</Badge>
                  ))}
                </div>
              </div>
            )}

            {application.vacature && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Gekoppelde vacature</p>
                <Link href={`/vacatures/${application.vacature.slug || application.vacatureId}`} className="text-sm font-semibold text-primary hover:underline">
                  {application.vacature.title}
                </Link>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-border flex gap-4 text-xs text-muted-foreground">
              <span>Bron: <strong className="text-foreground">{application.source}</strong></span>
              <span>Ontvangen: <strong className="text-foreground">{new Date(application.createdAt).toLocaleString("nl-NL")}</strong></span>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar: Actions + History */}
        <div className="space-y-6">
          <Card className="shadow-layered border-0 animate-fade-in stagger-2">
            <CardHeader>
              <CardTitle className="text-base font-bold">Status & Notities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wide">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wide">Notities</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={5}
                  placeholder="Voeg notities toe..."
                  className="rounded-xl"
                />
              </div>
              <Button onClick={handleUpdate} disabled={saving} className="w-full rounded-full font-semibold">
                {saving ? "Opslaan..." : "Bijwerken"}
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-layered border-0 animate-fade-in stagger-3">
            <CardContent className="pt-6">
              <Button variant="destructive" onClick={handleDelete} className="w-full rounded-full gap-2">
                <Trash2 className="h-4 w-4" />
                Verwijderen
              </Button>
            </CardContent>
          </Card>

          {application.history && application.history.length > 0 && (
            <Card className="shadow-layered border-0 animate-fade-in stagger-4">
              <CardHeader>
                <CardTitle className="text-base font-bold">Geschiedenis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {application.history.map((entry: any) => (
                    <div key={entry.id} className="flex gap-3 text-sm">
                      <div className="mt-0.5 shrink-0">
                        {entry.type === "STATUS_CHANGE" ? (
                          <div className="w-7 h-7 rounded-full bg-blue-500/10 flex items-center justify-center">
                            <ArrowRightLeft className="h-3.5 w-3.5 text-blue-600" />
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-amber-500/10 flex items-center justify-center">
                            <MessageSquare className="h-3.5 w-3.5 text-amber-600" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        {entry.type === "STATUS_CHANGE" ? (
                          <p className="text-sm">
                            <span className="font-semibold">{statusLabels[entry.oldStatus] || entry.oldStatus}</span>
                            {" → "}
                            <span className="font-semibold">{statusLabels[entry.newStatus] || entry.newStatus}</span>
                          </p>
                        ) : (
                          <p className="text-sm whitespace-pre-wrap break-words">{entry.note}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {entry.userName || "Systeem"} &middot; {new Date(entry.createdAt).toLocaleString("nl-NL")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
