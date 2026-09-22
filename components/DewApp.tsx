"use client";

import { useCallback, useEffect, useState } from "react";
import RainCanvas from "./RainCanvas";
import StageButtons from "./StageButtons";
import { StageId, getStage } from "./stageConfig";
import { useThunder } from "./useThunder";
import { useNarrator } from "./useNarrator";
import { useClickSound } from "./useClickSound";

export default function DewApp() {
  const [stageId, setStageId] = useState<StageId>(1);
  const [flashTrigger, setFlashTrigger] = useState(0);
  const [speakOn, setSpeakOn] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const stage = getStage(stageId);
  const { playSoftThunder } = useThunder();
  const { speak, stop } = useNarrator(speakOn);
  const { playClick } = useClickSound();

  const go = useCallback(
    (id: StageId) => {
      void playClick();
      setCelebrating(false);
      setStageId(id);
      const s = getStage(id);
      if (speakOn) speak(s.kidLine);
      if (s.showLightning) {
        setFlashTrigger((n) => n + 1);
        void playSoftThunder();
      }
    },
    [speakOn, speak, playSoftThunder, playClick]
  );

  const onNext = () => {
    if (celebrating) {
      go(1);
      return;
    }
    if (stageId === 7) {
      void playClick();
      setCelebrating(true);
      if (speakOn) speak("Rain again!");
      return;
    }
    go((stageId + 1) as StageId);
  };

  const onBack = () => {
    if (celebrating) {
      void playClick();
      setCelebrating(false);
      return;
    }
    if (stageId === 1) return;
    go((stageId - 1) as StageId);
  };

  const onAgain = () => {
    go(1);
  };

  useEffect(() => {
    return () => stop();
  }, [stop]);

  const liveText = celebrating
    ? "Rain again! You finished the rain story."
    : `${stage.label}. ${stage.kidLine}`;

  return (
    <div
      className="dew-root"
      style={{ background: stage.moodBg }}
      data-stage={stageId}
      data-celebrating={celebrating ? "1" : "0"}
    >
      <div className="dew-bg-blobs" aria-hidden>
        <span className="blob blob-a" />
        <span className="blob blob-b" />
        <span className="blob blob-c" />
      </div>

      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {liveText}
      </div>

      <header className="dew-header">
        <div className="dew-title-row">
          <DewLogo />
          <div>
            <h1 className="dew-title">Dew</h1>
            <p className="dew-sub">How rain forms · tap Next to explore</p>
          </div>
        </div>
      </header>

      <main className="dew-main">
        <div className="canvas-wrap">
          <RainCanvas stage={stage} flashTrigger={flashTrigger} />
          <div className="scene-glow" aria-hidden />
          <div
            className="scene-stage-badge"
            style={{ background: stage.buttonBg, color: stage.buttonAccent }}
            aria-hidden
          >
            {celebrating ? "Yay!" : stage.label}
          </div>
          {celebrating && (
            <div className="celebrate-card" role="dialog" aria-label="Story finished">
              <p className="celebrate-emoji" aria-hidden>
                🌧️✨
              </p>
              <p className="celebrate-title">Rain again!</p>
              <p className="celebrate-sub">You made it through the rain story.</p>
              <button type="button" className="celebrate-again" onClick={onAgain}>
                Again
              </button>
            </div>
          )}
        </div>

        <StageButtons
          current={stageId}
          onSelect={go}
          onNext={onNext}
          onBack={onBack}
          celebrating={celebrating}
          speakOn={speakOn}
          onToggleSpeak={() => {
            void playClick();
            setSpeakOn((v) => {
              const next = !v;
              if (next) speak(celebrating ? "Rain again!" : stage.kidLine);
              else stop();
              return next;
            });
          }}
        />
      </main>
    </div>
  );
}

function DewLogo() {
  return (
    <svg
      className="dew-logo-svg"
      width="40"
      height="48"
      viewBox="0 0 56 64"
      aria-hidden
    >
      <defs>
        <linearGradient id="dewBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E8F8FF" />
          <stop offset="55%" stopColor="#7ED0FF" />
          <stop offset="100%" stopColor="#4AB0F0" />
        </linearGradient>
      </defs>
      <path
        d="M28 4C28 4 8 28 8 42a20 20 0 0040 0C48 28 28 4 28 4z"
        fill="url(#dewBody)"
        stroke="#5BB8E8"
        strokeWidth="1.5"
      />
      <ellipse cx="20" cy="30" rx="6" ry="9" fill="#FFFFFF" opacity="0.45" />
      <circle cx="22" cy="40" r="3.2" fill="#2A4060" />
      <circle cx="34" cy="40" r="3.2" fill="#2A4060" />
      <circle cx="23.2" cy="39" r="1.1" fill="#FFFFFF" />
      <circle cx="35.2" cy="39" r="1.1" fill="#FFFFFF" />
      <path
        d="M23 47c2.2 2.4 7.8 2.4 10 0"
        stroke="#2A4060"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="18" cy="44" r="2.4" fill="#FFB0C8" opacity="0.75" />
      <circle cx="38" cy="44" r="2.4" fill="#FFB0C8" opacity="0.75" />
    </svg>
  );
}
