"use client";

import { motion } from "framer-motion";
import { QUICK_MOODS } from "@/lib/mood-levels";
import type { MoodLevel } from "@/lib/types";

interface QuickMoodButtonsProps {
  onSelect: (mood: MoodLevel) => void;
  disabled?: boolean;
}

export function QuickMoodButtons({ onSelect, disabled }: QuickMoodButtonsProps) {
  return (
    <div className="space-y-2.5 pt-2">
      <p className="text-xs font-black uppercase tracking-wider text-pink-600 dark:text-pink-300 flex items-center gap-1.5 drop-shadow-sm">
        <span className="animate-spin text-sm">✨</span> Quick Vibe Presets
      </p>
      <div className="flex flex-wrap gap-2">
        {QUICK_MOODS.map((q, idx) => (
          <motion.button
            key={q.label}
            type="button"
            disabled={disabled}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.04, type: "spring", stiffness: 380, damping: 20 }}
            whileHover={{ scale: 1.08, y: -3 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => onSelect(q.mood)}
            className="group flex items-center gap-2 rounded-2xl border border-pink-300/40 dark:border-pink-500/30 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-md shadow-pink-500/5 transition-all hover:border-pink-400 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 dark:hover:from-pink-950/50 dark:hover:to-purple-950/50 hover:text-pink-600 dark:hover:text-pink-300 disabled:opacity-50"
            aria-label={`Quick mood: ${q.label}`}
          >
            <span className="text-lg transition-transform duration-200 group-hover:scale-125">{q.emoji}</span>
            <span>{q.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

