"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createHabitSchema } from "@/lib/validations/habits";
import { createHabit } from "@/lib/actions/habits";
import { Button } from "@/components/ui/button";

type FormValues = z.infer<typeof createHabitSchema>;

export function HabitForm() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(createHabitSchema),
    defaultValues: {
      name: "",
      color: "#3b82f6", // Default blue
    },
  });

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      try {
        await createHabit(values);
        form.reset({
          name: "",
          color: values.color, // Keep the selected color
        });
      } catch (error) {
        console.error("[HabitForm] createHabit failed:", error);
      }
    });
  };

  const inputClass =
    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm " +
    "ring-offset-background placeholder:text-muted-foreground " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 " +
    "disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4 bg-white p-6 rounded-lg shadow-sm border"
    >
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_80px] gap-4 items-end">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium leading-none">
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
            <p className="text-sm text-red-500">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="color" className="text-sm font-medium leading-none">
            Color
          </label>
          <input
            id="color"
            type="color"
            className="flex h-10 w-full cursor-pointer rounded-md border border-input bg-background px-2 py-1"
            {...form.register("color")}
          />
        </div>
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Adding…" : "Add Habit"}
      </Button>
    </form>
  );
}
