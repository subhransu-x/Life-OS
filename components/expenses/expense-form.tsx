"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createExpense } from "@/lib/actions/expenses";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const formSchema = z.object({
  amount: z.number().positive({ message: "Amount must be positive" }),
  note: z.string().optional(),
  date: z.string().min(1, { message: "Date is required" }), // Using string for initial input
  categoryId: z.string().min(1, { message: "Category is required" }),
});

type Category = {
  id: string;
  name: string;
  color: string;
};

export function ExpenseForm({ categories }: { categories: Category[] }) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: undefined, // Let the input be empty initially if number is not provided
      note: "",
      date: new Date().toISOString().split("T")[0],
      categoryId: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      try {
        await createExpense({
          ...values,
          date: new Date(values.date), // Convert date string back to Date for the action
        });
        toast.success("Expense added successfully");
        form.reset({ ...values, amount: undefined, note: "" });
      } catch (error) {
        toast.error("Failed to add expense");
      }
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-lg shadow-sm border">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Amount</label>
          <input 
            type="number" 
            step="0.01"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            {...form.register("amount", { valueAsNumber: true })} 
          />
          {form.formState.errors.amount && (
            <p className="text-sm text-red-500">{form.formState.errors.amount.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Date</label>
          <input 
            type="date"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            {...form.register("date")} 
          />
          {form.formState.errors.date && (
            <p className="text-sm text-red-500">{form.formState.errors.date.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Category</label>
          <select 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            {...form.register("categoryId")}
          >
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {form.formState.errors.categoryId && (
            <p className="text-sm text-red-500">{form.formState.errors.categoryId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Note</label>
          <input 
            type="text" 
            placeholder="Optional note"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            {...form.register("note")} 
          />
        </div>
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Adding..." : "Add Expense"}
      </Button>
    </form>
  );
}
