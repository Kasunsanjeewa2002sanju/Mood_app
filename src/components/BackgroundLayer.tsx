"use client";

import React, { useEffect, useRef } from "react";
import { useBackground } from "./BackgroundContext";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  symbol: string;
}

const PARTICLE_SYMBOLS = {
  hearts: ["💕", "💖", "🌸", "💗", "✨"],
  stars: ["⭐", "🌟", "✨", "💫", "🌙"],
  sparkles: ["✨", "🌸", "💖", "💫", "⚡"],
  bubbles: ["🫧", "⚪", "🫧", "✨", "💖"],
  none: [],
};

export function BackgroundLayer() {
  const {
    wallpaper,
    customWallpaperUrl,
    blurLevel,
    overlayOpacity,
    particleStyle,
  } = useBackground();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Get background image URL
  let backgroundImageUrl: string | null = null;
  if (wallpaper === "custom" && customWallpaperUrl) {
    backgroundImageUrl = customWallpaperUrl;
  } else if (wallpaper === "cute_pastel_sky") {
    backgroundImageUrl = "/wallpapers/cute_pastel_sky.png";
  } else if (wallpaper === "cute_cozy_room") {
    backgroundImageUrl = "/wallpapers/cute_cozy_room.png";
  } else if (wallpaper === "cute_sparkle_hearts") {
    backgroundImageUrl = "/wallpapers/cute_sparkle_hearts.png";
  }

  // Particle Canvas Engine
  useEffect(() => {
    if (particleStyle === "none") return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const symbols = PARTICLE_SYMBOLS[particleStyle] || PARTICLE_SYMBOLS.hearts;
    const particlesCount = 28;
    const particles: Particle[] = [];

    for (let i = 0; i < particlesCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 16 + 14,
        speedY: -(Math.random() * 0.8 + 0.3),
        speedX: Math.sin(Math.random() * Math.PI) * 0.4,
        opacity: Math.random() * 0.6 + 0.3,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 1.5,
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
      });
    }

    const handleClick = (e: MouseEvent) => {
      // Burst extra cute particles at click location!
      for (let i = 0; i < 6; i++) {
        particles.push({
          x: e.clientX + (Math.random() - 0.5) * 20,
          y: e.clientY + (Math.random() - 0.5) * 20,
          size: Math.random() * 20 + 16,
          speedY: -(Math.random() * 2 + 1),
          speedX: (Math.random() - 0.5) * 2.5,
          opacity: 1,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 4,
          symbol: symbols[Math.floor(Math.random() * symbols.length)],
        });
      }
      if (particles.length > 60) {
        particles.splice(0, 6);
      }
    };

    window.addEventListener("click", handleClick);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.y * 0.01) * 0.2;
        p.rotation += p.rotationSpeed;

        if (p.y < -30) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.font = `${p.size}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(p.symbol, 0, 0);
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("click", handleClick);
    };
  }, [particleStyle]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Background Image or CSS Gradient */}
      {backgroundImageUrl ? (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 ease-out"
          style={{
            backgroundImage: `url(${backgroundImageUrl})`,
            filter: `blur(${blurLevel}px)`,
            scale: blurLevel > 0 ? "1.05" : "1",
          }}
        />
      ) : (
        <div
          className="absolute inset-0 bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 dark:from-slate-950 dark:via-purple-950 dark:to-pink-950 transition-all duration-700"
          style={{
            filter: `blur(${blurLevel}px)`,
          }}
        />
      )}

      {/* Dimming & Contrast Overlay */}
      <div
        className="absolute inset-0 bg-black transition-opacity duration-300 pointer-events-none"
        style={{ opacity: overlayOpacity }}
      />

      {/* Subtle Kawaii Light Glow Effects */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-400/20 dark:bg-pink-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* Floating Particles Canvas */}
      {particleStyle !== "none" && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-auto"
        />
      )}
    </div>
  );
}
