---
title: "Ship production releases with agent checks"
primaryKeyword: "ship production releases with agent checks"
intent: howto
slug: ship-production-releases-with-agent-checks
metaDescription: "ship production releases with agent checks using a fixed /prod skill: sync main, bump the version, run typecheck and build, commit only intended files, push, and open a PR humans merge while GitHub environment rules still gate deploy."
canonical: https://calvinmaighan.com/tips/secret-agent-tips/ship-production-releases-with-agent-checks.html
inBodyImage: "../../calvin-article-12.png"
ogImage: "https://calvinmaighan.com/calvin-article-12.png"
updatedAt: 2026-07-26
updatedHuman: July 26, 2026
summary: "Ship production releases with agent checks by giving the agent a fixed validate-then-publish script: sync main, pick a safe branch, bump the release, run typecheck and build, commit only intended files, push, and open a pull request for a human to merge. Agents never merge to production. Protection rules, reviewers, and environment secrets stay in GitHub where your team controls them."
standalone: false
kicker: ""
series: ""
nextHref: "./find-dead-code-with-fallow.html"
nextLabel: "Next article"
nextLocked: "true"
ctaAboveFold: "Book a call"
ctaEnd: "Want a production agent checklist wired to your CI and GitHub environments"
inBodyImageAlt: "Cover for tip 12: ship production releases with agent checks"
out: site/tips/secret-agent-tips/ship-production-releases-with-agent-checks.html
---

Ship production releases with agent checks, or watch a helpful model invent its own deploy process at 5pm on a Friday. It stages the whole dirty worktree, including a teammate's half-finished migration. It skips the version bump. It pushes to `main` because that is where the code needs to go. Every step reads as initiative in the transcript and as an incident in the channel.

I keep the fix in a skill named `/prod` for teams that already trust agents with code. The agent prepares the release in a fixed order and stops at the merge button, which stays human. Production day turns into a repeatable script with explicit stop conditions.

## Why production needs a script

Coding agents optimize for local green. Production optimizes for blast radius. The two diverge the moment a model decides that committing unrelated files or skipping a bump moves the task forward. Put the non-goals in the first screen of the skill: never merge the pull request, never commit secrets, never rewrite shared history without a written request.

GitHub's docs on [controlling deployments](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/control-deployments) and [managing environments](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment) cover the platform half: required reviewers, wait timers, branch filters, and environment secrets that stay locked until protection rules pass. Your skill assumes those controls exist and refuses to work around them.

## Establish scope before touching git

Every run starts with status and diff. Print the branch, the short status, the unstaged stats, and the staged stats. Ambiguous scope stops the run and asks a human, because agents that tidy neighboring work in progress create the worst conflicts of the week.

Fetch `origin/main` next and compare `origin/main..HEAD` so the agent knows which commits already belong to the branch. Then pick the smallest safe strategy:

- HEAD holds only intended commits ahead of main, so reuse the branch.
- Main already merged the old tip and new work sits dirty, so cut a named branch from the current state.
- History mixes release work with experiments, so branch from `origin/main` and cherry-pick the intended commits.
- Rebase conflicts look large, so stop and ask before rewriting anything.

That tree blocks the classic agent move of rebasing everything for a clean history and losing a coworker's commit. On release day, recoverable beats tidy.

The skill also forbids committing new work on `main` and forbids checking out main to publish. Releases leave from a reviewable branch that tracks the remote.

## Bump the release on purpose

Run the repo version script after a clean fetch. My default: patch bump when the branch sits on main's line of work, no second bump when the branch already carries one. Minor and major bumps need an explicit request in the prompt.

Keep `package.json` and the lockfile in the same pull request, and confirm the build log prints the version the package file claims. A mismatch means the bump failed or the wrong workspace package moved, and version drift forces support to guess which artifact reached production.

## Run the gates humans trust

Typecheck and production build are the floor. Most repos add lint and unit tests behind a single `check` script. The agent fixes failures caused by the intended change and re-runs until green, then reports unrelated dirty-tree failures rather than deleting a coworker's work.

Tie this to tip 11 on [catching AI code mistakes with lint](./catch-ai-code-mistakes-with-lint.html). A release skill that skips lint ships the empty-catch class of bug into the artifact.

Match CI exactly on the install command, prefer lockfile-strict installs, and pin third-party Actions to tags or SHAs. The agent never upgrades an Action mid-release unless the release goal names that upgrade.

## Review the exact commit surface

Before staging, run status, `git diff --check`, and the full diffs. Stage intended paths only. List the refuse patterns in the skill: `.env`, `.env.*`, credential JSON, PEM files, local dump directories. A secret in the diff stops the run and alerts a human, and rotation happens before any history rewrite.

Leave unrelated dirty files untouched and mention them in the pull request notes, so nobody assigns blame later to a file the release never owned. When a pre-commit hook rejects the commit, fix the issue and create a new commit. Amending something that already left the machine breaks the audit trail.

## Open the pull request and stop

Push with upstream tracking, check for an existing open pull request before creating a second one, and prefer updating the open one. Require four sections in the body and fail the skill when any sits empty:

- **Summary** of the user-visible change
- **Test plan** listing commands already run
- **Rollback** naming the previous tag, the flag, or the forward-fix
- **Risk** calling out migrations, auth, billing, or tenant boundaries

Migrations need their own note: expand and contract plan, lock duration risk, rollback path. A dark launch needs the flag key and its production default. Link the CI run when the host provides one, because humans merge faster when the evidence sits in the first screen.

The agent returns the URL and stops. Deploy jobs pointing at a production environment still wait on reviewers, as GitHub describes for [deployments and environments](https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments). Agent speed on the checklist, human judgment on the irreversible step.

## Write it like an incident runbook

Runbooks work because they remove improvisation under stress. Numbered steps, explicit stops, named commands, and no "use your judgment" line that invites a force push. Document the HTTPS fallback with `gh auth` once for the case where SSH fetch fails, then reuse it.

Keep the file short enough to sit in context and link out to longer deploy docs in the repo. Agents lose the plot when a skill file reads like a chapter.

## Ship the habit this week

Debut the skill on a boring Tuesday, never during an outage. Run it on a copy change or a dependency bump with tests green, time each step, and fix the wording wherever the agent hesitated. After three practice runs, a Friday release feels like a Tuesday with more eyes on it.

Tip 5 on [compressing agent context](./compress-agent-context-before-you-code.html) keeps the release docs in the window without flooding it. Tip 13 handles what accumulates between releases, where you [find dead code with fallow](./find-dead-code-with-fallow.html).

If your team needs this installed on a Next.js or TypeScript monorepo, [book a call](../../contact.html). More notes live in the [tips index](../../index.html#tips).

## Sources

- [Controlling deployments (GitHub)](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/control-deployments)
- [Using environments for deployment (GitHub)](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment)
- [Deployments and environments reference (GitHub)](https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments)

## FAQ

### Should an agent merge the production pull request?

No. The agent prepares the branch, passes the gates, and opens or updates the pull request. A human reviews and merges, which keeps approvals and rollback judgment with the team.

### What if the worktree has unrelated dirty files?

Leave them. Stage only the files that belong to the release, and stop to ask when the scope stays ambiguous.

### Do agents replace GitHub environment protection rules?

No. Required reviewers, deployment branches, and environment secrets still gate the job. The agent only prepares the evidence.

### When should the agent bump the version?

After a successful fetch of `origin/main` and before the production build, using the repo's version script, with the package and lockfile changes in the same pull request.
