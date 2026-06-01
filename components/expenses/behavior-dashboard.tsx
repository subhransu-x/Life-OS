"use client";

import type { ExpenseWithCategory, ExpenseCategory } from "@/lib/types/expenses";
import { SpendingHeatmap } from "@/components/expenses/behavior/spending-heatmap";
import { StreakTracker } from "@/components/expenses/behavior/streak-tracker";
import { PersonalityCard } from "@/components/expenses/behavior/personality-card";
import { HabitDetector } from "@/components/expenses/behavior/habit-detector";

export function BehaviorDashboard({ expenses, categories }: { expenses: ExpenseWithCategory[]; categories: ExpenseCategory[] }) {
  if (expenses.length === 0) {
    return (
      <div className="text-center p-12 bg-surface border border-border border-dashed rounded-3xl text-muted-foreground animate-in slide-in-from-bottom-4">
        <p className="text-lg font-bold mb-2">No behavior data yet</p>
        <p className="text-sm">Start logging expenses to generate your behavioral finance profile.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <PersonalityCard expenses={expenses} categories={categories} />
      <StreakTracker expenses={expenses} />
      <SpendingHeatmap expenses={expenses} />
      <HabitDetector expenses={expenses} categories={categories} />
    </div>
  );
}
