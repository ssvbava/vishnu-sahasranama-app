"use client";

import { useState, useEffect, useCallback } from "react";
import { BookOpen, Sparkles } from "lucide-react";
import AudioPlayer from "@/components/AudioPlayer";
import ShlokaDisplay from "@/components/ShlokaDisplay";
import ProgressBar from "@/components/ProgressBar";
import NavigationBar from "@/components/NavigationBar";
import ShlokaList from "@/components/ShlokaList";
import { Shloka, Metadata } from "@/types";

interface ShlokaResponse {
  shloka: Shloka;
  navigation: {
    prev: { id: number; number: number } | null;
    next: { id: number; number: number } | null;
    current: number;
    total: number;
  };
}

interface AllShlokasResponse {
  metadata: Metadata;
  shlokas: Shloka[];
  pagination: {
    total: number;
    totalPages: number;
  };
}

export default function Home() {
  const [currentShloka, setCurrentShloka] = useState<Shloka | null>(null);
  const [navigation, setNavigation] = useState<ShlokaResponse["navigation"] | null>(null);
  const [allShlokas, setAllShlokas] = useState<Shloka[]>([]);
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [showList, setShowList] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchShloka = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/shlokas/${id}`);
      if (!res.ok) throw new Error("Failed to fetch shloka");
      const data: ShlokaResponse = await res.json();
      setCurrentShloka(data.shloka);
      setNavigation(data.navigation);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllShlokas = useCallback(async () => {
    try {
      const res = await fetch("/api/shlokas?limit=200");
      if (!res.ok) throw new Error("Failed to fetch shlokas");
      const data: AllShlokasResponse = await res.json();
      setAllShlokas(data.shlokas);
      setMetadata(data.metadata);
    } catch {
      // silently fail for list
    }
  }, []);

  useEffect(() => {
    fetchShloka(1);
    fetchAllShlokas();
  }, [fetchShloka, fetchAllShlokas]);

  const goToPrev = () => {
    if (navigation?.prev) fetchShloka(navigation.prev.id);
  };

  const goToNext = () => {
    if (navigation?.next) fetchShloka(navigation.next.id);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showList) return;
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        goToPrev();
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        goToNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, showList]);

  const namesCompleted = currentShloka
    ? currentShloka.names[currentShloka.names.length - 1]?.number || 0
    : 0;

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => fetchShloka(1)}
            className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Decorative Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-amber-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-orange-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-2xl mx-auto px-4 py-6 sm:py-10">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-900/20 border border-amber-700/20 mb-4">
            <Sparkles size={14} className="text-amber-400" />
            <span className="text-amber-400/80 text-xs font-medium tracking-wider uppercase">
              Sacred Chant
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-amber-200 via-amber-100 to-orange-200 bg-clip-text text-transparent mb-2">
            विष्णु सहस्रनाम
          </h1>
          <h2 className="text-lg sm:text-xl text-amber-200/70 font-light">
            Vishnu Sahasranama
          </h2>
          <p className="text-slate-400 text-sm mt-2 max-w-md mx-auto">
            The Thousand Names of Lord Vishnu from the Anushasana Parva of the
            Mahabharata
          </p>
        </header>

        {/* Progress */}
        {navigation && metadata && (
          <div className="mb-6">
            <ProgressBar
              current={navigation.current}
              total={navigation.total}
              totalNames={metadata.totalNames}
              namesCompleted={namesCompleted}
            />
          </div>
        )}

        {/* Main Content */}
        {loading && !currentShloka ? (
          <div className="space-y-6">
            <div className="animate-pulse bg-slate-800/40 rounded-2xl h-40" />
            <div className="animate-pulse bg-slate-800/40 rounded-2xl h-32" />
            <div className="animate-pulse bg-slate-800/40 rounded-2xl h-60" />
          </div>
        ) : currentShloka ? (
          <div className="space-y-6">
            {/* Shloka Number Badge */}
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-900/20 border border-amber-700/20">
                <BookOpen size={14} className="text-amber-400" />
                <span className="text-amber-300/90 text-sm font-medium">
                  Shloka {currentShloka.number}
                </span>
              </div>
              <span className="text-slate-500 text-xs">
                Names {currentShloka.names[0]?.number} —{" "}
                {currentShloka.names[currentShloka.names.length - 1]?.number}
              </span>
            </div>

            {/* Shloka Content */}
            <ShlokaDisplay shloka={currentShloka} />

            {/* Audio Player */}
            <AudioPlayer
              audioUrl={currentShloka.audioUrl}
              shlokaNumber={currentShloka.number}
              onPrev={goToPrev}
              onNext={goToNext}
              hasPrev={!!navigation?.prev}
              hasNext={!!navigation?.next}
            />

            {/* Navigation */}
            {navigation && (
              <NavigationBar
                onPrev={goToPrev}
                onNext={goToNext}
                hasPrev={!!navigation.prev}
                hasNext={!!navigation.next}
                currentShloka={navigation.current}
                totalShlokas={navigation.total}
                onToggleList={() => setShowList(true)}
              />
            )}
          </div>
        ) : null}

        {/* Footer */}
        <footer className="mt-12 pb-8 text-center border-t border-slate-800/40 pt-6">
          <p className="text-slate-500 text-xs">
            ॐ नमो भगवते वासुदेवाय
          </p>
          <p className="text-slate-600 text-xs mt-1">
            Om Namo Bhagavate Vasudevaya
          </p>
        </footer>
      </div>

      {/* Shloka List Modal */}
      {showList && (
        <ShlokaList
          shlokas={allShlokas}
          currentId={currentShloka?.id || 1}
          onSelect={(id) => fetchShloka(id)}
          onClose={() => setShowList(false)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      )}
    </div>
  );
}
