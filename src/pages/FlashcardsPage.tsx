import React, { useState, useEffect } from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import SEO from "../components/common/SEO";
import { lmsService } from "../services/lmsService";

export default function FlashcardsPage() {
  const [cards, setCards] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [deckFilter, setDeckFilter] = useState<string>("All");
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);
  const [sourceType, setSourceType] = useState<string>("notes");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    loadCards();
  }, [deckFilter, onlyFavorites]);

  const loadCards = async () => {
    const list = await lmsService.getFlashcards(deckFilter === "All" ? undefined : deckFilter);
    const filtered = onlyFavorites ? list.filter((c: any) => c.isFavorite) : list;
    setCards(filtered);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleReview = async (rating: "again" | "hard" | "good" | "easy") => {
    if (!cards.length) return;
    const current = cards[currentIndex];

    await lmsService.reviewFlashcard(current._id, rating);
    showToast(`✓ Marked as ${rating.toUpperCase()} — Next review scheduled!`);

    setIsFlipped(false);
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
      showToast("🎉 Deck completed for today! Awesome spaced repetition streak.");
    }
  };

  const toggleFavorite = () => {
    if (!cards.length) return;
    const current = cards[currentIndex];
    const updated = { ...current, isFavorite: !current.isFavorite };
    setCards((prev) => prev.map((c, idx) => (idx === currentIndex ? updated : c)));
    showToast(updated.isFavorite ? "⭐ Saved to Favorite Deck!" : "Removed from Favorites");
  };

  const activeCard = cards[currentIndex] || cards[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <SEO
        title="AI Flashcards & Spaced Repetition | KR GLOBAL LEARNING PRIVATE LIMITED"
        description="Master complex algorithms, system design trade-offs, and cloud architectures with interactive 3D flashcards and Anki-style spaced repetition."
      />
      <DashboardNavbar />

      {toast && (
        <div className="fixed bottom-5 right-5 z-50 px-4 py-3 rounded-2xl bg-purple-600 text-white font-bold text-xs shadow-2xl animate-bounce">
          {toast}
        </div>
      )}

      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/70 via-slate-900 to-indigo-950/70 border border-purple-500/30 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">
              <span>⚡ Sprint 9.11</span>
              <span>•</span>
              <span>AI Flashcard Generator</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Active Recall & Spaced Repetition</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Anki-style learning algorithm. Rate recall difficulty to schedule automatic review intervals and cement long-term memory.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold border transition cursor-pointer flex items-center gap-1.5 ${
                onlyFavorites
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                  : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700"
              }`}
            >
              <span>⭐</span> <span>{onlyFavorites ? "Starred Cards" : "Filter Starred"}</span>
            </button>
          </div>
        </div>

        {/* Generate Deck Quick Selector */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">Generate Cards From:</span>
            {[
              { key: "lesson", label: "Video Lesson" },
              { key: "pdf", label: "Uploaded PDF" },
              { key: "notes", label: "Smart Notes" },
              { key: "quiz_mistakes", label: "Quiz Mistakes" },
            ].map((s) => (
              <button
                key={s.key}
                onClick={() => {
                  setSourceType(s.key);
                  showToast(`✓ Generated 10 flashcards from ${s.label}!`);
                }}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                  sourceType === s.key
                    ? "bg-purple-600 text-white shadow-md shadow-purple-900/30"
                    : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="font-mono text-cyan-400 font-bold">
            Card {cards.length > 0 ? currentIndex + 1 : 0} of {cards.length}
          </div>
        </div>

        {/* 3D Flip Card Component */}
        {cards.length > 0 && activeCard ? (
          <div className="space-y-6">
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="cursor-pointer perspective-1000 min-h-[320px] sm:min-h-[380px] w-full"
            >
              <div
                className={`relative w-full h-full min-h-[320px] sm:min-h-[380px] rounded-3xl p-8 sm:p-10 transition-transform duration-500 transform-style-3d border shadow-2xl flex flex-col justify-between ${
                  isFlipped
                    ? "bg-gradient-to-br from-purple-950/90 via-slate-900 to-slate-950 border-purple-500/50"
                    : "bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/80 border-slate-800 hover:border-cyan-500/40"
                }`}
              >
                {/* Card Header */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                    {activeCard.deckName || "System Design"}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite();
                      }}
                      className="text-amber-400 text-sm hover:scale-110 transition"
                      title="Star Card"
                    >
                      {activeCard.isFavorite ? "★" : "☆"}
                    </button>
                    <span className="text-[11px] text-slate-400">
                      {isFlipped ? "Answer Side" : "Question Side (Click to Flip)"}
                    </span>
                  </div>
                </div>

                {/* Card Center Content */}
                <div className="py-8 text-center space-y-4">
                  <div className="text-xs uppercase font-mono font-bold tracking-widest text-slate-500">
                    {isFlipped ? "SOLUTION / TAKEAWAY" : "TECHNICAL QUESTION"}
                  </div>
                  <div className="text-lg sm:text-2xl font-black text-white leading-relaxed max-w-2xl mx-auto">
                    {isFlipped ? activeCard.back : activeCard.front}
                  </div>
                </div>

                {/* Card Footer Hint */}
                <div className="text-center text-[11px] text-slate-500">
                  {isFlipped ? "Rate your recall difficulty below to reschedule" : "💡 Tap anywhere on card to flip"}
                </div>
              </div>
            </div>

            {/* Spaced Repetition Rating Buttons */}
            {isFlipped && (
              <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3 animate-fadeIn">
                <div className="text-center text-xs font-bold text-slate-300">
                  How well did you remember this concept?
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button
                    onClick={() => handleReview("again")}
                    className="p-3 rounded-2xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 text-xs font-bold cursor-pointer transition flex flex-col items-center"
                  >
                    <span>Again</span>
                    <span className="text-[10px] text-rose-400 font-mono mt-0.5">&lt; 10 mins</span>
                  </button>

                  <button
                    onClick={() => handleReview("hard")}
                    className="p-3 rounded-2xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 text-xs font-bold cursor-pointer transition flex flex-col items-center"
                  >
                    <span>Hard</span>
                    <span className="text-[10px] text-amber-400 font-mono mt-0.5">2 Days</span>
                  </button>

                  <button
                    onClick={() => handleReview("good")}
                    className="p-3 rounded-2xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold cursor-pointer transition flex flex-col items-center"
                  >
                    <span>Good</span>
                    <span className="text-[10px] text-cyan-400 font-mono mt-0.5">5 Days</span>
                  </button>

                  <button
                    onClick={() => handleReview("easy")}
                    className="p-3 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold cursor-pointer transition flex flex-col items-center"
                  >
                    <span>Easy</span>
                    <span className="text-[10px] text-emerald-400 font-mono mt-0.5">10 Days</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-4">
            <div className="text-4xl">⚡</div>
            <h3 className="text-base font-bold text-white">No Flashcards in this Filter</h3>
            <p className="text-xs text-slate-400">Generate a new deck from your Smart Notes or Video Lessons above.</p>
          </div>
        )}
      </main>
    </div>
  );
}
