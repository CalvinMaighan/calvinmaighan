#!/usr/bin/env bun
/**
 * Move a task to Ready after a BMAD brief artifact exists.
 *
 *   BACKLOG_ALLOW_PROMOTE=1 bun run backlog:ready -- TASK-3 --brief _bmad-output/.../brief.md
 *
 * Human-only: agents must not set BACKLOG_ALLOW_PROMOTE. Brief required under _bmad-output/.
 */
import {
	ROOT,
	loadTasks,
	backlogEdit,
	setFrontmatterField,
	resolveBriefPath,
} from "./lib/backlog-tasks.mjs";

if (process.env.BACKLOG_ALLOW_PROMOTE !== "1") {
	console.error(
		[
			"Human-only command. Agents must not promote to Ready.",
			"Re-run with: BACKLOG_ALLOW_PROMOTE=1 bun run backlog:ready -- TASK-N --brief _bmad-output/.../brief.md",
		].join("\n"),
	);
	process.exit(2);
}

const args = process.argv.slice(2);
const taskId = args.find((a) => /^TASK-\d+/i.test(a))?.toUpperCase();
const briefIdx = args.indexOf("--brief");
const briefArg = briefIdx >= 0 ? args[briefIdx + 1] : null;

if (!taskId || !briefArg) {
	console.error(
		"Usage: bun run backlog:ready -- TASK-N --brief _bmad-output/.../brief.md",
	);
	process.exit(1);
}

const resolved = resolveBriefPath(briefArg);
if (!resolved.ok) {
	console.error(resolved.error);
	process.exit(1);
}

const task = loadTasks().find((t) => t.id.toUpperCase() === taskId);
if (!task) {
	console.error(`Task not found: ${taskId}`);
	process.exit(1);
}

setFrontmatterField(task.path, "brief", resolved.rel);
backlogEdit(taskId, ["-s", "Ready"]);

// Re-apply brief if backlog edit stripped custom frontmatter
setFrontmatterField(
	loadTasks().find((t) => t.id.toUpperCase() === taskId).path,
	"brief",
	resolved.rel,
);

console.log(`${taskId} → Ready`);
console.log(`  brief: ${resolved.rel}`);
console.log(`  cwd: ${ROOT}`);
