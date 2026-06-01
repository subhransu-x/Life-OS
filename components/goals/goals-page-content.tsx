"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { GoalForm } from "@/components/goals/goal-form";
import { GoalList } from "@/components/goals/goal-list";

// Extend Goal with the count properties returned from our query
export interface GoalWithCounts {
  id: string;
  title: string;
  description: string | null;
  domain: string;
  progress: number;
  targetDate: Date | null;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    habits: number;
    expenses: number;
    journals: number;
  };
}

interface GoalsPageContentProps {
  goals: GoalWithCounts[];
}

export function GoalsPageContent({ goals }: GoalsPageContentProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-foreground">Active Goals</h2>
          <Button 
            onClick={() => setIsOpen(true)} 
            className="rounded-full shadow-lg bg-primary hover:bg-primary/90 hover:scale-105 active:scale-95 text-primary-foreground gap-2 flex items-center h-9 px-4 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Goal</span>
          </Button>
        </div>

        <GoalList goals={goals} />
      </div>

      <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)} title="Create New Goal">
        <GoalForm onSuccess={() => setIsOpen(false)} />
      </Dialog>
    </>
  );
}
