#!/usr/bin/env bun
/**
 * Promote all Ready tasks → To Do, then sync those To Dos to ClickUp.
 *
 *   BACKLOG_ALLOW_PROMOTE=1 bun run clickup:todo
 *   BACKLOG_ALLOW_PROMOTE=1 bun run clickup:todo -- --dry-run
 *
 * Human-only: agents must not set BACKLOG_ALLOW_PROMOTE.
 */
import { spawnSync } from "node:child_process";
import {
	ROOT,
	loadTasks,
	backlogEdit,
	resolveBriefPath,
} from "./lib/backlog-tasks.mjs";

if (process.env.BACKLOG_ALLOW_PROMOTE !== "1") {
	console.error(
		[
			"Human-only command. Agents must not promote Ready → To Do.",
			"Re-run with: BACKLOG_ALLOW_PROMOTE=1 bun run clickup:todo",
		].join("\n"),
	);
	process.exit(2);
}

const dryRun = process.argv.includes("--dry-run");

const ready = loadTasks().filter((t) => t.status === "Ready");
if (ready.length === 0) {
	console.log("No Ready tasks to promote.");
	process.exit(0);
}

const blocked = [];
const ok = [];
for (const task of ready) {
	const check = resolveBriefPath(task.brief || "");
	if (!check.ok) {
		blocked.push({ id: task.id, reason: check.error || "missing brief frontmatter" });
		continue;
	}
	ok.push(task);
}

for (const b of blocked) {
	console.error(`block ${b.id}: ${b.reason}`);
}
if (blocked.length && ok.length === 0) {
	process.exit(1);
}

console.log(
	`${dryRun ? "[dry-run] " : ""}Promoting ${ok.length} Ready → To Do` +
		(blocked.length ? ` (${blocked.length} blocked)` : ""),
);

for (const task of ok) {
	console.log(`  ${task.id}: Ready → To Do`);
	if (!dryRun) backlogEdit(task.id, ["-s", "To Do"]);
}

if (dryRun) {
	console.log("[dry-run] skip clickup:sync");
	process.exit(blocked.length ? 1 : 0);
}

const sync = spawnSync(
	process.execPath,
	[`${ROOT}/scripts/backlog-clickup-sync.mjs`],
	{ cwd: ROOT, encoding: "utf8", stdio: "inherit" },
);
if (sync.status !== 0) process.exit(sync.status ?? 1);
if (blocked.length) process.exit(1);
