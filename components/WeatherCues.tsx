"use client";

import type { CSSProperties } from "react";
import { StageConfig, humidityDrops } from "./stageConfig";

/** Kid-simple warmth + wet-air cues — always visible on phone. */
export default function WeatherCues({
  stage,
  compact = false,
}: {
  stage: StageConfig;
  compact?: boolean;
}) {
  const drops = humidityDrops(stage.humidityLevel);
  const warmPct = Math.round(stage.warmthLevel * 100);

  return (
    <div
      className={`weather-cues ${compact ? "weather-cues-compact" : ""}`}
      aria-label={`Warmth ${stage.tempLabel} ${stage.tempC} degrees. Wet air ${stage.humidityLabel}, ${drops} of 5.`}
      style={
        {
          "--warm-pct": `${warmPct}%`,
          "--cue-accent": stage.buttonAccent,
          "--cue-bg": stage.buttonBg,
        } as CSSProperties
      }
    >
      <div className="weather-cue warmth-cue">
        <span className="weather-cue-icon" aria-hidden>
          <ThermoIcon />
        </span>
        <div className="weather-cue-body">
          <span className="weather-cue-title">Warmth</span>
          <div className="warmth-meter" aria-hidden>
            <span className="warmth-fill" />
          </div>
          <span className="weather-cue-value">
            <strong>{stage.tempLabel}</strong>
            <span className="weather-cue-deg">{stage.tempC}°</span>
          </span>
        </div>
      </div>

      <div className="weather-cue humidity-cue">
        <span className="weather-cue-icon" aria-hidden>
          <DropIcon />
        </span>
        <div className="weather-cue-body">
          <span className="weather-cue-title">Wet air</span>
          <div className="humidity-drops" aria-hidden>
            {[1, 2, 3, 4, 5].map((i) => (
              <span
                key={i}
                className={`hum-drop ${i <= drops ? "filled" : ""}`}
              />
            ))}
          </div>
          <span className="weather-cue-value">
            <strong>{stage.humidityLabel}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}

function ThermoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M10 14.5V5.5a2 2 0 114 0v9a3.5 3.5 0 11-4 0z"
        stroke="#E07030"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="17" r="2.2" fill="#FF8A4A" />
    </svg>
  );
}

function DropIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3C12 3 6 10 6 14.5a6 6 0 0012 0C18 10 12 3 12 3z"
        fill="#5BB8E8"
        stroke="#3A9AD4"
        strokeWidth="1.4"
      />
    </svg>
  );
}
