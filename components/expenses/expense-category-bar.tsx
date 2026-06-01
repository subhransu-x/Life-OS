type CategoryBreakdown = {
  id: string;
  name: string;
  color: string;
  amount: number;
  percentage: number;
};

export function ExpenseCategoryBar({
  breakdown,
}: {
  breakdown: CategoryBreakdown[];
}) {
  if (breakdown.length === 0) return null;

  return (
    <div className="bg-card border border-border p-5 rounded-xl space-y-4">
      <h3 className="text-sm font-medium text-foreground">Category Breakdown</h3>
      
      {/* Stacked Bar */}
      <div className="w-full h-3 flex rounded-full overflow-hidden">
        {breakdown.map((cat) => (
          <div
            key={cat.id}
            style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
            className="h-full transition-all duration-500 ease-out"
            title={`${cat.name} (${cat.percentage}%)`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {breakdown.slice(0, 4).map((cat) => (
          <div key={cat.id} className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: cat.color }}
            />
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {cat.name} <span className="font-medium text-foreground/80">{cat.percentage}%</span>
            </span>
          </div>
        ))}
        {breakdown.length > 4 && (
          <div className="text-xs text-muted-foreground/60 flex items-center">
            +{breakdown.length - 4} more
          </div>
        )}
      </div>
    </div>
  );
}
