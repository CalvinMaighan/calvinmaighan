/**
 * Static portfolio server + live reload.
 * Bun HTML-import HMR fails on ./app.mjs — native modules + WS reload instead.
 */
import { watch } from "node:fs";

const root = import.meta.dir;
const clients = new Set<{ send: (data: string) => void }>();

const reloadScript = `(()=>{const p=location.protocol==="https:"?"wss":"ws";const w=new WebSocket(p+"://"+location.host+"/__reload");w.onmessage=()=>location.reload()})();`;

function contentType(path: string) {
  if (path.endsWith(".html")) return "text/html; charset=utf-8";
  if (path.endsWith(".css")) return "text/css; charset=utf-8";
  if (path.endsWith(".js") || path.endsWith(".mjs"))
    return "text/javascript; charset=utf-8";
  if (path.endsWith(".svg")) return "image/svg+xml";
  if (path.endsWith(".png")) return "image/png";
  if (path.endsWith(".webp")) return "image/webp";
  if (path.endsWith(".ico")) return "image/x-icon";
  if (path.endsWith(".webmanifest")) return "application/manifest+json";
  return "application/octet-stream";
}

const server = Bun.serve({
  port: 5173,
  async fetch(req, srv) {
    const url = new URL(req.url);

    if (url.pathname === "/__reload") {
      if (srv.upgrade(req)) return undefined as unknown as Response;
      return new Response("Expected WebSocket", { status: 400 });
    }

    const path = url.pathname === "/" ? "/index.html" : url.pathname;
    const file = Bun.file(`${root}${path}`);
    if (!(await file.exists())) return new Response("Not found", { status: 404 });

    if (path.endsWith(".html")) {
      let html = await file.text();
      if (!html.includes("/__reload")) {
        html = html.replace("</body>", `<script>${reloadScript}</script></body>`);
      }
      return new Response(html, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    return new Response(file, {
      headers: { "Content-Type": contentType(path) },
    });
  },
  websocket: {
    open(ws) {
      clients.add(ws);
    },
    close(ws) {
      clients.delete(ws);
    },
    message() {},
  },
});

async function rebuildSiteCss() {
  const header =
    "/* site.css — themes/bundle.css + styles.css. Regenerate: bun run css:bundle */\n";
  const bundle = await Bun.file(`${root}/themes/bundle.css`).text();
  const styles = await Bun.file(`${root}/styles.css`).text();
  await Bun.write(
    `${root}/site.css`,
    `${header}${bundle}\n/* ===== styles.css ===== */\n${styles}`,
  );
}

let debounce: ReturnType<typeof setTimeout> | null = null;
watch(root, { recursive: true }, (_event, filename) => {
  if (!filename || String(filename).endsWith("serve.ts")) return;
  if (String(filename) === "site.css") return; // avoid rebuild loop
  if (debounce) clearTimeout(debounce);
  debounce = setTimeout(async () => {
    const f = String(filename);
    if (
      f === "styles.css" ||
      f.endsWith("bundle.css") ||
      f.startsWith("themes/")
    ) {
      try {
        await rebuildSiteCss();
      } catch {
        /* ignore mid-write races */
      }
    }
    for (const ws of clients) {
      try {
        ws.send("reload");
      } catch {
        clients.delete(ws);
      }
    }
  }, 60);
});

await rebuildSiteCss();
console.log(`portfolio → ${server.url}`);
