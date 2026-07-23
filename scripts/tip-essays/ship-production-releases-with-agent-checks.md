---
title: "Ship production releases with agent checks"
primaryKeyword: "ship production releases with agent checks"
intent: howto
slug: ship-production-releases-with-agent-checks
metaDescription: "ship production releases with agent checks using a fixed /prod skill: sync main, bump the version, run typecheck and build, commit only intended files, push, and open a PR humans merge while GitHub environment rules still gate deploy."
canonical: https://calvinmaighan.com/tips/secret-agent-tips/ship-production-releases-with-agent-checks.html
updatedAt: 2026-07-22
updatedHuman: July 22, 2026
summary: "Ship production releases with agent checks by giving the agent a fixed validate-then-publish script: sync main, pick a safe branch, bump the release, run typecheck and build, commit only intended files, push, and open a PR for human merge. Agents must never merge to production. Protection rules, reviewers, and environment secrets stay in GitHub."
standalone: false
kicker: ""
series: ""
nextHref: "./write-seo-articles-agents-can-follow.html"
nextLabel: "Next tip"
nextLocked: "true"
ctaAboveFold: "Book a call"
ctaEnd: "Want a production agent checklist wired to your CI and GitHub environments"
inBodyImageAlt: "Cover for tip 13: ship production releases with agent checks"
out: site/tips/secret-agent-tips/ship-production-releases-with-agent-checks.html
---

Ship production releases with agent checks by turning deploy into a skill with a fixed order: inspect the worktree, sync with `origin/main`, choose the smallest safe branch strategy, bump the app version, run typecheck and production build, commit only intended files, push, and open a pull request for a human to merge. The agent prepares the release. The team still owns the merge button.

I keep that workflow in a skill named `/prod` on product teams that already trust agents for coding. Without it, models invent deploy steps, force-push, or commit half the dirty worktree. With it, production day looks like a repeatable script with clear stop conditions.

## Why production needs a skill, not a vibe

Coding agents optimize for local green. Production optimizes for blast radius. Those goals diverge when the model “helps” by committing unrelated files, skipping the version bump, or pushing straight to `main`. A production skill states the non-goals in the first screen: never merge the PR, never commit secrets, never rewrite shared history unless a human asked in writing.

GitHub’s own docs on [controlling deployments](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/control-deployments) and [managing environments](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment) describe the platform side: required reviewers, wait timers, branch filters, and environment secrets that stay locked until protection rules pass. Your agent skill should assume those controls exist and refuse to bypass them.

## Step 1: Establish scope before you touch git

Start every `/prod` run with status and diff commands. Print the branch, short status, unstaged diff stats, and staged diff stats. If the intended release scope stays unclear, stop and ask. Agents that “clean up” neighboring WIP create the worst merge conflicts of the week.

Fetch `origin/main` next. Compare `origin/main..HEAD` so the agent knows which commits already belong on the branch. Prefer the smallest safe strategy: reuse the current branch when its commits belong in the PR; cut a fresh branch from current state when main already absorbed the old work; cherry-pick onto a branch from `origin/main` when the history mixes unrelated commits.

### Never publish from a casual main checkout

The skill forbids committing new work on `main`. It also forbids checking out main only to publish. Publishing happens from a reviewable branch that tracks remote.

## Step 2: Bump the release on purpose

After a clean fetch, run the repo version bump script. Default behavior on my teams: patch bump when the branch equals main’s line of work; skip a second bump when the branch already sits ahead with a bump. Rare minor or major bumps need an explicit human request in the prompt.

Include `package.json` and the lockfile in the same PR. Build logs should print the same version the package file claims. Agents that leave version drift force support to guess which artifact hit production.

## Step 3: Run the production gates the humans trust

Typecheck and production build are the minimum. Many repos also run lint and unit tests inside `bun run check` or an equivalent. The agent fixes failures caused by intended changes and re-runs until green. Unrelated dirty-tree failures get reported, not “fixed” by deleting a coworker’s WIP.

Tie this step to the previous tip: [catch AI code mistakes with lint](./catch-ai-code-mistakes-with-lint.html). A release skill that skips lint invites the empty-catch class of bugs into the artifact you are about to ship.

## Step 4: Review the exact commit surface

Before staging, run status, `git diff --check`, and full diffs. Stage only intended paths. Refuse `.env`, credential JSON, and generated secret dumps. Use a conventional commit message that states why the release exists. Do not skip hooks unless a human named the skip in the request.

If a pre-commit hook rejects the commit, fix the issue and create a new commit. Do not amend a commit that already left the machine. That rule keeps agent history auditable.

## Step 5: Push and open the PR for humans

Push with upstream tracking. Check for an existing open PR before creating another. Prefer updating the open PR. When creating, target `main`, use a specific title, and write a body with summary, test plan, and rollback notes.

The agent returns the PR URL and stops. Merge stays human. Deploy jobs that reference a `production` environment still wait on reviewers as [GitHub documents for deployments and environments](https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments). That is the point: agent speed on the boring checklist, human judgment on the irreversible step.

## Write the /prod skill like an incident runbook

Incident runbooks succeed because they remove improvisation under stress. Production agent skills need the same tone. Numbered steps. Explicit stops. Named commands. No “use your judgment” lines that invite force-push. If the fetch fails over SSH, document the HTTPS fallback with `gh auth` once, then reuse it.

Keep the skill short enough to fit in context. Link out to longer deploy docs in the repo instead of pasting a novel. Agents lose the plot when the skill file rivals a chapter of a book.

## Branch strategy decision tree

Encode the decision tree in bullets the agent can evaluate:

- If HEAD already contains only intended commits ahead of main, reuse the branch.
- If main already merged the old tip and new work sits dirty, create a named branch from current state.
- If history mixes release work with experiments, branch from origin/main and cherry-pick only intended commits.
- If rebase conflicts look large, stop and ask a human before rewriting.

That tree prevents the common agent move of rebasing everything “to keep history clean” and then losing a coworker’s commit. Clean history matters less than recoverable history on release day.

## Build artifacts and environment parity

Production builds must use the same install command CI uses. Prefer lockfile-strict installs. Pin Actions to version tags or SHAs as GitHub’s hardening guides recommend. The agent should not upgrade a third-party Action mid-release unless the release goal names that upgrade.

When the app deploys through a platform that reads a release version from `package.json`, confirm the build log prints that version. Mismatch means the bump step failed or the wrong workspace package bumped.

### Database and migration gates

If the release includes migrations, the skill requires a migration note in the PR: expand/contract plan, lock duration risk, and rollback path. Agents that ship destructive migrations without a note fail the checklist even when the build is green. Pre-production repos may allow more flexibility; production SaaS should not.

## Secrets and the dirty worktree

Agents love to “be helpful” by staging everything. The skill must list refuse patterns: `.env`, `.env.*`, credential JSON, PEM files, and local dump directories. If a secret appears in the diff, stop and alert. Do not rewrite history in the same turn; rotate the secret first with a human.

Unrelated dirty files stay untouched. Mention them in the PR notes so the human knows the tree was noisy. Silence here causes false blame later.

## PR body template the agent must fill

Require sections: Summary, Test plan, Rollback, Risk. Summary covers user-visible change. Test plan lists commands already run. Rollback names the previous tag or flag. Risk calls out migrations, auth, billing, or tenant boundaries. Empty sections fail the skill even when the PR URL exists.

Link the CI run if the host provides one. Humans merge faster when evidence sits in the first screen of the PR.

## After merge: what the agent may do

Some teams let the agent watch deploy status and paste the result into Slack. That is safe when the agent only reads. Writing to production consoles, running destructive kubectl commands, or approving its own deployment breaks the model. Keep approvals on humans and environment rules.

If the deploy fails, the agent opens a follow-up issue with logs and stops. Hotfix branches still go through the same gates. Speed comes from checklist fluency, not from skipping reviewers.

## Rollback and observability belong in the skill

A production skill that ends at “PR opened” still fails teams. Require a short rollback plan in the PR body: previous release tag, feature flag, or database forward-fix note. Require a health check URL or dashboard link when the app has one. Agents forget these unless the skill checklist names them.

For multi-tenant SaaS work, add tenant-isolation and migration safety checks to the skill. Production readiness means the build passed and the data path stays safe under partial deploy.

## Practice the skill on a boring Tuesday

Do not debut `/prod` during an outage. Run it on a low-risk patch: a copy change, a dependency bump with tests green, a docs-only release if your pipeline still builds. Time the steps. Fix skill wording where the agent hesitated.

Keep a short debrief note: minutes to green, human interventions, surprises in the dirty worktree. After three practice runs, Friday deploys feel like Tuesday with more eyes. The agent already knows the checklist; humans keep the merge.

If your host uses Netlify, Sevalla, or another platform hook after GitHub merge, document that hook in the skill as read-only context. The agent should know where to look for deploy logs without clicking production consoles.

## Align marketing and eng on shipped

Shipped means merged, deployed, and healthy. Agents that stop at green CI confuse stakeholders who already announced the feature. Put the health check URL in the skill. Require the agent to paste deploy status before it claims done in chat.

When a release needs a status page note or a changelog entry, add those as checklist items. Agents forget changelog files unless the skill names the path.

For contract work I also require a handoff bullet: who owns the on-call channel for 48 hours after merge. That sentence prevents silent weekends.

## Refuse dark launches without a flag note

If the release hides behind a feature flag, the PR must name the flag key and the default state in production. Agents that ship code without the flag note create support tickets that blame random behavior. Write the flag name into the skill checklist beside rollback.

## Consulting angle

I install `/prod` skills when agencies and startups already generate code with agents but still fear Friday deploys. The skill encodes the house process so a junior engineer and an agent share the same checklist. If your team needs that install on a Next.js or TypeScript monorepo, use [the contact form](../../index.html#contact). Pair it with [context compression](./compress-agent-context-before-you-code.html) so the agent sees the release docs without flooding the window. Next tip covers [writing SEO articles agents can follow](./write-seo-articles-agents-can-follow.html).


## Document the freeze windows

Some teams freeze deploys Friday afternoon or during peak traffic. Encode freeze windows in the skill so the agent refuses to open a production PR during those hours unless a human typed an override phrase. A polite refusal beats a 6pm surprise merge.

Keep the override phrase boring and logged. Marketing emergencies still happen. The log is how you review whether overrides became the real process.

## Pair /prod with a release owner

Name a human release owner in the PR template. Agents can fill the field from the team roster, but a blank owner fails the checklist. Ownership is how you avoid “the agent shipped it” as an incident postmortem line.

## FAQ

### Should an agent merge the production PR?

No. The agent prepares the branch, passes gates, and opens or updates the PR. A human reviews and merges. That split keeps secrets, approvals, and rollback judgment with the team.

### What if the worktree has unrelated dirty files?

Leave them alone. Stage only files that belong to the release. If scope stays ambiguous, the agent stops and asks instead of sweeping the whole tree into the commit.

### Do agents replace GitHub environment protection rules?

No. Use required reviewers, deployment branches, and environment secrets as GitHub documents in its Actions deployment guides. The agent prepares evidence; the environment rules still gate the job.

### When should the agent bump the version?

After a successful fetch of origin/main and before the production build, using the repo’s version script. Include package and lockfile changes in the same PR so the release number matches the build log.
