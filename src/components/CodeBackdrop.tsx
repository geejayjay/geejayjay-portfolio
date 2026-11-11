import { useEffect, useRef, ReactNode } from "react";

/**
 * Developer mode: faint source code drifts behind the page.
 * The columns sit at different depths and shift against the mouse (parallax),
 * and the code lights up around the cursor like a torch over a dark screen.
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
    // normalised pointer (-1..1) and pixel pointer, eased toward their targets
    // no mouse (touch): park the torch off-screen so the code stays a whisper
    const hasMouse = window.matchMedia("(hover: hover)").matches;
    const cur = {
      px: 0,
      py: 0,
      mx: hasMouse ? window.innerWidth * 0.5 : -9999,
      my: hasMouse ? window.innerHeight * 0.38 : -9999,
    };
    const target = { ...cur };
    let raf = 0;

    const write = () => {
      root.style.setProperty("--px", cur.px.toFixed(4));
      root.style.setProperty("--py", cur.py.toFixed(4));
      root.style.setProperty("--mx", `${cur.mx.toFixed(1)}px`);
      root.style.setProperty("--my", `${cur.my.toFixed(1)}px`);
    };

    const tick = () => {
      const ease = 0.085;
      cur.px += (target.px - cur.px) * ease;
      cur.py += (target.py - cur.py) * ease;
      cur.mx += (target.mx - cur.mx) * 0.18;
      cur.my += (target.my - cur.my) * 0.18;
      write();
      const settled =
        Math.abs(target.px - cur.px) < 0.001 &&
        Math.abs(target.py - cur.py) < 0.001 &&
        Math.abs(target.mx - cur.mx) < 0.5 &&
        Math.abs(target.my - cur.my) < 0.5;
      raf = settled ? 0 : requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      target.px = (e.clientX / window.innerWidth) * 2 - 1;
      target.py = (e.clientY / window.innerHeight) * 2 - 1;
      target.mx = e.clientX;
      target.my = e.clientY;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    write();
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
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
          "radial-gradient(circle 380px at var(--mx) var(--my), #000 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.17) 100%)",
        WebkitMaskImage:
          "radial-gradient(circle 380px at var(--mx) var(--my), #000 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.17) 100%)",
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
