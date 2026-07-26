---
id: TASK-3
title: Ship tip 8 stop-slop polish
status: To Do
assignee: []
created_date: '2026-07-24 18:02'
updated_date: '2026-07-24 18:02'
labels: []
dependencies: []
references:
  - 'https://app.clickup.com/t/86bb35n89'
ordinal: 3000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Polish tip 8 (remove-ai-writing-tells-from-prose / stop-slop) to match skills 1–7 publish quality. Add a unique cover (calvin-article-8.png), wire inBodyImage/ogImage in the draft, run a stop-slop voice pass, then bun run tips:build and visually check the article + series rail.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Draft site/tips/_drafts/remove-ai-writing-tells-from-prose.md uses a unique cover asset (not shared calvin-article-2.png)
- [ ] #2 HTML rebuilt via bun run tips:build and tip 8 page shows the new cover
- [ ] #3 Prose passes a stop-slop/human-voice read (no keynote cadence in summary/lede)
<!-- AC:END -->
