/**
 * Prisma seed script — populates default ExpenseCategory, Achievement, and Mission records.
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

const ACHIEVEMENTS = [
  {
    title: "First Expense",
    description: "Log your first expense",
    icon: "💰",
    criteria: "first_expense",
    points: 50,
  },
  {
    title: "First Journal",
    description: "Write your first journal entry",
    icon: "📝",
    criteria: "first_journal",
    points: 50,
  },
  {
    title: "First Habit",
    description: "Create your first habit",
    icon: "⚡",
    criteria: "first_habit",
    points: 50,
  },
  {
    title: "7 Day Streak",
    description: "Complete habits for 7 consecutive days",
    icon: "🔥",
    criteria: "streak_7",
    points: 200,
  },
  {
    title: "Level 5",
    description: "Reach Level 5",
    icon: "⭐",
    criteria: "level_5",
    points: 300,
  },
  {
    title: "100 XP",
    description: "Earn 100 total XP",
    icon: "🎯",
    criteria: "xp_100",
    points: 100,
  },
  {
    title: "500 XP",
    description: "Earn 500 total XP",
    icon: "🏆",
    criteria: "xp_500",
    points: 250,
  },
];

const MISSIONS = [
  {
    title: "Write 1 Journal",
    description: "Record your thoughts today",
    type: "journal",
    xpReward: 25,
  },
  {
    title: "Log 1 Expense",
    description: "Track a financial transaction",
    type: "expense",
    xpReward: 15,
  },
  {
    title: "Complete 1 Habit",
    description: "Execute at least one daily protocol",
    type: "habit",
    xpReward: 20,
  },
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

  // Seed Achievements
  console.log("\n🏆 Seeding achievements…");

  for (const achievement of ACHIEVEMENTS) {
    // Check if achievement with this criteria already exists
    const existing = await db.achievement.findFirst({
      where: { criteria: achievement.criteria },
    });

    if (existing) {
      await db.achievement.update({
        where: { id: existing.id },
        data: {
          title: achievement.title,
          description: achievement.description,
          icon: achievement.icon,
          points: achievement.points,
        },
      });
      console.log(`  ↻ ${achievement.title} (updated)`);
    } else {
      const created = await db.achievement.create({
        data: achievement,
      });
      console.log(`  ✓ ${achievement.title} (${created.id})`);
    }
  }

  console.log(`✅ Seeded ${ACHIEVEMENTS.length} achievements.`);

  // Seed Missions
  console.log("\n🎯 Seeding missions…");

  for (const mission of MISSIONS) {
    const existing = await db.mission.findFirst({
      where: { type: mission.type },
    });

    if (existing) {
      await db.mission.update({
        where: { id: existing.id },
        data: {
          title: mission.title,
          description: mission.description,
          xpReward: mission.xpReward,
        },
      });
      console.log(`  ↻ ${mission.title} (updated)`);
    } else {
      const created = await db.mission.create({
        data: mission,
      });
      console.log(`  ✓ ${mission.title} (${created.id})`);
    }
  }

  console.log(`✅ Seeded ${MISSIONS.length} missions.`);
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
