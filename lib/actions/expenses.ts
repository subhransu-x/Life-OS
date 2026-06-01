"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const expenseSchema = z.object({
  amount: z.number().positive(),
  note: z.string().optional(),
  date: z.coerce.date(),
  categoryId: z.string().uuid(),
});

export async function createExpense(formData: z.infer<typeof expenseSchema>) {
  const result = expenseSchema.safeParse(formData);

  if (!result.success) {
    throw new Error("Invalid expense data");
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
