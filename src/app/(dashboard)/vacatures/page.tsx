// Header is now global in RootLayout
import VacatureList from "@/components/vacatures/VacatureList";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { Plus } from "lucide-react";
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
    include: {
      _count: { select: { applications: true } },
      category: true,
    },
  });

  return (
    <>
      <div className="p-4 space-y-6">
        {/* header shows the page title */}
        <div className="pt-2" />
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            {vacatures.length} vacatures totaal
          </p>
          <Link href="/vacatures/new">
            <Button className="rounded-full font-semibold">
              <Plus className="h-4 w-4 mr-2" />
              Nieuwe Vacature
            </Button>
          </Link>
        </div>

        <VacatureList initialVacatures={JSON.parse(JSON.stringify(vacatures))} />
      </div>
    </>
  );
}
