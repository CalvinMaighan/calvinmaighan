---
title: "Compress agent context before you code"
primaryKeyword: "compress agent context before you code"
intent: howto
slug: compress-agent-context-before-you-code
metaDescription: "compress agent context before you code with lean-ctx so agents read ranked symbols, skip raw dumps, and spend tokens on the change instead of pasting entire repositories into the prompt."
canonical: https://calvinmaighan.com/tips/secret-agent-tips/compress-agent-context-before-you-code.html
inBodyImage: "../../calvin-article-2.png"
ogImage: "https://calvinmaighan.com/calvin-article-2.png"
updatedAt: 2026-07-22
updatedHuman: July 22, 2026
summary: "Compress agent context before you code by routing reads, searches, and shell output through a context-engineering layer such as lean-ctx. Agents then start from ranked symbols and task-relevant slices instead of pasting whole directories into the window. You spend tokens on the change, cut retries, and keep long sessions usable."
standalone: false
kicker: ""
series: ""
nextHref: "./persist-codebase-knowledge-across-ai-chats.html"
nextLabel: "Next article"
nextLocked: "true"
ctaAboveFold: "Book a call"
ctaEnd: "Want lean-ctx wired into your team workflow"
inBodyImageAlt: "Calvin Maighan article series cover for secret agent tips on compressing agent context"
out: site/tips/secret-agent-tips/compress-agent-context-before-you-code.html
---

You compress agent context before you code when you treat the context window as a scarce instrument panel, not a junk drawer. lean-ctx is the skill and toolset I use for that discipline: compose to orient, search with intent, read with a mode that matches the job, expand only what the edit needs. The [lean-ctx documentation](https://leanctx.com/docs) and the [open-source lean-ctx project](https://github.com/yvgude/lean-ctx) describe the same idea in tool form. You do not win by feeding the model more files. You win by feeding the right symbols in a shape the model can use.

LangChain's team frames this as context engineering: fill the window with the right information at each step. Their [context engineering for agents](https://www.langchain.com/blog/context-engineering-for-agents) post groups tactics into write, select, compress, and isolate. Their [LangChain context engineering docs](https://docs.langchain.com/oss/python/langchain/context-engineering) push the same point for production agents. lean-ctx is how I apply select and compress inside an IDE coding loop without standing up a custom framework.

## The failure mode: dump, then hope

Default agent behavior on a vague task looks like this:

1. Glob half the repo
2. Read five large files end to end
3. Paste a noisy test log
4. Ask the model to figure it out
5. Retry when the model invents an API that never existed

Each step looks thorough. Together they bury the one function that matters under thousands of tokens of neighbors, comments, and generated noise. The model then answers from the loudest nearby pattern, not from the call path you care about.

Compression flips the order. Orient with a ranked compose. Open only the symbols that ranked. Expand a slice when an edit needs exact text. Keep shell output in patterns that strip banners and repeat rows. The agent still sees truth. It sees less of the wrong truth.

## Compose first

`ctx_compose` (or your stack's equivalent) should be the first tool on any "how does this work" or multi-file task. One compose call returns ranked files with relevant symbol source inline. That replaces the antipattern chain of search, then read, then symbol lookup.

Prompt the agent with the task in plain English: "auth refresh failure on mobile" beats "look around the auth folder." Compose ranks by lexical and semantic signal plus structure. You get a map with code attached. From there, edit with confidence or expand one file in anchored mode.

Rules I enforce in skills:

- Do not chain search → read → symbol when compose covers the question.
- Do not re-read a file compose already returned in full for that symbol.
- Fire parallel compose or reads for unrelated areas, not serial curiosity tours.

## Read modes that match the job

lean-ctx style tools expose modes. Use them on purpose:

- **map / signatures:** API surface when you only need exports
- **task:** lines relevant to the stated job
- **aggressive:** large files with syntax noise reduced
- **anchored:** full text plus anchors when you will patch
- **lines:N-M:** surgical ranges after you know the span
- **diff:** after edits, only changed lines
- **full:** verbatim when fidelity matters more than tokens

Default curiosity reads should not be `full`. Full is for the file you are about to change, or for a bug that depends on exact whitespace, binary-adjacent formats, or generated blocks compression mishandles.

Caching matters. Re-reads of the same compressed slice should be cheap. Fresh flags exist for a reason: use them when the file changed on disk under you.

## Search with an action, not a vibe

Regex search finds strings. Symbol search finds definitions. Semantic search finds meaning when you lack the name. Call graph finds callers. Pick the action that matches the question.

"Where is `hydrateTheme` defined?" is a symbol question. "How does theme boot relate to i18n?" is a compose or call-graph question. "Who still hardcodes a hex color?" is regex. Agents that run regex for everything create false confidence and miss the definition two folders away under a re-export.

## Shell output is context too

Test logs, git status, and build traces can dominate a window. Compress them:

- Prefer status summaries over full traces until a failure needs detail
- Cap log tails to the failing suite
- Strip decorative tables the human already saw
- Avoid pasting entire `node_modules` trees from mistaken globs

A coding agent that pastes a 4,000-line Jest dump is not being careful. It is spending the budget that should buy a second look at the failing assertion.

## Write, select, compress, isolate in practice

Map LangChain's four buckets onto a product engineering day:

**Write.** Persist decisions outside the chat: ADRs, skill files, memory MCP (next tip), ticket comments. The window should not be the only memory.

**Select.** Compose and symbol tools pull the few files that matter. Rules and skills select instructions the same way.

**Compress.** Read modes, log tails, and session summaries keep history short.

**Isolate.** Subagents or separate chats for research versus edit. Tip 3's caveman mode isolates verbosity. Tip 4's [ponytail](./keep-ai-coding-changes-minimal-with-ponytail.html) isolates scope of the diff.

When a session mixes research, design debate, and a production patch, split it. Isolation is a context tool.

## Team rules that stick

Put these lines in your agent skill or project rules:

1. Call compose before broad reads on multi-file tasks.
2. Prefer signatures or task mode until an edit requires anchors.
3. Max one full-file curiosity read without a stated reason.
4. Shell: summary first, full log on failure only.
5. Name the files you will change before you change them.
6. If the window feels full, summarize decisions to memory and open a fresh thread for the patch.

Reviewers can ask for the compose output or the file list in the PR description. That creates a social check without new infrastructure.

## Measuring compression

Track:

- average input tokens per successful agent task
- retries per task
- time to first correct edit
- share of PRs that touch unexpected directories

Compression works when tokens and retries fall while correct-edit time holds or improves. If accuracy drops, your modes are too aggressive for that repo. Dial task mode looser, or require anchored reads before patches in dense modules.

## Repo-specific notes for product teams

Monorepos need stricter select rules. A mobile package and a billing package can share names. Compose with a path root. Ban repo-wide globs unless the task is truly cross-cutting.

Generated code (GraphQL types, Prisma clients, route manifests) should stay out of default reads. Point agents at the source of truth schema instead. Compression that still loads generated giants is cosplay.

Design systems and theme tokens are high-signal and small. Prefer them over component implementation dumps when the task is visual. On calvinmaighan.com, theme CSS variables beat pasting entire `styles.css` into the prompt.

## How this tip connects

Minimal diffs need clean context. If the agent never saw the existing helper, ponytail cannot reuse it. If every chat starts from zero, you need [persistent codebase knowledge](./persist-codebase-knowledge-across-ai-chats.html) next. Compression and memory reinforce each other: memory stores decisions, compression keeps the active window sharp.

Browse the rest of the series from the [tips index](../../index.html#tips).

## A day-one install checklist

1. Install lean-ctx or enable your IDE's equivalent compression hooks.
2. Add a skill: "compose first; no search→read chains for orientation."
3. Document read modes in one screen for the team.
4. Add a PR note field: files consulted versus files changed.
5. Pick one noisy workflow (flaky test debug) and rewrite it with compressed logs.
6. Compare token usage for a week against the old habit.

## Common objections

**"The model has a huge window now."** Huge windows still degrade. Attention is uneven. Noise still wins. Cost still scales. Latency still scales. Compression remains rational even at million-token marketing numbers.

**"Compression might hide a bug."** So might a 200k dump. Prefer compose plus expand over either extreme. When a bug smells like an off-by-one in a dense function, switch to anchored or full for that file only.

**"We do not have time to learn tools."** You already lose time in retries. One afternoon of skill text pays back on the next incident.

**"Our agent framework already summarizes."** Summaries of chat are not the same as structured code reads. You want both.

## Concrete scenario

Task: dark mode icon wrong after `setMode`.

Dump approach: read all of `app.mjs`, all theme CSS, all header HTML, half the vendor files.

Compress approach: compose "theme mode toggle icon refresh". Land on `setMode`, `hydrateTheme`, and the header icon updater. Read those symbols. Patch the chrome refresh after `setMode`. Done in one pass.

Same repository. Different context diet. Different bill.

## Anti-patterns to ban in skill text

Write these as hard nos so agents cannot negotiate them away:

- "Read the whole `src` tree to be safe."
- "Paste the full CI log before reading the failing test name."
- "Open every CSS file that mentions color."
- "Re-run a broad glob after compose already ranked the files."
- "Keep the research thread and the production patch in one endless chat."

Replace each with a positive: compose with a task phrase, open the failing test file first, read theme tokens before components, trust compose ranks until they miss, split research from patch.

## Budget thinking for leads

Give each agent task a soft token budget the way you give engineers a timebox. Example: orientation under a fixed input budget, then a separate budget for the edit pass. When orientation blows the budget, the agent must summarize findings to memory or a scratch note and restart clean for the patch. Leads who never budget tokens quietly fund fishing expeditions.

Pair budgets with model choice. Cheap models are fine for compose ranking and log triage. Spend the stronger model on the edit once context is tight. Compression makes that split practical because the expensive call sees less junk.

## Incident replay with compression

When production breaks, people paste everything into chat: dashboards, stack traces, Slack threads, half the service map. The agent drowns and invents a root cause from the loudest log line.

Compressed incident replay looks different. First command: extract the failing assertion or status code. Second: compose on that symbol and the deploy SHA. Third: open only the two files on the critical path. Fourth: patch or roll back. Fifth: write the dated observation into memory so the next outage starts smarter.

I run that sequence on client bridges when on-call is already tired. The win is not cleverness. The win is refusing a 20,000-token dump when 800 tokens of the right symbols close the page.

## Office hours drill

Pick one noisy workflow each Friday: flaky CI, theme bug, migration plan. Time the agent with dump habits, then with compose-first habits. Post both times in the engineering channel. Numbers beat slogans when you ask a team to change muscle memory.

## Handoff line for clients

Leave one sentence in AGENTS.md: "Orient with compose before broad reads; prefer task or signature modes until you patch." That line outlives every workshop. When a new contractor opens the repo, the agent inherits the diet without a kickoff call.

## Sources

- [lean-ctx docs](https://leanctx.com/docs)
- [lean-ctx on GitHub](https://github.com/yvgude/lean-ctx)
- [Context engineering for agents (LangChain)](https://www.langchain.com/blog/context-engineering-for-agents)
- [Context engineering in agents (LangChain docs)](https://docs.langchain.com/oss/python/langchain/context-engineering)
- Related: [Keep AI coding changes minimal with ponytail](./keep-ai-coding-changes-minimal-with-ponytail.html)
- Series cards on [calvinmaighan.com tips](../../index.html#tips)

## FAQ

### What does lean-ctx do for coding agents?

lean-ctx compresses file reads, search results, and shell output so agents get ranked symbols and task-relevant slices instead of full file dumps that burn the context window.

### Is context compression the same as summarization?

Related but different. Summarization rewrites history. lean-ctx focuses on how tools return code and command output: modes, caching, and ranked compose so the model sees structure without noise.

### When should I still read a full file?

Read full or anchored mode when you will edit that file, when a bug depends on exact formatting, or when compression hid a symbol you still need. Prefer compose first, then expand.

### Does compression hurt accuracy?

Bad compression does. Good compression removes repetition and off-task files while keeping the symbols on the critical path. Measure with escaped defects and retry rate, not vibes.
