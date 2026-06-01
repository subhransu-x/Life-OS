export function ExpenseStats({
  total,
  count,
  avgPerDay,
}: {
  total: number;
  count: number;
  avgPerDay: number;
}) {
  return (
    <div className="grid grid-cols-3 gap-4 bg-card border border-border p-4 rounded-xl">
      <div className="flex flex-col">
        <span className="text-xl md:text-2xl font-bold font-mono text-foreground tracking-tight">
          ₹{total.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
        </span>
        <span className="text-xs text-muted-foreground mt-1">Total</span>
      </div>
      <div className="flex flex-col border-l border-border pl-4">
        <span className="text-xl md:text-2xl font-bold font-mono text-foreground tracking-tight">
          {count}
        </span>
        <span className="text-xs text-muted-foreground mt-1">Count</span>
      </div>
      <div className="flex flex-col border-l border-border pl-4">
        <span className="text-xl md:text-2xl font-bold font-mono text-foreground tracking-tight">
          ₹{avgPerDay.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
        </span>
        <span className="text-xs text-muted-foreground mt-1">Avg/Day</span>
      </div>
    </div>
  );
}
