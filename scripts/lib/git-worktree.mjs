import { existsSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

/**
 * @param {string} cwd
 * @param {string[]} args
 * @param {{ allowFail?: boolean }} [opts]
 */
function git(cwd, args, opts = {}) {
	const r = spawnSync("git", args, {
		cwd,
		encoding: "utf8",
		stdio: ["ignore", "pipe", "pipe"],
	});
	if (!opts.allowFail && r.status !== 0) {
		const err = (r.stderr || r.stdout || "").trim();
		throw new Error(`git ${args.join(" ")} failed: ${err.slice(0, 500)}`);
	}
	return r;
}

function branchExists(root, branch) {
	const r = git(root, ["show-ref", "--verify", "--quiet", `refs/heads/${branch}`], {
		allowFail: true,
	});
	return r.status === 0;
}

function resolveBaseRef(root) {
	for (const ref of ["main", "master", "origin/main", "origin/master"]) {
		const r = git(root, ["rev-parse", "--verify", ref], { allowFail: true });
		if (r.status === 0) return ref;
	}
	return "HEAD";
}

function worktreePathInUse(root, path) {
	const r = git(root, ["worktree", "list", "--porcelain"], { allowFail: true });
	if (r.status !== 0) return false;
	return (r.stdout || "").includes(`worktree ${path}`);
}

/**
 * Ensure an isolated worktree on branch clickup/<backlogId> based off main.
 * Does not change the primary checkout.
 *
 * @param {string} root primary repo root
 * @param {string} backlogId e.g. TASK-3
 * @returns {{ path: string, branch: string, base: string, created: boolean }}
 */
export function ensureClickupWorktree(root, backlogId) {
	const id = String(backlogId).toUpperCase();
	const branch = `clickup/${id}`;
	const wtRoot = join(root, ".worktrees");
	const path = join(wtRoot, id);
	const base = resolveBaseRef(root);

	mkdirSync(wtRoot, { recursive: true });

	if (worktreePathInUse(root, path) && existsSync(path)) {
		git(path, ["checkout", branch], { allowFail: true });
		return { path, branch, base, created: false };
	}

	if (existsSync(path) && !worktreePathInUse(root, path)) {
		rmSync(path, { recursive: true, force: true });
	}

	if (branchExists(root, branch)) {
		git(root, ["worktree", "add", "--force", path, branch]);
	} else {
		git(root, ["worktree", "add", "-b", branch, path, base]);
	}

	return { path, branch, base, created: true };
}

/** @param {string} worktreePath */
export function summarizeWorktreeGit(worktreePath) {
	const branch =
		git(worktreePath, ["branch", "--show-current"], { allowFail: true }).stdout?.trim() ||
		"?";
	const status =
		git(worktreePath, ["status", "--short"], { allowFail: true }).stdout?.trim() ||
		"(clean)";
	const log =
		git(worktreePath, ["log", "--oneline", "-5"], { allowFail: true }).stdout?.trim() ||
		"(no commits)";
	const ahead = git(
		worktreePath,
		["rev-list", "--left-right", "--count", `origin/main...HEAD`],
		{ allowFail: true },
	).stdout?.trim();
	return { branch, status, log, ahead };
}
