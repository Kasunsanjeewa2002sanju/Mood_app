"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export function NavToggle() {
  const pathname = usePathname();

  const tabs = [
    { href: "/dashboard", label: "Share Mood", icon: "💭" },
    { href: "/history", label: "Vibe History", icon: "📊" },
  ];

  return (
    <nav
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-sm rounded-full border border-pink-300/40 dark:border-pink-500/30 bg-white/85 dark:bg-slate-900/85 p-2 shadow-2xl shadow-pink-500/10 backdrop-blur-2xl"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="relative flex flex-1 items-center justify-center gap-2 py-3 rounded-full text-xs font-black transition-all"
              aria-current={active ? "page" : undefined}
            >
              {active && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 shadow-lg shadow-pink-500/30"
                  transition={{ type: "spring", stiffness: 450, damping: 28 }}
                />
              )}
              <span className={`relative z-10 text-xl transition-transform ${active ? "animate-bounce" : "opacity-75"}`} aria-hidden>
                {tab.icon}
              </span>
              <span className={`relative z-10 font-black tracking-wide ${active ? "text-white drop-shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

