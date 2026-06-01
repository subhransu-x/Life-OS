import { db } from "@/lib/db";

export async function getGoals() {
  return await db.goal.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          habits: true,
          expenses: true,
          journals: true,
        },
      },
    },
  });
}

export async function getGoalById(id: string) {
  return await db.goal.findUnique({
    where: { id },
    include: {
      habits: {
        include: { logs: true },
      },
      expenses: {
        include: { category: true },
        orderBy: { date: "desc" },
      },
      journals: {
        orderBy: { createdAt: "desc" },
      },
    },
  });
}
