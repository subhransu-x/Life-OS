import { getExpenses, getExpenseCategories, getExpenseStats, getCategoryBreakdown } from "@/lib/queries/expenses";
import { getGoals } from "@/lib/queries/goals";
import { MoneyOsWrapper } from "@/components/expenses/money-os-wrapper";
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

      <MoneyOsWrapper
        expenses={expenses}
        categories={categories}
        stats={stats}
        breakdown={breakdown}
        goals={goals}
      />
    </div>
  );
}
