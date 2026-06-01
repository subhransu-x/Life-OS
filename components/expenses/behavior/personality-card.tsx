"use client";

import { useMemo } from "react";
import { getFinancialPersonality, calculateBehaviorScore } from "@/lib/utils/behavior";
import type { ExpenseWithCategory, ExpenseCategory } from "@/lib/types/expenses";

export function PersonalityCard({ expenses, categories }: { expenses: ExpenseWithCategory[]; categories: ExpenseCategory[] }) {
  const personality = useMemo(() => getFinancialPersonality(expenses, categories), [expenses, categories]);
  const score = useMemo(() => calculateBehaviorScore(expenses), [expenses]);

  let scoreColor = "#10B981"; // Emerald
  if (score < 80) scoreColor = "#F59E0B"; // Yellow
  if (score < 60) scoreColor = "#F97316"; // Orange
  if (score < 40) scoreColor = "#EF4444"; // Red

  return (
    <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col md:flex-row gap-6 items-center relative overflow-hidden">
      {/* Background glow based on score */}
      <div 
        className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-20" 
        style={{ backgroundColor: scoreColor }}
      />
      
      <div className="flex-1 space-y-2 text-center md:text-left relative z-10">
        <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-2 py-1 rounded-md mb-2 shadow-sm">
          Financial Personality
        </div>
        <h3 className="text-2xl font-black font-heading flex items-center justify-center md:justify-start gap-2 text-foreground">
          <span className="drop-shadow-sm">{personality.icon}</span>
          {personality.type}
        </h3>
        <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-sm mx-auto md:mx-0">
          {personality.desc}
        </p>
      </div>

      <div className="shrink-0 flex flex-col items-center bg-surface-elevated border border-border/60 rounded-2xl p-5 min-w-[140px] shadow-sm relative z-10">
        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Discipline Score</div>
        <div className="text-5xl font-black font-mono tracking-tighter" style={{ color: scoreColor }}>
          {score}
        </div>
        <div className="text-xs font-bold uppercase tracking-wider mt-1.5" style={{ color: scoreColor }}>
          {score >= 85 ? "Exceptional" : score >= 70 ? "Strong" : score >= 50 ? "Moderate" : score >= 30 ? "Weak" : "Critical"}
        </div>
      </div>
    </div>
  );
}
