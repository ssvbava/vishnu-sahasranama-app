"use client";

interface ProgressBarProps {
  current: number;
  total: number;
  totalNames: number;
  namesCompleted: number;
}

export default function ProgressBar({
  current,
  total,
  totalNames,
  namesCompleted,
}: ProgressBarProps) {
  const progress = (current / total) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-amber-400/70 font-medium">
          Shloka {current} of {total}
        </span>
        <span className="text-slate-400">
          {namesCompleted} / {totalNames} names
        </span>
      </div>
      <div className="w-full h-2 bg-slate-800/80 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-600 via-orange-500 to-amber-400 rounded-full transition-all duration-500 ease-out relative"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </div>
      </div>
    </div>
  );
}
