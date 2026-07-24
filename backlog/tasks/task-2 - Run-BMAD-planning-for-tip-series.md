---
id: TASK-2
title: Run BMAD planning for tip series
status: In Progress
assignee:
  - '@calvin'
created_date: '2026-07-24 16:59'
updated_date: '2026-07-24 18:02'
labels: []
dependencies: []
references:
  - 'https://app.clickup.com/t/86bb348t3'
ordinal: 2000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Use BMAD Method (bmad-help → planning workflows) to produce a concrete plan for the calvinmaighan tip series and site work. Planning artifacts land in _bmad-output/planning-artifacts. Keep Backlog.md as task source of truth; sync to ClickUp after plan yields epics/stories.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 bmad-help recommends the next planning step for this existing portfolio site
- [ ] #2 Planning artifact(s) exist under _bmad-output/planning-artifacts (brief and/or PRD-scale plan appropriate to project size)
- [ ] #3 Plan names next 1-3 PR-sized Backlog tasks for tip series (starting with tip 8 stop-slop if still the product priority)
- [ ] #4 ClickUp sync run after new tasks exist (bun run clickup:sync) or explicitly deferred
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Run bmad-help against catalog + empty planning-artifacts: recommend next planning step for this brownfield portfolio tip series.
2. Right-size planning: produce a product brief (not full PRD) under _bmad-output/planning-artifacts/briefs/ for the tip series ship plan.
3. From the brief, create 1-3 PR-sized Backlog tasks starting with tip 8 stop-slop (cover + polish), then tip 9 and tip 10 if still next.
4. Run bun run clickup:sync after new tasks exist, or document explicit deferral if sync cannot run.
5. Leave TASK-2 In Progress for /backlog done verification of ACs with evidence.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Preflight: codebase-memory-mcp and lean-ctx MCP unavailable in session; used lean-ctx CLI + repo inspection. Classification: contextual (BMAD planning + backlog task creation).

Implemented planning slice:
- bmad-help recommendation written to _bmad-output/planning-artifacts/bmad-help-recommendation-2026-07-24.md (next: Create Brief; defer PRD).
- Product brief + addendum + memlog at _bmad-output/planning-artifacts/briefs/brief-calvinmaighan-2026-07-24/.
- Created TASK-3 (tip 8 stop-slop), TASK-4 (tip 9 hallmark, dep TASK-3), TASK-5 (tip 10 HyperFrames, dep TASK-4).
- ClickUp sync succeeded: created ClickUp tasks for TASK-3/4/5; updated TASK-2.
Ready for /backlog done: verify ACs with evidence (artifact paths, task IDs, sync log) then check-ac + Done.
<!-- SECTION:NOTES:END -->
