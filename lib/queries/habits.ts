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

export async function getHabitStreaks() {
  const logs = await db.habitLog.findMany({
    orderBy: { completedAt: 'desc' }
  });

  const streaks: Record<string, number> = {};
  
  const logsByHabit = logs.reduce((acc, log) => {
    if (!acc[log.habitId]) acc[log.habitId] = [];
    acc[log.habitId].push(log.completedAt);
    return acc;
  }, {} as Record<string, Date[]>);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const habitId in logsByHabit) {
    const habitDatesSet = new Set(logsByHabit[habitId].map(d => {
      const localDate = new Date(d);
      localDate.setHours(0, 0, 0, 0);
      return localDate.getTime();
    }));

    let streak = 0;
    let currentDate = new Date(today);
    
    // If done today, start from today. If not done today but done yesterday, start from yesterday.
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (habitDatesSet.has(today.getTime())) {
      streak = 1;
    } else if (habitDatesSet.has(yesterday.getTime())) {
      streak = 1;
      currentDate = new Date(yesterday);
    } else {
      streaks[habitId] = 0;
      continue;
    }

    // Count backwards from current date
    while (true) {
      currentDate.setDate(currentDate.getDate() - 1);
      if (habitDatesSet.has(currentDate.getTime())) {
        streak++;
      } else {
        break;
      }
    }
    
    streaks[habitId] = streak;
  }

  return streaks;
}

export async function getWeeklyHabitGrid() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const dayOfWeek = today.getDay() || 7; // 1-7 (Mon-Sun)
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - dayOfWeek + 1);

  const habits = await db.habit.findMany({
    include: {
      logs: {
        where: { completedAt: { gte: startOfWeek } }
      }
    },
    orderBy: { createdAt: 'asc' }
  });

  return habits.map(habit => {
    const completions = Array(7).fill(false);
    
    habit.logs.forEach(log => {
      const logDay = log.completedAt.getDay() || 7; // 1-7
      completions[logDay - 1] = true;
    });

    return {
      id: habit.id,
      name: habit.name,
      color: habit.color,
      completions
    };
  });
}
