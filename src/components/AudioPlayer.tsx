"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, RotateCcw } from "lucide-react";

interface AudioPlayerProps {
  audioUrl: string;
  startTime?: number;
  endTime?: number;
  shlokaNumber: number;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export default function AudioPlayer({
  audioUrl,
  startTime = 0,
  endTime,
  shlokaNumber,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Load and handle source changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Only update source if it's actually different to avoid reloading large files
    const fullAudioUrl = audioUrl.startsWith('http') ? audioUrl : window.location.origin + audioUrl;
    if (audio.src !== fullAudioUrl) {
      audio.src = audioUrl;
      audio.load();
    }

    // Seek to start time whenever shloka changes
    audio.currentTime = startTime;
    setCurrentTime(startTime);
    
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    }
  }, [audioUrl, startTime, shlokaNumber]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
    };

    const updateDuration = () => setDuration(audio.duration);
    const handleEnd = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnd);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnd);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const restart = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = startTime;
    setCurrentTime(startTime);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !audioRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    
    if (endTime && endTime > startTime) {
        const segmentDuration = endTime - startTime;
        audioRef.current.currentTime = startTime + (percentage * segmentDuration);
    } else {
        audioRef.current.currentTime = percentage * duration;
    }
  };

  const formatTime = (time: number) => {
    const relativeTime = time - startTime;
    const displayTime = relativeTime > 0 ? relativeTime : 0;
    const mins = Math.floor(displayTime / 60);
    const secs = Math.floor(displayTime % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  let progress = 0;
  if (endTime && endTime > startTime) {
    progress = Math.min(100, Math.max(0, ((currentTime - startTime) / (endTime - startTime)) * 100));
  } else if (duration > 0) {
    progress = (currentTime / duration) * 100;
  }

  return (
    <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 border border-amber-700/30 rounded-2xl p-4 sm:p-5 backdrop-blur-sm">
      <audio ref={audioRef} preload="auto" />

      <div className="flex items-center justify-between mb-3">
        <span className="text-amber-400/70 text-xs font-medium tracking-wider uppercase">
          MS Subbulakshmi Chanting
        </span>
        <span className="text-amber-400/50 text-xs">
          Shloka {shlokaNumber}
        </span>
      </div>

      <div
        ref={progressRef}
        className="w-full h-2 bg-amber-950/50 rounded-full cursor-pointer mb-3 group"
        onClick={handleProgressClick}
      >
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full relative transition-all duration-100"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-amber-400 rounded-full shadow-lg shadow-amber-500/50 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      <div className="flex justify-between text-xs text-amber-400/50 mb-4">
        <span>{formatTime(currentTime)}</span>
        <span>{endTime ? formatTime(endTime) : "..."}</span>
      </div>

      <div className="flex items-center justify-center gap-3 sm:gap-5">
        <button
          onClick={toggleMute}
          className="p-2 text-amber-400/60 hover:text-amber-300 transition-colors"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>

        <button
          onClick={() => onPrev?.()}
          disabled={!hasPrev}
          className="p-2 text-amber-400/60 hover:text-amber-300 disabled:text-amber-900/50 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous shloka"
        >
          <SkipBack size={20} />
        </button>

        <button
          onClick={togglePlay}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center hover:from-amber-400 hover:to-orange-500 transition-all shadow-lg shadow-amber-600/30 active:scale-95"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause size={24} className="text-white" />
          ) : (
            <Play size={24} className="text-white ml-1" />
          )}
        </button>

        <button
          onClick={() => onNext?.()}
          disabled={!hasNext}
          className="p-2 text-amber-400/60 hover:text-amber-300 disabled:text-amber-900/50 disabled:cursor-not-allowed transition-colors"
          aria-label="Next shloka"
        >
          <SkipForward size={20} />
        </button>

        <button
          onClick={restart}
          className="p-2 text-amber-400/60 hover:text-amber-300 transition-colors"
          aria-label="Restart"
        >
          <RotateCcw size={18} />
        </button>
      </div>
    </div>
  );
}
