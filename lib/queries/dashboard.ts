import { db } from "@/lib/db";

export async function getDashboardHabitSummary() {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const habits = await db.habit.findMany({
    include: {
      logs: {
        where: {
          completedAt: {
            gte: startOfDay,
          },
        },
      },
    },
  });

  const total = habits.length;
  const completed = habits.filter((h) => h.logs.length > 0).length;
  const remaining = total - completed;

  return {
    total,
    completed,
    remaining,
  };
}

export async function getDashboardExpenseSummary() {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const expenses = await db.expense.findMany({
    where: {
      date: {
        gte: startOfMonth,
      },
    },
    select: {
      amount: true,
    },
  });

  const total = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  const count = expenses.length;

  return {
    total,
    count,
  };
}

export async function getDashboardJournalSummary() {
  const [total, recent] = await Promise.all([
    db.journalEntry.count(),
    db.journalEntry.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
      },
    }),
  ]);

  return {
    total,
    recent,
  };
}

export async function getLifeScore(): Promise<number> {
  // Read the persisted life score from the Profile table
  const profile = await db.profile.findFirst({
    select: { lifeScore: true },
  });

  if (!profile) return 0;

  return Math.round(profile.lifeScore);
}

export async function getStreakData(): Promise<{ currentStreak: number; longestStreak: number }> {
  const profile = await db.profile.findFirst({
    select: { currentStreak: true, longestStreak: true },
  });

  return {
    currentStreak: profile?.currentStreak ?? 0,
    longestStreak: profile?.longestStreak ?? 0,
  };
}

export async function getWeeklyLifeScoreChange(): Promise<number> {
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Get the most recent log entry
  const latestLog = await db.lifeScoreLog.findFirst({
    orderBy: { date: "desc" },
    select: { score: true },
  });

  // Get the log closest to 7 days ago
  const weekAgoLog = await db.lifeScoreLog.findFirst({
    where: { date: { lte: sevenDaysAgo } },
    orderBy: { date: "desc" },
    select: { score: true },
  });

  if (!latestLog || !weekAgoLog) return 0;

  return Number((latestLog.score - weekAgoLog.score).toFixed(1));
}

export async function getConsistencyScore(): Promise<number> {
  // Consistency = percentage of days in the last 7 days where at least 1 habit was completed
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const habitLogs = await db.habitLog.findMany({
    where: {
      completedAt: { gte: sevenDaysAgo },
    },
    select: { completedAt: true },
  });

  // Count unique days with activity
  const activeDays = new Set(
    habitLogs.map((log) => {
      const d = new Date(log.completedAt);
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    })
  );

  return Math.round((activeDays.size / 7) * 100);
}

export type ActivityItemType = {
  id: string;
  domain: "Build" | "Money" | "Mind";
  title: string;
  timestamp: Date;
  accentColor: string;
};

export async function getRecentActivity(): Promise<ActivityItemType[]> {
  const [habitLogs, expenses, journals] = await Promise.all([
    db.habitLog.findMany({
      take: 5,
      orderBy: { completedAt: "desc" },
      include: { habit: true }
    }),
    db.expense.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { category: true }
    }),
    db.journalEntry.findMany({
      take: 5,
      orderBy: { createdAt: "desc" }
    })
  ]);

  const items: ActivityItemType[] = [
    ...habitLogs.map(log => ({
      id: `habit-${log.id}`,
      domain: "Build" as const,
      title: `Completed "${log.habit.name}"`,
      timestamp: log.completedAt,
      accentColor: "var(--domain-build)"
    })),
    ...expenses.map(exp => ({
      id: `exp-${exp.id}`,
      domain: "Money" as const,
      title: `₹${Number(exp.amount).toFixed(2)} on ${exp.category.name}`,
      timestamp: exp.createdAt,
      accentColor: "var(--domain-money)"
    })),
    ...journals.map(entry => ({
      id: `journal-${entry.id}`,
      domain: "Mind" as const,
      title: "Wrote a journal entry",
      timestamp: entry.createdAt,
      accentColor: "var(--domain-mind)"
    }))
  ];

  return items.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 8);
}
