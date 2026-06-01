import { isThisMonth, isSameMonth, subMonths, getMonth, getYear, getDay, format, getDaysInMonth, getDate } from "date-fns";
import type { ExpenseWithCategory, ExpenseCategory } from "@/lib/types/expenses";

export function getTimeAnalysis(expenses: ExpenseWithCategory[]) {
  const buckets = { morning: 0, afternoon: 0, evening: 0, night: 0 };
  
  expenses.forEach(exp => {
    const hour = new Date(exp.date).getHours();
    const amount = Number(exp.amount);
    
    if (hour >= 6 && hour < 12) buckets.morning += amount;
    else if (hour >= 12 && hour < 17) buckets.afternoon += amount;
    else if (hour >= 17 && hour < 21) buckets.evening += amount;
    else buckets.night += amount;
  });

  return buckets;
}

export function getDayOfWeekAnalysis(expenses: ExpenseWithCategory[]) {
  // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const days = [0, 0, 0, 0, 0, 0, 0];
  
  expenses.forEach(exp => {
    const day = getDay(new Date(exp.date));
    days[day] += Number(exp.amount);
  });

  return days; // [Sun, Mon, Tue, Wed, Thu, Fri, Sat]
}

export function getVelocity(expenses: ExpenseWithCategory[]) {
  const currentMonthExpenses = expenses.filter(e => isThisMonth(new Date(e.date)));
  const lastMonthDate = subMonths(new Date(), 1);
  const lastMonthExpenses = expenses.filter(e => isSameMonth(new Date(e.date), lastMonthDate));

  const currentTotal = currentMonthExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const lastMonthTotal = lastMonthExpenses.reduce((sum, e) => sum + Number(e.amount), 0);

  const currentDay = Math.max(1, getDate(new Date()));
  const daysInLastMonth = getDaysInMonth(lastMonthDate);

  const currentVelocity = currentTotal / currentDay;
  const lastMonthVelocity = lastMonthTotal / daysInLastMonth;

  return {
    currentVelocity,
    lastMonthVelocity,
    trend: currentVelocity > lastMonthVelocity ? "faster" : "slower",
    percentChange: lastMonthVelocity === 0 ? 0 : ((currentVelocity - lastMonthVelocity) / lastMonthVelocity) * 100
  };
}

export function getWeeklyTrend(expenses: ExpenseWithCategory[]) {
  const currentMonthExpenses = expenses.filter(e => isThisMonth(new Date(e.date)));
  const weeks = [0, 0, 0, 0, 0]; // up to 5 weeks
  
  currentMonthExpenses.forEach(exp => {
    const d = new Date(exp.date);
    const date = getDate(d);
    const weekIndex = Math.floor((date - 1) / 7);
    if (weekIndex < 5) {
      weeks[weekIndex] += Number(exp.amount);
    }
  });

  return weeks;
}

export function getMonthlyTrend(expenses: ExpenseWithCategory[]) {
  const months = new Array(12).fill(0);
  const now = new Date();
  
  expenses.forEach(exp => {
    const d = new Date(exp.date);
    const monthDiff = (getYear(now) - getYear(d)) * 12 + (getMonth(now) - getMonth(d));
    if (monthDiff >= 0 && monthDiff < 12) {
      months[11 - monthDiff] += Number(exp.amount);
    }
  });

  return months; // [11 months ago, ..., this month]
}

export function getCategoryGrowth(expenses: ExpenseWithCategory[], categories: ExpenseCategory[]) {
  const currentMonth = expenses.filter(e => isThisMonth(new Date(e.date)));
  const lastMonthDate = subMonths(new Date(), 1);
  const lastMonth = expenses.filter(e => isSameMonth(new Date(e.date), lastMonthDate));

  return categories.map(cat => {
    const currentSpent = currentMonth.filter(e => e.categoryId === cat.id).reduce((sum, e) => sum + Number(e.amount), 0);
    const lastSpent = lastMonth.filter(e => e.categoryId === cat.id).reduce((sum, e) => sum + Number(e.amount), 0);
    
    return {
      category: cat,
      currentSpent,
      lastSpent,
      growth: lastSpent === 0 ? (currentSpent > 0 ? 100 : 0) : ((currentSpent - lastSpent) / lastSpent) * 100
    };
  }).filter(c => c.currentSpent > 0 || c.lastSpent > 0);
}

export function generateInsights(expenses: ExpenseWithCategory[], categories: ExpenseCategory[]) {
  const insights: { text: string; type: "surge" | "growing" | "reduced" | "neutral"; badge?: string }[] = [];
  
  if (expenses.length === 0) return insights;

  const currentMonth = expenses.filter(e => isThisMonth(new Date(e.date)));
  const lastMonthDate = subMonths(new Date(), 1);
  const lastMonth = expenses.filter(e => isSameMonth(new Date(e.date), lastMonthDate));

  const currentTotal = currentMonth.reduce((sum, e) => sum + Number(e.amount), 0);
  const lastMonthTotal = lastMonth.reduce((sum, e) => sum + Number(e.amount), 0);

  // Overall growth
  if (currentTotal > lastMonthTotal && lastMonthTotal > 0) {
    const diff = currentTotal - lastMonthTotal;
    insights.push({ text: `You spent ₹${diff.toLocaleString("en-IN", { maximumFractionDigits: 0 })} more this month than last month.`, type: "surge", badge: "🔥 Spending Surge" });
  } else if (currentTotal < lastMonthTotal && lastMonthTotal > 0) {
    const diff = lastMonthTotal - currentTotal;
    insights.push({ text: `Great job! You spent ₹${diff.toLocaleString("en-IN", { maximumFractionDigits: 0 })} less this month.`, type: "reduced", badge: "📉 Reduced Spending" });
  }

  // Category growth
  const catGrowth = getCategoryGrowth(expenses, categories);
  const surgingCats = catGrowth.filter(c => c.growth > 30 && c.currentSpent > 500);
  if (surgingCats.length > 0) {
    const top = surgingCats.sort((a, b) => b.growth - a.growth)[0];
    insights.push({ text: `${top.category.name} spending increased by ${top.growth.toFixed(0)}% compared to last month.`, type: "growing", badge: "📈 Growing Category" });
  }

  // Time insight
  const times = getTimeAnalysis(expenses);
  const maxTime = Object.keys(times).reduce((a, b) => times[a as keyof typeof times] > times[b as keyof typeof times] ? a : b) as keyof typeof times;
  if (times[maxTime] > 0) {
    insights.push({ text: `You spend most of your money during the ${maxTime}.`, type: "neutral" });
  }

  return insights;
}

export function getTopSpendingDays(expenses: ExpenseWithCategory[]) {
  const daysMap = new Map<string, number>();
  
  expenses.forEach(exp => {
    const d = new Date(exp.date);
    const dateStr = format(d, "MMM d, yyyy");
    daysMap.set(dateStr, (daysMap.get(dateStr) || 0) + Number(exp.amount));
  });

  return Array.from(daysMap.entries())
    .map(([dateStr, amount]) => ({ dateStr, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);
}
