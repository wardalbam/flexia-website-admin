#!/usr/bin/env ts-node
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

// Load .env if present
dotenv.config();

async function main() {
  const prisma = new PrismaClient();

  // Password source: SEED_ADMIN_PASSWORD env or generate a strong random one
  const seedAdminPassword = process.env.SEED_ADMIN_PASSWORD;
  let generatedPassword: string | undefined;
  const adminPassword = seedAdminPassword ?? (() => {
    try {
      // generate 12 random bytes -> 16 chars base64url
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { randomBytes } = require("crypto");
      generatedPassword = randomBytes(12).toString("base64url");
      return generatedPassword;
    } catch (err) {
      console.error("Failed to generate password, please set SEED_ADMIN_PASSWORD");
      process.exit(1);
    }
  })();

  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set. Set it to your production DB connection string before running.");
    process.exit(1);
  }

  const hashed = await bcrypt.hash(adminPassword!, 12);

  const email = process.env.ADMIN_EMAIL ?? "admin@flexiajobs.nl";

  const user = await prisma.user.upsert({
    where: { email },
    update: { hashedPassword: hashed },
    create: { email, name: "Admin", hashedPassword: hashed, role: "ADMIN" },
  });

  console.log(`Updated admin (${email}) password successfully.`);
  if (generatedPassword) {
    console.log("Generated password (save it securely):", generatedPassword);
  } else {
    console.log("Password set from SEED_ADMIN_PASSWORD environment variable.");
  }

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
