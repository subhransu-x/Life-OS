type WeeklyGridHabit = {
  id: string;
  name: string;
  color: string;
  completions: boolean[];
};

export function HabitWeeklyGrid({ habits }: { habits: WeeklyGridHabit[] }) {
  if (habits.length === 0) return null;

  const days = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <div className="bg-card border border-border p-5 rounded-xl space-y-4">
      <h3 className="text-sm font-medium text-foreground">This Week</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr>
              <th className="font-medium text-muted-foreground pb-3 w-1/3 min-w-[100px]">Habit</th>
              {days.map((day, i) => (
                <th key={i} className="font-medium text-muted-foreground pb-3 text-center w-8">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {habits.map((habit) => (
              <tr key={habit.id} className="group hover:bg-surface-elevated/20 transition-colors">
                <td className="py-2.5 pr-2 font-medium text-foreground truncate max-w-[120px]" title={habit.name}>
                  {habit.name}
                </td>
                {habit.completions.map((completed, i) => (
                  <td key={i} className="py-2.5 text-center">
                    <div className="flex justify-center">
                      <div
                        className={`w-3 h-3 rounded-full border border-border transition-colors ${
                          completed ? "border-transparent" : "bg-transparent"
                        }`}
                        style={completed ? { backgroundColor: habit.color, boxShadow: `0 0 6px ${habit.color}40` } : {}}
                      />
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
