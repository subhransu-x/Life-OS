import { notFound, redirect } from "next/navigation";
import { getDeckById, getDueCardsForDeck } from "@/lib/queries/study";
import { FlashcardReviewer } from "@/components/study/flashcard-reviewer";
import Link from "next/link";
import { ArrowLeft, GraduationCap } from "lucide-react";

export default async function ReviewPage({ params }: { params: { id: string } }) {
  const deck = await getDeckById(params.id);
  
  if (!deck) {
    notFound();
  }

  const dueCards = await getDueCardsForDeck(deck.id);

  const handleComplete = async () => {
    "use server";
    redirect(`/study/${deck.id}`);
  };

  return (
    <div className="flex flex-col h-full bg-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-domain-mind/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between p-6 z-10">
        <Link 
          href={`/study/${deck.id}`} 
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Exit Session
        </Link>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border text-sm font-medium">
          <GraduationCap className="w-4 h-4 text-domain-mind" />
          <span>{deck.name}</span>
        </div>
      </div>

      {/* Main Review Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 z-10">
        {dueCards.length === 0 ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Session Complete!</h2>
            <p className="text-muted-foreground mb-8">You&apos;ve reviewed all cards due today.</p>
            <form action={handleComplete}>
              <button type="submit" className="px-6 py-2 rounded-lg bg-domain-mind text-white font-medium hover:bg-domain-mind/90 transition-colors">
                Return to Deck
              </button>
            </form>
          </div>
        ) : (
          <FlashcardReviewer cards={dueCards} onComplete={handleComplete} />
        )}
      </div>
    </div>
  );
}
