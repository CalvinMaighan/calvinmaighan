#!/usr/bin/env bun
/**
 * Local ClickUp webhook receiver (ngrok / tunnel → :8787).
 *
 *   bun run clickup:webhook
 *
 * On taskStatusUpdated → status `work`:
 *   1. Queue job (backlog/webhook-jobs.jsonl)
 *   2. Ensure git worktree `.worktrees/<TASK>` on branch `clickup/<TASK>`
 *   3. Auto-run Cursor SDK agent in that worktree (primary checkout untouched)
 *   4. Max 3 agents in parallel; 1 agent per Backlog task
 *   5. Post live progress comments on the ClickUp task
 *
 * Requires .env: CLICKUP_WEBHOOK_SECRET, CLICKUP_API_KEY, CURSOR_API_KEY
 *
 * MCP: inline only — backlog, lean-ctx, codebase-memory-mcp (no user/project mcp.json).
 * Skills: `.cursor/skills` (synced on boot via sync-cursor-agent-surface.mjs).
 */
import { createHmac, timingSafeEqual } from "node:crypto";
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = join(import.meta.dir, "..");
const HOST = "127.0.0.1";
const PORT = Number(process.env.CLICKUP_WEBHOOK_PORT || 8787);
const PATH = "/webhooks/clickup";
const MAP_PATH = join(ROOT, "backlog", "clickup-map.json");
const SEEN_DIR = join(ROOT, "backlog", "webhook-seen");
const JOBS_PATH = join(ROOT, "backlog", "webhook-jobs.jsonl");
const TRIGGER_STATUS = "work";
const AGENT_STATUS = "in progress";
const MAX_PARALLEL = Number(process.env.CLICKUP_WEBHOOK_MAX_PARALLEL || 3);
const COMMENT_INTERVAL_MS = Number(process.env.CLICKUP_WEBHOOK_COMMENT_MS || 15000);
const COMMENT_MIN_CHARS = 120;

/** @type {Map<string, { backlogId: string, clickupTaskId: string }>} */
const runningByBacklog = new Map();
/** @type {Array<{ backlogId: string, clickupTaskId: string, title: string|null }>} */
const waitQueue = [];

function loadEnvFile() {
	const envPath = join(ROOT, ".env");
	if (!existsSync(envPath)) return;
	const text = readFileSync(envPath, "utf8");
	for (const line of text.split(/\n/)) {
		if (!line || line.startsWith("#") || !line.includes("=")) continue;
		const i = line.indexOf("=");
		const key = line.slice(0, i);
		let val = line.slice(i + 1).trim();
		if (
			(val.startsWith('"') && val.endsWith('"')) ||
			(val.startsWith("'") && val.endsWith("'"))
		) {
			val = val.slice(1, -1);
		}
		if (process.env[key] === undefined) process.env[key] = val;
	}
}

function verifySignature(rawBody, signature, secret) {
	if (!signature || !secret) return false;
	const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
	const a = Buffer.from(expected, "utf8");
	const b = Buffer.from(String(signature), "utf8");
	if (a.length !== b.length) return false;
	return timingSafeEqual(a, b);
}

function loadMap() {
	try {
		return JSON.parse(readFileSync(MAP_PATH, "utf8"));
	} catch {
		return {};
	}
}

function backlogIdFromMap(clickupId) {
	const map = loadMap();
	for (const [taskId, entry] of Object.entries(map)) {
		if (entry?.clickupId === clickupId) return taskId;
	}
	return null;
}

function backlogIdFromTitle(title) {
	const m = String(title || "").match(/\[(TASK-\d+(?:\.\d+)?)\]/i);
	return m ? m[1].toUpperCase() : null;
}

async function clickupFetch(path, { method = "GET", body } = {}) {
	const key = process.env.CLICKUP_API_KEY;
	if (!key) throw new Error("CLICKUP_API_KEY missing");
	const res = await fetch(`https://api.clickup.com/api/v2${path}`, {
		method,
		headers: {
			Authorization: key,
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
		throw new Error(`${method} ${path} → ${res.status}: ${text.slice(0, 300)}`);
	}
	return json;
}

async function fetchClickUpTask(taskId) {
	return clickupFetch(`/task/${taskId}`);
}

async function clickupComment(taskId, commentText) {
	const text = String(commentText || "").trim();
	if (!text) return;
	await clickupFetch(`/task/${taskId}/comment`, {
		method: "POST",
		body: { comment_text: text.slice(0, 4000) },
	});
}

async function clickupSetStatus(taskId, status) {
	await clickupFetch(`/task/${taskId}`, {
		method: "PUT",
		body: { status },
	});
}

function alreadySeen(key) {
	const safe = key.replace(/[^a-zA-Z0-9:_-]/g, "_");
	return existsSync(join(SEEN_DIR, `${safe}.seen`));
}

function markSeen(key) {
	mkdirSync(SEEN_DIR, { recursive: true });
	const safe = key.replace(/[^a-zA-Z0-9:_-]/g, "_");
	writeFileSync(join(SEEN_DIR, `${safe}.seen`), `${new Date().toISOString()}\n`);
}

function appendJob(job) {
	mkdirSync(join(ROOT, "backlog"), { recursive: true });
	appendFileSync(JOBS_PATH, `${JSON.stringify(job)}\n`);
}

function statusTransition(payload) {
	const items = Array.isArray(payload.history_items) ? payload.history_items : [];
	for (const item of items) {
		if (item?.field !== "status") continue;
		const before = String(item.before?.status || "").toLowerCase();
		const after = String(item.after?.status || "").toLowerCase();
		if (after) return { before, after };
	}
	return null;
}

function statusAfterIsWork(payload) {
	const t = statusTransition(payload);
	return t?.after === TRIGGER_STATUS;
}

/** ClickUp complete — sync Backlog Done (no agent). */
function statusAfterIsComplete(payload) {
	const t = statusTransition(payload);
	return t?.after === "complete";
}

function historyItemId(payload) {
	const items = Array.isArray(payload.history_items) ? payload.history_items : [];
	const statusItem = items.find((i) => i?.field === "status");
	return String(statusItem?.id || items[0]?.id || "unknown");
}

async function syncBacklogDone(backlogId, clickupTaskId) {
	const { backlogEdit } = await import("./lib/backlog-tasks.mjs");
	backlogEdit(backlogId, ["-s", "Done"]);
	try {
		if (existsSync(MAP_PATH)) {
			const map = JSON.parse(readFileSync(MAP_PATH, "utf8"));
			if (map[backlogId]) {
				map[backlogId] = {
					...map[backlogId],
					status: "Done",
					updatedAt: new Date().toISOString(),
				};
				writeFileSync(MAP_PATH, `${JSON.stringify(map, null, 2)}\n`);
			}
		}
	} catch (err) {
		console.warn("map update failed:", err.message || err);
	}
	try {
		await clickupComment(
			clickupTaskId,
			`✅ Synced Backlog \`${backlogId}\` → **Done** (ClickUp complete).`,
		);
	} catch {
		/* ignore */
	}
	console.log("synced Done", backlogId, clickupTaskId);
}

async function resolveBacklogId(clickupTaskId) {
	const fromMap = backlogIdFromMap(clickupTaskId);
	if (fromMap) return { backlogId: fromMap, source: "map" };
	const remote = await fetchClickUpTask(clickupTaskId);
	const fromTitle = backlogIdFromTitle(remote.name);
	if (fromTitle) return { backlogId: fromTitle, source: "title", title: remote.name };
	return { backlogId: null, source: "none", title: remote.name };
}

function modelSelection() {
	return {
		id: process.env.CURSOR_MODEL_ID || "grok-4.5",
		params: [
			{ id: "effort", value: process.env.CURSOR_MODEL_EFFORT || "high" },
			{ id: "fast", value: process.env.CURSOR_MODEL_FAST || "false" },
		],
	};
}

function enqueueAgentJob(job) {
	const { backlogId, clickupTaskId } = job;
	if (runningByBacklog.has(backlogId)) {
		console.log("skip enqueue — already running", backlogId);
		return { started: false, reason: "already_running" };
	}
	if (waitQueue.some((j) => j.backlogId === backlogId)) {
		console.log("skip enqueue — already queued", backlogId);
		return { started: false, reason: "already_queued" };
	}
	waitQueue.push(job);
	pumpQueue();
	return { started: true, reason: "queued_or_started" };
}

function pumpQueue() {
	while (runningByBacklog.size < MAX_PARALLEL && waitQueue.length > 0) {
		const idx = waitQueue.findIndex((j) => !runningByBacklog.has(j.backlogId));
		if (idx < 0) break;
		const [job] = waitQueue.splice(idx, 1);
		runningByBacklog.set(job.backlogId, job);
		runCursorAgent(job)
			.catch((err) => console.error("agent failed", job.backlogId, err.message || err))
			.finally(() => {
				runningByBacklog.delete(job.backlogId);
				pumpQueue();
			});
	}
}

async function runCursorAgent({ backlogId, clickupTaskId }) {
	const cursorKey = process.env.CURSOR_API_KEY;
	if (!cursorKey) throw new Error("CURSOR_API_KEY missing");

	const model = modelSelection();
	console.log("agent start", backlogId, clickupTaskId, JSON.stringify(model));

	try {
		await clickupSetStatus(clickupTaskId, AGENT_STATUS);
	} catch (err) {
		console.warn("status→in progress failed:", err.message || err);
	}

	// Sync both sides on Work trigger: ClickUp in progress + Backlog In Progress
	try {
		const { backlogEdit } = await import("./lib/backlog-tasks.mjs");
		backlogEdit(backlogId, ["-s", "In Progress"]);
	} catch (err) {
		console.warn("backlog → In Progress failed:", err.message || err);
	}

	const { ensureClickupWorktree, summarizeWorktreeGit } = await import(
		"./lib/git-worktree.mjs"
	);
	let worktree;
	try {
		worktree = ensureClickupWorktree(ROOT, backlogId);
		console.log(
			"worktree",
			worktree.path,
			"branch",
			worktree.branch,
			worktree.created ? "(created)" : "(reused)",
		);
	} catch (err) {
		const msg = err instanceof Error ? err.message : String(err);
		try {
			await clickupComment(
				clickupTaskId,
				`❌ Could not create git worktree for \`${backlogId}\`:\n${msg.slice(0, 1500)}`,
			);
		} catch {
			/* ignore */
		}
		throw err;
	}

	try {
		await clickupComment(
			clickupTaskId,
			[
				`🤖 Cursor agent started on \`${backlogId}\` (${model.id}, effort=${model.params.find((p) => p.id === "effort")?.value}).`,
				`Branch: \`${worktree.branch}\``,
				`Worktree: \`${worktree.path}\` (your main checkout is untouched)`,
				`Live updates will post here.`,
			].join("\n"),
		);
	} catch (err) {
		console.warn("start comment failed:", err.message || err);
	}

	const { Agent } = await import("@cursor/sdk");
	const prompt = [
		`Work Backlog.md task ${backlogId} for this repo.`,
		`You are in an isolated git WORKTREE. cwd=${worktree.path}. Branch=${worktree.branch} (created from ${worktree.base}).`,
		`The human's primary checkout stays on their branch — do NOT operate on the parent repo path ${ROOT} for edits.`,
		`Stay on ${worktree.branch}. Implement here. When work is reviewable: git add/commit on THIS branch with a clear message.`,
		`Optional: git push -u origin HEAD for this feature branch only. NEVER merge to main, NEVER push main, NEVER force-push.`,
		`When finished: leave commits on ${worktree.branch}; summarize files changed + commit SHAs; suggest: gh pr create --base main --head ${worktree.branch}`,
		`Funnel: Draft→Brief→Ready→To Do (ClickUp)→Work(agent). Never promote Ready/To Do (no backlog:ready, clickup:todo, BACKLOG_ALLOW_PROMOTE). Do not mark Done — human checks ACs.`,
		`Follow the /backlog work workflow: confirm In Progress, write a plan, implement within scope.`,
		`MCP available (only these three): backlog, lean-ctx, codebase-memory-mcp. Prefer backlog MCP or backlog CLI; use lean-ctx / skills when relevant.`,
		`Do not hand-edit files under backlog/; use the backlog CLI or backlog MCP (cwd is this worktree).`,
		`Task id: ${backlogId}`,
		`ClickUp task: ${clickupTaskId}`,
	].join(" ");

	// Empty settingSources → ignore ~/.cursor/mcp.json and project mcp.json.
	// Inline mcpServers is the only MCP surface for ClickUp workers.
	const agent = await Agent.create({
		apiKey: cursorKey,
		model,
		local: {
			cwd: worktree.path,
			settingSources: [],
		},
		mcpServers: {
			backlog: {
				type: "stdio",
				command: "backlog",
				args: ["mcp", "start"],
				cwd: worktree.path,
			},
			"lean-ctx": {
				type: "stdio",
				command: "/opt/homebrew/bin/lean-ctx",
			},
			"codebase-memory-mcp": {
				type: "stdio",
				command: "/Users/calvin/.local/bin/codebase-memory-mcp",
			},
		},
	});

	let buffer = "";
	let lastCommentAt = 0;
	let lastPosted = "";

	async function flushComment(force = false) {
		const text = buffer.trim();
		if (!text) return;
		if (!force && text.length < COMMENT_MIN_CHARS) return;
		if (!force && Date.now() - lastCommentAt < COMMENT_INTERVAL_MS) return;
		if (text === lastPosted) {
			buffer = "";
			return;
		}
		const chunk = text.length > 3500 ? `…\n${text.slice(-3500)}` : text;
		try {
			await clickupComment(clickupTaskId, `🤖 Progress (\`${backlogId}\`):\n\n${chunk}`);
			lastCommentAt = Date.now();
			lastPosted = text;
			buffer = "";
		} catch (err) {
			console.warn("progress comment failed:", err.message || err);
		}
	}

	try {
		const run = await agent.send(prompt);
		for await (const event of run.stream()) {
			if (event.type !== "assistant") continue;
			const content = event.message?.content;
			if (!Array.isArray(content)) continue;
			for (const block of content) {
				if (block?.type === "text" && block.text) {
					buffer += block.text;
					await flushComment(false);
				}
			}
		}
		const result = await run.wait();
		await flushComment(true);

		const summary =
			typeof result?.result === "string"
				? result.result.slice(0, 2500)
				: `status=${result?.status || "unknown"}`;
		const gitInfo = summarizeWorktreeGit(worktree.path);
		await clickupComment(
			clickupTaskId,
			[
				`✅ Cursor agent finished \`${backlogId}\` (status: ${result?.status || "unknown"}).`,
				``,
				`**Branch:** \`${gitInfo.branch}\``,
				`**Worktree:** \`${worktree.path}\``,
				`**Status:**`,
				"```",
				gitInfo.status,
				"```",
				`**Recent commits:**`,
				"```",
				gitInfo.log,
				"```",
				`Human next: review worktree / push branch, then \`gh pr create --base main --head ${worktree.branch}\`. Do not Done until ACs checked.`,
				``,
				summary,
			].join("\n"),
		);
		console.log("agent done", backlogId, result?.status, gitInfo.branch);
		return { status: result?.status, result: result?.result };
	} catch (err) {
		const msg = err instanceof Error ? err.message : String(err);
		try {
			await clickupComment(clickupTaskId, `❌ Cursor agent failed on \`${backlogId}\`:\n${msg.slice(0, 1500)}`);
		} catch {
			/* ignore */
		}
		throw err;
	} finally {
		try {
			await agent[Symbol.asyncDispose]();
		} catch {
			/* ignore */
		}
	}
}

loadEnvFile();

function syncAgentSurface() {
	const script = join(ROOT, "scripts", "sync-cursor-agent-surface.mjs");
	const r = spawnSync(process.execPath, [script], {
		cwd: ROOT,
		encoding: "utf8",
		stdio: ["ignore", "pipe", "pipe"],
	});
	const out = `${r.stdout || ""}${r.stderr || ""}`.trim();
	if (out) console.log(out);
	if (r.status !== 0) {
		console.warn("warn: skill surface sync failed — SDK may miss .cursor/skills");
	}
}

syncAgentSurface();

const secret = process.env.CLICKUP_WEBHOOK_SECRET || "";
const apiKey = process.env.CLICKUP_API_KEY || "";

if (!secret) {
	console.warn("warn: CLICKUP_WEBHOOK_SECRET unset — signature checks will fail until set");
}
if (!apiKey) {
	console.warn("warn: CLICKUP_API_KEY unset — ClickUp updates / resolve will fail");
}
if (!process.env.CURSOR_API_KEY) {
	console.warn("warn: CURSOR_API_KEY unset — agents cannot start");
}

const server = Bun.serve({
	hostname: HOST,
	port: PORT,
	async fetch(req) {
		const url = new URL(req.url);
		if (req.method === "GET" && (url.pathname === "/" || url.pathname === "/health")) {
			return Response.json({
				ok: true,
				path: PATH,
				triggers: { work: "agent", complete: "backlog_done" },
				maxParallel: MAX_PARALLEL,
				running: [...runningByBacklog.keys()],
				queued: waitQueue.map((j) => j.backlogId),
				model: modelSelection(),
			});
		}
		if (req.method !== "POST" || url.pathname !== PATH) {
			return new Response("Not Found", { status: 404 });
		}

		const rawBody = await req.text();
		const signature = req.headers.get("x-signature") || "";
		if (!verifySignature(rawBody, signature, secret)) {
			console.error("reject: bad signature");
			return new Response("Unauthorized", { status: 401 });
		}

		let payload;
		try {
			payload = JSON.parse(rawBody);
		} catch {
			return new Response("Bad Request", { status: 400 });
		}

		if (payload.event !== "taskStatusUpdated") {
			return Response.json({ ok: true, ignored: true, reason: "event" });
		}

		const isWork = statusAfterIsWork(payload);
		const isComplete = statusAfterIsComplete(payload);
		if (!isWork && !isComplete) {
			return Response.json({ ok: true, ignored: true, reason: "status" });
		}

		const clickupTaskId = String(payload.task_id || "");
		const webhookId = String(payload.webhook_id || "unknown");
		const histId = historyItemId(payload);
		const idempotencyKey = `${webhookId}:${histId}`;

		if (alreadySeen(idempotencyKey)) {
			return Response.json({ ok: true, duplicate: true });
		}
		markSeen(idempotencyKey);

		let resolved;
		try {
			resolved = await resolveBacklogId(clickupTaskId);
		} catch (err) {
			console.error("resolve failed:", err.message || err);
			return Response.json({ ok: false, error: "resolve_failed" }, { status: 500 });
		}

		const transition = statusTransition(payload);
		const job = {
			at: new Date().toISOString(),
			event: payload.event,
			action: isComplete ? "complete_sync" : "work_agent",
			transition,
			clickupTaskId,
			backlogId: resolved.backlogId,
			resolveSource: resolved.source,
			title: resolved.title || null,
			idempotencyKey,
		};
		appendJob(job);
		console.log("queued", JSON.stringify(job));

		if (!resolved.backlogId) {
			console.warn("no Backlog id for ClickUp task", clickupTaskId, resolved.title);
			try {
				await clickupComment(
					clickupTaskId,
					isComplete
						? "⚠️ ClickUp → complete, but no Backlog TASK id found (map or `[TASK-N]` in title). Not synced."
						: "⚠️ Webhook received `work`, but no Backlog TASK id found (map or `[TASK-N]` in title). Agent not started.",
				);
			} catch {
				/* ignore */
			}
			return Response.json({ ok: true, backlogId: null, action: job.action });
		}

		if (isComplete) {
			try {
				await syncBacklogDone(resolved.backlogId, clickupTaskId);
			} catch (err) {
				console.error("complete sync failed:", err.message || err);
				return Response.json(
					{ ok: false, error: "complete_sync_failed" },
					{ status: 500 },
				);
			}
			return Response.json({
				ok: true,
				action: "complete_sync",
				backlogId: resolved.backlogId,
				backlogStatus: "Done",
			});
		}

		const enqueue = enqueueAgentJob({
			backlogId: resolved.backlogId,
			clickupTaskId,
			title: resolved.title || null,
		});

		return Response.json({
			ok: true,
			action: "work_agent",
			queued: true,
			backlogId: resolved.backlogId,
			agent: enqueue,
			running: [...runningByBacklog.keys()],
			waiting: waitQueue.map((j) => j.backlogId),
		});
	},
});

console.log(`ClickUp webhook listening http://${HOST}:${PORT}${PATH}`);
console.log(`triggers: work → agent | complete → Backlog Done`);
console.log(`auto-run agents: max ${MAX_PARALLEL} parallel, 1 per task → ClickUp live comments`);
console.log(`health: http://${HOST}:${PORT}/health`);
