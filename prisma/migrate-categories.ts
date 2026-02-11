import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting category migration...");

  // Since the old category enum is already dropped, we can't migrate based on it
  // Instead, we'll set all existing vacatures to null categoryId
  // The admin will need to manually assign categories

  const vacaturesWithoutCategory = await prisma.vacature.findMany({
    where: {
      categoryId: null,
    },
    select: {
      id: true,
      title: true,
      vacatureNumber: true,
    },
  });

  console.log(`Found ${vacaturesWithoutCategory.length} vacatures without a category`);

  if (vacaturesWithoutCategory.length > 0) {
    console.log("\nVacatures that need category assignment:");
    vacaturesWithoutCategory.forEach((v) => {
      console.log(`  - #${v.vacatureNumber}: ${v.title}`);
    });

    console.log("\nPlease assign categories to these vacatures manually in the admin panel.");
    console.log("Visit: /vacatures/[id]/edit for each vacature to assign a category.");
  } else {
    console.log("All vacatures have categories assigned!");
  }

  console.log("\nMigration complete!");
}

main()
  .catch((e) => {
    console.error("Error during migration:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
