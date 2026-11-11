import { useEffect, useRef, ReactNode } from "react";

/**
 * Dark mode (the builder): faint source code drifts behind the page.
 * The columns sit at different depths and shift against the mouse (parallax),
 * and the code lights up around the cursor like a torch over a dark screen.
 *
 * Moving the mouse leaves a very faint trail of 1s and 0s that sink and fade,
 * and a click lets a small cluster of them drip down: the dark-mode twins of
 * the thin paint line and the splash in light mode. Touch screens have no
 * hovering cursor, so a tap also lights the code up under the finger.
 */

const SNIPPETS: string[] = [
  `// routes/inference.ts
export async function routes(app: FastifyInstance) {
  app.get("/api/inference/:id", async (req, reply) => {
    const key = \`inference:\${req.params.id}\`;
    const cached = await redis.get(key);
    if (cached) return reply.send(JSON.parse(cached));

    const result = await db.inference.findById(req.params.id);
    await redis.set(key, JSON.stringify(result), "EX", 300);
    return reply.send(result);
  });

  app.get("/api/events", (req, reply) => {
    reply.raw.setHeader("Content-Type", "text/event-stream");
    const send = (data: unknown) =>
      reply.raw.write(\`data: \${JSON.stringify(data)}\\n\\n\`);
    queue.on("progress", send);
    req.raw.on("close", () => queue.off("progress", send));
  });
}`,
  `// Controllers/AssetsController.cs
[ApiController]
[Route("api/[controller]")]
public class AssetsController : ControllerBase
{
    private readonly IAssetService _assets;

    public AssetsController(IAssetService assets) => _assets = assets;

    [HttpGet("{id:int}")]
    public async Task<ActionResult<AssetDto>> Get(int id)
    {
        var asset = await _assets.FindAsync(id);
        if (asset is null) return NotFound();
        return Ok(asset.ToDto());
    }

    [HttpPost("report")]
    public async Task<IActionResult> Report(ReportQuery query)
    {
        var report = await _assets.BuildReportAsync(query);
        return File(report.Bytes, "application/pdf");
    }
}`,
  `-- reports/asset_summary.sql
SELECT a.category,
       COUNT(*)            AS total,
       SUM(a.book_value)   AS value
FROM assets a
JOIN locations l ON l.id = a.location_id
WHERE a.retired_at IS NULL
GROUP BY a.category
ORDER BY value DESC;

CREATE INDEX idx_inference_owner
  ON inference (owner_id, created_at DESC);

# views.py
def index(request):
    posts = Post.objects.order_by("-created")
    page = Paginator(posts, 10).get_page(
        request.GET.get("page")
    )
    return render(request, "index.html", {"page": page})`,
  `// firmware/node.ino
#include <WiFi.h>
#include <PubSubClient.h>

const int SENSOR_PIN = 34;
unsigned long lastSent = 0;

void setup() {
  Serial.begin(115200);
  pinMode(SENSOR_PIN, INPUT);
  connectWifi();
  mqtt.setServer(BROKER, 1883);
}

void loop() {
  if (!mqtt.connected()) reconnect();
  mqtt.loop();

  if (millis() - lastSent > 5000) {
    int raw = analogRead(SENSOR_PIN);
    float volts = raw * (3.3 / 4095.0);
    mqtt.publish("veers/node/1", String(volts).c_str());
    lastSent = millis();
  }
}`,
];

const TOKEN =
  /(\/\/.*$|--.*$|#.*$|"[^"]*"|`[^`]*`|\b(?:const|await|async|return|if|else|export|function|public|private|readonly|class|var|new|is|null|void|int|float|unsigned|long|def|SELECT|FROM|JOIN|ON|WHERE|GROUP BY|ORDER BY|CREATE INDEX|AS|DESC|COUNT|SUM)\b)/g;

function highlight(line: string): ReactNode[] {
  return line.split(TOKEN).map((part, i) => {
    if (i % 2 === 0) return part;
    const isComment = /^(\/\/|--|#)/.test(part);
    const isString = /^["`]/.test(part);
    const color = isComment ? "text-slate-500" : isString ? "text-brand2" : "text-brand";
    return (
      <span key={i} className={color}>
        {part}
      </span>
    );
  });
}

// Each column: which snippets, parallax depth (px of travel) and drift speed.
const COLUMNS = [
  { order: [0, 2, 1], depth: 14, speed: 90 },
  { order: [1, 3, 0], depth: 34, speed: 120 },
  { order: [3, 0, 2], depth: 22, speed: 105 },
  { order: [2, 1, 3], depth: 48, speed: 140 },
];

export default function CodeBackdrop() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current!;
    // normalised pointer (-1..1), pixel pointer and torch radius, eased toward targets.
    // No mouse (touch): the torch starts switched off until a tap.
    const hasMouse = window.matchMedia("(hover: hover)").matches;
    const TORCH = 380;
    const cur = {
      px: 0,
      py: 0,
      mx: window.innerWidth * 0.5,
      my: window.innerHeight * 0.38,
      r: hasMouse ? TORCH : 0,
    };
    const target = { ...cur };
    let raf = 0;
    let dimTimer = 0;

    const write = () => {
      root.style.setProperty("--px", cur.px.toFixed(4));
      root.style.setProperty("--py", cur.py.toFixed(4));
      root.style.setProperty("--mx", `${cur.mx.toFixed(1)}px`);
      root.style.setProperty("--my", `${cur.my.toFixed(1)}px`);
      root.style.setProperty("--r", `${Math.max(cur.r, 1).toFixed(1)}px`);
    };

    const tick = () => {
      const ease = 0.085;
      cur.px += (target.px - cur.px) * ease;
      cur.py += (target.py - cur.py) * ease;
      cur.mx += (target.mx - cur.mx) * 0.18;
      cur.my += (target.my - cur.my) * 0.18;
      cur.r += (target.r - cur.r) * 0.1;
      write();
      const settled =
        Math.abs(target.px - cur.px) < 0.001 &&
        Math.abs(target.py - cur.py) < 0.001 &&
        Math.abs(target.mx - cur.mx) < 0.5 &&
        Math.abs(target.my - cur.my) < 0.5 &&
        Math.abs(target.r - cur.r) < 0.5;
      raf = settled ? 0 : requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      target.px = (e.clientX / window.innerWidth) * 2 - 1;
      target.py = (e.clientY / window.innerHeight) * 2 - 1;
      target.mx = e.clientX;
      target.my = e.clientY;
      if (e.pointerType !== "touch") trail(e.clientX, e.clientY);
      if (!raf) raf = requestAnimationFrame(tick);
    };

    /** one 1 or 0 that sinks a little way down the screen and fades out */
    const bit = (x: number, y: number, fall: number, opacity: number, ms: number, delay: number, size: number) => {
      const el = document.createElement("span");
      el.className = "bit";
      el.setAttribute("aria-hidden", "true");
      el.textContent = Math.random() < 0.5 ? "0" : "1";
      el.style.left = `${x.toFixed(1)}px`;
      el.style.top = `${y.toFixed(1)}px`;
      el.style.fontSize = `${size}px`;
      el.style.setProperty("--fall", `${fall.toFixed(0)}px`);
      el.style.setProperty("--o", opacity.toFixed(2));
      el.style.animationDuration = `${ms}ms`;
      el.style.animationDelay = `${delay}ms`;
      if (Math.random() < 0.3) el.style.color = "rgb(var(--c-accent2))";
      document.body.appendChild(el);
      window.setTimeout(() => el.remove(), ms + delay + 60);
    };

    /** click or tap: a small cluster of bits that drips down and fades */
    const drip = (x: number, y: number) => {
      const count = 7;
      for (let i = 0; i < count; i++) {
        bit(
          x + (Math.random() - 0.5) * 46,
          y + (Math.random() - 0.5) * 16,
          50 + Math.random() * 80,
          0.4 + Math.random() * 0.3,
          1200 + Math.random() * 700,
          Math.random() * 220,
          11 + Math.random() * 4,
        );
      }
    };

    // a faint trail of bits where the mouse goes: the dark-mode twin of the
    // thin paint line in light mode. One every so many pixels of travel.
    let trailLast: { x: number; y: number } | null = null;
    let trailGap = 30;
    const trail = (x: number, y: number) => {
      if (!trailLast) {
        trailLast = { x, y };
        return;
      }
      if (Math.hypot(x - trailLast.x, y - trailLast.y) < trailGap) return;
      trailLast = { x, y };
      trailGap = 26 + Math.random() * 34;
      if (document.querySelectorAll(".bit").length > 70) return; // stay light
      bit(
        x + (Math.random() - 0.5) * 12,
        y + (Math.random() - 0.5) * 12,
        14 + Math.random() * 22,
        0.2 + Math.random() * 0.18,
        900 + Math.random() * 500,
        0,
        10 + Math.random() * 2,
      );
    };

    // a touch that lifts quickly without moving is a tap (not the start of a scroll)
    let touchStart: { x: number; y: number; t: number } | null = null;

    const onDown = (e: PointerEvent) => {
      // taps on buttons, links, tabs etc. are just taps
      const target = e.target;
      if (target instanceof Element && target.closest('a, button, input, textarea, select, label, summary, [role="button"], [role="tab"], [role="switch"], [role="link"], [contenteditable]')) return;
      if (e.pointerType === "touch") {
        touchStart = { x: e.clientX, y: e.clientY, t: performance.now() };
      } else if (e.button === 0) {
        // mouse: every click lets a few bits drip (the torch already follows the cursor)
        drip(e.clientX, e.clientY);
      }
    };

    const onUp = (e: PointerEvent) => {
      if (e.pointerType !== "touch" || !touchStart) return;
      const moved = Math.hypot(e.clientX - touchStart.x, e.clientY - touchStart.y);
      const quick = performance.now() - touchStart.t < 400;
      touchStart = null;
      if (moved > 12 || !quick) return;

      // jump the torch to the finger (no sliding across the screen), then let it fade
      cur.mx = target.mx = e.clientX;
      cur.my = target.my = e.clientY;
      target.px = (e.clientX / window.innerWidth) * 2 - 1;
      target.py = (e.clientY / window.innerHeight) * 2 - 1;
      target.r = TORCH * 0.75;
      clearTimeout(dimTimer);
      dimTimer = window.setTimeout(() => {
        target.r = 0;
        if (!raf) raf = requestAnimationFrame(tick);
      }, 1400);
      drip(e.clientX, e.clientY);
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onCancel = () => {
      touchStart = null;
    };

    write();
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onCancel, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onCancel);
      clearTimeout(dimTimer);
      document.querySelectorAll(".bit").forEach((el) => el.remove());
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none opacity-[0.32]"
      style={{
        // bright near the cursor, a whisper everywhere else
        maskImage:
          "radial-gradient(circle var(--r, 380px) at var(--mx) var(--my), #000 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.17) 100%)",
        WebkitMaskImage:
          "radial-gradient(circle var(--r, 380px) at var(--mx) var(--my), #000 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.17) 100%)",
      }}
    >
      <div className="absolute -inset-16 grid grid-cols-2 lg:grid-cols-4 gap-10 px-10">
        {COLUMNS.map((col, i) => (
          <div
            key={i}
            className={i > 1 ? "hidden lg:block" : ""}
            style={{
              transform: `translate3d(calc(var(--px, 0) * ${-col.depth}px), calc(var(--py, 0) * ${-col.depth}px), 0)`,
              willChange: "transform",
            }}
          >
            <div className="code-drift" style={{ animationDuration: `${col.speed}s` }}>
              {/* rendered twice so the vertical drift loops seamlessly */}
              {[0, 1].map((copy) => (
                <div key={copy}>
                  {col.order.map((s) => (
                    <pre
                      key={s}
                      className="mb-10 font-mono text-[11px] leading-[1.7] text-slate-400 whitespace-pre"
                    >
                      {SNIPPETS[s].split("\n").map((line, n) => (
                        <div key={n}>{line ? highlight(line) : " "}</div>
                      ))}
                    </pre>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
