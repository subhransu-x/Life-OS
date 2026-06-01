import {
  getDashboardHabitSummary,
  getDashboardExpenseSummary,
  getDashboardJournalSummary,
} from "@/lib/queries/dashboard";
import { QuickNavigation } from "@/components/dashboard/quick-navigation";
import { HabitSummary } from "@/components/dashboard/habit-summary";
import { ExpenseSummary } from "@/components/dashboard/expense-summary";
import { JournalSummary } from "@/components/dashboard/journal-summary";

export const metadata = {
  title: "Dashboard | Life OS",
  description: "Your life operating system.",
};

export default async function DashboardPage() {
  const [habitSummary, expenseSummary, journalSummary] = await Promise.all([
    getDashboardHabitSummary(),
    getDashboardExpenseSummary(),
    getDashboardJournalSummary(),
  ]);

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back to Life OS. Here&apos;s your overview.
        </p>
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-4">Quick Navigation</h2>
        <QuickNavigation />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <HabitSummary {...habitSummary} />
          <ExpenseSummary {...expenseSummary} />
          <JournalSummary {...journalSummary} />
        </div>
      </section>
    </div>
  );
}
