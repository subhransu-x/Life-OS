import { db } from "@/lib/db";

export async function getExpenses() {
  const expenses = await db.expense.findMany({
    include: {
      category: true,
    },
    orderBy: {
      date: "desc",
    },
  });

  return expenses.map(expense => ({
    ...expense,
    amount: Number(expense.amount),
  }));
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

export async function getExpenseStats() {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const expenses = await db.expense.findMany({
    where: { date: { gte: startOfMonth } },
    include: { category: true }
  });

  const total = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  const count = expenses.length;
  const today = new Date().getDate();
  const avgPerDay = total / today;

  let largestCategory = null;
  if (expenses.length > 0) {
    const categoryTotals = expenses.reduce((acc, exp) => {
      acc[exp.category.name] = (acc[exp.category.name] || 0) + Number(exp.amount);
      return acc;
    }, {} as Record<string, number>);
    
    largestCategory = Object.keys(categoryTotals).reduce((a, b) => categoryTotals[a] > categoryTotals[b] ? a : b);
  }

  return { total, count, avgPerDay, largestCategory };
}

export async function getCategoryBreakdown() {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const expenses = await db.expense.findMany({
    where: { date: { gte: startOfMonth } },
    include: { category: true }
  });

  const total = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  if (total === 0) return [];

  const breakdown = expenses.reduce((acc, exp) => {
    const amount = Number(exp.amount);
    if (!acc[exp.categoryId]) {
      acc[exp.categoryId] = {
        id: exp.categoryId,
        name: exp.category.name,
        color: exp.category.color,
        amount: 0,
        percentage: 0,
        transactionCount: 0
      };
    }
    acc[exp.categoryId].amount += amount;
    acc[exp.categoryId].transactionCount += 1;
    return acc;
  }, {} as Record<string, { id: string, name: string, color: string, amount: number, percentage: number, transactionCount: number }>);

  return Object.values(breakdown)
    .map(c => ({ ...c, percentage: Math.round((c.amount / total) * 100) }))
    .sort((a, b) => b.amount - a.amount);
}
