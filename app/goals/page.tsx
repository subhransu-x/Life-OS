import { getGoals } from "@/lib/queries/goals";
import { GoalsPageContent } from "@/components/goals/goals-page-content";
import { PageHeader } from "@/components/layout/page-header";

export const dynamic = "force-dynamic";

export default async function GoalsPage() {
  const goals = await getGoals();

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 lg:p-10 space-y-8">
      <PageHeader
        title="Goals"
        description="Your guiding stars"
      />
      
      <GoalsPageContent goals={goals} />
    </div>
  );
}
