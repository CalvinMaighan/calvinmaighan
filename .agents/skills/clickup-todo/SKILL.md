---
name: clickup-todo
description: >
  Human-only: promote all Ready calvinmaighan tasks to To Do and sync to
  ClickUp. Agents must refuse to run this; show the command instead.
disable-model-invocation: true
---

# clickup:todo (human-only)

## Guard

Agents: **do not run**. Print the command for the human. Scripts require `BACKLOG_ALLOW_PROMOTE=1`.

## Command

```bash
BACKLOG_ALLOW_PROMOTE=1 bun run clickup:todo
```

Dry-run:

```bash
BACKLOG_ALLOW_PROMOTE=1 bun run clickup:todo -- --dry-run
```

Moves Ready → To Do (only if `brief:` valid), then `clickup:sync`. Draft/Brief never sync.
