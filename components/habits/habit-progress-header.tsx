export function HabitProgressHeader({
  total,
  completed,
}: {
  total: number;
  completed: number;
}) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="bg-card border border-border p-6 rounded-xl space-y-4">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-sm font-medium text-foreground">Today&apos;s Progress</h2>
          <p className="text-xs text-muted-foreground mt-1">
            {completed} of {total} completed
          </p>
        </div>
        <div className="text-2xl font-bold font-mono tracking-tight text-foreground">
          {percentage}%
        </div>
      </div>

      <div className="w-full h-3 bg-surface rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${percentage}%`,
            backgroundColor: "var(--domain-build)",
          }}
        />
      </div>
    </div>
  );
}
