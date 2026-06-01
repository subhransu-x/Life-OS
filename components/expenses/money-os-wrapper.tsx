"use client";

import { useState } from "react";
import { MoneyDashboard } from "@/components/expenses/money-dashboard";
import { ExpensesPageContent } from "@/components/expenses/expenses-page-content";
import { BudgetDashboard } from "@/components/expenses/budget-dashboard";
import { TrendsDashboard } from "@/components/expenses/trends-dashboard";
import { BehaviorDashboard } from "@/components/expenses/behavior-dashboard";
import { FloatingExpenseButton } from "@/components/expenses/logging/floating-expense-button";
import { BarChart3, Wallet, List, LineChart, Brain } from "lucide-react";
import type { ExpenseCategory, ExpenseWithCategory } from "@/lib/types/expenses";
import type { Goal } from "@prisma/client";

interface MoneyOsWrapperProps {
  expenses: ExpenseWithCategory[];
  categories: ExpenseCategory[];
  stats: { total: number; count: number; avgPerDay: number; largestCategory: string | null };
  breakdown: Array<{ id: string; name: string; color: string; amount: number; percentage: number; transactionCount: number }>;
  goals: Goal[];
}

export function MoneyOsWrapper({ expenses, categories, stats, breakdown, goals }: MoneyOsWrapperProps) {
  const [activeTab, setActiveTab] = useState<"analytics" | "trends" | "behavior" | "budgets" | "transactions">("analytics");

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="flex p-1.5 bg-surface-elevated rounded-2xl shadow-sm border border-border w-full max-w-md mx-auto overflow-x-auto hide-scrollbar">
        <button
          onClick={() => setActiveTab("analytics")}
          className={`flex-1 shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === "analytics"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-background/50"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Analytics</span>
        </button>
        <button
          onClick={() => setActiveTab("budgets")}
          className={`flex-1 shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === "budgets"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-background/50"
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>Budgets</span>
        </button>
        <button
          onClick={() => setActiveTab("trends")}
          className={`flex-1 shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === "trends"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-background/50"
          }`}
        >
          <LineChart className="w-4 h-4" />
          <span>Trends</span>
        </button>
        <button
          onClick={() => setActiveTab("behavior")}
          className={`flex-1 shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === "behavior"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-background/50"
          }`}
        >
          <Brain className="w-4 h-4" />
          <span>Behavior</span>
        </button>
        <button
          onClick={() => setActiveTab("transactions")}
          className={`flex-1 shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === "transactions"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-background/50"
          }`}
        >
          <List className="w-4 h-4" />
          <span>Timeline</span>
        </button>
      </div>

      {/* Content */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {activeTab === "analytics" && <MoneyDashboard stats={stats} breakdown={breakdown} />}
        {activeTab === "trends" && <TrendsDashboard expenses={expenses} categories={categories} />}
        {activeTab === "behavior" && <BehaviorDashboard expenses={expenses} categories={categories} />}
        {activeTab === "budgets" && <BudgetDashboard expenses={expenses} categories={categories} />}
        {activeTab === "transactions" && <ExpensesPageContent expenses={expenses} categories={categories} goals={goals} />}
      </div>
      
      <FloatingExpenseButton categories={categories} expenses={expenses} />
    </div>
  );
}
