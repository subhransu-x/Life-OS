"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Target, Calendar, CheckCircle2, Circle } from "lucide-react";
import type { GoalWithCounts } from "./goals-page-content";

interface GoalListProps {
  goals: GoalWithCounts[];
}

export function GoalList({ goals }: GoalListProps) {
  if (goals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-border/60 rounded-2xl bg-surface-elevated/20">
        <Target className="w-12 h-12 text-muted-foreground/30 mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-1">No goals set</h3>
        <p className="text-sm text-muted-foreground text-center max-w-sm">
          Set a goal to give your daily habits and tracking a clear direction.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {goals.map((goal) => {
        // Domain specific styles
        let domainColor = "var(--primary)";
        if (goal.domain === "Build") domainColor = "var(--domain-build)";
        if (goal.domain === "Money") domainColor = "var(--domain-money)";
        if (goal.domain === "Mind") domainColor = "var(--domain-mind)";

        return (
          <Link
            key={goal.id}
            href={`/goals/${goal.id}`}
            className="group relative flex flex-col p-5 rounded-2xl glass-card border border-border/40 spring-transition hover:-translate-y-1 hover:shadow-lg overflow-hidden"
          >
            {/* Ambient background glow */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none"
              style={{ backgroundColor: domainColor }}
            />
            
            <div className="flex items-start justify-between mb-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: domainColor }} 
                  />
                  <span className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                    {goal.domain}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {goal.title}
                </h3>
              </div>
              {goal.completed ? (
                <CheckCircle2 className="w-5 h-5 text-status-success shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground/30 shrink-0" />
              )}
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-6">
              {goal.targetDate && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Target: {format(new Date(goal.targetDate), "MMM yyyy")}</span>
                </div>
              )}
              <div className="flex gap-2">
                {goal._count.habits > 0 && <span>{goal._count.habits} Habits</span>}
                {goal._count.expenses > 0 && <span>{goal._count.expenses} Exp</span>}
                {goal._count.journals > 0 && <span>{goal._count.journals} Logs</span>}
              </div>
            </div>

            <div className="mt-auto space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-foreground">Progress</span>
                <span style={{ color: domainColor }}>{goal.progress}%</span>
              </div>
              <div className="h-2 w-full bg-surface-elevated rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${goal.progress}%`, backgroundColor: domainColor }}
                />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
