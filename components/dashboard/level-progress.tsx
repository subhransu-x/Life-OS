"use client";

import { Zap } from "lucide-react";
import { useEffect, useState } from "react";

type LevelProgressProps = {
  level: number;
  xp: number;
  currentStreak: number;
  collapsed: boolean;
};

export function LevelProgress({ level, xp, currentStreak, collapsed }: LevelProgressProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    let active = true;
    requestAnimationFrame(() => {
      if (active) setMounted(true);
    });
    return () => {
      active = false;
    };
  }, []);
  
  // Calculate thresholds based on the formula in queries/gamification.ts
  const calculateThreshold = (lvl: number) => {
    if (lvl === 1) return 100;
    if (lvl === 2) return 250;
    if (lvl === 3) return 500;
    if (lvl === 4) return 1000;
    if (lvl === 5) return 2000;
    return Math.pow(lvl, 2) * 100;
  };

  const nextLevelXp = calculateThreshold(level);
  const prevLevelXp = level > 1 ? calculateThreshold(level - 1) : 0;
  
  const xpInCurrentLevel = Math.max(0, xp - prevLevelXp);
  const xpRequiredForNext = nextLevelXp - prevLevelXp;
  const progressPercentage = Math.min(100, Math.max(0, (xpInCurrentLevel / xpRequiredForNext) * 100));

  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="relative group cursor-help">
          <div className="w-10 h-10 rounded-full border border-primary/30 bg-primary/10 flex items-center justify-center relative overflow-hidden shadow-[0_0_15px_rgba(0,229,255,0.15)]">
            <span className="text-sm font-bold text-primary font-display">{level}</span>
            {/* Circular Progress Overlay */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
              <circle
                cx="20"
                cy="20"
                r="19"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="119.38"
                strokeDashoffset={119.38 - (progressPercentage / 100) * 119.38}
                className="text-primary opacity-50"
              />
            </svg>
          </div>
          
          {/* Tooltip */}
          <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-2 bg-surface-elevated/90 backdrop-blur-md border border-primary/30 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
            <div className="font-bold text-primary uppercase tracking-widest mb-1">Level {level}</div>
            <div className="text-muted-foreground">{xp} / {nextLevelXp} XP</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Profile Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full border border-primary/30 bg-primary/10 flex items-center justify-center relative overflow-hidden shadow-[0_0_15px_rgba(0,229,255,0.15)] shrink-0">
          <span className="text-lg font-bold text-primary font-display">{level}</span>
          <div className="absolute inset-0 bg-primary/20 blur-md mix-blend-screen" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold tracking-widest uppercase text-foreground truncate">Operator</div>
          <div className="flex items-center gap-2 mt-0.5">
            <div className="flex items-center gap-1 text-primary">
              <Zap className="w-3 h-3 fill-current" />
              <span className="text-[10px] font-bold tabular-nums leading-none mt-0.5">{currentStreak}</span>
            </div>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Streak</span>
          </div>
        </div>
      </div>

      {/* XP Progress Bar */}
      <div className="space-y-1.5 group cursor-help">
        <div className="flex justify-between text-[9px] font-bold tracking-widest uppercase text-muted-foreground">
          <span>{xp} XP</span>
          <span className="group-hover:text-primary transition-colors">{nextLevelXp} XP</span>
        </div>
        <div className="h-1.5 w-full bg-surface-elevated/50 rounded-full overflow-hidden border border-border/30 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]">
          <div 
            className="h-full bg-primary rounded-full relative transition-all duration-1000 ease-out"
            style={{ 
              width: mounted ? `${progressPercentage}%` : '0%',
              boxShadow: '0 0 10px var(--primary)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/30" />
          </div>
        </div>
      </div>
    </div>
  );
}
