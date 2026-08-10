"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { setStoredPin } from "@/lib/api-client";

interface LoginScreenProps {
  onSuccess: () => void;
}

export function LoginScreen({ onSuccess }: LoginScreenProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!pin) return;
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Invalid PIN code");
        return;
      }

      setStoredPin(pin);
      onSuccess();
    } catch {
      setError("Connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const handleKeypadPress = (num: string) => {
    if (pin.length < 8) {
      setPin((prev) => prev + num);
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 350 }}
        className="w-full max-w-sm rounded-3xl border border-pink-300/40 dark:border-pink-500/30 bg-white/85 dark:bg-slate-900/85 p-7 shadow-2xl backdrop-blur-xl relative overflow-hidden"
      >
        {/* Floating sparkles decor */}
        <span className="absolute top-3 left-4 text-lg animate-bounce pointer-events-none">✨</span>
        <span className="absolute top-4 right-4 text-lg animate-pulse pointer-events-none">🌸</span>

        <div className="mb-6 text-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 6, -6, 0] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
            className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-pink-400 via-rose-500 to-purple-600 text-4xl shadow-xl shadow-pink-500/30 text-white"
            aria-hidden
          >
            💕
          </motion.div>
          <h1 className="font-display text-2xl font-black bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 dark:from-pink-300 dark:to-purple-300 bg-clip-text text-transparent">
            The Mood Bridge
          </h1>
          <p className="mt-1 text-xs font-bold text-slate-500 dark:text-slate-400">
            Welcome to your cute private vibe room 💕
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="pin" className="sr-only">
              Enter Passcode
            </label>
            <div className="relative">
              <input
                id="pin"
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={8}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                placeholder="••••"
                className="w-full rounded-2xl border border-pink-300/50 dark:border-pink-500/30 bg-white/80 dark:bg-slate-800/80 px-4 py-3.5 text-center text-2xl tracking-[0.5em] font-black text-slate-800 dark:text-pink-100 placeholder:tracking-normal placeholder:text-pink-300/60 focus:border-pink-500 focus:outline-none focus:ring-4 focus:ring-pink-500/20 backdrop-blur-md transition-all shadow-inner"
                autoComplete="off"
                aria-describedby={error ? "pin-error" : undefined}
                disabled={loading}
              />
            </div>
          </div>

          {/* Quick Cute Keypad */}
          <div className="grid grid-cols-3 gap-2 py-1">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
              <motion.button
                key={num}
                type="button"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => handleKeypadPress(num)}
                className="py-2.5 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-pink-200/50 dark:border-pink-500/20 text-slate-700 dark:text-slate-200 font-black text-base shadow-sm hover:bg-pink-50 dark:hover:bg-slate-700 hover:text-pink-600 dark:hover:text-pink-300 transition-colors"
              >
                {num}
              </motion.button>
            ))}
            <motion.button
              type="button"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setPin("")}
              className="py-2.5 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-pink-200/50 dark:border-pink-500/20 text-slate-500 text-xs font-bold shadow-sm"
            >
              Clear
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => handleKeypadPress("0")}
              className="py-2.5 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-pink-200/50 dark:border-pink-500/20 text-slate-700 dark:text-slate-200 font-black text-base shadow-sm hover:bg-pink-50 dark:hover:bg-slate-700 hover:text-pink-600 dark:hover:text-pink-300 transition-colors"
            >
              0
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleBackspace}
              className="py-2.5 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-pink-200/50 dark:border-pink-500/20 text-slate-500 text-xs font-bold shadow-sm"
            >
              ⌫
            </motion.button>
          </div>

          {error && (
            <motion.p
              id="pin-error"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-xs font-bold text-red-500 bg-red-50 dark:bg-red-950/50 p-2.5 rounded-2xl border border-red-200 dark:border-red-900"
              role="alert"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            type="submit"
            disabled={loading || pin.length < 1}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 py-4 font-black text-white shadow-lg shadow-pink-500/30 transition-opacity disabled:opacity-50 text-base border border-pink-300/40"
          >
            {loading ? "Unlocking Room..." : "Unlock Passcode ✨"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

