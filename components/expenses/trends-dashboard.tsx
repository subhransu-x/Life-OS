"use client";

import type { ExpenseWithCategory, ExpenseCategory } from "@/lib/types/expenses";
import { InsightsPanel } from "@/components/expenses/trends/insights-panel";
import { WeeklyTrendChart } from "@/components/expenses/trends/weekly-trend-chart";
import { CategoryGrowthRadar } from "@/components/expenses/trends/category-growth-radar";
import { VelocityAndTime } from "@/components/expenses/trends/velocity-and-time";

export function TrendsDashboard({ expenses, categories }: { expenses: ExpenseWithCategory[]; categories: ExpenseCategory[] }) {
  if (expenses.length === 0) {
    return (
      <div className="text-center p-12 bg-surface border border-border border-dashed rounded-3xl text-muted-foreground animate-in slide-in-from-bottom-4">
        <p className="text-lg font-bold mb-2">No data yet</p>
        <p className="text-sm">Start logging expenses to see your financial intelligence dashboard.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <InsightsPanel expenses={expenses} categories={categories} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyTrendChart expenses={expenses} />
        <CategoryGrowthRadar expenses={expenses} categories={categories} />
      </div>

      <VelocityAndTime expenses={expenses} />
    </div>
  );
}
