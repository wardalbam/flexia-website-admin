import { VacatureForm } from "@/components/vacatures/vacature-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewVacaturePage() {
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl animate-fade-in">
      <div>
        <Link href="/vacatures" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3">
          <ArrowLeft className="h-4 w-4" /> Terug naar vacatures
        </Link>
        <h1 className="text-2xl font-black tracking-tight">Nieuwe Vacature</h1>
        <p className="text-sm text-muted-foreground mt-1">Maak een nieuwe vacature aan</p>
      </div>
      <VacatureForm />
    </div>
  );
}
