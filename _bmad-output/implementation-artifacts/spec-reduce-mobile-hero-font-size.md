---
title: 'Reduce mobile hero font size'
type: 'feature'
created: '2026-08-06'
status: 'done'
route: 'one-shot'
---

# Reduce mobile hero font size

## Intent

**Problem:** The 76px homepage hero headline is oversized on screens 600px wide and below.

**Approach:** Add a homepage-only mobile breakpoint that scales the headline from the existing 48px heading token to a 64px cap, leaving wider screens unchanged, then regenerate the deployable CSS bundle.

## Suggested Review Order

- Scope the fluid headline reduction to mobile screens at 600px and below.
  [`styles.css:597`](../../site/styles.css#L597)

- Confirm the generated deployable stylesheet contains the same breakpoint.
  [`site.css:964`](../../site/site.css#L964)
