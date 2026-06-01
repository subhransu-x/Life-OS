import Link from "next/link";

type ExpenseSummaryProps = {
  total: number;
  count: number;
};

export function ExpenseSummary({ total, count }: ExpenseSummaryProps) {
  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">This Month&apos;s Spend</h3>
        <Link href="/expenses" className="text-sm text-blue-600 hover:underline">
          View all
        </Link>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <div className="text-4xl font-bold text-gray-900 mb-2">
          ₹{total.toFixed(2)}
        </div>
        <div className="text-gray-500">
          Across {count} transaction{count !== 1 ? "s" : ""}
        </div>
      </div>
    </div>
  );
}
