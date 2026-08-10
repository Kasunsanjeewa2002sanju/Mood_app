import { describe, it, expect } from "vitest";
import { hashPin, verifyPin } from "@/lib/auth";
import { MOOD_LEVELS, scoreToMood, getMoodConfig } from "@/lib/mood-levels";

describe("auth", () => {
  it("hashes PIN consistently", () => {
    const hash1 = hashPin("1234");
    const hash2 = hashPin("1234");
    expect(hash1).toBe(hash2);
    expect(hash1).not.toBe(hashPin("5678"));
  });

  it("verifies PIN against APP_PIN env", () => {
    process.env.APP_PIN = "1234";
    delete process.env.APP_PIN_HASH;
    expect(verifyPin("1234")).toBe(true);
    expect(verifyPin("wrong")).toBe(false);
  });
});

describe("mood-levels", () => {
  it("has 5 distinct mood levels", () => {
    expect(MOOD_LEVELS).toHaveLength(5);
    const values = MOOD_LEVELS.map((m) => m.value);
    expect(new Set(values).size).toBe(5);
  });

  it("maps score to mood correctly", () => {
    expect(scoreToMood(0)).toBe("terrible");
    expect(scoreToMood(2)).toBe("okay");
    expect(scoreToMood(4)).toBe("amazing");
  });

  it("returns config for each mood", () => {
    for (const level of MOOD_LEVELS) {
      const config = getMoodConfig(level.value);
      expect(config.emoji).toBeTruthy();
      expect(config.label).toBeTruthy();
    }
  });
});
