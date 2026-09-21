"use client";

import { STAGES, StageId } from "./stageConfig";
import { StageIcon } from "./StageIcons";

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
      <div className="stage-grid" role="tablist" aria-label="Rain stages">
        {STAGES.map((s) => {
          const active = current === s.id;
          return (
            <button
              key={s.id}
              type="button"
              role="tab"
              className={`stage-btn ${active ? "active" : ""}`}
              style={
                {
                  "--btn-bg": s.buttonBg,
                  "--btn-accent": s.buttonAccent,
                } as React.CSSProperties
              }
              onClick={() => onSelect(s.id)}
              aria-label={`Stage ${s.id}: ${s.label}`}
              aria-selected={active}
            >
              <span className="stage-icon-wrap">
                <StageIcon id={s.icon} />
              </span>
              <span className="stage-label">{s.label}</span>
              <span className="stage-num">{s.id}</span>
            </button>
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
