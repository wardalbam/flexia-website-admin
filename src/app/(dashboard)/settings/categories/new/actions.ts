"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export async function createCategory(formData: FormData) {
  const session = await auth();

  // Only ADMIN and SUPER_ADMIN can create categories
  if (!session?.user?.role || !["ADMIN", "SUPER_ADMIN"].includes((session.user as any).role)) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const description = (formData.get("description") as string) || null;
  const color = (formData.get("color") as string) || "#3b82f6";
  const icon = (formData.get("icon") as string) || "Briefcase";

  // Validate inputs
  if (!name) {
    throw new Error("Name is required");
  }

  const slug = generateSlug(name);

  // Check if category already exists
  const existingCategory = await prisma.category.findFirst({
    where: {
      OR: [{ name }, { slug }],
    },
  });

  if (existingCategory) {
    throw new Error("Category with this name already exists");
  }

  // Create category
  await prisma.category.create({
    data: {
      name,
      slug,
      description,
      color,
      icon,
      isActive: true,
    },
  });

  redirect("/settings/categories");
}
