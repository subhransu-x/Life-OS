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
      <div className="flex justify-center">
        <div className="flex p-1.5 bg-surface-elevated rounded-2xl shadow-sm border border-border gap-1">
          {[
            { id: "analytics", icon: BarChart3, label: "Analytics" },
            { id: "budgets", icon: Wallet, label: "Budgets" },
            { id: "trends", icon: LineChart, label: "Trends" },
            { id: "behavior", icon: Brain, label: "Behavior" },
            { id: "transactions", icon: List, label: "Timeline" },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                title={tab.label}
                className={`p-3 rounded-xl transition-all flex items-center justify-center ${
                  isActive
                    ? "bg-background text-foreground shadow-sm ring-1 ring-border/50"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
              >
                <Icon className="w-5 h-5" />
              </button>
            );
          })}
        </div>
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
