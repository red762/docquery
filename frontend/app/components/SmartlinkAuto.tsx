// components/SmartlinkAuto.tsx
"use client";
import { useEffect } from "react";

export default function SmartlinkAuto() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.open(
        "https://www.effectivegatecpm.com/e59mx6i5?key=bc43b1376d6770e726d684ad4f556003",
        "_blank"
      );
    }, 1000); // 8 seconds delay
    return () => clearTimeout(timer);
  }, []);

  return null; // no visible content
}
