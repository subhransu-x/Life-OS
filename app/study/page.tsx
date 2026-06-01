import { getDecks, getCardsDueTodayCount } from "@/lib/queries/study";
import { getGoals } from "@/lib/queries/goals";
import { StudyClientPage } from "@/components/study/study-client-page";

export const metadata = {
  title: "Study Vault - Life OS",
};

export default async function StudyPage() {
  const [decks, goals, dueCardsCount] = await Promise.all([
    getDecks(),
    getGoals(),
    getCardsDueTodayCount(),
  ]);

  return <StudyClientPage decks={decks} goals={goals} dueCardsCount={dueCardsCount} />;
}

