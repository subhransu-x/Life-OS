"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createExpenseSchema } from "@/lib/validations/expenses";
import { createExpense, updateExpense } from "@/lib/actions/expenses";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { ExpenseCategory } from "@/lib/types/expenses";
import type { Goal } from "@prisma/client";

// Client-side form uses string for date input; server action receives Date via coerce
const formSchema = createExpenseSchema.extend({
  date: z.string().min(1, { message: "Date is required" }),
});

type FormValues = z.infer<typeof formSchema>;

export function ExpenseForm({
  categories,
  goals = [],
  initialData,
  onSuccess,
}: {
  categories: ExpenseCategory[];
  goals?: Goal[];
  initialData?: FormValues & { id: string };
  onSuccess?: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      amount: undefined,
      note: "",
      date: new Date().toISOString().split("T")[0],
      categoryId: "",
      goalId: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      try {
        if (initialData?.id) {
          await updateExpense(initialData.id, {
            ...values,
            date: new Date(values.date),
          });
          toast.success("Expense updated successfully");
        } else {
          await createExpense({
            ...values,
            date: new Date(values.date),
          });
          toast.success("Expense added successfully");
        }
        if (!initialData) {
          form.reset({
            amount: undefined,
            note: "",
            date: new Date().toISOString().split("T")[0],
            categoryId: values.categoryId, // keep last selected category for convenience
            goalId: values.goalId,
          });
        }
        onSuccess?.();
      } catch (error) {
        console.error("[ExpenseForm] submit failed:", error);
        const message =
          error instanceof Error ? error.message : "Failed to save expense";
        toast.error(message);
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Amount */}
        <div className="space-y-2">
          <label htmlFor="amount" className="text-sm font-medium leading-none text-foreground">
            Amount
          </label>
          <input
            id="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            className={inputClass}
            {...form.register("amount", { valueAsNumber: true })}
          />
          {form.formState.errors.amount && (
            <p className="text-sm text-status-danger">
              {form.formState.errors.amount.message}
            </p>
          )}
        </div>

        {/* Date */}
        <div className="space-y-2">
          <label htmlFor="date" className="text-sm font-medium leading-none text-foreground">
            Date
          </label>
          <input
            id="date"
            type="date"
            className={inputClass}
            {...form.register("date")}
          />
          {form.formState.errors.date && (
            <p className="text-sm text-status-danger">
              {form.formState.errors.date.message}
            </p>
          )}
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label htmlFor="categoryId" className="text-sm font-medium leading-none text-foreground">
            Category
          </label>
          <select
            id="categoryId"
            className={inputClass}
            {...form.register("categoryId")}
          >
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {form.formState.errors.categoryId && (
            <p className="text-sm text-status-danger">
              {form.formState.errors.categoryId.message}
            </p>
          )}
        </div>

        {/* Note */}
        <div className="space-y-2">
          <label htmlFor="note" className="text-sm font-medium leading-none text-foreground">
            Note <span className="text-muted-foreground font-normal">(optional)</span>
          </label>
          <input
            id="note"
            type="text"
            placeholder="e.g. Lunch at work"
            className={inputClass}
            {...form.register("note")}
          />
        </div>

        {/* Goal Selection */}
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
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? (initialData ? "Saving…" : "Adding…") : (initialData ? "Save Changes" : "Add Expense")}
      </Button>
    </form>
  );
}
