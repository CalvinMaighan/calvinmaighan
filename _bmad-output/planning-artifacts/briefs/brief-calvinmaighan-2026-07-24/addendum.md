# Addendum — tip series planning detail

## Current cover inventory (2026-07-24)

| Tip | Slug | Cover |
|-----|------|-------|
| 1 | read-dependency-source-code-with-opensrc | calvin-article-1.png |
| 2 | scrape-websites-for-ai-agent-research | calvin-article-2.png (shared placeholder) |
| 3 | cut-ai-agent-tokens-with-caveman | calvin-article-3.png |
| 4 | keep-ai-coding-changes-minimal-with-ponytail | calvin-article-4.png |
| 5 | compress-agent-context-before-you-code | calvin-article-5.png |
| 6 | persist-codebase-knowledge-across-ai-chats | calvin-article-6.png |
| 7 | research-what-people-said-last-month | calvin-article-7.png |
| 8–14 | (remaining) | calvin-article-2.png (shared placeholder) |

Tip 2 still shares the placeholder; out of scope for the next three tasks unless product priority changes. Priority stays tip 8 → 9 → 10 to continue the forward ship cadence after skills 4–7.

## Implementation constraints (parked for workers)

- Source of tip bodies: `site/tips/_drafts/*.md`
- Series order: `site/tip-series.mjs`
- Rebuild: `bun run tips:build`
- SERP / keyword lock: `site/tips/_research/serp-notes.md` (tip 8 primaryKeyword: remove AI writing tells from prose)
- Do not invent new pipeline; edit draft → build → review

## Rejected alternative

Full PRD + architecture + epics for the tip series — rejected as over-scoped for brownfield content polish. Revisit if unlock monetization or multi-surface product work starts.
