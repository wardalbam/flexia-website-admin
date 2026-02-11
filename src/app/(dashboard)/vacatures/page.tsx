import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { Plus, Pencil, MapPin } from "lucide-react";
import Link from "next/link";

const categoryLabels: Record<string, string> = {
  CATERING: "Catering",
  SPOELKEUKEN: "Spoelkeuken",
  KEUKENHULP: "Keukenhulp",
  BEDIENING: "Bediening",
};

export default async function VacaturesPage() {
  const vacatures = await prisma.vacature.findMany({
    orderBy: { vacatureNumber: "asc" },
    include: { _count: { select: { applications: true } } },
  });

  return (
    <>
      <Header title="Vacatures" />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            {vacatures.length} vacatures totaal
          </p>
          <Link href="/vacatures/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nieuwe Vacature
            </Button>
          </Link>
        </div>

        <div className="grid gap-4">
          {vacatures.map((v) => (
            <Card key={v.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-[60px]">
                      <p className="text-xs text-muted-foreground">#{v.vacatureNumber}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{v.title}</h3>
                        {!v.isActive && (
                          <Badge variant="secondary" className="bg-red-100 text-red-800">
                            Inactief
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <Badge variant="outline">{categoryLabels[v.category]}</Badge>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {v.location}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {v.employmentType.map(t => t.replace("_", " ").toLowerCase()).join(", ")}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {v._count.applications} sollicitaties
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link href={`/vacatures/${v.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Pencil className="h-3.5 w-3.5 mr-1.5" />
                      Bewerken
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
