"use client";

import { useState, useTransition } from "react";
import { updateGoalProgress } from "@/lib/actions/goals";
import { toast } from "sonner";

export function GoalProgressUpdater({ 
  goalId, 
  initialProgress, 
  domainColor 
}: { 
  goalId: string; 
  initialProgress: number; 
  domainColor: string;
}) {
  const [progress, setProgress] = useState(initialProgress);
  const [isPending, startTransition] = useTransition();
  
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProgress(Number(e.target.value));
  };

  const saveProgress = () => {
    if (progress === initialProgress) return;
    
    startTransition(async () => {
      try {
        await updateGoalProgress(goalId, progress);
        toast.success("Progress updated");
      } catch (e) {
        toast.error("Failed to update progress");
        setProgress(initialProgress);
      }
    });
  };

  return (
    <div className="bg-surface-elevated/40 border border-border/50 p-6 rounded-2xl space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-foreground">Goal Progress</h3>
        <span 
          className="text-3xl font-heading font-bold tabular-nums"
          style={{ color: domainColor }}
        >
          {progress}%
        </span>
      </div>

      <div className="space-y-4">
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleProgressChange}
          onMouseUp={saveProgress}
          onTouchEnd={saveProgress}
          disabled={isPending}
          className="w-full h-3 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
          style={{
            background: `linear-gradient(to right, ${domainColor} ${progress}%, var(--surface) ${progress}%)`,
          }}
        />
        <div className="flex justify-between text-xs text-muted-foreground font-medium uppercase tracking-wider">
          <span>Started</span>
          <span>Halfway</span>
          <span>Completed</span>
        </div>
      </div>
    </div>
  );
}
