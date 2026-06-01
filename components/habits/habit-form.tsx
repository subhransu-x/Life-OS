"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createHabitSchema } from "@/lib/validations/habits";
import { createHabit, updateHabit } from "@/lib/actions/habits";
import { Button } from "@/components/ui/button";
import type { Goal } from "@prisma/client";

type FormValues = z.infer<typeof createHabitSchema>;

export function HabitForm({ 
  goals = [], 
  initialData,
  onSuccess 
}: { 
  goals?: Goal[]; 
  initialData?: FormValues & { id: string };
  onSuccess?: () => void 
}) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(createHabitSchema),
    defaultValues: initialData || {
      name: "",
      color: "#10B981", // Default emerald (Build domain color)
      goalId: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      try {
        if (initialData?.id) {
          await updateHabit(initialData.id, values);
        } else {
          await createHabit(values);
        }
        
        if (!initialData) {
          form.reset({
            name: "",
            color: values.color, // Keep the selected color
            goalId: values.goalId,
          });
        }
        onSuccess?.();
      } catch (error) {
        console.error("[HabitForm] submit failed:", error);
      }
    });
  };

  const inputClass =
    "flex h-10 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground " +
    "ring-offset-background placeholder:text-muted-foreground " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 " +
    "disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4 bg-card p-6 rounded-xl border border-border"
    >
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_80px] gap-4 items-end">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium leading-none text-foreground">
            Habit Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="e.g. Read 10 pages"
            className={inputClass}
            {...form.register("name")}
          />
          {form.formState.errors.name && (
            <p className="text-sm text-status-danger">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="color" className="text-sm font-medium leading-none text-foreground">
            Color
          </label>
          <input
            id="color"
            type="color"
            className="flex h-10 w-full cursor-pointer rounded-lg border border-border bg-surface px-2 py-1"
            {...form.register("color")}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="goalId" className="text-sm font-medium leading-none text-foreground">
          Link to Goal <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <select
          id="goalId"
          className={inputClass}
          {...form.register("goalId")}
        >
          <option value="">No specific goal</option>
          {goals.map((g) => (
            <option key={g.id} value={g.id}>
              {g.title}
            </option>
          ))}
        </select>
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? (initialData ? "Saving…" : "Adding…") : (initialData ? "Save Changes" : "Add Habit")}
      </Button>
    </form>
  );
}
