/**
 * Particles thrown off the leading edge of the theme sweep.
 *  - arriving light mode → paint flung from a swung brush: tapered streaks,
 *    dry-bristle dashes, blots and specks
 *  - arriving dark mode  → a curtain of 1s and 0s
 * Both are densest right on the sweep line and fade out the further they are
 * from it, so the effect travels with the line instead of filling the screen.
 * Drawn on a full-viewport canvas that sits above the view transition.
 */

type Persona = "light" | "dark";
type Dir = "ltr" | "rtl";

const PIGMENTS = [
  "#CF6C58", // coral
  "#E0B062", // ochre
  "#6FA0A6", // washed teal
  "#E58F7B", // salmon
  "#2F6F78", // deep teal
  "#8E5572", // plum
  "#8FAE8B", // sage
  "#F2D08A", // naples yellow
  "#3D5A80", // ink blue
];
const BITS = ["#00D4FF", "#00D4FF", "#3DF5A0", "#7C9CFF", "#E6EDF3"];

type Kind = "streak" | "bristle" | "blot" | "specks" | "bit";

type Particle = {
  kind: Kind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  size: number;
  len: number;
  color: string;
  born: number;
  /** pre-rolled shape detail so the mark doesn't shimmer frame to frame */
  shape: number[];
  glyph?: string;
};

/** Same curve as the CSS animation, so particles stay glued to the edge. */
function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const axis = (t: number, a: number, b: number) =>
    3 * (1 - t) * (1 - t) * t * a + 3 * (1 - t) * t * t * b + t * t * t;
  return (x: number) => {
    let lo = 0;
    let hi = 1;
    let t = x;
    for (let i = 0; i < 22; i++) {
      t = (lo + hi) / 2;
      if (axis(t, x1, x2) < x) lo = t;
      else hi = t;
    }
    return axis(t, y1, y2);
  };
}

const ease = cubicBezier(0.7, 0, 0.3, 1);
const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(list: T[]) => list[(Math.random() * list.length) | 0];
const rolls = (n: number) => Array.from({ length: n }, Math.random);

let stopCurrent: (() => void) | null = null;

/**
 * Glowing 0/1 glyphs are rendered once into small sprites and then stamped with
 * drawImage. Per-particle fillText + shadowBlur was by far the most expensive
 * part of the sweep.
 */
const SPRITE = 56;
const SPRITE_FONT = 28;
let bitSprites: Map<string, HTMLCanvasElement> | null = null;

function getBitSprites() {
  if (bitSprites) return bitSprites;
  const sprites = new Map<string, HTMLCanvasElement>();
  for (const color of new Set(BITS)) {
    for (const glyph of ["0", "1"]) {
      const c = document.createElement("canvas");
      c.width = c.height = SPRITE;
      const g = c.getContext("2d")!;
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.font = `600 ${SPRITE_FONT}px "JetBrains Mono", monospace`;
      g.fillStyle = color;
      g.shadowColor = color;
      g.shadowBlur = 9;
      g.fillText(glyph, SPRITE / 2, SPRITE / 2 + 1);
      sprites.set(color + glyph, c);
    }
  }
  // only keep them once the real font is in, otherwise rebuild next time
  if (document.fonts?.check(`600 ${SPRITE_FONT}px "JetBrains Mono"`)) bitSprites = sprites;
  return sprites;
}

export function runSweepFx(canvas: HTMLCanvasElement, to: Persona, dir: Dir, ms: number) {
  stopCurrent?.();

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
  const W = window.innerWidth;
  const H = window.innerHeight;
  canvas.width = Math.floor(W * dpr);
  canvas.height = Math.floor(H * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const sign = dir === "ltr" ? 1 : -1;
  // where the visible wipe edge sits inside the moving mask (see ThemeContext)
  const span = to === "light" ? 1.1 : 1.05;
  const half = to === "light" ? 0.05 : 0.025;
  // how far from the line a particle is still visible
  const reach = to === "light" ? 300 : 240;
  const edgeAt = (e: number) => {
    const travelled = (e * span - half) * W;
    return dir === "ltr" ? travelled : W - travelled;
  };

  const sprites = to === "dark" ? getBitSprites() : null;
  const start = performance.now();
  let particles: Particle[] = [];
  let lastEdge = edgeAt(0);
  let lastNow = start;
  let raf = 0;
  let stopped = false;

  /** distance from the line, biased hard toward zero so marks crowd the line */
  const nearLine = (spread: number, power: number) => Math.pow(Math.random(), power) * spread;

  const spawnPaint = (edge: number, now: number) => {
    const y = Math.random() * H;
    // a swung brush fans its paint out: up at the top, down at the bottom
    const fan = (y / H - 0.5) * 1.1;
    const base = dir === "ltr" ? 0 : Math.PI;
    const roll = Math.random();
    const color = pick(PIGMENTS);

    if (roll < 0.46) {
      // dry-bristle dashes — the brush itself, hugging the line
      const angle = base + sign * fan * 0.35 + rand(-0.12, 0.12);
      particles.push({
        kind: "bristle",
        x: edge + sign * (nearLine(70, 2.2) - 24),
        y,
        vx: Math.cos(angle) * rand(0.02, 0.14),
        vy: Math.sin(angle) * rand(0.02, 0.14),
        angle,
        size: rand(10, 30), // band height
        len: rand(36, 130),
        color,
        born: now,
        shape: rolls(24),
      });
    } else if (roll < 0.78) {
      // tapered streak — a drop flung off the bristles
      const angle = base + sign * fan + rand(-0.3, 0.3);
      const speed = rand(0.25, 1.05);
      particles.push({
        kind: "streak",
        x: edge + sign * nearLine(60, 1.6),
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        angle,
        size: rand(3, 11),
        len: rand(26, 120) * (0.5 + speed * 0.7),
        color,
        born: now,
        shape: rolls(4),
      });
    } else if (roll < 0.92) {
      // arc of fine specks
      const angle = base + sign * fan * 1.2 + rand(-0.5, 0.5);
      const speed = rand(0.3, 0.9);
      particles.push({
        kind: "specks",
        x: edge + sign * nearLine(90, 1.4),
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        angle,
        size: rand(1.2, 3.2),
        len: rand(30, 90),
        color,
        born: now,
        shape: rolls(18),
      });
    } else {
      // heavy blot that lands and runs a little
      const angle = base + sign * fan + rand(-0.4, 0.4);
      const speed = rand(0.1, 0.45);
      particles.push({
        kind: "blot",
        x: edge + sign * nearLine(110, 1.5),
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        angle,
        size: rand(7, 17),
        len: 0,
        color,
        born: now,
        shape: rolls(16),
      });
    }
  };

  const spawnBit = (edge: number, now: number) => {
    // mostly packed on the line, thinning out behind and ahead of it
    const side = Math.random() < 0.6 ? -1 : 1;
    particles.push({
      kind: "bit",
      x: edge + sign * side * nearLine(side < 0 ? 200 : 130, 2.6),
      y: Math.random() * H,
      vx: sign * rand(0.0, 0.1),
      vy: rand(0.02, 0.16),
      angle: 0,
      size: rand(10, 20),
      len: 0,
      color: pick(BITS),
      born: now,
      shape: [],
      glyph: Math.random() < 0.5 ? "0" : "1",
    });
  };

  const drawPaint = (q: Particle, alpha: number) => {
    const cos = Math.cos(q.angle) * dpr;
    const sin = Math.sin(q.angle) * dpr;
    ctx.setTransform(cos, sin, -sin, cos, q.x * dpr, q.y * dpr);
    ctx.fillStyle = q.color;
    ctx.strokeStyle = q.color;

    if (q.kind === "streak") {
      // teardrop: fat head leading, long tapered tail trailing behind
      const w = q.size;
      const L = q.len;
      ctx.globalAlpha = alpha * 0.92;
      ctx.beginPath();
      ctx.moveTo(-L, 0);
      ctx.quadraticCurveTo(-L * 0.35, -w * (0.45 + q.shape[0] * 0.35), 0, -w / 2);
      ctx.arc(0, 0, w / 2, -Math.PI / 2, Math.PI / 2);
      ctx.quadraticCurveTo(-L * 0.35, w * (0.45 + q.shape[1] * 0.35), -L, 0);
      ctx.fill();
      // a stray droplet that broke off ahead of it
      if (q.shape[2] > 0.45) {
        ctx.beginPath();
        ctx.ellipse(w * (1.4 + q.shape[3] * 2.5), (q.shape[2] - 0.7) * w, w * 0.34, w * 0.2, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (q.kind === "bristle") {
      // parallel hair-lines of uneven length — a dry brush dragged across
      const n = 5 + Math.floor(q.shape[0] * 7);
      ctx.lineCap = "round";
      for (let i = 0; i < n; i++) {
        const r1 = q.shape[1 + i];
        const r2 = q.shape[12 + i];
        const y = (i / (n - 1) - 0.5) * q.size;
        const tail = -q.len * (0.35 + r1 * 0.65);
        const head = q.len * 0.18 * r2;
        ctx.globalAlpha = alpha * (0.45 + r2 * 0.5);
        ctx.lineWidth = 0.8 + r1 * 2.6;
        ctx.beginPath();
        ctx.moveTo(tail, y + (r2 - 0.5) * 2);
        ctx.lineTo(head, y);
        ctx.stroke();
      }
    } else if (q.kind === "specks") {
      // a spray of tiny flecks strung along the direction of the flick
      ctx.globalAlpha = alpha * 0.9;
      for (let i = 0; i < 6; i++) {
        const along = -q.len * q.shape[i * 3];
        const across = (q.shape[i * 3 + 1] - 0.5) * q.len * 0.35;
        const r = q.size * (0.5 + q.shape[i * 3 + 2]);
        ctx.beginPath();
        ctx.ellipse(along, across, r * 1.9, r * 0.75, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      // blot: a lumpy gob of paint
      const pts = 9;
      ctx.globalAlpha = alpha * 0.9;
      ctx.beginPath();
      for (let i = 0; i <= pts; i++) {
        const a = (i / pts) * Math.PI * 2;
        const a2 = ((i + 0.5) / pts) * Math.PI * 2;
        const r = q.size * (0.6 + q.shape[i % pts] * 0.65);
        const r2 = q.size * (0.6 + q.shape[(i + 1) % pts] * 0.65);
        if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
        ctx.quadraticCurveTo(
          Math.cos(a2) * (r + r2) * 0.58,
          Math.sin(a2) * (r + r2) * 0.58,
          Math.cos(a + (Math.PI * 2) / pts) * r2,
          Math.sin(a + (Math.PI * 2) / pts) * r2,
        );
      }
      ctx.fill();
      // smeared tail dragged out behind it, tapering to nothing
      const tail = q.size * (2.2 + q.shape[10] * 3.5);
      ctx.globalAlpha = alpha * 0.6;
      ctx.beginPath();
      ctx.moveTo(-tail, 0);
      ctx.quadraticCurveTo(-tail * 0.4, -q.size * 0.5, 0, -q.size * 0.55);
      ctx.lineTo(0, q.size * 0.55);
      ctx.quadraticCurveTo(-tail * 0.4, q.size * 0.5, -tail, 0);
      ctx.fill();
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const frame = (now: number) => {
    if (stopped) return;
    const dt = Math.min(now - lastNow, 48);
    lastNow = now;
    const elapsed = now - start;
    const p = Math.min(elapsed / ms, 1);
    const edge = edgeAt(ease(p));
    // once the wipe has finished, whatever is left dries out quickly
    const outro = p < 1 ? 1 : Math.max(0, 1 - (elapsed - ms) / 420);

    if (p < 1) {
      const travelled = Math.abs(edge - lastEdge);
      const count =
        to === "light"
          ? Math.min(42, 4 + Math.round(travelled * 0.6))
          : Math.min(64, 6 + Math.round(travelled * 0.9));
      for (let i = 0; i < count; i++) {
        if (to === "light") spawnPaint(edge, now);
        else spawnBit(edge, now);
      }
    }
    lastEdge = edge;

    ctx.clearRect(0, 0, W, H);

    let alive = 0;
    for (let i = 0; i < particles.length; i++) {
      const q = particles[i];
      const age = now - q.born;

      q.x += q.vx * dt;
      q.y += q.vy * dt;

      // strongest on the line, gone by `reach` pixels away from it
      const near = Math.max(0, 1 - Math.abs(q.x - edge) / reach);
      const alpha = Math.pow(near, 1.6) * Math.min(1, age / 60) * outro;
      if (alpha <= 0.004) {
        if (age > 90) continue; // left the line's neighbourhood
        particles[alive++] = q;
        continue;
      }
      particles[alive++] = q;

      if (q.kind === "bit") {
        if (Math.random() < 0.07) q.glyph = q.glyph === "0" ? "1" : "0";
        ctx.globalAlpha = alpha * (0.6 + Math.random() * 0.4);
        const d = (q.size / SPRITE_FONT) * SPRITE;
        ctx.drawImage(sprites!.get(q.color + q.glyph)!, q.x - d / 2, q.y - d / 2, d, d);
      } else {
        // flung paint loses speed fast and settles; blots sag under gravity
        const drag = Math.pow(0.9, dt / 16);
        q.vx *= drag;
        q.vy *= drag;
        if (q.kind === "blot") q.vy += 0.0009 * dt;
        drawPaint(q, alpha);
      }
    }
    particles.length = alive;
    ctx.globalAlpha = 1;

    if (p < 1 || (alive > 0 && outro > 0)) {
      raf = requestAnimationFrame(frame);
    } else {
      stop();
    }
  };

  const stop = () => {
    stopped = true;
    clearTimeout(failsafe);
    if (raf) cancelAnimationFrame(raf);
    ctx.clearRect(0, 0, W, H);
    particles = [];
    if (stopCurrent === stop) stopCurrent = null;
  };

  // If frames stop arriving (tab hidden mid-sweep), never leave marks behind.
  const failsafe = window.setTimeout(() => stop(), ms + 900);

  stopCurrent = stop;
  raf = requestAnimationFrame(frame);
}
