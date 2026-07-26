---
title: Secret Agent Tips series — ship brief
status: ready
created: 2026-07-24
updated: 2026-07-24
project: calvinmaighan
---

# Product Brief: Secret Agent Tips series

## Executive Summary

calvinmaighan.com already hosts a 14-skill tip series for product owners and engineers who want practical AI-agent workflows. The series intro plus tips 1–14 render from markdown drafts; the unlockable series rail and build pipeline are in place. Near-term work is not “invent the product” — it is finish publishing quality tip by tip, matching the polish already applied to skills 1–7.

The next product priority remains **tip 8 (stop-slop)**: *Remove AI writing tells from prose*. It still uses the shared placeholder cover (`calvin-article-2.png`) and needs the same cover + prose pass pattern used on earlier skills. Tips 9–10 follow in the same cadence so the second half of the series does not look unfinished next to the first half.

## The Problem

Readers unlocking the series hit a quality cliff after skill 7: later tips re-use generic cover art and have not received the same rewrite/chrome pass. That undercuts trust in a series whose thesis is “agents that ship clean work.” Internally, without a right-sized plan and Backlog tasks, agents either overbuild (full BMM PRD/architecture) or drift across tips in one oversized PR.

## The Solution

Ship one PR-sized tip at a time using the existing pipeline:

1. Edit the draft in `site/tips/_drafts/<slug>.md`
2. Add a dedicated cover asset and wire `inBodyImage` / `ogImage`
3. Run stop-slop / human voice pass on the draft
4. `bun run tips:build` to regenerate HTML + sitemap
5. Visual check of article page + series rail

Track each tip as a Backlog.md task; sync to ClickUp after create.

## What Makes This Different

This is a brownfield content series on a personal consulting site, not a greenfield SaaS. Differentiator is craft: named skills (opensrc, caveman, ponytail, lean-ctx, stop-slop, hallmark, …), citable sources, and agent-usable checklists. Moat is execution consistency, not new infrastructure.

## Who This Serves

- **Primary:** Product owners and eng leads evaluating which agent skills to standardize on a team.
- **Secondary:** Practitioners copying one skill into their own Cursor/Claude setup.

Success for them: finish a tip, install or adapt the skill, and trust the writing voice enough to share it.

## Success Criteria

- Tip 8 has a unique cover and a stop-slop-clean draft rebuilt to HTML.
- Tips 9 and 10 follow with the same bar (cover + voice + rebuild).
- Backlog remains source of truth; ClickUp mirrors new tasks after sync.
- No new infra or env vars; reuse `tips:build`, `site/tip-series.mjs`, existing themes.

## Scope

**In (near-term):**

- Tip 8 stop-slop polish + cover
- Tip 9 hallmark (landing-page anti-slop) polish + cover
- Tip 10 HyperFrames polish + cover
- Planning brief + Backlog tasks for the above

**Out (for now):**

- Full BMM PRD / architecture / epic cascade
- Redesign of unlock UX or monetization
- Regenerating tips 1–7 covers already shipped
- New tip topics beyond the locked 14

## Vision

A complete, consistently polished 14-skill series that product owners can hand to engineering as a shared agent-skills map — each tip a self-contained installable habit with human voice and distinct visual identity.

## Next Backlog tasks (PR-sized)

1. **Ship tip 8 stop-slop polish** — unique cover (`calvin-article-8.png`), draft voice pass, rebuild HTML.
2. **Ship tip 9 hallmark polish** — unique cover + draft/HTML pass for design-landing-pages-without-ai-slop.
3. **Ship tip 10 HyperFrames polish** — unique cover + draft/HTML pass for build-product-videos-with-hyperframes.

## BMad routing note

`bmad-help` recommendation for this site: run **Create Brief** (done here). Defer required **PRD** until scope expands beyond sequential tip shipping. See `../bmad-help-recommendation-2026-07-24.md`.
