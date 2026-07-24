#!/usr/bin/env bun
/**
 * Dedicated ngrok tunnel for ClickUp webhook → localhost:8787.
 * Domain: calvin-webhook.ngrok.app (separate from Deedee's cowbird).
 *
 *   bun run clickup:webhook
 *   bun run clickup:webhook:tunnel
 *
 * Doppler: CLICKUP_WEBHOOK_PUBLIC_URL=https://calvin-webhook.ngrok.app/webhooks/clickup
 */
import { spawnSync } from "node:child_process";

const DEFAULT_DOMAIN = "calvin-webhook.ngrok.app";
const DOMAIN = (
	process.env.CLICKUP_NGROK_DOMAIN || DEFAULT_DOMAIN
).replace(/^https?:\/\//, "").replace(/\/$/, "");
const LOCAL = "http://127.0.0.1:8787";

const publicUrl = `https://${DOMAIN}`;
console.log(
	[
		`[clickup-ngrok] ${publicUrl} → ${LOCAL}`,
		`  Webhook path: ${publicUrl}/webhooks/clickup`,
		"  Also run: bun run clickup:webhook",
	].join("\n"),
);

const r = spawnSync("ngrok", ["http", LOCAL, `--url=https://${DOMAIN}`], {
	stdio: "inherit",
});

if (r.error?.code === "ENOENT") {
	console.error(
		"[clickup-ngrok] Missing `ngrok` on PATH. brew install ngrok/ngrok/ngrok",
	);
	process.exit(127);
}

process.exit(r.status ?? 1);
