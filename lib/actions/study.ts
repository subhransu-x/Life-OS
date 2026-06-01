"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { 
  createDeckSchema, 
  updateDeckSchema,
  createFlashcardSchema,
  updateFlashcardSchema,
  reviewFlashcardSchema 
} from "@/lib/validations/study";
import { runProgressionUpdate } from "@/lib/queries/progression";
import { addXP } from "@/lib/queries/gamification";

// --- DECKS ---

export async function createDeck(formData: {
  name: string;
  description?: string;
  color: string;
  goalId?: string;
}) {
  const result = createDeckSchema.safeParse(formData);

  if (!result.success) {
    throw new Error(result.error.issues.map(e => e.message).join(", "));
  }

  const deck = await db.deck.create({
    data: {
      name: result.data.name,
      description: result.data.description,
      color: result.data.color,
      goalId: result.data.goalId || null,
    },
  });

  revalidatePath("/study");
  return deck;
}

export async function updateDeck(id: string, formData: {
  name: string;
  description?: string;
  color: string;
  goalId?: string;
}) {
  const result = updateDeckSchema.safeParse({ id, ...formData });

  if (!result.success) {
    throw new Error(result.error.issues.map(e => e.message).join(", "));
  }

  const deck = await db.deck.update({
    where: { id },
    data: {
      name: result.data.name,
      description: result.data.description,
      color: result.data.color,
      goalId: result.data.goalId || null,
    },
  });

  revalidatePath("/study");
  revalidatePath(`/study/${id}`);
  return deck;
}

export async function deleteDeck(id: string) {
  await db.deck.delete({
    where: { id },
  });
  revalidatePath("/study");
}

// --- FLASHCARDS ---

export async function createFlashcard(formData: {
  front: string;
  back: string;
  deckId: string;
}) {
  const result = createFlashcardSchema.safeParse(formData);

  if (!result.success) {
    throw new Error(result.error.issues.map(e => e.message).join(", "));
  }

  const card = await db.flashcard.create({
    data: result.data,
  });

  revalidatePath(`/study/${result.data.deckId}`);
  return card;
}

export async function updateFlashcard(id: string, formData: {
  front: string;
  back: string;
  deckId: string;
}) {
  const result = updateFlashcardSchema.safeParse({ id, ...formData });

  if (!result.success) {
    throw new Error(result.error.issues.map(e => e.message).join(", "));
  }

  const card = await db.flashcard.update({
    where: { id },
    data: {
      front: result.data.front,
      back: result.data.back,
    },
  });

  revalidatePath(`/study/${result.data.deckId}`);
  return card;
}

export async function deleteFlashcard(id: string, deckId: string) {
  await db.flashcard.delete({
    where: { id },
  });
  revalidatePath(`/study/${deckId}`);
}

// --- SPACED REPETITION ---

export async function reviewFlashcard(cardId: string, quality: number) {
  const result = reviewFlashcardSchema.safeParse({ id: cardId, quality });
  if (!result.success) throw new Error("Invalid review payload");

  const card = await db.flashcard.findUnique({ where: { id: cardId } });
  if (!card) throw new Error("Card not found");

  const q = result.data.quality;
  let { interval, repetition, easeFactor } = card;

  // SM-2 Algorithm Implementation
  if (q >= 3) {
    // Correct response
    if (repetition === 0) {
      interval = 1;
    } else if (repetition === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetition += 1;
  } else {
    // Incorrect / Hard response
    repetition = 0;
    interval = 1;
  }

  // Update ease factor (Q: 0-4 mapping for standard SM2 0-5. Assuming 0: Blackout, 1: Wrong, 2: Hard, 3: Good, 4: Easy)
  easeFactor = easeFactor + (0.1 - (4 - q) * (0.08 + (4 - q) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);

  const updatedCard = await db.flashcard.update({
    where: { id: cardId },
    data: {
      interval,
      repetition,
      easeFactor,
      nextReview,
    },
  });

  // Progression hooks - award XP for reviewing
  await addXP(2); // 2 XP per card reviewed
  await runProgressionUpdate("study");

  return updatedCard;
}
