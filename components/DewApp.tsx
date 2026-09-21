"use client";

import { useCallback, useEffect, useState } from "react";
import RainCanvas from "./RainCanvas";
import StageButtons from "./StageButtons";
import CaptionBar from "./CaptionBar";
import { STAGES, StageId, getStage } from "./stageConfig";
import { useThunder } from "./useThunder";
import { useNarrator } from "./useNarrator";

export default function DewApp() {
  const [stageId, setStageId] = useState<StageId>(1);
  const [flashTrigger, setFlashTrigger] = useState(0);
  const [speakOn, setSpeakOn] = useState(false);
  const stage = getStage(stageId);
  const { playSoftThunder } = useThunder();
  const { speak, stop } = useNarrator(speakOn);

  const go = useCallback(
    (id: StageId) => {
      setStageId(id);
      const s = getStage(id);
      if (speakOn) speak(s.caption);
      if (s.showLightning) {
        setFlashTrigger((n) => n + 1);
        void playSoftThunder();
      }
    },
    [speakOn, speak, playSoftThunder]
  );

  const onNext = () => {
    const next = (stageId === 7 ? 1 : stageId + 1) as StageId;
    go(next);
  };

  const onBack = () => {
    const prev = (stageId === 1 ? 7 : stageId - 1) as StageId;
    go(prev);
  };

  // Soft auto-reset after idle on stage 7
  useEffect(() => {
    if (stageId !== 7) return;
    const t = setTimeout(() => go(1), 50000);
    return () => clearTimeout(t);
  }, [stageId, go]);

  useEffect(() => {
    return () => stop();
  }, [stop]);

  return (
    <div className="dew-root">
      <header className="dew-header">
        <div className="dew-title-row">
          <span className="dew-logo" aria-hidden>
            💧
          </span>
          <div>
            <h1 className="dew-title">Dew</h1>
            <p className="dew-sub">How rain forms · with Dew the dewdrop</p>
          </div>
        </div>
      </header>

      <main className="dew-main">
        <div className="canvas-wrap">
          <RainCanvas stage={stage} flashTrigger={flashTrigger} />
          <div className="dew-badge" aria-hidden>
            <span className="dew-badge-drop">💧</span>
            <span>Dew says hi!</span>
          </div>
        </div>
        <CaptionBar
          stage={stage}
          speakOn={speakOn}
          onToggleSpeak={() => {
            setSpeakOn((v) => {
              const next = !v;
              if (next) speak(stage.caption);
              else stop();
              return next;
            });
          }}
        />
        <StageButtons
          current={stageId}
          onSelect={go}
          onNext={onNext}
          onBack={onBack}
        />
      </main>
    </div>
  );
}
