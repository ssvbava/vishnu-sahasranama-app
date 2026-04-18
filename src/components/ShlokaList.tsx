"use client";

import { useRef, useEffect } from "react";
import { X, Search } from "lucide-react";
import { Shloka } from "@/types";

interface ShlokaListProps {
  shlokas: Shloka[];
  currentId: number;
  onSelect: (id: number) => void;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function ShlokaList({
  shlokas,
  currentId,
  onSelect,
  onClose,
  searchQuery,
  onSearchChange,
}: ShlokaListProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (activeRef.current && listRef.current) {
      activeRef.current.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [currentId]);

  const filteredShlokas = shlokas.filter((s) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.transliteration.toLowerCase().includes(q) ||
      s.sanskrit.includes(searchQuery) ||
      s.names.some(
        (n) =>
          n.transliteration.toLowerCase().includes(q) ||
          n.meaning.toLowerCase().includes(q)
      )
    );
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center">
      <div className="w-full sm:max-w-lg max-h-[85vh] bg-gradient-to-b from-slate-900 to-slate-950 rounded-t-3xl sm:rounded-2xl border border-slate-700/40 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800/60">
          <h2 className="text-lg font-semibold text-amber-200">All Shlokas</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b border-slate-800/40">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="text"
              placeholder="Search names, meanings..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-800/60 border border-slate-700/40 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/30"
            />
          </div>
        </div>

        {/* List */}
        <div ref={listRef} className="flex-1 overflow-y-auto py-2">
          {filteredShlokas.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              No shlokas found
            </div>
          ) : (
            filteredShlokas.map((shloka) => {
              const isActive = shloka.id === currentId;
              const firstNames = shloka.names
                .slice(0, 3)
                .map((n) => n.transliteration)
                .join(", ");
              return (
                <button
                  key={shloka.id}
                  ref={isActive ? activeRef : null}
                  onClick={() => {
                    onSelect(shloka.id);
                    onClose();
                  }}
                  className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-all hover:bg-amber-900/10 ${
                    isActive ? "bg-amber-900/20 border-l-2 border-amber-500" : "border-l-2 border-transparent"
                  }`}
                >
                  <span
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold shrink-0 ${
                      isActive
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {shloka.number}
                  </span>
                  <div className="min-w-0">
                    <p
                      className={`text-sm font-medium truncate ${
                        isActive ? "text-amber-200" : "text-slate-300"
                      }`}
                    >
                      {firstNames}
                      {shloka.names.length > 3 && "..."}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Names {shloka.names[0]?.number} -{" "}
                      {shloka.names[shloka.names.length - 1]?.number}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
