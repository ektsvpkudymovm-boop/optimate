"use client";

import { useEffect, useRef } from "react";

type ThemeMode = "dark" | "light";

type Particle = {
  x: number;
  y: number;
  originX: number;
  originY: number;
  driftX: number;
  driftY: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  alpha: number;
  color: string;
  isTriangle: boolean;
  isAmbient: boolean;
};

type Lobe = {
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
};

const DARK_PALETTE = [
  "#8052ff",
  "#ffb829",
  "#15846e",
  "#2dd4bf",
  "#5b8cff",
  "#c026d3",
  "#f472b6",
  "#f8fafc",
];

const LIGHT_PALETTE = [
  "#8052ff",
  "#9b6500",
  "#15846e",
  "#287b8f",
  "#334155",
  "#a21caf",
  "#5f4bb6",
  "#111111",
];

const BRAIN_LOBES: Lobe[] = [
  { x: 0.38, y: 0.47, radiusX: 0.22, radiusY: 0.24 },
  { x: 0.53, y: 0.38, radiusX: 0.27, radiusY: 0.25 },
  { x: 0.68, y: 0.45, radiusX: 0.25, radiusY: 0.25 },
  { x: 0.61, y: 0.63, radiusX: 0.28, radiusY: 0.21 },
  { x: 0.78, y: 0.58, radiusX: 0.18, radiusY: 0.18 },
];

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function getMode(): ThemeMode {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

function createConstellation(width: number, height: number, mode: ThemeMode) {
  const palette = mode === "light" ? LIGHT_PALETTE : DARK_PALETTE;
  const area = width * height;
  const count = Math.floor(Math.min(1800, Math.max(1220, area / 340)));
  const rimCount = Math.floor(count * 0.22);
  const cloudCount = Math.floor(count * 0.9);
  const particles: Particle[] = [];

  for (let index = 0; index < count; index += 1) {
    const isAmbient = index >= cloudCount;
    const isRim = index < rimCount;
    const lobe = BRAIN_LOBES[Math.floor(Math.random() * BRAIN_LOBES.length)] ?? BRAIN_LOBES[0];
    const angle = randomBetween(0, Math.PI * 2);
    const radius = isRim ? randomBetween(0.88, 1.04) : Math.pow(Math.random(), isAmbient ? 0.8 : 0.42);
    const organicWave = Math.sin(angle * 3.1 + lobe.x * 4) * height * 0.018;
    let x = width * lobe.x + Math.cos(angle) * width * lobe.radiusX * radius;
    let y = height * lobe.y + Math.sin(angle) * height * lobe.radiusY * radius + organicWave;

    if (isRim) {
      const rimRx = width * (0.36 + Math.sin(angle * 2.2) * 0.035 + Math.cos(angle * 4.4) * 0.025);
      const rimRy = height * (0.28 + Math.cos(angle * 2.6) * 0.03 + Math.sin(angle * 3.8) * 0.02);
      const topIndent = Math.max(0, Math.sin(angle - Math.PI * 0.1)) * height * 0.035;
      x = width * 0.58 + Math.cos(angle) * rimRx * radius + Math.sin(angle * 5.2) * width * 0.022;
      y = height * 0.52 + Math.sin(angle) * rimRy * radius - topIndent + Math.cos(angle * 4.1) * height * 0.018;
    }

    if (isAmbient) {
      x = randomBetween(width * 0.02, width * 0.98);
      y = randomBetween(height * 0.06, height * 0.94);
    }

    const centerBias = Math.max(0, 1 - Math.hypot(x / width - 0.58, y / height - 0.5) * 1.9);
    const colorIndex = isRim
      ? index % 5 === 0
        ? 1
        : index % 3 === 0
          ? 7
          : 0
      : (index + Math.floor(centerBias * palette.length)) % palette.length;

    particles.push({
      x,
      y,
      originX: x,
      originY: y,
      driftX: randomBetween(-0.62, 0.62),
      driftY: randomBetween(-0.42, 0.42),
      size: isAmbient ? randomBetween(0.65, 1.9) : isRim ? randomBetween(1.35, 3.35) : randomBetween(1, 2.85),
      rotation: randomBetween(0, Math.PI * 2),
      rotationSpeed: randomBetween(-0.0026, 0.0026),
      alpha: isAmbient
        ? randomBetween(mode === "light" ? 0.1 : 0.08, mode === "light" ? 0.32 : 0.27)
        : isRim
          ? randomBetween(mode === "light" ? 0.42 : 0.34, mode === "light" ? 0.88 : 0.82)
          : randomBetween(mode === "light" ? 0.22 : 0.2, mode === "light" ? 0.72 : 0.68),
      color: palette[colorIndex] ?? palette[0],
      isTriangle: isRim ? Math.random() > 0.08 : Math.random() > 0.18,
      isAmbient,
    });
  }

  return particles;
}

function drawTriangle(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  rotation: number,
) {
  context.beginPath();
  for (let point = 0; point < 3; point += 1) {
    const angle = rotation + point * ((Math.PI * 2) / 3);
    const px = x + Math.cos(angle) * size;
    const py = y + Math.sin(angle) * size;
    if (point === 0) context.moveTo(px, py);
    else context.lineTo(px, py);
  }
  context.closePath();
}

export function ParticleConstellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const canvasElement = canvas;
    const canvasContext = context;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 1;
    let height = 1;
    let mode = getMode();
    let particles: Particle[] = [];
    let startedAt = performance.now();

    const setupCanvas = () => {
      const rect = canvasElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvasElement.width = Math.floor(width * dpr);
      canvasElement.height = Math.floor(height * dpr);
      canvasContext.setTransform(dpr, 0, 0, dpr, 0, 0);
      mode = getMode();
      particles = createConstellation(width, height, mode);
      startedAt = performance.now();
    };

    const draw = (timestamp: number) => {
      const reducedMotion = mediaQuery.matches;
      const elapsed = reducedMotion ? 0 : (timestamp - startedAt) / 1000;

      canvasContext.clearRect(0, 0, width, height);

      const glow = canvasContext.createRadialGradient(
        width * 0.58,
        height * 0.52,
        0,
        width * 0.58,
        height * 0.52,
        Math.max(width, height) * 0.58,
      );
      if (mode === "light") {
        glow.addColorStop(0, "rgba(128, 82, 255, 0.11)");
        glow.addColorStop(0.5, "rgba(255, 184, 41, 0.05)");
        glow.addColorStop(1, "rgba(255, 255, 255, 0)");
      } else {
        glow.addColorStop(0, "rgba(128, 82, 255, 0.13)");
        glow.addColorStop(0.46, "rgba(21, 132, 110, 0.06)");
        glow.addColorStop(1, "rgba(0, 0, 0, 0)");
      }
      canvasContext.fillStyle = glow;
      canvasContext.fillRect(0, 0, width, height);

      for (const particle of particles) {
        const wave = reducedMotion
          ? 0
          : Math.sin(elapsed * 0.34 + particle.originX * 0.006 + particle.originY * 0.004);
        const pulse = reducedMotion ? 1 : 0.86 + Math.sin(elapsed * 0.5 + particle.originX * 0.01) * 0.14;
        particle.x = particle.originX + wave * particle.driftX * (particle.isAmbient ? 10 : 16);
        particle.y =
          particle.originY +
          Math.cos(elapsed * 0.27 + particle.originX * 0.004) * particle.driftY * (particle.isAmbient ? 9 : 13);
        particle.rotation += reducedMotion ? 0 : particle.rotationSpeed;

        canvasContext.save();
        canvasContext.globalAlpha = particle.alpha * pulse;
        canvasContext.strokeStyle = particle.color;
        canvasContext.fillStyle = particle.color;
        canvasContext.lineWidth = particle.isAmbient ? 0.75 : 1;

        if (particle.isTriangle) {
          drawTriangle(canvasContext, particle.x, particle.y, particle.size, particle.rotation);
          canvasContext.stroke();
        } else {
          canvasContext.beginPath();
          canvasContext.arc(particle.x, particle.y, Math.max(0.7, particle.size * 0.46), 0, Math.PI * 2);
          canvasContext.fill();
        }

        canvasContext.restore();
      }
    };

    const tick = (timestamp: number) => {
      draw(timestamp);
      if (!mediaQuery.matches) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    setupCanvas();
    draw(performance.now());
    if (!mediaQuery.matches) frameRef.current = requestAnimationFrame(tick);

    const resizeObserver = new ResizeObserver(() => {
      setupCanvas();
      draw(performance.now());
    });
    resizeObserver.observe(canvasElement);

    const mutationObserver = new MutationObserver(() => {
      const nextMode = getMode();
      if (nextMode === mode) return;
      setupCanvas();
      draw(performance.now());
      if (!mediaQuery.matches) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = requestAnimationFrame(tick);
      }
    });
    mutationObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      cancelAnimationFrame(frameRef.current);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="v4-particle-canvas" aria-hidden="true" />;
}
