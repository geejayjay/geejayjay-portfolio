import { useEffect, useRef } from "react";

/**
 * Light mode: the cursor is a loaded flat brush.
 *
 * Each stroke is laid down by a row of individual bristles set across the
 * direction of travel. The brush is double-loaded (two pigments blend across
 * its width), every bristle carries its own shade and thickness, and the paint
 * runs out along the stroke so the tail breaks up into dry-brush streaks.
 * Lifting the brush (a short pause) reloads it with a new pair of colours.
 * Strokes dry and fade after a few seconds.
 *
 * Just moving the mouse leaves a faint, light-pressure trace. Holding the left
 * button presses the brush down: the stroke turns bold and wide, and the press
 * itself flicks a little paint off the bristles.
 *
 * Paint belongs to the page, not the screen: strokes are stored in page
 * coordinates, so they scroll away with the content they were painted on, and
 * scrolling with the brush resting on the page drags a stroke down it.
 *
 * The canvas sits behind the content and is multiplied onto the paper, so it
 * reads as pigment rather than an overlay.
 */

const PIGMENTS = [
  "#CF6C58", // coral
  "#E0B062", // ochre
  "#5E9AA1", // washed teal
  "#E58F7B", // salmon
  "#2F6F78", // deep teal
  "#8E5572", // plum
  "#8FAE8B", // sage
  "#3D5A80", // ink blue
  "#D98C4A", // burnt orange
];

const BRISTLES = 13;
const LIFE_MS = 6000;
const MAX_STEPS = 900;
const HOVER_PRESSURE = 0.3;
const FULL_LOAD_PX = 1100; // distance over which a loaded brush runs dry

type RGB = [number, number, number];

type Stroke = {
  colors: string[]; // one per bristle
  widths: number[]; // one per bristle
  offsets: number[]; // -1..1 position across the brush
  dryAt: number[]; // paint level below which this bristle starts skipping
  wash: string;
  a: RGB;
  b: RGB;
};

type Step = {
  t: number;
  s: Stroke;
  // centre line of this step and the brush width, for the underlying wash
  ax: number;
  ay: number;
  bx: number;
  by: number;
  w: number;
  /** pressure: faint when hovering, full when the left button is held */
  k: number;
  // per bristle: x1, y1, x2, y2, alpha
  segs: Float32Array;
};

const hexToRgb = (hex: string): RGB => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
];

const mix = (a: RGB, b: RGB, k: number, shade = 0): string => {
  const c = a.map((v, i) => Math.round(Math.max(0, Math.min(255, v + (b[i] - v) * k + shade))));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
};

function loadBrush(previous: number): { stroke: Stroke; index: number } {
  // never repeat the colour just used
  let index = (Math.random() * PIGMENTS.length) | 0;
  if (index === previous) index = (index + 1) % PIGMENTS.length;
  let second = (index + 1 + ((Math.random() * (PIGMENTS.length - 1)) | 0)) % PIGMENTS.length;
  if (second === index) second = (index + 1) % PIGMENTS.length;

  const a = hexToRgb(PIGMENTS[index]);
  const b = hexToRgb(PIGMENTS[second]);
  const colors: string[] = [];
  const widths: number[] = [];
  const offsets: number[] = [];
  const dryAt: number[] = [];

  for (let i = 0; i < BRISTLES; i++) {
    const across = i / (BRISTLES - 1); // 0..1 over the brush
    // second pigment sits on one edge and bleeds a third of the way in
    const blend = Math.max(0, Math.min(1, (across - 0.55) / 0.35)) * 0.85;
    colors.push(mix(a, b, blend, (Math.random() - 0.5) * 46));
    widths.push(2 + Math.random() * 3.6);
    offsets.push(across * 2 - 1 + (Math.random() - 0.5) * 0.12);
    dryAt.push(Math.random());
  }

  return {
    index,
    stroke: { colors, widths, offsets, dryAt, wash: mix(a, b, 0.25), a, b },
  };
}

export default function PaintCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    let steps: Step[] = [];
    let raf = 0;
    let pigment = -1;
    let stroke: Stroke | null = null;
    let last: { x: number; y: number; t: number } | null = null;
    let dirX = 1;
    let dirY = 0;
    let width = 26;
    let load = 1;
    let pressed = false;
    // where the cursor rests on screen, so scrolling can keep the brush moving
    let pointer: { x: number; y: number } | null = null;
    let travel = 0; // distance painted since the brush was last loaded
    // where each bristle was at the end of the previous step
    let prev = new Float32Array(BRISTLES * 2);

    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const frame = (now: number) => {
      const sx = window.scrollX;
      const sy = window.scrollY;
      const viewH = window.innerHeight;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, window.innerWidth, viewH);
      // strokes live in page space — shift them by the current scroll
      ctx.setTransform(dpr, 0, 0, dpr, -sx * dpr, -sy * dpr);
      ctx.lineCap = "butt";
      let alive = 0;
      for (let i = 0; i < steps.length; i++) {
        const st = steps[i];
        const age = (now - st.t) / LIFE_MS;
        if (age >= 1) continue;
        steps[alive++] = st;
        // scrolled out of view: keep it drying, but don't spend time drawing it
        if (Math.max(st.ay, st.by) < sy - 120 || Math.min(st.ay, st.by) > sy + viewH + 120) continue;
        // wet paint holds its colour, then dries out
        const fade = age < 0.45 ? 1 : Math.pow(1 - (age - 0.45) / 0.55, 1.6);

        // thin wash underneath gives the stroke a body
        ctx.globalAlpha = 0.15 * fade * st.k;
        ctx.strokeStyle = st.s.wash;
        ctx.lineWidth = st.w * 1.9;
        ctx.beginPath();
        ctx.moveTo(st.ax, st.ay);
        ctx.lineTo(st.bx, st.by);
        ctx.stroke();

        // individual bristle tracks on top
        const g = st.segs;
        for (let b = 0; b < BRISTLES; b++) {
          const a = g[b * 5 + 4];
          if (a <= 0.02) continue;
          ctx.globalAlpha = a * fade * 0.7 * st.k;
          ctx.strokeStyle = st.s.colors[b];
          ctx.lineWidth = st.s.widths[b];
          ctx.beginPath();
          ctx.moveTo(g[b * 5], g[b * 5 + 1]);
          ctx.lineTo(g[b * 5 + 2], g[b * 5 + 3]);
          ctx.stroke();
        }
      }
      steps.length = alive;
      ctx.globalAlpha = 1;
      raf = alive > 0 ? requestAnimationFrame(frame) : 0;
    };

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const pushStep = (step: Step) => {
      steps.push(step);
      if (steps.length > MAX_STEPS) steps.splice(0, steps.length - MAX_STEPS);
    };

    /** place every bristle across the brush at (x, y) */
    const bristlePositions = (x: number, y: number, out: Float32Array) => {
      // perpendicular to the direction of travel
      const nx = -dirY;
      const ny = dirX;
      for (let b = 0; b < BRISTLES; b++) {
        const off = stroke!.offsets[b] * width;
        const wobble = (Math.random() - 0.5) * 1.1;
        out[b * 2] = x + nx * off + wobble;
        out[b * 2 + 1] = y + ny * off + wobble;
      }
    };

    const dip = () => {
      const next = loadBrush(pigment);
      pigment = next.index;
      stroke = next.stroke;
      load = 1;
      travel = 0;
    };

    const moveTo = (x: number, y: number, now: number) => {
      if (!last || !stroke || now - last.t > 300) {
        // brush was lifted — reload with fresh colours and set it down
        dip();
        last = { x, y, t: now };
        bristlePositions(x, y, prev);
        return;
      }

      const dx = x - last.x;
      const dy = y - last.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 2.5) return;

      if (dist > 280) {
        // jumped (e.g. re-entered the window) — don't draw a line across
        last = { x, y, t: now };
        bristlePositions(x, y, prev);
        return;
      }

      // ease the brush angle toward the direction of travel so it swings, not snaps
      const turn = Math.min(1, dist / 26);
      dirX += (dx / dist - dirX) * turn;
      dirY += (dy / dist - dirY) * turn;
      const dl = Math.hypot(dirX, dirY) || 1;
      dirX /= dl;
      dirY /= dl;

      // slow = pressed down and splayed wide; fast = light and narrow
      const speed = dist / Math.max(now - last.t, 1);
      // a light hover touch only uses the tip of the brush
      const target = Math.max(12, Math.min(25, 25 - speed * 4.5)) * (pressed ? 1 : 0.6);
      width += (target - width) * 0.2;

      load = Math.max(0, load - dist / FULL_LOAD_PX);
      travel += dist;

      const next = new Float32Array(BRISTLES * 2);
      bristlePositions(x, y, next);
      const segs = new Float32Array(BRISTLES * 5);
      for (let b = 0; b < BRISTLES; b++) {
        // each bristle runs dry at its own point, flickering before it gives out
        const supply = (load - stroke.dryAt[b] * 0.82) * 3.2;
        const a = Math.max(0, Math.min(1, supply));
        segs[b * 5] = prev[b * 2];
        segs[b * 5 + 1] = prev[b * 2 + 1];
        segs[b * 5 + 2] = next[b * 2];
        segs[b * 5 + 3] = next[b * 2 + 1];
        // a starved bristle skips in long patches (not per-step flicker), which
        // is what gives a dry brush its broken, streaky tail
        const patch = Math.sin(travel * 0.045 + stroke.dryAt[b] * 40) * 0.5 + 0.5;
        segs[b * 5 + 4] = supply <= -0.3 || (a < 1 && patch > a + 0.3) ? 0 : 0.4 + a * 0.6;
      }
      pushStep({
        t: now,
        s: stroke,
        ax: last.x,
        ay: last.y,
        bx: x,
        by: y,
        w: width * Math.min(1, load * 2.2),
        k: pressed ? 1 : HOVER_PRESSURE,
        segs,
      });

      prev = next;
      last = { x, y, t: now };
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const now = performance.now();
      // use the in-between samples the browser batched up, for smoother curves
      const samples = typeof e.getCoalescedEvents === "function" ? e.getCoalescedEvents() : [];
      if (samples.length > 1) {
        for (const s of samples) moveTo(s.clientX + window.scrollX, s.clientY + window.scrollY, now);
      } else {
        moveTo(e.clientX + window.scrollX, e.clientY + window.scrollY, now);
      }
      pointer = { x: e.clientX, y: e.clientY };
      kick();
    };

    /** press: brush goes down hard — bold strokes, plus a flick of paint */
    /** short bristle marks burst out around a point (page coordinates) */
    const flick = (x: number, y: number) => {
      const now = performance.now();
      const flicks = 7;
      for (let f = 0; f < flicks; f++) {
        const angle = Math.random() * Math.PI * 2;
        const startAt = 6 + Math.random() * 16;
        const reach = startAt + 14 + Math.random() * 46;
        const segs = new Float32Array(BRISTLES * 5);
        for (let b = 0; b < BRISTLES; b++) {
          if (Math.random() < 0.55) continue; // only a few hairs per flick
          const a = angle + (Math.random() - 0.5) * 0.34;
          const far = reach * (0.55 + Math.random() * 0.45);
          segs[b * 5] = x + Math.cos(a) * startAt;
          segs[b * 5 + 1] = y + Math.sin(a) * startAt;
          segs[b * 5 + 2] = x + Math.cos(a) * far;
          segs[b * 5 + 3] = y + Math.sin(a) * far;
          segs[b * 5 + 4] = 0.5 + Math.random() * 0.5;
        }
        pushStep({ t: now, s: stroke!, ax: x, ay: y, bx: x, by: y, w: 0, k: 1, segs });
      }
      kick();
    };

    // a touch that lifts quickly without moving is a tap (not the start of a scroll)
    let touchStart: { x: number; y: number; t: number } | null = null;

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") {
        touchStart = { x: e.clientX, y: e.clientY, t: performance.now() };
        return;
      }
      if (e.button !== 0) return;
      pressed = true;
      // dragging to paint shouldn't select the page text (form fields excepted)
      const target = e.target as Element | null;
      if (!target?.closest?.("input, textarea, select, [contenteditable]")) {
        document.documentElement.classList.add("is-painting");
      }
      if (!stroke) dip();
      flick(e.clientX + window.scrollX, e.clientY + window.scrollY);
      load = 1; // pressing down squeezes fresh paint to the tip
    };

    /** touch screens: each tap flicks paint in a fresh colour */
    const onTouchUp = (e: PointerEvent) => {
      if (e.pointerType !== "touch" || !touchStart) return;
      const moved = Math.hypot(e.clientX - touchStart.x, e.clientY - touchStart.y);
      const quick = performance.now() - touchStart.t < 400;
      touchStart = null;
      if (moved > 12 || !quick) return;
      dip();
      flick(e.clientX + window.scrollX, e.clientY + window.scrollY);
    };

    const onUp = (e?: Event) => {
      if (e instanceof PointerEvent) onTouchUp(e);
      pressed = false;
      document.documentElement.classList.remove("is-painting");
    };

    const onCancel = () => {
      touchStart = null; // the browser took the touch over for scrolling
      onUp();
    };

    const onLeave = () => {
      last = null;
      pointer = null;
    };

    /** the page slid under a resting brush — that paints too, and old paint moves with it */
    const onScroll = () => {
      if (pointer) {
        moveTo(pointer.x + window.scrollX, pointer.y + window.scrollY, performance.now());
      }
      kick();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onCancel, { passive: true });
    window.addEventListener("blur", onUp);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", resize);
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onCancel);
      window.removeEventListener("blur", onUp);
      onUp();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-0 h-full w-full pointer-events-none mix-blend-multiply"
    />
  );
}
