import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

export const ROOT = join(import.meta.dir, "../..");
export const TASKS_DIR = join(ROOT, "backlog", "tasks");

export const PLANNING_STATUSES = new Set(["Draft", "Brief", "Ready"]);
export const SYNCABLE_STATUSES = new Set(["To Do", "In Progress", "Done"]);

export function loadEnvFile(envPath = join(ROOT, ".env")) {
	if (!existsSync(envPath)) return {};
	const out = {};
	for (const line of readFileSync(envPath, "utf8").split(/\n/)) {
		if (!line || line.startsWith("#") || !line.includes("=")) continue;
		const i = line.indexOf("=");
		out[line.slice(0, i)] = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
	}
	return out;
}

export function parseFrontmatter(raw) {
	const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
	if (!m) return null;
	const meta = {};
	for (const line of m[1].split(/\n/)) {
		const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
		if (!kv) continue;
		let v = kv[2].trim();
		if (
			(v.startsWith("'") && v.endsWith("'")) ||
			(v.startsWith('"') && v.endsWith('"'))
		) {
			v = v.slice(1, -1);
		}
		if (v === "[]") v = [];
		meta[kv[1]] = v;
	}
	return { meta, body: m[2], fmRaw: m[1] };
}

export function listTaskFiles() {
	if (!existsSync(TASKS_DIR)) return [];
	return readdirSync(TASKS_DIR).filter((f) => f.endsWith(".md"));
}

/** @returns {Array<{ id: string, title: string, status: string, priority: string, brief: string, file: string, path: string, description: string, acceptance: string, raw: string }>} */
export function loadTasks() {
	const tasks = [];
	for (const file of listTaskFiles()) {
		const path = join(TASKS_DIR, file);
		const raw = readFileSync(path, "utf8");
		const parsed = parseFrontmatter(raw);
		if (!parsed?.meta?.id) continue;
		const description =
			section(parsed.body, "Description") ||
			parsed.body.split(/\n## /)[0]?.replace(/^## Description\n/i, "").trim() ||
			"";
		const acceptance = (() => {
			const m = parsed.body.match(
				/## Acceptance Criteria[\s\S]*?<!-- AC:BEGIN -->\n([\s\S]*?)<!-- AC:END -->/,
			);
			return m ? m[1].trim() : section(parsed.body, "Acceptance Criteria");
		})();
		tasks.push({
			id: String(parsed.meta.id),
			title: String(parsed.meta.title || parsed.meta.id),
			status: String(parsed.meta.status || "Draft"),
			priority: String(parsed.meta.priority || "").toLowerCase(),
			brief: String(parsed.meta.brief || "").trim(),
			file,
			path,
			description,
			acceptance,
			raw,
		});
	}
	return tasks;
}

function section(body, name) {
	const re = new RegExp(
		`## ${name}\\s*\\n(?:<!-- SECTION:${name.toUpperCase().replace(/ /g, "_")}:BEGIN -->\\n)?([\\s\\S]*?)(?:<!-- SECTION:${name.toUpperCase().replace(/ /g, "_")}:END -->|(?=\\n## )|$)`,
		"i",
	);
	const m = body.match(re);
	return m ? m[1].trim() : "";
}

export function backlogEdit(taskId, flags) {
	const result = spawnSync("backlog", ["task", "edit", taskId, ...flags, "--plain"], {
		cwd: ROOT,
		encoding: "utf8",
	});
	if (result.status !== 0) {
		throw new Error(
			`backlog task edit ${taskId} failed: ${result.stderr || result.stdout}`,
		);
	}
}

/** Set/replace a simple scalar frontmatter key (preserves rest of file). */
export function setFrontmatterField(taskPath, key, value) {
	const raw = readFileSync(taskPath, "utf8");
	const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
	if (!m) throw new Error(`no frontmatter: ${taskPath}`);
	const lines = m[1].split(/\n/);
	let found = false;
	const next = lines.map((line) => {
		if (line.match(new RegExp(`^${key}:`))) {
			found = true;
			return `${key}: '${String(value).replace(/'/g, "''")}'`;
		}
		return line;
	});
	if (!found) next.push(`${key}: '${String(value).replace(/'/g, "''")}'`);
	writeFileSync(taskPath, `---\n${next.join("\n")}\n---\n${m[2]}`);
}

export function resolveBriefPath(briefRel) {
	const cleaned = briefRel.replace(/^\.\//, "").replace(/^\/+/, "");
	if (!cleaned.startsWith("_bmad-output/")) {
		return {
			ok: false,
			error: `brief must be under _bmad-output/ (got ${briefRel})`,
		};
	}
	const abs = join(ROOT, cleaned);
	if (!existsSync(abs)) {
		return { ok: false, error: `brief file missing: ${cleaned}` };
	}
	return { ok: true, rel: cleaned, abs };
}
