"use client";

import { useEffect, useState, useRef } from "react";
import { RefreshCw } from "lucide-react";

export default function PullToRefresh() {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const isPulling = useRef(false);

  const PULL_THRESHOLD = 75; // px distance required to trigger reload

  useEffect(() => {
    // Only active on touch-enabled mobile devices
    if (typeof window === "undefined" || !("ontouchstart" in window)) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        startY.current = e.touches[0].clientY;
        isPulling.current = true;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling.current || window.scrollY > 0) return;
      const currentY = e.touches[0].clientY;
      const diff = currentY - startY.current;

      if (diff > 0) {
        // Apply smooth resistance curve
        const distance = Math.min(diff * 0.45, 110);
        setPullDistance(distance);
      } else {
        setPullDistance(0);
      }
    };

    const handleTouchEnd = () => {
      if (!isPulling.current) return;
      isPulling.current = false;

      if (pullDistance >= PULL_THRESHOLD && !isRefreshing) {
        setIsRefreshing(true);
        setPullDistance(60);
        setTimeout(() => {
          window.location.reload();
        }, 400);
      } else {
        setPullDistance(0);
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [pullDistance, isRefreshing]);

  if (pullDistance === 0 && !isRefreshing) return null;

  const progress = Math.min(pullDistance / PULL_THRESHOLD, 1);
  const rotation = progress * 360;

  return (
    <div
      className="fixed top-3 left-0 right-0 z-50 flex justify-center pointer-events-none transition-transform duration-100 ease-out"
      style={{
        transform: `translateY(${Math.min(pullDistance, 70)}px)`
      }}
    >
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-950/90 border border-brand-orange/50 text-brand-orange shadow-[0_0_25px_rgba(255,122,0,0.4)] backdrop-blur-md text-xs font-semibold tracking-wider uppercase font-mono">
        <RefreshCw
          className={`w-4 h-4 text-brand-orange ${
            isRefreshing ? "animate-spin" : ""
          }`}
          style={{
            transform: isRefreshing ? undefined : `rotate(${rotation}deg)`
          }}
        />
        <span>{isRefreshing ? "Refreshing..." : pullDistance >= PULL_THRESHOLD ? "Release to Refresh" : "Pull to Refresh"}</span>
      </div>
    </div>
  );
}
