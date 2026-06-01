"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createGoalSchema } from "@/lib/validations/goals";
import { createGoal } from "@/lib/actions/goals";
import { Button } from "@/components/ui/button";

type FormValues = z.infer<typeof createGoalSchema>;

export function GoalForm({ onSuccess }: { onSuccess?: () => void }) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createGoalSchema) as any,
    defaultValues: {
      title: "",
      description: "",
      domain: "Build", // Default domain
      targetDate: undefined,
    },
  });

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      try {
        await createGoal(values);
        form.reset();
        onSuccess?.();
      } catch (error) {
        console.error("[GoalForm] createGoal failed:", error);
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
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium leading-none text-foreground">
          Goal Title
        </label>
        <input
          id="title"
          type="text"
          placeholder="e.g. Become Full Stack Developer"
          className={inputClass}
          {...form.register("title")}
        />
        {form.formState.errors.title && (
          <p className="text-sm text-status-danger">
            {form.formState.errors.title.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium leading-none text-foreground">
          Description <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <textarea
          id="description"
          placeholder="Why is this important to you?"
          className={inputClass + " h-20 py-3"}
          {...form.register("description")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="domain" className="text-sm font-medium leading-none text-foreground">
            Domain
          </label>
          <select
            id="domain"
            className={inputClass}
            {...form.register("domain")}
          >
            <option value="Build">Build (Habits/Skills)</option>
            <option value="Money">Money (Finances)</option>
            <option value="Mind">Mind (Mental/Journal)</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="targetDate" className="text-sm font-medium leading-none text-foreground">
            Target Date <span className="text-muted-foreground font-normal">(optional)</span>
          </label>
          <input
            id="targetDate"
            type="date"
            className={inputClass}
            {...form.register("targetDate")}
          />
        </div>
      </div>

      <Button type="submit" disabled={isPending} className="w-full mt-2">
        {isPending ? "Creating…" : "Create Goal"}
      </Button>
    </form>
  );
}
