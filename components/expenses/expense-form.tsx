"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createExpenseSchema } from "@/lib/validations/expenses";
import { createExpense } from "@/lib/actions/expenses";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { ExpenseCategory } from "@/lib/types/expenses";

// Client-side form uses string for date input; server action receives Date via coerce
const formSchema = createExpenseSchema.extend({
  date: z.string().min(1, { message: "Date is required" }),
});

type FormValues = z.infer<typeof formSchema>;

export function ExpenseForm({ categories }: { categories: ExpenseCategory[] }) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: undefined,
      note: "",
      date: new Date().toISOString().split("T")[0],
      categoryId: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      try {
        await createExpense({
          ...values,
          date: new Date(values.date),
        });
        toast.success("Expense added successfully");
        form.reset({
          amount: undefined,
          note: "",
          date: new Date().toISOString().split("T")[0],
          categoryId: values.categoryId, // keep last selected category for convenience
        });
      } catch (error) {
        console.error("[ExpenseForm] createExpense failed:", error);
        const message =
          error instanceof Error ? error.message : "Failed to add expense";
        toast.error(message);
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Amount */}
        <div className="space-y-2">
          <label htmlFor="amount" className="text-sm font-medium leading-none">
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
            <p className="text-sm text-red-500">
              {form.formState.errors.amount.message}
            </p>
          )}
        </div>

        {/* Date */}
        <div className="space-y-2">
          <label htmlFor="date" className="text-sm font-medium leading-none">
            Date
          </label>
          <input
            id="date"
            type="date"
            className={inputClass}
            {...form.register("date")}
          />
          {form.formState.errors.date && (
            <p className="text-sm text-red-500">
              {form.formState.errors.date.message}
            </p>
          )}
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label htmlFor="categoryId" className="text-sm font-medium leading-none">
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
            <p className="text-sm text-red-500">
              {form.formState.errors.categoryId.message}
            </p>
          )}
        </div>

        {/* Note */}
        <div className="space-y-2">
          <label htmlFor="note" className="text-sm font-medium leading-none">
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
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Adding…" : "Add Expense"}
      </Button>
    </form>
  );
}
