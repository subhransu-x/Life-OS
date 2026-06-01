"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createExpenseSchema } from "@/lib/validations/expenses";

export async function createExpense(formData: {
  amount: number;
  note?: string;
  date: Date;
  categoryId: string;
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
    },
  });

  revalidatePath("/expenses");
  return expense;
}

export async function deleteExpense(id: string) {
  await db.expense.delete({
    where: { id },
  });

  revalidatePath("/expenses");
}
