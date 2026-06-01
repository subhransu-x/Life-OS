import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { ChevronLeft, Calendar, Hammer, Wallet, BookOpen } from "lucide-react";
import { getGoalById } from "@/lib/queries/goals";
import { GoalProgressUpdater } from "@/components/goals/goal-progress-updater";

interface HabitWithLogs {
  id: string;
  name: string;
  color: string;
  logs: { id: string }[];
}

interface JournalEntryType {
  id: string;
  content: string;
  createdAt: Date;
}

interface ExpenseWithCategory {
  id: string;
  amount: { toString: () => string };
  note: string | null;
  category: { name: string };
}

export const dynamic = "force-dynamic";

export default async function GoalDetailPage({ params }: { params: { id: string } }) {
  const goal = await getGoalById(params.id);

  if (!goal) {
    notFound();
  }

  let domainColor = "var(--primary)";
  if (goal.domain === "Build") domainColor = "var(--domain-build)";
  if (goal.domain === "Money") domainColor = "var(--domain-money)";
  if (goal.domain === "Mind") domainColor = "var(--domain-mind)";

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link 
          href="/goals" 
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Goals
        </Link>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: domainColor }} />
            <span className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
              {goal.domain} Domain
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
            {goal.title}
          </h1>
          {goal.description && (
            <p className="text-muted-foreground text-base max-w-2xl">
              {goal.description}
            </p>
          )}
        </div>

        {goal.targetDate && (
          <div className="flex items-center gap-2 text-sm text-foreground/80 bg-surface w-fit px-3 py-1.5 rounded-lg border border-border/50">
            <Calendar className="w-4 h-4 text-primary" />
            <span>Target: <strong className="font-semibold">{format(new Date(goal.targetDate), "MMMM yyyy")}</strong></span>
          </div>
        )}
      </div>

      {/* Progress Interactive Section */}
      <GoalProgressUpdater goalId={goal.id} initialProgress={goal.progress} domainColor={domainColor} />

      {/* Connected Entities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-border/40">
        {/* Habits */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-foreground font-semibold">
            <Hammer className="w-5 h-5" style={{ color: "var(--domain-build)" }} />
            <h3>Connected Habits</h3>
          </div>
          <div className="space-y-3">
            {goal.habits.length === 0 ? (
              <p className="text-sm text-muted-foreground">No habits linked yet.</p>
            ) : (
              goal.habits.map((h: HabitWithLogs) => (
                <div key={h.id} className="p-3 bg-card rounded-lg border border-border/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: h.color }} />
                    <span className="text-sm font-medium">{h.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{h.logs.length} logs</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Expenses & Journals combined for layout */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <BookOpen className="w-5 h-5" style={{ color: "var(--domain-mind)" }} />
              <h3>Connected Journals</h3>
            </div>
            <div className="space-y-3">
              {goal.journals.length === 0 ? (
                <p className="text-sm text-muted-foreground">No journals linked yet.</p>
              ) : (
                goal.journals.slice(0, 3).map((j: JournalEntryType) => (
                  <div key={j.id} className="p-3 bg-card rounded-lg border border-border/50">
                    <p className="text-sm text-foreground line-clamp-2 font-serif">{j.content}</p>
                    <p className="text-xs text-muted-foreground mt-2">{format(new Date(j.createdAt), "MMM d")}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <Wallet className="w-5 h-5" style={{ color: "var(--domain-money)" }} />
              <h3>Connected Expenses</h3>
            </div>
            <div className="space-y-3">
              {goal.expenses.length === 0 ? (
                <p className="text-sm text-muted-foreground">No expenses linked yet.</p>
              ) : (
                goal.expenses.slice(0, 3).map((e: ExpenseWithCategory) => (
                  <div key={e.id} className="p-3 bg-card rounded-lg border border-border/50 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">{e.category.name}</p>
                      <p className="text-xs text-muted-foreground">{e.note || "No note"}</p>
                    </div>
                    <span className="text-sm font-semibold tabular-nums text-status-danger">-${e.amount.toString()}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
