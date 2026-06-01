"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createGoalSchema, deleteGoalSchema, updateGoalProgressSchema } from "@/lib/validations/goals";
import { Prisma } from "@prisma/client";

export async function createGoal(formData: {
  title: string;
  description?: string;
  domain: string;
  targetDate?: Date | string;
}) {
  const result = createGoalSchema.safeParse(formData);

  if (!result.success) {
    throw new Error(
      result.error.issues.map((e: { message: string }) => e.message).join(", ")
    );
  }

  const data: Prisma.GoalCreateInput = {
    title: result.data.title,
    domain: result.data.domain,
    description: result.data.description || undefined,
    targetDate: result.data.targetDate ? new Date(result.data.targetDate) : undefined,
  };

  const goal = await db.goal.create({
    data,
  });

  revalidatePath("/goals");
  return goal;
}

export async function updateGoalProgress(id: string, progress: number) {
  const result = updateGoalProgressSchema.safeParse({ id, progress });

  if (!result.success) {
    throw new Error("Invalid input");
  }

  await db.goal.update({
    where: { id: result.data.id },
    data: { progress: result.data.progress },
  });

  revalidatePath("/goals");
  revalidatePath(`/goals/${id}`);
}

export async function deleteGoal(id: string) {
  const result = deleteGoalSchema.safeParse({ id });

  if (!result.success) {
    throw new Error("Invalid input");
  }

  await db.goal.delete({
    where: { id: result.data.id },
  });

  revalidatePath("/goals");
}
