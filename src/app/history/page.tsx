"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { apiFetch } from "@/lib/api-client";
import type { MoodEntry, MoodSummary } from "@/lib/types";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { MoodChart } from "@/components/MoodChart";
import { MoodSummaryCard } from "@/components/MoodSummaryCard";
import { MoodTimeline } from "@/components/MoodTimeline";
import { NavToggle } from "@/components/NavToggle";
import { ThemeToggle } from "@/components/ThemeToggle";

type DateFilter = "7" | "30" | "all";

export default function HistoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [summary, setSummary] = useState<MoodSummary | null>(null);
  const [filter, setFilter] = useState<DateFilter>("7");

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const daysParam = filter === "all" ? "" : `&days=${filter}`;
        const daysForSummary = filter === "all" ? 365 : parseInt(filter, 10);

        const [history, stats] = await Promise.all([
          apiFetch<{ entries: MoodEntry[] }>(`/api/mood/history?limit=100${daysParam}`),
          apiFetch<{ summary: MoodSummary }>(`/api/stats/summary?days=${daysForSummary}`),
        ]);

        if (cancelled) return;
        setEntries(history.entries);
        setSummary(stats.summary);
      } catch {
        if (!cancelled) router.push("/");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void fetchData();
    return () => {
      cancelled = true;
    };
  }, [filter, router]);

  function exportCsv() {
    if (entries.length === 0) return;
    const header = "Date,Time,Mood,Emoji,Label\n";
    const rows = entries
      .map((e) => {
        const d = new Date(e.date);
        return `${d.toLocaleDateString()},${d.toLocaleTimeString()},${e.mood},${e.emoji},${e.label}`;
      })
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mood-history-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen pb-32">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 max-w-lg mx-auto">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-400 to-purple-600 text-xl shadow-md text-white">
            📊
          </div>
          <div>
            <h1 className="font-display text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 dark:from-pink-300 dark:to-purple-300 bg-clip-text text-transparent">
              Mood History
            </h1>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Track emotional trends & feelings
            </p>
          </div>
        </div>
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-lg space-y-6 px-4">
        {/* Date Filter Pills */}
        <div className="flex items-center gap-2 p-2 rounded-3xl bg-white/85 dark:bg-slate-900/85 border border-pink-300/40 dark:border-pink-500/30 backdrop-blur-2xl shadow-lg">
          {(["7", "30", "all"] as DateFilter[]).map((f) => {
            const active = filter === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => {
                  setFilter(f);
                  setLoading(true);
                }}
                className={`flex-1 py-2.5 rounded-2xl text-xs font-black transition-all ${
                  active
                    ? "bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white shadow-md shadow-pink-500/20 scale-102"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-pink-50/50 dark:hover:bg-slate-800/50"
                }`}
              >
                {f === "all" ? "All Time 🗓️" : `Last ${f} Days 📅`}
              </button>
            );
          })}
        </div>

        {summary && <MoodSummaryCard summary={summary} />}
        <MoodChart entries={entries} />
        <MoodTimeline entries={entries} />

        {entries.length > 0 && (
          <motion.button
            type="button"
            onClick={exportCsv}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full rounded-2xl border border-pink-300/40 dark:border-pink-500/30 bg-white/85 dark:bg-slate-900/85 py-4 text-xs font-black text-pink-600 dark:text-pink-300 shadow-lg backdrop-blur-2xl transition-all flex items-center justify-center gap-2"
          >
            <span className="text-lg">📥</span> Export History as CSV
          </motion.button>
        )}
      </main>

      <NavToggle />
    </div>
  );
}
