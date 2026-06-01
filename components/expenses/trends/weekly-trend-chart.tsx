"use client";

import { useMemo } from "react";
import { getWeeklyTrend } from "@/lib/utils/trends";
import type { ExpenseWithCategory } from "@/lib/types/expenses";

export function WeeklyTrendChart({ expenses }: { expenses: ExpenseWithCategory[] }) {
  const weeks = useMemo(() => getWeeklyTrend(expenses), [expenses]);
  
  const max = Math.max(...weeks, 1);
  const height = 100;
  
  const points = weeks.map((val, i) => {
    const x = (i / (weeks.length - 1)) * 100;
    const y = height - (val / max) * height;
    return `${x},${y}`;
  }).join(" ");

  const fillPoints = `0,${height} ${points} 100,${height}`;

  return (
    <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
      <h3 className="text-lg font-bold font-heading">Weekly Trend</h3>
      <div className="relative w-full h-32 pt-2 pb-6">
        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" className="text-primary" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" className="text-primary" />
            </linearGradient>
          </defs>
          <polygon
            points={fillPoints}
            fill="url(#trendGradient)"
          />
          <polyline
            points={points}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary"
          />
          {weeks.map((val, i) => {
            const x = (i / (weeks.length - 1)) * 100;
            const y = height - (val / max) * height;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="3"
                className="fill-background stroke-primary stroke-[2.5px]"
              />
            );
          })}
        </svg>
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
          <span>W1</span>
          <span>W2</span>
          <span>W3</span>
          <span>W4</span>
          <span>W5</span>
        </div>
      </div>
    </div>
  );
}
