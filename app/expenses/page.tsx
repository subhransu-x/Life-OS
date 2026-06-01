import { getExpenses, getExpenseCategories } from "@/lib/queries/expenses";
import { ExpenseForm } from "@/components/expenses/expense-form";
import { ExpenseList } from "@/components/expenses/expense-list";

export const metadata = {
  title: "Expenses | Life OS",
};

export default async function ExpensesPage() {
  const rawExpenses = await getExpenses();
  const categories = await getExpenseCategories();

  // Serialize Decimal for client component
  const expenses = rawExpenses.map((exp) => ({
    ...exp,
    amount: Number(exp.amount),
  }));

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
        <p className="text-muted-foreground mt-2">Manage and track your expenses.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 items-start">
        <div className="space-y-6 order-2 lg:order-1">
          <h2 className="text-xl font-semibold">Expense History</h2>
          <ExpenseList expenses={expenses} />
        </div>
        
        <div className="space-y-6 order-1 lg:order-2">
          <h2 className="text-xl font-semibold">Add Expense</h2>
          {categories.length > 0 ? (
            <ExpenseForm categories={categories} />
          ) : (
            <div className="p-4 border rounded-lg bg-amber-50 text-amber-800 text-sm">
              Please create an expense category in the database before adding expenses.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
