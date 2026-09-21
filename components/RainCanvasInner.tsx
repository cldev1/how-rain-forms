"use client";

import { Canvas } from "@react-three/fiber";
import { SceneContent } from "./RainScene";
import { StageConfig } from "./stageConfig";

export default function RainCanvasInner({
  stage,
  flashTrigger,
}: {
  stage: StageConfig;
  flashTrigger: number;
}) {
  return (
    <Canvas
      camera={{ position: [0, 1.15, 7.2], fov: 40 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%", touchAction: "none" }}
    >
      <SceneContent stage={stage} flashTrigger={flashTrigger} />
    </Canvas>
  );
}
