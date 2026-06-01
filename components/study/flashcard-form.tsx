"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createFlashcardSchema } from "@/lib/validations/study";
import { createFlashcard, updateFlashcard } from "@/lib/actions/study";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type FormValues = z.infer<typeof createFlashcardSchema>;

export function FlashcardForm({
  deckId,
  initialData,
  onSuccess,
}: {
  deckId: string;
  initialData?: FormValues & { id: string };
  onSuccess?: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(createFlashcardSchema),
    defaultValues: initialData || {
      front: "",
      back: "",
      deckId,
    },
  });

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      try {
        if (initialData?.id) {
          await updateFlashcard(initialData.id, values);
          toast.success("Card updated");
        } else {
          await createFlashcard(values);
          toast.success("Card created");
        }
        if (!initialData) form.reset({ front: "", back: "", deckId }); // Keep deckId
        onSuccess?.();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to save card");
      }
    });
  };

  const inputClass =
    "flex w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground " +
    "ring-offset-background placeholder:text-muted-foreground " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 " +
    "disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Front (Question)</label>
        <textarea
          {...form.register("front")}
          placeholder="e.g. What is closure in JavaScript?"
          className={inputClass + " h-20 py-3 resize-none"}
        />
        {form.formState.errors.front && (
          <p className="text-sm text-status-danger">{form.formState.errors.front.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Back (Answer)</label>
        <textarea
          {...form.register("back")}
          placeholder="A function bundled together with its lexical environment..."
          className={inputClass + " h-24 py-3 resize-none"}
        />
        {form.formState.errors.back && (
          <p className="text-sm text-status-danger">{form.formState.errors.back.message}</p>
        )}
      </div>

      <div className="pt-4 flex justify-end gap-2">
        {onSuccess && (
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : initialData ? "Update Card" : "Add Card"}
        </Button>
      </div>
    </form>
  );
}
