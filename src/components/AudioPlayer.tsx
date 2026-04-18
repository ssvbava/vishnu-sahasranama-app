"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, RotateCcw } from "lucide-react";

interface AudioPlayerProps {
  audioUrl: string;
  shlokaNumber: number;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export default function AudioPlayer({
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
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Use a placeholder sine wave tone as demo audio
  const generateToneUrl = useCallback(() => {
    try {
      const sampleRate = 44100;
      const durationSec = 30;
      const numSamples = sampleRate * durationSec;
      const buffer = new ArrayBuffer(44 + numSamples * 2);
      const view = new DataView(buffer);

      // WAV header
      const writeString = (offset: number, str: string) => {
        for (let i = 0; i < str.length; i++) {
          view.setUint8(offset + i, str.charCodeAt(i));
        }
      };

      writeString(0, "RIFF");
      view.setUint32(4, 36 + numSamples * 2, true);
      writeString(8, "WAVE");
      writeString(12, "fmt ");
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true);
      view.setUint16(22, 1, true);
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate * 2, true);
      view.setUint16(32, 2, true);
      view.setUint16(34, 16, true);
      writeString(36, "data");
      view.setUint32(40, numSamples * 2, true);

      // Generate a gentle OM-like tone with harmonics
      const baseFreq = 136.1; // OM frequency
      for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;
        const envelope = Math.min(1, t * 2) * Math.min(1, (durationSec - t) * 2);
        const sample =
          envelope *
          0.3 *
          (Math.sin(2 * Math.PI * baseFreq * t) * 0.5 +
            Math.sin(2 * Math.PI * baseFreq * 2 * t) * 0.25 +
            Math.sin(2 * Math.PI * baseFreq * 3 * t) * 0.15 +
            Math.sin(2 * Math.PI * baseFreq * 4 * t) * 0.1);
        view.setInt16(44 + i * 2, sample * 32767, true);
      }

      const blob = new Blob([buffer], { type: "audio/wav" });
      return URL.createObjectURL(blob);
    } catch {
      return "";
    }
  }, []);

  useEffect(() => {
    const url = generateToneUrl();
    if (url && audioRef.current) {
      audioRef.current.src = url;
      setIsLoaded(true);
    }
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [shlokaNumber, generateToneUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
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
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !audioRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    audioRef.current.currentTime = percentage * duration;
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `\${mins}:\${secs.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 border border-amber-700/30 rounded-2xl p-4 sm:p-5 backdrop-blur-sm">
      <audio ref={audioRef} preload="metadata" />

      <div className="flex items-center justify-between mb-3">
        <span className="text-amber-400/70 text-xs font-medium tracking-wider uppercase">
          {isLoaded ? "Chanting Audio" : "Loading Audio..."}
        </span>
        <span className="text-amber-400/50 text-xs">
          Shloka {shlokaNumber}
        </span>
      </div>

      {/* Progress Bar */}
      <div
        ref={progressRef}
        className="w-full h-2 bg-amber-950/50 rounded-full cursor-pointer mb-3 group"
        onClick={handleProgressClick}
      >
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full relative transition-all duration-100"
          style={{ width: `\${progress}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-amber-400 rounded-full shadow-lg shadow-amber-500/50 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* Time Display */}
      <div className="flex justify-between text-xs text-amber-400/50 mb-4">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 sm:gap-5">
        <button
          onClick={toggleMute}
          className="p-2 text-amber-400/60 hover:text-amber-300 transition-colors"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>

        <button
          onClick={() => {
            setIsPlaying(false);
            onPrev?.();
          }}
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
          onClick={() => {
            setIsPlaying(false);
            onNext?.();
          }}
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
