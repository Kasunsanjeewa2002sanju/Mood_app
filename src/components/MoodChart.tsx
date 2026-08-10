"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { MOOD_LEVELS } from "@/lib/mood-levels";
import type { MoodEntry } from "@/lib/types";

interface MoodChartProps {
  entries: MoodEntry[];
}

export function MoodChart({ entries }: MoodChartProps) {
  if (entries.length === 0) return null;

  const sorted = [...entries].sort((a, b) => a.timestamp - b.timestamp);
  const data = sorted.map((entry) => {
    const config = MOOD_LEVELS.find((m) => m.value === entry.mood);
    return {
      date: new Date(entry.date).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      score: config?.score ?? 3,
      emoji: entry.emoji,
    };
  });

  return (
    <div className="rounded-3xl border border-pink-300/40 dark:border-pink-500/30 bg-white/85 dark:bg-slate-900/85 p-5 shadow-2xl backdrop-blur-2xl">
      <h3 className="mb-4 font-display text-base font-black text-slate-800 dark:text-pink-100 flex items-center gap-2">
        <span className="text-xl">📈</span> Mood Trend Curve
      </h3>
      <div className="h-56 w-full" aria-label="Mood trend chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(244, 114, 182, 0.15)" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "#ec4899", fontWeight: 700 }}
              stroke="rgba(244, 114, 182, 0.3)"
            />
            <YAxis
              domain={[1, 5]}
              ticks={[1, 2, 3, 4, 5]}
              tick={{ fontSize: 11, fill: "#ec4899", fontWeight: 700 }}
              stroke="rgba(244, 114, 182, 0.3)"
            />
            <Tooltip
              contentStyle={{
                background: "rgba(255, 255, 255, 0.95)",
                border: "2px solid rgba(244, 114, 182, 0.4)",
                borderRadius: "20px",
                boxShadow: "0 10px 30px rgba(236, 72, 153, 0.2)",
                fontSize: "13px",
                fontWeight: "bold",
                color: "#be185d",
              }}
              formatter={(value, _name, props) => [
                `${props.payload.emoji} Score: ${value}/5`,
                "Mood Vibe",
              ]}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#ec4899"
              strokeWidth={4}
              dot={{ fill: "#ec4899", r: 6, strokeWidth: 3, stroke: "#ffffff" }}
              activeDot={{ r: 9, fill: "#a855f7", stroke: "#ffffff", strokeWidth: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

