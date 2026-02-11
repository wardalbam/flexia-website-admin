import { VacatureForm } from "@/components/vacatures/vacature-form";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

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
    <main className="p-4">
      {/* header shows the page title */}
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
      </main>
  );
}
