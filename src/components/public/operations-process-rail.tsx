"use client";

import { type CSSProperties, useCallback, useEffect, useRef, useState } from "react";

type OperationsProcessStep = {
  action: string;
  result: string;
  status: string;
};

type OperationsProcessRailProps = {
  steps: OperationsProcessStep[];
};

export function OperationsProcessRail({ steps }: OperationsProcessRailProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const tapTimerRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [manualIndex, setManualIndex] = useState<number | null>(null);
  const [indicatorTop, setIndicatorTop] = useState(12);
  const [reducedMotion, setReducedMotion] = useState(false);

  const visibleIndex = manualIndex ?? activeIndex;

  const syncIndicator = useCallback((index: number) => {
    const rail = railRef.current;
    const row = rowRefs.current[index];

    if (!rail || !row) {
      return;
    }

    const railRect = rail.getBoundingClientRect();
    const rowRect = row.getBoundingClientRect();
    const nextTop = rowRect.top - railRect.top + rowRect.height / 2 - 36;

    setIndicatorTop(Math.max(12, nextTop));
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setReducedMotion(media.matches);

    updateMotionPreference();
    media.addEventListener("change", updateMotionPreference);

    return () => media.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    syncIndicator(visibleIndex);

    const onResize = () => syncIndicator(visibleIndex);
    window.addEventListener("resize", onResize);

    return () => window.removeEventListener("resize", onResize);
  }, [syncIndicator, visibleIndex]);

  useEffect(() => {
    if (manualIndex !== null || reducedMotion || steps.length < 2) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % steps.length);
    }, 3000);

    return () => window.clearInterval(interval);
  }, [manualIndex, reducedMotion, steps.length]);

  useEffect(() => {
    return () => {
      if (tapTimerRef.current) {
        window.clearTimeout(tapTimerRef.current);
      }
    };
  }, []);

  const activateManual = (index: number) => {
    setManualIndex(index);
    setActiveIndex(index);
  };

  const pauseAfterTap = (index: number) => {
    activateManual(index);

    if (tapTimerRef.current) {
      window.clearTimeout(tapTimerRef.current);
    }

    tapTimerRef.current = window.setTimeout(() => {
      setManualIndex(null);
      tapTimerRef.current = null;
    }, 4200);
  };

  const releaseHover = () => {
    if (tapTimerRef.current) {
      return;
    }

    setManualIndex(null);
  };

  return (
    <div
      ref={railRef}
      className="ops-process-rail"
      style={{ "--indicator-top": `${indicatorTop}px` } as CSSProperties}
      data-mode={manualIndex === null ? "auto" : "manual"}
      aria-label="Как автономный бизнес-контур ведёт процесс"
    >
      {steps.map((step, index) => (
        <button
          key={step.action}
          ref={(node) => {
            rowRefs.current[index] = node;
          }}
          type="button"
          className="ops-process-rail__row"
          data-active={index === visibleIndex}
          aria-pressed={index === visibleIndex}
          onMouseEnter={() => activateManual(index)}
          onMouseLeave={releaseHover}
          onFocus={() => activateManual(index)}
          onBlur={releaseHover}
          onClick={() => pauseAfterTap(index)}
        >
          <span className="ops-process-rail__step" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="ops-process-rail__action">{step.action}</span>
          <strong className="ops-process-rail__result">{step.result}</strong>
          <span className="ops-process-rail__status">{step.status}</span>
        </button>
      ))}
    </div>
  );
}
