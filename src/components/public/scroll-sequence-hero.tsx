"use client";

import Link from "next/link";
import NextImage from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowRight } from "lucide-react";

const SEQUENCE_SPEED = 1.4;

type SequenceTheme = "dark" | "light";
type SequenceMode = "night" | "theme";

type SequenceConfig = {
  basePath: string;
  frameCount: number;
  width: number;
  height: number;
  backgroundColor: string;
};

const SEQUENCES: Record<SequenceTheme, SequenceConfig> = {
  dark: {
    basePath: "/sequence/hero-night-hq",
    frameCount: 121,
    width: 1896,
    height: 1080,
    backgroundColor: "#000000",
  },
  light: {
    basePath: "/sequence/hero-day-hq",
    frameCount: 150,
    width: 1896,
    height: 1080,
    backgroundColor: "#f4efe6",
  },
};

const RENDER_SETTINGS = {
  fitMode: "cover",
  desktopScale: 0.66,
  mobileScale: 0.7,
  desktopRightInset: 0,
  desktopOffsetY: -0.015,
  mobileRightInset: 0,
  mobileOffsetY: 0.02,
};

type ScrollSequenceHeroProps = {
  id?: string;
  sequenceMode?: SequenceMode;
};

type NavigatorConnectionInfo = {
  effectiveType?: string;
  saveData?: boolean;
};

type NavigatorWithConnection = Navigator & {
  connection?: NavigatorConnectionInfo;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function rangeOpacity(progress: number, start: number, fadeInEnd: number, fadeOutStart: number, end: number) {
  if (progress <= start || progress >= end) return 0;
  if (progress < fadeInEnd) return clamp((progress - start) / Math.max(0.001, fadeInEnd - start), 0, 1);
  if (progress > fadeOutStart) return clamp((end - progress) / Math.max(0.001, end - fadeOutStart), 0, 1);
  return 1;
}

function shouldUseStaticPlayback(mediaQuery: MediaQueryList) {
  const connection = (navigator as NavigatorWithConnection).connection;
  const weakConnection = connection?.effectiveType === "slow-2g" || connection?.effectiveType === "2g";

  return mediaQuery.matches || connection?.saveData === true || weakConnection;
}

function getDocumentTheme(): SequenceTheme {
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

function getThemeSnapshot(): SequenceTheme {
  return typeof document === "undefined" ? "dark" : getDocumentTheme();
}

function getServerThemeSnapshot(): SequenceTheme {
  return "dark";
}

function subscribeToThemeChange(onStoreChange: () => void) {
  if (typeof document === "undefined") return () => {};

  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });

  return () => observer.disconnect();
}

function frameUrl(index: number, sequence: SequenceConfig) {
  return `${sequence.basePath}/frame_${String(index).padStart(3, "0")}.webp`;
}

export function ScrollSequenceHero({
  id = "home-sequence-hero-title",
  sequenceMode = "night",
}: ScrollSequenceHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loadedProgress, setLoadedProgress] = useState(0);
  const observedTheme = useSyncExternalStore(
    subscribeToThemeChange,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );
  const activeThemeMode: SequenceTheme = sequenceMode === "theme" ? observedTheme : "dark";
  const activeSequence = SEQUENCES[activeThemeMode];

  useEffect(() => {
    const sequence = activeSequence;
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    setLoadedProgress(0);

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = window.matchMedia("(max-width: 900px)");
    const cache = new Map<number, HTMLImageElement>();
    const loadingFrames = new Set<number>();
    const everLoadedFrames = new Set<number>();
    const queue: number[] = [];

    let disposed = false;
    let playbackDisabled = shouldUseStaticPlayback(mediaQuery);
    let sequenceLoadingStarted = false;
    let activeLoads = 0;
    let targetFrame = 0;
    let lastDrawnFrame = -1;
    let canvasWidth = 1;
    let canvasHeight = 1;
    let progressRaf: number | null = null;

    const getConcurrency = () => (mobileQuery.matches ? 3 : 5);
    const getMaxCacheSize = () => (mobileQuery.matches ? 64 : 128);

    const setBeatVariables = (progress: number) => {
      section.style.setProperty("--sequence-progress", progress.toFixed(4));
      section.style.setProperty("--sequence-copy-opacity", String(1 - rangeOpacity(progress, 0.22, 0.34, 0.88, 0.98) * 0.1));

      const beatB = rangeOpacity(progress, 0.25, 0.32, 0.43, 0.48);
      const beatC = rangeOpacity(progress, 0.5, 0.56, 0.68, 0.73);
      const beatD = rangeOpacity(progress, 0.75, 0.82, 0.94, 0.98);

      section.style.setProperty("--beat-b-opacity", beatB.toFixed(3));
      section.style.setProperty("--beat-c-opacity", beatC.toFixed(3));
      section.style.setProperty("--beat-d-opacity", beatD.toFixed(3));
      section.style.setProperty("--beat-b-y", `${Math.round((1 - beatB) * 16)}px`);
      section.style.setProperty("--beat-c-y", `${Math.round((1 - beatC) * 16)}px`);
      section.style.setProperty("--beat-d-y", `${Math.round((1 - beatD) * 16)}px`);
    };

    const findNearestCachedFrame = (index: number) => {
      const exact = cache.get(index);
      if (exact) return { index, image: exact };

      let nearestIndex = -1;
      let nearestImage: HTMLImageElement | null = null;
      let nearestDistance = Number.POSITIVE_INFINITY;

      cache.forEach((image, frameIndex) => {
        const distance = Math.abs(frameIndex - index);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = frameIndex;
          nearestImage = image;
        }
      });

      return nearestImage ? { index: nearestIndex, image: nearestImage } : null;
    };

    const promoteCachedFrame = (index: number, image: HTMLImageElement) => {
      cache.delete(index);
      cache.set(index, image);
    };

    const trimCache = () => {
      const maxCacheSize = getMaxCacheSize();
      while (cache.size > maxCacheSize) {
        let evictIndex: number | null = null;

        for (const frameIndex of cache.keys()) {
          const nearTarget = Math.abs(frameIndex - targetFrame) <= 10;
          if (frameIndex !== 0 && !nearTarget) {
            evictIndex = frameIndex;
            break;
          }
        }

        if (evictIndex === null) break;
        cache.delete(evictIndex);
      }
    };

    const drawFrame = (index: number, force = false) => {
      const frame = findNearestCachedFrame(index);
      if (!frame) return;
      if (!force && frame.index === lastDrawnFrame) return;

      lastDrawnFrame = frame.index;
      promoteCachedFrame(frame.index, frame.image);

      context.clearRect(0, 0, canvasWidth, canvasHeight);
      context.fillStyle = sequence.backgroundColor;
      context.fillRect(0, 0, canvasWidth, canvasHeight);

      const imageWidth = frame.image.naturalWidth || sequence.width;
      const imageHeight = frame.image.naturalHeight || sequence.height;
      const baseScale =
        RENDER_SETTINGS.fitMode === "cover"
          ? Math.max(canvasWidth / imageWidth, canvasHeight / imageHeight)
          : Math.min(canvasWidth / imageWidth, canvasHeight / imageHeight);
      const settings = mobileQuery.matches
        ? {
            scale: RENDER_SETTINGS.mobileScale,
            rightInset: RENDER_SETTINGS.mobileRightInset,
            offsetY: RENDER_SETTINGS.mobileOffsetY,
          }
        : {
            scale: RENDER_SETTINGS.desktopScale,
            rightInset: RENDER_SETTINGS.desktopRightInset,
            offsetY: RENDER_SETTINGS.desktopOffsetY,
          };

      const drawWidth = imageWidth * baseScale * settings.scale;
      const drawHeight = imageHeight * baseScale * settings.scale;
      const rawDrawX = canvasWidth - drawWidth + canvasWidth * settings.rightInset;
      const rawDrawY = (canvasHeight - drawHeight) / 2 + canvasHeight * settings.offsetY;
      const minDrawX = Math.min(0, canvasWidth - drawWidth);
      const maxDrawX = Math.max(0, canvasWidth - drawWidth);
      const maxDrawY = canvasHeight - drawHeight;
      const drawX = clamp(rawDrawX, minDrawX, maxDrawX);
      const drawY = maxDrawY >= 0 ? clamp(rawDrawY, 0, maxDrawY) : rawDrawY;

      context.drawImage(frame.image, drawX, drawY, drawWidth, drawHeight);
    };

    const setupCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, mobileQuery.matches ? 1.5 : 2);
      canvasWidth = Math.max(1, Math.round(rect.width));
      canvasHeight = Math.max(1, Math.round(rect.height));
      canvas.width = Math.floor(canvasWidth * dpr);
      canvas.height = Math.floor(canvasHeight * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawFrame(targetFrame, true);
    };

    const enqueueFrames = (frames: number[]) => {
      for (const frameIndex of frames) {
        if (frameIndex < 0 || frameIndex >= sequence.frameCount) continue;
        if (cache.has(frameIndex) || loadingFrames.has(frameIndex) || queue.includes(frameIndex)) continue;
        queue.push(frameIndex);
      }
    };

    const enqueueAround = (center: number) => {
      const nearbyFrames: number[] = [center];
      const radius = mobileQuery.matches ? 12 : 18;

      for (let offset = 1; offset <= radius; offset += 1) {
        nearbyFrames.push(center - offset, center + offset);
      }

      enqueueFrames(nearbyFrames);
    };

    const enqueueProgressiveFill = () => {
      const anchors: number[] = [];
      const anchorStep = mobileQuery.matches ? 12 : 8;

      for (let index = 0; index < sequence.frameCount; index += anchorStep) {
        anchors.push(index);
      }

      for (let index = 0; index < sequence.frameCount; index += 1) {
        anchors.push(index);
      }

      enqueueFrames(anchors);
    };

    const loadFrame = (frameIndex: number) =>
      new Promise<void>((resolve) => {
        if (cache.has(frameIndex) || loadingFrames.has(frameIndex)) {
          resolve();
          return;
        }

        loadingFrames.add(frameIndex);

        const image = new Image();
        image.decoding = "async";
        image.onload = () => {
          loadingFrames.delete(frameIndex);
          if (disposed) {
            resolve();
            return;
          }

          cache.set(frameIndex, image);
          trimCache();

          if (!everLoadedFrames.has(frameIndex)) {
            everLoadedFrames.add(frameIndex);
            setLoadedProgress(everLoadedFrames.size / sequence.frameCount);
          }

          if (frameIndex === 0 || Math.abs(frameIndex - targetFrame) <= 2) {
            drawFrame(targetFrame, frameIndex === 0);
          }

          resolve();
        };
        image.onerror = () => {
          loadingFrames.delete(frameIndex);
          resolve();
        };
        image.src = frameUrl(frameIndex, sequence);
      });

    const pumpQueue = () => {
      if (disposed || playbackDisabled) return;

      while (activeLoads < getConcurrency() && queue.length > 0) {
        const nextFrame = queue.shift();
        if (nextFrame === undefined || cache.has(nextFrame) || loadingFrames.has(nextFrame)) continue;

        activeLoads += 1;
        void loadFrame(nextFrame).finally(() => {
          activeLoads -= 1;
          pumpQueue();
        });
      }
    };

    const startSequenceLoading = () => {
      if (sequenceLoadingStarted || playbackDisabled) return;
      sequenceLoadingStarted = true;
      enqueueAround(targetFrame);
      enqueueProgressiveFill();
      pumpQueue();
    };

    const updateProgress = () => {
      progressRaf = null;

      const rect = section.getBoundingClientRect();
      const scrollableDistance = Math.max(1, rect.height - window.innerHeight);
      const progress = clamp((0 - rect.top) / scrollableDistance, 0, 1);
      setBeatVariables(playbackDisabled ? 0 : progress);

      if (playbackDisabled) {
        targetFrame = 0;
        drawFrame(0);
        return;
      }

      const sequenceProgress = clamp(progress * SEQUENCE_SPEED, 0, 1);
      const nextFrame = Math.round(sequenceProgress * (sequence.frameCount - 1));
      if (nextFrame !== targetFrame) {
        targetFrame = nextFrame;
        drawFrame(nextFrame);
        enqueueAround(nextFrame);
        pumpQueue();
      }
    };

    const requestProgressUpdate = () => {
      if (progressRaf !== null) return;
      progressRaf = window.requestAnimationFrame(updateProgress);
    };

    const handleMotionChange = () => {
      playbackDisabled = shouldUseStaticPlayback(mediaQuery);

      if (playbackDisabled) {
        targetFrame = 0;
        setBeatVariables(0);
        drawFrame(0, true);
        return;
      }

      requestProgressUpdate();
      startSequenceLoading();
    };

    const handleMobileChange = () => {
      setupCanvas();
      enqueueAround(targetFrame);
      pumpQueue();
    };

    const resizeObserver = new ResizeObserver(() => {
      setupCanvas();
      requestProgressUpdate();
    });

    setupCanvas();
    setBeatVariables(0);
    void loadFrame(0);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          startSequenceLoading();
        }
      },
      { rootMargin: "320px 0px" },
    );

    resizeObserver.observe(canvas);
    observer.observe(section);

    window.addEventListener("scroll", requestProgressUpdate, { passive: true });
    window.addEventListener("resize", requestProgressUpdate);
    mediaQuery.addEventListener("change", handleMotionChange);
    mobileQuery.addEventListener("change", handleMobileChange);

    requestProgressUpdate();

    return () => {
      disposed = true;
      if (progressRaf !== null) window.cancelAnimationFrame(progressRaf);
      resizeObserver.disconnect();
      observer.disconnect();
      window.removeEventListener("scroll", requestProgressUpdate);
      window.removeEventListener("resize", requestProgressUpdate);
      mediaQuery.removeEventListener("change", handleMotionChange);
      mobileQuery.removeEventListener("change", handleMobileChange);
    };
  }, [activeSequence]);

  return (
    <section
      ref={sectionRef}
      className="scroll-sequence-hero"
      data-sequence-theme={activeThemeMode}
      aria-labelledby={id}
    >
      <div className="scroll-sequence-hero__sticky">
        <div className="scroll-sequence-hero__inner">
          <div className="scroll-sequence-hero__copy">
            <h1 id={id} className="scroll-sequence-hero__title">
              <span>AI-системы</span>
              <span>для бизнеса,</span>
              <span>который вырос</span>
              <span>из ручного</span>
              <span>управления</span>
            </h1>
            <p className="scroll-sequence-hero__lead">
              Проектируем автономные операционные контуры: интерфейсы, данные, AI-агентов,
              RAG, CRM, n8n/API-пайплайны, аналитику и контроль человека.
            </p>
            <div className="scroll-sequence-hero__actions" aria-label="Основные действия">
              <Link href="/contacts" className="scroll-sequence-hero__primary">
                Разобрать процесс
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/work" className="scroll-sequence-hero__secondary">
                Смотреть кейсы
              </Link>
            </div>
            <p className="scroll-sequence-hero__status">
              Autonomous mode: система продолжает держать процесс.
            </p>
          </div>

          <div className="scroll-sequence-hero__visual" aria-hidden="true">
            <NextImage
              className="scroll-sequence-hero__poster"
              src={frameUrl(0, activeSequence)}
              alt=""
              width={activeSequence.width}
              height={activeSequence.height}
              priority
              unoptimized
            />
            <canvas ref={canvasRef} className="scroll-sequence-hero__canvas" />
          </div>

          <div className="scroll-sequence-hero__beats" aria-hidden="true">
            <p className="scroll-sequence-hero__beat scroll-sequence-hero__beat--b">
              Данные собираются в единый контур
            </p>
            <p className="scroll-sequence-hero__beat scroll-sequence-hero__beat--c">
              AI-агенты связывают заявки, CRM, RAG и n8n/API
            </p>
            <p className="scroll-sequence-hero__beat scroll-sequence-hero__beat--d">
              Система держит процесс, пока команда занимается решениями
            </p>
          </div>
        </div>

        <div className="scroll-sequence-hero__loader" aria-hidden="true">
          <span style={{ transform: `scaleX(${loadedProgress})` }} />
        </div>
      </div>
    </section>
  );
}
