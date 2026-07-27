---
title: "Expose product actions as MCP tools"
primaryKeyword: "expose product actions as MCP tools"
intent: howto
slug: expose-product-actions-as-mcp-tools
metaDescription: "expose product actions as MCP tools so agents can do real jobs in your product with schemas, scopes, and audit trails instead of chatting next to a dead UI."
canonical: https://calvinmaighan.com/tips/secret-agent-tips/expose-product-actions-as-mcp-tools.html
inBodyImage: "../../calvin-article-14.png"
ogImage: "https://calvinmaighan.com/calvin-article-14.png"
updatedAt: 2026-07-26
updatedHuman: July 26, 2026
summary: "Expose product actions as MCP tools when a chat wrapper that cannot act has become your roadmap. On Deedee I design a capability registry: named tools, input schemas, scopes, and audit metadata, with MCP as the transport. Start with read tools, add writes behind confirmations and least privilege, and name every capability after the job it performs. The registry is the product decision. The protocol is plumbing."
standalone: false
kicker: ""
series: ""
nextHref: "../../contact.html"
nextLabel: "Book a call"
nextLocked: "false"
ctaAboveFold: "Book a call"
ctaEnd: "Last tip in the series. Ready to install agent skills for product and code"
inBodyImageAlt: "Cover for tip 14: expose product actions as MCP tools"
out: site/tips/secret-agent-tips/expose-product-actions-as-mcp-tools.html
---

Expose product actions as MCP tools when your AI feature is a text box that cannot touch the product. You shipped the chat panel. Customers tried it, asked it to do the one thing they came for, and got a paragraph explaining how they could do it themselves. The demo landed. The retention did not.

[Model Context Protocol](https://modelcontextprotocol.io/) gives external agents a structured way to call your tools. The [specification repo](https://github.com/modelcontextprotocol/modelcontextprotocol) and the [Cursor MCP docs](https://cursor.com/docs/context/mcp) cover the transport. On Deedee, the internal chat tools and the external MCP surface share one capability registry so the two never drift apart.

This closes the series. The first thirteen skills help an agent prepare work: research, reading, writing, design, video, lint, release, cleanup. This one lets the agent do work inside the product your customers pay for.

## Design the registry

Every capability gets a job-shaped name, an input schema, scopes, and audit metadata. `files.search_extracted_text` beats `doStuff`. Both an agent and a security reviewer scan that list under pressure, and honest names shorten the review.

Start with read tools: list, get, search, summarize. Add mutating tools once you have confirmations, an idempotency story your domain understands, and logs someone can actually read at 2am.

For a document product, a defensible first wave looks like this:

- `workspace.get_current_context`
- `files.list_uploaded`
- `files.get_file`
- `files.search_extracted_text`
- `documents.summarize`

A buyer reads that list and knows the blast radius before they enable the key.

## Guardrails ship with the tools

Auth, least privilege, response shaping, and allowlists belong in the first release. A capable tool without OAuth is a breach with a longer README. Never hand an agent raw GraphQL against the open internet without a safe boundary, which is why Deedee keeps query-safe limits on the external surface.

Document the scopes for customers. Enterprise buyers ask what an agent key can reach before they turn it on, and a team that cannot answer is not ready to sell the key.

Test the tools like APIs. Contract tests on input schema and auth catch more than a vibe check in one chat session. Meter usage like an API too: keys, scopes, and credits that track compute reality, because a pricing fantasy dies inside the first heavy tenant.

## Internal and external are different callers

Internal chat can share the registry, and the scopes should still differ. A staff user inside the app is not a customer-issued agent key. Shape responses for external callers so admin fields never reach a partner's model.

Return deep links your UI already understands when a tool result needs a human click. That single detail turns a tool response into a workflow.

## Failure modes

Wrapping REST endpoints with vague names and hoping the protocol supplies product sense.

Shipping write tools on day one because the demo looks better. Read-only earns the trust that write access spends.

Skipping tests because the model will be careful. A model is not a security control.

Building thirty tools nobody monitors. Unused capabilities still widen the attack surface, so pair this with tip 13 on [finding dead code with fallow](./find-dead-code-with-fallow.html) and keep zombie tools out of the codebase too.

## How I brief a client

I ask for the ten jobs support already performs by hand inside the product. We map each to a capability name, a read or write classification, and a scope. Then we cut the list to five. Ambition after instrumentation beats a graveyard of unused tools.

Demo scripts use the same tool names the customer will see in their agent client. A demo that needs a secret admin tool is lying about the product surface.

## Operate it after launch

Watch tool error rates, auth failures, and p95 latency per capability. A tool that fails quietly trains agents to invent workarounds, so page the owner when a write tool errors above baseline.

Version schemas deliberately. Breaking a required field is a major version moment for your agent API even when no human reads a changelog.

Issue agent keys with explicit scopes, an expiry, and a named human owner. Rotate on staff changes. Log every call with the key id, capability name, and tenant, so you can answer "what did the agent do" from logs rather than from memory. OAuth for MCP clients earns its setup cost the moment partners bring their own agents, and a shared static key stays easy until it appears in a screenshot.

## The security packet buyers ask for

- The capability list with read and write labels
- A scope matrix by key type
- A sample request and response for every write tool
- Rate limits and the credit model
- An incident playbook for a runaway agent

An empty packet means you are selling hope rather than MCP.

## Ship the habit this week

List the ten manual jobs, cut to five, and implement the read tools first with scopes and logging attached. Put the demo on the same names your customers will see.

Naming the job, bounding the power, and logging the action is the same discipline the earlier tips applied to editors. A chat panel that summarizes help center articles needs none of this. Agents that operate your product need all of it.

If you want agent skills installed for both the product and the code, [book a call](../../contact.html). The rest of the series lives in the [tips index](../../index.html#tips).

## Sources

- [Model Context Protocol](https://modelcontextprotocol.io/)
- [MCP specification repo](https://github.com/modelcontextprotocol/modelcontextprotocol)
- [Cursor MCP documentation](https://cursor.com/docs/context/mcp)

## FAQ

### Is MCP only for IDEs?

No. Any client that speaks the protocol can call your tools. IDEs were the early adopters.

### How do I price agent access?

Meter it like an API, with keys, scopes, and credit costs that match what the compute actually costs you.

### What about write actions?

Require explicit confirmation, narrow scopes, and audit logs. Start read-only whenever the answer is unclear.

### Can I wrap existing REST endpoints?

Yes, and still present job-shaped names with stable schemas rather than a mirror of your URL structure.

### Where do I start after this series?

Unlock tip 1 for engineering, install one research habit this week, then map five product verbs for a registry once the editor skills stick.
