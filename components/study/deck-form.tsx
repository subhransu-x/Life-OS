"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createDeckSchema } from "@/lib/validations/study";
import { createDeck, updateDeck } from "@/lib/actions/study";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Goal } from "@prisma/client";

type FormValues = z.infer<typeof createDeckSchema>;

export function DeckForm({
  goals = [],
  initialData,
  onSuccess,
}: {
  goals?: Goal[];
  initialData?: FormValues & { id: string };
  onSuccess?: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(createDeckSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      color: "var(--domain-mind)",
      goalId: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      try {
        if (initialData?.id) {
          await updateDeck(initialData.id, values);
          toast.success("Deck updated successfully");
        } else {
          await createDeck(values);
          toast.success("Deck created successfully");
        }
        if (!initialData) form.reset();
        onSuccess?.();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to save deck");
      }
    });
  };

  const inputClass =
    "flex h-10 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground " +
    "ring-offset-background placeholder:text-muted-foreground " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 " +
    "disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Deck Name</label>
        <input
          {...form.register("name")}
          placeholder="e.g. React Patterns"
          className={inputClass}
        />
        {form.formState.errors.name && (
          <p className="text-sm text-status-danger">{form.formState.errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Description <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <textarea
          {...form.register("description")}
          placeholder="What is this deck about?"
          className={inputClass + " h-20 py-3"}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Deck Color</label>
          <div className="flex gap-2">
            {[
              "var(--primary)",
              "var(--domain-build)",
              "var(--domain-money)",
              "var(--domain-mind)",
              "#ec4899", // Pink
              "#f59e0b", // Amber
            ].map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => form.setValue("color", color)}
                className={`w-8 h-8 rounded-full transition-all ${
                  form.watch("color") === color
                    ? "ring-2 ring-foreground ring-offset-2 ring-offset-background scale-110"
                    : "opacity-70 hover:opacity-100 hover:scale-105"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {goals.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Linked Goal (Optional)</label>
            <select {...form.register("goalId")} className={inputClass}>
              <option value="">No goal</option>
              {goals.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="pt-4 flex justify-end gap-2">
        {onSuccess && (
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : initialData ? "Update Deck" : "Create Deck"}
        </Button>
      </div>
    </form>
  );
}
