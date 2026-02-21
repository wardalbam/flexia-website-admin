"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Layers, UserCog, ChevronRight } from "lucide-react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role;
  const isAdmin = userRole === "ADMIN" || userRole === "SUPER_ADMIN";

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Wachtwoorden komen niet overeen");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Wachtwoord moet minimaal 8 tekens zijn");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/settings/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Er is iets misgegaan");
      }

      toast.success("Wachtwoord gewijzigd");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Er is iets misgegaan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-2xl animate-fade-in">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Instellingen</h1>
        <p className="text-sm text-muted-foreground mt-1">Beheer je account en voorkeuren</p>
      </div>

      {/* Admin Quick Links - Mobile Only */}
      {isAdmin && (
        <Card className="md:hidden shadow-layered border-0 animate-fade-in stagger-1">
          <CardHeader>
            <CardTitle className="text-base font-bold">Beheer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/settings/categories">
              <div className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-xl">
                    <Layers className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-semibold text-sm">Categorieën</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </Link>
            <Link href="/settings/users">
              <div className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-xl">
                    <UserCog className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-semibold text-sm">Gebruikers</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </Link>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-layered border-0 animate-fade-in stagger-2">
        <CardHeader>
          <CardTitle className="text-base font-bold">Wachtwoord Wijzigen</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wide">Huidig Wachtwoord</Label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wide">Nieuw Wachtwoord</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wide">Bevestig Nieuw Wachtwoord</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className="rounded-xl"
              />
            </div>
            <Button type="submit" disabled={saving} className="rounded-full font-semibold">
              {saving ? "Opslaan..." : "Wachtwoord Wijzigen"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="shadow-layered border-0 animate-fade-in stagger-3">
        <CardHeader>
          <CardTitle className="text-base font-bold">API Informatie</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Publieke Vacatures API</p>
            <code className="text-xs bg-muted px-3 py-1.5 rounded-lg inline-block font-semibold">
              GET /api/vacatures?active=true
            </code>
          </div>
          <div>
            <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Sollicitatie Indienen</p>
            <code className="text-xs bg-muted px-3 py-1.5 rounded-lg inline-block font-semibold">
              POST /api/applications
            </code>
          </div>
          <div>
            <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Vacature Detail</p>
            <code className="text-xs bg-muted px-3 py-1.5 rounded-lg inline-block font-semibold">
              GET /api/vacatures/[slug]
            </code>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
