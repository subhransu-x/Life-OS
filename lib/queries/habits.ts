import { db } from "@/lib/db";

export async function getHabits() {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  return await db.habit.findMany({
    include: {
      logs: {
        where: {
          completedAt: {
            gte: startOfDay,
          },
        },
        orderBy: {
          completedAt: "desc",
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}
