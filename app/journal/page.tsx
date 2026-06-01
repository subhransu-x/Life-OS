import { getJournalEntries } from "@/lib/queries/journal";
import { getGoals } from "@/lib/queries/goals";
import { JournalPageContent } from "@/components/journal/journal-page-content";
import { PageHeader } from "@/components/layout/page-header";

export const dynamic = "force-dynamic";

export default async function JournalPage() {
  const [entries, goals] = await Promise.all([
    getJournalEntries(),
    getGoals()
  ]);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 lg:p-10 space-y-8">
      <PageHeader
        title="Mind"
        description="A quiet space for your thoughts"
      />

      <JournalPageContent entries={entries} goals={goals} />
    </div>
  );
}
