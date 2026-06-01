import { format, subMonths, getDay, isThisMonth } from "date-fns";
import type { ExpenseWithCategory, ExpenseCategory } from "@/lib/types/expenses";

export function getHeatmapData(expenses: ExpenseWithCategory[], months = 6) {
  const data: Record<string, number> = {};
  const startDate = subMonths(new Date(), months);
  
  expenses.forEach(exp => {
    const d = new Date(exp.date);
    if (d >= startDate) {
      const dateStr = format(d, "yyyy-MM-dd");
      data[dateStr] = (data[dateStr] || 0) + Number(exp.amount);
    }
  });

  return data;
}

export function getStreakData(expenses: ExpenseWithCategory[]) {
  const sorted = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const dailySpend: Record<string, number> = {};
  sorted.forEach(exp => {
    const d = format(new Date(exp.date), "yyyy-MM-dd");
    dailySpend[d] = (dailySpend[d] || 0) + Number(exp.amount);
  });

  let currentNoSpend = 0;
  let maxNoSpend = 0;
  let currentSpendStreak = 0;
  let tempNoSpend = 0;
  
  let checkingNoSpend = true;
  let checkingSpendStreak = true;

  const last90Days = Array.from({length: 90}).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return format(d, "yyyy-MM-dd");
  });

  let activeStreakType: "spend" | "nospend" | null = null;

  for (let i = 0; i < last90Days.length; i++) {
    const dayStr = last90Days[i];
    const spent = dailySpend[dayStr] || 0;

    if (i === 0) {
       activeStreakType = spent === 0 ? "nospend" : "spend";
    }

    if (activeStreakType === "nospend" && checkingNoSpend) {
      if (spent === 0) currentNoSpend++;
      else checkingNoSpend = false;
    }

    if (activeStreakType === "spend" && checkingSpendStreak) {
      if (spent > 0) currentSpendStreak++;
      else checkingSpendStreak = false;
    }

    if (spent === 0) {
      tempNoSpend++;
      if (tempNoSpend > maxNoSpend) maxNoSpend = tempNoSpend;
    } else {
      tempNoSpend = 0;
    }
  }

  const currentMonthDays = last90Days.filter(d => d.startsWith(format(new Date(), "yyyy-MM")));
  const monthlyNoSpendDays = currentMonthDays.filter(d => !dailySpend[d]).length;

  return {
    currentNoSpend,
    maxNoSpend,
    currentSpendStreak,
    monthlyNoSpendDays,
    activeStreakType
  };
}

export function getHabitDetection(expenses: ExpenseWithCategory[]) {
  const habits = [];
  
  const lateNight = expenses.filter(e => {
    const h = new Date(e.date).getHours();
    return h >= 22 || h <= 4;
  });
  if (lateNight.length > 5) habits.push({ name: "Late Night Spending", count: lateNight.length, icon: "🌙" });

  const weekend = expenses.filter(e => {
    const d = getDay(new Date(e.date));
    return d === 0 || d === 6;
  });
  if (weekend.length > 10) habits.push({ name: "Weekend Spending", count: weekend.length, icon: "🎉" });

  const micro = expenses.filter(e => Number(e.amount) < 250);
  if (micro.length > 15) habits.push({ name: "Frequent Micro-Purchases", count: micro.length, icon: "☕" });

  return habits.sort((a, b) => b.count - a.count);
}

export function getFrequencyAnalysis(expenses: ExpenseWithCategory[], categories: ExpenseCategory[]) {
  const currentMonth = expenses.filter(e => isThisMonth(new Date(e.date)));
  
  return categories.map(cat => ({
    category: cat,
    count: currentMonth.filter(e => e.categoryId === cat.id).length
  })).filter(f => f.count > 0).sort((a, b) => b.count - a.count);
}

export function calculateBehaviorScore(expenses: ExpenseWithCategory[]) {
  let score = 70;
  const streaks = getStreakData(expenses);
  const habits = getHabitDetection(expenses);

  score += Math.min(20, streaks.monthlyNoSpendDays * 2); 
  if (streaks.maxNoSpend > 5) score += 5;
  if (streaks.maxNoSpend > 10) score += 5;

  score -= Math.min(15, habits.length * 5);
  if (streaks.currentSpendStreak > 5) score -= 5;
  if (streaks.currentSpendStreak > 10) score -= 10;

  return Math.max(0, Math.min(100, score));
}

export function getFinancialPersonality(expenses: ExpenseWithCategory[], categories: ExpenseCategory[]) {
  const score = calculateBehaviorScore(expenses);
  const habits = getHabitDetection(expenses);
  const freq = getFrequencyAnalysis(expenses, categories);
  const streaks = getStreakData(expenses);

  if (streaks.monthlyNoSpendDays > 12 && score > 85) 
    return { type: "Saver", desc: "Highly disciplined and mindful spender. You prioritize long-term goals.", icon: "🛡" };
  
  if (freq.length > 0 && freq[0].category.name.toLowerCase().includes("food") && freq[0].count > 15) 
    return { type: "Food Explorer", desc: "You prioritize culinary experiences and dining out above other expenses.", icon: "🍔" };

  if (habits.find(h => h.name.includes("Weekend")))
    return { type: "Weekend Spender", desc: "Strict during the week, but loose on the weekends.", icon: "🎉" };
    
  if (habits.find(h => h.name.includes("Late Night")))
    return { type: "Night Owl", desc: "Prone to late-night online shopping and impulse buys.", icon: "🌙" };

  if (score < 50) 
    return { type: "Impulse Buyer", desc: "Frequent unplanned purchases. Consider implementing a 24-hour rule.", icon: "⚡" };

  return { type: "Balanced", desc: "A healthy mix of saving and mindful spending without extremes.", icon: "⚖" };
}
