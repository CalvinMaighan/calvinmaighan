---
title: "Find dead code with fallow"
primaryKeyword: "find dead code with fallow"
intent: howto
slug: find-dead-code-with-fallow
metaDescription: "find dead code with fallow so agents get deterministic unused-file and unused-export reports before they delete, with typed JSON output, dry-run fixes, and a health score you can gate in CI."
canonical: https://calvinmaighan.com/tips/secret-agent-tips/find-dead-code-with-fallow.html
inBodyImage: "../../calvin-article-13.png"
ogImage: "https://calvinmaighan.com/calvin-article-13.png"
updatedAt: 2026-07-26
updatedHuman: July 26, 2026
summary: "Find dead code with fallow when agent refactors leave unused files, orphan exports, and circular dependencies nobody owns. Fallow runs deterministic static analysis over TypeScript and JavaScript: dead code, duplication, a health score, and typed JSON agents can parse. Audit the pull request diff, preview deletes with a dry run, then remove only what the evidence and a human both support."
standalone: false
kicker: ""
series: ""
nextHref: "./expose-product-actions-as-mcp-tools.html"
nextLabel: "Next article"
nextLocked: "true"
ctaAboveFold: "Book a call"
ctaEnd: "Want fallow wired into your agent cleanup loop"
inBodyImageAlt: "Cover for tip 13: find dead code with fallow"
out: site/tips/secret-agent-tips/find-dead-code-with-fallow.html
---

Find dead code with fallow before your agent proposes a cleanup from vibes. Agents add files faster than any team deletes them. Three months into AI-assisted shipping you have orphaned exports, tests importing modules nobody ships, and a circular dependency that slows every build. Ask an agent to tidy that and it deletes whatever looks lonely, which is how a dynamic import disappears from production.

I place this skill after lint and the release gates on purpose. Lint checks the patch you just wrote. The release skill gates what ships. Fallow answers a different question: what should leave the tree so the next agent starts from less noise.

## What fallow gives you

[Fallow](https://www.npmjs.com/package/fallow) is codebase intelligence for TypeScript and JavaScript. The static analyzer finds unused code, circular dependencies, duplication, complexity hotspots, and design-system drift. No model runs inside the analyzer, so results stay deterministic, and the output arrives as typed JSON with traceable explanations. The [docs](https://docs.fallow.tools) and the [GitHub repo](https://github.com/fallow-rs/fallow) cover the full contract.

Install it in the app your agents touch most:

`bun add -d fallow`

or `npm install --save-dev fallow`. That also ships the `fallow-lsp` and `fallow-mcp` launchers so editors and agents resolve the project-local binary rather than whatever sits on `PATH`.

## Commands to lock in the skill

- `npx fallow` for the full pipeline of dead code, duplication, and health
- `npx fallow audit` to gate what the pull request changed, with a pass, warn, or fail verdict
- `npx fallow dead-code` for cleanup-focused findings
- `npx fallow health --score` for a score from 0 to 100 with a letter grade
- `npx fallow fix --dry-run` to preview automatic cleanup
- `npx fallow --format json --quiet` for one typed document on stdout

Teach the exit codes too. Code 1 means findings, code 0 means clean or an audit pass, code 2 means a validation error. Agents that treat every non-zero exit as a broken tool will abandon the skill on its first useful run.

## Why agents need the evidence

Lonely and unused are different states. Dynamic imports, framework plugins, and design-system re-exports all look dead to a casual grep, and a confident model will delete them. Fallow's graph and framework plugins cut those false positives, and the JSON carries an `actions[]` array with an `auto_fixable` flag so the agent knows which findings it may hand to `fallow fix` and which need a person.

## Wire the habit

Name the skill after the job, `find-dead-code` rather than `fallow-helpers`. Trigger it when the agent finishes a multi-file refactor, before a large pull request, or during a scoped cleanup week. The method:

1. Run `fallow audit` on the branch against main.
2. Read the JSON findings when the verdict fails.
3. Preview with `fallow fix --dry-run`, then apply only the auto-fixable deletes the skill allows.
4. Re-run typecheck and lint on the touched paths.
5. Cite finding ids in the pull request so reviewers see the evidence.

Keep one stop rule in bold in the skill body: no deleting public package exports, GraphQL schema roots, or CSS tokens without a human. A false positive costs more than a quiet unused helper.

## Start small on a dirty repo

A first run on a large product reports hundreds of unused exports, and nobody should hand that backlog to an agent in one pull request. Script three lanes instead:

- `fallow:dead-code` for the full report
- `fallow:changed` with `--changed-since main` for day-to-day agent work
- `fallow:fix-dry` for preview deletes

Agents live on the changed lane. Humans schedule the full passes as their own tickets. That split matches how I coach teams already drowning in lint debt.

## Where it sits next to lint

Lint asks whether this file is wrong. Fallow asks whether this file should exist. Both belong in the agent stop path, with lint on every edit and fallow after a change that removed call sites or finished a rename. Running fallow on a typo fix wastes tokens. Never running it grows zombies.

## Failure modes

Agents delete tests that only the CI matrix imports, so put those entry patterns in the fallow config or the skill stop list.

Agents read a warn verdict as green. When your policy blocks merge on new unused exports, write that in the skill.

Agents paste the whole JSON document into chat. Require a summary instead: counts by category, the top five paths, and the proposed deletes, with the full report kept as a CI artifact.

## Ship the habit this week

Install fallow on one TypeScript app and add the three scripts. Run `fallow audit` on an open pull request, delete one auto-fixable unused file after a dry run, and paste the finding id into the description. After three clean wins, add the audit to the agent stop path for multi-file refactors.

Tip 12 got the release out the door with [agent checks](./ship-production-releases-with-agent-checks.html). Tip 14 closes the series inside your product, where you [expose product actions as MCP tools](./expose-product-actions-as-mcp-tools.html) with scopes and audit trails.

If you want this wired into Cursor or Claude Code with job-named skills and a changed-since gate, [book a call](../../contact.html). More notes live in the [tips index](../../index.html#tips).

## Sources

- [fallow on npm](https://www.npmjs.com/package/fallow)
- [fallow documentation](https://docs.fallow.tools)
- [fallow on GitHub](https://github.com/fallow-rs/fallow)
- [Cursor Agent Skills](https://cursor.com/docs/skills)

## FAQ

### Does fallow replace ESLint?

No. Lint catches local mistakes in code you keep, and fallow finds code you should remove. Run both, in that order.

### Will fallow delete files without asking?

Only when you run `fallow fix` without the dry-run flag. Keep dry-run as the default in the skill, and require human confirmation for anything touching a public surface.

### What about JavaScript without TypeScript?

Fallow covers both. Point it at the app your agents edit most often.

### How do I keep noise down on a legacy repo?

Keep agents on the changed-since lane for daily work, and schedule full `fallow dead-code` passes as separate cleanup tickets.
