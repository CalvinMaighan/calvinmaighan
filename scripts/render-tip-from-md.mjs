#!/usr/bin/env bun
/**
 * Renders site/tips/_drafts/*.md → HTML using the article chrome shell.
 * Frontmatter keys: title, primaryKeyword, metaDescription, slug, canonical,
 * updatedAt, ogImage, inBodyImage, inBodyImageAlt, summary, kicker, series,
 * nextHref, nextLabel, standalone (bool), faq (JSON string or YAML-ish lines not supported — use FAQ in body),
 * ctaAboveFold, ctaEnd
 *
 * Body markdown is limited: paragraphs, ## ###, -, 1., **bold**, `code`, [text](url), <figure> passthrough.
 */
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { SERIES } from "../site/tip-series.mjs";

const ROOT = join(import.meta.dir, "..");
const DRAFTS = join(ROOT, "site/tips/_drafts");

function parseFrontmatter(raw) {
  if (!raw.startsWith("---\n")) throw new Error("missing frontmatter");
  const end = raw.indexOf("\n---\n", 4);
  if (end < 0) throw new Error("unclosed frontmatter");
  const fm = raw.slice(4, end);
  const body = raw.slice(end + 5);
  const data = {};
  for (const line of fm.split("\n")) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const i = line.indexOf(":");
    if (i < 0) continue;
    const key = line.slice(0, i).trim();
    let val = line.slice(i + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    data[key] = val;
  }
  return { data, body };
}

function escapeHtml(s) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function linkHtml(text, href) {
  const isExternal = /^https?:\/\//i.test(href);
  const isGithub = /(?:^|\.)github\.com(?:[\/:]|$)/i.test(
    href.replace(/^https?:\/\//i, ""),
  );
  const classes = ["article-link"];
  if (isExternal) classes.push("is-external");
  if (isGithub) classes.push("is-github");
  const githubIco = isGithub
    ? `<svg class="icon article-link-ico" aria-hidden="true"><use href="#icon-github"></use></svg>`
    : "";
  const externalIco = isExternal
    ? `<svg class="icon article-link-ico article-link-ico-external" aria-hidden="true"><use href="#icon-external"></use></svg>`
    : "";
  return `<a class="${classes.join(" ")}" href="${href}" rel="noopener"${
    isExternal ? ' target="_blank"' : ""
  }>${githubIco}<span class="article-link-text">${text}</span>${externalIco}</a>`;
}

function inline(s) {
  let out = escapeHtml(s);
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, href) =>
    linkHtml(text, href),
  );
  out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  return out;
}

function mdToHtml(md) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const parts = [];
  let i = 0;
  let inFaq = false;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    if (line.startsWith("<figure") || line.startsWith("<section")) {
      const tag = line.startsWith("<figure") ? "figure" : "section";
      const buf = [line];
      if (!line.includes(`</${tag}>`)) {
        i++;
        while (i < lines.length && !lines[i].includes(`</${tag}>`)) {
          buf.push(lines[i]);
          i++;
        }
        if (i < lines.length) buf.push(lines[i]);
      }
      parts.push(buf.join("\n"));
      i++;
      continue;
    }
    if (line.startsWith("### ")) {
      if (inFaq) {
        const q = inline(line.slice(4));
        i++;
        while (i < lines.length && !lines[i].trim()) i++;
        const ans = [];
        while (
          i < lines.length &&
          lines[i].trim() &&
          !lines[i].startsWith("#") &&
          !lines[i].startsWith("- ") &&
          !lines[i].startsWith("<")
        ) {
          ans.push(lines[i]);
          i++;
        }
        const a = inline(ans.join(" "));
        parts.push(
          `<details class="faq-item">\n<summary class="faq-question">${q}</summary>\n<p class="faq-answer">${a}</p>\n</details>`,
        );
        continue;
      }
      parts.push(`<h3>${inline(line.slice(4))}</h3>`);
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      const title = line.slice(3).trim();
      if (inFaq) {
        parts.push("</div>");
        parts.push("</section>");
        inFaq = false;
      }
      if (/^faq$/i.test(title)) {
        parts.push(`<section class="article-faq">`);
        parts.push(`<h2>${inline(title)}</h2>`);
        parts.push(`<div class="faq-list">`);
        inFaq = true;
      } else {
        parts.push(`<h2>${inline(title)}</h2>`);
      }
      i++;
      continue;
    }
    if (line.startsWith("- ")) {
      const items = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(`<li>${inline(lines[i].slice(2))}</li>`);
        i++;
      }
      parts.push(`<ul>\n${items.join("\n")}\n</ul>`);
      continue;
    }
    const para = [];
    while (i < lines.length && lines[i].trim() && !lines[i].startsWith("#") && !lines[i].startsWith("- ") && !lines[i].startsWith("<")) {
      para.push(lines[i]);
      i++;
    }
    parts.push(`<p>${inline(para.join(" "))}</p>`);
  }
  if (inFaq) {
    parts.push("</div>");
    parts.push("</section>");
  }
  return parts.join("\n\n");
}

function faqFromBody(html) {
  // Extract accordion Q&A after <h2>FAQ</h2> for JSON-LD
  const idx = html.search(/<h2>FAQ<\/h2>/i);
  if (idx < 0) return [];
  const slice = html.slice(idx);
  const re =
    /<summary class="faq-question">(.*?)<\/summary>\s*<p class="faq-answer">(.*?)<\/p>/gs;
  const out = [];
  let m;
  while ((m = re.exec(slice)) && out.length < 8) {
    out.push({
      q: m[1].replace(/<[^>]+>/g, ""),
      a: m[2].replace(/<[^>]+>/g, ""),
    });
  }
  if (out.length) return out;
  // Legacy h3/p FAQ
  const legacy = /<h3>(.*?)<\/h3>\s*<p>(.*?)<\/p>/gs;
  while ((m = legacy.exec(slice)) && out.length < 8) {
    out.push({
      q: m[1].replace(/<[^>]+>/g, ""),
      a: m[2].replace(/<[^>]+>/g, ""),
    });
  }
  return out;
}

function rootFromOut(out) {
  const rel = String(out || "").replace(/^site\//, "");
  const depth = Math.max(1, rel.split("/").length - 1);
  return Array(depth).fill("..").join("/");
}

function pageHtml({ data, bodyHtml, faq, readMinutes }) {
  const standalone = data.standalone === "true";
  const intro = data.intro === "true";
  const toRoot = data.toRoot || rootFromOut(data.out) || (standalone || intro ? ".." : "../..");
  const title = data.title;
  const meta = data.metaDescription;
  const canonical = data.canonical;
  const ogImage = data.ogImage || `${toRoot}/calvin-article-2.png`.replace("../..", "https://calvinmaighan.com").replace("..", "https://calvinmaighan.com");
  const ogAbs = data.ogImage?.startsWith("http")
    ? data.ogImage
    : `https://calvinmaighan.com/calvin-article-2.png`;
  const summary = data.summary;
  const kicker = data.kicker || "";
  const series = data.series || "";
  const nextHref = data.nextHref || `${toRoot}/index.html#contact`;
  const nextLabel = data.nextLabel || "Book a call";
  const isBookCta = /^book a call$/i.test(nextLabel.trim());
  // Scroll-lock next-article CTAs; never lock a Book a call CTA.
  const nextLocked = !isBookCta && data.nextLocked !== "false";
  const seriesIdx = SERIES.findIndex((s) => s.slug === (data.slug || ""));
  const nextPart =
    !isBookCta && seriesIdx >= 0 && seriesIdx < SERIES.length - 1
      ? seriesIdx + 1
      : null;
  const imgAlt = data.inBodyImageAlt || title;
  const updated = data.updatedAt || "2026-07-22";
  const updatedHuman = data.updatedHuman || "July 22, 2026";
  let ctaFold = data.ctaAboveFold || "Book a call";
  if (/→|->|https?:|\.\.\//.test(ctaFold)) ctaFold = "Book a call";
  let ctaEnd =
    data.ctaEnd || "If you want this stack on your team, book a call";
  ctaEnd = ctaEnd
    .replace(/\s*→.*$/u, "")
    .replace(/\s*Book a call\.?$/i, "")
    .replace(/\s*Continue with.*$/i, "")
    .trim();
  if (!ctaEnd) ctaEnd = "If you want this on your team workflow";

  const faqEntities = faq.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  }));

  const graph = [
    {
      "@type": "Article",
      headline: title,
      description: meta,
      datePublished: updated,
      dateModified: updated,
      author: {
        "@type": "Person",
        name: "Calvin Maighan",
        url: "https://calvinmaighan.com/",
      },
      image: [ogAbs],
      mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    },
  ];
  if (faqEntities.length) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: faqEntities,
    });
  }

  const seriesParts = [];
  if (!standalone && kicker) {
    seriesParts.push(`<p class="article-kicker">${escapeHtml(kicker)}</p>`);
  }
  if (!standalone && series) {
    seriesParts.push(`<p class="article-series">${escapeHtml(series)}</p>`);
  }
  const seriesBlock = seriesParts.length
    ? seriesParts.join("\n            ")
    : "";

  const h1Extra = standalone
    ? ""
    : "";

  const seriesSlug = data.slug || "";
  const seriesItem = SERIES.find((s) => s.slug === seriesSlug);
  const subtitle = data.subtitle || seriesItem?.subtitle || "";
  const seriesRail = SERIES.map((item, i) => {
    const tipNum = i; // 0 = intro, 1–14 = tips
    const current = item.slug === seriesSlug;
    const isIntro = tipNum === 0;
    const locked = !isIntro;
    const label = isIntro
      ? item.title
      : `Skill #${tipNum}: Keep reading to unlock`;
    const sub = item.subtitle || "";
    return `            <li>
              <a
                class="article-series-card${locked ? " is-locked" : ""}${current ? " is-current" : ""}"
                data-series-slug="${escapeHtml(item.slug)}"
                data-series-title="${escapeHtml(item.title)}"
                data-series-subtitle="${escapeHtml(sub)}"
                data-series-tip="${tipNum}"
                data-href="${escapeHtml(item.path)}"
                href="${isIntro ? escapeHtml(item.path) : "#"}"
                ${locked ? 'aria-disabled="true"' : ""}
              >
                <span class="article-series-card-copy">
                  <span class="article-series-card-head">
                    <span class="article-series-card-title">${escapeHtml(label)}</span>
                    <span class="article-series-card-check"${locked ? " hidden" : ""} aria-hidden="true">
                      <svg class="icon" aria-hidden="true"><use href="#icon-check"></use></svg>
                    </span>
                  </span>
                  <span class="article-series-card-subtitle"${!sub ? " hidden" : ""}>${escapeHtml(sub)}</span>
                </span>
              </a>
            </li>`;
  }).join("\n");

  const faqStart = bodyHtml.search(/<section class="article-faq">/i);
  const bodyMain = faqStart >= 0 ? bodyHtml.slice(0, faqStart).trimEnd() : bodyHtml;
  const faqHtml = faqStart >= 0 ? bodyHtml.slice(faqStart).trim() : "";

  return `<!doctype html>
<html lang="en" data-theme="light" data-accent="beige">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="${escapeHtml(meta)}" />
    <title>${escapeHtml(title)} · Calvin Maighan</title>
    <link rel="canonical" href="${escapeHtml(canonical)}" />
    <link rel="icon" href="/favicon.ico" sizes="any" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <meta name="theme-color" content="#E6E2D4" media="(prefers-color-scheme: light)" />
    <meta name="theme-color" content="#221D19" media="(prefers-color-scheme: dark)" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="Calvin Maighan" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(meta)}" />
    <meta property="og:url" content="${escapeHtml(canonical)}" />
    <meta property="og:image" content="${escapeHtml(ogAbs)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(meta)}" />
    <meta name="twitter:image" content="${escapeHtml(ogAbs)}" />
    <script type="application/ld+json">
${JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 2)}
    </script>
    <script>
      (() => {
        try {
          const root = document.documentElement;
          const mode = localStorage.getItem("active-theme:mode");
          const color = localStorage.getItem("active-theme:color");
          if (mode === "light" || mode === "dark") root.dataset.theme = mode;
          if (color) root.dataset.accent = color;
        } catch (_) {}
      })();
    </script>
    <link rel="stylesheet" href="${toRoot}/styles.css" />
  </head>
  <body class="article-page" data-series-slug="${escapeHtml(seriesSlug)}">
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
        <path fill="currentColor" d="M12 1C5.9225 1 1 5.9225 1 12C1 16.8675 4.14875 20.9787 8.52125 22.4362C9.07125 22.5325 9.2775 22.2025 9.2775 21.9137C9.2775 21.6525 9.26375 20.7862 9.26375 19.865C6.5 20.3737 5.785 19.1912 5.565 18.5725C5.44125 18.2562 4.905 17.28 4.4375 17.0187C4.0525 16.8125 3.5025 16.3037 4.42375 16.29C5.29 16.2762 5.90875 17.0875 6.115 17.4175C7.105 19.0812 8.68625 18.6137 9.31875 18.325C9.415 17.61 9.70375 17.1287 10.02 16.8537C7.5725 16.5787 5.015 15.63 5.015 11.4225C5.015 10.2262 5.44125 9.23625 6.1425 8.46625C6.0325 8.19125 5.6475 7.06375 6.2525 5.55125C6.2525 5.55125 7.17375 5.2625 9.2775 6.67875C10.1575 6.43125 11.0925 6.3075 12.0275 6.3075C12.9625 6.3075 13.8975 6.43125 14.7775 6.67875C16.8813 5.24875 17.8025 5.55125 17.8025 5.55125C18.4075 7.06375 18.0225 8.19125 17.9125 8.46625C18.6138 9.23625 19.04 10.2125 19.04 11.4225C19.04 15.6437 16.4688 16.5787 14.0213 16.8537C14.42 17.1975 14.7638 17.8575 14.7638 18.8887C14.7638 20.36 14.75 21.5425 14.75 21.9137C14.75 22.2025 14.9563 22.5462 15.5063 22.4362C19.8513 20.9787 23 16.8537 23 12C23 5.9225 18.0775 1 12 1Z" />
      </symbol>
      <symbol id="icon-mail" viewBox="0 0 24 24">
        <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <path d="m22 7l-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
          <rect width="20" height="16" x="2" y="4" rx="2" />
        </g>
      </symbol>
      <symbol id="icon-external" viewBox="0 0 24 24">
        <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <path d="M15 3h6v6" />
          <path d="M10 14L21 3" />
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        </g>
      </symbol>
      <symbol id="icon-check" viewBox="0 0 24 24">
        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 6L9 17l-5-5" />
      </symbol>
    </svg>

    <header class="site-header" id="site-header">
      <div class="bar">
        <a class="brand" href="${toRoot}/index.html" data-i18n="brand">Calvin Maighan</a>
        <div class="header-actions">
          <div class="locale-menu" id="locale-menu">
            <button type="button" class="icon-btn icon-btn-wide" id="locale-toggle" aria-label="Language" aria-haspopup="listbox" aria-expanded="false" aria-controls="locale-popover">
              <svg class="icon" aria-hidden="true"><use href="#icon-languages"></use></svg>
              <span class="icon-btn-text" id="locale-label">EN</span>
            </button>
            <div class="locale-popover" id="locale-popover" role="listbox" aria-label="Language">
              <button type="button" class="locale-option" role="option" data-locale="en" aria-selected="true">EN</button>
              <button type="button" class="locale-option" role="option" data-locale="fr" aria-selected="false">FR</button>
            </div>
          </div>
          <button type="button" class="icon-btn" id="theme-toggle" aria-label="Switch to dark theme">
            <svg class="icon" aria-hidden="true"><use id="theme-icon-use" href="#icon-moon"></use></svg>
          </button>
          <button type="button" class="menu-toggle" id="menu-toggle" aria-expanded="false" aria-controls="nav-drawer" aria-label="Open menu">
            <svg class="icon" aria-hidden="true"><use id="menu-icon-use" href="#icon-menu"></use></svg>
          </button>
        </div>
      </div>
    </header>

    <div class="backdrop" id="menu-backdrop"></div>
    <nav class="nav-drawer" id="nav-drawer" aria-label="Primary">
      <a href="${toRoot}/index.html#tips" data-i18n="article.back">Back to tips</a>
      <a href="${toRoot}/index.html#work" data-i18n="nav.work">Work</a>
      <a href="${toRoot}/index.html#contact" data-i18n="nav.contact">Contact</a>
      <a class="btn btn-primary" href="${toRoot}/index.html#contact" data-i18n="nav.cta">Book a call</a>
    </nav>

    <main id="top">
      <article class="article">
        <header class="article-hero">
          <div class="wrap">
            <nav class="article-breadcrumbs" aria-label="Breadcrumb">
              <ol>
                <li><a href="${toRoot}/index.html" data-i18n="article.home">Home</a></li>
                <li aria-current="page">${escapeHtml(title)}</li>
              </ol>
            </nav>
            ${seriesBlock}
          </div>
        </header>

        <div class="wrap article-layout">
          <h1>${escapeHtml(title)}${h1Extra}</h1>
          ${subtitle ? `<p class="article-subtitle">${escapeHtml(subtitle)}</p>` : ""}
          <div class="article-byline">
            <img
              class="article-byline-avatar"
              src="${toRoot}/calvinprofile.jpg"
              alt="Calvin Maighan"
              width="48"
              height="48"
              decoding="async"
            />
            <span class="article-byline-name">Calvin Maighan</span>
            <span class="article-byline-meta">
              <span>${readMinutes} min read</span>
              <span class="sep" aria-hidden="true">·</span>
              <time datetime="${escapeHtml(updated)}">${escapeHtml(updatedHuman)}</time>
            </span>
            <a class="btn btn-primary article-byline-cta" href="${toRoot}/index.html#contact" data-i18n="article.book">${escapeHtml(ctaFold)}</a>
          </div>
          <figure class="article-cover">
            <img src="${escapeHtml(data.inBodyImage || `${toRoot}/calvin-article-2.png`)}" alt="${escapeHtml(imgAlt)}" width="1672" height="941" decoding="async" />
          </figure>
          <p class="article-summary">${inline(summary)}</p>
          <aside class="article-aside" aria-label="Series">
            <ol class="article-series-rail">
${seriesRail}
            </ol>
          </aside>
          <div class="article-body">
${bodyMain}

            <div class="article-cta-end">
              <p>${inline(ctaEnd)}</p>
              <a class="btn btn-primary" href="${toRoot}/index.html#contact" data-i18n="article.book">Book a call</a>
            </div>

${faqHtml}
          </div>
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
          <a class="foot-ico" href="https://github.com/CalvinMaighan" rel="noopener"><svg class="icon" aria-hidden="true"><use href="#icon-github"></use></svg>GitHub</a>
          <span class="sep" aria-hidden="true">·</span>
          <a class="foot-ico" href="mailto:hello@calvinmaighan.com"><svg class="icon" aria-hidden="true"><use href="#icon-mail"></use></svg>Email</a>
          <span class="sep" aria-hidden="true">·</span>
          <a href="${toRoot}/index.html#contact" data-i18n="nav.cta">Book a call</a>
        </p>
      </div>
    </footer>

    <div class="article-chrome">
      <div class="read-progress" aria-hidden="true"></div>
      <div class="article-chrome-inner">
        ${
          nextPart != null
            ? `<p class="article-chrome-hint" id="article-chrome-hint" data-unlock-part="${nextPart}" data-locked-text="Keep reading to unlock skill #${nextPart}">Keep reading to unlock skill #${nextPart}</p>`
            : ""
        }
        <a class="btn btn-primary${nextLocked ? " is-locked" : ""}" id="article-next" href="${escapeHtml(nextHref)}"${nextLocked ? ' aria-disabled="true"' : ""} data-i18n="${isBookCta ? "article.book" : "article.next"}">${escapeHtml(nextLabel)}</a>
      </div>
    </div>

    <script type="module" src="${toRoot}/app.mjs"></script>
  </body>
</html>
`;
}

const filter = (process.env.TIP_DRAFT_FILTER || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const files = (await readdir(DRAFTS)).filter(
  (f) => f.endsWith(".md") && (filter.length === 0 || filter.includes(f)),
);
if (!files.length) {
  console.log("No drafts in", DRAFTS);
  process.exit(0);
}

for (const file of files) {
  const raw = await readFile(join(DRAFTS, file), "utf8");
  const { data, body } = parseFrontmatter(raw);
  const slug = (data.slug || file.replace(/\.md$/, "")).replaceAll('"', "");
  if (!data.out) {
    data.out =
      data.standalone === "true"
        ? `site/tips/${slug}.html`
        : `site/tips/secret-agent-tips/${slug}.html`;
  }
  let bodyMd = body.trim();
  if (!data.title) {
    const h1 = bodyMd.match(/^#\s+(.+)$/m);
    if (h1) data.title = h1[1].trim();
  }
  bodyMd = bodyMd.replace(/^#\s+.+\n+/, "");
  if (!data.summary) {
    const sum = bodyMd.match(/^\*\*Summary\*\*\s*\n+([\s\S]*?)(?:\n\n|$)/);
    if (sum) data.summary = sum[1].replace(/\n+/g, " ").trim();
  }
  bodyMd = bodyMd.replace(/^\*\*Summary\*\*\s*\n+[\s\S]*?(?:\n\n)/, "");
  if (!data.primaryKeyword && data.title) {
    data.primaryKeyword = data.title.toLowerCase();
  }
  if (!data.metaDescription && data.summary) {
    data.metaDescription = data.summary.slice(0, 220);
  }
  if (!data.canonical) {
    data.canonical = `https://calvinmaighan.com/${data.out.replace(/^site\//, "")}`;
  }
  // No above-title kicker / series blurb on tip pages.
  data.kicker = "";
  data.series = "";
  if (!data.nextHref) {
    data.nextHref =
      data.standalone === "true"
        ? "./secret-agent-tips/read-dependency-source-code-with-opensrc.html"
        : "../../index.html#contact";
  }
  if (!data.nextLabel) {
    data.nextLabel =
      data.standalone === "true" ? "Start the series" : "Book a call";
  }
  const bodyHtml = mdToHtml(bodyMd.trim());
  const faq = faqFromBody(bodyHtml);
  const words = bodyMd.split(/\s+/).filter(Boolean).length;
  const readMinutes = Math.max(1, Math.round(words / 200));
  const html = pageHtml({ data, bodyHtml, faq, readMinutes });
  const outPath = join(ROOT, data.out);
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, html);
  console.log("wrote", data.out, "words≈", words, "min", readMinutes, "faq", faq.length);
}
