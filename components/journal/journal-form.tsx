"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createJournalEntrySchema } from "@/lib/validations/journal";
import { createJournalEntry, updateJournalEntry } from "@/lib/actions/journal";
import { Button } from "@/components/ui/button";
import type { Goal } from "@prisma/client";

type FormValues = z.infer<typeof createJournalEntrySchema>;

export function JournalForm({ 
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
    resolver: zodResolver(createJournalEntrySchema),
    defaultValues: initialData || {
      content: "",
      goalId: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      try {
        if (initialData?.id) {
          await updateJournalEntry(initialData.id, values);
        } else {
          await createJournalEntry(values);
        }
        if (!initialData) {
          form.reset();
        }
        onSuccess?.();
      } catch (error) {
        console.error("[JournalForm] submit failed:", error);
      }
    });
  };

  const content = form.watch("content");
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4 glass-card p-6 md:p-8 rounded-3xl"
    >
      <div className="space-y-2">
        <label htmlFor="content" className="sr-only">
          Journal Entry
        </label>
        <textarea
          id="content"
          placeholder="What's on your mind?"
          className={
            "flex min-h-[300px] w-full rounded-2xl bg-transparent border-0 px-2 py-3 text-base md:text-lg text-foreground font-serif tracking-wide " +
            "ring-offset-background placeholder:text-muted-foreground/40 " +
            "focus-visible:outline-none focus-visible:ring-0 " +
            "disabled:cursor-not-allowed disabled:opacity-50 resize-none leading-relaxed transition-all"
          }
          {...form.register("content")}
        />
        {form.formState.errors.content && (
          <p className="text-sm text-status-danger">
            {form.formState.errors.content.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="goalId" className="text-sm font-medium leading-none text-foreground">
          Link to Goal <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <select
          id="goalId"
          className="flex h-10 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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

      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground tabular-nums">
          {wordCount} word{wordCount !== 1 ? "s" : ""}
        </span>
        <Button type="submit" disabled={isPending}>
          {isPending ? (initialData ? "Saving…" : "Saving…") : (initialData ? "Save Changes" : "Save Entry")}
        </Button>
      </div>
    </form>
  );
}
