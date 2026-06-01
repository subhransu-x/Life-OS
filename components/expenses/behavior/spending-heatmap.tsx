"use client";

import { useMemo } from "react";
import { getHeatmapData } from "@/lib/utils/behavior";
import type { ExpenseWithCategory } from "@/lib/types/expenses";
import { format, subDays, startOfWeek, addDays, isSameMonth } from "date-fns";
import { Calendar } from "lucide-react";

export function SpendingHeatmap({ expenses }: { expenses: ExpenseWithCategory[] }) {
  // Show last ~6 months
  const daysToLoad = 180;
  const data = useMemo(() => getHeatmapData(expenses, 6), [expenses]);
  
  const today = new Date();
  const startDate = startOfWeek(subDays(today, daysToLoad));
  
  const days = Array.from({length: daysToLoad}).map((_, i) => addDays(startDate, i));

  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];
  days.forEach(day => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  if (currentWeek.length > 0) weeks.push(currentWeek);

  const getIntensity = (amount: number) => {
    if (amount === 0) return 0;
    if (amount < 250) return 1;
    if (amount < 750) return 2;
    if (amount < 1500) return 3;
    return 4; // Extreme
  };

  const getBgClass = (intensity: number) => {
    switch(intensity) {
      case 0: return "bg-surface hover:bg-surface-elevated border-border/50";
      case 1: return "bg-primary/20 hover:bg-primary/30 border-primary/20";
      case 2: return "bg-primary/50 hover:bg-primary/60 border-primary/30";
      case 3: return "bg-primary/80 hover:bg-primary/90 border-primary/50 text-background";
      case 4: return "bg-primary hover:bg-primary border-primary shadow-sm text-background";
      default: return "bg-surface";
    }
  };

  const months = useMemo(() => {
    const m: { name: string; colIndex: number }[] = [];
    let lastMonth = -1;
    weeks.forEach((week, i) => {
      const weekStartMonth = week[0].getMonth();
      if (weekStartMonth !== lastMonth) {
        m.push({ name: format(week[0], "MMM"), colIndex: i });
        lastMonth = weekStartMonth;
      }
    });
    return m;
  }, [weeks]);

  return (
    <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col w-full relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      
      <div className="flex items-center gap-2 mb-6 text-foreground font-bold font-heading text-lg relative z-10">
        <Calendar className="w-5 h-5 text-primary" /> Spending Heatmap
      </div>

      <div className="overflow-x-auto hide-scrollbar pb-2 relative z-10">
        <div className="min-w-max">
          {/* Month Labels */}
          <div className="flex text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-2 relative h-4">
            {months.map((m, i) => (
              <span key={i} className="absolute" style={{ left: `${m.colIndex * 16}px` }}>
                {m.name}
              </span>
            ))}
          </div>

          <div className="flex gap-1">
            {/* Days of week labels */}
            <div className="flex flex-col gap-1 text-[9px] uppercase font-bold text-muted-foreground/50 tracking-widest mt-1 mr-2 text-right">
              <span className="h-3 leading-3">Sun</span>
              <span className="h-3 leading-3 opacity-0">Mon</span>
              <span className="h-3 leading-3">Tue</span>
              <span className="h-3 leading-3 opacity-0">Wed</span>
              <span className="h-3 leading-3">Thu</span>
              <span className="h-3 leading-3 opacity-0">Fri</span>
              <span className="h-3 leading-3">Sat</span>
            </div>

            {/* Grid */}
            {weeks.map((week, i) => (
              <div key={i} className="flex flex-col gap-1">
                {week.map((day, j) => {
                  const dateStr = format(day, "yyyy-MM-dd");
                  const amount = data[dateStr] || 0;
                  const intensity = getIntensity(amount);
                  const bg = getBgClass(intensity);

                  return (
                    <div 
                      key={j}
                      className={`w-3 h-3 rounded-[3px] border transition-colors cursor-default group relative ${bg} ${day > today ? 'opacity-20' : ''}`}
                    >
                      {/* Tooltip */}
                      <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-foreground text-background text-xs font-medium rounded-lg whitespace-nowrap pointer-events-none transition-opacity z-50 flex flex-col items-center">
                        <span className="font-bold">{format(day, "MMM d, yyyy")}</span>
                        <span className="text-muted font-mono">
                          {amount > 0 ? `₹${amount.toLocaleString("en-IN")}` : "No spend"}
                        </span>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-foreground" />
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end items-center gap-2 mt-4 text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-[3px] border border-border/50 bg-surface" />
          <div className="w-3 h-3 rounded-[3px] border border-primary/20 bg-primary/20" />
          <div className="w-3 h-3 rounded-[3px] border border-primary/30 bg-primary/50" />
          <div className="w-3 h-3 rounded-[3px] border border-primary/50 bg-primary/80" />
          <div className="w-3 h-3 rounded-[3px] border border-primary bg-primary" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
