#!/usr/bin/env bun
/**
 * Archive Backlog tasks whose ClickUp counterparts were deleted; clean the map.
 *
 *   bun run clickup:prune
 *   bun run clickup:prune -- --dry-run
 *
 * For each entry in backlog/clickup-map.json: GET ClickUp task → 404 (gone)
 * → `backlog task archive TASK-N` (if still active) + remove map row.
 */
import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { ROOT, loadEnvFile, loadTasks } from "./lib/backlog-tasks.mjs";

const MAP_PATH = join(ROOT, "backlog", "clickup-map.json");
const dryRun = process.argv.includes("--dry-run");

async function clickupGet(env, clickupId) {
	const res = await fetch(`https://api.clickup.com/api/v2/task/${clickupId}`, {
		headers: { Authorization: env.CLICKUP_API_KEY },
	});
	const text = await res.text();
	let json = {};
	try {
		json = text ? JSON.parse(text) : {};
	} catch {
		json = { raw: text };
	}
	return { status: res.status, json };
}

function backlogArchive(taskId) {
	const r = spawnSync("backlog", ["task", "archive", taskId, "--plain"], {
		cwd: ROOT,
		encoding: "utf8",
	});
	if (r.status !== 0) {
		throw new Error(
			`backlog task archive ${taskId} failed: ${(r.stderr || r.stdout || "").trim()}`,
		);
	}
}

function isGone(httpStatus, json) {
	if (httpStatus === 404) return true;
	// Some ClickUp responses mark deleted tasks without a hard 404
	if (json?.err === "Task not found" || json?.ECODE === "ITEM_023") return true;
	return false;
}

async function main() {
	const env = loadEnvFile();
	if (!env.CLICKUP_API_KEY) throw new Error("Missing CLICKUP_API_KEY in .env");

	if (!existsSync(MAP_PATH)) {
		console.log("No clickup-map.json — nothing to prune.");
		return;
	}

	let map = JSON.parse(await readFile(MAP_PATH, "utf8"));
	const activeIds = new Set(loadTasks().map((t) => t.id.toUpperCase()));
	const ids = Object.keys(map);
	if (ids.length === 0) {
		console.log("Map empty — nothing to prune.");
		return;
	}

	console.log(
		`${dryRun ? "[dry-run] " : ""}Checking ${ids.length} mapped task(s) against ClickUp…`,
	);

	let pruned = 0;
	let kept = 0;
	let errors = 0;

	for (const id of ids) {
		const entry = map[id];
		const clickupId = entry?.clickupId;
		if (!clickupId) {
			console.log(`skip ${id} — no clickupId`);
			continue;
		}

		const { status, json } = await clickupGet(env, clickupId);
		if (!isGone(status, json)) {
			if (status >= 400) {
				console.error(`error ${id} (${clickupId}): HTTP ${status}`);
				errors++;
				continue;
			}
			console.log(`ok ${id} → ${clickupId}`);
			kept++;
			continue;
		}

		const stillActive = activeIds.has(id.toUpperCase());
		console.log(
			`gone ${id} → ${clickupId}` +
				(stillActive ? " — archive Backlog" : " — map only (already inactive)"),
		);

		if (!dryRun) {
			if (stillActive) {
				try {
					backlogArchive(id);
				} catch (err) {
					console.error(`  archive failed: ${err.message}`);
					errors++;
					continue;
				}
			}
			delete map[id];
			pruned++;
		} else {
			pruned++;
		}
	}

	if (!dryRun && pruned > 0) {
		await writeFile(MAP_PATH, `${JSON.stringify(map, null, 2)}\n`);
	}

	console.log(
		`done — pruned ${pruned}, kept ${kept}` +
			(errors ? `, errors ${errors}` : "") +
			(dryRun ? " (dry-run)" : ""),
	);
	if (errors) process.exit(1);
}

main().catch((err) => {
	console.error(err.message || err);
	process.exit(1);
});
