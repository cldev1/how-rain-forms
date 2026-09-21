"use client";

import dynamic from "next/dynamic";
import { StageConfig } from "./stageConfig";

const CanvasInner = dynamic(() => import("./RainCanvasInner"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "linear-gradient(180deg, #A8D8FF 0%, #E8F4FF 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.25rem",
        color: "#4A6A8A",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      Dew is waking up…
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
