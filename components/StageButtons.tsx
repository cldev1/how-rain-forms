"use client";

import { STAGES, StageId } from "./stageConfig";

export default function StageButtons({
  current,
  onSelect,
  onNext,
  onBack,
}: {
  current: StageId;
  onSelect: (id: StageId) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="stage-panel">
      <div className="stage-grid">
        {STAGES.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`stage-btn ${current === s.id ? "active" : ""}`}
            style={{ background: s.buttonBg }}
            onClick={() => onSelect(s.id)}
            aria-label={s.label}
            aria-pressed={current === s.id}
          >
            <span className="stage-emoji">{s.emoji}</span>
            <span className="stage-label">{s.label}</span>
          </button>
        ))}
      </div>
      <div className="nav-row">
        <button type="button" className="nav-btn" onClick={onBack}>
          ◀ Back
        </button>
        <button type="button" className="nav-btn next" onClick={onNext}>
          Next ▶
        </button>
      </div>
    </div>
  );
}
