---
id: TASK-1
title: ClickUp sync smoke test
status: In Progress
assignee:
  - '@calvin'
created_date: '2026-07-24 16:55'
updated_date: '2026-07-24 17:05'
labels: []
dependencies: []
references:
  - 'https://app.clickup.com/t/86bb346mp'
ordinal: 1000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Temporary task to validate ClickUp bridge.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Appears in ClickUp after sync
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Confirm sync script + map exist (scripts/backlog-clickup-sync.mjs, backlog/clickup-map.json).
2. GET ClickUp task 86bb346mp with CLICKUP_API_KEY; confirm name/status/url.
3. Confirm Backlog TASK-1 has ClickUp reference URL.
4. Note evidence; hand off to /backlog done TASK-1 for AC check + Done.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Verified remote ClickUp task 86bb346mp exists (name [TASK-1] ClickUp sync smoke test, status to do). Map + Backlog ref present. Ready for finalization.
<!-- SECTION:NOTES:END -->
