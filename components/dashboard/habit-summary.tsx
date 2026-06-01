"use client";

import Link from "next/link";
import { Hammer, Zap } from "lucide-react";
import { useEffect, useState } from "react";

type HabitSummaryProps = {
  total: number;
  completed: number;
  remaining?: number;
  currentStreak: number;
  consistencyScore: number;
};

export function HabitSummary({ total, completed, currentStreak, consistencyScore }: HabitSummaryProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatedPercentage(percentage);
    }, 100);
    return () => clearTimeout(timeout);
  }, [percentage]);

  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference;
  
  const isPerfect = completed > 0 && completed === total;

  return (
    <div className="glass-card rounded-3xl p-6 flex flex-col h-full border border-border/40 shadow-xl group hover:border-domain-build/30 transition-all duration-500 overflow-hidden relative">
      {/* Background glow when perfect */}
      {isPerfect && (
        <div className="absolute inset-0 bg-domain-build/5 blur-xl pointer-events-none transition-opacity duration-1000" />
      )}
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-domain-build/10 flex items-center justify-center border border-domain-build/20">
            <Hammer className="w-4 h-4" style={{ color: "var(--domain-build)" }} />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-widest uppercase text-foreground">Build</h3>
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Protocol Active</div>
          </div>
        </div>
        <Link 
          href="/habits" 
          className="text-xs font-medium px-3 py-1.5 rounded-full bg-surface-elevated hover:bg-surface-elevated/80 border border-border/50 transition-colors"
          style={{ color: "var(--domain-build)" }}
        >
          View Log
        </Link>
      </div>

      <div className="flex-1 flex items-center gap-6 relative z-10">
        {/* Daily Completion Ring */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg className="w-20 h-20 transform -rotate-90">
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke="currentColor"
              strokeWidth="5"
              fill="transparent"
              className="text-surface-elevated shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]"
            />
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke="currentColor"
              strokeWidth="5"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ 
                color: "var(--domain-build)",
                filter: isPerfect ? "drop-shadow(0 0 8px var(--domain-build))" : "none" 
              }}
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-xl font-bold font-display tabular-nums" style={{ color: isPerfect ? "var(--domain-build)" : "var(--foreground)" }}>
              {completed}
            </span>
            <span className="text-[9px] text-muted-foreground uppercase -mt-1 font-bold">/{total}</span>
          </div>
        </div>

        {/* Stats Column */}
        <div className="flex-1 flex flex-col gap-3">
          <div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Consistency</div>
            <div className="flex items-end gap-1">
              <span className="text-xl font-bold tabular-nums leading-none text-foreground">{consistencyScore}</span>
              <span className="text-xs text-muted-foreground mb-0.5">%</span>
            </div>
            {/* Mini Progress Bar for consistency */}
            <div className="w-full h-1 bg-surface-elevated rounded-full mt-1.5 overflow-hidden">
              <div className="h-full bg-domain-build/50 rounded-full" style={{ width: `${consistencyScore}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Status / Heatmap Placeholder */}
      <div className="mt-6 pt-4 border-t border-border/30 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-1.5 bg-domain-build/10 px-2 py-1 rounded border border-domain-build/20">
          <Zap className="w-3.5 h-3.5" style={{ color: "var(--domain-build)" }} />
          <span className="text-xs font-bold tabular-nums" style={{ color: "var(--domain-build)" }}>{currentStreak} Day Streak</span>
        </div>
        
        {/* Heatmap mock squares */}
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5, 6, 7].map((day, i) => (
            <div 
              key={day} 
              className={`w-2.5 h-2.5 rounded-sm ${i < 5 ? 'bg-domain-build/80' : i === 5 ? 'bg-domain-build/40' : 'bg-surface-elevated border border-border/50'}`}
              style={i < 6 ? { boxShadow: `0 0 5px var(--domain-build)`} : {}}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
