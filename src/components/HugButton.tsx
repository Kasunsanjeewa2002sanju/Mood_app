"use client";

import { motion } from "framer-motion";
import { useCallback, useState } from "react";
import { apiFetch } from "@/lib/api-client";
import { HugAnimation } from "./HugAnimation";
import { useBackground } from "./BackgroundContext";

type AnimationStyle = "hearts" | "stars" | "sparkles";

export function HugButton() {
  const [animating, setAnimating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [animationStyle, setAnimationStyle] = useState<AnimationStyle>("hearts");
  const [note, setNote] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);

  const { soundEnabled } = useBackground();

  const handleComplete = useCallback(() => setAnimating(false), []);

  const playHugAudio = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const playNote = (freq: number, timeOffset: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.12, ctx.currentTime + timeOffset);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + timeOffset + 0.6);
        osc.start(ctx.currentTime + timeOffset);
        osc.stop(ctx.currentTime + timeOffset + 0.6);
      };
      playNote(523.25, 0); // C5
      playNote(659.25, 0.15); // E5
      playNote(783.99, 0.3); // G5
      playNote(1046.5, 0.45); // C6
    } catch {
      // Audio optional
    }
  };

  async function handleSendHug() {
    if (loading || cooldown > 0) return;
    setError("");
    setLoading(true);

    try {
      const result = await apiFetch<{
        success: boolean;
        notification?: { sent: boolean; provider?: string };
        telegramConfigured?: boolean;
      }>("/api/hug/send", {
        method: "POST",
        body: JSON.stringify({ note: note.trim() || undefined }),
      });

      setAnimating(true);
      playHugAudio();
      setNote("");
      setShowNoteInput(false);

      if (!result.notification?.sent) {
        setError(
          result.telegramConfigured
            ? "Hug sent, but Telegram failed — check your Chat ID (run: node scripts/telegram-setup.mjs)"
            : "Hug sent, but Telegram not set up — save TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in .env.local"
        );
      }

      setCooldown(60);
      const interval = setInterval(() => {
        setCooldown((c) => {
          if (c <= 1) {
            clearInterval(interval);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to send hug";
      if (message.includes("wait")) {
        setCooldown(parseInt(message.match(/\d+/)?.[0] ?? "60", 10));
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <HugAnimation active={animating} style={animationStyle} onComplete={handleComplete} />

      <div className="space-y-3">
        {/* Style Selector Pills */}
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-pink-600/80 dark:text-pink-300/80 flex items-center gap-1">
            <span>🎁</span> Hug Animation:
          </span>
          <div className="flex gap-1">
            {(
              [
                { id: "hearts", label: "Hearts", icon: "💕" },
                { id: "stars", label: "Stars", icon: "✨" },
                { id: "sparkles", label: "Sparkles", icon: "🌸" },
              ] as const
            ).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setAnimationStyle(s.id)}
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                  animationStyle === s.id
                    ? "bg-pink-500 text-white shadow-sm scale-105"
                    : "bg-white/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border border-pink-200/50 hover:bg-pink-100/50"
                }`}
              >
                {s.icon} {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Note Attachment Toggle */}
        {showNoteInput ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-2"
          >
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Write a sweet note with your hug... 💌"
              maxLength={100}
              className="w-full rounded-2xl border border-pink-200 dark:border-pink-500/30 bg-white/80 dark:bg-slate-900/80 px-4 py-2 text-xs text-foreground placeholder:text-muted focus:border-pink-500 focus:outline-none backdrop-blur-md"
            />
          </motion.div>
        ) : (
          <button
            type="button"
            onClick={() => setShowNoteInput(true)}
            className="text-[11px] font-semibold text-pink-500 hover:underline flex items-center gap-1 px-1"
          >
            <span>💌</span> Add a sweet note to this hug?
          </button>
        )}

        {/* Big Kawaii Hug Button */}
        <motion.button
          type="button"
          onClick={handleSendHug}
          disabled={loading || cooldown > 0}
          whileHover={{ scale: cooldown > 0 ? 1 : 1.03 }}
          whileTap={{ scale: cooldown > 0 ? 1 : 0.97 }}
          className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 py-6 text-xl font-bold text-white shadow-xl shadow-pink-500/30 disabled:opacity-60 transition-all border border-pink-300/40"
          aria-label="Send a digital hug"
        >
          {/* Animated Sheen Overlay */}
          <motion.div
            animate={{ x: ["-100%", "200%"] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none"
          />

          <motion.span
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="flex items-center justify-center gap-3 relative z-10"
          >
            <span className="text-3xl animate-bounce" aria-hidden>
              🤗
            </span>
            <span>
              {loading ? "Sending Hug..." : cooldown > 0 ? `Wait ${cooldown}s` : "Send Warm Hug 💕"}
            </span>
          </motion.span>
        </motion.button>

        {error && (
          <p className="text-center text-xs text-red-500 font-medium bg-red-50 dark:bg-red-950/40 p-2 rounded-xl border border-red-200 dark:border-red-900" role="alert">
            {error}
          </p>
        )}
      </div>
    </>
  );
}
