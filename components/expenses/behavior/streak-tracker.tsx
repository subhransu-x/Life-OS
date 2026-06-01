"use client";

import { useMemo } from "react";
import { getStreakData } from "@/lib/utils/behavior";
import type { ExpenseWithCategory } from "@/lib/types/expenses";
import { Flame, ShieldCheck, Trophy, CalendarX2 } from "lucide-react";

export function StreakTracker({ expenses }: { expenses: ExpenseWithCategory[] }) {
  const streaks = useMemo(() => getStreakData(expenses), [expenses]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-card border border-border rounded-3xl p-5 shadow-sm flex flex-col items-center text-center justify-center">
        <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-3">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Current Free</h4>
        <div className="text-2xl font-black font-mono">{streaks.currentNoSpend} <span className="text-xs font-sans text-muted-foreground font-medium tracking-normal">days</span></div>
      </div>

      <div className="bg-card border border-border rounded-3xl p-5 shadow-sm flex flex-col items-center text-center justify-center">
        <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mb-3">
          <Trophy className="w-5 h-5" />
        </div>
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Longest Free</h4>
        <div className="text-2xl font-black font-mono">{streaks.maxNoSpend} <span className="text-xs font-sans text-muted-foreground font-medium tracking-normal">days</span></div>
      </div>

      <div className="bg-card border border-border rounded-3xl p-5 shadow-sm flex flex-col items-center text-center justify-center">
        <div className="w-10 h-10 bg-purple-500/10 text-purple-500 rounded-full flex items-center justify-center mb-3">
          <CalendarX2 className="w-5 h-5" />
        </div>
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">This Month</h4>
        <div className="text-2xl font-black font-mono">{streaks.monthlyNoSpendDays} <span className="text-xs font-sans text-muted-foreground font-medium tracking-normal">days</span></div>
      </div>

      <div className="bg-card border border-border rounded-3xl p-5 shadow-sm flex flex-col items-center text-center justify-center relative overflow-hidden">
        {streaks.currentSpendStreak > 3 && (
           <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        )}
        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${streaks.currentSpendStreak > 0 ? 'bg-red-500/10 text-red-500' : 'bg-surface border border-border/50 text-muted-foreground'}`}>
          <Flame className="w-5 h-5" />
        </div>
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Spend Streak</h4>
        <div className={`text-2xl font-black font-mono ${streaks.currentSpendStreak > 0 ? 'text-red-500' : 'text-foreground'}`}>
          {streaks.currentSpendStreak} <span className="text-xs font-sans text-muted-foreground font-medium tracking-normal">days</span>
        </div>
      </div>
    </div>
  );
}
