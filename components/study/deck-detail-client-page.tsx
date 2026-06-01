"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { FlashcardForm } from "@/components/study/flashcard-form";
import { Card } from "@/components/ui/card";
import { Plus, Play, MoreVertical, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { deleteDeck } from "@/lib/actions/study";
import { useRouter } from "next/navigation";

import { Deck, Goal, Flashcard } from "@prisma/client";

interface DeckWithRelations extends Deck {
  goal: Goal | null;
  cards: Flashcard[];
}

interface DeckDetailClientPageProps {
  deck: DeckWithRelations;
  dueCards: Flashcard[];
}


export function DeckDetailClientPage({ deck, dueCards }: DeckDetailClientPageProps) {
  const router = useRouter();
  const totalCards = deck.cards.length;

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this deck? All flashcards in it will be permanently deleted.")) {
      await deleteDeck(deck.id);
      router.push("/study");
      router.refresh();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 md:px-8 lg:px-10 pt-4 pb-0 -mb-4 z-40 relative">
        <Link
          href="/study"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Decks
        </Link>
      </div>

      <PageHeader
        title={deck.name}
        description={deck.description || `${totalCards} cards`}
        action={
          <div className="flex gap-2">
            <Modal
              title="Add Flashcard"
              trigger={
                <Button variant="outline" className="gap-2">
                  <Plus className="w-4 h-4" /> Add Card
                </Button>
              }
            >
              {(close) => (
                <FlashcardForm deckId={deck.id} onSuccess={close} />
              )}
            </Modal>

            {dueCards.length > 0 && (
              <Link href={`/study/${deck.id}/review`}>
                <Button className="gap-2 bg-domain-mind hover:bg-domain-mind/90 text-white">
                  <Play className="w-4 h-4" /> Study Now ({dueCards.length})
                </Button>
              </Link>
            )}

            <Button
              onClick={handleDelete}
              variant="ghost"
              size="icon"
              className="text-status-danger hover:text-status-danger hover:bg-status-danger/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        }
      />

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {totalCards === 0 ? (
          <div className="text-center p-12 border border-dashed rounded-xl border-border bg-surface/50">
            <h3 className="text-lg font-medium text-foreground mb-2">This deck is empty</h3>
            <p className="text-muted-foreground mb-6">Add some flashcards to start studying.</p>
            <Modal
              title="Add Flashcard"
              trigger={
                <Button className="gap-2">
                  <Plus className="w-4 h-4" /> Add First Card
                </Button>
              }
            >
              {(close) => (
                <FlashcardForm deckId={deck.id} onSuccess={close} />
              )}
            </Modal>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Flashcards</h2>
            <div className="grid grid-cols-1 gap-4">
              {deck.cards.map((card: Flashcard, index: number) => (
                <Card key={card.id} className="p-4 flex gap-4">

                  <div className="flex-none text-muted-foreground font-mono text-sm pt-1">
                    #{(index + 1).toString().padStart(2, "0")}
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1 font-semibold">
                        Front
                      </p>
                      <p className="whitespace-pre-wrap text-sm">{card.front}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1 font-semibold">
                        Back
                      </p>
                      <p className="whitespace-pre-wrap text-sm">{card.back}</p>
                    </div>
                  </div>
                  <div className="flex-none flex items-start">
                    <Modal
                      title="Edit Flashcard"
                      trigger={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      }
                    >
                      {(close) => (
                        <FlashcardForm
                          deckId={deck.id}
                          initialData={{
                            id: card.id,
                            front: card.front,
                            back: card.back,
                            deckId: card.deckId,
                          }}
                          onSuccess={close}
                        />
                      )}
                    </Modal>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
