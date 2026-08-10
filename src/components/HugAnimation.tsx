"use client";

import { useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";

type AnimationStyle = "hearts" | "stars" | "sparkles";

interface Particle {
  id: number;
  x: number;
  y: number;
  emoji: string;
  delay: number;
}

const STYLE_EMOJIS: Record<AnimationStyle, string[]> = {
  hearts: ["💕", "❤️", "💖", "💗", "🩷", "🤗"],
  stars: ["⭐", "✨", "🌟", "💫", "⚡", "🤗"],
  sparkles: ["✨", "💎", "🌸", "🦋", "🌺", "🤗"],
};

function createParticles(style: AnimationStyle): Particle[] {
  const emojis = STYLE_EMOJIS[style];
  return Array.from({ length: 28 }, (_, i) => ({
    id: i,
    x: Math.random() * 90 + 5,
    y: Math.random() * 90 + 5,
    emoji: emojis[i % emojis.length],
    delay: Math.random() * 0.6,
  }));
}

interface HugAnimationProps {
  active: boolean;
  style?: AnimationStyle;
  onComplete: () => void;
}

export function HugAnimation({ active, style = "hearts", onComplete }: HugAnimationProps) {
  const particles = useMemo(
    () => (active ? createParticles(style) : []),
    [active, style]
  );

  useEffect(() => {
    if (!active) return;
    const timer = setTimeout(onComplete, 3200);
    return () => clearTimeout(timer);
  }, [active, onComplete]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md p-4"
          aria-live="polite"
          aria-label="Cute hug animation playing"
        >
          {/* Pulse Rings */}
          <motion.div
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: [0, 2, 1.8], opacity: [0.8, 0.4, 0] }}
            transition={{ duration: 2.5, ease: "easeOut" }}
            className="absolute h-72 w-72 sm:h-96 sm:w-96 rounded-full border-4 border-pink-400/60 pointer-events-none"
          />
          <motion.div
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: [0, 2.5, 2.2], opacity: [0.8, 0.3, 0] }}
            transition={{ duration: 2.5, delay: 0.2, ease: "easeOut" }}
            className="absolute h-60 w-60 sm:h-80 sm:w-80 rounded-full border-2 border-purple-400/40 pointer-events-none"
          />

          {/* Floating Emoji Explosion */}
          {particles.map((p) => (
            <motion.span
              key={p.id}
              initial={{ opacity: 0, scale: 0, x: "50vw", y: "50vh" }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0, 1.4, 1, 0.4],
                x: `${p.x}vw`,
                y: `${p.y}vh`,
              }}
              transition={{ duration: 2.8, delay: p.delay, ease: "easeOut" }}
              className="absolute text-3xl sm:text-4xl pointer-events-none filter drop-shadow-md"
              aria-hidden
            >
              {p.emoji}
            </motion.span>
          ))}

          {/* Adorable Cute Hugging Sticker Graphic */}
          <motion.div
            initial={{ scale: 0, rotate: -15, y: 40 }}
            animate={{
              scale: 1,
              rotate: 0,
              y: 0,
            }}
            transition={{ type: "spring", stiffness: 350, damping: 14 }}
            className="relative z-10 flex flex-col items-center"
          >
            <div className="relative max-w-[260px] sm:max-w-[320px]">
              <motion.img
                src="/stickers/cute_bear_hug_sticker.png"
                alt="Cute Bears Hugging Sticker"
                animate={{ scale: [1, 1.06, 1], rotate: [0, 2, -2, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="w-full h-auto object-contain filter drop-shadow-[0_10px_30px_rgba(236,72,153,0.6)]"
              />
              <div className="absolute -top-3 -right-3 text-3xl animate-bounce">💕</div>
              <div className="absolute -bottom-3 -left-3 text-3xl animate-bounce" style={{ animationDelay: "0.4s" }}>✨</div>
            </div>

            {/* Hug Sent Text Banner */}
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="mt-6 text-center"
            >
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] bg-gradient-to-r from-pink-300 via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Warm Hug Sent! 💕🤗
              </h2>
              <p className="mt-1 text-xs sm:text-sm font-bold text-pink-200 drop-shadow-md">
                You just shared a big cozy hug!
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
