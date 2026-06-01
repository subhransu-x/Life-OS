"use client";

import { useMemo } from "react";
import { generateInsights } from "@/lib/utils/trends";
import type { ExpenseWithCategory, ExpenseCategory } from "@/lib/types/expenses";

export function InsightsPanel({ expenses, categories }: { expenses: ExpenseWithCategory[]; categories: ExpenseCategory[] }) {
  const insights = useMemo(() => generateInsights(expenses, categories), [expenses, categories]);

  if (insights.length === 0) return null;

  return (
    <div className="space-y-6">
      {/* Trend Badges */}
      <div className="flex flex-wrap gap-2">
        {insights.filter(i => i.badge).map((i, idx) => (
          <span key={idx} className={`text-xs font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 shadow-sm ${
            i.type === "surge" ? "bg-red-500/10 text-red-500 border-red-500/20" :
            i.type === "growing" ? "bg-orange-500/10 text-orange-500 border-orange-500/20" :
            i.type === "reduced" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
            "bg-surface border-border/60 text-muted-foreground"
          }`}>
            {i.badge}
          </span>
        ))}
      </div>

      {/* Observations Engine */}
      <div className="bg-surface-elevated border border-border rounded-3xl p-6 shadow-sm space-y-4 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        
        <h3 className="text-lg font-bold font-heading text-foreground">AI Observations</h3>
        <div className="space-y-4 relative z-10">
          {insights.map((insight, idx) => (
            <div key={idx} className="flex gap-3 items-start text-sm font-medium text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <p className="leading-relaxed">{insight.text}</p>
            </div>
          ))}
          {insights.length === 0 && (
            <p className="text-sm text-muted-foreground italic">Not enough data to generate insights yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
