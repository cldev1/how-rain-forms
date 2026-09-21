"use client";

import { useCallback, useRef } from "react";

/** Soft friendly rumble — starts only after a user gesture. */
export function useThunder() {
  const ctxRef = useRef<AudioContext | null>(null);

  const ensureCtx = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!ctxRef.current) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      ctxRef.current = new AC();
    }
    return ctxRef.current;
  }, []);

  const playSoftThunder = useCallback(async () => {
    const ctx = ensureCtx();
    if (!ctx) return;
    if (ctx.state === "suspended") await ctx.resume();

    const now = ctx.currentTime;
    const duration = 1.4;

    // Low soft tone
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + duration);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.12, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    // Soft noise puff
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.35));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.06, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 400;

    osc.connect(gain).connect(ctx.destination);
    noise.connect(noiseGain).connect(filter).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration);
    noise.start(now);
    noise.stop(now + duration);
  }, [ensureCtx]);

  return { playSoftThunder };
}
