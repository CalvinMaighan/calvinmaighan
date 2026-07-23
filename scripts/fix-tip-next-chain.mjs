#!/usr/bin/env bun
import { readFileSync, writeFileSync } from "node:fs";

const chain = [
  ["read-dependency-source-code-with-opensrc.md", "./scrape-websites-for-ai-agent-research.html", "Next article", "Tip 1 of 14"],
  ["scrape-websites-for-ai-agent-research.md", "./cut-ai-agent-tokens-with-caveman.html", "Next article", "Tip 2 of 14"],
  ["cut-ai-agent-tokens-with-caveman.md", "./keep-ai-coding-changes-minimal-with-ponytail.html", "Next article", "Tip 3 of 14"],
  ["keep-ai-coding-changes-minimal-with-ponytail.md", "./compress-agent-context-before-you-code.html", "Next article", "Tip 4 of 14"],
  ["compress-agent-context-before-you-code.md", "./persist-codebase-knowledge-across-ai-chats.html", "Next article", "Tip 5 of 14"],
  ["persist-codebase-knowledge-across-ai-chats.md", "./research-what-people-said-last-month.html", "Next article", "Tip 6 of 14"],
  ["research-what-people-said-last-month.md", "./remove-ai-writing-tells-from-prose.html", "Next article", "Tip 7 of 14"],
  ["remove-ai-writing-tells-from-prose.md", "./design-landing-pages-without-ai-slop.html", "Next article", "Tip 8 of 14"],
  ["design-landing-pages-without-ai-slop.md", "./build-product-videos-with-hyperframes.html", "Next article", "Tip 9 of 14"],
  ["build-product-videos-with-hyperframes.md", "./expose-product-actions-as-mcp-tools.html", "Next article", "Tip 10 of 14"],
  ["expose-product-actions-as-mcp-tools.md", "./catch-ai-code-mistakes-with-lint.html", "Next article", "Tip 11 of 14"],
  ["catch-ai-code-mistakes-with-lint.md", "./ship-production-releases-with-agent-checks.html", "Next article", "Tip 12 of 14"],
  ["ship-production-releases-with-agent-checks.md", "./write-seo-articles-agents-can-follow.html", "Next article", "Tip 13 of 14"],
  ["write-seo-articles-agents-can-follow.md", "../../index.html#contact", "Book a call", "Tip 14 of 14"],
];

function upsert(fm, key, value) {
  const re = new RegExp(`^${key}:.*$`, "m");
  const line = `${key}: ${JSON.stringify(value)}`;
  if (re.test(fm)) return fm.replace(re, line);
  if (/^series:/m.test(fm)) return fm.replace(/^series:.*$/m, (m) => `${m}\n${line}`);
  return fm.replace(/^---\n/, `---\n${line}\n`);
}

for (const [file, href, label, kicker] of chain) {
  const path = `site/tips/_drafts/${file}`;
  const t = readFileSync(path, "utf8");
  const end = t.indexOf("\n---\n", 4);
  let fm = t.slice(0, end);
  const body = t.slice(end);
  fm = upsert(fm, "nextHref", href);
  fm = upsert(fm, "nextLabel", label);
  fm = upsert(fm, "nextLocked", label === "Book a call" ? "false" : "true");
  fm = upsert(fm, "kicker", kicker);
  fm = upsert(fm, "series", "14 secret agent tips for product teams");
  writeFileSync(path, fm + body);
  console.log("chain", file, "->", href);
}
