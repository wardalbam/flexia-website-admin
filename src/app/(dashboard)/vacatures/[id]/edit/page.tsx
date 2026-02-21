import { VacatureForm } from "@/components/vacatures/vacature-form";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function EditVacaturePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const vacature = await prisma.vacature.findUnique({
    where: { id },
    include: {
      category: true,
    },
  });

  if (!vacature) {
    notFound();
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl animate-fade-in">
      <div>
        {/* Navigate back to the vacatures overview (shell) to preserve the list + detail layout */}
        <Link href={`/vacatures?selected=${id}`} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3">
          <ArrowLeft className="h-4 w-4" /> Terug naar vacature
        </Link>
        <h1 className="text-2xl font-black tracking-tight">Vacature Bewerken</h1>
        <p className="text-sm text-muted-foreground mt-1">{vacature.title}</p>
      </div>
      <VacatureForm
        initialData={{
          id: vacature.id,
          title: vacature.title,
          subtitle: vacature.subtitle,
          slug: vacature.slug,
          vacatureNumber: vacature.vacatureNumber,
          description: vacature.description,
          longDescription: vacature.longDescription,
          seoContent: vacature.seoContent,
          requirements: vacature.requirements,
          benefits: vacature.benefits,
          categoryId: vacature.categoryId,
          imageKey: vacature.imageKey,
          employmentType: vacature.employmentType,
          city: vacature.city,
          location: vacature.location || "",
          salary: vacature.salary,
          isActive: vacature.isActive,
          archived: vacature.archived,
        }}
      />
    </div>
  );
}
