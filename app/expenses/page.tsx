import { getExpenses, getExpenseCategories } from "@/lib/queries/expenses";
import { ExpenseForm } from "@/components/expenses/expense-form";
import { ExpenseList } from "@/components/expenses/expense-list";
import type { ExpenseWithCategory } from "@/lib/types/expenses";

export const metadata = {
  title: "Expenses | Life OS",
  description: "Track and manage your daily expenses.",
};

export default async function ExpensesPage() {
  const rawExpenses = await getExpenses();
  const categories = await getExpenseCategories();

  // Serialize Prisma Decimal → number before passing to Client Components
  const expenses: ExpenseWithCategory[] = rawExpenses.map((exp) => ({
    ...exp,
    amount: Number(exp.amount),
  }));

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
        <p className="text-muted-foreground mt-1">
          Manage and track your expenses.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
        {/* Expense history — left column on desktop */}
        <div className="space-y-4 order-2 lg:order-1">
          <h2 className="text-xl font-semibold">History</h2>
          <ExpenseList expenses={expenses} />
        </div>

        {/* Add expense form — right column on desktop, top on mobile */}
        <div className="space-y-4 order-1 lg:order-2">
          <h2 className="text-xl font-semibold">Add Expense</h2>
          <ExpenseForm categories={categories} />
        </div>
      </div>
    </div>
  );
}
