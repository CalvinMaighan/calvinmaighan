---
title: "Expose product actions as MCP tools"
primaryKeyword: "expose product actions as MCP tools"
intent: howto
slug: expose-product-actions-as-mcp-tools
metaDescription: "expose product actions as MCP tools so agents can do real jobs in your product with schemas, scopes, and audit trails instead of chatting next to a dead UI."
canonical: https://calvinmaighan.com/tips/secret-agent-tips/expose-product-actions-as-mcp-tools.html
updatedAt: 2026-07-22
updatedHuman: July 22, 2026
summary: "expose product actions as MCP tools when a chat wrapper that cannot act has become your roadmap. On Deedee I design a capability registry: named tools, schemas, scopes, and audit metadata. MCP is the transport. Start with read tools. Add writes only with confirmations and least privilege. Name capabilities like jobs, the same way you name skills."
standalone: false
kicker: "Tip 11 of 14"
series: "14 secret agent tips for product teams"
nextHref: "./catch-ai-code-mistakes-with-lint.html"
nextLabel: "Next article"
nextLocked: "true"
ctaAboveFold: "Book a call"
ctaEnd: "If you want an MCP surface designed for your product"
inBodyImageAlt: "Cover art for exposing product actions as MCP tools"
out: site/tips/secret-agent-tips/expose-product-actions-as-mcp-tools.html
---

expose product actions as MCP tools if your "AI feature" is a text box that cannot touch the product. Chat without capabilities is a demo. Customers clap once. Then they ask it to do something and the spell breaks.

[Model Context Protocol](https://modelcontextprotocol.io/) is how external agents call tools with structure. See the [MCP specification repo](https://github.com/modelcontextprotocol/modelcontextprotocol) and [Cursor MCP docs](https://cursor.com/docs/context/mcp). On Deedee, internal chat tools and external MCP share a capability registry so the surfaces do not drift.

## Design the registry, not the novelty

Each capability gets a job-shaped name, an input schema, scopes, and audit metadata. `files.search_extracted_text` beats `doStuff`. The naming lesson from skills applies here. Agents and security reviewers both scan under pressure.

Start with read tools. List, get, search, summarize. Add mutating tools only with confirmations, idempotency your domain understands, and logs you can support at 2am.

## Guardrails are the product

Auth, least privilege, response shaping, and allowlists are not polish. Fancy tools without OAuth are a breach with a longer README. Do not expose raw GraphQL to the open internet through an agent without a safe boundary. Deedee keeps query-safe style limits for a reason.

Document scopes for customers. Enterprise buyers ask what an agent key can touch before they enable it. If you cannot answer, you are not ready to sell the key.

## Test tools like APIs

Contract tests on input schema and auth beat vibe checks in a single chat. Meter usage like an API: keys, scopes, credits that match compute reality. Pricing fantasy dies in the first heavy tenant.

## Rollout I sell

Map the top twenty user jobs to capabilities. Ship five read tools. Instrument them. Expand. If your roadmap is only a chatbot UI, you are behind teams shipping tool surfaces that show up in Cursor, Claude, and whatever clients come next.

Logging turns agent actions into supportable events. Without audit trails you cannot debug a customer incident that an agent caused while sounding helpful.

## A concrete first five tools

For a document product like Deedee, a sane first wave looks like:

- workspace.get_current_context
- files.list_uploaded
- files.get_file
- files.search_extracted_text
- documents.summarize

Notice the verbs. A buyer can read the list and know the blast radius. Compare that to `assistant_magic` and `run_pipeline`. Security review ends faster when names tell the truth.

## External versus internal agents

Internal chat can share the registry with external MCP, but scopes should still differ. A staff user in the app is not the same as a customer-issued agent key. Shape responses for external callers so you do not leak admin fields into a partner model.

Deep links back into the product help when a tool result needs a human click. Return URLs your UI already understands. Do not invent deep links the router cannot open.

## Failure modes

Wrapping REST with vague names and hoping MCP magic fixes product sense. It will not.

Shipping write tools on day one because demos look cooler. Read-only earns trust.

Skipping tests because "the model will be careful." Models are not your SOC2 control.

Building thirty tools nobody monitors. Unused tools still expand attack surface.

## How I brief a client

I ask for the ten jobs support already does by hand in the product. We map each job to a capability name, a read or write classification, and a scope. Then we cut the list to five. Ambition after instrumentation beats a graveyard of unused tools.

Demo scripts use the same tool names the customer will see in their agent client. If the demo needs a secret admin tool, the demo is lying about the product surface.

## Ops after launch

Watch tool error rates, auth failures, and p95 latency per capability. A tool that fails quietly trains agents to invent workarounds. Page the owner when a write tool errors above baseline.

Version schemas deliberately. Breaking a required field is a SemVer moment for your agent API even if humans never see a changelog.

## Auth patterns that survive review

Issue agent keys with explicit scopes, expiry, and a human owner. Rotate on staff changes. Log every tool call with key id, capability name, and tenant. When a customer asks "what did the agent do?", you answer from logs, not from memory.

OAuth for MCP clients is worth the setup when partners bring their own agents. Shared static keys feel easy until one leaks in a screenshot.

## What I put in the security review packet

- Capability list with read/write labels
- Scope matrix by key type
- Sample tool request and response for each write
- Rate limits and credit model
- Incident playbook for a runaway agent

If that packet is empty, you are not selling MCP. You are selling hope.

## Why this belongs on a consulting portfolio

Deedee is the proof that product work and agent work are the same design problem: name the job, bound the power, log the action. When I help a team ship MCP, I am not sprinkling AI on a roadmap. I am exposing the product's real verbs to machines that will call them at scale. That is architecture. Treat it that way.

If your only AI plan is a chat panel that summarizes help center articles, you can ship that without MCP. If you want agents to operate the product, build the registry.

## Sources

- [Model Context Protocol](https://modelcontextprotocol.io/)
- [MCP specification repo](https://github.com/modelcontextprotocol/modelcontextprotocol)
- [Cursor MCP documentation](https://cursor.com/docs/context/mcp)
- Related: [Name AI agent skills after the job](../name-ai-agent-skills-after-the-job.html)
- Series: [tips on calvinmaighan.com](../../index.html#tips)

## FAQ

### Is MCP only for IDEs?

No. Any client that speaks MCP can call your tools. IDEs are early adopters.

### How do I price agent access?

Meter like an API. Keys, scopes, and credit costs should match compute reality.

### What about write actions?

Require explicit confirmation, narrow scopes, and audit logs. Start read-only when unsure.

### Can I wrap existing REST?

Yes. Still present job-shaped names and stable schemas.
