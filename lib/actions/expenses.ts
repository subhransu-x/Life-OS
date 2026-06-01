"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createExpenseSchema, updateExpenseSchema } from "@/lib/validations/expenses";
import { addXP } from "@/lib/queries/gamification";
import { runProgressionUpdate } from "@/lib/queries/progression";

export async function createExpense(formData: {
  amount: number;
  note?: string;
  date: string | Date;
  categoryId: string;
  goalId?: string;
}) {
  const result = createExpenseSchema.safeParse(formData);

  if (!result.success) {
    throw new Error(
      result.error.issues.map((e: { message: string }) => e.message).join(", ")
    );
  }

  const expense = await db.expense.create({
    data: {
      amount: result.data.amount,
      note: result.data.note,
      date: result.data.date,
      categoryId: result.data.categoryId,
      goalId: result.data.goalId || null,
    },
  });

  await addXP(5);
  await runProgressionUpdate("expense");

  revalidatePath("/expenses");
  return {
    ...expense,
    amount: Number(expense.amount),
  };
}

export async function deleteExpense(id: string) {
  await db.expense.delete({
    where: { id },
  });

  revalidatePath("/expenses");
}

export async function updateExpense(id: string, formData: {
  amount: number;
  note?: string;
  date: string | Date;
  categoryId: string;
  goalId?: string;
}) {
  const result = updateExpenseSchema.safeParse({ id, ...formData });

  if (!result.success) {
    throw new Error(
      result.error.issues.map((e: { message: string }) => e.message).join(", ")
    );
  }

  const expense = await db.expense.update({
    where: { id: result.data.id },
    data: {
      amount: result.data.amount,
      note: result.data.note,
      date: result.data.date,
      categoryId: result.data.categoryId,
      goalId: result.data.goalId || null,
    },
  });

  revalidatePath("/expenses");
  revalidatePath("/goals/[id]", "page"); // Revalidate goal details in case it was linked
  return {
    ...expense,
    amount: Number(expense.amount),
  };
}
