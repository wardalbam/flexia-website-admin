import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CategoryIcon } from "@/components/ui/category-icon";
import { Plus, Briefcase } from "lucide-react";
import Link from "next/link";

export default async function CategoriesManagementPage() {
  const session = await auth();

  // Only ADMIN and SUPER_ADMIN can access this page
  if (!session?.user?.role || !["ADMIN", "SUPER_ADMIN"].includes((session.user as any).role)) {
    redirect("/");
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { vacatures: true },
      },
    },
  });

  return (
    <main className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Categorieën</h1>
          <p className="text-muted-foreground mt-1">
            Beheer vacature categorieën
          </p>
        </div>
        <Link href="/settings/categories/new">
          <Button className="gap-2 font-bold rounded-full">
            <Plus className="h-4 w-4" />
            Nieuwe Categorie
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">
                Totaal Categorieën
              </p>
              <p className="text-2xl font-black">{categories.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories List */}
      <div className="space-y-3">
        {categories.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Geen categorieën gevonden. Maak de eerste categorie aan.
            </CardContent>
          </Card>
        ) : (
          categories.map((category) => (
            <Link key={category.id} href={`/settings/categories/${category.id}`}>
              <Card className="hover-lift transition-all group cursor-pointer">
                <CardContent className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <CategoryIcon
                        icon={category.icon || "Briefcase"}
                        className="h-6 w-6"
                        style={{ color: category.color || "#3b82f6" } as any}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-lg">{category.name}</p>
                      {category.description && (
                        <p className="text-sm text-muted-foreground">
                          {category.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-muted text-foreground border border-border font-bold">
                      {category._count.vacatures} vacature
                      {category._count.vacatures !== 1 ? "s" : ""}
                    </Badge>
                    {!category.isActive && (
                      <Badge className="bg-red-500/10 text-red-700 border-red-500/20 text-xs font-semibold">
                        Inactief
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </main>
  );
}
