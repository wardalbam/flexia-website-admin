import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createUser } from "./actions";

export default async function NewUserPage() {
  const session = await auth();

  // Only ADMIN and SUPER_ADMIN can access this page
  if (!session?.user?.role || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
    redirect("/");
  }

  return (
    <main className="p-4 md:p-6 space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div>
        <Link href="/settings/users">
          <Button variant="ghost" size="sm" className="gap-2 font-bold mb-4">
            <ArrowLeft className="h-4 w-4" />
            Terug naar gebruikers
          </Button>
        </Link>
        <h1 className="text-3xl font-black tracking-tight">Nieuwe Gebruiker</h1>
        <p className="text-muted-foreground mt-1">
          Voeg een nieuwe admin of manager toe
        </p>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Gebruikersgegevens</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createUser} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-bold mb-2">
                Naam
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-4 py-2.5 border-2 border-border rounded-xl text-sm bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Volledige naam"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-2.5 border-2 border-border rounded-xl text-sm bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold mb-2">
                Wachtwoord
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                minLength={6}
                className="w-full px-4 py-2.5 border-2 border-border rounded-xl text-sm bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Minimaal 6 karakters"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-bold mb-2">
                Rol
              </label>
              <select
                id="role"
                name="role"
                required
                className="w-full px-4 py-2.5 border-2 border-border rounded-xl text-sm bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-semibold"
              >
                <option value="MANAGER">Manager</option>
                <option value="ADMIN">Admin</option>
                {session.user.role === "SUPER_ADMIN" && (
                  <option value="SUPER_ADMIN">Super Admin</option>
                )}
              </select>
              <p className="text-xs text-muted-foreground mt-2">
                <strong>Manager:</strong> Kan vacatures en sollicitaties beheren<br />
                <strong>Admin:</strong> Kan ook gebruikers toevoegen en vacatures verwijderen
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1 font-bold rounded-full">
                Gebruiker Aanmaken
              </Button>
              <Link href="/settings/users" className="flex-1">
                <Button type="button" variant="outline" className="w-full font-bold">
                  Annuleren
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
