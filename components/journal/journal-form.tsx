"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createJournalEntrySchema } from "@/lib/validations/journal";
import { createJournalEntry } from "@/lib/actions/journal";
import { Button } from "@/components/ui/button";

type FormValues = z.infer<typeof createJournalEntrySchema>;

export function JournalForm() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(createJournalEntrySchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      try {
        await createJournalEntry(values);
        form.reset();
      } catch (error) {
        console.error("[JournalForm] createJournalEntry failed:", error);
        // Optional: show a toast or error message here if toast is available
      }
    });
  };

  const textareaClass =
    "flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm " +
    "ring-offset-background placeholder:text-muted-foreground " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 " +
    "disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4 bg-white p-6 rounded-lg shadow-sm border"
    >
      <div className="space-y-2">
        <label htmlFor="content" className="sr-only">
          Journal Entry
        </label>
        <textarea
          id="content"
          placeholder="What's on your mind?"
          className={textareaClass}
          {...form.register("content")}
        />
        {form.formState.errors.content && (
          <p className="text-sm text-red-500">
            {form.formState.errors.content.message}
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving…" : "Save Entry"}
        </Button>
      </div>
    </form>
  );
}
