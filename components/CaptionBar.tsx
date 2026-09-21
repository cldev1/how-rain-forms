"use client";

import { StageConfig } from "./stageConfig";

export default function CaptionBar({
  stage,
  speakOn,
  onToggleSpeak,
}: {
  stage: StageConfig;
  speakOn: boolean;
  onToggleSpeak: () => void;
}) {
  return (
    <div className="caption-bar">
      <p className="caption-text">{stage.caption}</p>
      <button
        type="button"
        className={`speak-btn ${speakOn ? "on" : ""}`}
        onClick={onToggleSpeak}
        aria-label={speakOn ? "Turn voice off" : "Turn voice on"}
      >
        {speakOn ? "🔊" : "🔇"}
      </button>
    </div>
  );
}
