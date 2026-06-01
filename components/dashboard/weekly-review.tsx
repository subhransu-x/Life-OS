"use client";

import { CheckSquare, AlertTriangle, TrendingUp, Sparkles } from "lucide-react";

type WeeklyReviewProps = {
  stats: {
    habitsCompleted: number;
    habitTotal: number;
    journalEntries: number;
    expensesTotal: number;
    budgetLimit: number;
  }
};

export function WeeklyReview({ stats }: WeeklyReviewProps) {
  const habitCompletionRate = stats.habitTotal > 0 ? (stats.habitsCompleted / stats.habitTotal) * 100 : 0;
  const underBudget = stats.expensesTotal <= stats.budgetLimit;
  
  let grade = "C";
  if (habitCompletionRate > 80 && underBudget && stats.journalEntries >= 3) grade = "S";
  else if (habitCompletionRate > 70 && underBudget) grade = "A";
  else if (habitCompletionRate > 50) grade = "B";

  return (
    <div className="glass-card rounded-3xl p-6 border border-border/40 shadow-xl relative overflow-hidden group">
      {/* Background flare based on grade */}
      <div 
        className="absolute -top-10 -right-10 w-40 h-40 blur-3xl opacity-20 pointer-events-none transition-all duration-700"
        style={{
          backgroundColor: grade === 'S' || grade === 'A' ? 'var(--status-success)' : grade === 'B' ? 'var(--status-warning)' : 'var(--status-danger)'
        }}
      />
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-surface-elevated flex items-center justify-center border border-border/50">
            <Sparkles className="w-4 h-4 text-foreground/80" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-widest uppercase text-foreground">Weekly Review</h3>
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest">System Diagnostics</div>
          </div>
        </div>
        
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-surface/50 border border-border/40">
          <span 
            className="text-2xl font-bold font-display leading-none"
            style={{
              color: grade === 'S' || grade === 'A' ? 'var(--status-success)' : grade === 'B' ? 'var(--status-warning)' : 'var(--status-danger)',
              textShadow: `0 0 10px ${grade === 'S' || grade === 'A' ? 'var(--status-success)' : grade === 'B' ? 'var(--status-warning)' : 'var(--status-danger)'}60`
            }}
          >
            {grade}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
        <div className="bg-surface/30 p-4 rounded-2xl border border-border/20">
          <div className="flex items-center gap-2 mb-2 text-domain-build">
            <CheckSquare className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Protocol Adherence</span>
          </div>
          <div className="text-xl font-bold font-display">{habitCompletionRate.toFixed(0)}%</div>
          <div className="text-[9px] text-muted-foreground mt-1 uppercase tracking-widest">{stats.habitsCompleted}/{stats.habitTotal} Executed</div>
        </div>
        
        <div className="bg-surface/30 p-4 rounded-2xl border border-border/20">
          <div className="flex items-center gap-2 mb-2 text-domain-money">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Resource Burn</span>
          </div>
          <div className="text-xl font-bold font-display" style={{ color: underBudget ? 'var(--status-success)' : 'var(--status-danger)' }}>
            ₹{stats.expensesTotal.toLocaleString()}
          </div>
          <div className="text-[9px] text-muted-foreground mt-1 uppercase tracking-widest">Max: ₹{stats.budgetLimit.toLocaleString()}</div>
        </div>
        
        <div className="bg-surface/30 p-4 rounded-2xl border border-border/20">
          <div className="flex items-center gap-2 mb-2 text-domain-mind">
            <TrendingUp className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Cognitive Logs</span>
          </div>
          <div className="text-xl font-bold font-display">{stats.journalEntries}</div>
          <div className="text-[9px] text-muted-foreground mt-1 uppercase tracking-widest">Entries filed</div>
        </div>
      </div>
    </div>
  );
}
