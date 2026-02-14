"use client";

// Header is now global in RootLayout
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
    <>
      <main className="p-4 space-y-6 max-w-2xl">
        {/* header shows the page title */}

        {/* Admin Quick Links - Mobile Only */}
        {isAdmin && (
          <Card className="md:hidden">
            <CardHeader>
              <CardTitle>Beheer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/settings/categories">
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Layers className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-bold">Categorieën</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </Link>
              <Link href="/settings/users">
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <UserCog className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-bold">Gebruikers</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </Link>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Wachtwoord Wijzigen</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label>Huidig Wachtwoord</Label>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Nieuw Wachtwoord</Label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>
              <div className="space-y-2">
                <Label>Bevestig Nieuw Wachtwoord</Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>
              <Button type="submit" disabled={saving} className="rounded-full">
                {saving ? "Opslaan..." : "Wachtwoord Wijzigen"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Informatie</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="text-muted-foreground">Publieke Vacatures API</p>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                GET /api/vacatures?active=true
              </code>
            </div>
            <div>
              <p className="text-muted-foreground">Sollicitatie Indienen</p>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                POST /api/applications
              </code>
            </div>
            <div>
              <p className="text-muted-foreground">Vacature Detail</p>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                GET /api/vacatures/[slug]
              </code>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
