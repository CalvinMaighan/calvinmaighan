#!/usr/bin/env bun
/**
 * Register ClickUp taskStatusUpdated webhook for the calvinmaighan list.
 *
 *   bun run clickup:webhook:register
 *
 * Requires .env: CLICKUP_API_KEY, CLICKUP_TEAM_ID, CLICKUP_LIST_ID,
 * CLICKUP_WEBHOOK_PUBLIC_URL (e.g. https://clickup.example.com/webhooks/clickup)
 *
 * Prints webhook id + instructs adding CLICKUP_WEBHOOK_SECRET to Doppler.
 * If doppler CLI is available, offers to set the secret on project calvinmaighan/dev.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = join(import.meta.dir, "..");
const DOPPLER_PROJECT = "calvinmaighan";
const DOPPLER_CONFIG = "dev";

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

loadEnvFile();

const apiKey = process.env.CLICKUP_API_KEY;
const teamId = process.env.CLICKUP_TEAM_ID;
const listId = process.env.CLICKUP_LIST_ID;
const endpoint = process.env.CLICKUP_WEBHOOK_PUBLIC_URL;

if (!apiKey || !teamId || !listId) {
	console.error("Missing CLICKUP_API_KEY, CLICKUP_TEAM_ID, or CLICKUP_LIST_ID — run bun run env");
	process.exit(1);
}
if (!endpoint) {
	console.error(
		"Missing CLICKUP_WEBHOOK_PUBLIC_URL — set in Doppler to your public tunnel URL, e.g.\n" +
			"  https://xxxx.ngrok-free.app/webhooks/clickup",
	);
	process.exit(1);
}
if (!endpoint.startsWith("https://")) {
	console.error("CLICKUP_WEBHOOK_PUBLIC_URL must be https://…");
	process.exit(1);
}

const res = await fetch(`https://api.clickup.com/api/v2/team/${teamId}/webhook`, {
	method: "POST",
	headers: {
		Authorization: apiKey,
		"Content-Type": "application/json",
	},
	body: JSON.stringify({
		endpoint,
		events: ["taskStatusUpdated"],
		list_id: Number(listId) || listId,
	}),
});

const body = await res.json();
if (!res.ok) {
	console.error("Create webhook failed:", res.status, JSON.stringify(body).slice(0, 500));
	process.exit(1);
}

const webhook = body.webhook || body;
const id = webhook.id;
const secret = webhook.secret;

console.log("Registered ClickUp webhook");
console.log("  id:      ", id);
console.log("  endpoint:", endpoint);
console.log("  events:  ", "taskStatusUpdated");
console.log("  list_id: ", listId);

const useDoppler = process.argv.includes("--doppler");
if (secret && useDoppler) {
	const set = spawnSync(
		"doppler",
		[
			"secrets",
			"set",
			`CLICKUP_WEBHOOK_SECRET=${secret}`,
			`CLICKUP_WEBHOOK_PUBLIC_URL=${endpoint}`,
			"--project",
			DOPPLER_PROJECT,
			"--config",
			DOPPLER_CONFIG,
		],
		{ cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
	);
	if (set.status !== 0) {
		console.error("doppler secrets set failed:", (set.stderr || set.stdout || "").trim());
		console.error("Set the secret manually in the Doppler dashboard.");
		process.exit(1);
	}
	console.log("");
	console.log("Wrote CLICKUP_WEBHOOK_SECRET + CLICKUP_WEBHOOK_PUBLIC_URL to Doppler (values not printed).");
	console.log("Then: bun run env && bun run clickup:webhook");
} else if (secret) {
	console.log("");
	console.log("Add to Doppler (project calvinmaighan / config dev), then bun run env:");
	console.log(`  CLICKUP_WEBHOOK_SECRET=${secret}`);
	console.log(`  CLICKUP_WEBHOOK_PUBLIC_URL=${endpoint}`);
	console.log("");
	console.log("Or re-run without printing the secret:");
	console.log("  bun run clickup:webhook:register -- --doppler");
}
