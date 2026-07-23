#!/usr/bin/env bun
/**
 * Usage: bun scripts/render-tip-article.mjs <draft.md>
 * Reads portable MD frontmatter + body, writes site/tips/secret-agent-tips/<slug>.html
 */
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { basename, join, dirname } from "path";

const path = process.argv[2];
if (!path) {
  console.error("usage: bun scripts/render-tip-article.mjs <draft.md>");
  process.exit(1);
}

const raw = readFileSync(path, "utf8");
const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
if (!m) throw new Error("missing frontmatter");
const fm = {};
for (const line of m[1].split("\n")) {
  const i = line.indexOf(":");
  if (i === -1) continue;
  const k = line.slice(0, i).trim();
  let v = line.slice(i + 1).trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'")))
    v = v.slice(1, -1);
  fm[k] = v;
}
const bodyMd = m[2].trim();

function esc(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function mdInline(s) {
  return esc(s)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

function mdToHtml(md) {
  const lines = md.split("\n");
  const out = [];
  let i = 0;
  let inUl = false;
  let inOl = false;
  let inFaq = false;
  const closeLists = () => {
    if (inUl) { out.push("</ul>"); inUl = false; }
    if (inOl) { out.push("</ol>"); inOl = false; }
  };
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith("# ")) { i++; continue; } // H1 from title in hero
    if (line === "**Summary**" || line === "## Summary") {
      i++;
      const paras = [];
      while (i < lines.length && lines[i].trim() !== "" && !lines[i].startsWith("#")) {
        paras.push(lines[i]);
        i++;
      }
      out.push(`<p class="article-summary">${mdInline(paras.join(" "))}</p>`);
      continue;
    }
    if (line.startsWith("## FAQ")) {
      closeLists();
      if (inFaq) out.push("</section>");
      out.push('<section class="article-faq">');
      out.push("<h2>FAQ</h2>");
      inFaq = true;
      i++;
      continue;
    }
    if (line.startsWith("### ") && inFaq) {
      closeLists();
      const q = line.slice(4).trim();
      i++;
      const ans = [];
      while (i < lines.length && !lines[i].startsWith("#") && lines[i].trim() !== "") {
        ans.push(lines[i]);
        i++;
      }
      out.push("<h3>" + mdInline(q) + "</h3>");
      out.push("<p>" + mdInline(ans.join(" ")) + "</p>");
      continue;
    }
    if (line.startsWith("## ")) {
      closeLists();
      out.push("<h2>" + mdInline(line.slice(3)) + "</h2>");
      i++;
      continue;
    }
    if (line.startsWith("### ")) {
      closeLists();
      out.push("<h3>" + mdInline(line.slice(4)) + "</h3>");
      i++;
      continue;
    }
    if (line.startsWith("- ")) {
      if (!inUl) { closeLists(); out.push("<ul>"); inUl = true; }
      out.push("<li>" + mdInline(line.slice(2)) + "</li>");
      i++;
      continue;
    }
    if (/^\d+\. /.test(line)) {
      if (!inOl) { closeLists(); out.push("<ol>"); inOl = true; }
      out.push("<li>" + mdInline(line.replace(/^\d+\. /, "")) + "</li>");
      i++;
      continue;
    }
    if (line.trim() === "") {
      closeLists();
      i++;
      continue;
    }
    if (line.startsWith("![") ) {
      // skip md images; we inject figure from fm
      i++;
      continue;
    }
    closeLists();
    // paragraph: gather until blank
    const paras = [line];
    i++;
    while (i < lines.length && lines[i].trim() !== "" && !lines[i].startsWith("#") && !lines[i].startsWith("- ") && !/^\d+\. /.test(lines[i])) {
      paras.push(lines[i]);
      i++;
    }
    out.push("<p>" + mdInline(paras.join(" ")) + "</p>");
  }
  closeLists();
  if (inFaq) out.push("</section>");
  return out.join("\n          ");
}

const tipNum = fm.tipNumber || "?";
const nextHref = fm.nextHref || "../../index.html#contact";
const nextLabel = fm.nextLabel || "Next tip";
const slug = fm.slug;
const title = fm.title;
const meta = fm.metaDescription;
const canonical = fm.canonical;
const ogImage = fm.ogImage || "https://calvinmaighan.com/calvinmaighan-article-series-1.png";
const imgAlt = fm.inBodyImageAlt || "";
const summaryMatch = bodyMd.match(/\*\*Summary\*\*\n\n([\s\S]*?)\n\n/);
const summary = (summaryMatch ? summaryMatch[1] : "").replace(/\n/g, " ");
const faq = [];
const faqBlock = bodyMd.split("## FAQ")[1] || "";
const faqParts = faqBlock.split(/\n### /).slice(1);
for (const part of faqParts) {
  const [qLine, ...rest] = part.split("\n");
  const a = rest.filter((l) => l.trim() && !l.startsWith("#")).join(" ").trim();
  faq.push({ q: qLine.trim(), a });
}

const bodyHtml = mdToHtml(bodyMd);
// inject figure after first ~2 paragraphs of body (after meta line we'll place)
const figure = `<figure class="article-inline-figure">
            <img
              src="../../calvinmaighan-article-series-1.png"
              alt="${esc(imgAlt)}"
              width="1672"
              height="941"
              loading="lazy"
              decoding="async"
            />
          </figure>`;

// Place figure after CTA/meta — find first h2 and insert before it
let bodyWithFigure = bodyHtml;
const h2idx = bodyWithFigure.indexOf("<h2>");
if (h2idx !== -1) {
  bodyWithFigure = bodyWithFigure.slice(0, h2idx) + figure + "\n          " + bodyWithFigure.slice(h2idx);
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: title,
      description: meta,
      datePublished: "2026-07-22",
      dateModified: "2026-07-22",
      author: {
        "@type": "Person",
        name: "Calvin Maighan",
        url: "https://calvinmaighan.com/",
      },
      image: [ogImage],
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": canonical,
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

const html = `<!doctype html>
<html lang="en" data-theme="light" data-accent="beige">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="${esc(meta)}" />
    <title>${esc(title)} · Calvin Maighan</title>
    <link rel="canonical" href="${esc(canonical)}" />
    <link rel="icon" href="/favicon.ico" sizes="any" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <meta name="theme-color" content="#E6E2D4" media="(prefers-color-scheme: light)" />
    <meta name="theme-color" content="#221D19" media="(prefers-color-scheme: dark)" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="Calvin Maighan" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(meta)}" />
    <meta property="og:url" content="${esc(canonical)}" />
    <meta property="og:image" content="${esc(ogImage)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(title)}" />
    <meta name="twitter:description" content="${esc(meta)}" />
    <meta name="twitter:image" content="${esc(ogImage)}" />
    <link rel="stylesheet" href="../../styles.css" />
    <script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
    </script>
  </head>
  <body class="article-page">
    <svg xmlns="http://www.w3.org/2000/svg" class="icon-sprite" aria-hidden="true" focusable="false">
      <symbol id="icon-sun" viewBox="0 0 24 24">
        <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </g>
      </symbol>
      <symbol id="icon-moon" viewBox="0 0 24 24">
        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />
      </symbol>
      <symbol id="icon-languages" viewBox="0 0 24 24">
        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m5 8l6 6m-7 0l6-6l2-3M2 5h12M7 2h1m14 20l-5-10l-5 10m2-4h6" />
      </symbol>
      <symbol id="icon-menu" viewBox="0 0 24 24">
        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5h16M4 12h16M4 19h16" />
      </symbol>
      <symbol id="icon-x" viewBox="0 0 24 24">
        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 6L6 18M6 6l12 12" />
      </symbol>
      <symbol id="icon-github" viewBox="0 0 24 24">
        <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5c.08-1.25-.27-2.48-1-3.5c.28-1.15.28-2.35 0-3.5c0 0-1 0-3 1.5c-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5c-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4" />
          <path d="M9 18c-4.51 2-5-2-7-2" />
        </g>
      </symbol>
      <symbol id="icon-mail" viewBox="0 0 24 24">
        <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <path d="m22 7l-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
          <rect width="20" height="16" x="2" y="4" rx="2" />
        </g>
      </symbol>
    </svg>

    <header class="site-header" id="site-header">
      <div class="bar">
        <a class="brand" href="../../index.html" data-i18n="brand">Calvin Maighan</a>
        <div class="header-actions">
          <div class="locale-menu" id="locale-menu">
            <button
              type="button"
              class="icon-btn icon-btn-wide"
              id="locale-toggle"
              aria-label="Language"
              aria-haspopup="listbox"
              aria-expanded="false"
              aria-controls="locale-popover"
            >
              <svg class="icon" aria-hidden="true"><use href="#icon-languages"></use></svg>
              <span class="icon-btn-text" id="locale-label">EN</span>
            </button>
            <div class="locale-popover" id="locale-popover" role="listbox" aria-label="Language">
              <button type="button" class="locale-option" role="option" data-locale="en" aria-selected="true">
                EN
              </button>
              <button type="button" class="locale-option" role="option" data-locale="fr" aria-selected="false">
                FR
              </button>
            </div>
          </div>
          <button type="button" class="icon-btn" id="theme-toggle" aria-label="Switch to dark theme">
            <svg class="icon" aria-hidden="true"><use id="theme-icon-use" href="#icon-moon"></use></svg>
          </button>
          <button
            type="button"
            class="menu-toggle"
            id="menu-toggle"
            aria-expanded="false"
            aria-controls="nav-drawer"
            aria-label="Open menu"
          >
            <svg class="icon" aria-hidden="true"><use id="menu-icon-use" href="#icon-menu"></use></svg>
          </button>
        </div>
      </div>
    </header>

    <div class="backdrop" id="menu-backdrop"></div>
    <nav class="nav-drawer" id="nav-drawer" aria-label="Primary">
      <a href="../../index.html#tips" data-i18n="article.back">Back to tips</a>
      <a href="../../index.html#work" data-i18n="nav.work">Work</a>
      <a href="../../index.html#contact" data-i18n="nav.contact">Contact</a>
      <a class="btn btn-primary" href="../../index.html#contact" data-i18n="nav.cta">Book a call</a>
    </nav>

    <main id="top">
      <article class="article">
        <header class="article-hero">
          <div class="wrap">
                        <h1>${esc(title)}</h1>
                        <figure class="article-cover">
              <img
                src="../../calvinmaighan-article-series-1.png"
                alt="${esc(imgAlt)}"
                width="1672"
                height="941"
                decoding="async"
              />
            </figure>
          </div>
        </header>

        <div class="wrap article-body">
          ${bodyWithFigure.replace(
            /(<p class="article-summary">[\s\S]*?<\/p>)/,
            `$1
          <p class="article-cta-fold"><a class="btn btn-primary" href="../../index.html#contact">Book a call</a></p>
          <p class="article-meta-line"><span>By Calvin Maighan</span> · <time datetime="2026-07-22">Updated July 22, 2026</time></p>`
          )}
          <p class="article-cta-end">
            Want this workflow wired into your team?
            <a href="../../index.html#contact">Book a call</a>
            ·
            <a href="${esc(nextHref)}">${esc(nextLabel)}</a>
          </p>
        </div>
      </article>
    </main>

    <footer class="site-footer">
      <div class="wrap">
        <p class="foot-statement" data-i18n="footer.statement">Available for hard builds.</p>
        <p class="foot-meta">
          <strong>Calvin Maighan</strong>
          <span class="sep" aria-hidden="true">·</span>
          <span data-i18n="footer.role">Senior AI and SaaS Engineer</span>
          <span class="sep" aria-hidden="true">·</span>
          <span data-i18n="footer.meta">Montreal · remote contracts</span>
          <span class="sep" aria-hidden="true">·</span>
          <a class="foot-ico" href="https://github.com/CalvinMaighan" rel="noopener"
            ><svg class="icon" aria-hidden="true"><use href="#icon-github"></use></svg
            >GitHub</a
          >
          <span class="sep" aria-hidden="true">·</span>
          <a class="foot-ico" href="mailto:hello@calvinmaighan.com"
            ><svg class="icon" aria-hidden="true"><use href="#icon-mail"></use></svg
            >Email</a
          >
          <span class="sep" aria-hidden="true">·</span>
          <a href="../../index.html#contact" data-i18n="nav.cta">Book a call</a>
        </p>
      </div>
    </footer>

    <div class="article-chrome">
      <div class="read-progress" aria-hidden="true"></div>
      <div class="article-chrome-inner">
        <a class="btn btn-primary" id="article-next" href="${esc(nextHref)}" data-i18n="article.next"
          >${esc(nextLabel)}</a
        >
      </div>
    </div>

    <script type="module" src="../../app.mjs"></script>
  </body>
</html>
`;

const outDir = join(dirname(path), "..", "secret-agent-tips");
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, `${slug}.html`);
writeFileSync(outPath, html);
const words = bodyMd.split(/\s+/).filter(Boolean).length;
console.log(JSON.stringify({ outPath, words, faq: faq.length, metaLen: meta.length }));
