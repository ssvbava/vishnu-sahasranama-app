"use client";

import { useState, useEffect, useCallback } from "react";
import { BookOpen, Sparkles, User, Trash2 } from "lucide-react";
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
  const [userName, setUserName] = useState<string>("");
  const [sessionStarted, setSessionStarted] = useState(false);
  const [currentShloka, setCurrentShloka] = useState<Shloka | null>(null);
  const [navigation, setNavigation] = useState<ShlokaResponse['navigation'] | null>(null);
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

  const handleStartSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      setSessionStarted(true);
    }
  };

  const flushPersonalDetails = () => {
    setUserName("");
    setSessionStarted(false);
    fetchShloka(1);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!sessionStarted || showList) return;
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
  }, [navigation, showList, sessionStarted]);

  const namesCompleted = currentShloka
    ? currentShloka.names[currentShloka.names.length - 1]?.number || 0
    : 0;

  if (!sessionStarted) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
        <div className="max-w-md w-full space-y-8 bg-slate-900/40 p-8 rounded-3xl border border-slate-800/60 backdrop-blur-xl text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto">
              <Sparkles size={32} className="text-amber-500" />
            </div>
            <h1 className="text-2xl font-bold text-amber-100">Welcome to your Journey</h1>
            <p className="text-slate-400 text-sm">
              Your session is private and ephemeral. All personal details will be flushed when you close this window.
            </p>
          </div>
          <form onSubmit={handleStartSession} className="space-y-4">
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="What is your name?"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-800/60 border border-slate-700/40 rounded-2xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all text-center"
                autoFocus
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold rounded-2xl shadow-lg shadow-amber-900/20 transition-all active:scale-95"
            >
              Start Chanting
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-amber-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-orange-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-2xl mx-auto px-4 py-6 sm:py-10">
        <header className="text-center mb-8 relative">
          <button 
            onClick={flushPersonalDetails}
            className="absolute top-0 right-0 p-2 text-slate-500 hover:text-red-400 transition-colors flex items-center gap-1.5"
            title="Flush session and personal details"
          >
            <span className="text-[10px] uppercase font-bold tracking-tighter">Flush Session</span>
            <Trash2 size={16} />
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-900/20 border border-amber-700/20 mb-4">
            <Sparkles size={14} className="text-amber-400" />
            <span className="text-amber-400/80 text-xs font-medium tracking-wider uppercase">
              Chanting with {userName}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-amber-200 via-amber-100 to-orange-200 bg-clip-text text-transparent mb-2">
            विष्णु सहस्रनाम
          </h1>
          <h2 className="text-lg sm:text-xl text-amber-200/70 font-light">
            Vishnu Sahasranama
          </h2>
        </header>

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

        {loading && !currentShloka ? (
          <div className="space-y-6">
            <div className="animate-pulse bg-slate-800/40 rounded-2xl h-40" />
            <div className="animate-pulse bg-slate-800/40 rounded-2xl h-32" />
          </div>
        ) : currentShloka ? (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-900/20 border border-amber-700/20">
                <BookOpen size={14} className="text-amber-400" />
                <span className="text-amber-300/90 text-sm font-medium">
                  Shloka {currentShloka.number}
                </span>
              </div>
            </div>

            <ShlokaDisplay shloka={currentShloka} />

            <AudioPlayer
              audioUrl={currentShloka.audioUrl}
              startTime={currentShloka.startTime}
              endTime={currentShloka.endTime}
              shlokaNumber={currentShloka.number}
              onPrev={goToPrev}
              onNext={goToNext}
              hasPrev={!!navigation?.prev}
              hasNext={!!navigation?.next}
            />

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

        <footer className="mt-12 pb-8 text-center border-t border-slate-800/40 pt-6">
          <p className="text-slate-500 text-xs uppercase tracking-widest">
            ॐ नमो भगवते वासुदेवाय
          </p>
        </footer>
      </div>

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
