"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { SceneContent } from "./RainScene";
import { StageConfig } from "./stageConfig";
import { WebGLFallbackCard } from "./WebGLFallback";

export default function RainCanvasInner({
  stage,
  flashTrigger,
}: {
  stage: StageConfig;
  flashTrigger: number;
}) {
  const [failed, setFailed] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  if (failed) {
    return (
      <WebGLFallbackCard
        stage={stage}
        onRetry={() => {
          setFailed(false);
          setRetryKey((k) => k + 1);
        }}
      />
    );
  }

  return (
    <Canvas
      key={retryKey}
      camera={{ position: [0.1, 1.5, 7.5], fov: 40 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%", touchAction: "none" }}
      onCreated={({ gl }) => {
        const el = gl.domElement;
        const lose = (el.getContext("webgl2") ||
          el.getContext("webgl")) as WebGLRenderingContext | null;
        if (!lose) {
          setFailed(true);
          return;
        }
        el.addEventListener(
          "webglcontextlost",
          (e) => {
            e.preventDefault();
            setFailed(true);
          },
          false
        );
      }}
      fallback={
        <WebGLFallbackCard
          stage={stage}
          onRetry={() => setRetryKey((k) => k + 1)}
        />
      }
    >
      <SceneContent stage={stage} flashTrigger={flashTrigger} />
    </Canvas>
  );
}
