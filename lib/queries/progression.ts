"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// ─── STREAK SYSTEM ──────────────────────────────────────────────────────────

export async function updateStreak() {
  const profile = await db.profile.findFirst();
  if (!profile) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  let newCurrentStreak = profile.currentStreak;
  let newLongestStreak = profile.longestStreak;

  if (!profile.lastActiveDate) {
    // First time ever
    newCurrentStreak = 1;
  } else {
    const lastActive = new Date(profile.lastActiveDate);
    lastActive.setHours(0, 0, 0, 0);

    if (lastActive.getTime() === today.getTime()) {
      // Already active today — no change
      return;
    } else if (lastActive.getTime() === yesterday.getTime()) {
      // Consecutive day — streak continues
      newCurrentStreak = profile.currentStreak + 1;
    } else {
      // Streak broken — reset
      newCurrentStreak = 1;
    }
  }

  newLongestStreak = Math.max(newLongestStreak, newCurrentStreak);

  await db.profile.update({
    where: { id: profile.id },
    data: {
      currentStreak: newCurrentStreak,
      longestStreak: newLongestStreak,
      lastActiveDate: today,
    },
  });
}

// ─── LIFE SCORE SYSTEM ──────────────────────────────────────────────────────

export async function calculateLifeScore(): Promise<number> {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [habits, expenseData, journalCountToday] = await Promise.all([
    // Habits: how many completed today vs total
    db.habit.findMany({
      include: {
        logs: {
          where: { completedAt: { gte: startOfDay } },
        },
      },
    }),
    // Expenses: monthly total
    (async () => {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      const expenses = await db.expense.findMany({
        where: { date: { gte: startOfMonth } },
        select: { amount: true },
      });
      return expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    })(),
    // Journal: count today
    db.journalEntry.count({
      where: { createdAt: { gte: startOfDay } },
    }),
  ]);

  // Habits = 40%
  const totalHabits = habits.length;
  const completedHabits = habits.filter((h) => h.logs.length > 0).length;
  const habitScore = totalHabits > 0 ? (completedHabits / totalHabits) * 40 : 0;

  // Journal = 30% (wrote today or not)
  const journalScore = journalCountToday > 0 ? 30 : 0;

  // Expenses = 30% (prorated monthly budget)
  const monthlyBudget = Number(process.env.NEXT_PUBLIC_MONTHLY_BUDGET || 15000);
  const now = new Date();
  const currentDay = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const proratedBudget = (monthlyBudget / daysInMonth) * currentDay;

  let expenseScore = 30;
  if (expenseData > proratedBudget) {
    const overageRatio = (expenseData - proratedBudget) / proratedBudget;
    expenseScore = Math.max(0, 30 * (1 - overageRatio));
  }

  const rawScore = habitScore + journalScore + expenseScore;
  return Math.round(Math.min(100, Math.max(0, rawScore)));
}

export async function updateLifeScore() {
  const profile = await db.profile.findFirst();
  if (!profile) return;

  const score = await calculateLifeScore();

  await db.profile.update({
    where: { id: profile.id },
    data: { lifeScore: score },
  });

  // Write snapshot to LifeScoreLog
  await db.lifeScoreLog.create({
    data: { score },
  });
}

// ─── ACHIEVEMENT SYSTEM ─────────────────────────────────────────────────────

export async function checkAndUnlockAchievements() {
  const profile = await db.profile.findFirst();
  if (!profile) return;

  // Get all achievements and already-unlocked ones
  const [achievements, userAchievements] = await Promise.all([
    db.achievement.findMany(),
    db.userAchievement.findMany({ select: { achievementId: true } }),
  ]);

  const unlockedIds = new Set(userAchievements.map((ua) => ua.achievementId));

  // Get current counts for criteria checks
  const [expenseCount, journalCount, habitCount] = await Promise.all([
    db.expense.count(),
    db.journalEntry.count(),
    db.habit.count(),
  ]);

  const criteriaChecks: Record<string, boolean> = {
    first_expense: expenseCount >= 1,
    first_journal: journalCount >= 1,
    first_habit: habitCount >= 1,
    streak_7: profile.currentStreak >= 7,
    level_5: profile.level >= 5,
    xp_100: profile.xp >= 100,
    xp_500: profile.xp >= 500,
  };

  // Unlock any newly met achievements
  for (const achievement of achievements) {
    if (unlockedIds.has(achievement.id)) continue; // Already unlocked

    const met = criteriaChecks[achievement.criteria];
    if (met) {
      try {
        await db.userAchievement.create({
          data: { achievementId: achievement.id },
        });
      } catch {
        // Unique constraint violation — already unlocked (race condition safety)
      }
    }
  }
}

// ─── MISSION SYSTEM ─────────────────────────────────────────────────────────

export async function checkAndCompleteMissions() {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  // Get all missions and today's completed ones
  const [missions, todaysLogs] = await Promise.all([
    db.mission.findMany(),
    db.missionLog.findMany({
      where: { completedAt: { gte: startOfDay } },
      select: { missionId: true },
    }),
  ]);

  const completedMissionIds = new Set(todaysLogs.map((l) => l.missionId));

  // Count today's activities
  const [journalCountToday, expenseCountToday, habitLogsToday] = await Promise.all([
    db.journalEntry.count({ where: { createdAt: { gte: startOfDay } } }),
    db.expense.count({ where: { date: { gte: startOfDay } } }),
    db.habitLog.count({ where: { completedAt: { gte: startOfDay } } }),
  ]);

  const typeChecks: Record<string, boolean> = {
    journal: journalCountToday >= 1,
    expense: expenseCountToday >= 1,
    habit: habitLogsToday >= 1,
  };

  for (const mission of missions) {
    if (completedMissionIds.has(mission.id)) continue; // Already completed today

    const met = typeChecks[mission.type];
    if (met) {
      await db.missionLog.create({
        data: { missionId: mission.id },
      });
    }
  }
}

// ─── UNIFIED ENTRY POINT ────────────────────────────────────────────────────

export async function runProgressionUpdate(trigger: "habit" | "expense" | "journal" | "study") {
  // Streaks only update on habit completion
  if (trigger === "habit") {
    await updateStreak();
  }

  // All triggers update life score, achievements, and missions
  await updateLifeScore();
  await checkAndUnlockAchievements();
  await checkAndCompleteMissions();

  revalidatePath("/");
}
