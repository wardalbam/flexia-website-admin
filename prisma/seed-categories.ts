import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const defaultCategories = [
  {
    name: "IT & Technology",
    slug: "it-technology",
    description: "Vacatures in IT, software development, data science en technologie",
    color: "#3b82f6", // blue
  },
  {
    name: "Healthcare",
    slug: "healthcare",
    description: "Vacatures in de gezondheidszorg en medische sector",
    color: "#10b981", // emerald
  },
  {
    name: "Finance",
    slug: "finance",
    description: "Vacatures in financiën, accounting en banking",
    color: "#8b5cf6", // purple
  },
  {
    name: "Marketing",
    slug: "marketing",
    description: "Vacatures in marketing, communicatie en PR",
    color: "#ec4899", // pink
  },
  {
    name: "Sales",
    slug: "sales",
    description: "Vacatures in sales en business development",
    color: "#f97316", // orange
  },
  {
    name: "Education",
    slug: "education",
    description: "Vacatures in onderwijs en training",
    color: "#6366f1", // indigo
  },
  {
    name: "Logistics",
    slug: "logistics",
    description: "Vacatures in logistiek en supply chain",
    color: "#f59e0b", // amber
  },
  {
    name: "Customer Service",
    slug: "customer-service",
    description: "Vacatures in klantenservice en support",
    color: "#14b8a6", // teal
  },
  {
    name: "Construction",
    slug: "construction",
    description: "Vacatures in bouw en constructie",
    color: "#eab308", // yellow
  },
  {
    name: "Hospitality",
    slug: "hospitality",
    description: "Vacatures in horeca en gastvrijheid",
    color: "#f43f5e", // rose
  },
  {
    name: "Legal",
    slug: "legal",
    description: "Vacatures in juridische diensten",
    color: "#64748b", // slate
  },
  {
    name: "Manufacturing",
    slug: "manufacturing",
    description: "Vacatures in productie en manufacturing",
    color: "#71717a", // zinc
  },
];

async function main() {
  console.log("🌱 Seeding categories...");

  for (const category of defaultCategories) {
    const existing = await prisma.category.findUnique({
      where: { slug: category.slug },
    });

    if (existing) {
      console.log(`✓ Category "${category.name}" already exists, skipping...`);
      continue;
    }

    await prisma.category.create({
      data: category,
    });

    console.log(`✓ Created category: ${category.name}`);
  }

  console.log("✅ Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding categories:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
