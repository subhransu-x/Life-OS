import { isToday, isYesterday, isThisMonth, format, differenceInDays } from "date-fns";
import type { ExpenseWithCategory } from "@/lib/types/expenses";

export type TimelineGroup = {
  label: string;
  expenses: ExpenseWithCategory[];
  totalAmount: number;
  count: number;
};

export function groupExpensesBySmartTimeline(expenses: ExpenseWithCategory[]): TimelineGroup[] {
  const groups = new Map<string, ExpenseWithCategory[]>();
  const now = new Date();

  // Define sort order mapping for known labels
  const orderMap: Record<string, number> = {
    "Today": 1,
    "Yesterday": 2,
    "Last 7 Days": 3,
    "Earlier This Month": 4,
  };

  expenses.forEach(expense => {
    const date = new Date(expense.date);
    let label = "";

    if (isToday(date)) {
      label = "Today";
    } else if (isYesterday(date)) {
      label = "Yesterday";
    } else if (differenceInDays(now, date) <= 7) {
      label = "Last 7 Days";
    } else if (isThisMonth(date)) {
      label = "Earlier This Month";
    } else {
      label = format(date, "MMMM yyyy");
    }

    if (!groups.has(label)) {
      groups.set(label, []);
    }
    groups.get(label)!.push(expense);
  });

  return Array.from(groups.entries())
    .map(([label, expenses]) => ({
      label,
      // Sort expenses within group by date descending
      expenses: expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
      totalAmount: expenses.reduce((sum, exp) => sum + Number(exp.amount), 0),
      count: expenses.length,
    }))
    .sort((a, b) => {
      // Sort logic for the groups themselves
      const orderA = orderMap[a.label] || 99;
      const orderB = orderMap[b.label] || 99;
      
      if (orderA !== orderB) return orderA - orderB;
      
      // If both are previous months (e.g., May 2026, April 2026)
      // Sort them descending based on the date of their first expense
      return new Date(b.expenses[0].date).getTime() - new Date(a.expenses[0].date).getTime();
    });
}

export function calculateExpenseStats(expenses: ExpenseWithCategory[]) {
  if (expenses.length === 0) {
    return {
      total: 0,
      count: 0,
      average: 0,
      largest: 0,
      topCategory: null,
    };
  }

  const total = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  const count = expenses.length;
  const average = total / count;
  
  let largest = 0;
  const categoryTotals: Record<string, number> = {};
  
  expenses.forEach(exp => {
    const amt = Number(exp.amount);
    if (amt > largest) largest = amt;
    categoryTotals[exp.category.name] = (categoryTotals[exp.category.name] || 0) + amt;
  });

  const topCategory = Object.keys(categoryTotals).reduce((a, b) => 
    categoryTotals[a] > categoryTotals[b] ? a : b
  );

  return { total, count, average, largest, topCategory };
}

export function getSpendingIndicators(expenses: ExpenseWithCategory[]) {
  const indicators: { label: string; type: "danger" | "success" | "neutral" | "warning"; icon: string }[] = [];
  
  if (expenses.length === 0) return indicators;
  
  // Frequent Category
  const categoryCounts: Record<string, number> = {};
  expenses.forEach(exp => {
    categoryCounts[exp.category.name] = (categoryCounts[exp.category.name] || 0) + 1;
  });
  
  if (Object.keys(categoryCounts).length > 0) {
    const frequentCategory = Object.keys(categoryCounts).reduce((a, b) => 
      categoryCounts[a] > categoryCounts[b] ? a : b
    );
    
    if (categoryCounts[frequentCategory] >= 3) {
      indicators.push({ label: `Frequent: ${frequentCategory}`, type: "neutral", icon: "🔥" });
    }
  }

  // Large Expense Warning
  const hasLargeExpense = expenses.some(exp => Number(exp.amount) > 10000);
  if (hasLargeExpense) {
    indicators.push({ label: "High Value Spend", type: "warning", icon: "💎" });
  }

  return indicators;
}
