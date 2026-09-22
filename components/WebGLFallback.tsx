"use client";

import { Component, type ReactNode } from "react";
import { StageConfig } from "./stageConfig";
import { StageIcon } from "./StageIcons";

type Props = {
  stage: StageConfig;
  children: ReactNode;
};

type State = { hasError: boolean; retryKey: number };

/** Soft-land when WebGL/Canvas throws — never leave a blank hole. */
export class WebGLErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, retryKey: 0 };

  static getDerivedStateFromError(): Partial<State> {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn("[Dew] WebGL/canvas failed:", error?.message ?? error);
  }

  retry = () => {
    this.setState((s) => ({ hasError: false, retryKey: s.retryKey + 1 }));
  };

  render() {
    if (this.state.hasError) {
      return (
        <WebGLFallbackCard stage={this.props.stage} onRetry={this.retry} />
      );
    }
    return (
      <div key={this.state.retryKey} className="webgl-canvas-slot">
        {this.props.children}
      </div>
    );
  }
}

export function WebGLFallbackCard({
  stage,
  onRetry,
}: {
  stage: StageConfig;
  onRetry: () => void;
}) {
  return (
    <div
      className="webgl-fallback"
      style={{
        background: `linear-gradient(180deg, ${stage.skyTop} 0%, ${stage.skyBottom} 100%)`,
      }}
      role="alert"
    >
      <div className="webgl-fallback-icon" aria-hidden>
        <StageIcon id={stage.icon} size={72} />
      </div>
      <DewDropSvg />
      <p className="webgl-fallback-kid">{stage.kidLine}</p>
      <p className="webgl-fallback-hint">
        The 3D sky needs a little help on this device.
      </p>
      <button type="button" className="webgl-fallback-retry" onClick={onRetry}>
        Try again
      </button>
    </div>
  );
}

function DewDropSvg() {
  return (
    <svg
      className="webgl-fallback-dew"
      width="56"
      height="64"
      viewBox="0 0 56 64"
      aria-hidden
    >
      <defs>
        <linearGradient id="fbDew" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E8F8FF" />
          <stop offset="55%" stopColor="#7ED0FF" />
          <stop offset="100%" stopColor="#4AB0F0" />
        </linearGradient>
      </defs>
      <path
        d="M28 4C28 4 8 28 8 42a20 20 0 0040 0C48 28 28 4 28 4z"
        fill="url(#fbDew)"
        stroke="#5BB8E8"
        strokeWidth="1.5"
      />
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
    </svg>
  );
}
