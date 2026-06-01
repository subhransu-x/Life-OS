"use client";

import { useBudgetStore } from "@/lib/store/budget-store";
import type { ExpenseCategory, ExpenseWithCategory } from "@/lib/types/expenses";
import { getCategoryIcon } from "@/lib/utils/icons";
import { useMemo } from "react";

interface BudgetCategoryListProps {
  categories: ExpenseCategory[];
  expensesThisMonth: ExpenseWithCategory[];
}

export function BudgetCategoryList({ categories, expensesThisMonth }: BudgetCategoryListProps) {
  const { categoryBudgets } = useBudgetStore();

  const budgetedCategories = useMemo(() => {
    return categories
      .filter(cat => categoryBudgets[cat.id] && categoryBudgets[cat.id] > 0)
      .map(cat => {
        const budget = categoryBudgets[cat.id];
        const spent = expensesThisMonth
          .filter(e => e.categoryId === cat.id)
          .reduce((sum, e) => sum + Number(e.amount), 0);
        return { cat, budget, spent };
      })
      .sort((a, b) => (b.spent / b.budget) - (a.spent / a.budget));
  }, [categories, expensesThisMonth, categoryBudgets]);

  if (budgetedCategories.length === 0) {
    return (
      <div className="text-center p-8 bg-surface/50 border border-border border-dashed rounded-2xl text-muted-foreground text-sm">
        No category budgets configured yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {budgetedCategories.map(({ cat, budget, spent }) => {
        const percentage = Math.min((spent / budget) * 100, 100) || 0;
        
        let colorClass = "bg-emerald-500";
        if (percentage >= 60) colorClass = "bg-yellow-500";
        if (percentage >= 85) colorClass = "bg-orange-500";
        if (percentage >= 100) colorClass = "bg-red-500";

        return (
          <div key={cat.id} className="bg-surface border border-border/60 rounded-2xl p-4 shadow-sm hover:border-border transition-colors">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border border-border/40"
                  style={{ backgroundColor: `${cat.color}15` }}
                >
                  <span className="text-lg drop-shadow-sm">{getCategoryIcon(cat.name)}</span>
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-sm tracking-tight">{cat.name}</h4>
                  <div className="text-[11px] font-bold text-muted-foreground flex items-center gap-1">
                    <span>{percentage.toFixed(0)}% used</span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span className={budget - spent < 0 ? "text-red-500" : "text-emerald-500"}>
                      ₹{Math.abs(budget - spent).toLocaleString("en-IN", { maximumFractionDigits: 0 })} {budget - spent < 0 ? "over" : "left"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono font-bold text-foreground text-base tracking-tight">₹{spent.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</div>
                <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">/ ₹{budget.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</div>
              </div>
            </div>

            <div className="h-2.5 bg-background rounded-full overflow-hidden border border-border/50">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ease-out ${colorClass}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
