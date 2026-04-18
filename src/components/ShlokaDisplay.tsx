"use client";

import { Shloka } from "@/types";

interface ShlokaDisplayProps {
  shloka: Shloka;
}

export default function ShlokaDisplay({ shloka }: ShlokaDisplayProps) {
  return (
    <div className="space-y-6">
      {/* Sanskrit Text */}
      <div className="bg-gradient-to-br from-amber-950/40 to-orange-950/30 border border-amber-800/20 rounded-2xl p-5 sm:p-6">
        <h3 className="text-amber-400/70 text-xs font-semibold tracking-widest uppercase mb-4">
          Sanskrit
        </h3>
        <p className="text-amber-100 text-lg sm:text-xl leading-relaxed whitespace-pre-line font-serif">
          {shloka.sanskrit}
        </p>
      </div>

      {/* Transliteration */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/30 rounded-2xl p-5 sm:p-6">
        <h3 className="text-slate-400 text-xs font-semibold tracking-widest uppercase mb-4">
          Transliteration
        </h3>
        <p className="text-slate-200 text-base sm:text-lg leading-relaxed whitespace-pre-line italic">
          {shloka.transliteration}
        </p>
      </div>

      {/* Names & Meanings */}
      <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/40 border border-slate-700/20 rounded-2xl p-5 sm:p-6">
        <h3 className="text-amber-400/70 text-xs font-semibold tracking-widest uppercase mb-5">
          Names & Meanings
        </h3>
        <div className="space-y-4">
          {shloka.names.map((name) => (
            <div
              key={name.number}
              className="group flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 p-3 rounded-xl hover:bg-amber-900/10 transition-colors"
            >
              <div className="flex items-center gap-3 sm:min-w-[200px]">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-900/30 text-amber-400 text-xs font-bold shrink-0">
                  {name.number}
                </span>
                <div>
                  <p className="text-amber-200 font-medium text-sm">
                    {name.sanskrit}
                  </p>
                  <p className="text-amber-400/60 text-xs italic">
                    {name.transliteration}
                  </p>
                </div>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed sm:pt-1 pl-11 sm:pl-0">
                {name.meaning}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
