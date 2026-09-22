"use client";

import dynamic from "next/dynamic";
import { StageConfig } from "./stageConfig";
import { WebGLErrorBoundary } from "./WebGLFallback";

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
  return (
    <WebGLErrorBoundary stage={stage}>
      <CanvasInner stage={stage} flashTrigger={flashTrigger} />
    </WebGLErrorBoundary>
  );
}
