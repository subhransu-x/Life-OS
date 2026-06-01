"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createHabitSchema, deleteHabitSchema, toggleHabitSchema, updateHabitSchema } from "@/lib/validations/habits";
import { addXP } from "@/lib/queries/gamification";
import { runProgressionUpdate } from "@/lib/queries/progression";

export async function createHabit(formData: { name: string; color: string; goalId?: string }) {
  const result = createHabitSchema.safeParse(formData);

  if (!result.success) {
    throw new Error(
      result.error.issues.map((e: { message: string }) => e.message).join(", ")
    );
  }

  const habit = await db.habit.create({
    data: {
      name: result.data.name,
      color: result.data.color,
      goalId: result.data.goalId || null,
    },
  });

  revalidatePath("/habits");
  return habit;
}

export async function deleteHabit(id: string) {
  const result = deleteHabitSchema.safeParse({ id });

  if (!result.success) {
    throw new Error("Invalid habit ID");
  }

  await db.habit.delete({
    where: { id: result.data.id },
  });

  revalidatePath("/habits");
}

export async function toggleHabitCompletion(id: string, completed: boolean, logId?: string) {
  const result = toggleHabitSchema.safeParse({ id, completed, logId });

  if (!result.success) {
    throw new Error("Invalid input");
  }

  if (completed) {
    // Add a log
    await db.habitLog.create({
      data: {
        habitId: result.data.id,
      },
    });
    
    // Award XP
    await addXP(10);
    
    // Update progression systems
    await runProgressionUpdate("habit");
  } else if (logId) {
    // Remove the specific log
    await db.habitLog.delete({
      where: { id: logId },
    });
  } else {
    // If we want to uncomplete but don't have logId, delete all logs for today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    await db.habitLog.deleteMany({
      where: {
        habitId: result.data.id,
        completedAt: {
          gte: startOfDay,
        },
      },
    });
  }

  revalidatePath("/habits");
}

export async function updateHabit(id: string, formData: { name: string; color: string; goalId?: string }) {
  const result = updateHabitSchema.safeParse({ id, ...formData });

  if (!result.success) {
    throw new Error(
      result.error.issues.map((e: { message: string }) => e.message).join(", ")
    );
  }

  const habit = await db.habit.update({
    where: { id: result.data.id },
    data: {
      name: result.data.name,
      color: result.data.color,
      goalId: result.data.goalId || null,
    },
  });

  revalidatePath("/habits");
  revalidatePath("/goals/[id]", "page");
  return habit;
}
