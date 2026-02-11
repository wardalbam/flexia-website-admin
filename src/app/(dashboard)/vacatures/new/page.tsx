import { Header } from "@/components/layout/header";
import { VacatureForm } from "@/components/vacatures/vacature-form";

export default function NewVacaturePage() {
  return (
    <>
      <Header title="Nieuwe Vacature" />
      <main className="p-6">
        <VacatureForm />
      </main>
    </>
  );
}
