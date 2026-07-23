---
title: "Catch AI code mistakes with lint"
primaryKeyword: "catch AI code mistakes with lint"
intent: howto
slug: catch-ai-code-mistakes-with-lint
metaDescription: "catch AI code mistakes with lint by running ESLint after every agent edit, fixing new warnings first, and feeding structured rule errors back so the model repairs empty catches, floating promises, and async map bugs before review."
canonical: https://calvinmaighan.com/tips/secret-agent-tips/catch-ai-code-mistakes-with-lint.html
updatedAt: 2026-07-22
updatedHuman: July 22, 2026
summary: "Catch AI code mistakes with lint by treating ESLint as a hard gate after every agent edit. Run the same command your CI runs, fix new warnings first, then chip away at old debt. Agents repeat empty catch blocks, floating promises, and async map callbacks; lint surfaces those patterns before review. Wire lint into the agent stop path so the model sees structured errors and repairs them in the same turn."
standalone: false
kicker: "Tip 12 of 14"
series: "14 secret agent tips for product teams"
nextHref: "./ship-production-releases-with-agent-checks.html"
nextLabel: "Next article"
nextLocked: "true"
ctaAboveFold: "Book a call"
ctaEnd: "Need a lint-and-agent gate on a production TypeScript app"
inBodyImageAlt: "Cover for tip 12: catch AI code mistakes with lint"
out: site/tips/secret-agent-tips/catch-ai-code-mistakes-with-lint.html
---

Catch AI code mistakes with lint before a human opens the pull request. Agents write fast TypeScript that compiles and still fails in production because empty catch blocks, floating promises, and async callbacks in `map` look fine to a model trained on incomplete examples. Lint is the cheap sensor that turns those repeats into machine-readable feedback the agent can fix in the same turn.

On consulting builds I treat lint as part of the agent contract, the same way tests and typecheck gate a release. The skill name on my teams is literal: `/lint`. After edits, the agent runs the repo lint command, owns new warnings first, then removes a fixed slice of older debt. That loop beats asking the model to “make sure the code is clean.”

## Why AI patches need a lint loop

Large language models overfit to local correctness. A function can typecheck, pass a unit test with mocks, and still swallow errors. Practitioners who mine AI pull requests keep finding the same shapes: silent catch blocks, missing await, auth middleware skipped on a new route, and hallucinated imports that never resolve at install time. Writers who built plugins for those patterns document the list in public posts such as [Pertrai’s analysis of AI coding mistakes on DEV](https://dev.to/pertrai1/i-analyzed-500-ai-coding-mistakes-and-built-an-eslint-plugin-to-catch-them-jme) and the [eslint-plugin-ai-guard](https://github.com/YashJadhav21/eslint-plugin-ai-guard) rule set.

ESLint remains the shared language for that feedback. The [official getting started guide](https://eslint.org/docs/latest/use/getting-started) still describes the job: parse the tree, run rules, emit diagnostics. Agents read those diagnostics better than vague review comments because the message names the file, line, rule id, and fix hint.

Medium essay [ESLint as AI Guardrails](https://medium.com/@albro/eslint-as-ai-guardrails-the-rules-that-make-ai-code-readable-8899c71d3446) makes the same point from the readability side: caps on parameters, function length, and magic numbers keep agent output from sprawling into unreviewable blobs. You do not need every community plugin on day one. You need a gate the agent cannot skip.

## Build the /lint skill around CI truth

Agents invent lint commands when the skill stays fuzzy. Lock the command to the same script CI runs. On Bun or npm repos that means `bun run lint` or `npm run lint`, never a one-off `npx eslint src/foo.ts` that ignores project config.

### Snapshot new versus old debt

Pre-existing warnings drown agents. Snapshot the warning set at session start, then mark anything new as blocking. The agent clears its own mess before it chips away at the backlog. That split keeps a long-lived codebase from forcing a 400-warning fix into every feature branch.

### Order of attack

Teach a triage order in the skill file:

- Fix every new warning from this session.
- Fix a small quota of old warnings when the branch stays clean.
- Re-run lint until the edited files are quiet.
- Refuse to open a PR while new lint fails.

For styled-component or design-system repos, put rename chains in the skill so the agent finishes importers in the same change. Partial renames fail typecheck and burn a second agent turn.

## Rules that pay rent on AI code

Start with stock ESLint and typescript-eslint, then add rules that match failure modes you already saw in production. Empty catch blocks and floating promises belong near the top. Async callbacks inside `array.map` belong next. Auth and unsafe deserialize rules belong on API surfaces.

Community plugins such as [eslint-plugin-llm-core](https://github.com/pertrai1/eslint-plugin-llm-core) push educational messages that tell the model what to do next. Use them when the default rule text stays too abstract for reliable self-repair. Keep the rule set small enough that humans still understand every failure.

### Errors beat warnings in the agent path

Warnings invite `eslint-disable`. For agent workflows, set the critical rules to error. Ban file-wide disables. If a disable must land, require a ticket id in the comment and a CODEOWNERS review on the config file that allows it.

### Pair lint with the typechecker

Lint without `tsc --noEmit` misses signature drift across files. Typecheck without lint misses swallowed errors. Run both. The TypeScript handbook on [compiler options](https://www.typescriptlang.org/docs/handbook/compiler-options.html) is still the map for strictness knobs; turn on the options your team can keep green, then leave them on for agents.

## Wire lint into the agent stop path

Manual “please lint” prompts fail under deadline pressure. Hook the stop of an agent turn so a clean exit requires a clean lint for touched files. Cursor and similar tools support stop hooks; use them. When the hook sees novel warnings, auto-submit a follow-up lint turn with loop limit one so the agent repairs without an infinite loop.

Skip hooks only with an explicit, short-lived flag for docs-only edits. Log every skip. Product teams that ship agent velocity without a stop gate accumulate silent debt that shows up as weekend incidents.

## Make lint output agent-readable

Prefer stylish or JSON formatters agents parse without scraping ANSI noise. Include rule ids. Point the skill at a short mapping table: rule id to preferred fix pattern. Example: `no-floating-promises` maps to await, return, or void with a comment. The agent spends fewer tokens guessing.

Keep custom plugins in-repo when your product has house rules, the same way this site vendors small libraries under `site/vendor/`. House rules beat generic blog advice because they encode incidents you already paid for.

## A concrete agent turn that uses lint

Picture a mid-size Next.js app. The agent adds a billing webhook handler. It compiles. The handler wraps Stripe errors in an empty catch because the model saw that pattern in training noise. Without lint, the PR looks calm. With `no-empty-catch` as an error, the stop hook fails, the agent gets the rule id, and the second turn logs the error and rethrows or maps it to a typed failure.

That same turn often introduces `items.map(async (item) => ...)`. The array of promises never settles the way the author expects. A dedicated rule names the mistake. The agent rewrites to `Promise.all` or a plain loop. Reviewers stop spending their first ten minutes on AI folklore bugs.

### Baseline files keep sessions honest

Store a JSON baseline of warning fingerprints at session start. Diff the current ESLint JSON output against that baseline. Novel fingerprints block. Known fingerprints stay optional debt. When sessionStart misses, seed the baseline on first lint so yesterday’s debt does not masquerade as today’s regression.

Publish the baseline path in the skill so every agent reads the same file. Teams that let each agent invent a baseline end up arguing about ghosts.

## Custom rules for product houses

Generic plugins catch generic AI mistakes. Product houses also need rules that encode local scars: no direct database access from route handlers, no raw SQL string concatenation, no client import of server secrets, no unlisted styled export names. Put those rules in an in-repo ESLint plugin. Point the skill at the allowlist file.

When an agent proposes a new styled primitive, the rule fails until the name lands on the allowlist. That friction is cheaper than a design-system fork that appears every sprint. The same pattern works for GraphQL operation naming, migration file headers, and feature-flag keys.

### Keep the feedback educational

Rule messages should tell the agent the fix shape. “Unexpected empty catch” wastes a turn. “Empty catch swallows webhook failures; log with request id and rethrow or map to AppError” lands on the first retry. Plugin authors who study LLM mistakes write messages for models on purpose; copy that habit for house rules.

## CI, local, and agent must agree

Drift kills trust. If CI uses flat config and the agent runs legacy config, humans chase green on one side and red on the other. Pin the ESLint major, commit the config, and invoke the package script only. Cache strategy belongs in CI docs; the skill only needs the command name and the failure policy.

For monorepos, name the package filter in the skill. Agents that lint the wrong package report false greens. Include a one-line example: `bun run lint --filter=@app/web` or the workspace equivalent.

## Metrics that prove the loop works

Track three numbers for a month: novel lint failures per agent session, median minutes from failure to green, and count of `eslint-disable` comments merged. If disables rise while failures fall, the team is silencing the sensor. If minutes stay high, the rule messages need clearer fix hints.

Share those numbers in standup. Lint becomes a product reliability practice instead of a style argument. That framing helps when a stakeholder asks why the agent “wastes time” running ESLint after every edit.

## Security-adjacent rules deserve priority

AI patches love placeholder secrets, permissive CORS, and disabled TLS verification copied from tutorials. Prioritize rules that flag hardcoded keys, `eval`, unsafe deserialize, and missing auth middleware on new routes. Pair them with secret scanning in CI. Lint will not replace a security review, yet it removes the obvious class before a human opens the diff.

When a rule fires on a generated example key, the agent must replace it with an env read and a local sample in `.env.example`. The skill should say that in one sentence so the model does not “fix” the warning by deleting the line that needed a secret.

## Hand the skill to the next engineer

A lint skill dies when only you know the baseline path. Put the command, the baseline file, the triage order, and the disable policy in AGENTS.md. Walk one new engineer through a failing turn. When they can green the stop hook without you, the practice stuck.

Record one incident lint prevented. A swallowed webhook error or a floating promise in billing makes the skill real in planning meetings. Abstract quality talk loses to a dated story with a pull request link.

## Ship the baseline with the repo

Commit a sample baseline or a script that seeds one. Agents on fresh clones should not invent a private cache path. Document how to refresh the baseline after a mass cleanup so the next week does not treat old debt as new again.

## Review still matters

Lint will not catch a wrong product decision. It catches the mechanical class of AI mistakes that waste reviewer attention. Humans keep ownership of architecture, data model, and security threat models. Agents own the cleanup loop that makes human review worth the calendar time.

If you want help installing this loop on a SaaS codebase, use the contact form on [calvinmaighan.com](../../index.html#contact). Related series tips cover [minimal diffs with ponytail](./keep-ai-coding-changes-minimal-with-ponytail.html) and [exposing product actions as MCP tools](./expose-product-actions-as-mcp-tools.html). Next tip covers [shipping production releases with agent checks](./ship-production-releases-with-agent-checks.html).


## Teach the agent your house dialect

Every codebase invents slang: `AppError`, `tenantId`, `assertFound`. Put a short glossary in the lint skill or AGENTS.md so rule messages and fixes use those names. Agents that invent parallel error types create twin stacks that look fine until an ops dashboard splits them.

When a new rule lands, attach one failing fixture in the plugin tests. Agents learn faster from a red fixture than from a paragraph of policy. Keep the fixture tiny: twenty lines, one clear violation, one preferred fix in a comment.

## When lint should fail the whole session

If the agent introduces more than a set number of novel warnings, stop the feature work and force a lint-only turn. I use a threshold of five new errors on medium PRs. Crossing it means the model drifted. Drift compounds when you keep prompting for features on top of a dirty tree.

## FAQ

### Should agents treat lint warnings as errors?

Yes for new work. Warnings pile up when agents can ignore them. Promote rules that catch empty catch blocks, floating promises, and auth gaps to error in the agent path, then keep CI on the same config.

### Does TypeScript replace ESLint for AI patches?

No. TypeScript catches type and import mistakes when the project compiles as a unit. ESLint catches patterns that stay type-valid and still break production, such as swallowed errors and async array callbacks.

### How do you stop agents from silencing rules?

Ban broad eslint-disable comments in the agent skill. Require a one-line reason for any disable, and fail CI when a disable appears without an allowlist ticket.

### What should the agent fix first after a lint run?

Everything introduced in the current session. Compare against a baseline snapshot so the agent clears new noise before it spends tokens on old debt.
