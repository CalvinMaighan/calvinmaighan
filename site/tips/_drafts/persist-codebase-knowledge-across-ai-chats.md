---
title: "Persist codebase knowledge across AI chats"
primaryKeyword: "persist codebase knowledge across AI chats"
intent: howto
slug: persist-codebase-knowledge-across-ai-chats
metaDescription: "persist codebase knowledge across AI chats with a codebase-memory MCP so agents recall architecture decisions, naming rules, and prior fixes instead of rediscovering your repo every session."
canonical: https://calvinmaighan.com/tips/secret-agent-tips/persist-codebase-knowledge-across-ai-chats.html
inBodyImage: "../../calvin-article-6.png"
ogImage: "https://calvinmaighan.com/calvin-article-6.png"
updatedAt: 2026-07-22
updatedHuman: July 22, 2026
summary: "Persist codebase knowledge across AI chats by attaching a codebase-memory MCP server that stores architecture decisions, naming rules, and prior fixes as queryable entities. New threads start with recall instead of rediscovery. You cut repeated mistakes, keep conventions stable, and give agents a project memory that survives closed tabs."
standalone: false
kicker: ""
series: ""
nextHref: "./research-what-people-said-last-month.html"
nextLabel: "Next article"
nextLocked: "true"
ctaAboveFold: "Book a call"
ctaEnd: "Want codebase-memory MCP wired into your team workflow"
inBodyImageAlt: "Cover for skill 6: persist codebase knowledge across AI chats"
out: site/tips/secret-agent-tips/persist-codebase-knowledge-across-ai-chats.html
---

You persist codebase knowledge across AI chats when you stop pretending the context window is a filing cabinet. Chats end. Tabs close. The next agent session forgets the boot order you explained yesterday and invents a second state store beside the one you already run. A memory MCP fixes that class of amnesia. The [Model Context Protocol architecture docs](https://modelcontextprotocol.io/docs/concepts/architecture) describe MCP as a standard way to connect hosts to tools and resources. The [MCP site](https://modelcontextprotocol.io/) is the entry point. The reference [knowledge graph memory server](https://github.com/modelcontextprotocol/servers/tree/main/src/memory) shows the pattern: entities, relations, observations, search across sessions.

Codebase-memory builds on that idea for repositories: index symbols and decisions, then require agents to query before planning. I treat it as mandatory on consulting work where product constraints hide in tribal knowledge. Without memory, every chat is a new hire. With memory, every chat inherits the last hard lesson.

## Why chat history is not enough

Thread memory dies with the thread. Even long threads rot: early decisions scroll out, summaries drop the sharp edge, and a new teammate opens a fresh agent with zero recall. Paste-based project briefs drift out of date the day after a rename.

Rules files help, and you should keep them. [Cursor's rules documentation](https://cursor.com/docs/context/rules) covers static guidance the product injects into context. Rules are great for invariants: TypeScript only, no new env vars, theme tokens over hardcoded colors. Rules are poor at accumulating incident history, ADR links, and "we tried X in March and rolled it back." That living layer belongs in memory.

## What MCP memory looks like

Reference memory servers store:

- **Entities:** `BillingService`, `TenantGuard`, `active-theme`
- **Relations:** `BillingService` depends on `TenantGuard`
- **Observations:** "Tenant id must come from session, never from client body" (2026-03-12)

Agents call tools to create, search, and read nodes. On a new task they search first: "tenant isolation", "theme boot", "release checklist". Hits return facts with enough structure to steer the plan before any file opens.

Codebase-oriented servers add indexing: symbol graphs, call edges, hybrid search over code and notes. The exact server can vary. The workflow stays stable: index, recall, act, write back what you learned.

## What to store on day one

Seed memory with high-leverage facts, not encyclopedia entries.

1. **Boot and runtime order.** On this site: define theme and i18n, init state catalog, hydrate, wire controls, paint DOM.
2. **Hard product constraints.** No new infra unless asked. Prefer existing architecture. Tenant isolation rules for multi-tenant apps.
3. **Naming and package boundaries.** Where vendors live, which APIs are public, which folders agents must not invent alternatives for.
4. **Incidents.** Date, symptom, root cause, fix path, follow-up.
5. **Rejected approaches.** "Do not add Redux; we use active-state." Rejection memory prevents helpful rewrites.
6. **Release truths.** Required checks, migration safety notes, who approves production.

Skip storing every CSS tweak. Memory should feel like a senior engineer's notebook, not a changelog dump.

## Workflow: recall before plan

Make this the skill text agents cannot skip:

1. Classify the task: trivial, contextual, or risky.
2. Query memory for the task entities and constraints.
3. Compress live code context ([tip 5](./compress-agent-context-before-you-code.html)).
4. Plan only after recall.
5. After the change, write new observations with dates.
6. Delete or supersede facts the change invalidates.

Trivial typos can skip heavy recall. Contextual and risky work cannot. Production-readiness, auth, billing, and migrations always query memory first.

## Keep the graph honest

Stale memory is a silent production bug. Treat observations as versioned claims:

- Stamp dates on every written fact
- Prefer "superseded by" relations over silent edits when history matters
- Re-index after large moves or package extractions
- Run a monthly memory review the way you review stale feature flags
- Ban secret material: tokens, customer data, private keys never enter memory

When code and memory disagree, believe the code, fix the memory, then continue. Agents should say when memory was empty or irrelevant so humans know the session flew blind.

## Memory versus RAG dumps

Naive RAG fills the prompt with similar chunks. That helps docs search. It fails when you need a precise invariant: "never take tenant id from the client." Graph-shaped memory shines for invariants and relations. Hybrid systems use both: vectors for "how do we format invoices?" and graph nodes for "who owns tenant scope?"

Do not replace tests with memory. Memory guides agents. Tests prove code. CI remains the judge.

## Team rituals that make memory useful

**After incidents.** Write the root cause into memory the same day you write the postmortem.

**After ADRs.** Store a one-paragraph observation plus the ADR path.

**After agent failures.** If an agent reintroduced a banned pattern, add a rejection observation and a rule line.

**During onboarding.** New engineers read the memory hits for their first service area. Same graph the agents use.

**During consulting handoffs.** I leave clients with a seeded memory and a short skill that mandates recall. The engagement keeps paying after I leave.

## Failure modes

**Memory never queried.** Skill text too soft. Make recall a hard gate for contextual and risky tasks. Log tool calls in review if needed.

**Memory becomes a junk drawer.** Add a write policy: only decisions, constraints, incidents, and rejected approaches. No paste of entire files.

**Conflicting observations.** Require search before create. Merge duplicates. Keep the newer dated fact and mark the old one superseded.

**Over-trust.** Agents cite memory and skip reading code. Pair with compression tools that still open the critical symbols. Memory orients. Code decides.

## How this tip connects

Compression keeps the active window small. Memory keeps the project story alive outside the window. Ponytail keeps the diff small once the agent knows what already exists. Next, [research what people said last month](./research-what-people-said-last-month.html) feeds product decisions with external signal, which you can also store as dated observations when the research changes a roadmap bet.

Browse the rest of the series from the [tips index](../../index.html#tips).

## Install outline

1. Choose an MCP memory server your host supports (reference memory or a codebase indexer).
2. Register it in the IDE or agent host config.
3. Index the primary repo.
4. Seed twenty observations from your harshest lessons.
5. Add a skill that mandates recall for contextual and risky work.
6. Teach the team to write back after merges.
7. Schedule a monthly stale-fact sweep.

## Example recall that saves a week

Task: "Add a second theme accent."

Without memory: agent invents a new CSS variable scheme, hardcodes hex in components, skips `defineTheme` colors map, breaks dark mode.

With memory: observation hits "accents go through active-theme colors map; CSS owns surfaces; no hex in app.mjs." Agent opens the theme define call, adds the color entry, updates tokens, leaves components on variables.

Same request. Different institutional memory. Different outcome.

## Metrics

Watch:

- repeat of banned patterns in agent PRs (should fall)
- time from task start to first correct plan
- number of "we already decided this" review comments
- memory write rate after merges (too low means the graph is dying)

When banned-pattern repeats fall, memory is working. When review comments still say "we decided this," agents are not querying or the fact never got written.

## Security and tenancy notes

Multi-tenant products must store isolation rules as first-class entities. Memory that says "filter by tenant" without saying where the tenant id originates is incomplete. Be explicit. For regulated work, keep memory in approved storage, encrypt at rest if your host requires it, and exclude personal data from observations.

## Preflight note for agents

Before editing, agents on this portfolio check memory for theme, i18n, and state-bus rules. That preflight is the difference between a clean PR and a parallel store invented at 11pm. Put the same preflight in your skill text with your own sacred cows named.

## What a good observation looks like

Bad observation: "Auth is important."

Good observation: "2026-04-03: Session tenant id is authoritative. Reject client-supplied tenantId in GraphQL mutations. See `TenantGuard` and ADR-014. Rolled back a March attempt that trusted the body field after a support incident."

Good observations carry a date, an actor rule, a pointer into code or ADR, and a scar. Agents quote scars. They ignore slogans.

Write observations in active voice with a human subject when a decision had an owner: "Platform team banned Redis for session state on 2026-02-11; use Postgres-backed sessions." Ownership helps the next reader know who to ping when the rule must change.

## Index hygiene for monorepos

Index package by package when the monorepo is huge. A billing graph that includes the marketing site creates false neighbors. Name projects clearly in the memory host. After a package extraction, delete the old project entry so agents stop navigating ghost paths.

When two packages share types, store a relation: `billing-ui` imports contracts from `billing-api`. Agents that only search one side invent duplicate DTOs. The relation is cheaper than another week of type drift.

## Handoff packet I leave clients

At the end of an engagement I leave:

1. MCP server config snippet
2. Seeded observations file or export
3. Skill text that mandates recall
4. A one-page "how to re-index" note
5. Three example prompts that demonstrate memory hits

Clients keep the graph alive when the packet is boring and short. Fancy dashboards die. A Markdown note in the repo lives.

## Anti-patterns unique to memory

- Storing entire file contents as observations
- Writing future plans as if they already shipped
- Mixing personal preferences ("I like Zod") with product law ("requests must validate with Zod at the boundary")
- Letting vendors' marketing copy into the graph without a date and a decision
- Skipping deletes after a rewrite so both old and new truths rank

Treat the graph like a production database. Writes need review. Deletes need courage.

## Weekly memory standup (ten minutes)

Every Monday, one engineer asks: what did we learn last week that the next agent must not rediscover? They write two observations, delete one stale fact, and paste the links in Slack. Ten minutes beats a quarterly cleanup project that never starts.

If the standup finds zero new facts three weeks in a row, either the team is not shipping or they are not writing. Both are signals for the engineering manager.

## Prompt snippets that force recall

- "Search memory for tenant isolation before proposing an API shape."
- "List rejected approaches for state management, then reuse the winner."
- "If memory is empty on billing, say empty and stop; do not invent policy."

Paste those into the skill. Agents follow imperative recall better than vague "consider prior art" advice.

## Recruiter and contractor onboarding

Contractors burn billable hours rediscovering constraints that staff engineers already know. On day one, make them run three memory queries for their service area and paste the hits into their kickoff note. That ritual proves the graph works and surfaces gaps while the engagement is young.

## Sources

- [MCP architecture](https://modelcontextprotocol.io/docs/concepts/architecture)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Reference knowledge graph memory server](https://github.com/modelcontextprotocol/servers/tree/main/src/memory)
- [Cursor rules](https://cursor.com/docs/context/rules)
- Related: [Compress agent context before you code](./compress-agent-context-before-you-code.html)
- Series cards on [calvinmaighan.com tips](../../index.html#tips)
 Memory without write-back is a museum. Memory with weekly writes is an operating system for agents.

## FAQ

### What is a codebase-memory MCP server?

It is an MCP server that stores entities, relations, and observations about your repository so agents can query prior decisions and structure across chats instead of relying on one thread's context window.

### How is memory different from Cursor rules?

Rules are static instructions you maintain by hand. Memory accumulates project facts and decisions over time through graph or search tools. Use both: rules for invariants, memory for living context.

### What should we store in memory first?

Boot order, forbidden patterns, naming conventions, tenancy or auth boundaries, and the last three production incidents with root causes. Skip trivia and transient UI tweaks.

### Can memory go stale and hurt agents?

Yes. Require dates on observations, delete superseded facts, and re-index after large refactors. Stale memory is worse than no memory when it contradicts the code.
