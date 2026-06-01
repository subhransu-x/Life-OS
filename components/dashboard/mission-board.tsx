"use client";

import { Target, CheckCircle2, Circle } from "lucide-react";

type MissionProps = {
  missions: Array<{
    id: string;
    title: string;
    description: string;
    xpReward: number;
    completed: boolean;
  }>;
};

export function MissionBoard({ missions }: MissionProps) {
  // If no missions, show a placeholder
  if (!missions || missions.length === 0) {
    return (
      <div className="glass-card bg-surface/20 border-border/30 rounded-2xl p-4 lg:p-6 backdrop-blur-md relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2 relative z-10">
          <Target className="w-4 h-4 text-primary" />
          <h3 className="text-xs font-bold tracking-widest text-primary uppercase">Active Directives</h3>
        </div>
        <p className="text-sm text-foreground/80 font-medium">No active directives found.</p>
        <p className="text-xs text-muted-foreground mt-1">Standby for incoming mission parameters.</p>
      </div>
    );
  }

  const activeMission = missions.find(m => !m.completed) || missions[0];

  return (
    <div className="glass-card bg-surface/20 border-border/30 rounded-2xl p-4 lg:p-6 backdrop-blur-md relative overflow-hidden group">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-primary animate-pulse" />
          <h3 className="text-xs font-bold tracking-widest text-primary uppercase">Primary Directive</h3>
        </div>
        <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 uppercase tracking-widest">
          +{activeMission.xpReward} XP
        </div>
      </div>
      
      <div className="relative z-10 space-y-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            {activeMission.completed ? (
              <CheckCircle2 className="w-5 h-5 text-status-success drop-shadow-[0_0_8px_var(--status-success)]" />
            ) : (
              <Circle className="w-5 h-5 text-muted-foreground/50" />
            )}
          </div>
          <div>
            <h4 className={`text-base font-bold leading-tight ${activeMission.completed ? 'text-muted-foreground line-through' : 'text-foreground/90'}`}>
              {activeMission.title}
            </h4>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed max-w-[280px]">
              {activeMission.description}
            </p>
          </div>
        </div>
      </div>
      
      {/* Decorative HUD Elements */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute bottom-3 right-4 flex gap-1 pointer-events-none">
        <div className="w-1 h-1 bg-primary/40 rounded-full" />
        <div className="w-1 h-1 bg-primary/40 rounded-full" />
        <div className="w-1 h-1 bg-primary/80 rounded-full shadow-[0_0_5px_var(--primary)]" />
      </div>
    </div>
  );
}
