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
