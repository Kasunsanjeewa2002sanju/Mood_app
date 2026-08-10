"use client";

import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBackground, WallpaperPreset, ParticleStyle } from "./BackgroundContext";

export function BackgroundPicker() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"pictures" | "effects">("pictures");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    wallpaper,
    setWallpaper,
    customWallpaperUrl,
    blurLevel,
    setBlurLevel,
    overlayOpacity,
    setOverlayOpacity,
    particleStyle,
    setParticleStyle,
    soundEnabled,
    setSoundEnabled,
    uploadCustomWallpaper,
    resetToDefault,
  } = useBackground();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await uploadCustomWallpaper(file);
    } catch (err) {
      alert("Failed to upload image. Please choose a smaller image file.");
    }
  };

  const presets: { id: WallpaperPreset; title: string; image: string | null; icon: string }[] = [
    {
      id: "cute_pastel_sky",
      title: "Pastel Dream Sky",
      image: "/wallpapers/cute_pastel_sky.png",
      icon: "☁️",
    },
    {
      id: "cute_cozy_room",
      title: "Cozy Anime Room",
      image: "/wallpapers/cute_cozy_room.png",
      icon: "🏡",
    },
    {
      id: "cute_sparkle_hearts",
      title: "Sparkle Hearts",
      image: "/wallpapers/cute_sparkle_hearts.png",
      icon: "💖",
    },
    {
      id: "gradient_pastel",
      title: "Soft Gradient",
      image: null,
      icon: "🌈",
    },
  ];

  const particles: { id: ParticleStyle; label: string; icon: string }[] = [
    { id: "hearts", label: "Hearts", icon: "💕" },
    { id: "sparkles", label: "Sparkles", icon: "✨" },
    { id: "stars", label: "Stars", icon: "🌟" },
    { id: "bubbles", label: "Bubbles", icon: "🫧" },
    { id: "none", label: "Off", icon: "🚫" },
  ];

  return (
    <>
      {/* Floating Cute Magic Wand Button */}
      <motion.button
        type="button"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.08, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        className="fixed top-4 right-4 z-40 flex items-center gap-2 rounded-full border border-pink-300/40 dark:border-pink-500/30 bg-white/80 dark:bg-slate-900/80 px-4 py-2 text-xs font-semibold text-pink-600 dark:text-pink-300 shadow-lg shadow-pink-500/10 backdrop-blur-md hover:bg-pink-50 dark:hover:bg-slate-800 transition-colors"
        aria-label="Customize background picture and aesthetic"
      >
        <span className="text-base animate-bounce">🎨</span>
        <span className="hidden sm:inline">Theme & Wallpapers</span>
      </motion.button>

      {/* Modal Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-pink-200/50 dark:border-pink-500/20 bg-white/90 dark:bg-slate-900/90 p-6 shadow-2xl backdrop-blur-xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-pink-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🪄</span>
                  <h3 className="font-display text-lg font-bold text-slate-800 dark:text-pink-100">
                    Background & Vibe
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 my-4 p-1 rounded-2xl bg-pink-100/50 dark:bg-slate-800/50">
                <button
                  type="button"
                  onClick={() => setActiveTab("pictures")}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === "pictures"
                      ? "bg-white dark:bg-slate-900 text-pink-600 dark:text-pink-300 shadow-sm"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  🖼️ Wallpapers & Pics
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("effects")}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === "effects"
                      ? "bg-white dark:bg-slate-900 text-pink-600 dark:text-pink-300 shadow-sm"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  ✨ Effects & Audio
                </button>
              </div>

              {/* Tab 1: Pictures */}
              {activeTab === "pictures" && (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
                      Upload Custom Picture
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl border-2 border-dashed border-pink-300 dark:border-pink-500/40 bg-pink-50/50 dark:bg-slate-800/50 text-pink-600 dark:text-pink-300 font-semibold text-xs transition-colors hover:bg-pink-100/50 dark:hover:bg-slate-800"
                    >
                      <span className="text-xl">📸</span>
                      {customWallpaperUrl ? "Change Custom Photo" : "Upload Your Photo / Wallpaper"}
                    </motion.button>
                  </div>

                  {/* Preset Wallpapers Grid */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
                      Cute Preset Wallpapers
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {/* Custom uploaded card if exists */}
                      {customWallpaperUrl && (
                        <div
                          onClick={() => setWallpaper("custom")}
                          className={`relative overflow-hidden rounded-2xl border-2 cursor-pointer h-24 transition-all ${
                            wallpaper === "custom"
                              ? "border-pink-500 ring-2 ring-pink-400/40 scale-[1.02]"
                              : "border-slate-200 dark:border-slate-800 opacity-80 hover:opacity-100"
                          }`}
                        >
                          <img
                            src={customWallpaperUrl}
                            alt="Custom Background"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-white text-[11px] font-bold flex items-center justify-between">
                            <span>📸 My Custom Photo</span>
                            {wallpaper === "custom" && <span>✓</span>}
                          </div>
                        </div>
                      )}

                      {presets.map((preset) => {
                        const active = wallpaper === preset.id;
                        return (
                          <div
                            key={preset.id}
                            onClick={() => setWallpaper(preset.id)}
                            className={`relative overflow-hidden rounded-2xl border-2 cursor-pointer h-24 transition-all ${
                              active
                                ? "border-pink-500 ring-2 ring-pink-400/40 scale-[1.02]"
                                : "border-slate-200 dark:border-slate-800 opacity-80 hover:opacity-100"
                            }`}
                          >
                            {preset.image ? (
                              <img
                                src={preset.image}
                                alt={preset.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-300 dark:from-pink-900 dark:via-purple-900 dark:to-indigo-900 flex items-center justify-center text-2xl">
                                {preset.icon}
                              </div>
                            )}
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-white text-[11px] font-bold flex items-center justify-between">
                              <span className="truncate">{preset.icon} {preset.title}</span>
                              {active && <span>✓</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Effects & Adjustments */}
              {activeTab === "effects" && (
                <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-1">
                  {/* Blur Control */}
                  <div>
                    <div className="flex justify-between items-center text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                      <span>Background Blur</span>
                      <span>{blurLevel}px</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={16}
                      step={2}
                      value={blurLevel}
                      onChange={(e) => setBlurLevel(Number(e.target.value))}
                      className="w-full accent-pink-500 cursor-pointer"
                    />
                  </div>

                  {/* Dark/Dim Overlay Control */}
                  <div>
                    <div className="flex justify-between items-center text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                      <span>Contrast Dimness</span>
                      <span>{Math.round(overlayOpacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0.05}
                      max={0.7}
                      step={0.05}
                      value={overlayOpacity}
                      onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                      className="w-full accent-pink-500 cursor-pointer"
                    />
                  </div>

                  {/* Particle Selection */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                      Floating Particle Atmosphere
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {particles.map((p) => {
                        const active = particleStyle === p.id;
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => setParticleStyle(p.id)}
                            className={`flex flex-col items-center justify-center p-2 rounded-2xl border text-xs font-bold transition-all ${
                              active
                                ? "border-pink-500 bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-300"
                                : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                            }`}
                          >
                            <span className="text-xl mb-1">{p.icon}</span>
                            <span>{p.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sound Toggle */}
                  <div className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{soundEnabled ? "🔊" : "🔇"}</span>
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-pink-100">
                          Cute Audio Effects
                        </p>
                        <p className="text-[10px] text-slate-400">Chimes on hugs & mood updates</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                        soundEnabled
                          ? "bg-pink-500 text-white"
                          : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      {soundEnabled ? "ON" : "OFF"}
                    </button>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="mt-5 pt-3 border-t border-pink-100 dark:border-slate-800 flex justify-between items-center">
                <button
                  type="button"
                  onClick={resetToDefault}
                  className="text-xs font-semibold text-slate-400 hover:text-pink-500 transition-colors"
                >
                  Reset Defaults
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-5 py-2 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold shadow-md hover:opacity-95 transition-opacity"
                >
                  Done 💕
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
