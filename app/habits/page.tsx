import { getHabits } from "@/lib/queries/habits";
import { HabitForm } from "@/components/habits/habit-form";
import { HabitList } from "@/components/habits/habit-list";

export const metadata = {
  title: "Habits | Life OS",
  description: "Track your daily habits.",
};

export default async function HabitsPage() {
  const habits = await getHabits();

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Habits</h1>
        <p className="text-muted-foreground mt-1">
          Build good routines and track your daily progress.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
        {/* Habit list — left column on desktop */}
        <div className="space-y-4 order-2 lg:order-1">
          <h2 className="text-xl font-semibold">Today&apos;s Habits</h2>
          <HabitList habits={habits} />
        </div>

        {/* Add habit form — right column on desktop, top on mobile */}
        <div className="space-y-4 order-1 lg:order-2">
          <h2 className="text-xl font-semibold">New Habit</h2>
          <HabitForm />
        </div>
      </div>
    </div>
  );
}
