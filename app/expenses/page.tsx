import { getExpenses, getExpenseCategories, getExpenseStats, getCategoryBreakdown } from "@/lib/queries/expenses";
import { getGoals } from "@/lib/queries/goals";
import { ExpensesPageContent } from "@/components/expenses/expenses-page-content";
import { ExpenseStats } from "@/components/expenses/expense-stats";
import { ExpenseCategoryBar } from "@/components/expenses/expense-category-bar";
import { PageHeader } from "@/components/layout/page-header";

export const dynamic = "force-dynamic";

export default async function ExpensesPage() {
  const [expenses, categories, stats, breakdown, goals] = await Promise.all([
    getExpenses(),
    getExpenseCategories(),
    getExpenseStats(),
    getCategoryBreakdown(),
    getGoals()
  ]);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 lg:p-10 space-y-8">
      <PageHeader
        title="Money"
        description="Track and understand your spending"
      />

      {/* Top Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ExpenseStats {...stats} />
        <ExpenseCategoryBar breakdown={breakdown} />
      </div>

      <ExpensesPageContent expenses={expenses} categories={categories} goals={goals} />
    </div>
  );
}
