"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export async function updateCategory(id: string, formData: FormData) {
  const session = await auth();

  // Only ADMIN and SUPER_ADMIN can update categories
  if (!session?.user?.role || !["ADMIN", "SUPER_ADMIN"].includes((session.user as any).role)) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const description = (formData.get("description") as string) || null;
  const color = (formData.get("color") as string) || "#3b82f6";
  const icon = (formData.get("icon") as string) || "Briefcase";
  const isActive = formData.get("isActive") === "on";

  // Validate inputs
  if (!name) {
    throw new Error("Name is required");
  }

  const slug = generateSlug(name);

  // Check if another category with the same name/slug exists
  const existingCategory = await prisma.category.findFirst({
    where: {
      OR: [{ name }, { slug }],
      NOT: { id },
    },
  });

  if (existingCategory) {
    throw new Error("Another category with this name already exists");
  }

  // Update category
  await prisma.category.update({
    where: { id },
    data: {
      name,
      slug,
      description,
      color,
      icon,
      isActive,
    },
  });

  revalidatePath("/settings/categories");
  redirect("/settings/categories");
}

export async function deleteCategory(id: string) {
  const session = await auth();

  // Only ADMIN and SUPER_ADMIN can delete categories
  if (!session?.user?.role || !["ADMIN", "SUPER_ADMIN"].includes((session.user as any).role)) {
    throw new Error("Unauthorized");
  }

  // Check if category has vacatures
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: {
        select: { vacatures: true },
      },
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  if (category._count.vacatures > 0) {
    throw new Error("Cannot delete category with active vacatures");
  }

  // Delete category
  await prisma.category.delete({
    where: { id },
  });

  revalidatePath("/settings/categories");
  redirect("/settings/categories");
}
