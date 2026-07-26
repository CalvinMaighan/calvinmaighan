---
name: backlog-ready
description: >
  Human-only: promote a calvinmaighan Backlog task to Ready after a BMAD brief
  exists. Agents must refuse to run this; show the command instead.
disable-model-invocation: true
---

# backlog:ready (human-only)

## Guard

Agents: **do not run**. Print the command for the human. Scripts require `BACKLOG_ALLOW_PROMOTE=1`.

## Command

```bash
BACKLOG_ALLOW_PROMOTE=1 bun run backlog:ready -- TASK-N --brief _bmad-output/path/to/brief.md
```

Brief path must exist under `_bmad-output/`. Sets frontmatter `brief:` and status `Ready`.
