---
title: "Catch AI code mistakes with lint"
primaryKeyword: "catch AI code mistakes with lint"
intent: howto
slug: catch-ai-code-mistakes-with-lint
metaDescription: "catch AI code mistakes with lint by running ESLint after every agent edit, fixing new warnings first, and feeding structured rule errors back so the model repairs empty catches, floating promises, and async map bugs before review."
canonical: https://calvinmaighan.com/tips/secret-agent-tips/catch-ai-code-mistakes-with-lint.html
inBodyImage: "../../calvin-article-11.png"
ogImage: "https://calvinmaighan.com/calvin-article-11.png"
updatedAt: 2026-07-26
updatedHuman: July 26, 2026
summary: "Catch AI code mistakes with lint by treating ESLint as a hard gate after every agent edit. Run the same command CI runs, fix new warnings first, then chip away at old debt. Agents repeat empty catch blocks, floating promises, and async map callbacks, and lint surfaces those patterns before a human reads the diff. Wire it into the agent stop path so the model sees structured errors and repairs them in the same turn."
standalone: false
kicker: ""
series: ""
nextHref: "./ship-production-releases-with-agent-checks.html"
nextLabel: "Next article"
nextLocked: "true"
ctaAboveFold: "Book a call"
ctaEnd: "Need a lint-and-agent gate on a production TypeScript app"
inBodyImageAlt: "Cover for tip 11: catch AI code mistakes with lint"
out: site/tips/secret-agent-tips/catch-ai-code-mistakes-with-lint.html
---

Catch AI code mistakes with lint before a human opens the pull request. The code your agent shipped this morning compiles, passes the mocked test, and swallows a Stripe error inside an empty catch block. Nothing looks wrong in review. The bug arrives on Saturday as a webhook that failed silently for six hours.

I treat lint as part of the agent contract on consulting builds, the same way tests and typecheck gate a release. The skill name stays literal: `/lint`. After edits the agent runs the repo lint command, clears the warnings it created, then removes a fixed slice of older debt. That beats asking a model to make sure the code is clean.

## Why AI patches need the loop

Models optimize for local correctness. A function typechecks, passes a unit test with mocks, and still eats errors. People who mine AI pull requests keep finding the same shapes: silent catch blocks, missing awaits, auth middleware skipped on a new route, imports that never resolve at install time. [Pertrai's analysis of AI coding mistakes on DEV](https://dev.to/pertrai1/i-analyzed-500-ai-coding-mistakes-and-built-an-eslint-plugin-to-catch-them-jme) and the [eslint-plugin-ai-guard](https://github.com/YashJadhav21/eslint-plugin-ai-guard) rule set document the pattern list in public.

ESLint stays the shared language for that feedback. The [getting started guide](https://eslint.org/docs/latest/use/getting-started) describes the job plainly: parse the tree, run rules, emit diagnostics. Agents act on those diagnostics faster than on review comments, because the message carries a file, a line, a rule id, and a fix hint.

[ESLint as AI Guardrails](https://medium.com/@albro/eslint-as-ai-guardrails-the-rules-that-make-ai-code-readable-8899c71d3446) argues the readability side: caps on parameters, function length, and magic numbers keep agent output from sprawling past review. You do not need every community plugin in week one. You need a gate the agent cannot route around.

## Build the skill around CI truth

Agents invent lint commands when the skill stays vague. Lock it to the script CI runs, `bun run lint` or `npm run lint`, and ban the one-off `npx eslint src/foo.ts` that ignores project config.

Pre-existing warnings drown agents, so snapshot the warning set at session start and mark anything new as blocking. The agent clears its own mess first, which keeps a long-lived codebase from forcing a four-hundred-warning cleanup into every feature branch.

Teach the triage order in the skill body:

- Fix every warning introduced this session.
- Fix a small quota of old warnings when the branch stays clean.
- Re-run lint until the edited files go quiet.
- Refuse to open a pull request while new lint fails.

On design-system repos, put rename chains in the skill so the agent finishes the importers in the same change. Partial renames fail typecheck and burn a second turn.

## Rules that pay rent

Start with stock ESLint and typescript-eslint, then add rules that match failure modes you already shipped. Empty catch blocks and floating promises come first. Async callbacks inside `array.map` come next. Auth and unsafe deserialization rules belong on API surfaces.

Plugins such as [eslint-plugin-llm-core](https://github.com/pertrai1/eslint-plugin-llm-core) carry educational messages that tell the model what to do next, which helps when the default rule text stays too abstract for self-repair. Keep the set small enough that humans still recognize every failure.

Promote the critical rules to error, because warnings invite `eslint-disable`. Ban file-wide disables. When a disable has to land, require a ticket id in the comment and a code owner review on the config that allows it.

Run the typechecker alongside. Lint without `tsc --noEmit` misses signature drift across files, and typecheck without lint misses swallowed errors. The TypeScript handbook on [compiler options](https://www.typescriptlang.org/docs/handbook/compiler-options.html) maps the strictness knobs worth turning on and leaving on.

## Wire it into the stop path

Prompts that ask the agent to please lint fail under deadline pressure. Hook the end of an agent turn so a clean exit requires clean lint on touched files. When the hook sees novel warnings, auto-submit one follow-up turn with a loop limit of one so the agent repairs without spinning.

Allow a short-lived flag for docs-only edits, and log every skip. Teams that ship agent velocity without a stop gate collect silent debt that surfaces as weekend incidents.

## Make the output agent-readable

Prefer the stylish or JSON formatters agents parse without scraping terminal colors, and keep rule ids in the output. Point the skill at a short mapping table from rule id to preferred fix: `no-floating-promises` maps to await, return, or an explicit void with a comment. The agent guesses less.

Store a JSON baseline of warning fingerprints at session start and diff current output against it. Novel fingerprints block, known fingerprints stay optional debt. Publish the baseline path in the skill, because teams that let each agent invent a baseline argue about ghosts.

## Custom rules for product houses

Generic plugins catch generic mistakes. Your product also needs rules that encode local scars: no direct database access from route handlers, no raw SQL concatenation, no client import of server secrets. Put those in an in-repo ESLint plugin and point the skill at the allowlist.

Write the messages for the reader who has to act. "Unexpected empty catch" wastes a turn. "Empty catch swallows webhook failures. Log with the request id, then rethrow or map to AppError" lands on the first retry.

Keep CI, local, and agent on the same config. Pin the ESLint major, commit the config, and invoke the package script only. In a monorepo, name the package filter in the skill so agents stop linting the wrong workspace.

## What lint will not do

Lint catches the mechanical class of AI mistakes that waste reviewer attention. It has no opinion about a wrong product decision, a bad data model, or a threat you failed to model. Humans keep those. Agents keep the cleanup loop that makes human review worth the calendar time.

## Ship the habit this week

Add the stop hook, snapshot a baseline, and run one real feature through the loop. Record the first incident it prevents, because a swallowed webhook error makes the skill real in planning meetings. Then put the command, the baseline path, the triage order, and the disable policy in `AGENTS.md`.

Tip 4 keeps the diff small with [ponytail](./keep-ai-coding-changes-minimal-with-ponytail.html). Tip 12 takes the clean branch to production, where you [ship production releases with agent checks](./ship-production-releases-with-agent-checks.html).

If you want this loop installed on a SaaS codebase, [book a call](../../contact.html). More notes live in the [tips index](../../index.html#tips).

## Sources

- [ESLint getting started](https://eslint.org/docs/latest/use/getting-started)
- [I analyzed 500 AI coding mistakes (DEV)](https://dev.to/pertrai1/i-analyzed-500-ai-coding-mistakes-and-built-an-eslint-plugin-to-catch-them-jme)
- [eslint-plugin-ai-guard](https://github.com/YashJadhav21/eslint-plugin-ai-guard)
- [eslint-plugin-llm-core](https://github.com/pertrai1/eslint-plugin-llm-core)
- [TypeScript compiler options](https://www.typescriptlang.org/docs/handbook/compiler-options.html)

## FAQ

### Should agents treat lint warnings as errors?

Yes for new work. Warnings pile up when agents can ignore them, so promote the rules that catch empty catches, floating promises, and auth gaps to error and keep CI on the same config.

### Does TypeScript replace ESLint for AI patches?

No. TypeScript catches type and import mistakes when the project compiles as a unit. ESLint catches patterns that stay type-valid and still break production.

### How do you stop agents from silencing rules?

Ban broad disable comments in the skill, require a one-line reason for any disable, and fail CI when one appears without an allowlist ticket.

### What should the agent fix first after a lint run?

Everything introduced in the current session. The baseline snapshot tells it which warnings belong to yesterday.
