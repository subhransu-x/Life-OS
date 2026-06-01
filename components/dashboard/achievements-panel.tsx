"use client";

import { Trophy, Lock } from "lucide-react";

type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  unlocked: boolean;
};

export function AchievementsPanel({ achievements }: { achievements: Achievement[] }) {
  if (!achievements || achievements.length === 0) {
    return null;
  }

  return (
    <div className="glass-card rounded-3xl p-6 border border-border/40 shadow-xl overflow-hidden relative">
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-status-warning/10 flex items-center justify-center border border-status-warning/20">
            <Trophy className="w-4 h-4 text-status-warning drop-shadow-[0_0_5px_var(--status-warning)]" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-widest uppercase text-foreground">Accolades</h3>
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Milestones & Awards</div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
        {achievements.map((achievement) => (
          <div 
            key={achievement.id}
            className={`flex flex-col items-center text-center p-4 rounded-2xl border transition-all duration-300 ${
              achievement.unlocked 
                ? 'bg-status-warning/5 border-status-warning/20 hover:border-status-warning/40 hover:bg-status-warning/10 shadow-[inset_0_0_15px_rgba(245,158,11,0.05)]' 
                : 'bg-surface/30 border-border/20 opacity-50 grayscale hover:grayscale-0'
            }`}
          >
            <div className="mb-2 relative">
              <div className="text-3xl">{achievement.icon}</div>
              {!achievement.unlocked && (
                <div className="absolute -bottom-1 -right-1 bg-surface-elevated rounded-full p-0.5 border border-border">
                  <Lock className="w-3 h-3 text-muted-foreground" />
                </div>
              )}
            </div>
            <h4 className="text-xs font-bold text-foreground/90 uppercase tracking-wider mb-1 line-clamp-1">{achievement.title}</h4>
            <div className="text-[9px] text-muted-foreground font-medium line-clamp-2 leading-tight">
              {achievement.description}
            </div>
            {achievement.unlocked && (
              <div className="mt-2 text-[10px] font-bold text-status-warning tabular-nums">
                +{achievement.points} XP
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
