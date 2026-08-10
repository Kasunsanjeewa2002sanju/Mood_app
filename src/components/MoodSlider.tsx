"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MOOD_LEVELS, scoreToMood } from "@/lib/mood-levels";
import type { MoodLevel } from "@/lib/types";

interface MoodSliderProps {
  value: number;
  onChange: (score: number, mood: MoodLevel) => void;
}

export function MoodSlider({ value, onChange }: MoodSliderProps) {
  const currentMood = scoreToMood(value);
  const config = MOOD_LEVELS.find((m) => m.value === currentMood)!;

  const moodGlows: Record<string, string> = {
    sad: "from-blue-400/30 to-indigo-500/30 shadow-blue-400/30",
    low: "from-amber-400/30 to-orange-500/30 shadow-amber-400/30",
    okay: "from-yellow-400/30 to-lime-500/30 shadow-yellow-400/30",
    good: "from-emerald-400/30 to-teal-500/30 shadow-emerald-400/30",
    happy: "from-pink-400/30 to-rose-500/30 shadow-pink-400/30",
    ecstatic: "from-purple-400/40 to-pink-500/40 shadow-purple-500/40",
  };

  const glowClass = moodGlows[config.value] || "from-pink-400/30 to-purple-500/30";

  return (
    <div className="space-y-6">
      {/* Kawaii Stage */}
      <div className="relative flex flex-col items-center justify-center py-4">
        {/* Glow Halo Background */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, 8, -8, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className={`absolute w-40 h-40 rounded-full bg-gradient-to-tr ${glowClass} blur-2xl pointer-events-none`}
        />

        {/* Floating Sparkle Decor */}
        <span className="absolute top-1 left-8 text-lg animate-bounce pointer-events-none">✨</span>
        <span className="absolute bottom-2 right-8 text-lg animate-pulse pointer-events-none">💕</span>

        {/* Bouncy Big Emoji Avatar */}
        <AnimatePresence mode="wait">
          <motion.div
            key={config.emoji}
            initial={{ scale: 0.2, y: -25, rotate: -20, opacity: 0 }}
            animate={{ scale: 1, y: 0, rotate: 0, opacity: 1 }}
            exit={{ scale: 0.2, y: 25, rotate: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 450, damping: 18 }}
            className="relative cursor-pointer select-none py-2"
            whileHover={{ scale: 1.18, rotate: 6 }}
            whileTap={{ scale: 0.88 }}
          >
            <span className="text-8xl drop-shadow-xl block filter hover:brightness-110" role="img" aria-label={config.label}>
              {config.emoji}
            </span>
          </motion.div>
        </AnimatePresence>

        {/* Cute Mood Title & Score Pill */}
        <AnimatePresence mode="wait">
          <motion.div
            key={config.label}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="mt-2 text-center"
          >
            <span
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full font-display text-xl font-black shadow-md backdrop-blur-lg transition-colors"
              style={{
                backgroundColor: `${config.color}25`,
                color: config.color,
                border: `2px solid ${config.color}60`,
              }}
            >
              <span>{config.emoji}</span>
              <span>{config.label}</span>
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Interactive Range Slider */}
      <div className="px-2">
        <label htmlFor="mood-slider" className="sr-only">
          Select your mood level
        </label>
        <input
          id="mood-slider"
          type="range"
          min={0}
          max={MOOD_LEVELS.length - 1}
          step={1}
          value={value}
          onChange={(e) => {
            const score = parseInt(e.target.value, 10);
            onChange(score, scoreToMood(score));
          }}
          className="mood-slider w-full cursor-pointer"
          aria-valuemin={0}
          aria-valuemax={MOOD_LEVELS.length - 1}
          aria-valuenow={value}
          aria-valuetext={config.label}
        />

        {/* Cute Emoji Step Indicators */}
        <div className="mt-4 flex justify-between px-1">
          {MOOD_LEVELS.map((m, idx) => {
            const isSelected = idx === value;
            return (
              <button
                key={m.value}
                type="button"
                onClick={() => onChange(idx, m.value)}
                className={`group relative transition-all duration-300 p-2 rounded-2xl flex flex-col items-center gap-0.5 ${
                  isSelected
                    ? "scale-125 bg-gradient-to-b from-pink-400/20 to-purple-500/20 ring-2 ring-pink-400 shadow-md"
                    : "opacity-60 hover:opacity-100 hover:scale-110"
                }`}
                aria-label={`Set mood to ${m.label}`}
              >
                <span className="text-2xl transition-transform duration-200 group-hover:scale-125">{m.emoji}</span>
                <span className={`text-[10px] font-extrabold capitalize ${isSelected ? "text-pink-600 dark:text-pink-300" : "text-slate-500 dark:text-slate-400"}`}>
                  {m.value}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

