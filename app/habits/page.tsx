import { getHabits, getHabitStreaks, getWeeklyHabitGrid } from "@/lib/queries/habits";
import { getGoals } from "@/lib/queries/goals";
import { HabitsPageContent } from "@/components/habits/habits-page-content";
import { HabitProgressHeader } from "@/components/habits/habit-progress-header";
import { HabitWeeklyGrid } from "@/components/habits/habit-weekly-grid";
import { PageHeader } from "@/components/layout/page-header";

export const dynamic = "force-dynamic";

interface HabitWithLogsCount {
  logs: { id: string }[];
}

export default async function HabitsPage() {
  const [habits, streaks, weeklyGrid, goals] = await Promise.all([
    getHabits(),
    getHabitStreaks(),
    getWeeklyHabitGrid(),
    getGoals()
  ]);

  const total = habits.length;
  const completed = habits.filter((h: HabitWithLogsCount) => h.logs.length > 0).length;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 lg:p-10 space-y-8">
      <PageHeader
        title="Build"
        description="Daily actions that compound over time"
      />

      {/* Top Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <HabitProgressHeader total={total} completed={completed} />
        <HabitWeeklyGrid habits={weeklyGrid} />
      </div>

      <HabitsPageContent habits={habits} streaks={streaks} goals={goals} />
    </div>
  );
}
