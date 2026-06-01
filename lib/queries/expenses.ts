import { db } from "@/lib/db";

export async function getExpenses() {
  return await db.expense.findMany({
    include: {
      category: true,
    },
    orderBy: {
      date: "desc",
    },
  });
}

export async function getExpenseById(id: string) {
  return await db.expense.findUnique({
    where: { id },
    include: { category: true },
  });
}

export async function getExpenseCategories() {
  return await db.expenseCategory.findMany({
    orderBy: { name: "asc" },
  });
}
