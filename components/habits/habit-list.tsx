"use client";

import { useTransition, useState } from "react";
import { deleteHabit, toggleHabitCompletion } from "@/lib/actions/habits";
import { Button } from "@/components/ui/button";
import { Habit, HabitLog } from "@prisma/client";

type HabitWithLogs = Habit & {
  logs: HabitLog[];
};

export function HabitList({ habits }: { habits: HabitWithLogs[] }) {
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
      <div className="py-12 text-center border rounded-lg bg-gray-50 text-gray-500">
        No habits yet. Start building good routines!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {habits.map((habit) => {
        const isCompletedToday = habit.logs.length > 0;
        const isPending = pendingIds.has(habit.id);

        return (
          <div
            key={habit.id}
            className={`flex items-center justify-between p-4 border rounded-lg shadow-sm transition-colors ${
              isCompletedToday ? "bg-gray-50" : "bg-white"
            }`}
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <button
                type="button"
                onClick={() => handleToggle(habit)}
                disabled={isPending}
                aria-label={`Mark ${habit.name} as ${isCompletedToday ? "incomplete" : "complete"}`}
                className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors disabled:opacity-50 ${
                  isCompletedToday ? "text-white" : "bg-transparent"
                }`}
                style={{
                  borderColor: habit.color,
                  backgroundColor: isCompletedToday ? habit.color : "transparent",
                }}
              >
                {isCompletedToday && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
              
              <span
                className={`font-medium truncate ${
                  isCompletedToday ? "text-gray-400 line-through" : "text-gray-900"
                }`}
              >
                {habit.name}
              </span>
            </div>

            <div className="ml-4 flex-shrink-0">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(habit.id)}
                disabled={isPending}
                aria-label={`Delete ${habit.name}`}
              >
                Delete
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
