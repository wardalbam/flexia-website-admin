import VacaturesShell from "./VacaturesShell";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function VacaturesPage() {
  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Vacatures</h1>
          <p className="text-sm text-muted-foreground mt-1">Beheer al je openstaande vacatures</p>
        </div>
        <Link href="/vacatures/new">
          <Button className="rounded-full font-semibold shadow-lg shadow-primary/20 hover:scale-105 transition-all duration-300">
            <Plus className="h-4 w-4 mr-2" />
            Nieuwe Vacature
          </Button>
        </Link>
      </div>

      <VacaturesShell />
    </div>
  );
}
