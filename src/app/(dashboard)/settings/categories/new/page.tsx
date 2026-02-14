import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createCategory } from "./actions";

export default async function NewCategoryPage() {
  const session = await auth();

  // Only ADMIN and SUPER_ADMIN can access this page
  if (!session?.user?.role || !["ADMIN", "SUPER_ADMIN"].includes((session.user as any).role)) {
    redirect("/");
  }

  return (
    <main className="p-4 md:p-6 space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div>
        <Link href="/settings/categories">
          <Button variant="ghost" size="sm" className="gap-2 font-bold mb-4">
            <ArrowLeft className="h-4 w-4" />
            Terug naar categorieën
          </Button>
        </Link>
        <h1 className="text-3xl font-black tracking-tight">Nieuwe Categorie</h1>
        <p className="text-muted-foreground mt-1">
          Voeg een nieuwe vacature categorie toe
        </p>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Categorie Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createCategory} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-bold mb-2">
                Naam *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-4 py-2.5 border-2 border-border rounded-xl text-sm bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="IT & Technology"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-bold mb-2">
                Beschrijving
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                className="w-full px-4 py-2.5 border-2 border-border rounded-xl text-sm bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Korte beschrijving van de categorie"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="color" className="block text-sm font-bold mb-2">
                  Kleur
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    id="color"
                    name="color"
                    defaultValue="#3b82f6"
                    className="h-12 w-24 rounded-xl border-2 border-border cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground">
                    Badge kleur
                  </p>
                </div>
              </div>
              <div>
                <label htmlFor="icon" className="block text-sm font-bold mb-2">
                  Icoon
                </label>
                <Select name="icon" defaultValue="Briefcase">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Briefcase">Briefcase</SelectItem>
                    <SelectItem value="Code">Code</SelectItem>
                    <SelectItem value="Stethoscope">Stethoscope</SelectItem>
                    <SelectItem value="DollarSign">Dollar Sign</SelectItem>
                    <SelectItem value="Megaphone">Megaphone</SelectItem>
                    <SelectItem value="TrendingUp">Trending Up</SelectItem>
                    <SelectItem value="GraduationCap">Graduation Cap</SelectItem>
                    <SelectItem value="Truck">Truck</SelectItem>
                    <SelectItem value="Headset">Headset</SelectItem>
                    <SelectItem value="HardHat">Hard Hat</SelectItem>
                    <SelectItem value="Coffee">Coffee</SelectItem>
                    <SelectItem value="Scale">Scale</SelectItem>
                    <SelectItem value="Factory">Factory</SelectItem>
                    <SelectItem value="Building">Building</SelectItem>
                    <SelectItem value="Users">Users</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1 font-bold rounded-full">
                Categorie Aanmaken
              </Button>
              <Link href="/settings/categories" className="flex-1">
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
