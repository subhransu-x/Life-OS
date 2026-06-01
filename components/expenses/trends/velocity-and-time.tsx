"use client";

import { useMemo } from "react";
import { getVelocity, getTimeAnalysis, getDayOfWeekAnalysis, getTopSpendingDays } from "@/lib/utils/trends";
import type { ExpenseWithCategory } from "@/lib/types/expenses";
import { Zap, Clock, CalendarDays, TrendingUp, TrendingDown, Calendar } from "lucide-react";

export function VelocityAndTime({ expenses }: { expenses: ExpenseWithCategory[] }) {
  const velocity = useMemo(() => getVelocity(expenses), [expenses]);
  const times = useMemo(() => getTimeAnalysis(expenses), [expenses]);
  const days = useMemo(() => getDayOfWeekAnalysis(expenses), [expenses]);
  const topDays = useMemo(() => getTopSpendingDays(expenses), [expenses]);

  const maxTime = Math.max(...Object.values(times), 1);
  const maxDay = Math.max(...days, 1);
  const dayNames = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Velocity Card */}
      <div className="bg-card border border-border rounded-3xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="flex items-center gap-2 mb-4 text-muted-foreground font-bold text-[11px] uppercase tracking-widest relative z-10">
          <Zap className="w-4 h-4 text-yellow-500" /> Spending Velocity
        </div>
        <div className="text-3xl md:text-4xl font-mono font-black tracking-tighter text-foreground mb-2 relative z-10">
          ₹{velocity.currentVelocity.toLocaleString("en-IN", { maximumFractionDigits: 0 })}<span className="text-base text-muted-foreground font-sans font-medium">/day</span>
        </div>
        <div className={`text-sm font-semibold flex items-center gap-1.5 relative z-10 ${velocity.trend === 'faster' ? 'text-red-500' : 'text-emerald-500'}`}>
          {velocity.trend === 'faster' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {velocity.percentChange.toFixed(0)}% {velocity.trend} than last month
        </div>
      </div>

      {/* Top Days List */}
      <div className="bg-card border border-border rounded-3xl p-6 shadow-sm md:row-span-2 flex flex-col">
        <div className="flex items-center gap-2 mb-6 text-muted-foreground font-bold text-[11px] uppercase tracking-widest">
          <Calendar className="w-4 h-4 text-primary" /> Most Expensive Days
        </div>
        <div className="space-y-4 flex-1">
          {topDays.map((d, i) => (
            <div key={i} className="flex justify-between items-center group cursor-default">
              <div className="flex items-center gap-3">
                <span className="text-lg font-black text-muted-foreground/30 w-5 text-right">{i+1}.</span>
                <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{d.dateStr}</span>
              </div>
              <span className="font-mono font-bold text-foreground bg-surface px-2.5 py-1 rounded-md text-sm border border-border/60 shadow-sm">
                ₹{d.amount.toLocaleString("en-IN")}
              </span>
            </div>
          ))}
          {topDays.length === 0 && (
            <div className="text-center text-sm text-muted-foreground h-full flex items-center justify-center">
              No days recorded yet
            </div>
          )}
        </div>
      </div>

      {/* Time & Days Cards side by side */}
      <div className="grid grid-cols-2 gap-4">
        {/* Time Analysis */}
        <div className="bg-surface/50 border border-border/60 rounded-2xl p-4 flex flex-col">
           <div className="flex items-center gap-2 mb-4 text-muted-foreground font-bold text-[10px] uppercase tracking-widest">
            <Clock className="w-3.5 h-3.5 text-blue-500" /> Time of Day
          </div>
          <div className="space-y-3 flex-1 justify-center flex flex-col">
            {Object.entries(times).map(([time, amount]) => (
              <div key={time} className="flex items-center gap-2">
                <span className="text-[9px] uppercase font-bold w-14 text-muted-foreground">{time}</span>
                <div className="flex-1 h-1.5 bg-background border border-border/50 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out" style={{ width: `${(amount/maxTime)*100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Day Analysis */}
        <div className="bg-surface/50 border border-border/60 rounded-2xl p-4 flex flex-col">
           <div className="flex items-center gap-2 mb-4 text-muted-foreground font-bold text-[10px] uppercase tracking-widest">
            <CalendarDays className="w-3.5 h-3.5 text-orange-500" /> Day of Week
          </div>
          <div className="flex items-end justify-between flex-1 pt-2">
            {days.map((amount, i) => (
              <div key={i} className="flex flex-col items-center gap-2 w-full h-full justify-end">
                <div className="w-full max-w-[6px] bg-background border border-border/50 rounded-full h-[60px] relative overflow-hidden flex items-end">
                  <div className="w-full bg-orange-500 rounded-full transition-all duration-1000 ease-out" style={{ height: `${(amount/maxDay)*100}%` }} />
                </div>
                <span className="text-[9px] uppercase font-bold text-muted-foreground">{dayNames[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
