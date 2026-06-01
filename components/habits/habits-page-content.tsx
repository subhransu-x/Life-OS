"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { HabitForm } from "@/components/habits/habit-form";
import { HabitList } from "@/components/habits/habit-list";
import type { HabitWithLogs, HabitStreak } from "@/lib/types/habits";
import type { Goal } from "@prisma/client";

interface HabitsPageContentProps {
  habits: HabitWithLogs[];
  streaks: Record<string, HabitStreak>;
  goals: Goal[];
}

export function HabitsPageContent({ habits, streaks, goals }: HabitsPageContentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<HabitWithLogs | null>(null);

  const handleEdit = (habit: HabitWithLogs) => {
    setEditingHabit(habit);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => setEditingHabit(null), 200);
  };

  return (
    <>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-foreground">Today&apos;s Habits</h2>
          <Button 
            onClick={() => setIsOpen(true)} 
            className="rounded-full shadow-lg bg-emerald-500 hover:bg-emerald-600 hover:scale-105 active:scale-95 text-white gap-2 flex items-center h-9 px-4 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Habit</span>
          </Button>
        </div>

        <HabitList habits={habits} streaks={streaks} onEdit={handleEdit} />
      </div>

      <Dialog isOpen={isOpen} onClose={handleClose} title={editingHabit ? "Edit Habit" : "Add Habit"}>
        <HabitForm 
          goals={goals} 
          initialData={editingHabit ? {
            id: editingHabit.id,
            name: editingHabit.name,
            color: editingHabit.color,
            goalId: editingHabit.goalId || "",
          } : undefined}
          onSuccess={handleClose} 
        />
      </Dialog>

      {/* Floating Action Button for Mobile */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-24 right-6 z-40 w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all outline-none focus:ring-2 focus:ring-emerald-400"
        aria-label="Add Habit"
      >
        <Plus className="w-6 h-6" />
      </button>
    </>
  );
}
