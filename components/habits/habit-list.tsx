"use client";

import { useTransition, useState } from "react";
import { deleteHabit, toggleHabitCompletion } from "@/lib/actions/habits";
import { Hammer, Edit2 } from "lucide-react";
import { Habit, HabitLog } from "@prisma/client";
import { EmptyState } from "@/components/ui/empty-state";

type HabitWithLogs = Habit & {
  logs: HabitLog[];
};

export function HabitList({ 
  habits,
  streaks,
  onEdit
}: { 
  habits: HabitWithLogs[];
  streaks: Record<string, number>;
  onEdit: (habit: HabitWithLogs) => void;
}) {
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [, startTransition] = useTransition();

  const handleToggle = (habit: HabitWithLogs) => {
    const isCompletedToday = habit.logs.length > 0;
    const logId = isCompletedToday ? habit.logs[0].id : undefined;

    setPendingIds((prev) => new Set(prev).add(habit.id));
    startTransition(async () => {
      try {
        await toggleHabitCompletion(habit.id, !isCompletedToday, logId);
      } catch (error) {
        console.error("[HabitList] toggleHabitCompletion failed:", error);
      } finally {
        setPendingIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(habit.id);
          return newSet;
        });
      }
    });
  };

  const handleDelete = (id: string) => {
    setPendingIds((prev) => new Set(prev).add(id));
    startTransition(async () => {
      try {
        await deleteHabit(id);
      } catch (error) {
        console.error("[HabitList] deleteHabit failed:", error);
      } finally {
        setPendingIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }
    });
  };

  if (habits.length === 0) {
    return (
      <EmptyState
        icon={Hammer}
        title="Start building habits"
        description="Every habit starts with day one. Add something small — you can always adjust."
      />
    );
  }

  return (
    <div className="space-y-2">
      {habits.map((habit) => {
        const isCompletedToday = habit.logs.length > 0;
        const isPending = pendingIds.has(habit.id);
        const streak = streaks[habit.id] || 0;

        return (
          <div
            key={habit.id}
            className="flex items-center justify-between p-4 rounded-2xl glass-card spring-transition hover:bg-surface/80 group relative overflow-hidden"
          >
            {isCompletedToday && (
              <div 
                className="absolute inset-0 opacity-[0.03] transition-opacity duration-500" 
                style={{ backgroundColor: habit.color }} 
              />
            )}
            <button
              type="button"
              onClick={() => handleToggle(habit)}
              disabled={isPending}
              className="flex items-center gap-4 flex-1 min-w-0 text-left relative z-10"
              aria-label={`Mark ${habit.name} as ${isCompletedToday ? "incomplete" : "complete"}`}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full border-[2.5px] flex items-center justify-center spring-transition active:scale-90 ${
                  isPending ? "opacity-50" : ""
                }`}
                style={{
                  borderColor: habit.color,
                  backgroundColor: isCompletedToday ? habit.color : "transparent",
                  boxShadow: isCompletedToday ? `0 0 16px ${habit.color}40` : "none",
                }}
              >
                {isCompletedToday && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5 text-background"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>

              <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                <span
                  className={`font-medium text-sm md:text-base truncate spring-transition tracking-wide ${
                    isCompletedToday ? "text-muted-foreground line-through" : "text-foreground"
                  }`}
                >
                  {habit.name}
                </span>
                
                {streak > 0 && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-xs font-bold text-background px-2.5 py-1 rounded-lg" style={{ backgroundColor: habit.color }}>
                      {streak} 🔥
                    </span>
                  </div>
                )}
              </div>
            </button>

            <div className="ml-4 flex-shrink-0 relative z-10 flex items-center">
              <button
                onClick={() => onEdit(habit)}
                disabled={isPending}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-muted-foreground hover:text-primary rounded-xl hover:bg-primary/10 disabled:opacity-50"
                aria-label={`Edit ${habit.name}`}
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(habit.id)}
                disabled={isPending}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-muted-foreground hover:text-status-danger rounded-xl hover:bg-status-danger/10 disabled:opacity-50"
                aria-label={`Delete ${habit.name}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
