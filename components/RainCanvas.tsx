"use client";

import dynamic from "next/dynamic";
import { StageConfig } from "./stageConfig";

const CanvasInner = dynamic(() => import("./RainCanvasInner"), {
  ssr: false,
  loading: () => (
    <div className="canvas-loading">
      <div className="canvas-loading-drop" aria-hidden />
      <p>Dew is waking up…</p>
    </div>
  ),
});

export default function RainCanvas({
  stage,
  flashTrigger,
}: {
  stage: StageConfig;
  flashTrigger: number;
}) {
  return <CanvasInner stage={stage} flashTrigger={flashTrigger} />;
}
