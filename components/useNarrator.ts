"use client";

import { useCallback } from "react";

export function useNarrator(enabled: boolean) {
  const speak = useCallback(
    (text: string) => {
      if (!enabled || typeof window === "undefined") return;
      if (!window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.9;
      u.pitch = 1.15;
      u.volume = 0.85;
      window.speechSynthesis.speak(u);
    },
    [enabled]
  );

  const stop = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  return { speak, stop };
}
