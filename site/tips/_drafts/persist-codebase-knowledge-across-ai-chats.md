---
title: "Persist codebase knowledge across AI chats"
primaryKeyword: "persist codebase knowledge across AI chats"
intent: howto
slug: persist-codebase-knowledge-across-ai-chats
metaDescription: "persist codebase knowledge across AI chats with a codebase-memory MCP so agents recall architecture decisions, naming rules, and prior fixes instead of rediscovering your repo every session."
canonical: https://calvinmaighan.com/tips/secret-agent-tips/persist-codebase-knowledge-across-ai-chats.html
inBodyImage: "../../calvin-article-6.png"
ogImage: "https://calvinmaighan.com/calvin-article-6.png"
updatedAt: 2026-07-26
updatedHuman: July 26, 2026
summary: "Persist codebase knowledge across AI chats by attaching a codebase-memory MCP server that stores architecture decisions, naming rules, and prior fixes as queryable entities. New threads start with recall instead of rediscovery. You cut repeated mistakes, keep conventions stable, and give agents a project memory that survives a closed tab."
standalone: false
kicker: ""
series: ""
nextHref: "./research-what-people-said-last-month.html"
nextLabel: "Next article"
nextLocked: "true"
ctaAboveFold: "Book a call"
ctaEnd: "Want codebase-memory MCP wired into your team workflow"
inBodyImageAlt: "Cover for tip 6: persist codebase knowledge across AI chats"
out: site/tips/secret-agent-tips/persist-codebase-knowledge-across-ai-chats.html
---

Persist codebase knowledge across AI chats or repeat the same argument every Monday. Your senior engineer spent forty minutes on Thursday explaining the boot order, the state bus, and why the team rejected a second store. Friday's agent session opens a blank window and proposes exactly that second store. Nobody wrote the lesson anywhere a machine can read.

A codebase-memory MCP server fixes that class of amnesia. The [MCP architecture docs](https://modelcontextprotocol.io/docs/concepts/architecture) describe a standard way to connect hosts to tools and resources, and the reference [knowledge graph memory server](https://github.com/modelcontextprotocol/servers/tree/main/src/memory) shows the shape: entities, relations, observations, search across sessions. Codebase-memory applies that to a repository by indexing symbols alongside decisions.

I treat it as mandatory on consulting work, because product constraints hide in tribal knowledge. Without memory, every chat is a new hire. With memory, every chat inherits the last hard lesson.

## Why chat history falls short

Thread memory dies with the thread. Long threads rot on their own: early decisions scroll out of the window, summaries file down the sharp edges, and the next teammate opens a fresh agent with zero recall. Pasted project briefs go stale the day after a rename.

Rules files help, and you should keep them. [Cursor's rules documentation](https://cursor.com/docs/context/rules) covers the static guidance a product injects into context, which suits invariants: TypeScript only, no new environment variables, theme tokens over hardcoded colors. Rules handle poorly the accumulating history, the ADR links, and the "we tried this in March and rolled it back." That living layer belongs in memory.

## What memory stores

- **Entities** such as `BillingService`, `TenantGuard`, `active-theme`
- **Relations** such as `BillingService` depends on `TenantGuard`
- **Observations** such as "Tenant id comes from the session, never the client body" with a date

Agents call tools to create, search, and read nodes. On a new task they search first for "tenant isolation" or "theme boot" or "release checklist", and the hits steer the plan before any file opens. Codebase-oriented servers add symbol graphs, call edges, and hybrid search over code and notes. Servers differ. The workflow holds: index, recall, act, write back.

## Seed twenty facts, not an encyclopedia

1. **Boot and runtime order.** On this site: define theme and i18n, init the state catalog, hydrate, wire controls, paint the DOM.
2. **Hard product constraints.** No new infrastructure unless asked. Prefer existing architecture. Tenant isolation rules on multi-tenant apps.
3. **Naming and package boundaries.** Where vendored libraries live, which APIs are public, which folders agents must leave alone.
4. **Incidents.** Date, symptom, root cause, fix, follow-up.
5. **Rejected approaches.** "Do not add Redux, we use active-state." Rejection memory stops helpful rewrites.
6. **Release truths.** Required checks, migration safety notes, who approves production.

Skip the CSS tweaks. Memory should read like a senior engineer's notebook.

## Recall before plan

Put this sequence in the skill body where agents cannot route around it:

1. Classify the task as trivial, contextual, or risky.
2. Query memory for the entities and constraints involved.
3. Compress the live code context per [tip 5](./compress-agent-context-before-you-code.html).
4. Plan after recall, never before.
5. Write new observations with dates once the change lands.
6. Supersede the facts the change invalidated.

A typo fix can skip heavy recall. Anything touching auth, billing, migrations, or production readiness queries memory first.

## Keep the graph honest

Stale memory is a silent production bug. Stamp a date on every written fact. Prefer a "superseded by" relation over a silent edit when the history matters. Re-index after large moves or package extractions. Review memory monthly, the same way you review stale feature flags. Never let tokens, customer data, or private keys enter the graph.

When code and memory disagree, believe the code, fix the memory, then continue. Agents should also say out loud when memory came back empty, so humans know the session flew blind.

## What a good observation looks like

A weak one reads "Auth is important."

A strong one reads: "2026-04-03: Session tenant id is authoritative. Reject client-supplied `tenantId` in GraphQL mutations. See `TenantGuard` and ADR-014. A March attempt trusted the body field and caused a support incident."

Good observations carry a date, an actor rule, a pointer into code, and a scar. Agents follow scars and ignore slogans.

## One request, two outcomes

"Add a second theme accent." Without memory the agent invents a new CSS variable scheme, hardcodes hex values in components, skips the `defineTheme` colors map, and breaks dark mode. With memory the search returns "accents go through the active-theme colors map, CSS owns surfaces, no hex in `app.mjs`", so the agent adds the color entry, updates tokens, and leaves components on variables.

Same request, same repository, and one of the two costs you a week.

## Rituals that keep it alive

Write the root cause into memory the same day you write the postmortem. Store a one-paragraph observation with every ADR you merge. When an agent reintroduces a banned pattern, add a rejection observation and a rule line together. Point new engineers at the memory hits for their first service area, since they benefit from the same graph the agents use.

On consulting handoffs I leave a seeded memory and a short skill that mandates recall, which keeps paying after the engagement ends.

## Ship the habit this week

Register a memory MCP server, index the primary repo, and seed twenty observations from your harshest lessons. Add the recall step to one skill and watch the next contextual task.

Compression keeps the active window small. Memory keeps the project story alive outside it. Tip 7 covers the outside signal, where you [research what people said last month](./research-what-people-said-last-month.html) and store the findings as dated observations when they change a roadmap bet.

If you want this wired into your team workflow, [book a call](../../contact.html). More notes live in the [tips index](../../index.html#tips).

## Sources

- [MCP architecture](https://modelcontextprotocol.io/docs/concepts/architecture)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Reference knowledge graph memory server](https://github.com/modelcontextprotocol/servers/tree/main/src/memory)
- [Cursor rules](https://cursor.com/docs/context/rules)

## FAQ

### What is a codebase-memory MCP server?

An MCP server that stores entities, relations, and observations about your repository so agents query prior decisions across chats instead of relying on one thread's window.

### How is memory different from Cursor rules?

Rules are static instructions you maintain by hand. Memory accumulates project facts over time through graph or search tools. Keep rules for invariants and memory for living context.

### What should we store first?

Boot order, forbidden patterns, naming conventions, tenancy and auth boundaries, and the last three production incidents with root causes.

### Can memory go stale and hurt agents?

Yes. Require dates, supersede old facts, and re-index after large refactors. Stale memory beats no memory only until it contradicts the code.

### How do I install it on day one?

Register the MCP server in your IDE config, index the primary repo, seed twenty observations, and add a skill that mandates recall for contextual and risky work.
