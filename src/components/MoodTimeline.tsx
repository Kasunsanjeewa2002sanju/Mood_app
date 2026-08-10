"use client";

import { motion } from "framer-motion";
import type { MoodEntry } from "@/lib/types";

interface MoodTimelineProps {
  entries: MoodEntry[];
}

export function MoodTimeline({ entries }: MoodTimelineProps) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center rounded-3xl border border-pink-300/40 dark:border-pink-500/30 bg-white/80 dark:bg-slate-900/80 p-6 shadow-xl backdrop-blur-xl">
        <span className="text-6xl animate-bounce" aria-hidden>
          🌱
        </span>
        <p className="mt-4 font-display text-xl font-black text-slate-800 dark:text-pink-100">
          No mood vibes logged yet
        </p>
        <p className="mt-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 max-w-xs">
          Share your first mood vibe on the home screen 💕
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3.5" role="list" aria-label="Mood timeline">
      {entries.map((entry, i) => (
        <motion.div
          key={entry.timestamp}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04, type: "spring", stiffness: 350, damping: 22 }}
          whileHover={{ scale: 1.02, x: 4 }}
          role="listitem"
          className="flex items-center gap-4 rounded-3xl border border-pink-300/40 dark:border-pink-500/30 bg-white/85 dark:bg-slate-900/85 p-4 shadow-md shadow-pink-500/5 backdrop-blur-xl transition-all"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-950/60 dark:to-purple-950/60 text-4xl shadow-inner border border-pink-200/50 dark:border-pink-500/20">
            {entry.emoji}
          </div>
          <div className="flex-1">
            <p className="font-black text-base text-slate-800 dark:text-pink-100 capitalize flex items-center gap-1.5">
              <span>{entry.label}</span>
            </p>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5">
              {new Date(entry.date).toLocaleDateString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
          <time className="text-xs font-black text-pink-600 dark:text-pink-300 bg-pink-100/60 dark:bg-pink-950/50 px-3 py-1.5 rounded-full border border-pink-200/50 dark:border-pink-500/20" dateTime={entry.date}>
            {new Date(entry.date).toLocaleTimeString(undefined, {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </time>
        </motion.div>
      ))}
    </div>
  );
}

