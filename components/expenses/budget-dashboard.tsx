"use client";

import { useState, useMemo } from "react";
import { useBudgetStore } from "@/lib/store/budget-store";
import { BudgetRing } from "@/components/expenses/budget-ring";
import { BudgetCategoryList } from "@/components/expenses/budget-category-list";
import { BudgetConfigModal } from "@/components/expenses/budget-config-modal";
import { Settings2, AlertTriangle, TrendingUp, ShieldCheck, Activity } from "lucide-react";
import { isThisMonth, getDaysInMonth, getDate } from "date-fns";
import type { ExpenseCategory, ExpenseWithCategory } from "@/lib/types/expenses";

export function BudgetDashboard({ expenses, categories }: { expenses: ExpenseWithCategory[]; categories: ExpenseCategory[] }) {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const { monthlyBudget, categoryBudgets } = useBudgetStore();

  const expensesThisMonth = useMemo(() => expenses.filter(e => isThisMonth(new Date(e.date))), [expenses]);
  
  const spentThisMonth = useMemo(() => 
    expensesThisMonth.reduce((sum, e) => sum + Number(e.amount), 0),
  [expensesThisMonth]);

  const now = new Date();
  const currentDay = getDate(now);
  const daysInMonth = getDaysInMonth(now);
  const daysRemaining = daysInMonth - currentDay;

  // Forecasting
  const dailyRate = currentDay > 0 ? spentThisMonth / currentDay : 0;
  const forecast = dailyRate * daysInMonth;
  const projectedOverrun = forecast > monthlyBudget ? forecast - monthlyBudget : 0;
  const remainingBudget = monthlyBudget - spentThisMonth;
  const safeDailySpend = daysRemaining > 0 && remainingBudget > 0 ? remainingBudget / daysRemaining : 0;

  // Health Score Logic (0-100)
  const healthScore = useMemo(() => {
    let score = 100;
    
    // Penalty for over total budget
    if (spentThisMonth > monthlyBudget) {
      score -= Math.min(50, ((spentThisMonth - monthlyBudget) / monthlyBudget) * 100);
    }
    
    // Penalty for high run rate
    if (forecast > monthlyBudget) {
      score -= 15;
    }

    // Penalties for overspending category budgets
    let categoriesOverLimit = 0;
    Object.keys(categoryBudgets).forEach(catId => {
      const budget = categoryBudgets[catId];
      if (budget && budget > 0) {
        const catSpent = expensesThisMonth.filter(e => e.categoryId === catId).reduce((sum, e) => sum + Number(e.amount), 0);
        if (catSpent > budget) {
          categoriesOverLimit++;
        }
      }
    });

    score -= (categoriesOverLimit * 10);
    return Math.max(0, Math.round(score));
  }, [spentThisMonth, monthlyBudget, forecast, categoryBudgets, expensesThisMonth]);

  // Warnings
  const warnings = useMemo(() => {
    const alerts = [];
    if (spentThisMonth > monthlyBudget) {
      alerts.push(`🔴 Monthly budget exceeded by ₹${(spentThisMonth - monthlyBudget).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`);
    } else if (spentThisMonth > monthlyBudget * 0.85) {
      alerts.push(`⚠ You have used ${((spentThisMonth / monthlyBudget) * 100).toFixed(0)}% of your monthly budget.`);
    }

    Object.keys(categoryBudgets).forEach(catId => {
      const budget = categoryBudgets[catId];
      if (budget && budget > 0) {
        const catSpent = expensesThisMonth.filter(e => e.categoryId === catId).reduce((sum, e) => sum + Number(e.amount), 0);
        if (catSpent > budget) {
          const catName = categories.find(c => c.id === catId)?.name || "Category";
          alerts.push(`🚨 ${catName} budget exceeded by ₹${(catSpent - budget).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`);
        }
      }
    });
    return alerts;
  }, [spentThisMonth, monthlyBudget, categoryBudgets, expensesThisMonth, categories]);

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Section: Progress & Settings */}
      <div className="bg-card border border-border rounded-3xl p-6 shadow-sm relative overflow-hidden">
        {/* Background gradient hint */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground font-heading tracking-tight">Monthly Budget</h2>
            <p className="text-sm text-muted-foreground">Keep your spending on track</p>
          </div>
          <button 
            onClick={() => setIsConfigOpen(true)}
            className="p-2 bg-surface hover:bg-surface-elevated border border-border rounded-xl transition-all shadow-sm hover:shadow active:scale-95 text-foreground"
            title="Configure Budgets"
          >
            <Settings2 className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 pb-4">
          <BudgetRing spent={spentThisMonth} budget={monthlyBudget} size={220} strokeWidth={18} />
          
          <div className="flex-1 w-full grid grid-cols-2 gap-4">
            <div className="bg-surface/50 border border-border/50 rounded-2xl p-4">
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Safe Daily Spend
              </div>
              <div className="text-xl font-mono font-bold text-foreground">
                ₹{safeDailySpend.toLocaleString("en-IN", { maximumFractionDigits: 0 })}<span className="text-sm text-muted-foreground">/d</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">For {daysRemaining} days left</div>
            </div>

            <div className="bg-surface/50 border border-border/50 rounded-2xl p-4">
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-primary" /> Forecast
              </div>
              <div className="text-xl font-mono font-bold text-foreground">
                ₹{forecast.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {projectedOverrun > 0 ? (
                  <span className="text-red-500 font-medium">+₹{projectedOverrun.toLocaleString("en-IN", { maximumFractionDigits: 0 })} overrun</span>
                ) : (
                  <span className="text-emerald-500 font-medium">On track</span>
                )}
              </div>
            </div>

            <div className="col-span-2 bg-surface-elevated border border-border rounded-2xl p-4 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-blue-500" /> Health Score
                </div>
                <div className="text-xs text-muted-foreground font-medium mt-1">
                  {healthScore >= 90 ? "Excellent" : healthScore >= 70 ? "Good" : healthScore >= 50 ? "Warning" : "Critical"}
                </div>
              </div>
              <div className="text-4xl font-black font-mono tracking-tighter" style={{
                color: healthScore >= 90 ? "#10B981" : healthScore >= 70 ? "#F59E0B" : healthScore >= 50 ? "#F97316" : "#EF4444"
              }}>
                {healthScore}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Warnings Section */}
      {warnings.length > 0 && (
        <div className="space-y-2">
          {warnings.map((warning, idx) => (
            <div key={idx} className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-semibold shadow-sm">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              {warning}
            </div>
          ))}
        </div>
      )}

      {/* Category Budgets */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-foreground font-heading">Category Limits</h3>
        </div>
        <BudgetCategoryList categories={categories} expensesThisMonth={expensesThisMonth} />
      </div>

      <BudgetConfigModal 
        isOpen={isConfigOpen} 
        onClose={() => setIsConfigOpen(false)} 
        categories={categories} 
      />
    </div>
  );
}
