import { useEffect, useRef } from "react";

/**
 * Light mode: the cursor is a watercolour brush.
 *
 * Each stroke is ONE continuous shape — a ribbon with a slightly wandering
 * edge, laid down in three translucent passes so the colour is solid in the
 * middle and bleeds out softly at the rim. It is never broken, but it is not
 * perfect either: now and then the brush runs a little dry and leaves a thin
 * unpainted streak down the middle, the brush picks up a new colour every
 * so often (paint already laid down keeps the colour it had), and droplets of varying size, strength and colour land beside it.
 * The ends break into dry-brush hairs and the whole thing is bitten by paper
 * grain. Messy like real paint, but one clean shape per stroke.
 *
 * Moving the mouse leaves a thin, faint line: a hairline where it passes over
 * text, so the page stays readable. Holding the left button presses the brush
 * down: the same stroke swells into a broad, saturated wash and thins out again
 * on release. Nothing breaks the line except a real pause (which picks up a new
 * colour) or the cursor leaving the page.
 *
 * Paint belongs to the page, not the screen: strokes are stored in page
 * coordinates, so they scroll away with the content they were painted on, and
 * scrolling with the brush resting on the page drags a stroke down it.
 *
 * The canvas sits behind the content and is multiplied onto the paper, so it
 * reads as pigment rather than an overlay.
 */

const PIGMENTS = [
  "#3FA9C9", // cerulean
  "#E07A5F", // coral
  "#E3B04B", // ochre
  "#7FB38A", // sage
  "#9A6AA0", // plum
  "#4A7BB5", // ultramarine
  "#2F8F8A", // viridian
];

const LIFE_MS = 6500;
const MAX_POINTS = 2600;
/** a pause this long counts as lifting the brush (new colour, new stroke) */
const LIFT_MS = 900;
/** how strong the faint hover line is, relative to a pressed wash */
const HOVER_STRENGTH = 0.36;

/** Three passes, widest and faintest first: gives the soft bleed at the rim. */
const LAYERS = [
  { scale: 1.36, alpha: 0.14 },
  { scale: 1.16, alpha: 0.2 },
  { scale: 1, alpha: 0.36 },
];

/** Pressing or tapping these should just work as controls, not paint. */
const INTERACTIVE =
  'a, button, input, textarea, select, label, summary, [role="button"], [role="tab"], [role="switch"], [role="link"], [contenteditable]';

/** things the cursor can be over that count as text */
const TEXTUAL = "p, h1, h2, h3, h4, h5, h6, span, li, a, button, label, input, textarea, article";

const isInteractive = (target: EventTarget | null) =>
  target instanceof Element && target.closest(INTERACTIVE) !== null;

type Pt = {
  x: number;
  y: number;
  // unit normal (across the stroke)
  nx: number;
  ny: number;
  w: number; // half-width
  press: number; // 0 = hovering, 1 = brush pressed down
  d: number; // distance along the stroke
  t: number;
  // edge wander per layer, left and right side
  l: [number, number, number];
  r: [number, number, number];
};

/** a darker pool, a lighter bloom, or a patch of another pigment inside the wash */
type Blot = { x: number; y: number; r: number; kind: "pool" | "bloom" | "tint"; c: number; t: number };

/** a stray droplet that landed beside the stroke */
type Dot = {
  x: number;
  y: number;
  r: number;
  o: number;
  c: number;
  t: number;
  // its own lumpy outline, squashed and turned, so no two look alike
  shape: number[];
  squash: number;
  turn: number;
};

/** where the brush ran dry: a thin unpainted streak running along the stroke */
type Gap = { d0: number; d1: number; off: number; th: number; o: number };

type Stroke = {
  pts: Pt[];
  c: number;
  // colour changes along the stroke: from distance `d` onward the paint is
  // pigment `c`. Paint already laid down keeps the colour it had.
  hues: { d: number; c: number }[];
  blots: Blot[];
  dots: Dot[];
  gaps: Gap[];
  ended: boolean;
  trimmed: boolean; // its start has already dried away
  pressedEver: boolean;
  rolls: number[]; // randomness for the dry-brush ends
  phase: number;
  travel: number;
  nextBlot: number;
  nextDot: number;
  nextGap: number;
  nextHue: number;
};

type Splash = {
  t: number;
  c: number;
  blobs: { x: number; y: number; r: number; shape: number[] }[];
};

const rand = (a: number, b: number) => a + Math.random() * (b - a);

function shade(hex: string, amount: number) {
  const ch = (i: number) => {
    const v = parseInt(hex.slice(i, i + 2), 16);
    return Math.round(Math.max(0, Math.min(255, v * (1 + amount))));
  };
  return `${ch(1)},${ch(3)},${ch(5)}`;
}

/** soft round dab used for pools (dark pigment) and blooms (bare paper) */
function softSprite(rgb: string, strength: number) {
  const size = 64;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, `rgba(${rgb},${strength})`);
  grad.addColorStop(0.6, `rgba(${rgb},${strength * 0.45})`);
  grad.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
}

/** Paper tooth: fine specks plus a soft mottle, used to bite into wet paint. */
function grainTexture() {
  const size = 256;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const img = g.createImageData(size, size);

  // coarse value noise for the mottle (tiles seamlessly)
  const cells = 8;
  const grid = Array.from({ length: cells * cells }, Math.random);
  const at = (gx: number, gy: number) => grid[(gy % cells) * cells + (gx % cells)];
  const smooth = (v: number) => v * v * (3 - 2 * v);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const fx = (x / size) * cells;
      const fy = (y / size) * cells;
      const ix = Math.floor(fx);
      const iy = Math.floor(fy);
      const tx = smooth(fx - ix);
      const ty = smooth(fy - iy);
      const top = at(ix, iy) * (1 - tx) + at(ix + 1, iy) * tx;
      const bottom = at(ix, iy + 1) * (1 - tx) + at(ix + 1, iy + 1) * tx;
      const mottle = top * (1 - ty) + bottom * ty;

      const speck = Math.random() < 0.05 ? rand(60, 150) : Math.random() * 16;
      const i = (y * size + x) * 4;
      img.data[i + 3] = Math.min(255, speck + Math.max(0, mottle - 0.55) * 120);
    }
  }
  g.putImageData(img, 0, 0);
  return c;
}

export default function PaintCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const pools = PIGMENTS.map((p) => softSprite(shade(p, -0.32), 0.5));
    const tints = PIGMENTS.map((p) => softSprite(shade(p, 0), 0.75));
    const rgb = PIGMENTS.map((p) => shade(p, 0));
    const bloom = softSprite("255,255,255", 0.42);
    const grain = ctx.createPattern(grainTexture(), "repeat")!;

    let strokes: Stroke[] = [];
    let splashes: Splash[] = [];
    let active: Stroke | null = null;
    let raf = 0;
    let pigment = -1;
    let last: { x: number; y: number; t: number } | null = null;
    let angle = 0; // direction the brush is travelling, eased
    let width = 4;
    let press = 0; // eased 0..1
    let pressed = false;
    let overText = false;
    // where the cursor rests on screen, so scrolling can keep the brush moving
    let pointer: { x: number; y: number } | null = null;

    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
    };
    resize();

    /** how much of its width a point still has: full, then drying away */
    const dry = (age: number) => (age < 0.62 ? 1 : Math.max(0, 1 - (age - 0.62) / 0.38));

    /**
     * One pass of the wash: a closed ribbon with smoothed, wandering edges.
     * With `byPress` the ribbon is only as wide as the brush was pressed, which
     * is how the bold part of a stroke swells out of the faint part seamlessly.
     */
    const ribbon = (
      pts: Pt[],
      fades: number[],
      li: number,
      scale: number,
      byPress: boolean,
      from = 0,
      to = pts.length - 1,
    ) => {
      let px = 0;
      let py = 0;
      ctx.beginPath();
      for (let i = from; i <= to; i++) {
        const p = pts[i];
        const hw = p.w * fades[i] * scale * p.l[li] * (byPress ? p.press : 1);
        const x = p.x + p.nx * hw;
        const y = p.y + p.ny * hw;
        if (i === from) ctx.moveTo(x, y);
        else ctx.quadraticCurveTo(px, py, (px + x) / 2, (py + y) / 2);
        px = x;
        py = y;
      }
      ctx.lineTo(px, py);
      for (let i = to; i >= from; i--) {
        const p = pts[i];
        const hw = p.w * fades[i] * scale * p.r[li] * (byPress ? p.press : 1);
        const x = p.x - p.nx * hw;
        const y = p.y - p.ny * hw;
        if (i === to) ctx.lineTo(x, y);
        else ctx.quadraticCurveTo(px, py, (px + x) / 2, (py + y) / 2);
        px = x;
        py = y;
      }
      ctx.lineTo(px, py);
      ctx.closePath();
      ctx.fill();
    };

    /** dry-brush end: a few tapered hairs dragged out past the edge of the wash */
    const streaks = (p: Pt, forward: number, rolls: number[], offset: number) => {
      // direction of travel is perpendicular to the normal
      const dx = p.ny * forward;
      const dy = -p.nx * forward;
      const hairs = 5;
      for (let j = 0; j < hairs; j++) {
        const r1 = rolls[offset + j * 2];
        const r2 = rolls[offset + j * 2 + 1];
        const across = ((j + 0.5) / hairs) * 2 - 1 + (r1 - 0.5) * 0.18;
        const thick = p.w * (0.07 + r2 * 0.1);
        const len = p.w * (0.35 + r1 * 1.05);
        const bx = p.x + p.nx * p.w * across * 0.92;
        const by = p.y + p.ny * p.w * across * 0.92;
        ctx.beginPath();
        ctx.moveTo(bx + p.nx * thick - dx, by + p.ny * thick - dy);
        ctx.lineTo(bx + dx * len, by + dy * len);
        ctx.lineTo(bx - p.nx * thick - dx, by - p.ny * thick - dy);
        ctx.closePath();
        ctx.fill();
      }
    };

    /** a lumpy round drop, smoothed through its points */
    const blob = (x: number, y: number, r: number, shape: number[], scale: number) => {
      const n = shape.length;
      const pt = (i: number) => {
        const a = (i / n) * Math.PI * 2;
        const rr = r * scale * (0.7 + shape[i % n] * 0.6);
        return [x + Math.cos(a) * rr, y + Math.sin(a) * rr];
      };
      ctx.beginPath();
      const [ax, ay] = pt(0);
      const [bx, by] = pt(1);
      ctx.moveTo((ax + bx) / 2, (ay + by) / 2);
      for (let i = 1; i <= n; i++) {
        const [cx, cy] = pt(i);
        const [nx, ny] = pt(i + 1);
        ctx.quadraticCurveTo(cx, cy, (cx + nx) / 2, (cy + ny) / 2);
      }
      ctx.closePath();
      ctx.fill();
    };

    /** a stray droplet: an uneven, slightly squashed blot, never a clean circle */
    const smudge = (dot: Dot) => {
      const n = dot.shape.length;
      const cos = Math.cos(dot.turn);
      const sin = Math.sin(dot.turn);
      const pt = (i: number) => {
        const a = (i / n) * Math.PI * 2;
        const rr = dot.r * (0.55 + dot.shape[i % n] * 0.9);
        // squash along one axis, then turn the whole thing
        const lx = Math.cos(a) * rr;
        const ly = Math.sin(a) * rr * dot.squash;
        return [dot.x + lx * cos - ly * sin, dot.y + lx * sin + ly * cos];
      };
      ctx.beginPath();
      const [ax, ay] = pt(0);
      const [bx, by] = pt(1);
      ctx.moveTo((ax + bx) / 2, (ay + by) / 2);
      for (let i = 1; i <= n; i++) {
        const [cx, cy] = pt(i);
        const [qx, qy] = pt(i + 1);
        ctx.quadraticCurveTo(cx, cy, (cx + qx) / 2, (cy + qy) / 2);
      }
      ctx.closePath();
      ctx.fill();
    };

    const endStroke = () => {
      if (active) active.ended = true;
      active = null;
    };

    const frame = (now: number) => {
      const sx = window.scrollX;
      const sy = window.scrollY;
      const viewW = window.innerWidth;
      const viewH = window.innerHeight;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, viewW, viewH);
      // paint lives in page space — shift it by the current scroll
      ctx.setTransform(dpr, 0, 0, dpr, -sx * dpr, -sy * dpr);

      // resting long enough counts as lifting the brush: finish the stroke off
      if (active && last && now - last.t > LIFT_MS) endStroke();

      let keep = 0;
      for (let s = 0; s < strokes.length; s++) {
        const st = strokes[s];
        const pts = st.pts;

        // the oldest end of the stroke dries away first
        let drop = 0;
        while (drop < pts.length && now - pts[drop].t > LIFE_MS) drop++;
        if (drop) {
          pts.splice(0, drop);
          st.trimmed = true;
        }
        if (pts.length < 2) {
          if (st === active) strokes[keep++] = st;
          continue;
        }
        strokes[keep++] = st;

        // scrolled out of view: keep it drying, but don't spend time drawing it
        let minY = Infinity;
        let maxY = -Infinity;
        for (let i = 0; i < pts.length; i += 4) {
          if (pts[i].y < minY) minY = pts[i].y;
          if (pts[i].y > maxY) maxY = pts[i].y;
        }
        if (maxY < sy - 160 || minY > sy + viewH + 160) continue;

        const fades = pts.map((p) => dry((now - p.t) / LIFE_MS));
        const head = pts[pts.length - 1];
        const newest = (now - head.t) / LIFE_MS;
        const alpha = newest < 0.7 ? 1 : Math.max(0, 1 - (newest - 0.7) / 0.3);
        if (alpha <= 0.003) continue;

        ctx.globalCompositeOperation = "source-over";
        // the whole shape goes down in its first colour, so it has no seams...
        ctx.fillStyle = PIGMENTS[st.hues[0].c];

        // the faint line, full length
        for (let li = 0; li < LAYERS.length; li++) {
          ctx.globalAlpha = LAYERS[li].alpha * HOVER_STRENGTH * alpha;
          ribbon(pts, fades, li, LAYERS[li].scale, false);
        }
        // the bold wash, swelling out of it wherever the brush was pressed
        if (st.pressedEver) {
          for (let li = 0; li < LAYERS.length; li++) {
            ctx.globalAlpha = LAYERS[li].alpha * (1 - HOVER_STRENGTH) * alpha;
            ribbon(pts, fades, li, LAYERS[li].scale, true);
          }
        }

        // ...then each later colour is washed over its own stretch of that shape.
        // "source-atop" only recolours paint that is already there, so the edge,
        // the bleed and the transparency all stay exactly as they were, and the
        // older stretches are never touched again.
        let headColour = st.hues[0].c;
        let tailColour = st.hues[0].c;
        if (st.hues.length > 1) {
          ctx.globalCompositeOperation = "source-atop";
          ctx.globalAlpha = 1;
          const lastIdx = pts.length - 1;
          for (let h = 1; h < st.hues.length; h++) {
            const hue = st.hues[h];
            const until = h + 1 < st.hues.length ? st.hues[h + 1].d : Infinity;
            if (until <= pts[0].d) continue; // that stretch has dried away
            if (hue.d <= pts[0].d) tailColour = hue.c;
            headColour = hue.c;

            let i0 = 0;
            while (i0 < lastIdx && pts[i0].d < hue.d) i0++;
            let i1 = i0;
            while (i1 < lastIdx && pts[i1].d <= until) i1++;
            if (i1 <= i0) continue;

            // the new colour bleeds in over a few points rather than cutting in
            const blendTo = Math.min(i0 + 7, i1);
            if (i0 > 0 && blendTo > i0) {
              const a = pts[i0];
              const b = pts[blendTo];
              const bleed = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
              bleed.addColorStop(0, `rgba(${rgb[hue.c]},0)`);
              bleed.addColorStop(1, `rgba(${rgb[hue.c]},1)`);
              ctx.fillStyle = bleed;
              ribbon(pts, fades, 0, 1.5, false, i0, blendTo);
              ctx.fillStyle = PIGMENTS[hue.c];
              if (i1 > blendTo) ribbon(pts, fades, 0, 1.5, false, blendTo, i1);
            } else {
              ctx.fillStyle = PIGMENTS[hue.c];
              ribbon(pts, fades, 0, 1.5, false, i0, i1);
            }
          }
          ctx.globalCompositeOperation = "source-over";
        }

        // dry-brush ends: where the brush touched down, and where it lifted
        const endStrength = (p: Pt) => 0.5 * alpha * (HOVER_STRENGTH + (1 - HOVER_STRENGTH) * p.press);
        if (!st.trimmed && fades[0] === 1) {
          ctx.globalAlpha = endStrength(pts[0]);
          ctx.fillStyle = PIGMENTS[tailColour];
          streaks(pts[0], -1, st.rolls, 0);
        }
        if (st.ended && fades[pts.length - 1] === 1) {
          ctx.globalAlpha = endStrength(head);
          ctx.fillStyle = PIGMENTS[headColour];
          streaks(head, 1, st.rolls, 12);
        }

        // stray droplets beside the stroke
        for (let d = 0; d < st.dots.length; d++) {
          const dot = st.dots[d];
          const age = (now - dot.t) / LIFE_MS;
          if (age >= 1) continue;
          ctx.globalAlpha = dot.o * alpha * (age < 0.6 ? 1 : 1 - (age - 0.6) / 0.4);
          ctx.fillStyle = PIGMENTS[dot.c];
          smudge(dot);
        }

        // pools and blooms only tint paint that is already there
        if (st.blots.length) {
          ctx.globalCompositeOperation = "source-atop";
          for (let b = 0; b < st.blots.length; b++) {
            const bl = st.blots[b];
            const age = (now - bl.t) / LIFE_MS;
            if (age > 0.6) continue;
            const sprite = bl.kind === "pool" ? pools[bl.c] : bl.kind === "tint" ? tints[bl.c] : bloom;
            ctx.globalAlpha = alpha * (bl.kind === "pool" ? 0.5 : bl.kind === "tint" ? 0.6 : 0.65);
            ctx.drawImage(sprite, bl.x - bl.r, bl.y - bl.r, bl.r * 2, bl.r * 2);
          }
        }

        // dry streaks: lift the paint back off in a thin line along the stroke
        if (st.gaps.length) {
          ctx.globalCompositeOperation = "destination-out";
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          for (let g = 0; g < st.gaps.length; g++) {
            const gap = st.gaps[g];
            let started = false;
            let px = 0;
            let py = 0;
            ctx.beginPath();
            for (let i = 0; i < pts.length; i++) {
              const q = pts[i];
              if (q.d < gap.d0 || q.d > gap.d1) continue;
              const reach = q.w * fades[i] * gap.off;
              const x = q.x + q.nx * reach;
              const y = q.y + q.ny * reach;
              if (!started) {
                ctx.moveTo(x, y);
                started = true;
              } else {
                ctx.quadraticCurveTo(px, py, (px + x) / 2, (py + y) / 2);
              }
              px = x;
              py = y;
            }
            if (!started) continue;
            ctx.lineTo(px, py);
            ctx.globalAlpha = gap.o;
            ctx.lineWidth = gap.th;
            ctx.stroke();
          }
        }
      }
      strokes.length = keep;

      keep = 0;
      ctx.globalCompositeOperation = "source-over";
      for (let s = 0; s < splashes.length; s++) {
        const sp = splashes[s];
        const age = (now - sp.t) / LIFE_MS;
        if (age >= 1) continue;
        splashes[keep++] = sp;
        const alpha = age < 0.6 ? 1 : 1 - (age - 0.6) / 0.4;
        ctx.fillStyle = PIGMENTS[sp.c];
        for (let li = 0; li < LAYERS.length; li++) {
          ctx.globalAlpha = LAYERS[li].alpha * alpha;
          for (const b of sp.blobs) blob(b.x, b.y, b.r, b.shape, LAYERS[li].scale);
        }
      }
      splashes.length = keep;

      // paper grain bites into everything, anchored to the page so it doesn't swim
      ctx.globalCompositeOperation = "destination-out";
      ctx.globalAlpha = 1;
      ctx.fillStyle = grain;
      ctx.fillRect(sx, sy, viewW, viewH);
      ctx.globalCompositeOperation = "source-over";

      raf = strokes.length > 0 || splashes.length > 0 ? requestAnimationFrame(frame) : 0;
    };

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    /** pick up a new colour, never the one just used */
    const dip = () => {
      let next = (Math.random() * PIGMENTS.length) | 0;
      if (next === pigment) next = (next + 1) % PIGMENTS.length;
      pigment = next;
    };

    const beginStroke = () => {
      endStroke();
      active = {
        pts: [],
        c: pigment,
        hues: [{ d: 0, c: pigment }],
        blots: [],
        dots: [],
        gaps: [],
        ended: false,
        trimmed: false,
        pressedEver: false,
        rolls: Array.from({ length: 24 }, Math.random),
        phase: Math.random() * 100,
        travel: 0,
        nextBlot: rand(20, 60),
        nextDot: rand(30, 120),
        nextGap: rand(60, 260),
        nextHue: rand(480, 1400),
      };
      strokes.push(active);
    };

    const addPoint = (x: number, y: number, now: number) => {
      const st = active!;
      const nx = -Math.sin(angle);
      const ny = Math.cos(angle);
      // each rim wanders on its own, a little differently on every pass
      const wander = (side: number, li: number) =>
        1 +
        0.11 * Math.sin(st.travel * 0.034 + st.phase + side * 2.1 + li * 1.3) +
        0.05 * Math.sin(st.travel * 0.11 + st.phase * 1.7 + side + li) +
        (Math.random() - 0.5) * 0.04;
      st.pts.push({
        x,
        y,
        nx,
        ny,
        w: width,
        press,
        d: st.travel,
        t: now,
        l: [wander(0, 0), wander(0, 1), wander(0, 2)],
        r: [wander(1, 0), wander(1, 1), wander(1, 2)],
      });
      if (press > 0.02) st.pressedEver = true;

      // every so often the brush picks up a different colour and carries on
      if (st.travel >= st.nextHue) {
        dip();
        st.hues.push({ d: st.travel, c: pigment });
        st.nextHue = st.travel + rand(520, 1520);
      }

      // darker pools, lighter blooms and the odd patch of another pigment
      if (st.travel >= st.nextBlot) {
        const off = rand(-0.55, 0.55) * width;
        const roll = Math.random();
        const kind = roll < 0.4 ? "pool" : roll < 0.7 ? "bloom" : "tint";
        // a faint hover line only ever gets colour patches, not pools and blooms
        if (press > 0.6 || kind === "tint") {
          st.blots.push({
            x: x + nx * off,
            y: y + ny * off,
            r: width * rand(0.9, 2.2),
            kind,
            // a pool deepens the current colour; a tint brings in a different one
            c:
              kind === "tint"
                ? (pigment + 1 + ((Math.random() * (PIGMENTS.length - 1)) | 0)) % PIGMENTS.length
                : pigment,
            t: now,
          });
        }
        st.nextBlot = st.travel + (press > 0.6 ? rand(40, 95) : rand(120, 420));
      }

      // now and then the brush runs dry and leaves a thin unpainted streak
      if (st.travel >= st.nextGap) {
        const streaks = Math.random() < 0.3 ? 2 : 1;
        let longest = 0;
        for (let i = 0; i < streaks; i++) {
          const len = rand(40, 240);
          longest = Math.max(longest, len);
          st.gaps.push({
            d0: st.travel + rand(0, 30),
            d1: st.travel + len,
            off: rand(-0.62, 0.62),
            th: Math.max(0.7, width * rand(0.05, 0.2)),
            o: rand(0.45, 0.95),
          });
        }
        // irregular: sometimes back to back, sometimes a long clean run
        st.nextGap = st.travel + longest + rand(30, 520);
      }

      // stray droplets beside the stroke: irregular, small, easy to miss
      if (st.travel >= st.nextDot) {
        const count = Math.random() < 0.3 ? 2 : 1;
        for (let i = 0; i < count; i++) {
          const side = Math.random() < 0.5 ? -1 : 1;
          const out = width + rand(3, 16) + press * rand(0, 14);
          const along = rand(-10, 10);
          // mostly small and faint, with the occasional bigger or bolder one
          const big = Math.random() < 0.18;
          st.dots.push({
            x: x + nx * out * side - ny * along,
            y: y + ny * out * side + nx * along,
            // sized from the line itself, so a droplet is never fatter than the stroke
            r: Math.max(0.9, width * (big ? rand(0.42, 0.58) : rand(0.2, 0.38))) + press * rand(0, 1.2),
            o: rand(0.2, 0.5) + press * rand(0, 0.25),
            // usually the stroke's own pigment, sometimes a stray other colour
            c: Math.random() < 0.35 ? (Math.random() * PIGMENTS.length) | 0 : pigment,
            t: now,
            shape: Array.from({ length: 5 + ((Math.random() * 3) | 0) }, Math.random),
            squash: rand(0.5, 0.95),
            turn: rand(0, Math.PI),
          });
        }
        st.nextDot = st.travel + (press > 0.5 ? rand(22, 80) : rand(32, 130));
      }

      // keep the total bounded: the oldest strokes go first
      let total = 0;
      for (const s of strokes) total += s.pts.length;
      while (total > MAX_POINTS && strokes.length > 1) {
        total -= strokes[0].pts.length;
        strokes.shift();
      }
    };

    const moveTo = (x: number, y: number, now: number) => {
      if (!last || !active || now - last.t > LIFT_MS) {
        // brush was lifted — new colour, new stroke
        dip();
        last = { x, y, t: now };
        press = pressed ? 1 : 0;
        width = pressed ? 9 : 3;
        beginStroke();
        return;
      }

      const dx = x - last.x;
      const dy = y - last.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 4) return;

      if (dist > 280) {
        // jumped (e.g. re-entered the window) — don't draw a line across
        last = { x, y, t: now };
        beginStroke();
        return;
      }

      // Turn the brush toward the direction of travel by rotating its angle the
      // short way round. (Blending direction vectors instead collapses to zero
      // on a sharp reversal and throws the edge out sideways.)
      const heading = Math.atan2(dy, dx);
      if (active.pts.length === 0) {
        angle = heading;
      } else {
        const turn = Math.atan2(Math.sin(heading - angle), Math.cos(heading - angle));
        angle += turn * Math.min(1, dist / 22);
      }

      // pressure eases in and out, so the stroke swells and thins without a break
      press += ((pressed ? 1 : 0) - press) * 0.2;
      if (press < 0.005) press = 0;

      // slow = pressed down and broad; fast = light and narrow
      const speed = dist / Math.max(now - last.t, 1);
      const target = pressed
        ? Math.max(9, Math.min(15, 15 - speed * 2.6))
        : overText
          ? Math.max(1.4, Math.min(2.2, 2.2 - speed * 0.5)) // hairline behind text
          : Math.max(3.5, Math.min(6, 6 - speed * 1.4));
      width += (target - width) * 0.16;

      if (active.pts.length === 0) addPoint(last.x, last.y, now);
      active.travel += dist;
      addPoint(x, y, now);
      last = { x, y, t: now };
    };

    /** a drop of paint landing: one round splash and a few flecks thrown off it */
    const splash = (x: number, y: number) => {
      if (pigment < 0) dip();
      const shape = () => Array.from({ length: 10 }, Math.random);
      const blobs = [{ x, y, r: rand(7, 11), shape: shape() }];
      const flecks = 3 + ((Math.random() * 3) | 0);
      for (let i = 0; i < flecks; i++) {
        const a = Math.random() * Math.PI * 2;
        const d = rand(18, 46);
        blobs.push({ x: x + Math.cos(a) * d, y: y + Math.sin(a) * d, r: rand(1.2, 4), shape: shape() });
      }
      splashes.push({ t: performance.now(), c: pigment, blobs });
      if (splashes.length > 24) splashes.shift();
      kick();
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const now = performance.now();
      overText = e.target instanceof Element && e.target.closest(TEXTUAL) !== null;
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

    // a touch that lifts quickly without moving is a tap (not the start of a scroll)
    let touchStart: { x: number; y: number; t: number } | null = null;

    const onDown = (e: PointerEvent) => {
      if (isInteractive(e.target)) return;
      if (e.pointerType === "touch") {
        touchStart = { x: e.clientX, y: e.clientY, t: performance.now() };
        return;
      }
      if (e.button !== 0) return;
      pressed = true;
      // dragging to paint shouldn't select the page text
      document.documentElement.classList.add("is-painting");
      splash(e.clientX + window.scrollX, e.clientY + window.scrollY);
    };

    /** touch screens: each tap drops a splash in a fresh colour */
    const onTouchUp = (e: PointerEvent) => {
      if (e.pointerType !== "touch" || !touchStart) return;
      const moved = Math.hypot(e.clientX - touchStart.x, e.clientY - touchStart.y);
      const quick = performance.now() - touchStart.t < 400;
      touchStart = null;
      if (moved > 12 || !quick) return;
      dip();
      splash(e.clientX + window.scrollX, e.clientY + window.scrollY);
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
      endStroke();
    };

    /** the page slid under a resting brush — that paints too, and old paint moves with it */
    const onScroll = () => {
      if (pointer) {
        moveTo(pointer.x + window.scrollX, pointer.y + window.scrollY, performance.now());
      }
      kick();
    };

    const onResize = () => {
      resize();
      kick();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onCancel, { passive: true });
    window.addEventListener("blur", onUp);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onCancel);
      window.removeEventListener("blur", onUp);
      onUp();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
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
