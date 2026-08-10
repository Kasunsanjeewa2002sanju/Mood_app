"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    setMounted(true);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <motion.button
      type="button"
      onClick={toggle}
      whileHover={{ scale: 1.1, rotate: 15 }}
      whileTap={{ scale: 0.9 }}
      className="flex items-center justify-center w-9 h-9 rounded-full border border-pink-200/50 dark:border-pink-500/30 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md shadow-sm text-sm"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {mounted ? (dark ? "☀️" : "🌙") : "🌙"}
    </motion.button>
  );
}
