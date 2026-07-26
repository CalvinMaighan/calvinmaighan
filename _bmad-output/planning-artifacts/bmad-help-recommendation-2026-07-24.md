# BMad Help Recommendation — calvinmaighan tip series

**Date:** 2026-07-24  
**Module:** BMad Method (BMM)  
**Project type:** Existing brownfield portfolio site (`feat/tip-series`)  
**Planning artifacts before this run:** none under `_bmad-output/planning-artifacts`

## Where we are

- Site and tip series already exist (intro + 14 tips rendered from `site/tips/_drafts`).
- Recent ship work polished skills 1–7 (covers, rail chrome, prose).
- Skills 8–14 still reuse placeholder cover `calvin-article-2.png`.
- No product brief, PRD, architecture, or epics/stories artifacts yet.
- Task source of truth is Backlog.md (ClickUp sync exists).

## Optional (do anytime)

- `[GPC]` **Generate Project Context** — `bmad-generate-project-context`  
  Useful later for LLM-optimized brownfield context. Not blocking tip ship.
- `[DP]` **Document Project** — `bmad-document-project`  
  Optional deeper docs. Skip for now; series mechanics already live in-repo.

## Next recommended planning step (optional analysis → right-sized plan)

- `[CB]` **Create Brief** — `bmad-product-brief`  
  Best fit for this project size: content/series ship plan on an existing site, not a greenfield product.

## Next required step on the full BMM track (deferred)

- `[PRD]` **Create PRD** — `bmad-prd` (`required=true` in catalog)  
  Defer until the tip series needs product-scope changes beyond article polish (new site surfaces, unlock monetization, major UX rebuild). For sequential tip shipping, a brief + Backlog tasks is enough.

## Not recommended next

- Full architecture / epics / implementation-readiness cycle — overkill while the delivery unit is one tip PR at a time.
- Market/domain research modules — SERP notes already exist in `site/tips/_research/serp-notes.md`.

## Decision for TASK-2

Run **Create Brief** now (headless, right-sized). Capture next 1–3 PR-sized Backlog tasks from the brief. Resume full BMM at PRD only if scope expands.
