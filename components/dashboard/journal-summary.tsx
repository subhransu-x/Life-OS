import Link from "next/link";

type JournalSummaryProps = {
  total: number;
  recent: Array<{
    id: string;
    content: string;
    createdAt: Date;
  }>;
};

export function JournalSummary({ total, recent }: JournalSummaryProps) {
  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Journal</h3>
        <Link href="/journal" className="text-sm text-blue-600 hover:underline">
          Write
        </Link>
      </div>

      {recent.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-500 py-6">
          No entries yet. Start writing!
        </div>
      ) : (
        <div className="flex-1 space-y-3">
          {recent.map((entry) => (
            <div key={entry.id} className="text-sm border-b pb-2 last:border-0 last:pb-0">
              <div className="text-gray-500 text-xs mb-1">
                {new Date(entry.createdAt).toLocaleDateString("en-IN", {
                  month: "short",
                  day: "numeric",
                })}
              </div>
              <div className="text-gray-800 line-clamp-2">
                {entry.content}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 pt-4 border-t text-sm text-gray-500">
        {total} total entr{total !== 1 ? "ies" : "y"}
      </div>
    </div>
  );
}
