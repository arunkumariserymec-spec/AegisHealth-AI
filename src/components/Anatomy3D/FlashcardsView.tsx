import React, { useState } from 'react';
import { ANATOMY_FLASHCARDS, Flashcard } from '../../anatomy/flashcardsData';
import { ANATOMY_SYSTEMS } from '../../anatomy/systemsData';
import {
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  CheckCircle,
  AlertCircle,
  Eye,
  BookOpen,
  Filter
} from 'lucide-react';

interface FlashcardsViewProps {
  onFocusStructure?: (structureId: string) => void;
  onExit?: () => void;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({ onFocusStructure, onExit }) => {
  const [selectedSystem, setSelectedSystem] = useState<string>('all');
  const [deck, setDeck] = useState<Flashcard[]>(ANATOMY_FLASHCARDS);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [knownCards, setKnownCards] = useState<Set<string>>(new Set());
  const [difficultCards, setDifficultCards] = useState<Set<string>>(new Set());

  // Filter deck when system changes
  const handleSelectSystem = (sysId: string) => {
    setSelectedSystem(sysId);
    const filtered = sysId === 'all'
      ? ANATOMY_FLASHCARDS
      : ANATOMY_FLASHCARDS.filter(c => c.system === sysId);
    setDeck(filtered);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleShuffle = () => {
    setDeck(prev => [...prev].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleNext = () => {
    if (currentIndex + 1 < deck.length) {
      setCurrentIndex(i => i + 1);
      setIsFlipped(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1);
      setIsFlipped(false);
    }
  };

  const handleMarkKnown = (id: string) => {
    setKnownCards(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    setDifficultCards(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    handleNext();
  };

  const handleMarkDifficult = (id: string) => {
    setDifficultCards(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    setKnownCards(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    handleNext();
  };

  const currentCard: Flashcard | undefined = deck[currentIndex];

  return (
    <div className="w-full max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 text-white shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-md">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>Anatomy Spaced Repetition Flashcards</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                High-Yield Review
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Active recall flashcards for anatomical relations, blood supplies, and innervation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShuffle}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1.5 text-xs font-semibold"
            title="Shuffle Deck"
          >
            <Shuffle className="w-4 h-4 text-teal-400" />
            <span className="hidden sm:inline">Shuffle</span>
          </button>

          {onExit && (
            <button
              onClick={onExit}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
            >
              Exit
            </button>
          )}
        </div>
      </div>

      {/* System Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => handleSelectSystem('all')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
            selectedSystem === 'all'
              ? 'bg-teal-500 text-slate-950 font-bold'
              : 'bg-slate-800/80 text-slate-400 hover:text-white'
          }`}
        >
          All Systems ({ANATOMY_FLASHCARDS.length})
        </button>
        {ANATOMY_SYSTEMS.slice(0, 6).map(sys => (
          <button
            key={sys.id}
            onClick={() => handleSelectSystem(sys.id)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors flex items-center gap-1.5 ${
              selectedSystem === sys.id
                ? 'bg-teal-500 text-slate-950 font-bold'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <span>{sys.emoji}</span>
            <span>{sys.name}</span>
          </button>
        ))}
      </div>

      {/* Main Flashcard Component */}
      {currentCard ? (
        <div className="space-y-4">
          {/* Card Counter & Stats */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="font-semibold text-teal-400">
              Card {currentIndex + 1} of {deck.length}
            </span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Known: {knownCards.size}</span>
              </span>
              <span className="flex items-center gap-1 text-amber-400">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Difficult: {difficultCards.size}</span>
              </span>
            </div>
          </div>

          {/* Flip Container */}
          <div
            onClick={() => setIsFlipped(f => !f)}
            className="w-full min-h-[320px] rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-8 shadow-2xl cursor-pointer select-none flex flex-col justify-between hover:border-slate-700 transition-all duration-300 relative group overflow-hidden"
          >
            {/* Top Tag */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400">
                {currentCard.systemName}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 font-mono">
                {isFlipped ? 'Answer (Click to flip)' : 'Question (Click to flip)'}
              </span>
            </div>

            {/* Central Card Text */}
            <div className="py-6 text-center">
              {!isFlipped ? (
                <div className="space-y-4">
                  <span className="text-3xl">❓</span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white leading-relaxed">
                    {currentCard.front}
                  </h3>
                  <p className="text-xs text-slate-400 italic">Click card to reveal anatomical answer</p>
                </div>
              ) : (
                <div className="space-y-4 text-left max-w-xl mx-auto">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block text-center">
                    Correct Anatomical Answer
                  </span>
                  <p className="text-base sm:text-lg text-slate-100 leading-relaxed whitespace-pre-line">
                    {currentCard.back}
                  </p>
                  {currentCard.highYieldTip && (
                    <div className="p-3 rounded-xl bg-teal-950/40 border border-teal-500/30 text-xs text-teal-200 leading-relaxed">
                      <strong className="text-teal-400">High-Yield Pearl: </strong>
                      {currentCard.highYieldTip}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Structure Navigation Shortcut */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-800/80">
              <span className="text-[11px]">Difficulty: {currentCard.difficulty}</span>
              {currentCard.structureId && onFocusStructure && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (currentCard.structureId) onFocusStructure(currentCard.structureId);
                  }}
                  className="text-teal-400 hover:text-teal-300 flex items-center gap-1 font-semibold"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect in 3D Atlas</span>
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={handlePrev}
                className="flex-1 sm:flex-none p-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>
              <button
                type="button"
                disabled={currentIndex + 1 >= deck.length}
                onClick={handleNext}
                className="flex-1 sm:flex-none p-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Knowledge Grading */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => handleMarkDifficult(currentCard.id)}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <AlertCircle className="w-4 h-4" />
                <span>Mark Difficult</span>
              </button>
              <button
                type="button"
                onClick={() => handleMarkKnown(currentCard.id)}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Know It!</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 text-xs">
          No flashcards available for this system.
        </div>
      )}
    </div>
  );
};
