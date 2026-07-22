/**
 * Render site/og.png (1200×630) via SVG → @resvg/resvg-js → Bun.Image.
 * Bun.Image cannot draw text; it encodes the raster from resvg.
 *
 * Usage: bun scripts/render-og.ts
 */
import { join } from "node:path";
import { Resvg } from "@resvg/resvg-js";

const ROOT = join(import.meta.dir, "..");
const OUT = join(ROOT, "site/og.png");
const W = 1200;
const H = 630;

const COLORS = {
  bgTop: "#f7f5ef",
  bgBottom: "#f3ddc2",
  text: "#1f1c18",
  muted: "#5c564c",
  cta: "#41ca51",
  rule: "#c4a574",
};

const FONT_DISPLAY = join(ROOT, "scripts/fonts/ArchivoBlack-Regular.ttf");
const FONT_BODY = join(ROOT, "scripts/fonts/DMSans-SemiBold.ttf");

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="canvas" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${COLORS.bgTop}"/>
      <stop offset="100%" stop-color="${COLORS.bgBottom}"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#canvas)"/>

  <text x="80" y="120" font-family="Archivo Black" font-size="42" letter-spacing="1" fill="${COLORS.text}">CALVIN MAIGHAN</text>
  <rect x="80" y="148" width="104" height="4" rx="1" fill="${COLORS.cta}"/>

  <text x="80" y="280" font-family="Archivo Black" font-size="72" fill="${COLORS.text}">AI consultant to help move</text>
  <text x="80" y="368" font-family="Archivo Black" font-size="72">
    <tspan fill="${COLORS.cta}">ideas</tspan><tspan fill="${COLORS.text}"> forward.</tspan>
  </text>

  <text x="80" y="560" font-family="DM Sans" font-size="28" font-weight="600" fill="${COLORS.muted}">Senior AI &amp; SaaS Engineer · Montreal · remote</text>
  <text x="1120" y="560" font-family="DM Sans" font-size="28" font-weight="600" fill="${COLORS.text}" text-anchor="end">calvinmaighan.com</text>
</svg>`;

const resvg = new Resvg(svg, {
  fitTo: { mode: "width", value: W },
  font: {
    fontFiles: [FONT_DISPLAY, FONT_BODY],
    loadSystemFonts: false,
    defaultFontFamily: "DM Sans",
  },
});

const pngData = resvg.render().asPng();
const written = await new Bun.Image(pngData).png({ compressionLevel: 9 }).write(OUT);
const meta = await Bun.file(OUT).image().metadata();

console.log(`Wrote ${OUT}`);
console.log(`${meta.width}×${meta.height} · ${written} bytes`);
