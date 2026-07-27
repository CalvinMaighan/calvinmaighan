#!/usr/bin/env bun
import { readFileSync, writeFileSync } from "node:fs";

const chain = [
  ["read-dependency-source-code-with-opensrc.md", "./scrape-websites-for-ai-agent-research.html", "Next article"],
  ["scrape-websites-for-ai-agent-research.md", "./cut-ai-agent-tokens-with-caveman.html", "Next article"],
  ["cut-ai-agent-tokens-with-caveman.md", "./keep-ai-coding-changes-minimal-with-ponytail.html", "Next article"],
  ["keep-ai-coding-changes-minimal-with-ponytail.md", "./compress-agent-context-before-you-code.html", "Next article"],
  ["compress-agent-context-before-you-code.md", "./persist-codebase-knowledge-across-ai-chats.html", "Next article"],
  ["persist-codebase-knowledge-across-ai-chats.md", "./research-what-people-said-last-month.html", "Next article"],
  ["research-what-people-said-last-month.md", "./remove-ai-writing-tells-from-prose.html", "Next article"],
  ["remove-ai-writing-tells-from-prose.md", "./design-landing-pages-without-ai-slop.html", "Next article"],
  ["design-landing-pages-without-ai-slop.md", "./build-product-videos-with-hyperframes.html", "Next article"],
  ["build-product-videos-with-hyperframes.md", "./catch-ai-code-mistakes-with-lint.html", "Next article"],
  ["catch-ai-code-mistakes-with-lint.md", "./ship-production-releases-with-agent-checks.html", "Next article"],
  ["ship-production-releases-with-agent-checks.md", "./find-dead-code-with-fallow.html", "Next article"],
  ["find-dead-code-with-fallow.md", "./expose-product-actions-as-mcp-tools.html", "Next article"],
  ["expose-product-actions-as-mcp-tools.md", "../../contact.html", "Book a call"],
];

function upsert(fm, key, value) {
  const re = new RegExp(`^${key}:.*$`, "m");
  const line = `${key}: ${JSON.stringify(value)}`;
  if (re.test(fm)) return fm.replace(re, line);
  if (/^series:/m.test(fm)) return fm.replace(/^series:.*$/m, (m) => `${m}\n${line}`);
  return fm.replace(/^---\n/, `---\n${line}\n`);
}

for (const [file, href, label] of chain) {
  const path = `site/tips/_drafts/${file}`;
  const t = readFileSync(path, "utf8");
  const end = t.indexOf("\n---\n", 4);
  let fm = t.slice(0, end);
  const body = t.slice(end);
  fm = upsert(fm, "nextHref", href);
  fm = upsert(fm, "nextLabel", label);
  fm = upsert(fm, "nextLocked", label === "Book a call" ? "false" : "true");
  writeFileSync(path, fm + body);
  console.log("chain", file, "->", href);
}
