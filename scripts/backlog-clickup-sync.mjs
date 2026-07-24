#!/usr/bin/env bun
/**
 * Sync Backlog.md ↔ ClickUp (execution statuses only).
 *
 *   bun run clickup:sync           # push To Do / In Progress / Done → ClickUp
 *   bun run clickup:sync -- --pull # also pull ClickUp → Backlog
 *   bun run clickup:todo           # Ready → To Do, then sync (preferred promote)
 *
 * Draft / Brief / Ready never create ClickUp tasks.
 * Mapping: backlog/clickup-map.json
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import {
	ROOT,
	loadEnvFile,
	loadTasks,
	backlogEdit,
	SYNCABLE_STATUSES,
} from "./lib/backlog-tasks.mjs";

const MAP_PATH = join(ROOT, "backlog", "clickup-map.json");

const TO_CLICKUP_STATUS = {
	"To Do": "to do",
	"In Progress": "in progress",
	Done: "complete",
};
/** ClickUp → Backlog (Work maps to In Progress; no Backlog Work column) */
const FROM_CLICKUP_STATUS = {
	"to do": "To Do",
	work: "In Progress",
	"in progress": "In Progress",
	complete: "Done",
};
const TO_CLICKUP_PRIORITY = {
	high: 2,
	medium: 3,
	low: 4,
};

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const pull = args.has("--pull");

function buildMarkdown(task) {
	const parts = [
		`**Backlog ID:** \`${task.id}\``,
		"",
		task.description || "_No description._",
	];
	if (task.brief) {
		parts.push("", `**Brief:** \`${task.brief}\``);
	}
	if (task.acceptance) {
		parts.push("", "## Acceptance Criteria", "", task.acceptance);
	}
	parts.push("", `---`, `_Synced from Backlog.md (${task.id})_`);
	return parts.join("\n");
}

async function clickup(env, method, path, body) {
	const res = await fetch(`https://api.clickup.com/api/v2${path}`, {
		method,
		headers: {
			Authorization: env.CLICKUP_API_KEY,
			"Content-Type": "application/json",
		},
		body: body ? JSON.stringify(body) : undefined,
	});
	const text = await res.text();
	let json;
	try {
		json = text ? JSON.parse(text) : {};
	} catch {
		json = { raw: text };
	}
	if (!res.ok) {
		throw new Error(`${method} ${path} → ${res.status}: ${text.slice(0, 400)}`);
	}
	return json;
}

async function main() {
	const env = loadEnvFile();
	if (!env.CLICKUP_API_KEY) throw new Error("Missing CLICKUP_API_KEY in .env");
	if (!env.CLICKUP_LIST_ID) throw new Error("Missing CLICKUP_LIST_ID in .env");

	await mkdir(join(ROOT, "backlog"), { recursive: true });
	let map = {};
	try {
		map = JSON.parse(await readFile(MAP_PATH, "utf8"));
	} catch {
		map = {};
	}

	const all = loadTasks();
	const tasks = all.filter((t) => SYNCABLE_STATUSES.has(t.status));
	const skipped = all.filter((t) => !SYNCABLE_STATUSES.has(t.status));

	console.log(
		`${dryRun ? "[dry-run] " : ""}Pushing ${tasks.length} syncable task(s) → ClickUp list ${env.CLICKUP_LIST_ID}` +
			(skipped.length ? ` (skip ${skipped.length} Draft/Brief/Ready)` : ""),
	);

	for (const task of tasks) {
		const name = `[${task.id}] ${task.title}`;
		const status = TO_CLICKUP_STATUS[task.status] || "to do";
		const payload = {
			name,
			markdown_content: buildMarkdown(task),
			status,
		};
		if (task.priority && TO_CLICKUP_PRIORITY[task.priority]) {
			payload.priority = TO_CLICKUP_PRIORITY[task.priority];
		}

		const existing = map[task.id];
		if (existing?.clickupId) {
			console.log(`update ${task.id} → ${existing.clickupId} (${status})`);
			if (!dryRun) {
				await clickup(env, "PUT", `/task/${existing.clickupId}`, payload);
				map[task.id] = {
					...existing,
					title: task.title,
					status: task.status,
					updatedAt: new Date().toISOString(),
				};
			}
		} else if (task.status === "To Do") {
			console.log(`create ${task.id} (${status})`);
			if (!dryRun) {
				const created = await clickup(
					env,
					"POST",
					`/list/${env.CLICKUP_LIST_ID}/task`,
					payload,
				);
				const url = created.url || `https://app.clickup.com/t/${created.id}`;
				map[task.id] = {
					clickupId: created.id,
					url,
					title: task.title,
					status: task.status,
					updatedAt: new Date().toISOString(),
				};
				try {
					backlogEdit(task.id, ["--ref", url]);
				} catch (err) {
					console.warn(`warn: could not attach ClickUp ref on ${task.id}: ${err.message}`);
				}
			}
		} else {
			console.log(
				`skip create ${task.id} — status ${task.status} (only To Do creates new ClickUp tasks)`,
			);
		}
	}

	if (!dryRun) {
		await writeFile(MAP_PATH, `${JSON.stringify(map, null, 2)}\n`);
	}

	if (pull) {
		console.log(`${dryRun ? "[dry-run] " : ""}Pulling ClickUp statuses → Backlog`);
		for (const task of all) {
			const entry = map[task.id];
			if (!entry?.clickupId) continue;
			const remote = await clickup(env, "GET", `/task/${entry.clickupId}`);
			const remoteStatus = String(remote.status?.status || "").toLowerCase();
			const next = FROM_CLICKUP_STATUS[remoteStatus];
			if (!next || next === task.status) {
				console.log(`ok ${task.id} (${task.status})`);
				continue;
			}
			console.log(`pull ${task.id}: ${task.status} → ${next}`);
			if (!dryRun) {
				backlogEdit(task.id, ["-s", next]);
				map[task.id] = {
					...entry,
					status: next,
					updatedAt: new Date().toISOString(),
				};
			}
		}
		if (!dryRun) {
			await writeFile(MAP_PATH, `${JSON.stringify(map, null, 2)}\n`);
		}
	}

	console.log("done");
}

main().catch((err) => {
	console.error(err.message || err);
	process.exit(1);
});
