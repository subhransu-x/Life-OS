import { getJournalEntries } from "@/lib/queries/journal";
import { JournalForm } from "@/components/journal/journal-form";
import { JournalList } from "@/components/journal/journal-list";

export const metadata = {
  title: "Journal | Life OS",
  description: "A simple space for your thoughts.",
};

export default async function JournalPage() {
  const entries = await getJournalEntries();

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Journal</h1>
        <p className="text-muted-foreground mt-1">
          A simple space for your thoughts.
        </p>
      </div>

      <div className="space-y-8">
        {/* Write entry form */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">New Entry</h2>
          <JournalForm />
        </section>

        {/* History */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Previous Entries</h2>
          <JournalList entries={entries} />
        </section>
      </div>
    </div>
  );
}
