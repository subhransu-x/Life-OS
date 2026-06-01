import Link from "next/link";

type HabitSummaryProps = {
  total: number;
  completed: number;
  remaining: number;
};

export function HabitSummary({ total, completed, remaining }: HabitSummaryProps) {
  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Today&apos;s Habits</h3>
        <Link href="/habits" className="text-sm text-blue-600 hover:underline">
          View all
        </Link>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Completed</span>
          <span className="text-2xl font-bold text-green-600">{completed}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Remaining</span>
          <span className="text-2xl font-bold text-gray-900">{remaining}</span>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t text-sm text-gray-500">
        {total} total habit{total !== 1 ? "s" : ""} tracked
      </div>
    </div>
  );
}
