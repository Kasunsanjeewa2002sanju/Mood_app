"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function InteractiveClock() {
  const [time, setTime] = useState<Date | null>(null);
  const [use24Hour, setUse24Hour] = useState(false);
  const [isToggled, setIsToggled] = useState(false);

  useEffect(() => {
    setTime(new Date());
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) {
    return (
      <div className="py-4 text-center animate-pulse">
        <div className="h-12 w-48 mx-auto bg-white/20 rounded-2xl" />
      </div>
    );
  }

  const hours = time.getHours();
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const seconds = time.getSeconds().toString().padStart(2, "0");

  let displayHours = hours;
  let ampm = "";
  if (!use24Hour) {
    ampm = hours >= 12 ? "PM" : "AM";
    displayHours = hours % 12 || 12;
  }
  const formattedHours = displayHours.toString().padStart(2, "0");

  const weekday = time.toLocaleDateString(undefined, { weekday: "long" });
  const fullDate = time.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Time-of-day greeting
  let greeting = "Good Evening 🌙";
  let greetingIcon = "✨";
  if (hours >= 5 && hours < 12) {
    greeting = "Good Morning ☀️";
    greetingIcon = "🌅";
  } else if (hours >= 12 && hours < 17) {
    greeting = "Good Afternoon 🌤️";
    greetingIcon = "🌸";
  }

  const handleClockClick = () => {
    setUse24Hour(!use24Hour);
    setIsToggled(true);
    setTimeout(() => setIsToggled(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={handleClockClick}
      className="relative cursor-pointer select-none text-center py-4 px-2"
      title="Click to toggle 12h / 24h format"
    >
      {/* Greeting Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/30 dark:border-pink-500/20 shadow-sm mb-3">
        <span className="text-sm">{greetingIcon}</span>
        <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-pink-700 dark:text-pink-300 drop-shadow-sm">
          {greeting}
        </span>
        <span className="flex h-2.5 w-2.5 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-pink-500"></span>
        </span>
      </div>

      {/* Big Borderless Digital Clock */}
      <div className="flex items-baseline justify-center gap-1.5 font-display tracking-tight drop-shadow-lg">
        <span className="text-6xl sm:text-8xl font-black text-white dark:text-pink-100 drop-shadow-[0_6px_16px_rgba(0,0,0,0.4)]">
          {formattedHours}:{minutes}
        </span>
        <motion.span
          key={seconds}
          initial={{ opacity: 0.6, y: -2 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl font-black text-pink-300 dark:text-pink-300 drop-shadow-[0_3px_10px_rgba(0,0,0,0.5)] min-w-[2ch]"
        >
          :{seconds}
        </motion.span>
        {!use24Hour && (
          <span className="ml-1 text-sm sm:text-base font-black text-white uppercase bg-pink-500/80 backdrop-blur-md px-2.5 py-1 rounded-xl shadow-md">
            {ampm}
          </span>
        )}
      </div>

      {/* Date Text */}
      <div className="mt-3 flex items-center justify-center gap-2 text-white dark:text-pink-100 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
        <span className="text-lg sm:text-xl font-black text-pink-200">{weekday},</span>
        <span className="text-sm sm:text-lg font-black opacity-95">{fullDate}</span>
      </div>

      {/* Toggle Hint Toast */}
      <AnimatePresence>
        {isToggled && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="mt-2 inline-block text-[10px] font-extrabold text-white bg-pink-600/90 px-3 py-1 rounded-full shadow-md backdrop-blur-md"
          >
            Toggled to {use24Hour ? "24-Hour" : "12-Hour"} Mode! ⏱️
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
