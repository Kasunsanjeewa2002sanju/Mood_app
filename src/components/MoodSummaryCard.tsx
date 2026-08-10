"use client";

import { motion } from "framer-motion";
import type { MoodSummary } from "@/lib/types";

interface MoodSummaryCardProps {
  summary: MoodSummary;
}

export function MoodSummaryCard({ summary }: MoodSummaryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-pink-300/40 dark:border-pink-500/30 bg-white/80 dark:bg-slate-900/80 p-5 shadow-xl backdrop-blur-xl"
    >
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-400 to-purple-600 text-lg text-white shadow-md">
          ✨
        </span>
        <div>
          <h3 className="font-display text-base font-black bg-gradient-to-r from-pink-600 to-purple-600 dark:from-pink-300 dark:to-purple-300 bg-clip-text text-transparent">
            Weekly Vibe Summary
          </h3>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{summary.weekLabel}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        <motion.div
          whileHover={{ scale: 1.05, y: -2 }}
          className="rounded-2xl border border-emerald-300/40 dark:border-emerald-500/30 bg-gradient-to-b from-emerald-50/80 to-teal-50/80 dark:from-emerald-950/40 dark:to-teal-950/40 p-3.5 shadow-sm backdrop-blur-md"
        >
          <p className="text-3xl font-black text-emerald-500 drop-shadow-sm">{summary.goodDays}</p>
          <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200 mt-1">Good Days 🌟</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05, y: -2 }}
          className="rounded-2xl border border-amber-300/40 dark:border-amber-500/30 bg-gradient-to-b from-amber-50/80 to-orange-50/80 dark:from-amber-950/40 dark:to-orange-950/40 p-3.5 shadow-sm backdrop-blur-md"
        >
          <p className="text-3xl font-black text-amber-500 drop-shadow-sm">{summary.okayDays}</p>
          <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200 mt-1">Okay Days ☁️</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05, y: -2 }}
          className="rounded-2xl border border-rose-300/40 dark:border-rose-500/30 bg-gradient-to-b from-rose-50/80 to-pink-50/80 dark:from-rose-950/40 dark:to-pink-950/40 p-3.5 shadow-sm backdrop-blur-md"
        >
          <p className="text-3xl font-black text-rose-500 drop-shadow-sm">{summary.lowDays}</p>
          <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200 mt-1">Low Days 🌧️</p>
        </motion.div>
      </div>
    </motion.div>
  );
}

