#!/usr/bin/env bun
/**
 * Symlink a restricted skill set into .cursor/skills for ClickUp SDK agents.
 *
 *   bun run clickup:webhook:sync-surface
 *
 * Allowlist only (this repo): workflow, BMAD, Cursor product, Firecrawl.
 * Does NOT touch global installs — HyperFrames etc. stay in ~/.cursor/skills
 * for Deedee and Desktop.
 *
 * Sources (first name wins):
 *   1. ~/.cursor/skills
 *   2. ~/.cursor/skills-cursor
 *   3. ~/.agents/skills
 *   4. repo .agents/skills
 */
import {
	existsSync,
	lstatSync,
	mkdirSync,
	readdirSync,
	rmSync,
	symlinkSync,
} from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const ROOT = join(import.meta.dir, "..");
const DEST = join(ROOT, ".cursor", "skills");
const HOME = homedir();

const SOURCES = [
	join(HOME, ".cursor", "skills"),
	join(HOME, ".cursor", "skills-cursor"),
	join(HOME, ".agents", "skills"),
	join(ROOT, ".agents", "skills"),
];

/** Cursor product skills live under ~/.cursor/skills-cursor */
const CURSOR_PRODUCT = new Set([
	"automate",
	"babysit",
	"canvas",
	"create-hook",
	"create-rule",
	"create-skill",
	"create-subagent",
	"env-setup",
	"loop",
	"migrate-to-skills",
	"onboard",
	"review",
	"review-bugbot",
	"review-security",
	"sdk",
	"shell",
	"split-to-prs",
	"statusline",
	"update-cli-config",
	"update-cursor-settings",
]);

/** Workflow / repo helpers for this portfolio + agent ops */
const WORKFLOW = new Set([
	"active-seo",
	"active-skills",
	"article",
	"backlog",
	"backlog-funnel",
	"backlog-list",
	"backlog-ready",
	"caveman",
	"clickup-todo",
	"hallmark",
	"last30days",
	"lean-ctx",
	"opensrc",
	"ponytail",
	"stop-slop",
]);

function allowed(name) {
	if (name.startsWith("bmad-")) return true;
	if (name === "firecrawl" || name.startsWith("firecrawl-")) return true;
	if (CURSOR_PRODUCT.has(name)) return true;
	if (WORKFLOW.has(name)) return true;
	return false;
}

// Rebuild so removals (e.g. hyperframes) take effect
if (existsSync(DEST)) {
	rmSync(DEST, { recursive: true, force: true });
}
mkdirSync(DEST, { recursive: true });

/** @type {string[]} */
const linked = [];
/** @type {string[]} */
const skippedDenied = [];

for (const srcRoot of SOURCES) {
	if (!existsSync(srcRoot)) continue;
	for (const name of readdirSync(srcRoot)) {
		if (name.startsWith(".")) continue;
		const from = join(srcRoot, name);
		const to = join(DEST, name);
		const st = lstatSync(from);
		if (!st.isDirectory() && !st.isSymbolicLink()) continue;
		if (!allowed(name)) {
			skippedDenied.push(name);
			continue;
		}
		if (existsSync(to)) continue;
		symlinkSync(from, to);
		linked.push(name);
	}
}

const deniedUnique = [...new Set(skippedDenied)].sort();
console.log(`[sync-surface] .cursor/skills → ${DEST}`);
console.log(`[sync-surface] linked ${linked.length} (workflow/bmad/cursor/firecrawl)`);
console.log(
	`[sync-surface] skipped ${deniedUnique.length} (kept globally; not this project): ${deniedUnique.slice(0, 12).join(", ")}${deniedUnique.length > 12 ? ", …" : ""}`,
);
