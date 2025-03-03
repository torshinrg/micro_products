"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";

const FireworksNoSSR = dynamic(
  () => import("@fireworks-js/react").then((mod) => mod.Fireworks),
  { ssr: false }
);

export function FireworkAnimation({ duration = 3000, onComplete }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  if (!visible) return null;

  const options = {
    acceleration: 1.05,
    friction: 0.97,
    gravity: 1.5,
    particles: 80,
    explosion: 5,
  };

  // The full-screen overlay
  const overlay = (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    >
      <FireworksNoSSR options={options} />
    </div>
  );

  // Render outside your normal React hierarchy, directly into <body>
  // to avoid any layout constraints
  if (typeof document !== "undefined") {
    return createPortal(overlay, document.body);
  } else {
    // During SSR, return nothing
    return null;
  }
}
