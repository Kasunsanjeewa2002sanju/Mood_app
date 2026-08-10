"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type WallpaperPreset =
  | "cute_pastel_sky"
  | "cute_cozy_room"
  | "cute_sparkle_hearts"
  | "gradient_pastel"
  | "custom";

export type ParticleStyle = "hearts" | "stars" | "sparkles" | "bubbles" | "none";

interface BackgroundContextType {
  wallpaper: WallpaperPreset;
  setWallpaper: (preset: WallpaperPreset) => void;
  customWallpaperUrl: string | null;
  setCustomWallpaperUrl: (url: string | null) => void;
  blurLevel: number; // 0, 4, 8, 12, 16
  setBlurLevel: (blur: number) => void;
  overlayOpacity: number; // 0.1 to 0.7
  setOverlayOpacity: (opacity: number) => void;
  particleStyle: ParticleStyle;
  setParticleStyle: (style: ParticleStyle) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  uploadCustomWallpaper: (file: File) => Promise<void>;
  resetToDefault: () => void;
}

const STORAGE_KEYS = {
  WALLPAPER: "mood_bridge_wallpaper",
  CUSTOM_URL: "mood_bridge_custom_wallpaper_url",
  BLUR: "mood_bridge_blur",
  OVERLAY: "mood_bridge_overlay",
  PARTICLES: "mood_bridge_particles",
  SOUND: "mood_bridge_sound",
};

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

export function BackgroundProvider({ children }: { children: React.ReactNode }) {
  const [wallpaper, setWallpaperState] = useState<WallpaperPreset>("cute_pastel_sky");
  const [customWallpaperUrl, setCustomWallpaperUrlState] = useState<string | null>(null);
  const [blurLevel, setBlurLevelState] = useState<number>(4);
  const [overlayOpacity, setOverlayOpacityState] = useState<number>(0.25);
  const [particleStyle, setParticleStyleState] = useState<ParticleStyle>("hearts");
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const savedWallpaper = localStorage.getItem(STORAGE_KEYS.WALLPAPER) as WallpaperPreset | null;
      const savedCustomUrl = localStorage.getItem(STORAGE_KEYS.CUSTOM_URL);
      const savedBlur = localStorage.getItem(STORAGE_KEYS.BLUR);
      const savedOverlay = localStorage.getItem(STORAGE_KEYS.OVERLAY);
      const savedParticles = localStorage.getItem(STORAGE_KEYS.PARTICLES) as ParticleStyle | null;
      const savedSound = localStorage.getItem(STORAGE_KEYS.SOUND);

      if (savedWallpaper) setWallpaperState(savedWallpaper);
      if (savedCustomUrl) setCustomWallpaperUrlState(savedCustomUrl);
      if (savedBlur !== null) setBlurLevelState(Number(savedBlur));
      if (savedOverlay !== null) setOverlayOpacityState(Number(savedOverlay));
      if (savedParticles) setParticleStyleState(savedParticles);
      if (savedSound !== null) setSoundEnabledState(savedSound === "true");
    } catch (e) {
      console.warn("Could not load background preferences from localStorage", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  const setWallpaper = (w: WallpaperPreset) => {
    setWallpaperState(w);
    try {
      localStorage.setItem(STORAGE_KEYS.WALLPAPER, w);
    } catch {}
  };

  const setCustomWallpaperUrl = (url: string | null) => {
    setCustomWallpaperUrlState(url);
    try {
      if (url) {
        localStorage.setItem(STORAGE_KEYS.CUSTOM_URL, url);
      } else {
        localStorage.removeItem(STORAGE_KEYS.CUSTOM_URL);
      }
    } catch {}
  };

  const setBlurLevel = (blur: number) => {
    setBlurLevelState(blur);
    try {
      localStorage.setItem(STORAGE_KEYS.BLUR, String(blur));
    } catch {}
  };

  const setOverlayOpacity = (opacity: number) => {
    setOverlayOpacityState(opacity);
    try {
      localStorage.setItem(STORAGE_KEYS.OVERLAY, String(opacity));
    } catch {}
  };

  const setParticleStyle = (style: ParticleStyle) => {
    setParticleStyleState(style);
    try {
      localStorage.setItem(STORAGE_KEYS.PARTICLES, style);
    } catch {}
  };

  const setSoundEnabled = (enabled: boolean) => {
    setSoundEnabledState(enabled);
    try {
      localStorage.setItem(STORAGE_KEYS.SOUND, String(enabled));
    } catch {}
  };

  const uploadCustomWallpaper = async (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        if (dataUrl) {
          setCustomWallpaperUrl(dataUrl);
          setWallpaper("custom");
          resolve();
        } else {
          reject(new Error("Failed to read image file"));
        }
      };
      reader.onerror = () => reject(new Error("Error reading file"));
      reader.readAsDataURL(file);
    });
  };

  const resetToDefault = () => {
    setWallpaper("cute_pastel_sky");
    setCustomWallpaperUrl(null);
    setBlurLevel(4);
    setOverlayOpacity(0.25);
    setParticleStyle("hearts");
    setSoundEnabled(true);
    try {
      localStorage.removeItem(STORAGE_KEYS.WALLPAPER);
      localStorage.removeItem(STORAGE_KEYS.CUSTOM_URL);
      localStorage.removeItem(STORAGE_KEYS.BLUR);
      localStorage.removeItem(STORAGE_KEYS.OVERLAY);
      localStorage.removeItem(STORAGE_KEYS.PARTICLES);
      localStorage.removeItem(STORAGE_KEYS.SOUND);
    } catch {}
  };

  return (
    <BackgroundContext.Provider
      value={{
        wallpaper,
        setWallpaper,
        customWallpaperUrl,
        setCustomWallpaperUrl,
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
      }}
    >
      {children}
    </BackgroundContext.Provider>
  );
}

export function useBackground() {
  const context = useContext(BackgroundContext);
  if (!context) {
    throw new Error("useBackground must be used within a BackgroundProvider");
  }
  return context;
}
