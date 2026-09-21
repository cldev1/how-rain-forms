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
      <div className="caption-stage-pill" aria-hidden>
        {stage.id} / 7
      </div>
      <p className="caption-text" key={stage.id}>
        {stage.caption}
      </p>
      <button
        type="button"
        className={`speak-btn ${speakOn ? "on" : ""}`}
        onClick={onToggleSpeak}
        aria-label={speakOn ? "Turn voice off" : "Turn voice on"}
        aria-pressed={speakOn}
      >
        <SpeakIcon on={speakOn} />
      </button>
    </div>
  );
}

function SpeakIcon({ on }: { on: boolean }) {
  return (
    <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden>
      <path
        d="M5 11v6h4l6 5V6l-6 5H5z"
        fill={on ? "#2F6A98" : "#5A7A94"}
      />
      {on ? (
        <>
          <path
            d="M19 10c1.5 1.2 2.4 3 2.4 5s-.9 3.8-2.4 5"
            stroke="#2F6A98"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M22.5 7c2.4 2 3.8 4.8 3.8 8s-1.4 6-3.8 8"
            stroke="#2F6A98"
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity="0.55"
          />
        </>
      ) : (
        <path
          d="M19 11l6 6M25 11l-6 6"
          stroke="#5A7A94"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}
