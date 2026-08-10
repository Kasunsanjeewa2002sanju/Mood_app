"use client";

import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api-client";
import { MOOD_LEVELS } from "@/lib/mood-levels";
import type { MoodEntry, MoodLevel } from "@/lib/types";
import { HugButton } from "@/components/HugButton";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { MoodMiniHistory } from "@/components/MoodMiniHistory";
import { MoodSlider } from "@/components/MoodSlider";
import { NavToggle } from "@/components/NavToggle";
import { QuickMoodButtons } from "@/components/QuickMoodButtons";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useBackground } from "@/components/BackgroundContext";
import { InteractiveClock } from "@/components/InteractiveClock";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [moodScore, setMoodScore] = useState(2);
  const [selectedMood, setSelectedMood] = useState<MoodLevel>("okay");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [lastEntry, setLastEntry] = useState<MoodEntry | null>(null);
  const [recentEntries, setRecentEntries] = useState<MoodEntry[]>([]);
  const [error, setError] = useState("");

  const { soundEnabled } = useBackground();

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const [latest, history] = await Promise.all([
          apiFetch<{ entry: MoodEntry | null }>("/api/mood/latest"),
          apiFetch<{ entries: MoodEntry[] }>("/api/mood/history?limit=5"),
        ]);
        if (cancelled) return;
        if (latest.entry) {
          setLastEntry(latest.entry);
          const idx = MOOD_LEVELS.findIndex((m) => m.value === latest.entry!.mood);
          if (idx >= 0) {
            setMoodScore(idx);
            setSelectedMood(latest.entry.mood);
          }
        }
        setRecentEntries(history.entries);
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
  }, [router]);

  const playSuccessChime = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {}
  };

  async function handleSubmit() {
    setSubmitting(true);
    setError("");
    setSubmitted(false);

    try {
      const result = await apiFetch<{ entry: MoodEntry }>("/api/mood/submit", {
        method: "POST",
        body: JSON.stringify({ mood: selectedMood }),
      });
      setLastEntry(result.entry);
      setSubmitted(true);
      playSuccessChime();

      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.7 },
        colors: ["#ec4899", "#a855f7", "#3b82f6", "#f43f5e", "#fbbf24"],
      });

      const history = await apiFetch<{ entries: MoodEntry[] }>("/api/mood/history?limit=5");
      setRecentEntries(history.entries);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  }

  function handleQuickMood(mood: MoodLevel) {
    const idx = MOOD_LEVELS.findIndex((m) => m.value === mood);
    if (idx >= 0) {
      setMoodScore(idx);
      setSelectedMood(mood);
    }
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen pb-32">
      {/* Kawaii Header Bar */}
      <header className="flex items-center justify-between px-6 py-4 max-w-lg mx-auto">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-400 to-purple-600 text-xl shadow-md text-white"
          >
            💕
          </motion.div>
          <div>
            <h1 className="font-display text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 dark:from-pink-300 dark:to-purple-300 bg-clip-text text-transparent">
              The Mood Bridge
            </h1>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Share feelings & warm hugs
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </header>

      {/* Main Glass Content */}
      <main className="mx-auto max-w-lg space-y-6 px-4">
        {/* Large Interactive Digital Clock & Date Showcase Widget */}
        <InteractiveClock />

        {/* Share Mood Card */}
        <section aria-labelledby="mood-heading">
          <h2 id="mood-heading" className="sr-only">
            Share your mood
          </h2>
          <div className="rounded-3xl border border-pink-300/40 dark:border-pink-500/30 bg-white/85 dark:bg-slate-900/85 p-6 shadow-2xl backdrop-blur-2xl space-y-5">
            <MoodSlider
              value={moodScore}
              onChange={(score, mood) => {
                setMoodScore(score);
                setSelectedMood(mood);
              }}
            />

            <QuickMoodButtons onSelect={handleQuickMood} disabled={submitting} />

            <motion.button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 py-4 font-black text-white shadow-xl shadow-pink-500/30 disabled:opacity-50 transition-all text-base border border-pink-300/40"
            >
              {submitting ? "Sharing Vibe..." : submitted ? "Saved & Sent! 💕" : "Share Mood 💕"}
            </motion.button>

            {lastEntry && (
              <p className="text-center text-xs font-bold text-slate-400 dark:text-slate-400">
                Last shared:{" "}
                {new Date(lastEntry.date).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            )}

            {error && (
              <p className="mt-2 text-center text-xs font-bold text-red-500 bg-red-50 dark:bg-red-950/40 p-2.5 rounded-2xl border border-red-200 dark:border-red-900" role="alert">
                {error}
              </p>
            )}
          </div>
        </section>

        {/* Send Hug Card */}
        <section aria-labelledby="hug-heading">
          <div className="rounded-3xl border border-pink-300/40 dark:border-pink-500/30 bg-white/85 dark:bg-slate-900/85 p-6 shadow-2xl backdrop-blur-2xl">
            <h2 id="hug-heading" className="mb-3 font-display text-base font-black text-slate-800 dark:text-pink-100 flex items-center gap-2">
              <span className="text-xl animate-bounce">🤗</span> Send Warm Hug
            </h2>
            <HugButton />
          </div>
        </section>

        {/* Recent Mini History Card */}
        <div className="rounded-3xl border border-pink-300/40 dark:border-pink-500/30 bg-white/85 dark:bg-slate-900/85 p-5 shadow-2xl backdrop-blur-2xl">
          <MoodMiniHistory entries={recentEntries} />
        </div>
      </main>

      <NavToggle />
    </div>
  );
}

