"use client";

import { Component, type ReactNode } from "react";

/** If the 3D scene fails for any reason, drop it silently; the static hero background stays. */
export class SceneErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("Hero scene disabled:", error);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
