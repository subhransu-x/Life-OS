"use client";

import { useState, useTransition } from "react";
import { reviewFlashcard } from "@/lib/actions/study";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Flashcard } from "@prisma/client";
import { Brain, RotateCcw, Frown, Meh, Smile, PartyPopper } from "lucide-react";

export function FlashcardReviewer({
  cards,
  onComplete,
}: {
  cards: Flashcard[];
  onComplete: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPending, startTransition] = useTransition();

  const currentCard = cards[currentIndex];

  if (!currentCard) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-surface/50 border border-border rounded-xl">
        <PartyPopper className="w-12 h-12 text-domain-mind mb-4" />
        <h3 className="text-xl font-bold mb-2">You&apos;re all caught up!</h3>
        <p className="text-muted-foreground mb-6">You&apos;ve reviewed all due cards in this deck.</p>
        <Button onClick={onComplete}>Back to Deck</Button>
      </div>
    );
  }

  const handleGrade = (quality: number) => {
    startTransition(async () => {
      try {
        await reviewFlashcard(currentCard.id, quality);
        
        setIsFlipped(false);
        // Short timeout to allow flip animation to reset before changing content
        setTimeout(() => {
          if (currentIndex < cards.length - 1) {
            setCurrentIndex(i => i + 1);
          } else {
            setCurrentIndex(i => i + 1); // Will trigger the empty state
            onComplete(); // Could also call this right away
          }
        }, 150);
      } catch {
        toast.error("Failed to save review");
      }
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-8">
      {/* Progress */}
      <div className="w-full flex items-center justify-between text-sm text-muted-foreground mb-2">
        <span>Card {currentIndex + 1} of {cards.length}</span>
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-domain-mind" />
          <span>Active Recall Mode</span>
        </div>
      </div>

      {/* 3D Card Container */}
      <div 
        className="relative w-full aspect-[4/3] sm:aspect-[16/9] perspective-1000 cursor-pointer group"
        onClick={() => !isFlipped && setIsFlipped(true)}
      >
        <div 
          className={`w-full h-full transition-transform duration-500 transform-style-3d ${
            isFlipped ? "rotate-y-180" : ""
          }`}
        >
          {/* Front */}
          <div className="absolute inset-0 backface-hidden bg-surface border-2 border-border/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-lg hover:border-domain-mind/50 transition-colors">
            <h3 className="text-2xl font-medium leading-relaxed">
              {currentCard.front}
            </h3>
            {!isFlipped && (
              <p className="absolute bottom-6 text-sm text-muted-foreground flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                <RotateCcw className="w-4 h-4" /> Click to reveal answer
              </p>
            )}
          </div>

          {/* Back */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-surface border-2 border-domain-mind/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-xl overflow-y-auto">
            <h3 className="text-xl font-medium leading-relaxed mb-6 border-b border-border/50 pb-6 w-full text-muted-foreground">
              {currentCard.front}
            </h3>
            <div className="text-lg flex-1 flex items-center justify-center whitespace-pre-wrap">
              {currentCard.back}
            </div>
          </div>
        </div>
      </div>

      {/* Grading Controls (Only visible when flipped) */}
      <div className={`w-full transition-all duration-300 ${isFlipped ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
        <p className="text-center text-sm text-muted-foreground mb-4">How well did you know this?</p>
        <div className="grid grid-cols-4 gap-2 sm:gap-4">
          <Button 
            variant="outline" 
            className="flex flex-col h-auto py-3 gap-1 hover:bg-status-danger/10 hover:text-status-danger hover:border-status-danger/30"
            onClick={(e) => { e.stopPropagation(); handleGrade(0); }}
            disabled={isPending}
          >
            <Frown className="w-5 h-5 mb-1" />
            <span>Blackout</span>
            <span className="text-xs text-muted-foreground font-normal">Forgot</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col h-auto py-3 gap-1 hover:bg-orange-500/10 hover:text-orange-500 hover:border-orange-500/30"
            onClick={(e) => { e.stopPropagation(); handleGrade(2); }}
            disabled={isPending}
          >
            <Meh className="w-5 h-5 mb-1" />
            <span>Hard</span>
            <span className="text-xs text-muted-foreground font-normal">Struggled</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col h-auto py-3 gap-1 hover:bg-status-success/10 hover:text-status-success hover:border-status-success/30"
            onClick={(e) => { e.stopPropagation(); handleGrade(3); }}
            disabled={isPending}
          >
            <Smile className="w-5 h-5 mb-1" />
            <span>Good</span>
            <span className="text-xs text-muted-foreground font-normal">Remembered</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col h-auto py-3 gap-1 hover:bg-blue-500/10 hover:text-blue-500 hover:border-blue-500/30"
            onClick={(e) => { e.stopPropagation(); handleGrade(4); }}
            disabled={isPending}
          >
            <PartyPopper className="w-5 h-5 mb-1" />
            <span>Easy</span>
            <span className="text-xs text-muted-foreground font-normal">Too easy</span>
          </Button>
        </div>
      </div>

    </div>
  );
}
