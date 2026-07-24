---
name: backlog-funnel
description: >
  calvinmaighan Draft→Brief→Ready→To Do→In Progress→Done funnel and ClickUp
  sync. Use when planning BMAD briefs, promoting tasks, or explaining
  Backlog↔ClickUp. Agents must NOT run promote commands.
disable-model-invocation: false
---

# Backlog ↔ ClickUp funnel (calvinmaighan)

## HARD GUARD — agents must not promote

**Never** run these unless the human explicitly pastes the command **and** sets the env gate:

- `bun run backlog:ready …`
- `bun run clickup:todo`

Both scripts **exit unless** `BACKLOG_ALLOW_PROMOTE=1`.

Do **not** invent workarounds (`backlog task edit -s Ready`, `-s "To Do"`, editing `brief:` frontmatter to unlock sync, calling sync to force-create from Ready).

If promotion is needed: tell the human the exact command to run. Stop.

Allowed for agents (execution only, after ClickUp **Work**):

- `backlog task view|edit` for plan/notes/AC checks (not Done)
- `bun run clickup:sync` / `--pull` when updating already-synced execution statuses
- Implement code; leave **Done** to the human

## Status funnel

`Draft` → `Brief` → `Ready` → `To Do` → `In Progress` → `Done`

| Stage | Who | Notes |
| --- | --- | --- |
| Draft | agent or human | default for new tasks |
| Brief | agent or human | write artifact under `_bmad-output/` |
| Ready | **human only** | `BACKLOG_ALLOW_PROMOTE=1 bun run backlog:ready -- TASK-N --brief _bmad-output/.../brief.md` |
| To Do | **human only** | `BACKLOG_ALLOW_PROMOTE=1 bun run clickup:todo` moves all Ready → To Do + ClickUp sync |
| Work | **human only** | ClickUp drag to do → Work (no Backlog Work column) |
| In Progress | webhook/agent | set on Work trigger |
| Done | **human via ClickUp** | after AC evidence → drag ClickUp **complete** → webhook sets Backlog Done |

## Brief required

Ready is blocked without a real file under `_bmad-output/`. Path stored on task as frontmatter `brief:`.

## Agent kick

Only ClickUp status **Work** starts the Cursor webhook agent. Sitting on Work while webhook is down is OK.

## Git worktrees

Webhook runs each agent in `.worktrees/<TASK-N>` on branch `clickup/<TASK-N>` so the human's primary checkout (e.g. `main`) is untouched. Agents: commit on that branch; optional `git push -u origin HEAD` for the feature branch only; never merge/push `main`. Human: PR then Done.

## Related

- Personal `/backlog` skill for create/work/done CLI patterns
- BMAD skills for brief/PRD content — still do not promote statuses
