"use client";

import { motion } from "framer-motion";
import type { MoodEntry } from "@/lib/types";

interface MoodMiniHistoryProps {
  entries: MoodEntry[];
}

export function MoodMiniHistory({ entries }: MoodMiniHistoryProps) {
  if (entries.length === 0) return null;

  return (
    <div className="space-y-2.5 pt-1">
      <p className="text-xs font-black uppercase tracking-wider text-pink-600 dark:text-pink-300 flex items-center gap-1.5 drop-shadow-sm">
        <span>📜</span> Recent Mood Vibe Log
      </p>
      <div className="flex gap-3 overflow-x-auto pb-2 pt-1 scrollbar-none">
        {entries.slice(0, 6).map((entry, idx) => (
          <motion.div
            key={entry.timestamp}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05, type: "spring", stiffness: 350 }}
            whileHover={{ y: -4, scale: 1.06 }}
            className="flex shrink-0 flex-col items-center rounded-2xl border border-pink-300/40 dark:border-pink-500/30 bg-gradient-to-b from-white/90 to-pink-50/50 dark:from-slate-800/90 dark:to-slate-900/90 backdrop-blur-md px-4 py-3 shadow-md shadow-pink-500/5 min-w-[76px]"
          >
            <span className="text-3xl animate-bounce drop-shadow-sm" role="img" aria-label={entry.label}>
              {entry.emoji}
            </span>
            <span className="mt-1.5 text-xs font-black text-slate-800 dark:text-slate-100 capitalize">
              {entry.label}
            </span>
            <span className="text-[10px] font-bold text-pink-600/90 dark:text-pink-300/90">
              {new Date(entry.date).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

