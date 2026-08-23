"use client";

import { useEffect, useRef } from "react";

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
  triangle: boolean;
};

type CoordinateLabel = {
  text: string;
  x: number;
  y: number;
  color: string;
};

const PARTICLE_COLORS = [
  "#8052ff",
  "#ffb829",
  "#15846e",
  "#2dd4bf",
  "#7c3aed",
  "#c026d3",
  "#38bdf8",
  "#ffffff",
];

const LABELS: CoordinateLabel[] = [
  { text: "agents", x: 0.64, y: 0.27, color: "#8052ff" },
  { text: "rag", x: 0.79, y: 0.39, color: "#ffb829" },
  { text: "crm", x: 0.57, y: 0.58, color: "#2dd4bf" },
  { text: "pipelines", x: 0.76, y: 0.66, color: "#8052ff" },
  { text: "content", x: 0.87, y: 0.52, color: "#c026d3" },
  { text: "analytics", x: 0.68, y: 0.76, color: "#38bdf8" },
  { text: "human review", x: 0.49, y: 0.42, color: "#bdbdbd" },
];

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function createParticles(width: number, height: number) {
  const count = Math.floor(Math.min(1250, Math.max(520, (width * height) / 900)));
  const particles: Particle[] = [];
  const centerX = width * 0.68;
  const centerY = height * 0.48;
  const radiusX = Math.max(220, width * 0.28);
  const radiusY = Math.max(150, height * 0.27);

  for (let index = 0; index < count; index += 1) {
    const inCloud = index < count * 0.78;
    let x: number;
    let y: number;

    if (inCloud) {
      const angle = randomBetween(0, Math.PI * 2);
      const radius = Math.pow(Math.random(), 0.52);
      const lobe = Math.random() > 0.48 ? -0.34 : 0.34;
      const organicOffset = Math.sin(angle * 2.7) * radiusY * 0.13;

      x = centerX + Math.cos(angle) * radiusX * radius + lobe * radiusX * 0.34 * Math.random();
      y = centerY + Math.sin(angle) * radiusY * radius + organicOffset;
    } else {
      x = randomBetween(0, width);
      y = randomBetween(0, height);
    }

    particles.push({
      x,
      y,
      originX: x,
      originY: y,
      driftX: randomBetween(-0.55, 0.55),
      driftY: randomBetween(-0.42, 0.42),
      size: inCloud ? randomBetween(1.2, 3.4) : randomBetween(0.7, 2.2),
      rotation: randomBetween(0, Math.PI * 2),
      rotationSpeed: randomBetween(-0.004, 0.004),
      alpha: inCloud ? randomBetween(0.2, 0.74) : randomBetween(0.08, 0.32),
      color: PARTICLE_COLORS[index % PARTICLE_COLORS.length],
      triangle: Math.random() > 0.28,
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

function drawLabels(context: CanvasRenderingContext2D, width: number, height: number) {
  context.save();
  context.font = '500 11px Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  context.textBaseline = "middle";

  for (const label of LABELS) {
    const x = width * label.x;
    const y = height * label.y;

    context.globalAlpha = 0.68;
    context.fillStyle = label.color;
    context.beginPath();
    context.arc(x - 14, y, 2, 0, Math.PI * 2);
    context.fill();

    context.globalAlpha = 0.55;
    context.fillStyle = "#bdbdbd";
    context.fillText(label.text, x, y);
  }

  context.restore();
}

export function HeroBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const canvasElement = canvas;

    const context = canvasElement.getContext("2d");
    if (!context) return;
    const canvasContext = context;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let start = performance.now();

    function setupCanvas() {
      const rect = canvasElement.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvasElement.width = Math.floor(width * dpr);
      canvasElement.height = Math.floor(height * dpr);
      canvasContext.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = createParticles(width, height);
      start = performance.now();
    }

    function draw(timestamp: number) {
      const elapsed = prefersReduced ? 0 : (timestamp - start) / 1000;

      canvasContext.clearRect(0, 0, width, height);
      canvasContext.fillStyle = "#000000";
      canvasContext.fillRect(0, 0, width, height);

      const glow = canvasContext.createRadialGradient(
        width * 0.7,
        height * 0.45,
        0,
        width * 0.7,
        height * 0.45,
        Math.max(width, height) * 0.62,
      );
      glow.addColorStop(0, "rgba(128, 82, 255, 0.2)");
      glow.addColorStop(0.34, "rgba(21, 132, 110, 0.08)");
      glow.addColorStop(0.7, "rgba(0, 0, 0, 0.12)");
      glow.addColorStop(1, "rgba(0, 0, 0, 0)");
      canvasContext.fillStyle = glow;
      canvasContext.fillRect(0, 0, width, height);

      for (const particle of particles) {
        const wave = prefersReduced
          ? 0
          : Math.sin(elapsed * 0.55 + particle.originX * 0.009 + particle.originY * 0.007);
        particle.x = particle.originX + wave * particle.driftX * 14;
        particle.y = particle.originY + Math.cos(elapsed * 0.43 + particle.originX * 0.006) * particle.driftY * 12;
        particle.rotation += prefersReduced ? 0 : particle.rotationSpeed;

        canvasContext.save();
        canvasContext.globalAlpha = particle.alpha;
        canvasContext.strokeStyle = particle.color;
        canvasContext.fillStyle = particle.color;
        canvasContext.lineWidth = 1;

        if (particle.triangle) {
          drawTriangle(canvasContext, particle.x, particle.y, particle.size, particle.rotation);
          canvasContext.stroke();
        } else {
          canvasContext.beginPath();
          canvasContext.arc(particle.x, particle.y, particle.size * 0.45, 0, Math.PI * 2);
          canvasContext.fill();
        }

        canvasContext.restore();
      }

      drawLabels(canvasContext, width, height);

      const fade = canvasContext.createLinearGradient(0, 0, width * 0.58, 0);
      fade.addColorStop(0, "rgba(0, 0, 0, 0.92)");
      fade.addColorStop(0.58, "rgba(0, 0, 0, 0.58)");
      fade.addColorStop(1, "rgba(0, 0, 0, 0)");
      canvasContext.fillStyle = fade;
      canvasContext.fillRect(0, 0, width * 0.62, height);

      const bottomFade = canvasContext.createLinearGradient(0, height * 0.62, 0, height);
      bottomFade.addColorStop(0, "rgba(0, 0, 0, 0)");
      bottomFade.addColorStop(1, "rgba(0, 0, 0, 0.9)");
      canvasContext.fillStyle = bottomFade;
      canvasContext.fillRect(0, height * 0.62, width, height * 0.38);
    }

    function tick(timestamp: number) {
      draw(timestamp);
      if (!prefersReduced) {
        frameRef.current = requestAnimationFrame(tick);
      }
    }

    setupCanvas();
    draw(performance.now());
    if (!prefersReduced) frameRef.current = requestAnimationFrame(tick);

    const resizeObserver = new ResizeObserver(() => {
      setupCanvas();
      draw(performance.now());
    });
    resizeObserver.observe(canvasElement);

    return () => {
      cancelAnimationFrame(frameRef.current);
      resizeObserver.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}
