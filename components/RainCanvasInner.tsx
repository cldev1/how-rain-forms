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
      camera={{ position: [0, 1.2, 7.5], fov: 42 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: false }}
      style={{ width: "100%", height: "100%", touchAction: "none" }}
    >
      <color attach="background" args={[stage.skyBottom]} />
      <SceneContent stage={stage} flashTrigger={flashTrigger} />
    </Canvas>
  );
}
