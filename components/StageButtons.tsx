"use client";

import type { CSSProperties } from "react";
import { STAGES, StageId, getStage } from "./stageConfig";
import { StageIcon } from "./StageIcons";

export default function StageButtons({
  current,
  onSelect,
  onNext,
  onBack,
  speakOn,
  onToggleSpeak,
}: {
  current: StageId;
  onSelect: (id: StageId) => void;
  onNext: () => void;
  onBack: () => void;
  speakOn: boolean;
  onToggleSpeak: () => void;
}) {
  const stage = getStage(current);

  return (
    <div className="stage-panel bottom-sheet">
      {/* Hero: one big selected stage — always readable on phone */}
      <div
        className="stage-hero"
        style={
          {
            "--btn-bg": stage.buttonBg,
            "--btn-accent": stage.buttonAccent,
          } as CSSProperties
        }
      >
        <div className="stage-hero-icon" aria-hidden>
          <StageIcon id={stage.icon} size={72} />
        </div>
        <div className="stage-hero-copy">
          <div className="stage-hero-meta">
            <span className="stage-hero-num">
              {stage.id} / 7
            </span>
            <button
              type="button"
              className={`speak-btn speak-btn-inline ${speakOn ? "on" : ""}`}
              onClick={onToggleSpeak}
              aria-label={speakOn ? "Turn voice off" : "Turn voice on"}
              aria-pressed={speakOn}
            >
              <SpeakIcon on={speakOn} />
            </button>
          </div>
          <h2 className="stage-hero-label" key={`label-${stage.id}`}>
            {stage.label}
          </h2>
          <p className="stage-hero-kid" key={`kid-${stage.id}`}>
            {stage.kidLine}
          </p>
          <p className="stage-hero-caption" key={`cap-${stage.id}`}>
            {stage.caption}
          </p>
        </div>
      </div>

      {/* Story path: oversized nodes, not a 7-chip wrap */}
      <div className="story-path" role="tablist" aria-label="Rain story path">
        {STAGES.map((s, i) => {
          const active = current === s.id;
          const done = s.id < current;
          return (
            <div key={s.id} className="story-path-item">
              {i > 0 && (
                <span
                  className={`story-connector ${done || active ? "lit" : ""}`}
                  aria-hidden
                />
              )}
              <button
                type="button"
                role="tab"
                className={`story-node ${active ? "active" : ""} ${done ? "done" : ""}`}
                style={
                  {
                    "--btn-bg": s.buttonBg,
                    "--btn-accent": s.buttonAccent,
                  } as CSSProperties
                }
                onClick={() => onSelect(s.id)}
                aria-label={`Stage ${s.id}: ${s.label}`}
                aria-selected={active}
              >
                <span className="story-node-icon">
                  <StageIcon id={s.icon} size={active ? 36 : 28} />
                </span>
                {active && (
                  <span className="story-node-label">{s.label}</span>
                )}
              </button>
            </div>
          );
        })}
      </div>

      <div className="nav-row">
        <button type="button" className="nav-btn" onClick={onBack}>
          <span className="nav-chevron" aria-hidden>
            ‹
          </span>
          Back
        </button>
        <button type="button" className="nav-btn next" onClick={onNext}>
          Next
          <span className="nav-chevron" aria-hidden>
            ›
          </span>
        </button>
      </div>
    </div>
  );
}

function SpeakIcon({ on }: { on: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 28 28" fill="none" aria-hidden>
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
