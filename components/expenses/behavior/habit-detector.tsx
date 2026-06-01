"use client";

import { useMemo } from "react";
import { getHabitDetection, getFrequencyAnalysis } from "@/lib/utils/behavior";
import type { ExpenseWithCategory, ExpenseCategory } from "@/lib/types/expenses";
import { BrainCircuit, Fingerprint } from "lucide-react";

export function HabitDetector({ expenses, categories }: { expenses: ExpenseWithCategory[]; categories: ExpenseCategory[] }) {
  const habits = useMemo(() => getHabitDetection(expenses), [expenses]);
  const freq = useMemo(() => getFrequencyAnalysis(expenses, categories), [expenses, categories]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Detected Habits */}
      <div className="bg-card border border-border rounded-3xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="flex items-center gap-2 mb-6 text-foreground font-bold font-heading text-lg relative z-10">
          <BrainCircuit className="w-5 h-5 text-primary" /> Detected Habits
        </div>
        
        {habits.length === 0 ? (
          <div className="text-center p-6 bg-surface/50 rounded-2xl border border-border/50 text-sm text-muted-foreground relative z-10">
            No strong habits detected yet. Keep logging!
          </div>
        ) : (
          <div className="space-y-3 relative z-10">
            {habits.map((habit, idx) => (
              <div key={idx} className="flex justify-between items-center bg-surface-elevated border border-border/60 p-4 rounded-2xl shadow-sm group hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-2xl drop-shadow-sm group-hover:scale-110 transition-transform">{habit.icon}</span>
                  <span className="text-sm font-bold text-foreground">{habit.name}</span>
                </div>
                <div className="text-xs font-bold font-mono text-muted-foreground bg-background px-2.5 py-1 rounded-md border border-border shadow-sm">
                  {habit.count}x
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Transaction Frequency */}
      <div className="bg-card border border-border rounded-3xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="flex items-center gap-2 mb-6 text-foreground font-bold font-heading text-lg relative z-10">
          <Fingerprint className="w-5 h-5 text-blue-500" /> Transaction Frequency
        </div>
        
        <div className="space-y-4 relative z-10">
          <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider mb-2">Ranked by volume, not cost (This Month)</p>
          {freq.slice(0, 5).map((f, idx) => (
            <div key={idx} className="flex justify-between items-center group py-1">
              <div className="flex items-center gap-3">
                <span className="text-sm font-black text-muted-foreground/30 w-4 text-right">{idx + 1}.</span>
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: f.category.color }} />
                  <span className="text-sm font-bold text-foreground">{f.category.name}</span>
                </div>
              </div>
              <div className="text-sm font-mono font-black text-foreground bg-surface px-2 py-0.5 rounded border border-border/50">
                {f.count} <span className="text-[10px] uppercase text-muted-foreground font-sans font-bold tracking-widest ml-0.5">txns</span>
              </div>
            </div>
          ))}
          {freq.length === 0 && (
             <div className="text-center p-6 bg-surface/50 rounded-2xl border border-border/50 text-sm text-muted-foreground">
              No transactions this month.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
