"use client";

import { ChevronLeft, ChevronRight, List } from "lucide-react";

interface NavigationBarProps {
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  currentShloka: number;
  totalShlokas: number;
  onToggleList: () => void;
}

export default function NavigationBar({
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  currentShloka,
  totalShlokas,
  onToggleList,
}: NavigationBarProps) {
  return (
    <div className="flex items-center justify-between">
      <button
        onClick={onPrev}
        disabled={!hasPrev}
        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/40 text-slate-300 hover:bg-slate-700/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
      >
        <ChevronLeft size={18} />
        <span className="text-sm font-medium hidden sm:inline">Previous</span>
      </button>

      <div className="flex items-center gap-3">
        <button
          onClick={onToggleList}
          className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/40 text-slate-300 hover:bg-slate-700/60 hover:text-white transition-all active:scale-95"
          aria-label="Toggle shloka list"
        >
          <List size={18} />
        </button>
        <span className="text-slate-400 text-sm font-medium tabular-nums">
          {currentShloka} / {totalShlokas}
        </span>
      </div>

      <button
        onClick={onNext}
        disabled={!hasNext}
        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/40 text-slate-300 hover:bg-slate-700/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
      >
        <span className="text-sm font-medium hidden sm:inline">Next</span>
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
