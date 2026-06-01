import { db } from "@/lib/db";

export async function getDecks() {
  return await db.deck.findMany({
    include: {
      goal: true,
      _count: {
        select: { cards: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getDeckById(id: string) {
  return await db.deck.findUnique({
    where: { id },
    include: {
      goal: true,
      cards: {
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

export async function getCardsDueTodayCount() {
  const now = new Date();
  
  const dueCards = await db.flashcard.count({
    where: {
      nextReview: {
        lte: now,
      },
    },
  });

  return dueCards;
}

export async function getDueCardsForDeck(deckId: string) {
  const now = new Date();
  
  return await db.flashcard.findMany({
    where: {
      deckId,
      nextReview: {
        lte: now,
      },
    },
    orderBy: { nextReview: "asc" },
  });
}
