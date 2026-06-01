import { notFound } from "next/navigation";
import { getDeckById, getDueCardsForDeck } from "@/lib/queries/study";
import { DeckDetailClientPage } from "@/components/study/deck-detail-client-page";

export default async function DeckDetailPage({ params }: { params: { id: string } }) {
  const deck = await getDeckById(params.id);
  
  if (!deck) {
    notFound();
  }

  const dueCards = await getDueCardsForDeck(deck.id);

  return <DeckDetailClientPage deck={deck} dueCards={dueCards} />;
}

