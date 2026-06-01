"use client";

import { PageHeader } from "@/components/layout/page-header";
import { GraduationCap, Plus, BookOpen, Layers } from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { DeckForm } from "@/components/study/deck-form";

import { Deck, Goal } from "@prisma/client";

interface DeckWithRelations extends Deck {
  goal: Goal | null;
  _count: {
    cards: number;
  };
}

interface StudyClientPageProps {
  decks: DeckWithRelations[];
  goals: Goal[];
  dueCardsCount: number;
}


export function StudyClientPage({ decks, goals, dueCardsCount }: StudyClientPageProps) {
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Knowledge Vault"
        description="Spaced repetition & flashcards"
      />

      <div className="flex-1 p-6 space-y-8 overflow-y-auto">
        {/* Top Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="p-6 bg-gradient-to-br from-domain-mind/20 to-transparent border-domain-mind/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-domain-mind/20 flex items-center justify-center text-domain-mind">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Decks</p>
                <p className="text-3xl font-bold">{decks.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-500/20 to-transparent border-orange-500/20 relative overflow-hidden">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-500">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Due for Review</p>
                <p className="text-3xl font-bold">{dueCardsCount}</p>
              </div>
            </div>
            {dueCardsCount > 0 && (
              <div className="absolute top-0 right-0 w-2 h-full bg-orange-500" />
            )}
          </Card>
        </div>

        {/* Decks Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Your Decks</h2>
            <Modal
              title="Create Deck"
              description="Group your flashcards by topic or goal."
              trigger={
                <Button size="sm" className="gap-2">
                  <Plus className="w-4 h-4" /> New Deck
                </Button>
              }
            >
              {(close: () => void) => (
                <DeckForm goals={goals} onSuccess={close} />
              )}
            </Modal>
          </div>

          {decks.length === 0 ? (
            <div className="text-center p-12 border border-dashed rounded-xl border-border bg-surface/50">
              <GraduationCap className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No decks yet</h3>
              <p className="text-muted-foreground mb-6">Create a deck to start building your knowledge vault.</p>
              <Modal
                title="Create Deck"
                trigger={
                  <Button variant="outline" className="gap-2">
                    <Plus className="w-4 h-4" /> Create First Deck
                  </Button>
                }
              >
                {(close: () => void) => (
                  <DeckForm goals={goals} onSuccess={close} />
                )}
              </Modal>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {decks.map((deck) => (
                <Link key={deck.id} href={`/study/${deck.id}`}>
                  <Card className="group h-full flex flex-col p-5 hover:border-foreground/20 transition-all hover:scale-[1.02] cursor-pointer">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${deck.color}20`, color: deck.color }}
                      >
                        <Layers className="w-5 h-5" />
                      </div>
                      {deck.goal && (
                        <div className="px-2 py-1 bg-surface text-[10px] uppercase tracking-wider font-semibold rounded border border-border text-muted-foreground truncate max-w-[120px]">
                          {deck.goal.title}
                        </div>
                      )}
                    </div>

                    <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">
                      {deck.name}
                    </h3>
                    {deck.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {deck.description}
                      </p>
                    )}

                    <div className="mt-auto pt-4 flex items-center justify-between text-sm border-t border-border/50">
                      <span className="text-muted-foreground">{deck._count?.cards ?? 0} cards</span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
