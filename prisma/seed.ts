/**
 * Prisma seed script — populates default ExpenseCategory records.
 *
 * Run with:  npx prisma db seed
 *
 * Uses upsert (keyed on `name`) so it is safe to run multiple times
 * without creating duplicates.
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const adapter = new PrismaPg(pool);
const db = new PrismaClient({ adapter });

const DEFAULT_CATEGORIES = [
  { name: "Food",          color: "#F97316" }, // orange
  { name: "Transport",     color: "#3B82F6" }, // blue
  { name: "Rent",          color: "#8B5CF6" }, // violet
  { name: "Education",     color: "#10B981" }, // emerald
  { name: "Shopping",      color: "#EC4899" }, // pink
  { name: "Health",        color: "#EF4444" }, // red
  { name: "Entertainment", color: "#F59E0B" }, // amber
  { name: "Misc",          color: "#6B7280" }, // gray
];

async function main() {
  console.log("🌱 Seeding default expense categories…");

  for (const category of DEFAULT_CATEGORIES) {
    const result = await db.expenseCategory.upsert({
      where: { name: category.name },
      update: { color: category.color },
      create: { name: category.name, color: category.color },
    });
    console.log(`  ✓ ${result.name} (${result.id})`);
  }

  console.log(`✅ Seeded ${DEFAULT_CATEGORIES.length} categories.`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
    await pool.end();
  });
