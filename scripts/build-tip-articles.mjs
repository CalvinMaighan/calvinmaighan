#!/usr/bin/env bun
/**
 * Renders hand-reviewed drafts in site/tips/_drafts/*.md to HTML + sitemap.
 * Does not regenerate article bodies. Edit drafts directly, then run:
 *   bun run tips:build
 */
import { readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = join(import.meta.dir, "..");
const DRAFTS = join(ROOT, "site/tips/_drafts");

const render = spawnSync("bun", [join(import.meta.dir, "render-tip-from-md.mjs")], {
  cwd: ROOT,
  stdio: "inherit",
});
if (render.status !== 0) process.exit(render.status ?? 1);

const drafts = (await readdir(DRAFTS)).filter((f) => f.endsWith(".md"));
const urls = ["https://calvinmaighan.com/"];
const seen = new Set(urls);
for (const file of drafts) {
  // Redirect stubs stay as HTML for old links; keep them out of the sitemap.
  if (file === "name-ai-agent-skills-after-the-job.md") continue;
  const raw = await Bun.file(join(DRAFTS, file)).text();
  const m = raw.match(/^canonical:\s*(.+)$/m);
  if (!m) continue;
  const loc = m[1].trim().replace(/^["']|["']$/g, "");
  if (seen.has(loc)) continue;
  seen.add(loc);
  urls.push(loc);
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (loc, i) => `  <url>
    <loc>${loc}</loc>
    <changefreq>monthly</changefreq>
    <priority>${i === 0 ? "1.0" : "0.8"}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;
await writeFile(join(ROOT, "site/sitemap.xml"), sitemap);

const legacyIntro = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="refresh" content="0; url=../how-ai-agents-speed-up-developers.html" />
    <link rel="canonical" href="https://calvinmaighan.com/tips/how-ai-agents-speed-up-developers.html" />
    <title>Moved · 14 AI agent skills to speed up developers</title>
    <meta name="robots" content="noindex" />
  </head>
  <body>
    <p>
      Series starts at
      <a href="../how-ai-agents-speed-up-developers.html">how AI agents can speed up developers</a>.
    </p>
  </body>
</html>
`;
await writeFile(join(ROOT, "site/tips/ai-agent-skills/01.html"), legacyIntro);
await writeFile(
  join(ROOT, "site/tips/ai-agent-skills/02.html"),
  legacyIntro
    .replaceAll(
      "../how-ai-agents-speed-up-developers.html",
      "../secret-agent-tips/scrape-websites-for-ai-agent-research.html",
    )
    .replace(
      "https://calvinmaighan.com/tips/how-ai-agents-speed-up-developers.html",
      "https://calvinmaighan.com/tips/secret-agent-tips/scrape-websites-for-ai-agent-research.html",
    )
    .replace("14 AI agent skills to speed up developers", "Scrape websites for AI agent research"),
);

console.log("sitemap urls", urls.length);
console.log("drafts", drafts.length);
console.log("done");
