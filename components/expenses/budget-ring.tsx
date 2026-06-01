"use client";

import { useMemo } from "react";

interface BudgetRingProps {
  spent: number;
  budget: number;
  size?: number;
  strokeWidth?: number;
}

export function BudgetRing({ spent, budget, size = 240, strokeWidth = 20 }: BudgetRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.min((spent / budget) * 100, 100) || 0;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const colorClass = useMemo(() => {
    const p = (spent / budget) * 100;
    if (p < 60) return "text-emerald-500";
    if (p < 85) return "text-yellow-500";
    if (p < 100) return "text-orange-500";
    return "text-red-500";
  }, [spent, budget]);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90 w-full h-full">
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-surface border-border opacity-20"
        />
        {/* Progress Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={`transition-all duration-1000 ease-out ${colorClass}`}
        />
      </svg>

      {/* Center Content */}
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-4xl font-black tracking-tighter text-foreground">
          {percentage.toFixed(0)}%
        </span>
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-1">
          Used
        </div>
        <div className="mt-3 text-sm font-medium">
          <span className="text-foreground">₹{spent.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
          <span className="text-muted-foreground mx-1">/</span>
          <span className="text-muted-foreground">₹{budget.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
        </div>
      </div>
    </div>
  );
}
